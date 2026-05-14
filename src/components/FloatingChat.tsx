import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, Sparkles, User, Loader2, BrainCircuit } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { AIService } from '../services/aiService';
import { useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

export default function FloatingChat() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      text: "I am your AI Business Advisor. I'm here to analyze tender documents, evaluate your win probability, detect hidden risks, and build a winning strategy. How can I help you today?"
    }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const aiService = AIService.getInstance();
  const location = useLocation();
  const { tenders } = useStore();

  const match = location.pathname.match(/^\/tenders\/(.+)$/);
  const currentTenderId = match ? match[1] : null;
  const currentTender = currentTenderId ? tenders.find(t => t.id === currentTenderId) : null;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input.trim();
    if (!textToSend || isTyping) return;

    if (!overrideText) setInput('');
    
    // Add user message immediately
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', text: textToSend };
    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      // Setup payload for our AI service
      const historyForAI = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
        text: msg.text
      }));
      
      let contextPrefix = "";
      if (currentTender) {
          contextPrefix = `[System Context: The user is currently viewing the tender "${currentTender.title}" by "${currentTender.organization}". Budget is ${currentTender.budget}. Description: ${currentTender.description}. Answer their question in the context of this tender.]\n\n`;
      }

      const response = await aiService.chatWithAssistant([...historyForAI, { role: 'user', text: contextPrefix + textToSend }]);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: response
      }]);
    } catch (error: any) {
      console.error("AI Error:", error);
      // Clean fallback if API limits/fails
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: error.message === "MISSING_API_KEY" 
          ? "Please configure your API key in the AI Assistant settings to use this feature." 
          : "I experienced a temporary network disruption. Please try again."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[99] flex flex-col items-end">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="mb-4 w-[calc(100vw-3rem)] sm:w-[400px] h-[550px] max-h-[75vh] bg-white border border-slate-300/60 rounded-[2rem] shadow-sm flex flex-col overflow-hidden backdrop-blur-xl"
            >
              {/* Header */}
              <div className="px-6 py-5 bg-gradient-to-r from-indigo-900/40 to-white border-b border-slate-200 flex items-center justify-between shadow-sm relative">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50"></div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg">
                    <Sparkles className="text-slate-900" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 tracking-tight leading-tight">Tender AI</h3>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors active:scale-90"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Chat Area */}
              <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar bg-slate-50/50">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      className={cn(
                        "flex gap-4 max-w-[85%]",
                        msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-md",
                        msg.role === 'assistant' 
                          ? "bg-indigo-50 text-indigo-400 border border-indigo-500/30" 
                          : "bg-slate-50 text-slate-900 border border-slate-300"
                      )}>
                        {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                      </div>
                      
                      <div className={cn(
                        "p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm",
                        msg.role === 'user'
                          ? "bg-indigo-600 text-white rounded-tr-sm"
                          : "bg-slate-50/80 border border-slate-300/50 text-slate-700 rounded-tl-sm text-sm"
                      )}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 max-w-[85%]"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 mt-1 shadow-md overflow-hidden relative">
                      <div className="absolute inset-0 bg-indigo-500/20 blur-md rounded-xl animate-pulse"></div>
                      <BrainCircuit size={14} className="relative z-10 animate-pulse" />
                    </div>
                    <div className="p-3 px-4 rounded-2xl rounded-tl-sm bg-slate-50/80 border border-slate-300/50 flex gap-3 items-center">
                      <div className="flex gap-1">
                        <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce"></span>
                      </div>
                      <span className="text-[11px] font-medium text-indigo-200/70 animate-pulse uppercase tracking-wider">Analyzing Context...</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Quick Actions */}
              {currentTender && !isTyping && (
                <div className="px-4 pt-2 pb-4 flex gap-2 overflow-x-auto custom-scrollbar no-scrollbar whitespace-nowrap bg-slate-50/50 shadow-sm">
                  <button 
                    onClick={() => handleSend("Explain this tender")}
                    className="px-3 py-1.5 rounded-full bg-slate-50/80 hover:bg-indigo-600 border border-slate-300/50 text-slate-600 text-xs font-medium transition-colors backdrop-blur-sm"
                  >
                    Explain this tender
                  </button>
                  <button 
                    onClick={() => handleSend("Help me win this")}
                    className="px-3 py-1.5 rounded-full bg-slate-50/80 hover:bg-emerald-600 border border-slate-300/50 text-slate-600 text-xs font-medium transition-colors backdrop-blur-sm"
                  >
                    Help me win this
                  </button>
                  <button 
                    onClick={() => handleSend("Summarize")}
                    className="px-3 py-1.5 rounded-full bg-slate-50/80 hover:bg-purple-600 border border-slate-300/50 text-slate-600 text-xs font-medium transition-colors backdrop-blur-sm"
                  >
                    Summarize
                  </button>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-slate-200">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask AI assistant..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-full py-3.5 pl-5 pr-14 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isTyping}
                    className="absolute right-2 w-10 h-10 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-50 disabled:text-slate-500 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-50 active:scale-95"
                  >
                    {isTyping ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="-ml-0.5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-sm transition-all relative group z-10",
            isOpen ? "bg-slate-50 border border-slate-300 text-slate-900" : "bg-gradient-to-tr from-indigo-600 to-purple-600 border border-indigo-400 text-slate-900"
          )}
        >
          {/* Enhanced strong pulse ring behind button when closed */}
          {!isOpen && (
            <>
              <span className="absolute inset-0 rounded-full bg-indigo-500/50 blur-md pointer-events-none"></span>
              <span className="absolute inset-[-4px] rounded-full bg-indigo-400/40 animate-ping pointer-events-none" style={{ animationDuration: '2s' }}></span>
            </>
          )}
          
          {isOpen ? (
            <X size={28} className="relative z-10" />
          ) : (
            <MessageCircle size={28} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
          )}
        </motion.button>
      </div>
    </>
  );
}
