import { useState, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
  const { token } = useParams();
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsPending(true);
    try {
      await resetPassword(token!, password);
      setSuccess(true);
      setTimeout(() => navigate('/auth'), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_70%)] pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-200 relative z-10"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4 text-slate-900 uppercase tracking-tighter leading-tight">New Access Key</h1>
          <p className="text-slate-500 text-lg font-medium italic leading-relaxed">Establish a new secure neural key for your account.</p>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-10"
            >
              <div className="p-6 bg-emerald-500/10 rounded-full border border-emerald-500/20 shadow-2xl inline-block mb-10">
                <CheckCircle2 size={64} className="text-emerald-400" />
              </div>
              <p className="text-[13px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-4">Success! Access Key Updated</p>
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.15em] italic">Redirecting to authentication portal...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4 shadow-lg shadow-red-500/5"
                >
                  <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={20} />
                  <p className="text-[11px] font-black text-red-500 uppercase tracking-[0.1em] leading-relaxed">{error}</p>
                </motion.div>
              )}

              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">New Access Key</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Lock size={20} className="text-slate-600 group-focus-within:text-indigo-500 transition-colors duration-300" />
                  </div>
                  <input 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password" 
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-5 pl-14 pr-6 outline-none focus:border-indigo-500/50 transition-all font-medium text-lg text-slate-900 placeholder:text-slate-800 shadow-inner group-hover:border-slate-300 focus:placeholder:opacity-0"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Confirm Identity Key</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Lock size={20} className="text-slate-600 group-focus-within:text-indigo-500 transition-colors duration-300" />
                  </div>
                  <input 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password" 
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-5 pl-14 pr-6 outline-none focus:border-indigo-500/50 transition-all font-medium text-lg text-slate-900 placeholder:text-slate-800 shadow-inner group-hover:border-slate-300 focus:placeholder:opacity-0"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isPending}
                className="w-full bg-white text-slate-900 py-6 rounded-2xl font-black flex items-center justify-center gap-4 transition-all uppercase tracking-[0.2em] text-[13px] shadow-2xl active:scale-95 disabled:opacity-50 group mt-10"
              >
                {isPending ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <>
                    Update Access Key 
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </AnimatePresence>

        {!success && (
          <div className="mt-12 text-center">
            <Link 
              to="/auth" 
              className="text-slate-600 text-[11px] font-black uppercase tracking-[0.3em] hover:text-slate-900 transition-all underline underline-offset-8 decoration-slate-800"
            >
              Abort Operation
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
