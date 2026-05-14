import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XCircle, CheckCircle2, Zap, Rocket, Shield, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { StorageService } from '../services/storageService';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PricingModal({ isOpen, onClose, onSuccess }: PricingModalProps) {
  const { t } = useLanguage();

  const handleUpgrade = () => {
    StorageService.setPro(true);
    onSuccess();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-6"
        >
          <motion.div 
            initial={{ scale: 0.98, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden relative"
          >
            <div className="absolute top-8 right-8">
              <button 
                onClick={onClose}
                className="text-zinc-300 hover:text-zinc-900 dark:hover:text-slate-900 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-12 md:p-20 text-center">
              <div className="inline-flex items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-800 rounded-2xl mb-8">
                <Rocket className="text-zinc-900 dark:text-slate-900" size={40} />
              </div>
              <h2 className="text-4xl font-bold tracking-tighter mb-4 dark:text-slate-900">{t('unlockPro')}</h2>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-md mx-auto leading-relaxed italic">
                {t('usageHelp')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 text-left">
                <div className="p-8 bg-zinc-50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-50 dark:border-zinc-800">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{t('freePlan')}</span>
                  </div>
                  <div className="text-3xl font-bold mb-8 text-zinc-900 dark:text-slate-900">$0 <span className="text-xs text-zinc-400 font-medium tracking-normal italic">/ month</span></div>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      <Zap size={14} className="text-zinc-300" /> 3 Analyses / Day
                    </li>
                    <li className="flex items-center gap-3 text-[10px] font-bold text-zinc-300 uppercase tracking-widest line-through">
                      <Globe size={14} /> Priority Support
                    </li>
                  </ul>
                </div>

                <div className="p-8 bg-zinc-900 dark:bg-zinc-200 rounded-2xl text-slate-900 dark:text-zinc-900 relative group transition-all">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{t('proPlan')}</span>
                    </div>
                    <div className="text-3xl font-bold mb-8">$49 <span className="text-xs opacity-60 font-medium tracking-normal italic">/ month</span></div>
                    <ul className="space-y-4">
                      <li className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                        <CheckCircle2 size={14} /> Unlimited Analyses
                      </li>
                      <li className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                        <CheckCircle2 size={14} /> Executive Summaries
                      </li>
                      <li className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                        <CheckCircle2 size={14} /> 24/7 Priority Support
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-16 space-y-6">
                <button 
                  onClick={handleUpgrade}
                  className="w-full py-6 bg-zinc-900 dark:bg-zinc-200 dark:text-zinc-900 text-slate-900 dark:hover:bg-zinc-300 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-all font-bold"
                >
                  {t('upgradeToPro')}
                </button>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                  {t('simulatedPayment')}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
