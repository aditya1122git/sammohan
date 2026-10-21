import React from 'react';
import { Home, Database, BarChart3 } from 'lucide-react';

interface FooterProps {
  onOpenSection: (section: 'form' | 'table' | 'reports') => void;
  language: 'hi' | 'en';
}

export const Footer: React.FC<FooterProps> = ({ onOpenSection, language }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0f2d57] text-white pt-10 pb-6 border-t-2 border-[#f97316] mt-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          {/* Column 1: Brand & Description (7 Cols) */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-xl">
                <img
                  src="/images/bihar-government-logo.png"
                  alt="बिहार सरकार"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div>
                <div className="text-2xl font-black text-[#f97316] font-serif leading-none">सम्मोहन</div>
                <div className="text-xs font-bold text-blue-200 mt-0.5">
                  {language === 'hi'
                    ? 'घोषणा एवं परियोजना अनुश्रवण डैशबोर्ड — बिहार सरकार'
                    : 'Announcement & Project Tracking Dashboard — Govt. of Bihar'}
                </div>
              </div>
            </div>

            <p className="text-blue-100/90 text-xs sm:text-sm leading-relaxed max-w-xl text-justify sm:text-left">
              {language === 'hi'
                ? 'माननीय मुख्यमंत्री की घोषणाओं, 48 विभागों की अवसंरचना योजनाओं, वित्तीय आवंटन और ज़मीनी प्रगति के पारदर्शी व समयबद्ध अनुश्रवण के लिए एकीकृत राज्य प्लेटफ़ॉर्म।'
                : 'An integrated state platform engineered for transparent intake, milestone verification, budget utilization, and progress oversight across all 38 districts of Bihar.'}
            </p>
            {language === 'hi' && (
              <div className="flex items-center gap-2 text-xs text-amber-300 font-medium">
                <span>ध्येय वाक्य:</span>
                <span className="italic font-bold">
                  "सम्मोहन से सिद्धि तक — संवेदनशील एवं जवाबदेह शासन।"
                </span>
              </div>
            )}
          </div>

          {/* Column 2: Useful Navigation Links (5 Cols) */}
          <div className="md:col-span-5 md:pl-8">
            <h5 className="font-bold text-xs uppercase tracking-wider text-amber-300 mb-3 border-b border-blue-800 pb-2">
              {language === 'hi' ? 'त्वरित अनुश्रवण लिंक' : 'Quick Navigation'}
            </h5>
            <ul className="space-y-2.5 text-xs text-blue-100">
              <li>
                <button
                  onClick={scrollToTop}
                  className="hover:text-white hover:underline flex items-center gap-2 text-left transition group"
                >
                  <Home className="w-3.5 h-3.5 text-blue-300 group-hover:text-amber-300" />
                  <span>{language === 'hi' ? 'मुख्य पृष्ठ (Home)' : 'Home'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenSection('table')}
                  className="hover:text-white hover:underline flex items-center gap-2 text-left transition group"
                >
                  <Database className="w-3.5 h-3.5 text-blue-300 group-hover:text-amber-300" />
                  <span>{language === 'hi' ? 'परियोजना डेटाबेस रजिस्टर (Projects Database)' : 'Projects Database'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenSection('reports')}
                  className="hover:text-white hover:underline flex items-center gap-2 text-left transition group"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-blue-300 group-hover:text-amber-300" />
                  <span>{language === 'hi' ? 'वित्तीय एवं भौतिक रिपोर्ट (Reports & Analytics)' : 'Reports & Analytics'}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Line */}
        <div className="pt-6 border-t border-blue-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-200/80 gap-3">
          <div>
            &copy; {new Date().getFullYear()} {language === 'hi' ? 'बिहार सरकार। सर्वाधिकार सुरक्षित।' : 'Government of Bihar. All rights reserved.'}
          </div>
          <div className="text-[11px] text-blue-300 font-mono">
            Sammohan Announcement & Project Tracking System v2.0
          </div>
        </div>
      </div>
    </footer>
  );
};
