import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      verify();
    }
  }, [token]);

  const verify = async () => {
    try {
      const response = await fetch(`/api/auth/verify/${token}`);
      const data = await response.json();
      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.error);
      }
    } catch (err) {
      setStatus('error');
      setMessage('Failed to connect to the verification server.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_70%)] pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-200 text-center relative z-10"
      >
        <div className="mb-10 flex justify-center">
          {status === 'loading' && (
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse"></div>
              <Loader2 size={64} className="text-slate-900 animate-spin relative z-10" />
            </div>
          )}
          {status === 'success' && (
            <div className="p-6 bg-emerald-500/10 rounded-full border border-emerald-500/20 shadow-2xl">
              <CheckCircle2 size={64} className="text-emerald-400" />
            </div>
          )}
          {status === 'error' && (
            <div className="p-6 bg-red-500/10 rounded-full border border-red-500/20 shadow-2xl">
              <AlertCircle size={64} className="text-red-400" />
            </div>
          )}
        </div>

        <h1 className="text-4xl font-black mb-6 text-slate-900 uppercase tracking-tighter leading-tight">
          {status === 'loading' ? 'Verifying Identity' : status === 'success' ? 'Identity Verified' : 'Verification Failed'}
        </h1>
        <p className="text-slate-500 mb-12 font-medium italic text-lg leading-relaxed">
          {status === 'loading' ? 'Connecting to the central neural authentication registry...' : message}
        </p>

        {status === 'success' && (
          <Link 
            to="/auth" 
            className="w-full bg-white text-slate-900 py-6 rounded-2xl font-black flex items-center justify-center gap-4 transition-all uppercase tracking-[0.2em] text-[13px] shadow-2xl active:scale-95 group"
          >
            Access Portal
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        )}

        {status === 'error' && (
          <Link 
            to="/auth" 
            className="inline-block text-indigo-400 font-black uppercase tracking-[0.3em] text-[11px] hover:text-slate-900 transition-colors underline underline-offset-8 decoration-slate-800"
          >
            Return to Authentication
          </Link>
        )}
      </motion.div>
    </div>
  );
}
