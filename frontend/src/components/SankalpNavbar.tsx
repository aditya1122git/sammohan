import React, { useState } from 'react';
import { Home, Info, Building2, ArrowUpRight, Menu, X, Shield, Images, Phone } from 'lucide-react';

interface SankalpNavbarProps {
  currentTab: 'home' | 'about' | 'gallery' | 'contact';
  onSelectTab: (tab: 'home' | 'about' | 'gallery' | 'contact') => void;
  language: 'hi' | 'en';
  onToggleLanguage: (lang: 'hi' | 'en') => void;
  onOpenLogin: () => void;
  onOpenGallery?: () => void;
  isLoggedIn?: boolean;
  onOpenDashboard?: () => void;
}

export const SankalpNavbar: React.FC<SankalpNavbarProps> = ({
  currentTab,
  onSelectTab,
  language,
  onToggleLanguage,
  onOpenLogin,
  onOpenGallery,
  isLoggedIn,
  onOpenDashboard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as const, icon: Home, hi: 'होम', en: 'Home' },
    { id: 'about' as const, icon: Building2, hi: 'विभाग (48)', en: 'Departments (48)' },
    { id: 'gallery' as const, icon: Images, hi: 'फोटो गैलरी', en: 'Photo Gallery' },
    { id: 'contact' as const, icon: Phone, hi: 'संपर्क', en: 'Contact' },
  ];

  const handleItemClick = (id: 'home' | 'about' | 'gallery' | 'contact') => {
    onSelectTab(id);
    if (id === 'gallery' && onOpenGallery) {
      onOpenGallery();
    } else if (id === 'about') {
      const el = document.getElementById('overview-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (id === 'contact') {
      const el = document.getElementById('footer-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#18327b] text-white shadow-md border-b border-white/10 transition-colors w-full">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 w-full">
          
          {/* 1. Left: Official Sammohan Logo & Brand Title */}
          <div className="flex items-center gap-3 min-w-0 md:w-[230px] lg:w-[260px] flex-shrink-0">
            <button
              onClick={() => handleItemClick('home')}
              className="flex items-center gap-3 text-left group focus:outline-none min-w-0"
            >
              <img
                src="/images/sammohan-logo.png"
                alt="सम्मोहन Logo"
                className="h-10 sm:h-12 w-auto object-contain drop-shadow"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
               <div className="leading-tight min-w-0">
                 <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#f97316] group-hover:text-[#fb923c] transition-colors drop-shadow-sm font-sans whitespace-nowrap">
                  {language === 'hi' ? 'सम्मोहन' : 'Sammohan'}
                </div>
                 <div className="text-[10px] sm:text-[11px] font-bold text-amber-200/90 tracking-wide uppercase truncate">
                  {language === 'hi' ? 'माननीय मुख्यमंत्री का सम्मोहन डैशबोर्ड' : "Hon'ble CM's Sammohan Dashboard"}
                </div>
              </div>
            </button>
          </div>

          {/* 2. Center: Navigation Pills (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/[0.08] border border-white/15 backdrop-blur-md flex-shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`flex items-center justify-center gap-1.5 h-8 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    item.id === 'home'
                      ? 'w-[68px]'
                      : item.id === 'about'
                        ? 'w-[126px]'
                        : item.id === 'gallery'
                          ? 'w-[104px]'
                          : 'w-[82px]'
                  } ${
                    isActive
                      ? 'bg-[#f59e0b] text-slate-900 shadow-md scale-100 font-bold'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${
                      isActive ? 'text-slate-900' : 'text-amber-300'
                    }`}
                  />
                  <span>{language === 'hi' ? item.hi : item.en}</span>
                </button>
              );
            })}
          </nav>

          {/* 3. Right: Bihar Emblem, Language Selector & Login CTA */}
          <div className="hidden lg:flex items-center justify-end gap-2 w-[260px] xl:w-[375px] flex-shrink-0">
            {/* Official Bihar Emblem */}
            <div className="hidden xl:flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl shadow-sm border border-gray-100 flex-shrink-0">
              <img
                src="/images/bihar-government-logo.png"
                alt="बिहार सरकार"
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <div className="text-right leading-none">
                <div className="text-[10px] font-black text-slate-900">बिहार सरकार</div>
                <div className="text-[8px] font-semibold text-slate-500">Govt. of Bihar</div>
              </div>
            </div>

            {/* Language Switcher Segmented Control */}
            <div className="flex items-center bg-white/10 p-0.5 rounded-lg border border-white/20 text-[11px] font-bold flex-shrink-0">
              <button
                type="button"
                onClick={() => onToggleLanguage('hi')}
                className={`w-[45px] py-1 rounded-md transition-all ${
                  language === 'hi'
                    ? 'bg-white text-[#18327b] shadow-sm'
                    : 'text-blue-100 hover:text-white'
                }`}
              >
                हिंदी
              </button>
              <button
                type="button"
                onClick={() => onToggleLanguage('en')}
                className={`w-[58px] py-1 rounded-md transition-all ${
                  language === 'en'
                    ? 'bg-white text-[#18327b] shadow-sm'
                    : 'text-blue-100 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            {/* Login Button */}
            {isLoggedIn ? (
              <button
                type="button"
                onClick={onOpenDashboard}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-2.5 py-2 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 w-[145px] flex-shrink-0"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-800/40 flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="text-left leading-tight">
                  <div className="text-xs font-black uppercase tracking-wider">
                    {language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
                  </div>
                  <div className="text-[9px] text-emerald-100 font-medium">
                    {language === 'hi' ? 'सक्रिय सत्र' : 'Active Session'}
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 ml-0.5 text-white" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-bold px-2.5 py-2 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 w-[145px] flex-shrink-0"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-900/15 flex items-center justify-center">
                  <Building2 className="w-3.5 h-3.5 text-slate-900" />
                </div>
                <div className="text-left leading-tight">
                  <div className="text-xs font-black uppercase tracking-wider">
                    {language === 'hi' ? 'लॉगिन' : 'Login'}
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 ml-0.5 text-slate-900" />
              </button>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2 flex-shrink-0 z-20">
            <button
              type="button"
              onClick={() => onToggleLanguage(language === 'hi' ? 'en' : 'hi')}
              className="px-2 py-1 text-xs font-bold rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
            >
              {language === 'hi' ? 'EN' : 'हिं'}
            </button>
            <button
              type="button"
              onClick={isLoggedIn ? onOpenDashboard : onOpenLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs shadow-sm transition active:scale-95"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{isLoggedIn ? (language === 'hi' ? 'डैशबोर्ड' : 'Dashboard') : (language === 'hi' ? 'लॉगिन' : 'Login')}</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white focus:outline-none transition"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#132761] border-t border-white/10 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleItemClick(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold ${
                    isActive
                      ? 'bg-amber-400 text-slate-900'
                      : 'bg-white/5 text-blue-100 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{language === 'hi' ? item.hi : item.en}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (isLoggedIn && onOpenDashboard) {
                  onOpenDashboard();
                } else {
                  onOpenLogin();
                }
              }}
              className="w-full flex items-center justify-center gap-3 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold p-3 rounded-xl shadow-md"
            >
              <Building2 className="w-5 h-5" />
              <span>
                {isLoggedIn
                  ? language === 'hi' ? 'डैशबोर्ड में प्रवेश करें' : 'Enter Dashboard'
                  : language === 'hi' ? 'लॉगिन' : 'Login'}
              </span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
