import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  Search,
  ChevronDown,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Settings,
  Layers,
  FilePlus2,
  TableProperties,
  BarChart3,
  Menu,
  X,
  Building2,
  IndianRupee,
  Phone,
  Compass
} from 'lucide-react';
import { User } from '../types';
import { getRoleLabel, getUserDisplayName } from '../utils/userDisplay';

interface BiharGovHeaderProps {
  currentUser: User | null;
  language: 'hi' | 'en';
  onToggleLanguage: (lang: 'hi' | 'en') => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenSection: (section: 'form' | 'table' | 'reports' | 'admin') => void;
  onGoHome: () => void;
  onSearch?: (query: string) => void;
  activeNav?: string;
}

export const BiharGovHeader: React.FC<BiharGovHeaderProps> = ({
  currentUser,
  language,
  onToggleLanguage,
  onOpenLogin,
  onLogout,
  onOpenSection,
  onGoHome,
  onSearch,
  activeNav = 'home',
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchVal.trim()) {
      onSearch(searchVal.trim());
    } else {
      onOpenSection('table');
    }
  };

  return (
    <header className="relative bg-white border-b border-slate-200/90 sticky top-0 z-50 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-[70px] flex items-center justify-between gap-3 sm:gap-6">
        
        {/* ========================================================= */}
        {/* LEFT: Official Bodhi Tree Seal + Government Typography     */}
        {/* ========================================================= */}
        <div
          onClick={onGoHome}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group flex-shrink-0 select-none"
        >
          <img
            src="/images/bihar_bodhi_seal_blue.png"
            alt="बिहार सरकार"
            className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-2xs"
            onError={(e) => {
              // Fallback to existing seal
              (e.currentTarget as HTMLImageElement).src = '/images/bihar-government-logo.png';
            }}
          />
          <div className="flex flex-col text-left leading-tight">
            <span className="text-xl sm:text-2xl font-black text-[#18327b] tracking-tight font-serif drop-shadow-sm">
              {language === 'hi' ? 'बिहार सरकार' : 'Government of Bihar'}
            </span>
            <span className="text-[10px] sm:text-[11px] font-extrabold text-[#0f2b48] tracking-wider mt-0.5 drop-shadow-2xs">
              {language === 'hi' ? 'विकास • विश्वास • प्रगति' : 'Development • Trust • Progress'}
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT: Home Button + Search Pill + Language + User Profile */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          {/* 1. Home / मुख्य पृष्ठ Button (Moved to right corner) */}
          <button
            type="button"
            onClick={onGoHome}
            className={`flex items-center gap-1.5 transition-all cursor-pointer px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-bold shadow-2xs ${
              activeNav === 'home'
                ? 'bg-white/90 text-[#18327b] border border-slate-200/90 font-black shadow-xs'
                : 'bg-white/75 hover:bg-white text-slate-800 hover:text-[#18327b] border border-slate-200/60'
            }`}
          >
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#18327b] text-[#18327b]" />
            <span className="drop-shadow-2xs">{language === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}</span>
          </button>

          {/* 2. Search Box Pill */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative hidden md:flex items-center rounded-full bg-slate-50 border border-slate-200 focus-within:border-[#18327b] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#18327b]/20 px-3 py-1.5 w-32 sm:w-44 transition shadow-2xs"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5 flex-shrink-0" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder={language === 'hi' ? 'खोजें...' : 'Search...'}
              className="text-xs bg-transparent focus:outline-none text-slate-800 placeholder-slate-400 w-full font-medium"
            />
          </form>

          {/* 2. Language Dropdown Selector */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-[#18327b] px-2 py-1 rounded-md transition cursor-pointer"
            >
              <span>{language === 'hi' ? 'हिंदी' : 'English'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-28 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-xs font-semibold animate-fadeIn">
                <button
                  type="button"
                  onClick={() => {
                    onToggleLanguage('hi');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                    language === 'hi' ? 'text-[#18327b] font-bold bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>हिंदी</span>
                  {language === 'hi' && <span className="w-1.5 h-1.5 rounded-full bg-[#18327b]" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onToggleLanguage('en');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                    language === 'en' ? 'text-[#18327b] font-bold bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>English</span>
                  {language === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-[#18327b]" />}
                </button>
              </div>
            )}
          </div>

          <span className="text-slate-300 select-none">|</span>

          {/* 3. User Profile Circular Avatar Button */}
          <div className="relative" ref={dropdownRef}>
            {currentUser ? (
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-9 h-9 rounded-full bg-[#18327b] hover:bg-[#12245b] text-white flex items-center justify-center transition shadow-xs cursor-pointer ring-2 ring-transparent hover:ring-blue-300"
                title={`${getUserDisplayName(currentUser.name)} — ${getRoleLabel(currentUser.role)}`}
              >
                <UserIcon className="w-4 h-4 text-white" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="w-9 h-9 rounded-full bg-[#18327b] hover:bg-[#12245b] text-white flex items-center justify-center transition shadow-xs cursor-pointer ring-2 ring-transparent hover:ring-blue-300"
                title={language === 'hi' ? 'अधिकारी लॉगिन' : 'Officer Login'}
              >
                <UserIcon className="w-4 h-4 text-white" />
              </button>
            )}

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && currentUser && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-fadeIn text-xs">
                {/* User Info Header */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-2">
                  <div className="font-bold text-slate-900 text-sm">{getUserDisplayName(currentUser.name)}</div>
                  <div className="text-slate-500 text-[11px] font-mono mt-0.5">{currentUser.email}</div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-100 text-[#18327b] font-black text-[10px] mt-2">
                    <ShieldCheck className="w-3 h-3 text-[#18327b]" />
                    <span>{getRoleLabel(currentUser.role)}</span>
                  </div>
                </div>

                {/* Quick Action Links */}
                <div className="space-y-1">
                  {currentUser.role !== 'READONLY' && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenSection('form');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-2 font-semibold"
                    >
                      <FilePlus2 className="w-3.5 h-3.5 text-orange-500" />
                      <span>{language === 'hi' ? 'नई घोषणा प्रविष्टि' : '+ New Announcement'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onOpenSection('table');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-2 font-semibold"
                  >
                    <TableProperties className="w-3.5 h-3.5 text-[#18327b]" />
                    <span>{language === 'hi' ? 'परियोजना रजिस्टर (11 क्षेत्र)' : 'Project Register (11 Fields)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenSection('reports');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-2 font-semibold"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'hi' ? 'एनालिटिक्स एवं रिपोर्ट' : 'Analytics & Reports'}</span>
                  </button>

                  {currentUser.role === 'ADMIN' && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenSection('admin');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-amber-50 text-amber-900 flex items-center gap-2 font-bold"
                    >
                      <Settings className="w-3.5 h-3.5 text-amber-600" />
                      <span>{language === 'hi' ? 'प्रशासनिक सेटिंग्स' : 'Admin Settings'}</span>
                    </button>
                  )}
                </div>

                {/* Logout Button */}
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 flex items-center gap-2 font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'सत्र समाप्त करें (लॉगआउट)' : 'Sign Out'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 4. Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* ========================================================= */}
      {/* MOBILE DRAWER MENU                                        */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg animate-fadeIn text-sm font-semibold">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder={language === 'hi' ? 'खोजें...' : 'Search...'}
              className="text-xs bg-transparent focus:outline-none w-full"
            />
          </form>

          {/* Links */}
          <div className="pt-1">
            <button
              onClick={() => { onGoHome(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800 flex items-center gap-2 font-bold"
            >
              <Home className="w-4 h-4 text-[#18327b]" />
              <span>{language === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}</span>
            </button>
          </div>

          {/* User action in mobile */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            {currentUser ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-slate-700">{getUserDisplayName(currentUser.name)} — {getRoleLabel(currentUser.role)}</span>
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  {language === 'hi' ? 'लॉगआउट' : 'Sign Out'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }}
                className="w-full py-2 bg-[#18327b] text-white rounded-xl text-center text-xs font-bold"
              >
                {language === 'hi' ? 'अधिकारी लॉगिन' : 'Officer Login'}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
