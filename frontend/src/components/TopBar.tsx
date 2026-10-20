import React from 'react';
import { Globe, Shield } from 'lucide-react';
import { SystemSettings } from '../types';

interface TopBarProps {
  language: 'hi' | 'en';
  setLanguage: (lang: 'hi' | 'en') => void;
  settings?: SystemSettings | null;
}

export const TopBar: React.FC<TopBarProps> = ({ language, setLanguage }) => {
  return (
    <div className="bg-[#0f2d57] border-b border-blue-900 py-1.5 px-4 text-xs text-white">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        {/* Left Side: Brand & Tagline */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
          <span className="inline-flex items-center gap-1.5 font-bold text-amber-300">
            <Shield className="w-3.5 h-3.5" />
            <span>
              {language === 'hi' ? 'सम्मोहन — घोषणा एवं परियोजना अनुश्रवण' : 'Sammohana — Announcement & Project Tracking'}
            </span>
          </span>
          <span className="text-blue-300/60 hidden sm:inline">|</span>
          <span className="text-blue-100 font-medium">
            {language === 'hi' ? 'बिहार सरकार · संवेदनशील एवं जवाबदेह शासन' : 'Government of Bihar · Transparent Governance'}
          </span>
        </div>

        {/* Right Side: Language Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition rounded px-2 py-0.5 border border-white/20">
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'hi' | 'en')}
              className="bg-transparent text-xs font-semibold text-white outline-none cursor-pointer"
            >
              <option value="hi" className="text-gray-900">हिंदी (Hindi)</option>
              <option value="en" className="text-gray-900">English</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
