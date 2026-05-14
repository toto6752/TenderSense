import { 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  Plus,
  DollarSign,
  Sparkles,
  FileText,
  History,
  Edit3,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { FREE_PLAN_LIMIT } from '../services/storageService';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { DashboardSkeleton } from '../components/Skeleton';
import { WinProbabilityCard } from '../components/WinProbabilityCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const winStatisticsData = [
  { name: 'Jan', submitted: 4, won: 1 },
  { name: 'Feb', submitted: 7, won: 2 },
  { name: 'Mar', submitted: 5, won: 1 },
  { name: 'Apr', submitted: 10, won: 4 },
  { name: 'May', submitted: 6, won: 3 },
  { name: 'Jun', submitted: 12, won: 5 },
];

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const userName = user?.email.split('@')[0] || 'User';

  const { isInitialized, isLoading, stats, analysisHistory, savedTenders, tenders, initialize } = useStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  if (isLoading || !isInitialized) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <DashboardSkeleton />
      </motion.div>
    );
  }

  const statCards = [
    { label: "Total Tenders Viewed", value: '342', icon: Clock, trend: "+32", trendType: "positive" },
    { label: "Proposals Generated", value: "24", icon: Sparkles, trend: "+12", trendType: "positive" },
    { label: "Submitted Proposals", value: "15", icon: FileText, trend: "+3", trendType: "positive" },
    { label: "Won Tenders", value: stats.won.toString(), icon: CheckCircle2, trend: "+1", trendType: "positive" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Overview
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Welcome back, {userName}. You have {FREE_PLAN_LIMIT - stats.usage} analyses left this cycle.</p>
        </div>
        <Link to="/ai" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md font-medium text-sm transition-all shadow-sm">
          <Plus size={16} />
          {t('createNewBid') || "New Proposal"}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                <div className="text-slate-400">
                  <stat.icon size={18} />
                </div>
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUp size={14} className="text-emerald-500" />
                <span className="text-xs font-medium text-emerald-600">{stat.trend}</span> 
                <span className="text-xs text-slate-500">vs last month</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Win Statistics Chart */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-base text-slate-900">Win Statistics</h2>
              <select className="text-sm border-slate-200 rounded-md text-slate-600 shadow-sm focus:ring-slate-500 focus:border-slate-500 py-1.5 pl-3 pr-8">
                <option>Last 6 months</option>
                <option>This year</option>
              </select>
            </div>
            <div className="h-[280px] w-full">
              {winStatisticsData && winStatisticsData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={winStatisticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorSubmitted" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ fontSize: '13px', fontWeight: '500' }}
                        />
                        <Area type="monotone" dataKey="submitted" stroke="#94a3b8" strokeWidth={2} fillOpacity={1} fill="url(#colorSubmitted)" name="Submitted Bids" />
                        <Area type="monotone" dataKey="won" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#colorWon)" name="Won Tenders" />
                    </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500 font-medium text-sm">
                  No data available yet
                </div>
              )}
            </div>
          </section>

          {/* Active Tenders */}
          <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="font-semibold text-base text-slate-900">{savedTenders.length > 0 ? 'Saved Tenders' : 'Recommended Tenders'}</h2>
              <Link to="/tenders" className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">View All &rarr;</Link>
            </div>
            <div className="divide-y divide-slate-100">
              {(savedTenders.length > 0 ? savedTenders : tenders.slice(0, 3)).map((tender, idx) => (
                <motion.div
                  key={tender.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link to={`/tenders/${tender.id}`} className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group">
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="font-medium text-slate-900 truncate group-hover:text-amber-600 transition-colors">
                        {tender.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-1.5 text-sm text-slate-500">
                        <span className="truncate">{tender.organization}</span>
                        <span className="flex items-center gap-1 shrink-0"><DollarSign size={14} />{tender.budget}</span>
                        <span className="flex items-center gap-1 shrink-0"><Clock size={14} />{tender.deadline}</span>
                      </div>
                    </div>
                    <div className="text-slate-400 group-hover:text-slate-900 transition-colors shrink-0">
                      <ArrowUpRight size={18} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          {/* Pro Upgrade Banner */}
          <section className="bg-slate-900 rounded-xl p-6 text-white shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-amber-400" size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Pro Feature</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Automate Proposals</h3>
              <p className="text-slate-400 text-sm mb-6 max-w-[200px]">Generate enterprise-grade responses directly from RFP documents.</p>
              <Link to="/ai" className="inline-flex items-center justify-center w-full bg-white text-slate-900 px-4 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-slate-100">
                Try AI Assistant
              </Link>
            </div>
          </section>

          <WinProbabilityCard dashboardView={true} hasProfileData={analysisHistory.length > 0} />

          {/* Recent Activity */}
          <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="font-semibold text-base text-slate-900">Recent Activity</h2>
            </div>
            <div>
              {analysisHistory.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <p className="text-slate-500 text-sm mb-3">No proposals generated yet.</p>
                  <Link to="/ai" className="text-sm font-medium text-slate-900 hover:text-amber-600 transition-colors">Generate Proposal &rarr;</Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {analysisHistory.map((item, idx) => (
                    <Link 
                      to="/ai"
                      key={item.id}
                      className="flex items-start gap-4 p-5 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
                        {item.type === 'file' ? <FileText size={14} /> : <Edit3 size={14} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium text-slate-900 truncate group-hover:text-amber-600">{item.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">Generated {new Date(item.date).toLocaleDateString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>

        </aside>
      </div>
    </motion.div>
  );
}
