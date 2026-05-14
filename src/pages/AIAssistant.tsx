import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, FileText, Globe, Zap, Trash2, Info, Loader2, AlertCircle, Key, CheckCircle2, XCircle, Edit3, ChevronRight, FileUp, Shield, Rocket, ArrowUpRight, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import FileUpload from '../components/FileUpload';
import TenderAnalysisResults, { AnalysisResult } from '../components/TenderAnalysisResults';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../context/LanguageContext';
import { AIService } from '../services/aiService';
import { extractTextFromPDF } from '../lib/pdfUtils';
import { StorageService, FREE_PLAN_LIMIT } from '../services/storageService';
import PricingModal from '../components/PricingModal';
import TenderApplicationDraft from '../components/TenderApplicationDraft';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

type Message = {
  role: 'user' | 'assistant';
  content: string | React.ReactNode;
  time: string;
};

export default function AIAssistant() {
  const { t } = useLanguage();
  const aiService = AIService.getInstance();
  const location = useLocation();
  const navigate = useNavigate();
  const { savedTenders } = useStore();
  
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: t('neuralEngineInit'),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [analyzedFile, setAnalyzedFile] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [showTextPreview, setShowTextPreview] = useState(false);
  const [manualTextMode, setManualTextMode] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [isPro, setIsPro] = useState(StorageService.isPro());
  const [usageCount, setUsageCount] = useState(StorageService.getDailyUsageCount());
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [applicationDraft, setApplicationDraft] = useState<string | null>(null);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [apiKey, setApiKey] = useState(aiService.getApiKey() || '');
  const [isEditingKey, setIsEditingKey] = useState(!aiService.getApiKey());
  const [error, setLocalError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-fill logic from TenderMarketplace deep link
  useEffect(() => {
    if (location.state && location.state.autoFillText && location.state.autoFillTitle) {
      setAnalyzedFile(location.state.autoFillTitle);
      setExtractedText(location.state.autoFillText);
      setManualTextMode(true);
      setShowTextPreview(true);
      
      // Clear the state so it doesn't trigger again on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  useEffect(() => {
    // Proactive AI greeting
    if (savedTenders && savedTenders.length > 0 && messages.length === 1) {
      const urgentTenders = savedTenders.filter(t => new Date(t.deadline).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000);
      
      let proactiveText = `I am your AI Business Advisor. I see you have **${savedTenders.length} active tenders** saved in your pipeline. `;
      
      if (urgentTenders.length > 0) {
        proactiveText += `\n\n⚠️ **Urgent**: You have ${urgentTenders.length} tender(s) closing within 7 days. I highly recommend running a Win Probability analysis on them today to finalize your strategy.`;
      } else {
        proactiveText += `\n\nWould you like me to evaluate your **Win Probability** for any of them, or would you like to upload a new tender document for risk analysis?`;
      }

      setMessages([
        { 
          role: 'assistant', 
          content: proactiveText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else if (messages.length === 1) {
         setMessages([
            { 
              role: 'assistant', 
              content: "I am your AI Business Advisor. I'm here to analyze tender documents, evaluate your win probability, detect hidden risks, and build a winning strategy.\n\nPlease upload a tender document or ask me a strategic question to get started.",
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
    }
  }, [savedTenders]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) return;
    aiService.setApiKey(apiKey);
    setIsEditingKey(false);
    setLocalError(null);
  };

  const handleDeleteApiKey = () => {
    aiService.clearApiKey();
    setApiKey('');
    setIsEditingKey(true);
  };

  const handleError = (err: any) => {
    if (err.message === "MISSING_API_KEY") {
      setLocalError(t('missingApiKeyError'));
      setIsEditingKey(true);
    } else {
      setLocalError("I encountered a signal disruption. Please try again.");
    }
  };

  const generateApplication = async () => {
    if (!analyzedFile || !analysisResult) return;
    
    setIsGeneratingDraft(true);
    setIsTyping(true);

    try {
      const draft = await aiService.generateProposalDraft(analyzedFile, analysisResult);
      setApplicationDraft(draft);
      
      const botMessage: Message = {
        role: 'assistant',
        content: (
          <div className="space-y-4">
            <p>{t('neuralSynthesis')} **{analyzedFile}**.</p>
            <TenderApplicationDraft 
                draft={draft} 
                onRegenerate={async (tone) => {
                    return await aiService.generateProposalDraft(analyzedFile, analysisResult, tone);
                }}
            />
          </div>
        ),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      handleError(error);
    } finally {
      setIsGeneratingDraft(false);
      setIsTyping(false);
    }
  };

  const performAnalysis = async (fileName: string, content: string) => {
    if (!StorageService.canPerformAnalysis()) {
      setShowPricing(true);
      return;
    }

    setIsTyping(true);
    setAnalyzedFile(fileName);
    
    try {
      const result = await aiService.analyzeTender(fileName, content);
      
      const { addAnalysisEntry } = useStore.getState();
      addAnalysisEntry({
        title: fileName,
        type: fileName === 'Manual Input' ? 'manual' : 'file',
        fileName: fileName !== 'Manual Input' ? fileName : undefined
      });
      
      StorageService.incrementUsageCount();
      setUsageCount(StorageService.getDailyUsageCount());

      const botMessage: Message = {
        role: 'assistant',
        content: (
          <div className="space-y-4">
            <p className="text-slate-700">{t('neuralDecryption')} **{fileName}**{t('intelligenceReport')}</p>
            <TenderAnalysisResults result={result} />
          </div>
        ),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMessage]);
      setAnalysisResult(result);
      setShowTextPreview(false);
    } catch (error) {
      handleError(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
        text: typeof msg.content === 'string' ? msg.content : "Analysis report displayed."
      }));

      const contextStr = analyzedFile && analysisResult ? `Analyzed Tender: ${analyzedFile}. Summary: ${analysisResult.summary}` : undefined;
      
      const response = await aiService.chatWithAssistant([...history, { role: 'user', text: currentInput }], contextStr);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      handleError(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setAnalyzedFile(file.name);
    setShowUpload(false);
    setIsParsingPdf(true);
    
    try {
      const text = await extractTextFromPDF(file);
      setExtractedText(text);
      setShowTextPreview(true);
      setManualTextMode(false);
    } catch (error) {
      console.error(error);
      setExtractedText('');
      setManualTextMode(true);
      setShowTextPreview(true);
      setLocalError(t('extractionError'));
    } finally {
      setIsParsingPdf(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex-1 flex flex-col relative w-full h-full min-h-0">
      <PricingModal 
        isOpen={showPricing} 
        onClose={() => setShowPricing(false)} 
        onSuccess={() => {
          setIsPro(true);
          setLocalError(null);
        }}
      />
      <AnimatePresence>
        {showTextPreview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-slate-50/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="w-full max-w-4xl bg-white rounded-[40px] border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden shadow-sm"
            >
              <div className="p-10 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-4 tracking-tight text-slate-900 leading-none">
                    {manualTextMode ? <Edit3 size={22} className="text-indigo-400" /> : <FileText size={22} className="text-indigo-400" />}
                    {manualTextMode ? t('manualEntryTitle') : t('extractedPreview')}
                  </h2>
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mt-3">
                    {analyzedFile || "MANUAL_INPUT_SIGNAL"}
                  </p>
                </div>
                <button 
                  onClick={() => setShowTextPreview(false)}
                  className="p-3 bg-slate-50 text-slate-500 hover:text-slate-900 transition-all rounded-xl"
                >
                  <XCircle size={22} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 bg-white/30">
                {isParsingPdf ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
                      <Loader2 size={48} className="animate-spin text-slate-900 relative z-10" />
                    </div>
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">{t('extractingText')}</p>
                  </div>
                ) : (
                  <textarea
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    placeholder={t('pasteTenderText')}
                    className="w-full h-full min-h-[400px] bg-slate-50 border border-slate-200 rounded-3xl p-10 text-base leading-relaxed outline-none focus:border-indigo-500/50 transition-all text-slate-700 font-medium placeholder:text-slate-700 italic"
                  />
                )}
              </div>

              <div className="p-10 border-t border-slate-200 flex gap-6 bg-white/20">
                <button 
                  onClick={() => {
                    setManualTextMode(!manualTextMode);
                    if (!manualTextMode) {
                      setExtractedText('');
                    }
                  }}
                  className="flex-1 py-5 border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all font-bold active:scale-95 shadow-sm"
                >
                  {manualTextMode ? t('extractedPreview') : t('manualEntryTitle')}
                </button>
                <button 
                  onClick={() => performAnalysis(analyzedFile || "Manual Input", extractedText)}
                  disabled={!extractedText.trim() || isParsingPdf}
                  className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all flex items-center justify-center gap-4 disabled:opacity-20 shadow-xl active:scale-95 group"
                >
                  Analyze Document
                  <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showUpload && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-slate-50/95 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="w-full max-w-2xl"
            >
              <FileUpload 
                onUpload={handleFileUpload} 
                onClose={() => setShowUpload(false)} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-5 tracking-tight text-slate-900 group">
            <Sparkles className="text-indigo-400 group-hover:scale-125 transition-transform duration-500" size={32} />
            {t('assistantTitle')}
          </h1>
          <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.3em] mt-3 ml-12">{t('assistantSubtitle')}</p>
        </div>
        <div className="flex items-center gap-6">
          {analyzedFile && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-5 py-2.5 bg-white border border-indigo-500/20 rounded-full flex items-center gap-3 text-slate-900 shadow-xl"
            >
              <FileText size={16} className="text-indigo-400" />
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] truncate max-w-[150px] md:max-w-[250px]">{analyzedFile}</span>
            </motion.div>
          )}
          <button 
            onClick={() => {
              setMessages([{ 
                role: 'assistant', 
                content: t('neuralEngineInit'),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }]);
              setAnalyzedFile(null);
              setExtractedText('');
              setAnalysisResult(null);
              setApplicationDraft(null);
              setLocalError(null);
            }}
            className="p-4 bg-white border border-slate-200 text-slate-500 hover:text-red-400 transition-all rounded-2xl active:scale-90"
          >
            <Trash2 size={22} />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-[40px] flex flex-col md:flex-row overflow-hidden shadow-2xl min-h-0">
        {/* Sidebar help */}
        <div className="w-full md:w-72 lg:w-80 shrink-0 border-b md:border-b-0 md:border-r border-slate-200 p-6 lg:p-10 space-y-8 lg:space-y-12 bg-white/20 overflow-y-auto custom-scrollbar flex flex-col md:block max-h-[35vh] md:max-h-none">
          {/* API Key Section */}
          <div className="space-y-4 lg:space-y-6">
             <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
              <Key size={14} className="text-indigo-500/50" />
              {t('apiKeyRequired')}
            </h3>
            {isEditingKey ? (
              <div className="space-y-4">
                <input 
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={t('apiKeyPlaceholder')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-[10px] uppercase font-bold tracking-widest outline-none focus:border-indigo-500/50 transition-all text-slate-900 placeholder:text-slate-800"
                />
                <button 
                  onClick={handleSaveApiKey}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-lg active:scale-95"
                >
                  {t('saveApiKey')}
                </button>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="block text-center text-[10px] text-slate-600 font-bold hover:text-slate-900 uppercase tracking-[0.2em] transition-colors underline underline-offset-4 decoration-slate-800">
                  {t('getApiKey')}
                </a>
              </div>
            ) : (
              <div className="py-4 px-5 bg-slate-50 border border-emerald-500/20 rounded-2xl flex items-center justify-between group shadow-inner">
                <div className="flex items-center gap-3 text-emerald-400">
                  <CheckCircle2 size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('apiKeyActive')}</span>
                </div>
                <button onClick={() => setIsEditingKey(true)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>

          <div className="h-[1px] bg-slate-50 w-full opacity-50"></div>

          <div className="space-y-6">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
              <Info size={14} className="text-indigo-500/50" />
              {t('protocols')}
            </h3>
            <div className="space-y-4">
              <button 
                onClick={() => setShowUpload(true)}
                className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-indigo-600 text-white transition-all text-[11px] font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 group"
              >
                <div className="flex items-center gap-4">
                  <FileText size={20} />
                  {t('ingestRfp')}
                </div>
                <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button 
                onClick={() => {
                  setManualTextMode(true);
                  setShowTextPreview(true);
                  setExtractedText('');
                }}
                className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-slate-50 border border-slate-200 text-slate-400 transition-all text-[11px] font-black uppercase tracking-[0.2em] hover:text-slate-900 hover:border-slate-300 active:scale-95 group"
              >
                <div className="flex items-center gap-4">
                  <Edit3 size={20} />
                  {t('manualInput')}
                </div>
                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
          
          <div className="pt-12 border-t border-slate-200 space-y-8">
            {!isPro && (
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 space-y-6 shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">{t('analysesRemaining')}</span>
                  <span className="text-[11px] font-bold text-slate-900">
                    {Math.max(0, FREE_PLAN_LIMIT - usageCount)} / {FREE_PLAN_LIMIT}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-1000 shadow-sm"
                    style={{ width: `${(usageCount / FREE_PLAN_LIMIT) * 100}%` }}
                  />
                </div>
                <button 
                  onClick={() => setShowPricing(true)}
                  className="w-full py-4 bg-white text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all active:scale-95 shadow-xl"
                >
                  {t('upgradeToPro')}
                </button>
              </div>
            )}
            
            {isPro && (
              <div className="p-5 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                <Shield className="text-emerald-400" size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-400">
                  {t('proPlan')} • {t('unlimitedUsage')}
                </span>
              </div>
            )}

            <div className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-200 flex flex-col gap-4">
              <p className="text-[10px] text-slate-700 leading-relaxed font-black uppercase tracking-[0.3em]">{t('neuralStatus')}</p>
              <p className="text-[13px] text-slate-400 leading-relaxed italic font-medium">
                {analyzedFile ? `${t('processingContext')} ${analyzedFile}` : t('awaitingDoc')}
              </p>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white relative min-h-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.03),transparent_70%)] pointer-events-none"></div>
          
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-red-500/10 border-b border-red-500/20 flex items-center px-10 py-5 gap-6 text-red-500 relative z-20 shrink-0"
              >
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-[11px] font-black uppercase tracking-[0.2em]">{error}</p>
                <button onClick={() => setLocalError(null)} className="ml-auto p-2 hover:bg-red-500/10 rounded-xl transition-all">
                  <XCircle size={20} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 space-y-8 custom-scrollbar relative z-10 min-h-0">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex gap-4 md:gap-6",
                    m.role === 'user' ? "ml-auto flex-row-reverse max-w-[90%] md:max-w-[85%]" : "max-w-[95%] md:max-w-[85%]"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-xl shrink-0 flex items-center justify-center font-black text-xs shadow-sm relative",
                    m.role === 'assistant' 
                      ? "bg-indigo-600 text-white" 
                      : "bg-white border border-slate-200 text-slate-900"
                  )}>
                    <span className="relative z-10 uppercase tracking-tighter">{m.role === 'assistant' ? "TS" : "ID"}</span>
                  </div>
                  <div className={cn("space-y-2 flex flex-col min-w-0 max-w-full", m.role === 'user' ? "items-end text-right" : "items-start")}>
                    <div className={cn(
                      "p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] text-[15px] leading-[1.6] font-medium shadow-sm relative overflow-hidden",
                      m.role === 'assistant' 
                        ? "bg-white border border-slate-200 text-slate-700" 
                        : "bg-slate-900 text-white"
                    )}>
                      {m.role === 'assistant' && (
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                          <Rocket size={60} />
                        </div>
                      )}
                      {typeof m.content === 'string' ? (
                        <div className="markdown-body prose dark:prose-invert prose-slate prose-sm max-w-none break-words">
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        </div>
                      ) : (
                        m.content
                      )}
                    </div>
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] px-2 md:px-4">
                       {m.role === 'assistant' ? "Neural Engine Phase-4" : "Validated Identity Principal"} • {m.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {!applicationDraft && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                {(analyzedFile ? [
                  "Should I participate?",
                  "Explain requirements in simple words",
                  "What documents do I need?",
                  "Generate Proposal"
                ] : [
                  "Can I win this tender?",
                  "What documents do I need?",
                  "Help me write a proposal"
                ]).map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      if (suggestion === "Generate Proposal") {
                        generateApplication();
                      } else {
                        setInput(suggestion);
                      }
                    }}
                    className="p-5 md:p-6 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] font-black uppercase tracking-[0.1em] text-slate-500 hover:border-indigo-500/50 hover:text-slate-900 hover:bg-white transition-all text-left group shadow-lg"
                  >
                    <span className="group-hover:translate-x-1 inline-block transition-transform">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
            
            {isTyping && (
              <div className="flex gap-4 md:gap-6 items-center max-w-[90%]">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-50 border border-slate-300 flex items-center justify-center text-slate-500 font-black text-xs relative shrink-0 shadow-xl overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-500/20 blur-md rounded-xl animate-pulse"></div>
                  <BrainCircuit className="w-5 h-5 text-indigo-400 relative z-10 animate-pulse" />
                </div>
                <div className="bg-white border border-slate-200 p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] shadow-xl flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-duration:1s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.4s]"></span>
                  </div>
                  <span className="text-xs md:text-sm font-medium text-slate-400 animate-pulse">
                    AI Advisor is analyzing...
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} className="h-4" />
          </div>

          <div className="p-4 md:p-6 lg:p-8 lg:pb-6 border-t border-slate-200 bg-white/80 backdrop-blur-md relative z-20 shrink-0">
            <div className="relative group max-w-4xl mx-auto">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={analyzedFile ? `${t('askAbout')} ${analyzedFile}...` : t('askPlaceholder')}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl md:rounded-[2rem] py-5 md:py-6 pl-6 md:pl-8 pr-16 md:pr-20 focus:border-indigo-500/50 transition-all outline-none text-sm md:text-[15px] font-medium text-slate-900 placeholder:text-slate-700 shadow-xl italic"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl md:rounded-2xl disabled:opacity-20 transition-all shadow-lg active:scale-90 group"
              >
                <Send size={20} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:justify-between mt-4 md:mt-6 px-2 md:px-6 gap-2">
               <p className="text-[9px] md:text-[10px] text-slate-700 uppercase tracking-[0.3em] md:tracking-[0.4em] font-black text-center sm:text-left">
                 {t('poweredBy')}
               </p>
               <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-indigo-500/50 rounded-full animate-ping"></div>
                  <span className="text-[9px] md:text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] md:tracking-[0.4em]">{t('signalLocked')}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
