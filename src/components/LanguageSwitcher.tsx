import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

// Using premium optimized SVGs instead of standard OS emojis for a Stripe/Vercel level feel
const languages = [
  { code: 'en', label: 'English', flagUrl: 'https://flagcdn.com/us.svg' },
  { code: 'ru', label: 'Русский', flagUrl: 'https://flagcdn.com/ru.svg' }
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 h-[38px] px-3.5 rounded-xl bg-white backdrop-blur-md border border-slate-200 hover:border-white/20 transition-all duration-300 text-[12px] font-semibold tracking-wide text-slate-700 group shadow-sm active:scale-95"
      >
        <img src={currentLang.flagUrl} alt={currentLang.code} className="w-[18px] h-[13px] object-cover rounded-[2px] shadow-sm" />
        <span className="hidden sm:inline uppercase">{currentLang.code}</span>
        <ChevronDown size={14} className={cn("text-slate-400 group-hover:text-slate-900 transition-transform duration-300 ml-0.5", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[99998]" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute top-[calc(100%+8px)] right-0 z-[99999] min-w-[160px] bg-slate-50/95 backdrop-blur-3xl border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col p-1.5"
            >
              <div className="px-2.5 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 border-b border-white/[0.04]">
                Region
              </div>
              {languages.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as any);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-sm transition-all duration-200",
                      isSelected 
                        ? "bg-white/10 text-slate-900" 
                        : "text-slate-600 hover:bg-white hover:text-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <img src={lang.flagUrl} alt={lang.code} className={cn("w-[18px] h-[13px] object-cover rounded-[2px] shadow-sm transition-opacity", !isSelected && "opacity-80 group-hover:opacity-100")} />
                      <span className="font-medium text-[13px]">{lang.label}</span>
                    </div>
                    {isSelected && <span className="text-slate-900 text-[10px]">✓</span>}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
