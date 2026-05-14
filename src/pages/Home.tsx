import { Shield, Zap, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useStats } from '../context/StatsContext';
import AnimatedStat from '../components/AnimatedStat';
import TenderMarketplace from '../components/TenderMarketplace';
import { HeroSection } from '../components/blocks/hero-section-5';
import { BrandLogo } from '../components/BrandLogo';

export default function Home() {
  const { t } = useLanguage();
  const { stats } = useStats();
  
  return (
    <div className="bg-white text-slate-900 font-sans min-h-screen selection:bg-indigo-100 relative overflow-hidden">
      
      <HeroSection />

      {/* Stats - Refined Borders and Clean look */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        id="features" 
        className="py-24 relative overflow-hidden bg-slate-50 border-y border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          {/* Trust Factor: Live Market Data Pill */}
          <div className="flex flex-col items-center justify-center mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Live Market Data</span>
              <span className="text-slate-300">|</span>
              <span className="text-[10px] font-medium text-slate-400">
                Last updated: {new Date(stats.lastUpdatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 text-center">
            {[
              { label: t('activeOpp') || 'ACTIVE OPPORTUNITIES', value: stats.opportunities },
              { label: t('totalVal') || 'TOTAL VALUE', value: stats.contractValue },
              { label: t('avgWin') || 'AVERAGE WIN RATE', value: stats.growth },
              { label: t('dailyInt') || 'DAILY INTERACTIONS', value: stats.insights },
            ].map((stat, i) => (
              <div 
                key={i} 
                className="group cursor-default flex flex-col items-center justify-center p-8 rounded-[2rem] bg-white border border-slate-200 hover:border-indigo-200 transition-all duration-500 shadow-sm hover:shadow-md relative overflow-hidden"
              >                
                <p className="text-4xl lg:text-5xl font-black mb-2 text-slate-900 group-hover:text-indigo-600 transition-colors duration-300 tracking-tighter relative z-10">
                  <AnimatedStat value={stat.value} />
                </p>
                <p className="text-[10px] text-slate-500 group-hover:text-indigo-500 font-bold uppercase tracking-[0.2em] transition-colors relative z-10">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        id="solution" 
        className="py-32 px-6 lg:px-12 max-w-7xl mx-auto relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
          {[
            {
              title: t('neuralRfpT') || 'Neural RFP Parsing',
              description: t('neuralRfpD') || 'Extract requirements, scoring matrices, and hidden criteria with sub-second latency.',
              icon: Zap
            },
            {
              title: t('globalChainT') || 'Global Context',
              description: t('globalChainD') || 'Cross-reference international supply chains and multi-language tender databases.',
              icon: Globe
            },
            {
              title: t('advCompT') || 'Advanced Security',
              description: t('advCompD') || 'Enterprise standards for total isolation. Zero sharing of your proprietary proposal data.',
              icon: Shield
            }
          ].map((feature, i) => (
            <div key={i} className="group flex flex-col items-start">
              <div className="w-12 h-12 bg-slate-100 text-slate-900 rounded-lg flex items-center justify-center mb-6 border border-slate-200">
                <feature.icon size={24} />
              </div>
              <h4 className="text-xl font-semibold mb-3 tracking-tight text-slate-900">{feature.title}</h4>
              <p className="text-slate-600 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Live Tender Marketplace */}
      <TenderMarketplace />

      {/* Footer */}
      <footer className="pt-24 pb-12 px-6 md:px-12 relative overflow-hidden bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
          <BrandLogo className="w-8 h-8 text-slate-900" withText />
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-slate-900 transition-colors">{t('privacy') || 'Privacy & Terms'}</a>
            <a href="#" className="hover:text-slate-900 transition-colors">{t('integrity') || 'Security'}</a>
            <a href="#" className="hover:text-slate-900 transition-colors">{t('apiDocs') || 'API Docs'}</a>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-500">
              {t('allRights') || '© 2026 TenderSense. All rights reserved.'}
            </p>
            <button 
              className="w-5 h-5 rounded opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-slate-600 hover:text-indigo-400 cursor-pointer"
              title="Admin Panel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

