import { create } from 'zustand';
import { MOCK_TENDERS } from '../data';
import { StorageService, AnalyzedTender, SavedTender } from '../services/storageService';

interface GlobalState {
  isInitialized: boolean;
  isLoading: boolean;
  tenders: any[];
  savedTenders: SavedTender[];
  analysisHistory: AnalyzedTender[];
  stats: {
    analyzed: number;
    saved: number;
    won: number;
    winRate: string;
    isPro: boolean;
    usage: number;
  };
  initialize: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  saveTender: (tender: any) => void;
  unsaveTender: (id: string) => void;
  addAnalysisEntry: (entry: Omit<AnalyzedTender, 'id' | 'date'>) => void;
  addGeneratedTender: (tender: any) => void;
}

export const useStore = create<GlobalState>((set, get) => ({
  isInitialized: false,
  isLoading: true,
  tenders: [],
  savedTenders: [],
  analysisHistory: [],
  stats: {
    analyzed: 0,
    saved: 0,
    won: 4,
    winRate: '33%',
    isPro: false,
    usage: 0,
  },

  initialize: async () => {
    set({ isLoading: true });
    // Simulate network delay for realistic SaaS feel
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const s = StorageService.getStats();
    
    set({
      tenders: MOCK_TENDERS,
      savedTenders: StorageService.getSavedTenders(),
      analysisHistory: StorageService.getAnalyzedHistory(),
      stats: {
        analyzed: s.analyzedCount,
        saved: s.savedCount,
        won: 4,
        winRate: '33%',
        isPro: StorageService.isPro(),
        usage: StorageService.getDailyUsageCount(),
      },
      isInitialized: true,
      isLoading: false,
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  saveTender: (tender) => {
    const saved = StorageService.getSavedTenders();
    if (!saved.some(t => t.id === tender.id)) {
        StorageService.toggleSave(tender);
    }
    const updatedStats = StorageService.getStats();
    set({ 
      savedTenders: StorageService.getSavedTenders(),
      stats: { ...get().stats, saved: updatedStats.savedCount } 
    });
  },

  unsaveTender: (id) => {
    const saved = StorageService.getSavedTenders();
    const tender = saved.find(t => t.id === id);
    if (tender) {
        StorageService.toggleSave(tender);
    }
    const updatedStats = StorageService.getStats();
    set({ 
      savedTenders: StorageService.getSavedTenders(),
      stats: { ...get().stats, saved: updatedStats.savedCount } 
    });
  },
  
  addAnalysisEntry: (entry) => {
    StorageService.recordAnalysis(entry.title, entry.type, entry.fileName);
    const updatedStats = StorageService.getStats();
    set({
      analysisHistory: StorageService.getAnalyzedHistory(),
      stats: {
        ...get().stats,
        analyzed: updatedStats.analyzedCount,
        usage: StorageService.getDailyUsageCount()
      }
    });
  },

  addGeneratedTender: (tender) => {
    set({ tenders: [tender, ...get().tenders] });
  }
}));
