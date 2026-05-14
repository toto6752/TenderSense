import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Search, 
  MessageSquare, 
  Settings, 
  LogOut,
  TrendingUp,
  Crown
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { BrandLogo } from './BrandLogo';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ isMobileOpen = false, onCloseMobile }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  // Close mobile sidebar on route change
  useEffect(() => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  }, [location.pathname, onCloseMobile]);

  const navItems = [
    { icon: LayoutDashboard, label: t('dashboard') || "Dashboard", path: '/dashboard' },
    { icon: Search, label: t('findTenders') || "Tenders", path: '/tenders' },
    { icon: FileText, label: t('myBids') || "Document Analysis", path: '/ai' },
    { icon: MessageSquare, label: t('aiAssistant') || "AI Chat", path: '/ai' },
    { icon: TrendingUp, label: "My Applications", path: '/tenders' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm lg:hidden lg:pointer-events-none"
          onClick={onCloseMobile}
        />
      )}
      
      <aside 
        className={cn(
          "h-[100dvh] bg-slate-50 border-r border-slate-200 transition-transform duration-300 flex flex-col z-[110] overflow-hidden fixed top-0 left-0 lg:sticky lg:translate-x-0 w-[260px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          !isMobileOpen && isCollapsed ? "lg:w-16" : ""
        )}
      >
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        {!isCollapsed ? (
          <Link to="/" className="flex items-center gap-3 text-slate-900">
            <BrandLogo className="w-6 h-6 text-slate-900" />
            <span className="text-sm font-semibold tracking-tight">TenderSense</span>
          </Link>
        ) : (
          <div className="w-6 h-6 mx-auto">
            <BrandLogo className="w-6 h-6 text-slate-900" />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col py-4">
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all group",
                  isActive 
                    ? "bg-slate-200/50 text-slate-900 font-medium" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                )}
              >
                <item.icon size={16} className={cn(isActive ? "text-slate-900" : "text-slate-500 group-hover:text-slate-900 transition-colors")} />
                {!isCollapsed && <span className="text-sm tracking-tight">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-4 space-y-1">
          {!isCollapsed && (
            <div className="mb-4 p-4 bg-white rounded-lg border border-slate-200 mx-1">
               <div className="flex items-center gap-2 mb-2">
                 <Crown size={14} className="text-amber-500" />
                 <span className="text-xs font-semibold text-slate-900">Pro Plan</span>
               </div>
               
               <div className="space-y-1">
                 <div className="flex justify-between items-center text-[11px] text-slate-500">
                    <span>{t('analysesLeft') || "Analyses"}</span>
                    <span className="font-medium text-slate-900">45 / ∞</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-slate-900 w-[80%]"></div>
                 </div>
               </div>
            </div>
          )}

          <Link
            to="/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all text-sm"
          >
            <Settings size={16} />
            {!isCollapsed && <span className="tracking-tight">{t('settings') || "Settings"}</span>}
          </Link>
        </div>
      </div>
    </aside>
    </>
  );
}
