import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Share2,
  Bookmark,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../store/useStore';
import { useEffect, useState } from 'react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Skeleton } from '../components/Skeleton';
import { WinProbabilityCard } from '../components/WinProbabilityCard';

export default function TenderDetail() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { isInitialized, isLoading, initialize, tenders, savedTenders, saveTender, unsaveTender, analysisHistory } = useStore();
  
  useEffect(() => {
    if (!isInitialized) initialize();
  }, [isInitialized, initialize]);

  const tender = tenders.find(t => t.id === id);
  const isSaved = savedTenders.some(s => s.id === id);

  const handleToggleSave = () => {
    if (!tender) return;
    if (isSaved) {
      unsaveTender(tender.id);
    } else {
      saveTender({
        id: tender.id,
        title: tender.title,
        organization: tender.organization,
        budget: tender.budget,
        deadline: tender.deadline
      });
    }
  };

  if (isLoading || !isInitialized) {
    return (
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
        </div>
        <Skeleton className="h-[600px] w-full rounded-[40px]" />
      </div>
    );
  }

  if (!tender) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-20 space-y-6">
        <p className="text-xl font-medium text-slate-500 italic">" {t('tenderNotFound')} "</p>
        <button 
          onClick={() => navigate('/tenders')}
          className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 uppercase tracking-widest text-[11px] font-bold"
        >
          <ArrowLeft size={16} />
          {t('backToList')}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto space-y-12"
    >
      <div className="flex items-center justify-between">
        <Link 
          to="/tenders" 
          className="text-slate-500 hover:text-slate-900 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors"
        >
          <ArrowLeft size={16} />
          {t('backToAll')}
        </Link>
        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-900 rounded-xl transition-all active:scale-95">
            <Share2 size={18} />
          </button>
          <button 
            onClick={handleToggleSave}
            className={cn(
              "p-2.5 border rounded-xl transition-all active:scale-95 shadow-sm",
              isSaved ? "bg-indigo-600 border-indigo-500 text-white shadow-sm" : "bg-white border-slate-200 text-slate-500 hover:text-slate-900"
            )}
          >
            {isSaved ? <Bookmark size={18} fill="currentColor" /> : <Bookmark size={18} />}
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[40px] p-10 lg:p-20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none select-none">
          <Building2Icon className="w-64 h-64 text-slate-900" />
        </div>

        <div className="flex items-center gap-6 mb-12">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 bg-indigo-600/10 px-4 py-1.5 rounded-full border border-indigo-500/20">
            {tender.category}
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
            SIGNAL: {tender.id}
          </span>
        </div>

        <h1 className="text-4xl lg:text-7xl font-bold mb-16 text-slate-900 leading-[1.1] tracking-tight">
          {tender.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 mb-20">
          <div className="space-y-4">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.2em]">{t('estBudget')}</p>
            <div className="text-slate-900 font-bold text-4xl tracking-tight leading-none">
              {tender.budget}
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.2em]">{t('subDeadline')}</p>
            <div className="text-slate-900 font-bold text-4xl tracking-tight leading-none">
              {tender.deadline}
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.2em]">{t('org')}</p>
            <div className="text-slate-900 font-bold text-2xl leading-tight italic truncate">
              {tender.organization}
            </div>
          </div>
        </div>

        <div className="space-y-20">
          <div className="max-w-3xl">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-600 mb-8 border-l-2 border-slate-200 pl-4">{t('projDesc')}</h2>
            <p className="text-slate-400 leading-relaxed text-lg font-medium italic">
              " {tender.description} "
              <br /><br />
              {t('modernizeInit')}
            </p>
          </div>

          <div className="bg-gradient-to-r from-white via-slate-50 to-white border border-slate-200 rounded-3xl p-8 shadow-inner overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-8 border-l-2 border-indigo-500 pl-4 flex items-center gap-2">
              <Sparkles size={14} />
              AI Competitor Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              <div className="bg-slate-50/20 p-6 rounded-2xl border border-slate-300/50">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-2">Est. Competitors</p>
                <div className="text-2xl font-bold text-slate-900 flex items-end gap-2">
                  {(tender.id.charCodeAt(0) + tender.id.charCodeAt(tender.id.length-1)) % 8 + 3} 
                  <span className="text-sm font-medium text-slate-400 lowercase">bidders</span>
                </div>
              </div>
              <div className="bg-slate-50/20 p-6 rounded-2xl border border-slate-300/50">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-2">Avg. Bid Price</p>
                <div className="text-2xl font-bold text-emerald-400 flex items-end gap-2">
                  ~{(tender.id.charCodeAt(1) % 15) + 80}% 
                  <span className="text-sm font-medium text-slate-400 lowercase">of budget</span>
                </div>
              </div>
              <div className="bg-slate-50/20 p-6 rounded-2xl border border-slate-300/50">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-2">Past Winners</p>
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-sm text-slate-600 font-medium truncate">
                    {["Acme Solutions Corp", "TechGlobal Inc", "Nexus Sys", "Vertex IT"][tender.id.charCodeAt(0) % 4]}
                  </span>
                  <span className="text-sm text-slate-600 font-medium truncate">
                    {["Omega Industries", "Pinnacle Tech", "Quantum Logic", "Strata Data"][tender.id.charCodeAt(1) % 4]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-600 mb-10 border-l-2 border-slate-200 pl-4">{t('eligibilityReq')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {tender.requirements.map((req, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/30 mt-2.5 shrink-0 group-hover:bg-indigo-500 group-hover:scale-150 transition-all"></div>
                  <span className="text-[15px] font-medium text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">{req}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <WinProbabilityCard tender={tender} hasProfileData={analysisHistory.length > 0} />
          </div>
        </div>

        <div className="mt-24 flex flex-col md:flex-row gap-6 border-t border-slate-200 pt-20">
          <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-6 rounded-2xl font-bold uppercase tracking-[0.2em] text-[12px] transition-all shadow-xl active:scale-95 group">
            <span className="group-hover:tracking-[0.3em] transition-all">{t('initApp')}</span>
          </button>
          <Link 
            to="/ai" 
            className="flex-1 bg-white border border-slate-200 text-slate-900 py-6 rounded-2xl font-bold flex items-center justify-center gap-4 hover:bg-slate-50 transition-all uppercase tracking-[0.15em] text-[12px] active:scale-95 shadow-sm"
          >
            <Sparkles size={20} className="text-indigo-400" />
            {t('analyzeAi')}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function Building2Icon({ className }: { className: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
      <path d="M9 22v-4h6v4"/>
      <path d="M8 6h.01"/>
      <path d="M16 6h.01"/>
      <path d="M12 6h.01"/>
      <path d="M12 10h.01"/>
      <path d="M12 14h.01"/>
      <path d="M16 10h.01"/>
      <path d="M16 14h.01"/>
      <path d="M8 10h.01"/>
      <path d="M8 14h.01"/>
    </svg>
  );
}
