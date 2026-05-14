import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, Info, AlertTriangle, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { StorageService, Notification } from "../services/storageService";
import { cn } from "../lib/utils";
import { useLanguage } from "../context/LanguageContext";

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const loadNotifications = () => {
      setNotifications(StorageService.getNotifications());
    };

    loadNotifications();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("notificationsUpdated", loadNotifications);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("notificationsUpdated", loadNotifications);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    StorageService.markNotificationAsRead(id);
    setNotifications(StorageService.getNotifications());
  };

  const handleMarkAllAsRead = () => {
    StorageService.markAllNotificationsAsRead();
    setNotifications(StorageService.getNotifications());
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return <Info size={16} className="text-blue-400" />;
      case "alert":
        return <AlertTriangle size={16} className="text-orange-400" />;
      case "success":
        return <CheckCircle size={16} className="text-emerald-400" />;
    }
  };

  const getBgColor = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return "bg-blue-500/10 border-blue-500/20";
      case "alert":
        return "bg-orange-500/10 border-orange-500/20";
      case "success":
        return "bg-emerald-500/10 border-emerald-500/20";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-center w-[38px] h-[38px] rounded-xl transition-all duration-300 border active:scale-95",
          isOpen
            ? "bg-slate-50 text-slate-900 border-slate-300"
            : "hover:bg-white text-slate-400 hover:text-slate-900 border-transparent hover:border-slate-200",
        )}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full shadow-sm border-2 border-white"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden z-50 origin-top-right"
          >
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900 tracking-wide">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-[10px] uppercase tracking-widest font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                >
                  <Check size={12} /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No notifications yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-800/50">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 transition-colors hover:bg-slate-50/50 flex gap-4 relative group",
                        !notification.read ? "bg-slate-50/20" : "",
                      )}
                    >
                      {!notification.read && (
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1 h-8 bg-indigo-500 rounded-r-full"></div>
                      )}

                      <div
                        className={cn(
                          "w-10 h-10 rounded-full border flex items-center justify-center shrink-0",
                          getBgColor(notification.type),
                        )}
                      >
                        {getIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4
                          className={cn(
                            "text-sm font-bold truncate pr-6",
                            !notification.read
                              ? "text-slate-900"
                              : "text-slate-600",
                          )}
                        >
                          {notification.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2">
                          {new Date(notification.date).toLocaleDateString()}
                        </p>
                      </div>

                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="absolute right-4 top-4 p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                          title="Mark as read"
                        >
                          <Check size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
