/**
 * StorageService handles persistence for user data like saved tenders and analysis history.
 * Uses localStorage for client-side storage.
 */

export interface AnalyzedTender {
  id: string;
  title: string;
  date: string;
  type: 'file' | 'manual';
  fileName?: string;
}

export interface SavedTender {
  id: string;
  title: string;
  organization: string;
  budget: string;
  deadline: string;
  dateSaved: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'alert' | 'success';
  date: string;
  read: boolean;
}

const ANALYZED_TENDERS_KEY = 'tendersense_analyzed_history';
const SAVED_TENDERS_KEY = 'tendersense_saved_tenders';
const SUBSCRIPTION_KEY = 'tendersense_subscription_pro';
const DAILY_USAGE_KEY = 'tendersense_daily_usage';
const NOTIFICATIONS_KEY = 'tendersense_notifications';

export const FREE_PLAN_LIMIT = 3;

export const StorageService = {
  // Notifications
  getNotifications(): Notification[] {
    try {
      const data = localStorage.getItem(NOTIFICATIONS_KEY);
      if (!data) {
        // Init with some mock data for the demo
        const initial: Notification[] = [
          { id: '1', title: 'New Tender Match', message: 'IT Infrastructure upgrade for local government matches your profile.', type: 'info', date: new Date().toISOString(), read: false },
          { id: '2', title: 'Deadline Reminder', message: 'Submission for "Cloud Migration Services" is due in 3 days.', type: 'alert', date: new Date(Date.now() - 86400000).toISOString(), read: false }
        ];
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  markNotificationAsRead(id: string) {
    const notifs = this.getNotifications();
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("notificationsUpdated"));
  },

  markAllNotificationsAsRead() {
    const notifs = this.getNotifications();
    const updated = notifs.map(n => ({ ...n, read: true }));
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("notificationsUpdated"));
  },

  addNotification(notification: Omit<Notification, 'id' | 'date' | 'read'>) {
    const notifs = this.getNotifications();
    const newNotif: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      read: false
    };
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([newNotif, ...notifs]));
    window.dispatchEvent(new Event("notificationsUpdated"));
  },

  // Subscription
  isPro(): boolean {
    return localStorage.getItem(SUBSCRIPTION_KEY) === 'true';
  },

  setPro(status: boolean) {
    localStorage.setItem(SUBSCRIPTION_KEY, status.toString());
  },

  // Usage Tracking
  getDailyUsageCount(): number {
    const data = localStorage.getItem(DAILY_USAGE_KEY);
    if (!data) return 0;
    
    const { count, lastDate } = JSON.parse(data);
    const today = new Date().toDateString();
    
    if (lastDate !== today) {
      this.resetDailyUsage();
      return 0;
    }
    
    return count;
  },

  incrementUsageCount() {
    const count = this.getDailyUsageCount();
    const today = new Date().toDateString();
    localStorage.setItem(DAILY_USAGE_KEY, JSON.stringify({
      count: count + 1,
      lastDate: today
    }));
  },

  resetDailyUsage() {
    localStorage.setItem(DAILY_USAGE_KEY, JSON.stringify({
      count: 0,
      lastDate: new Date().toDateString()
    }));
  },

  canPerformAnalysis(): boolean {
    if (this.isPro()) return true;
    return this.getDailyUsageCount() < FREE_PLAN_LIMIT;
  },

  // Analyzed Tenders History
  getAnalyzedHistory(): AnalyzedTender[] {
    const data = localStorage.getItem(ANALYZED_TENDERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  recordAnalysis(title: string, type: 'file' | 'manual', fileName?: string) {
    const history = this.getAnalyzedHistory();
    const newEntry: AnalyzedTender = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      date: new Date().toISOString(),
      type,
      fileName
    };
    
    // Keep only last 20 for history
    const updatedHistory = [newEntry, ...history].slice(0, 20);
    localStorage.setItem(ANALYZED_TENDERS_KEY, JSON.stringify(updatedHistory));
  },

  // Saved Tenders
  getSavedTenders(): SavedTender[] {
    const data = localStorage.getItem(SAVED_TENDERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  isSaved(tenderId: string): boolean {
    const saved = this.getSavedTenders();
    return saved.some(t => t.id === tenderId);
  },

  toggleSave(tender: { id: string; title: string; organization: string; budget: string; deadline: string }) {
    const saved = this.getSavedTenders();
    const isAlreadySaved = saved.some(t => t.id === tender.id);
    
    let updated: SavedTender[];
    if (isAlreadySaved) {
      updated = saved.filter(t => t.id !== tender.id);
    } else {
      updated = [{ ...tender, dateSaved: new Date().toISOString() }, ...saved];
    }
    
    localStorage.setItem(SAVED_TENDERS_KEY, JSON.stringify(updated));
    return !isAlreadySaved;
  },

  getStats() {
    return {
      analyzedCount: this.getAnalyzedHistory().length,
      savedCount: this.getSavedTenders().length
    };
  }
};
