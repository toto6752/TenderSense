import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { BrandLogo } from '../components/BrandLogo';

export default function Auth() {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Safely prefill demo credentials for presentation speed
  const [email, setEmail] = useState('demo@tendersense.com');
  const [password, setPassword] = useState('Demo12345');
  
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPending, setIsPending] = useState(false);

  // Auto-clear the demo credentials if the user switches to register/forgot mode 
  // preventing them from seeing presentation data mingled into creation workflows
  useEffect(() => {
    if (mode !== 'login' && email === 'demo@tendersense.com') {
      setEmail('');
      setPassword('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);
  
  const { login, register, forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || (mode !== 'forgot' && !password) || (mode === 'register' && !name)) {
      setError(t('fillFields'));
      return;
    }

    if (mode !== 'forgot' && password.length < 8) {
      setError(t('passLength') || 'Password must be at least 8 characters');
      return;
    }

    setIsPending(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        navigate('/dashboard');
      } else if (mode === 'register') {
        await register(email, password);
        setSuccess('Registration successful! Please check your email to verify your account before logging in.');
        setMode('login');
      } else if (mode === 'forgot') {
        await forgotPassword(email);
        setSuccess('If an account exists with this email, a reset link has been sent.');
      }
    } catch (err: any) {
      setError(err.message || t('authFailed'));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans selection:bg-indigo-500/30">
      {/* LEFT SIDE: Branding */}
      <div className="lg:w-5/12 p-8 lg:p-24 flex flex-col justify-center text-slate-900 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="mb-16 flex flex-col items-start gap-8">
            <Link to="/" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 hover:text-slate-900 transition-colors group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              {t('backToHome') || 'Back to Home'}
            </Link>
            <Link to="/" className="transition-transform hover:scale-105 active:scale-95">
              <BrandLogo className="w-12 h-12" />
            </Link>
          </div>
          
          <div className="space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              TenderSense Platform
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
              {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Join Us' : 'Recover Key'}
            </h1>
            <p className="text-slate-500 text-lg lg:text-xl font-medium italic">
              "Secure, reliable, and production-ready authentication."
            </p>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE: Authentication Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[480px] bg-white p-8 lg:p-14 rounded-3xl border border-slate-200/50 shadow-2xl relative overflow-hidden"
        >
          <div className="mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
              {mode === 'login' ? t('accessPortal') : mode === 'register' ? t('createIdentity') : 'Reset Password'}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              {mode === 'login' ? t('loginDesc') : mode === 'register' ? t('registerDesc') : 'We will send you a secure link to reset your access key.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {(error || success) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${error ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">{error || success}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em] ml-1">{t('fullName')}</label>
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-white text-slate-900 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-[15px] placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em] ml-1">{t('corpEmail')}</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email" 
                  placeholder="name@company.com"
                  className="w-full bg-white text-slate-900 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-[15px] placeholder:text-slate-400"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em] ml-1">{t('accessKey')}</label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-white text-slate-900 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-[15px] placeholder:text-slate-400"
                  />
                </div>
                {mode === 'login' && (
                  <div className="flex justify-end">
                    <button 
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-indigo-400 font-bold uppercase tracking-[0.1em] hover:text-indigo-300 transition-colors"
                    >
                      {t('recoverKey')}
                    </button>
                  </div>
                )}
              </div>
            )}

            <button 
              type="submit"
              disabled={isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4.5 rounded-xl font-bold flex items-center justify-center gap-3 transition-all uppercase tracking-[0.1em] text-[13px] disabled:opacity-70 group shadow-lg active:scale-[0.98]"
            >
              {isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? t('establishConn') : mode === 'register' ? t('regProfile') : 'Send Link'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {mode === 'login' && (
            <div className="mt-10">
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black"><span className="bg-white px-4 text-slate-500">{t('directConnect')}</span></div>
              </div>

              <button 
                onClick={() => alert("Check .env for GOOGLE_CLIENT_ID configuration.")}
                className="w-full bg-white hover:bg-slate-50 text-slate-900 py-4.5 rounded-xl font-bold text-[12px] uppercase tracking-[0.1em] flex items-center justify-center gap-3 transition-all shadow-sm active:scale-[0.98]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-slate-200 text-center">
            <p className="text-slate-500 text-xs font-semibold">
              {mode === 'login' ? t('instRequest') : mode === 'register' ? t('alreadyNetwork') : 'Remembered your key?'}
              <button 
                onClick={() => {
                  if (mode === 'login') setMode('register');
                  else setMode('login');
                  setError('');
                  setSuccess('');
                }}
                className="text-indigo-400 font-bold ml-2 hover:text-indigo-300 transition-colors uppercase tracking-[0.05em]"
              >
                {mode === 'login' ? t('initReg') : t('retPortal')}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
