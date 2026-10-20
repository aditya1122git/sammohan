import React from 'react';
import { User as UserIcon, LogOut, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  language: 'hi' | 'en';
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenLogin,
  onLogout,
  language
}) => {
  return (
    <header className="bg-white py-3 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Brand Section: Bihar Government Seal + Sammohana Wordmark */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap justify-center sm:justify-start">
          <div className="flex items-center gap-2.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <img
              src="/images/bihar-government-logo.png"
              alt="बिहार सरकार"
              className="h-11 w-auto object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="text-left leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black text-[#f97316] font-serif tracking-tight">
                सम्मोहन
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md">
                {language === 'hi' ? 'परियोजना अनुश्रवण' : 'Project Tracking'}
              </span>
            </div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">
              {language === 'hi'
                ? 'घोषणा एवं परियोजना अनुश्रवण डैशबोर्ड — बिहार सरकार'
                : 'Announcement & Project Tracking Dashboard — Govt. of Bihar'}
            </div>
          </div>
        </div>

        {/* User / Login Action */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#18327b] text-white flex items-center justify-center font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left text-xs">
                <div className="font-bold text-gray-900 leading-none">{currentUser.name}</div>
                <div className="text-[#18327b] font-semibold text-[11px] flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-amber-500" />
                  {currentUser.role}
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Logout"
                className="ml-2 text-gray-500 hover:text-red-600 p-1 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-2 bg-[#18327b] hover:bg-[#12245b] text-white px-5 py-2 rounded-full font-semibold text-xs sm:text-sm shadow-md transition duration-200 transform hover:-translate-y-0.5"
            >
              <UserIcon className="w-4 h-4" />
              <span>{language === 'hi' ? 'अधिकारी लॉगिन' : 'Officer Login'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
