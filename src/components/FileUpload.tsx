import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

interface FileUploadProps {
  onUpload?: (file: File) => void;
  onClose?: () => void;
}

export default function FileUpload({ onUpload, onClose }: FileUploadProps) {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    setError(null);
    if (selectedFile.type !== 'application/pdf') {
      setError(t('pdfOnly'));
      return;
    }
    setFile(selectedFile);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const simulateUpload = () => {
    if (!file) return;
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      if (onUpload) onUpload(file);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative border-2 border-dashed rounded-[40px] p-12 lg:p-20 transition-all flex flex-col items-center justify-center text-center",
          isDragging 
            ? "border-indigo-500 bg-indigo-600/5" 
            : "border-slate-200 bg-slate-50 hover:bg-white/80"
        )}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={onFileSelect}
          accept=".pdf"
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-indigo-400 shadow-inner group-hover:text-indigo-300 transition-colors">
                <Upload size={36} />
              </div>
              <div className="space-y-3">
                <p className="text-lg font-bold text-slate-900 uppercase tracking-[0.15em] leading-none">{t('dropRfp')}</p>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.2em] italic">{t('maxSize')}</p>
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-10 py-4 bg-white text-slate-900 text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-xl"
              >
                {t('selectManually')}
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="selected"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm space-y-8"
            >
              <div className="p-8 bg-white rounded-3xl border border-slate-200 flex items-center gap-6 relative overflow-hidden group shadow-2xl">
                <div className="h-14 w-14 bg-slate-50 text-indigo-400 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                  <FileText size={28} />
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <p className="text-sm font-bold text-slate-900 truncate leading-tight mb-1">{file.name}</p>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">{(file.size / (1024 * 1024)).toFixed(2)} MB • {t('ready')}</p>
                </div>
                <button 
                  onClick={() => setFile(null)}
                  className="p-3 text-slate-600 hover:text-red-500 transition-colors bg-slate-50/50 rounded-xl"
                >
                  <X size={20} />
                </button>
              </div>

              {isUploading ? (
                <div className="space-y-6">
                  <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ x: '-100%' }}
                      animate={{ x: '0%' }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                      className="h-full bg-indigo-500 w-full shadow-sm"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 animate-pulse">
                    <Loader2 size={16} className="animate-spin text-indigo-400" />
                    {t('neuralIngestion')}
                  </p>
                </div>
              ) : (
                <button 
                  onClick={simulateUpload}
                  className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95 group"
                >
                  <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
                  {t('establishSignal')}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-8 left-0 right-0 flex justify-center px-10"
            >
              <div className="bg-red-500/10 border border-red-500/20 px-6 py-2.5 rounded-full flex items-center gap-3 text-red-500 shadow-lg">
                <AlertCircle size={16} />
                <span className="text-[11px] font-black uppercase tracking-[0.1em]">{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {onClose && (
        <p className="text-center pt-4">
          <button 
            onClick={onClose}
            className="text-[11px] font-bold text-slate-500 underline underline-offset-8 decoration-slate-800 hover:text-slate-900 hover:decoration-slate-500 transition-all uppercase tracking-[0.2em]"
          >
            {t('cancelReturn')}
          </button>
        </p>
      )}
    </div>
  );
}
