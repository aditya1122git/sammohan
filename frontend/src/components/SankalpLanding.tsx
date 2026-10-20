import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Shield,
  Megaphone,
  Building,
  Building2,
  Network,
  IndianRupee,
  MapPin,
  AlertTriangle,
  FileText,
  Layers,
  Activity,
  ExternalLink,
  Home,
  CheckCircle2,
  Clock,
  TrendingUp,
  BarChart3,
  CheckCircle,
  FolderOpen,
  Compass,
  Phone,
  Search,
  Filter
} from 'lucide-react';
import { SankalpNavbar } from './SankalpNavbar';
import { SankalpMap } from './SankalpMap';
import { ProjectStats, ProjectAnnouncement } from '../types';
import { BIHAR_48_DEPARTMENTS, BiharDepartment } from '../data/biharDepartments';

interface SankalpLandingProps {
  onOpenLogin: () => void;
  onOpenGallery: () => void;
  onOpenDashboard: () => void;
  isLoggedIn: boolean;
  currentUser: any;
  language: 'hi' | 'en';
  onToggleLanguage: (lang: 'hi' | 'en') => void;
  onOpenModule?: (moduleKey: string) => void;
  projectStats?: ProjectStats | null;
  onOpenTableWithTab?: (tab: 'all' | 'ongoing' | 'completed' | 'delayed') => void;
  onSelectDistrict?: (districtName: string) => void;
  projects?: ProjectAnnouncement[];
  onSelectProject?: (project: ProjectAnnouncement) => void;
  onDeleteProject?: (project: ProjectAnnouncement) => void;
  onOpenNewForm?: () => void;
}

export const SankalpLanding: React.FC<SankalpLandingProps> = ({
  onOpenLogin,
  onOpenGallery,
  onOpenDashboard,
  isLoggedIn,
  currentUser,
  language,
  onToggleLanguage,
  onOpenModule,
  projectStats,
  onOpenTableWithTab,
  onSelectDistrict,
  projects = [],
  onSelectProject,
  onDeleteProject,
  onOpenNewForm
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSlidePaused, setIsSlidePaused] = useState(false);
  const [currentTab, setCurrentTab] = useState<'home' | 'about' | 'gallery' | 'contact'>('home');
  const [deptSearch, setDeptSearch] = useState('');
  const [deptCategory, setDeptCategory] = useState<'all' | 'admin' | 'infra' | 'welfare' | 'agri' | 'edu'>('all');

  // Official Governance Hero Slides (from https://www.dashboard.bihar.gov.in/landing/index.html#intro)
  const heroSlides = [
    {
      image: '/images/hero/1.jpg',
      focus: '52% 18%',
      badgeHi: 'एकीकृत सूचना एवं अनुश्रवण प्लेटफ़ॉर्म',
      badgeEn: 'Integrated information and monitoring platform',
      titleHi1: 'बिहार को नई दिशा,',
      titleHi2: 'निर्णयों से विकास को गति...',
      titleEn1: 'A new direction for Bihar,',
      titleEn2: 'decisions that speed up development...',
      bodyHi:
        'बिहार के सभी जिलों से जुड़ी विकास की हर प्रगति, हर विभाग का प्रदर्शन और हर महत्वपूर्ण परियोजना — एकीकृत प्लेटफ़ॉर्म पर, रियल-टाइम अनुश्रवण के साथ',
      bodyEn:
        'Every development milestone from every district of Bihar, every department’s performance and every major project — on one integrated platform, with real-time monitoring',
    },
    {
      image: '/images/hero/2.jpg',
      focus: '48% 20%',
      badgeHi: 'सभी विभाग, एकीकृत अनुश्रवण, स्पष्ट दिशा',
      badgeEn: 'Every department, integrated monitoring, clear direction',
      titleHi1: 'प्रगति पर दृष्टि,',
      titleHi2: 'परिवर्तन को गति...',
      titleEn1: 'Eyes on progress,',
      titleEn2: 'momentum for change...',
      bodyHi:
        'विभागीय बजट, लक्ष्यों और प्रतिबद्धताओं का एकीकृत अनुश्रवण — बिहार की प्रगति की एकीकृत तस्वीर',
      bodyEn:
        'Integrated monitoring of departmental budgets, targets and commitments — one picture of Bihar’s progress',
    },
    {
      image: '/images/hero/3.jpg',
      focus: '47% 22%',
      badgeHi: 'परिकल्पना से परिणाम तक',
      badgeEn: 'From vision to results',
      titleHi1: 'संकल्प से',
      titleHi2: 'उपलब्धि तक',
      titleEn1: 'From resolve',
      titleEn2: 'to achievement',
      bodyHi:
        'माननीय मुख्यमंत्री की घोषणाओं, मंत्रिमंडल के निर्णयों और समीक्षा बैठकों के निर्देशों की स्वीकृति से लेकर धरातलीय प्रभाव तक सतत अनुश्रवण।',
      bodyEn:
        'Continuous monitoring of the Hon\'ble Chief Minister\'s announcements, cabinet decisions and review-meeting directions, from approval to impact on the ground.',
    },
    {
      image: '/images/hero/4.jpg',
      focus: '70% 15%',
      badgeHi: 'सभी जिले, हर कोने तक अनुश्रवण',
      badgeEn: 'Every district, monitored to every corner',
      titleHi1: 'धरातल की स्थिति से',
      titleHi2: 'त्वरित जानकारी',
      titleEn1: 'Instant insight',
      titleEn2: 'from the ground',
      bodyHi:
        'अवसंरचना की प्रगति, निधि उपयोग और आपातकालीन सूचनाएँ — हर पल, तुरंत आपकी दृष्टि में',
      bodyEn:
        'Infrastructure progress, fund utilisation and emergency alerts — every moment, instantly in view',
    },
  ];

  // Filtered 48 Bihar Departments
  const filteredDepartments = React.useMemo(() => {
    return BIHAR_48_DEPARTMENTS.filter((dept) => {
      const matchesCat = deptCategory === 'all' || dept.category === deptCategory;
      const q = deptSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        dept.nameHi.toLowerCase().includes(q) ||
        dept.nameEn.toLowerCase().includes(q) ||
        dept.code.toLowerCase().includes(q) ||
        dept.summaryHi.toLowerCase().includes(q) ||
        dept.summaryEn.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [deptSearch, deptCategory]);

  // Auto advance slides every 6.5s (matching https://www.dashboard.bihar.gov.in/landing/index.html#intro)
  useEffect(() => {
    if (isSlidePaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [heroSlides.length, isSlidePaused]);

  const handleNavSelect = (tab: 'home' | 'about' | 'gallery' | 'contact') => {
    setCurrentTab(tab);
    if (tab === 'about') {
      const el = document.getElementById('overview-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'gallery') {
      onOpenGallery();
    } else if (tab === 'contact') {
      const el = document.getElementById('footer-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeSlide = heroSlides[currentSlide];

  // Map district counts for hover tooltip
  const districtCountsMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    if (projectStats?.districtBreakdown) {
      projectStats.districtBreakdown.forEach((item) => {
        map[item.name] = item.count;
      });
    }
    return map;
  }, [projectStats]);

  const totalAnnouncements = projectStats?.totalAnnouncements ?? 15;
  const ongoingProjects = projectStats?.ongoingProjects ?? 11;
  const completedProjects = projectStats?.completedProjects ?? 4;
  const delayedProjects = projectStats?.delayedProjects ?? 6;
  const totalSanctionedCr = projectStats?.totalSanctionedCr ?? 31789.77;
  const avgProgress = projectStats?.avgProgress ?? 68;

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-900 overflow-x-hidden w-full">
      
      {/* 1. Official Government Header (Sankalp Navbar) */}
      <SankalpNavbar
        currentTab={currentTab}
        onSelectTab={handleNavSelect}
        language={language}
        onToggleLanguage={onToggleLanguage}
        onOpenLogin={onOpenLogin}
        onOpenGallery={onOpenGallery}
        isLoggedIn={isLoggedIn}
        onOpenDashboard={onOpenDashboard}
      />

      {/* 2. Hero Section: Official Bihar Government Slide & 3D Map (https://www.dashboard.bihar.gov.in/landing/index.html#intro) */}
      <section
        id="intro"
        className="relative overflow-hidden bg-[#18327b] text-white min-h-[580px] sm:min-h-[660px] flex items-center group"
        onMouseEnter={() => setIsSlidePaused(true)}
        onMouseLeave={() => setIsSlidePaused(false)}
      >
        {/* Background Slide Image with Ken-Burns Animation & Object Positioning */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            key={activeSlide.image}
            src={activeSlide.image}
            alt=""
            className="hero-ken-burns absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
            style={{
              objectPosition: activeSlide.focus,
              transformOrigin: activeSlide.focus,
            }}
          />
          {/* Authentic Multi-stop Gradient Overlay from https://www.dashboard.bihar.gov.in/landing/index.html */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,50,123,0.95)_0%,rgba(41,72,160,0.85)_48%,rgba(113,55,131,0.28)_100%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_30%,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_28%_78%,rgba(249,115,22,0.18),transparent_32%)] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06122e]/85 via-transparent to-black/25 pointer-events-none" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Headings & Subtitles */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-semibold text-blue-100 backdrop-blur-md shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{language === 'hi' ? activeSlide.badgeHi : activeSlide.badgeEn}</span>
              </div>

              {/* Huge Bold Heading */}
              <div className="space-y-1">
                <div className="text-amber-400 font-extrabold text-xs sm:text-sm tracking-wider uppercase">
                  {language === 'hi' ? 'बिहार सरकार — संकल्प डैशबोर्ड' : 'Govt of Bihar — Sankalp Dashboard'}
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight font-serif drop-shadow-md">
                  <span className="block text-white">
                    {language === 'hi' ? activeSlide.titleHi1 : activeSlide.titleEn1}
                  </span>
                  <span className="block text-orange-300 mt-1 drop-shadow">
                    {language === 'hi' ? activeSlide.titleHi2 : activeSlide.titleEn2}
                  </span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-sm sm:text-base lg:text-lg text-blue-100 leading-relaxed max-w-2xl font-medium drop-shadow-sm">
                {language === 'hi' ? activeSlide.bodyHi : activeSlide.bodyEn}
              </p>

            </div>

            {/* Right Column: 3D Animated Bihar SVG Map with Chakra Wheel */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <SankalpMap
                language={language}
                districtCounts={districtCountsMap}
                onSelectDistrict={onSelectDistrict}
              />
            </div>

          </div>
        </div>

        {/* Carousel Bottom-Right Controls (Pills + Prev/Next buttons) */}
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3">
          {/* Indicator Pills */}
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            {heroSlides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrentSlide(dotIdx)}
                className={`transition-all duration-300 rounded-full h-2 cursor-pointer ${
                  dotIdx === currentSlide ? 'w-6 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
                title={`Slide ${dotIdx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
            }
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition active:scale-95 cursor-pointer shadow-md"
            aria-label="Previous Slide"
            title="पिछली स्लाइड"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
            }
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition active:scale-95 cursor-pointer shadow-md"
            aria-label="Next Slide"
            title="अगली स्लाइड"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </section>

      {/* 3. Overview Section (4 Key Metrics): Total announcements, ongoing, completed, delayed */}
      <section id="overview-section" className="relative -mt-10 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Announcements */}
          <div
            onClick={() => onOpenTableWithTab && onOpenTableWithTab('all')}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-slate-200/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {language === 'hi' ? 'कुल घोषणाएँ' : 'Total Announcements'}
              </div>
              <div className="text-3xl font-black text-slate-900 font-mono group-hover:text-[#18327b] transition-colors">
                {totalAnnouncements}
              </div>
              <div className="text-[11px] font-semibold text-amber-600 flex items-center gap-1">
                <span>{language === 'hi' ? 'समीक्षाधीन प्रतिबद्धताएं' : 'Monitored Commitments'}</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 group-hover:bg-amber-100 text-amber-600 flex items-center justify-center transition-colors flex-shrink-0">
              <Megaphone className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Ongoing Projects */}
          <div
            onClick={() => onOpenTableWithTab && onOpenTableWithTab('ongoing')}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-slate-200/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {language === 'hi' ? 'प्रगतिशील परियोजनाएँ' : 'Ongoing Projects'}
              </div>
              <div className="text-3xl font-black text-blue-700 font-mono group-hover:text-blue-900 transition-colors">
                {ongoingProjects}
              </div>
              <div className="text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'धरातलीय निर्माण जारी' : 'Under Active Execution'}</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 group-hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors flex-shrink-0">
              <Activity className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Completed Projects */}
          <div
            onClick={() => onOpenTableWithTab && onOpenTableWithTab('completed')}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-slate-200/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {language === 'hi' ? 'पूर्ण परियोजनाएँ' : 'Completed Projects'}
              </div>
              <div className="text-3xl font-black text-emerald-700 font-mono group-hover:text-emerald-900 transition-colors">
                {completedProjects}
              </div>
              <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'लोकार्पित एवं संचालित' : 'Commissioned & Handed Over'}</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 group-hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors flex-shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Delayed Projects */}
          <div
            onClick={() => onOpenTableWithTab && onOpenTableWithTab('delayed')}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-slate-200/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {language === 'hi' ? 'विलंबित परियोजनाएँ' : 'Delayed Projects'}
              </div>
              <div className="text-3xl font-black text-rose-600 font-mono group-hover:text-rose-800 transition-colors">
                {delayedProjects}
              </div>
              <div className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'बाधा निवारण प्रक्रियाधीन' : 'Hurdle Clearance in Progress'}</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 group-hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

        </div>
      </section>

      {/* 4. Bihar Government 48 Departments Section */}
      <section id="overview-section" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="space-y-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-[#ea580c] font-bold text-xs uppercase tracking-wide">
                <Building2 className="w-4 h-4" />
                <span>{language === 'hi' ? 'बिहार सरकार • सभी 48 प्रशासनिक विभाग' : 'Government of Bihar • All 48 Departments'}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-serif leading-tight">
                <span>{language === 'hi' ? 'बिहार के सभी 48 प्रशासनिक विभाग —' : 'All 48 Departments of Bihar —'}</span>{' '}
                <span className="text-[#ea580c] block sm:inline">
                  {language === 'hi' ? 'एकीकृत अनुश्रवण एवं समीक्षा' : 'Unified Monitoring & Governance'}
                </span>
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'hi'
                  ? 'माननीय मुख्यमंत्री के मार्गदर्शन में राज्य के सभी 48 विभागों की विकासात्मक योजनाओं, स्वीकृत बजट, भौतिक माइलस्टोन एवं जन-कल्याणकारी पहलों की निरंतर समीक्षा।'
                  : 'Comprehensive tracking of developmental schemes, allocations, physical progress, and citizen welfare delivery across all 48 administrative departments.'}
              </p>
            </div>

            {/* Search Input & Live Counter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <div className="relative min-w-[280px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={deptSearch}
                  onChange={(e) => setDeptSearch(e.target.value)}
                  placeholder={language === 'hi' ? 'विभाग खोजें (उदा. पथ, स्वास्थ्य, शिक्षा, GAD)...' : 'Search department (e.g. Health, Road)...'}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#18327b] shadow-xs"
                />
                {deptSearch && (
                  <button
                    onClick={() => setDeptSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[#18327b] text-xs font-bold text-center whitespace-nowrap shadow-xs">
                {language === 'hi' ? `${filteredDepartments.length} / 48 विभाग` : `${filteredDepartments.length} / 48 Departments`}
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', hi: 'सभी 48 विभाग', en: 'All 48 Depts', count: 48 },
              { id: 'admin', hi: 'प्रशासन एवं वित्त', en: 'Admin & Finance', count: 12 },
              { id: 'infra', hi: 'अवसंरचना एवं निर्माण', en: 'Infrastructure', count: 10 },
              { id: 'welfare', hi: 'स्वास्थ्य व सामाजिक कल्याण', en: 'Health & Welfare', count: 9 },
              { id: 'agri', hi: 'कृषि एवं ग्रामीण विकास', en: 'Agri & Rural', count: 8 },
              { id: 'edu', hi: 'शिक्षा, तकनीक व उद्योग', en: 'Education & Tech', count: 9 },
            ].map((cat) => {
              const isActive = deptCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setDeptCategory(cat.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-[#18327b] text-white shadow-md'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span>{language === 'hi' ? cat.hi : cat.en}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white font-mono' : 'bg-slate-100 text-slate-500 font-mono'}`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 48 Department Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredDepartments.map((dept) => {
              return (
                <article
                  key={dept.id}
                  className="group bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-[#18327b]/40 shadow-xs hover:shadow-lg transition-all duration-300 cursor-default flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center p-1 transition-all group-hover:scale-110 shadow-xs overflow-hidden">
                        <img
                          src={dept.logoUrl || `/images/departments/dept_${dept.id}.svg`}
                          alt={dept.nameHi}
                          className="w-full h-full object-contain filter drop-shadow-xs"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.onerror = null;
                            target.src = '/images/bihar-government-logo.png';
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 group-hover:bg-[#18327b] group-hover:text-white transition-colors">
                        #{String(dept.id).padStart(2, '0')}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#18327b] transition-colors leading-snug">
                        {language === 'hi' ? dept.nameHi : dept.nameEn}
                      </h3>
                      <div className="text-[11px] font-medium text-slate-400 mt-0.5">
                        {language === 'hi' ? dept.nameEn : dept.nameHi}
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {language === 'hi' ? dept.summaryHi : dept.summaryEn}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-[#ea580c] transition-colors">
                    <span>{language === 'hi' ? 'विभागीय समीक्षा' : 'Department Overview'}</span>
                    <i className="fa-solid fa-circle-info text-xs" aria-hidden="true" />
                  </div>
                </article>
              );
            })}
          </div>

        </div>
      </section>

      {/* Official Sammohan Footer */}
      <footer id="footer-section" className="bg-gradient-to-b from-[#18327b] to-[#0d1e4c] text-white pt-10 pb-8 mt-auto border-t border-blue-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Top Footer Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src="/images/sammohan-logo.png"
                  alt="Sammohan"
                  className="h-8 w-auto object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-xl font-black text-amber-400 font-serif">सम्मोहन | बिहार सरकार</span>
              </div>
              <div className="text-xs sm:text-sm font-medium text-blue-200">
                {language === 'hi'
                  ? 'माननीय मुख्यमंत्री का सम्मोहन डैशबोर्ड — बिहार के समग्र विकास की अनुश्रवण, समीक्षा और दिशा-निर्धारण के लिए एकीकृत प्लेटफ़ॉर्म'
                  : "Hon'ble Chief Minister's Sammohan Dashboard — an integrated platform for monitoring, review, and strategic guidance for Bihar’s overall development"}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-xl shadow self-start sm:self-auto">
                <img
                  src="/images/bihar-government-logo.png"
                  alt="Emblem"
                  className="h-8 w-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-blue-300 gap-2">
            <div>
              {language === 'hi'
                ? '© 2026 बिहार सरकार। सर्वाधिकार सुरक्षित।'
                : '© 2026 Government of Bihar. All rights reserved.'}
            </div>
            <div className="text-blue-400 font-semibold">
              {language === 'hi'
                ? 'सम्मोहन घोषणा एवं परियोजना अनुश्रवण प्रणाली'
                : 'Sammohan Announcement & Project Tracking System'}
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
