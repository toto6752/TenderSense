import React, { useState, useEffect } from 'react';
import { Copy, Check, FileText, Download, Edit3, Eye, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';

export type Tone = 'formal' | 'short' | 'persuasive';

interface TenderApplicationDraftProps {
  draft: string;
  onRegenerate?: (tone: Tone) => Promise<string>;
}

export default function TenderApplicationDraft({ draft, onRegenerate }: TenderApplicationDraftProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [content, setContent] = useState(draft);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTone, setActiveTone] = useState<Tone>('formal');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setContent(draft);
  }, [draft]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToneChange = async (tone: Tone) => {
    if (!onRegenerate) return;
    setActiveTone(tone);
    setIsGenerating(true);
    try {
        const newDraft = await onRegenerate(tone);
        setContent(newDraft);
    } catch (err) {
        console.error("Failed to regenerate tone", err);
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-2xl mt-10 relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>
      
      <div className="flex flex-col md:flex-row items-center justify-between p-8 border-b border-slate-200 bg-white/40 relative z-10 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl shadow-inner">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-900">Proposal Draft</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] mt-1 italic">Ready for review</p>
          </div>
        </div>
        
        {onRegenerate && (
          <div className="flex bg-white rounded-2xl p-1 border border-slate-200">
            {(['formal', 'short', 'persuasive'] as Tone[]).map((tone) => (
              <button
                key={tone}
                onClick={() => handleToneChange(tone)}
                disabled={isGenerating}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] transition-all flex items-center gap-2",
                  activeTone === tone ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isGenerating && activeTone === tone && <Loader2 size={12} className="animate-spin" />}
                {tone}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border border-slate-300 shadow-sm active:scale-95"
          >
            {isEditing ? <><Eye size={16} /> Preview</> : <><Edit3 size={16} /> Edit</>}
          </button>
          
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white transition-all rounded-xl text-[10px] font-black uppercase tracking-[0.15em] shadow-sm active:scale-95"
          >
            {copied ? (
              <>
                <Check size={16} className="text-emerald-400" />
                Copied
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="p-10 lg:p-16 max-h-[700px] overflow-y-auto bg-white/10 custom-scrollbar relative z-10 transition-all">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50 space-y-6">
             <Loader2 size={48} className="animate-spin text-indigo-500" />
             <p className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400 flex items-center gap-2"><Sparkles size={14}/> Synthesizing {activeTone} tone...</p>
          </div>
        ) : isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[500px] bg-slate-50/50 border border-slate-200 rounded-2xl p-6 text-slate-600 font-mono text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 resize-y"
            placeholder="Edit your application draft here..."
          />
        ) : (
          <div className="prose dark:prose-invert prose-slate prose-base max-w-none 
            prose-headings:font-black prose-headings:tracking-[0.1em] prose-headings:uppercase prose-headings:text-indigo-400 prose-headings:border-l-2 prose-headings:border-indigo-500 prose-headings:pl-4 prose-headings:my-8
            prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6
            prose-li:text-slate-600 prose-strong:text-slate-900 prose-strong:font-bold
            prose-blockquote:border-slate-200 prose-blockquote:text-slate-400 prose-blockquote:italic prose-blockquote:bg-slate-50/50 prose-blockquote:p-6 prose-blockquote:rounded-2xl"
          >
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-slate-200 flex justify-end bg-white/40 relative z-10">
        <button className="flex items-center gap-4 px-10 py-4 bg-white text-slate-950 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-100 transition-all active:scale-95 group">
          <Download size={20} className="group-hover:translate-y-1 transition-transform" />
          {t('exportPdf') || 'Export to PDF'}
        </button>
      </div>
    </motion.div>
  );
}
