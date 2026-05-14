import React from 'react';
import { FileText, ListChecks, ShieldAlert, Rocket, Info, ChevronRight, Target, TrendingUp, TrendingDown, Clock, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

export interface AnalysisResult {
  summary: string;
  winProbability: number;
  strengths: string[];
  weaknesses: string[];
  requirements: string[];
  documents: string[];
  risks: string[];
  plan: string[];
  deadline: string;
  budget: string;
}

interface TenderAnalysisResultsProps {
  result: AnalysisResult;
}

export default function TenderAnalysisResults({ result }: TenderAnalysisResultsProps) {
  const { t } = useLanguage();
  const sections = [
    {
      title: t('neuralSummary') || 'Executive Summary',
      icon: Info,
      content: result.summary,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-600/10',
      borderColor: 'border-indigo-500/20'
    },
    {
      title: 'Strengths',
      icon: TrendingUp,
      items: result.strengths,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-600/10',
      borderColor: 'border-emerald-500/20'
    },
    {
      title: 'Weaknesses',
      icon: TrendingDown,
      items: result.weaknesses,
      color: 'text-orange-400',
      bgColor: 'bg-orange-600/10',
      borderColor: 'border-orange-500/20'
    },
    {
      title: t('coreRequirements') || 'Core Requirements',
      icon: ListChecks,
      items: result.requirements,
      color: 'text-blue-400',
      bgColor: 'bg-blue-600/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: t('mandatoryDoc') || 'Mandatory Documents',
      icon: FileText,
      items: result.documents,
      color: 'text-purple-400',
      bgColor: 'bg-purple-600/10',
      borderColor: 'border-purple-500/20'
    },
    {
      title: t('strategicRisks') || 'Strategic Risks',
      icon: ShieldAlert,
      items: result.risks,
      color: 'text-red-400',
      bgColor: 'bg-red-600/10',
      borderColor: 'border-red-500/20'
    },
    {
      title: t('appRoadmap') || 'Application Roadmap',
      icon: Rocket,
      items: result.plan,
      color: 'text-amber-400',
      bgColor: 'bg-amber-600/10',
      borderColor: 'border-amber-500/20',
      isStepByStep: true
    }
  ];

  const getProbabilityColor = (prob: number) => {
    if (prob >= 70) return 'bg-emerald-500 shadow-emerald-500/50';
    if (prob >= 40) return 'bg-amber-500 shadow-amber-500/50';
    return 'bg-red-500 shadow-red-500/50';
  };

  const getProbabilityTextColor = (prob: number) => {
    if (prob >= 70) return 'text-emerald-400';
    if (prob >= 40) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-8 mt-10 pb-16">
      {/* Win Probability Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 rounded-[2.5rem] bg-white/30 border border-slate-200 shadow-2xl backdrop-blur-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
          <Target size={120} />
        </div>
        
        <div className="flex items-center gap-5 mb-8">
          <div className="p-4 rounded-2xl shadow-inner bg-slate-50 text-slate-900">
            <Target size={28} />
          </div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">
            Win Probability
          </h3>
        </div>

        <div className="flex items-center gap-8">
          <div className={cn("text-6xl font-black tracking-tighter", getProbabilityTextColor(result.winProbability))}>
            {result.winProbability}%
          </div>
          <div className="flex-1 max-w-md h-4 bg-slate-50 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${result.winProbability}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={cn("h-full rounded-full shadow-lg", getProbabilityColor(result.winProbability))}
            />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-[2.5rem] bg-white/30 border border-slate-200 shadow-xl flex flex-col items-start gap-4 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <Clock size={80} />
          </div>
          <div className="p-4 rounded-2xl shadow-inner bg-slate-50 text-slate-900">
            <Clock size={28} />
          </div>
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">
              Deadline
            </h3>
            <p className="text-xl font-bold text-slate-900 relative z-10">
              {result.deadline || 'Not specified'}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-[2.5rem] bg-white/30 border border-slate-200 shadow-xl flex flex-col items-start gap-4 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <DollarSign size={80} />
          </div>
          <div className="p-4 rounded-2xl shadow-inner bg-slate-50 text-emerald-400">
            <DollarSign size={28} />
          </div>
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">
              Budget / Value
            </h3>
            <p className="text-xl font-bold text-emerald-400 relative z-10">
              {result.budget || 'Not specified'}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {sections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "p-8 rounded-[2.5rem] bg-white/30 border shadow-2xl backdrop-blur-sm relative overflow-hidden group",
              section.borderColor
            )}
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
              <section.icon size={120} />
            </div>

            <div className="flex items-center gap-5 mb-8">
              <div className={cn("p-4 rounded-2xl shadow-inner", section.bgColor, section.color)}>
                <section.icon size={28} />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">
                {section.title}
              </h3>
            </div>

            {section.content && (
              <p className="text-slate-400 text-[15px] leading-relaxed font-medium italic">
                " {section.content} "
              </p>
            )}

            {section.items && (
              <div className="space-y-4">
                {section.items.map((item, i) => (
                  <div key={i} className="flex gap-4 group/item">
                    {section.isStepByStep ? (
                      <div className="h-8 w-8 shrink-0 rounded-xl bg-slate-50 border border-slate-300 flex items-center justify-center text-[10px] font-black text-amber-500 shadow-inner group-hover/item:bg-amber-500 group-hover/item:text-slate-900 transition-all">
                        {i + 1}
                      </div>
                    ) : (
                      <ChevronRight size={18} className={cn("shrink-0 mt-0.5 opacity-30 transition-all group-hover/item:translate-x-1 group-hover/item:opacity-100", section.color)} />
                    )}
                    <p className="text-slate-600 font-medium leading-relaxed group-hover/item:text-slate-900 transition-colors">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center pt-8"
      >
        <button className="px-12 py-6 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] shadow-2xl hover:bg-slate-50 transition-all active:scale-95 group flex items-center gap-4">
          {t('genFullDraft')}
          <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}
