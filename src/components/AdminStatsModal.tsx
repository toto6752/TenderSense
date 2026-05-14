import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Settings, Bot, Hand } from 'lucide-react';
import { useStats, StatsData } from '../context/StatsContext';

export default function AdminStatsModal() {
  const { stats, updateStats, isModalOpen, setIsModalOpen } = useStats();
  const [formData, setFormData] = React.useState<StatsData>(stats);

  React.useEffect(() => {
    if (isModalOpen) setFormData(stats);
  }, [isModalOpen, stats]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStats(formData);
    setIsModalOpen(false);
  };

  const handleChange = (field: keyof StatsData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleModeToggle = (mode: 'auto' | 'manual') => {
    setFormData(prev => ({ ...prev, mode }));
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsModalOpen(false)} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white border border-slate-300 rounded-3xl shadow-sm overflow-hidden"
          >
            <div className="px-6 py-5 bg-slate-50/50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Settings size={20} />
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold tracking-tight">Data Configuration</h3>
                  <p className="text-slate-500 text-xs font-medium">Update homepage statistics</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-full transition-colors"
                title="Close Panel"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              {/* Intelligent Mode Toggle */}
              <div className="bg-slate-50 border border-slate-300/50 rounded-xl p-1 flex relative">
                <button
                  type="button"
                  onClick={() => handleModeToggle('auto')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-bold transition-all duration-300 z-10 ${formData.mode === 'auto' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-600'}`}
                >
                  <Bot size={16} />
                  Auto (AI Mode)
                </button>
                <button
                  type="button"
                  onClick={() => handleModeToggle('manual')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-bold transition-all duration-300 z-10 ${formData.mode === 'manual' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-600'}`}
                >
                  <Hand size={16} />
                  Manual
                </button>
                
                {/* Active Highlight Slider */}
                <div 
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-slate-50 border border-slate-600/50 rounded-lg shadow-sm transition-transform duration-300"
                  style={{ transform: formData.mode === 'auto' ? 'translateX(4px)' : 'translateX(calc(100% + 4px))' }}
                />
              </div>

              {formData.mode === 'auto' && (
                <div className="px-3 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs text-indigo-300 flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">ℹ️</span>
                  <p className="leading-relaxed">AI mode naturally scales these statistics forward every 24 hours to simulate realistic traction. Growth remains strictly within logical bounds.</p>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Active Opportunities (Growth limit: +0.2% - 1% daily)
                </label>
                <input 
                  type="text" 
                  value={formData.opportunities}
                  onChange={(e) => handleChange('opportunities', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500/50 shadow-inner"
                  placeholder="e.g. 142,281"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Total Value
                </label>
                <input 
                  type="text" 
                  value={formData.contractValue}
                  onChange={(e) => handleChange('contractValue', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500/50 shadow-inner"
                  placeholder="e.g. €4.2B+"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Average Win Rate (Max range: 1% - 99%)
                </label>
                <input 
                  type="text" 
                  value={formData.growth}
                  onChange={(e) => handleChange('growth', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500/50 shadow-inner"
                  placeholder="e.g. +45%"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Daily Interactions
                </label>
                <input 
                  type="text" 
                  value={formData.insights}
                  onChange={(e) => handleChange('insights', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500/50 shadow-inner"
                  placeholder="e.g. 12K+"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-slate-900 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-sm active:scale-95"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
