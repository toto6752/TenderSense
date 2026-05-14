import React from 'react';
import { Search, User, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import NotificationsDropdown from './NotificationsDropdown';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <header className="h-auto min-h-[5rem] py-3 lg:py-0 lg:h-20 border-b border-slate-200/60 bg-slate-50/80 backdrop-blur-xl sticky top-0 z-[100] px-4 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-4">
      <div className="w-full lg:flex-1 lg:max-w-2xl lg:mr-8 order-2 lg:order-1">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder={t('headerSearch')}
            className="w-full bg-white border border-slate-200 rounded-full py-2.5 pl-12 pr-6 text-sm focus:bg-slate-50 focus:border-indigo-500/50 transition-all duration-300 outline-none text-slate-900 placeholder:text-slate-500 shadow-sm"
          />
        </div>
      </div>

      <div className="w-full lg:w-auto flex items-center justify-between lg:justify-end gap-4 md:gap-6 order-1 lg:order-2">
        <div className="flex items-center gap-2">
          {onMenuToggle && (
            <button 
              onClick={onMenuToggle}
              className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-slate-900"
            >
              <Menu size={24} />
            </button>
          )}
          <LanguageSwitcher />
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <NotificationsDropdown />

          <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>
          
          <Link to="/profile" className="flex items-center gap-3 sm:gap-4 group cursor-pointer text-left sm:pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-[13px] font-medium text-slate-700 leading-tight truncate max-w-[120px] group-hover:text-slate-900 transition-colors duration-300">
                {user?.email.split('@')[0]}
              </p>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide mt-0.5 group-hover:text-slate-400 transition-colors">Business Account</p>
            </div>
            <div className="relative">
              <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden ring-2 ring-transparent group-hover:ring-slate-200 transition-all duration-300 shadow-md">
                {user?.email.substring(0, 2).toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#10B981] border-2 border-white rounded-full"></div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
