import React, { useState } from 'react';
import { Home, Menu, X, ChevronDown, FileText, Database, BarChart3, Shield, MapPin, Sparkles, Layers } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User | null;
  onOpenSection: (section: 'form' | 'table' | 'reports' | 'master' | 'admin') => void;
  language: 'hi' | 'en';
  onGoHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenSection,
  language,
  onGoHome
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);

  return (
    <nav className="bg-[#18327b] text-white shadow-md sticky top-0 z-40 border-t border-blue-800">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-12">
        {/* Home icon button */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              if (onGoHome) onGoHome();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-2 hover:bg-[#12245b] rounded transition text-white"
            title="Home"
          >
            <Home className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm tracking-wide hidden sm:inline-block px-2 border-l border-blue-400">
            {language === 'hi' ? 'सम्मोहन डैशबोर्ड' : 'Sammohana Dashboard'}
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-1 text-sm font-medium">
          {/* Services Dropdown */}
          <div className="relative">
            <button
              onClick={() => setServicesDropdown(!servicesDropdown)}
              onMouseEnter={() => setServicesDropdown(true)}
              className="flex items-center gap-1 px-3 py-2 rounded hover:bg-[#12245b] transition"
            >
              <Layers className="w-4 h-4 text-amber-300" />
              <span>{language === 'hi' ? 'परियोजना सेवाएं' : 'Project Services'}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {servicesDropdown && (
              <div
                onMouseLeave={() => setServicesDropdown(false)}
                className="absolute top-full left-0 mt-0.5 w-64 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn"
              >
                <button
                  onClick={() => {
                    onOpenSection('form');
                    setServicesDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs sm:text-sm hover:bg-orange-50 hover:text-[#ea580c] flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-[#ea580c]"></span>
                  {language === 'hi' ? 'नई घोषणा / परियोजना जोड़ें' : 'New Announcement / Project'}
                </button>
                <button
                  onClick={() => {
                    onOpenSection('table');
                    setServicesDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs sm:text-sm hover:bg-blue-50 hover:text-[#18327b] flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-[#18327b]"></span>
                  {language === 'hi' ? 'परियोजना डेटाबेस व स्थिति खोज' : 'Project Database & Status'}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => onOpenSection('table')}
            className="flex items-center gap-1.5 px-3 py-2 rounded hover:bg-[#12245b] transition"
          >
            <Database className="w-4 h-4 text-blue-200" />
            <span>{language === 'hi' ? 'परियोजना डेटाबेस' : 'Project Database'}</span>
          </button>

          <button
            onClick={() => onOpenSection('reports')}
            className="flex items-center gap-1.5 px-3 py-2 rounded hover:bg-[#12245b] transition"
          >
            <BarChart3 className="w-4 h-4 text-emerald-300" />
            <span>{language === 'hi' ? 'रिपोर्ट्स एवं एनालिटिक्स' : 'Reports & Analytics'}</span>
          </button>

          <button
            onClick={() => onOpenSection('master')}
            className="flex items-center gap-1.5 px-3 py-2 rounded hover:bg-[#12245b] transition"
          >
            <MapPin className="w-4 h-4 text-yellow-300" />
            <span>{language === 'hi' ? 'बिहार मास्टर डेटा' : 'Bihar Master Data (38 Districts)'}</span>
          </button>

          {currentUser && currentUser.role === 'ADMIN' && (
            <button
              onClick={() => onOpenSection('admin')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg text-xs font-bold transition shadow-sm ml-2"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'प्रशासन (Admin)' : 'Admin Panel'}</span>
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded hover:bg-[#12245b] text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#12245b] px-4 pt-2 pb-4 space-y-2 border-t border-blue-900 text-sm">
          <button
            onClick={() => {
              onOpenSection('form');
              setIsOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded hover:bg-[#18327b] flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>{language === 'hi' ? 'नई घोषणा / परियोजना' : 'New Project Announcement'}</span>
          </button>

          <button
            onClick={() => {
              onOpenSection('table');
              setIsOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded hover:bg-[#18327b] flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            <span>{language === 'hi' ? 'परियोजना डेटाबेस' : 'Project Database'}</span>
          </button>

          <button
            onClick={() => {
              onOpenSection('reports');
              setIsOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded hover:bg-[#18327b] flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>{language === 'hi' ? 'रिपोर्ट्स एवं एनालिटिक्स' : 'Reports & Analytics'}</span>
          </button>

          <button
            onClick={() => {
              onOpenSection('master');
              setIsOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded hover:bg-[#18327b] flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            <span>{language === 'hi' ? 'बिहार मास्टर डेटा' : 'Bihar Master Data'}</span>
          </button>

          {currentUser && currentUser.role === 'ADMIN' && (
            <button
              onClick={() => {
                onOpenSection('admin');
                setIsOpen(false);
              }}
              className="w-full text-left py-2 px-3 bg-amber-500 text-slate-900 rounded font-bold flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>{language === 'hi' ? 'एडमिन पैनल' : 'Admin Panel'}</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
