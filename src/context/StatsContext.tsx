import React, { createContext, useContext, useState, useEffect } from 'react';

export type StatsData = {
  opportunities: string;
  contractValue: string;
  growth: string;
  insights: string;
  mode: 'auto' | 'manual';
  lastUpdatedAt: number;
};

const defaultStats: StatsData = {
  opportunities: "142,281",
  contractValue: "€4.2B+",
  growth: "+45%",
  insights: "12K+",
  mode: 'auto',
  lastUpdatedAt: Date.now()
};

// Helper: Safely mutates numeric cores inside formatted strings
function mutateString(str: string, mutator: (val: number) => number) {
  const match = str.match(/^([^\d]*)((?:\d|,|\.)+)([^\d]*)$/);
  if (!match) return str;
  const prefix = match[1];
  const numStr = match[2];
  const suffix = match[3];
  
  const isFloat = numStr.includes('.') && !numStr.includes(',');
  const isComma = numStr.includes(',');
  const value = parseFloat(numStr.replace(/,/g, ''));
  if (isNaN(value)) return str;
  
  const newVal = mutator(value);
  let formatted = '';
  if (isFloat) {
    const decimals = numStr.split('.')[1]?.length || 1;
    formatted = newVal.toFixed(decimals);
  } else if (isComma) {
    formatted = Math.round(newVal).toLocaleString('en-US');
  } else {
    formatted = Math.round(newVal).toString();
  }
  return `${prefix}${formatted}${suffix}`;
}

// Applies realistic daily growth logic
function applyAutoGrowth(stats: StatsData, days: number): StatsData {
  if (days <= 0) return stats;
  let s = { ...stats };
  
  for (let i = 0; i < Math.min(days, 30); i++) { // cap at max 30 days calculations
    // Opportunities: +0.2% to +1%
    s.opportunities = mutateString(s.opportunities, val => val * (1 + (Math.random() * 0.008 + 0.002)));
    
    // ContractValue: steady slow increase
    s.contractValue = mutateString(s.contractValue, val => val + (Math.random() * 0.03 + 0.01));
    
    // Growth: fluctuate ±1-3%, keep between 1% and 99%
    s.growth = mutateString(s.growth, val => Math.max(1, Math.min(val + (Math.random() * 4 - 2), 99)));

    // Insights: small daily increment
    s.insights = mutateString(s.insights, val => val + (Math.random() * 0.4 + 0.1));
  }
  
  s.lastUpdatedAt = Date.now();
  return s;
}

interface StatsContextType {
  stats: StatsData;
  updateStats: (newStats: StatsData) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<StatsData>(defaultStats);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load from local storage and trigger auto-update if active
  useEffect(() => {
    const saved = localStorage.getItem('tendersense_stats');
    if (saved) {
      try {
        let parsed = JSON.parse(saved);
        parsed = { ...defaultStats, ...parsed }; // Merge safe defaults
        
        // Intelligent auto-update layer
        if (parsed.mode === 'auto' && parsed.lastUpdatedAt) {
          const hoursPassed = (Date.now() - parsed.lastUpdatedAt) / (1000 * 60 * 60);
          if (hoursPassed >= 24) {
            const daysPassed = Math.floor(hoursPassed / 24);
            parsed = applyAutoGrowth(parsed, daysPassed);
            localStorage.setItem('tendersense_stats', JSON.stringify(parsed));
            console.log(`[StatsContext] AI Auto-mode scaled stats forward by ${daysPassed} days.`);
          }
        }
        
        setStats(parsed);
        console.log('[StatsContext] Successfully loaded from storage');
      } catch (e) {
        console.error("[StatsContext] Failed to parse saved stats, using defaults", e);
      }
    }
  }, []);

  const updateStats = (newStats: StatsData) => {
    // If we transition to auto, sync timestamp
    if (newStats.mode === 'auto' && stats.mode !== 'auto') {
      newStats.lastUpdatedAt = Date.now();
    }
    setStats(newStats);
    localStorage.setItem('tendersense_stats', JSON.stringify(newStats));
  };


  // Secret keyboard shortcut: Ctrl+Shift+E (or Cmd+Shift+E on Mac)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Extensive debug log for any shift+ctrl combo if debugging is needed
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        console.log(`[StatsContext] Modifier combination detected. Key pressed: ${e.key}`);
      }

      // Allow overriding default keybindings across all OS types
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        console.log('[StatsContext] Admin panel explicitly triggered via global shortcut');
        setIsModalOpen(prev => !prev);
      }
    };

    // Use capturing phase to ensure it intercepts regardless of focus or stopPropagation
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, []);

  return (
    <StatsContext.Provider value={{ stats, updateStats, isModalOpen, setIsModalOpen }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}
