import React, { useState, useEffect } from 'react';
import { User as UserIcon, Lock, ArrowLeft, Shield, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api';
import { User, SystemSettings } from '../types';

interface SankalpLoginProps {
  onLoginSuccess: (user: User) => void;
  onBackToLanding: () => void;
  language: 'hi' | 'en';
  setLanguage: (lang: 'hi' | 'en') => void;
  settings?: SystemSettings | null;
}

export const SankalpLogin: React.FC<SankalpLoginProps> = ({
  onLoginSuccess,
  onBackToLanding,
  language,
  setLanguage,
  settings,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      image: '/images/login_slides/vaishali_stupa.jpg',
      tag: {
        hi: 'विश्व का प्रथम गणतंत्र • ऐतिहासिक धरोहर',
        en: "World's First Republic • Historical Heritage",
      },
      title: {
        hi: 'वैशाली: लोकतंत्र एवं शांति की जननी',
        en: 'Vaishali: The Cradle of Democracy & Peace',
      },
      subtitle: {
        hi: 'भगवान बुद्ध की पावन कर्मभूमि एवं सम्राट अशोक का ऐतिहासिक सिंह स्तंभ — बिहार की अमर सांस्कृतिक धरोहर।',
        en: 'Sacred land of Lord Buddha & the historic Ashoka Lion Pillar — timeless cultural heritage of Bihar.',
      },
    },
    {
      image: '/images/login_slides/golghar_patna.jpg',
      tag: {
        hi: 'राजधानी पटना का भव्य ऐतिहासिक प्रतीक',
        en: 'Iconic Monument of Capital Patna',
      },
      title: {
        hi: 'गोलघर: वास्तुकला एवं समृद्ध इतिहास',
        en: 'Golghar: Architectural Wonder & History',
      },
      subtitle: {
        hi: 'गंगा तट पर स्थित 1786 का ऐतिहासिक वास्तुशिल्प — पटना के गौरवशाली अतीत एवं वर्तमान का जीवंत साक्षी।',
        en: "Iconic 1786 architectural marvel on the banks of Ganga — standing witness to Patna's glorious past and present.",
      },
    },
    {
      image: '/images/login_slides/sabhyata_dwar.jpg',
      tag: {
        hi: 'ज्ञान, सद्भाव एवं सुशासन का द्वार',
        en: 'Gateway to Knowledge, Harmony & Governance',
      },
      title: {
        hi: 'सभ्यता द्वार: बिहार के पुनर्जागरण का प्रतीक',
        en: "Sabhyata Dwar: Symbol of Bihar's Renaissance",
      },
      subtitle: {
        hi: 'मौर्य काल, बौद्ध दर्शन एवं आधुनिक विकसित बिहार के संकल्प को समर्पित भव्य गंगातट स्मारक।',
        en: 'Grand riverfront monument dedicated to the Mauryan legacy, Buddhist philosophy & visionary modern Bihar.',
      },
    },
    {
      image: '/images/hero/1.jpg',
      tag: {
        hi: 'सम्मोहन • 38 जिलों का एकीकृत अनुश्रवण',
        en: 'Sammohan • 38 Districts Unified Monitoring',
      },
      title: {
        hi: "Chief Minister's Office — Command & Control Center",
        en: "Chief Minister's Office — Command & Control Center",
      },
      subtitle: {
        hi: 'राज्य के समग्र विकास, परियोजना अनुश्रवण, विभागीय प्रदर्शन एवं जनसमस्या निवारण का एकीकृत नियंत्रण केंद्र।',
        en: 'Centralized monitoring, analytics, and projects tracking portal for the state of Bihar.',
      },
    },
  ];

  // Auto-rotate slides every 5 seconds if playing
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError(language === 'hi' ? 'कृपया उपयोगकर्ता नाम और पासवर्ड दर्ज करें।' : 'Please enter username and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.login({ email: username, password });
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0b1b44] text-gray-800">
      
      {/* 1. Left Hero Branding Pane with Dynamic Heritage Slideshow */}
      <div className="md:w-1/2 relative min-h-[550px] md:min-h-screen flex flex-col justify-between overflow-hidden border-r border-white/10 text-white p-6 sm:p-10 lg:p-12 select-none">
        
        {/* Background Slides with smooth fade */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlideIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title[language]}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}

        {/* Transparent Elegant Tint for High Quality Slide Visibility and Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040e29]/80 via-[#0b1f54]/40 to-[#07163c]/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040e29]/75 via-transparent to-transparent pointer-events-none" />

        {/* Top Header Row with Return Button & Language Toggle */}
        <div className="flex items-center justify-between z-20 relative">
          <button
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 text-blue-100 hover:text-white transition backdrop-blur-md border border-white/20 active:scale-95 shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'सम्मोहन पोर्टल पर वापस जाएँ' : 'Back to Sammohan Portal'}</span>
          </button>

          {/* Language Toggle */}
          <div className="flex items-center bg-black/40 backdrop-blur-md p-0.5 rounded-lg border border-white/20 text-xs font-bold shadow-md">
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-0.5 rounded transition cursor-pointer ${
                language === 'hi' ? 'bg-[#f97316] text-white shadow-xs font-extrabold' : 'text-blue-100 hover:text-white'
              }`}
            >
              हिं
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-0.5 rounded transition cursor-pointer ${
                language === 'en' ? 'bg-[#f97316] text-white shadow-xs font-extrabold' : 'text-blue-100 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Center Content: Seal, Sammohan Branding, and Current Slide Info */}
        <div className="my-auto py-8 z-20 relative flex flex-col items-start max-w-xl">
          {/* Top Emblem Row */}
          <div className="flex items-center gap-4 mb-5">
            <div className="bg-white/15 p-2.5 rounded-2xl border border-white/25 backdrop-blur-md shadow-lg">
              <img
                src="/images/bihar-government-logo.png"
                alt="Seal of Bihar"
                className="h-14 sm:h-16 w-auto object-contain filter drop-shadow-md"
              />
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-[#f97316] font-serif tracking-tight drop-shadow-md">
                सम्मोहन
              </div>
              <div className="text-[11px] sm:text-xs uppercase tracking-widest text-sky-200 font-semibold">
                Government of Bihar • बिहार सरकार
              </div>
            </div>
          </div>

          {/* Slide Tag / Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 backdrop-blur-md text-amber-300 text-xs font-bold tracking-wide mb-3 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>{slides[currentSlideIndex].tag[language]}</span>
          </div>

          {/* Slide Title */}
          <h1 className="text-2xl sm:text-3.5xl font-extrabold text-white tracking-tight leading-tight mb-2.5 drop-shadow-md">
            {slides[currentSlideIndex].title[language]}
          </h1>

          {/* Slide Subtitle */}
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed drop-shadow-sm max-w-lg mb-6">
            {slides[currentSlideIndex].subtitle[language]}
          </p>
        </div>

        {/* Bottom Feature Badges */}
        <div className="z-20 relative pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs text-blue-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>256-bit Secure TLS</span>
            </div>
          </div>
          <div className="text-[11px] text-blue-300/80 font-medium">
            CMO Bihar Digital Governance Suite
          </div>
        </div>

      </div>

      {/* 2. Right Authentication Form Pane */}
      <div className="md:w-1/2 bg-[#f8fafc] p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
        
        <div className="max-w-md mx-auto w-full my-auto">
          
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome To Sammohan
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Please enter your credentials to access the portal.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Username / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#18327b] focus:ring-2 focus:ring-[#18327b]/20 text-sm font-medium text-slate-900 bg-white transition outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-300 focus:border-[#18327b] focus:ring-2 focus:ring-[#18327b]/20 text-sm font-medium text-slate-900 bg-white transition outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute inset-y-0 right-0 px-3.5 flex items-center text-slate-400 hover:text-[#18327b] transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#13234d] hover:bg-[#1a3068] active:bg-[#0e1a3a] text-white font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In Securely</span>
              )}
            </button>
          </form>

        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 pt-6 mt-auto">
          © 2026 Sammohan Portal. All rights reserved.
        </div>

      </div>

    </div>
  );
};
