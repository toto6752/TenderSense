import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, ShieldCheck, ShieldAlert, LogOut, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  return (
    <div className="space-y-12 max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          className="w-36 h-36 bg-white rounded-[3rem] flex items-center justify-center text-indigo-500 border-2 border-slate-200 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-indigo-500/5 blur-xl"></div>
          <User size={64} className="relative z-10" />
        </motion.div>
        
        <div className="flex-1 text-center md:text-left space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase leading-tight">Security Profile</h1>
            <p className="text-slate-500 font-medium italic mt-2">Managing your neural authentication parameters.</p>
          </motion.div>

          <div className="flex flex-wrap justify-center md:justify-start gap-4">
             <div className="px-5 py-2 bg-white rounded-full flex items-center gap-3 border border-slate-200 shadow-lg">
               <Shield size={16} className="text-indigo-400" />
               <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-600">Identity Active</span>
             </div>
             {user.is_verified ? (
               <div className="px-5 py-2 bg-emerald-500/10 rounded-full flex items-center gap-3 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                 <ShieldCheck size={16} className="text-emerald-400" />
                 <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400">Verified</span>
               </div>
             ) : (
               <div className="px-5 py-2 bg-amber-500/10 rounded-full flex items-center gap-3 border border-amber-500/20 shadow-lg shadow-amber-500/5">
                 <ShieldAlert size={16} className="text-amber-400" />
                 <span className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-400">Unverified</span>
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-10 bg-white rounded-[3rem] border border-slate-200 space-y-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
            <Mail size={120} />
          </div>
          
          <div className="flex items-center gap-6 text-slate-500 group">
            <div className="p-4 bg-white border border-slate-200 rounded-2xl text-indigo-400 shadow-inner group-hover:text-indigo-300 transition-colors">
              <Mail size={24} />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] mb-1">Electronic Mail</p>
              <p className="text-lg font-bold text-slate-900 tracking-tight">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-500 group">
            <div className="p-4 bg-white border border-slate-200 rounded-2xl text-indigo-400 shadow-inner group-hover:text-indigo-300 transition-colors">
              <Calendar size={24} />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] mb-1">Signal Established</p>
              <p className="text-lg font-bold text-slate-900 tracking-tight">
                {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-10 bg-slate-50/30 rounded-[3rem] border border-slate-200 flex flex-col justify-between shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 p-8 opacity-[0.02] pointer-events-none">
            <Shield size={120} />
          </div>

          <p className="text-[15px] text-slate-500 font-medium italic leading-relaxed mt-4 relative z-10">
            "Your session is protected by a time-limited secure token. Maintain the confidentiality of your access key at all times to prevent terminal signal leakage."
          </p>
          <button 
            onClick={logout}
            className="mt-12 flex items-center justify-center gap-4 w-full py-5 bg-red-600/10 hover:bg-red-600 border border-red-500/20 text-red-500 hover:text-slate-900 rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] transition-all shadow-xl hover:shadow-red-600/20 active:scale-95 group relative z-10"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            Terminate Session
          </button>
        </motion.div>
      </div>
    </div>
  );
}
