import { Search, Filter, Calendar, DollarSign, Building2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../store/useStore';
import { Skeleton } from '../components/Skeleton';
import { motion } from 'motion/react';

export default function TenderList() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('All');
  const { isInitialized, isLoading, tenders, initialize } = useStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);
  
  const categories = ['All', 'IT Services', 'Construction', 'Energy', 'Software'];
  const categoryKeys: Record<string, string> = {
    'All': 'all',
    'IT Services': 'itServices',
    'Construction': 'construction',
    'Energy': 'energy',
    'Software': 'software'
  };

  const filteredTenders = filter === 'All' 
    ? tenders 
    : tenders.filter(t => t.category === filter);

  if (isLoading || !isInitialized) {
    return (
      <div className="space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-12 w-80 rounded-xl" />
        </div>
        <Skeleton className="h-16 w-full rounded-3xl" />
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-3xl p-8 h-48 space-y-6">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-2/3" />
              <div className="flex gap-12 pt-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 border-l-2 border-indigo-600 pl-4">{t('liveTenders')}</h1>
          <p className="text-slate-500 mt-3 text-sm italic">" {t('tenderListSubtitle')} "</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 bg-white border border-slate-200 p-1.5 rounded-xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-2 sm:px-4 text-[10px] uppercase tracking-[0.1em] font-bold rounded-lg transition-all whitespace-nowrap ${
                filter === cat 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              {t(categoryKeys[cat] as any || cat.toLowerCase())}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder={t('searchPlaceholder')}
            className="w-full bg-transparent border-none py-2 pl-12 pr-4 text-sm outline-none font-medium text-slate-900 placeholder:text-slate-500 focus:placeholder:text-slate-600 transition-all"
          />
        </div>
        <button className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest transition-all shadow-sm active:scale-95 group">
          <Filter size={18} className="group-hover:rotate-12 transition-transform" />
          {t('filters')}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredTenders.map((tender, idx) => (
          <motion.div
            key={tender.id}
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
          >
            <Link 
              to={`/tenders/${tender.id}`}
              className="group block bg-white border border-slate-200 rounded-xl p-6 hover:border-indigo-200 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-indigo-400 transition-colors">
                      {tender.category}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-slate-50"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/50 group-hover:text-emerald-500 transition-colors">
                      {tender.status}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 leading-tight tracking-tight max-w-2xl group-hover:text-indigo-300 transition-colors">
                    {tender.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-12 gap-y-4 text-sm text-slate-500 font-medium pt-2 italic">
                    <div className="flex items-center gap-3 not-italic">
                      <Building2 size={16} className="text-indigo-500/30" />
                      <span>{tender.organization}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign size={16} className="text-emerald-500/30" />
                      <span className="font-bold text-slate-600">{tender.budget}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-indigo-500/30" />
                      <span>{t('closing')} {tender.deadline}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between lg:justify-end gap-12 pt-8 lg:pt-0 border-t lg:border-t-0 border-slate-200/50">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] mb-1">{t('confidence')}</p>
                    <p className="text-3xl font-bold tracking-tighter text-slate-900">98%</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-white group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all shadow-inner">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
