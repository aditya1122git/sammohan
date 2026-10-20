import React, { useState } from 'react';
import {
  Rocket,
  Building2,
  Cpu,
  Zap,
  Sprout,
  HeartPulse,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Globe,
  Award,
  ArrowRight,
  ShieldCheck,
  Plane,
  Train,
  Sparkles,
  Target,
  ChevronRight
} from 'lucide-react';

interface ModernBiharMission2045Props {
  language: 'hi' | 'en';
  onExploreProjects?: () => void;
}

export const ModernBiharMission2045: React.FC<ModernBiharMission2045Props> = ({
  language,
  onExploreProjects
}) => {
  const [activeHorizon, setActiveHorizon] = useState<number>(0);

  // Strategic 3-Stage Horizon Milestones
  const horizons = [
    {
      id: 'h1',
      period: '2026 – 2030',
      badgeHi: 'चरण 1 : नींव एवं त्वरित अवसंरचना',
      badgeEn: 'Phase 1 : Foundation & Rapid Infrastructure',
      titleHi: 'एक्सप्रेसवे नेटवर्क, डिजिटल पंचायतें एवं औद्योगिक गलियारे',
      titleEn: 'Expressway Corridors, Digital Panchayats & Industrial Hubs',
      descHi: 'सभी 38 जिला मुख्यालयों का 4/6-लेन एक्सप्रेसवे से जुड़ाव, पटना मेट्रो के दोनों चरणों का संचालन, तथा 4 नए हवाई अड्डों का विस्तार।',
      descEn: 'Connecting all 38 district headquarters via 4/6-lane expressways, operationalizing Patna Metro Phases 1 & 2, and expanding 4 regional airport hubs.',
      deliverablesHi: [
        '38 जिलों में 4-लेन एक्सप्रेसवे नेटवर्क एवं तीव्र कनेक्टिविटी',
        'पटना, दरभंगा, गया एवं पूर्णिया में पूर्ण सक्रिय हवाई अड्डे',
        '100% डिजिटल भू-अभिलेख एवं पारदर्शी एकल-खिड़की औद्योगिक मंज़ूरी',
        'गंगा एक्सप्रेसवे के दोनों किनारों पर 15 मेगा औद्योगिक क्लस्टर'
      ],
      deliverablesEn: [
        '4-lane expressway connectivity connecting all 38 district centers',
        'Full operational airports at Patna, Darbhanga, Gaya & Purnea',
        '100% digitized land titles & fast-track single window industrial approvals',
        '15 Mega Industrial Clusters along the Ganga Expressway corridor'
      ]
    },
    {
      id: 'h2',
      period: '2030 – 2037',
      badgeHi: 'चरण 2 : ज्ञान अर्थव्यवस्था एवं स्वच्छ ऊर्जा',
      badgeEn: 'Phase 2 : Knowledge Economy & Clean Energy',
      titleHi: 'आईटी-सेमीकंडक्टर पार्क, सौर ऊर्जा आत्मनिर्भरता एवं जलमार्ग',
      titleEn: 'IT & Semiconductor Parks, Solar Self-Reliance & Waterways',
      descHi: 'पटना-नालंदा नॉलेज सिटी व डेटा सेंटर हब, 100% नवीकरणीय ऊर्जा ग्रिड, तथा राष्ट्रीय जलमार्ग-1 (गंगा) पर बहुउद्देश्यीय मालवाहक टर्मिनलों का विस्तार।',
      descEn: 'Developing Patna-Nalanda Knowledge City & AI/Data centers, achieving 100% clean power in public utilities, and multi-modal freight terminals on NW-1.',
      deliverablesHi: [
        'पटना-नालंदा में विश्वस्तरीय आईटी, एआई व सेमीकंडक्टर पैकेजिंग हब',
        '25 GW सौर ऊर्जा उत्पादन एवं सरकारी भवनों का शून्य-कार्बन ग्रिड',
        'गंगा जलमार्ग (NW-1) से $50 बिलियन वार्षिक जल-परिवहन निर्यात',
        'सभी 9 प्रमंडलों में मेडिकल कॉलेज एवं सुपर-स्पेशियलिटी अस्पताल'
      ],
      deliverablesEn: [
        'World-class IT, AI & Semiconductor Packaging Park in Patna-Nalanda',
        '25 GW solar capacity & zero-carbon public government infrastructure',
        '$50B+ annual cargo exports facilitated by Ganga Waterway (NW-1)',
        'Super-specialty medical colleges and AIIMS centers in all 9 divisions'
      ]
    },
    {
      id: 'h3',
      period: '2037 – 2045',
      badgeHi: 'चरण 3 : $1 ट्रिलियन विकसित आधुनिक बिहार',
      badgeEn: 'Phase 3 : $1 Trillion Viksit Modern Bihar',
      titleHi: 'वैश्विक आर्थिक शक्ति, 100% साक्षरता एवं सतत आधुनिक जीवन',
      titleEn: 'Global Economic Powerhouse, 100% Literacy & Green Prosperity',
      descHi: '$1 ट्रिलियन अर्थव्यवस्था का लक्ष्य, प्राचीन नालंदा-विक्रमशिला की वैश्विक ज्ञान प्रतिष्ठा की पुनःस्थापना, तथा विश्वस्तरीय जीवन स्तर।',
      descEn: 'Attaining $1 Trillion economy milestone, restoring ancient Nalanda-Vikramshila global education leadership, and top-tier quality of living.',
      deliverablesHi: [
        'बिहार की $1 ट्रिलियन अर्थव्यवस्था एवं उच्च प्रति व्यक्ति आय',
        'नालंदा अंतर्राष्ट्रीय ज्ञान हब — वैश्विक शोध एवं नवाचार केंद्र',
        'सभी 38 जिलों में स्मार्ट सतत शहर एवं शून्य-प्रदूषण सार्वजनिक परिवहन',
        '1 करोड़+ उच्च-कौशल युक्त तकनीकी एवं विनिर्माण रोज़गार'
      ],
      deliverablesEn: [
        'Achieving $1 Trillion Gross State Product with high per-capita income',
        'Nalanda Global Knowledge Hub attracting top international researchers',
        'Smart, carbon-neutral cities and 100% electric transit in 38 districts',
        '1 Crore+ high-skill technology, engineering and manufacturing careers'
      ]
    }
  ];

  // 6 Core Pillars of Modern Bihar 2045
  const pillars = [
    {
      icon: Cpu,
      color: 'from-blue-600 to-indigo-700',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
      titleHi: 'आधुनिक आईटी, एआई एवं सेमीकंडक्टर हब',
      titleEn: 'Modern IT, AI & Semiconductor Hub',
      targetHi: '2045 लक्ष्य: 50 लाख हाई-टेक रोज़गार एवं $40B आईटी निर्यात',
      targetEn: '2045 Target: 5 Million Tech Jobs & $40B Software Exports',
      descHi: 'पटना, राजगीर एवं भागलपुर में आधुनिक आईटी पार्क, एआई इनक्यूबेशन सेंटर तथा अत्याधुनिक चिप-पैकेजिंग क्लस्टर का निर्माण।',
      descEn: 'Establishing state-of-the-art tech parks, AI innovation hubs, and semiconductor manufacturing ecosystems across Patna, Rajgir & Bhagalpur.'
    },
    {
      icon: Building2,
      color: 'from-amber-600 to-orange-600',
      tagColor: 'bg-amber-50 text-amber-800 border-amber-200',
      titleHi: 'मेगा औद्योगिक क्लस्टर एवं वैश्विक विनिर्माण',
      titleEn: 'Mega Industrial Clusters & Global Manufacturing',
      targetHi: '2045 लक्ष्य: ₹20 लाख करोड़ निजी निवेश व 100+ औद्योगिक पार्क',
      targetEn: '2045 Target: ₹20 Lakh Cr Investments & 100+ Industrial Zones',
      descHi: 'टेक्सटाइल, लेदर, खाद्य प्रसंस्करण, इलेक्ट्रॉनिक्स तथा हरित ऊर्जा उपकरणों का वैश्विक विनिर्माण केंद्र।',
      descEn: 'Creating premier export hubs for textiles, food processing, electric mobility, consumer electronics, and heavy equipment manufacturing.'
    },
    {
      icon: Train,
      color: 'from-emerald-600 to-teal-700',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      titleHi: 'हाई-स्पीड रेल, एक्सप्रेसवे व अंतर्राष्ट्रीय एयरपोर्ट',
      titleEn: 'High-Speed Rail, Expressways & Multi-Airports',
      targetHi: '2045 लक्ष्य: बुलेट ट्रेन कॉरिडोर, 6 एयरपोर्ट्स व 12 जल-बंदरगाह',
      targetEn: '2045 Target: High-Speed Bullet Train, 6 Airports & 12 River Ports',
      descHi: 'दिल्ली-कोलकाता बुलेट ट्रेन का बिहार हॉल्ट, 6 अंतर्राष्ट्रीय/घरेलू एयरपोर्ट्स, और 38 जिलों में 2 घंटे के भीतर राजधानी तक पहुंच।',
      descEn: 'High-speed rail connectivity, 6 international/regional airports, and rapid expressway access connecting every district within 2.5 hours.'
    },
    {
      icon: Zap,
      color: 'from-yellow-600 to-amber-700',
      tagColor: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      titleHi: '100% हरित ऊर्जा एवं जल-जीवन-हरियाली',
      titleEn: '100% Green Energy & Jal-Jeevan-Hariyali',
      targetHi: '2045 लक्ष्य: 50 GW सौर ऊर्जा एवं पूर्ण बाढ़-नियंत्रण प्रणाली',
      targetEn: '2045 Target: 50 GW Clean Solar Power & Flood Resilience',
      descHi: 'उत्तर बिहार के आर्द्रभूमि क्षेत्रों में फ्लोटिंग सौर संयंत्र, नहरों पर सोलर रूफ, तथा चेक-डैमों से भूजल एवं कृषि सुरक्षा।',
      descEn: 'Floating solar plants in northern wetlands, canal-top solar grids, and integrated river dams ensuring total water security and zero-carbon grid.'
    },
    {
      icon: Sprout,
      color: 'from-green-600 to-emerald-700',
      tagColor: 'bg-green-50 text-green-800 border-green-200',
      titleHi: 'स्मार्ट प्रिसिजन कृषि एवं वैश्विक जीआई निर्यात',
      titleEn: 'Smart Precision Farming & Global GI Exports',
      targetHi: '2045 लक्ष्य: $15B कृषि निर्यात एवं 100% सोलर माइक्रो-सिंचाई',
      targetEn: '2045 Target: $15B Farm Exports & 100% Solar Micro-Irrigation',
      descHi: 'मखाना, शाही लीची, कतरनी चावल एवं जैविक सब्जियों का जीआई-सर्टिफाइड वैश्विक निर्यात तथा ड्रोन-आधारित सटीक खेती।',
      descEn: 'AI & drone-assisted precision farming, cold supply chains, and global GI-certified exports for Makhana, Shahi Litchi, and specialty grains.'
    },
    {
      icon: HeartPulse,
      color: 'from-rose-600 to-red-700',
      tagColor: 'bg-rose-50 text-rose-800 border-rose-200',
      titleHi: 'विश्वस्तरीय चिकित्सा, शिक्षा एवं शून्य-गरीबी',
      titleEn: 'World-Class Healthcare, Education & Zero Poverty',
      targetHi: '2045 लक्ष्य: सभी 9 प्रमंडलों में एम्स/मेडिकल हब व 100% साक्षरता',
      targetEn: '2045 Target: AIIMS in 9 Divisions & 100% Quality Literacy',
      descHi: 'प्रत्येक ब्लॉक में टेलीमेडिसिन एवं क्रिटिकल केयर, नालंदा-विक्रमशिला की वैश्विक प्रतिष्ठा की पुनर्स्थापना तथा शत-प्रतिशत सामाजिक सुरक्षा।',
      descEn: 'Telemedicine in all 534 blocks, universal healthcare coverage, revival of ancient educational glory, and complete eradication of poverty.'
    }
  ];

  return (
    <section id="mission-2045" className="relative bg-[#0d1527] text-white py-16 sm:py-24 border-t-4 border-amber-500 overflow-hidden select-none">
      {/* Background Architectural Watermark & Glowing Accents */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* ========================================================= */}
        {/* 1. SECTION HEADER (Official Bihar 2045 Mission Seal)       */}
        {/* ========================================================= */}
        <div className="text-center max-w-4xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-400/40 backdrop-blur-md text-amber-300 text-xs sm:text-sm font-extrabold uppercase tracking-widest mb-4 shadow-lg">
            <Rocket className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{language === 'hi' ? 'विकसित बिहार @ 2045 का रोडमैप • दीर्घकालिक विज़न' : 'Viksit Bihar @ 2045 Strategic Vision'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {language === 'hi' ? (
              <>
                मिशन आधुनिक बिहार <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300">2045</span> : संकल्प से सिद्धि
              </>
            ) : (
              <>
                Mission Modern Bihar <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300">2045</span> : Vision to Reality
              </>
            )}
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
            {language === 'hi'
              ? 'माननीय मुख्यमंत्री श्री सम्राट चौधरी के नेतृत्व में आधुनिक, आत्मनिर्भर, उच्च-तकनीकी एवं समृद्ध बिहार के निर्माण का 2026 से 2045 तक का बहु-आयामी विकास रोडमैप।'
              : 'A multi-decadal master roadmap under the visionary leadership of Hon’ble CM Shri Samrat Choudhary for transforming Bihar into a global technological, industrial and agricultural powerhouse.'}
          </p>

          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-amber-400 rounded-full" />
            <div className="w-3 h-3 rotate-45 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
            <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-amber-400 rounded-full" />
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. 2045 KEY TARGET COUNTERS GRID                          */}
        {/* ========================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-16">
          {[
            { metric: '$1 Trillion', labelHi: 'राज्य अर्थव्यवस्था लक्ष्य', labelEn: 'State GDP Goal', icon: TrendingUp, color: 'text-emerald-400' },
            { metric: '100%', labelHi: 'एक्सप्रेसवे कनेक्टिविटी', labelEn: 'Expressway Reach', icon: CheckCircle2, color: 'text-sky-400' },
            { metric: '38', labelHi: 'स्मार्ट सतत जिले', labelEn: 'Smart Modern Districts', icon: Globe, color: 'text-amber-400' },
            { metric: '1 Crore+', labelHi: 'हाई-टेक रोज़गार सृजन', labelEn: 'High-Tech Careers', icon: Award, color: 'text-purple-400' },
            { metric: '50 GW', labelHi: 'सौर एवं स्वच्छ ऊर्जा', labelEn: 'Clean Green Power', icon: Zap, color: 'text-yellow-400' },
            { metric: '100%', labelHi: 'पारदर्शी ई-गवर्नेंस', labelEn: 'Digital E-Governance', icon: ShieldCheck, color: 'text-teal-400' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/80 rounded-2xl p-4 border border-slate-700/70 hover:border-amber-400/50 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] shadow-lg flex flex-col items-center text-center group"
              >
                <Icon className={`w-6 h-6 mb-2 ${item.color} group-hover:scale-110 transition-transform`} />
                <div className="text-xl sm:text-2xl font-black text-white tracking-tight">{item.metric}</div>
                <div className="text-[11px] font-semibold text-slate-300 mt-1 leading-snug">
                  {language === 'hi' ? item.labelHi : item.labelEn}
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* 3. THREE STRATEGIC HORIZONS (2026-2030, 2030-2037, 2037-2045) */}
        {/* ========================================================= */}
        <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-10 border border-slate-700/80 shadow-2xl mb-16 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
            <div>
              <div className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" />
                <span>{language === 'hi' ? 'त्रि-स्तरीय विकास चरण' : 'Three Strategic Development Horizons'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                {language === 'hi' ? '2026 से 2045 तक का रणनीतिक पड़ाव' : 'Strategic Milestones from 2026 to 2045'}
              </h3>
            </div>

            {/* Horizon Switcher Tabs */}
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              {horizons.map((h, hIdx) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setActiveHorizon(hIdx)}
                  className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                    activeHorizon === hIdx
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg scale-100'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {h.period}
                </button>
              ))}
            </div>
          </div>

          {/* Active Horizon Content Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/40 text-amber-300 text-xs font-bold">
                <Calendar className="w-3.5 h-3.5 text-orange-400" />
                <span>{language === 'hi' ? horizons[activeHorizon].badgeHi : horizons[activeHorizon].badgeEn}</span>
              </div>

              <h4 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {language === 'hi' ? horizons[activeHorizon].titleHi : horizons[activeHorizon].titleEn}
              </h4>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {language === 'hi' ? horizons[activeHorizon].descHi : horizons[activeHorizon].descEn}
              </p>

              {onExploreProjects && (
                <button
                  type="button"
                  onClick={onExploreProjects}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg transition transform active:scale-95 cursor-pointer mt-2"
                >
                  <span>{language === 'hi' ? 'परियोजना रजिस्टर व माइलस्टोन देखें' : 'View Project Register & Milestones'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Right: Key Deliverables List */}
            <div className="lg:col-span-6 bg-slate-950/70 rounded-2xl p-5 sm:p-7 border border-slate-800">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{language === 'hi' ? 'प्रमुख रणनीतिक लक्ष्य एवं परिणाम' : 'Strategic Deliverables & Outcomes'}</span>
              </div>

              <div className="space-y-3">
                {(language === 'hi' ? horizons[activeHorizon].deliverablesHi : horizons[activeHorizon].deliverablesEn).map((d, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-xs sm:text-sm text-slate-200 font-medium leading-snug">{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. SIX CORE MISSION PILLARS GRID                           */}
        {/* ========================================================= */}
        <div className="mb-14">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-xs font-black uppercase text-amber-400 tracking-wider">
              {language === 'hi' ? 'आधुनिक बिहार के 6 सुदृढ़ स्तंभ' : '6 Core Strategic Pillars'}
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-white mt-1">
              {language === 'hi' ? 'समग्र रूपांतरण के 6 प्रमुख आधार' : 'Foundations of Holistic Modern Transformation'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar, pIdx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pIdx}
                  className="bg-slate-900/80 hover:bg-slate-900 rounded-3xl p-6 border border-slate-700/80 hover:border-amber-400/60 transition-all duration-300 hover:shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex flex-col justify-between group"
                >
                  <div>
                    {/* Pillar Icon Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${pillar.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-amber-300 border border-white/15">
                        Pillar 0{pIdx + 1}
                      </span>
                    </div>

                    {/* Pillar Title */}
                    <h4 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors leading-snug mb-2">
                      {language === 'hi' ? pillar.titleHi : pillar.titleEn}
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {language === 'hi' ? pillar.descHi : pillar.descEn}
                    </p>
                  </div>

                  {/* 2045 Target Callout */}
                  <div className="pt-3 border-t border-slate-800">
                    <div className="text-[11px] font-bold text-amber-400/90 leading-tight flex items-start gap-1.5">
                      <Target className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 mt-0.5" />
                      <span>{language === 'hi' ? pillar.targetHi : pillar.targetEn}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 5. BOTTOM OFFICIAL PLEDGE CALLOUT                          */}
        {/* ========================================================= */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 p-6 sm:p-10 shadow-2xl border-2 border-amber-300 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <img
              src="/images/bihar-government-logo.png"
              alt="Government of Bihar"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain flex-shrink-0 filter drop-shadow-lg"
            />
            <div>
              <div className="text-xs sm:text-sm font-black uppercase text-amber-200 tracking-wider">
                {language === 'hi' ? 'विकसित बिहार 2045 का दृढ़ संकल्प' : 'Resolution for Viksit Bihar 2045'}
              </div>
              <div className="text-lg sm:text-2xl font-black text-white leading-tight mt-0.5">
                {language === 'hi'
                  ? 'विश्वास, विकास और जन-कल्याण — प्रत्येक नागरिक की समृद्धि के लिए समर्पित'
                  : 'Trust, Growth & Public Welfare — Committed to Prosperity for Every Citizen'}
              </div>
              <div className="text-xs text-amber-100 font-medium mt-1">
                {language === 'hi'
                  ? 'सम्मोहन पोर्टल: 38 जिलों में प्रत्येक घोषणा एवं परियोजना का रीयल-टाइम पारदर्शी अनुश्रवण'
                  : 'Sammohan Portal: Real-Time Transparent Tracking of Commitments in All 38 Districts'}
              </div>
            </div>
          </div>

          {onExploreProjects && (
            <button
              type="button"
              onClick={onExploreProjects}
              className="bg-slate-950 hover:bg-slate-900 text-white font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-xl transition transform active:scale-95 flex-shrink-0 flex items-center gap-2 cursor-pointer border border-amber-300/40"
            >
              <span>{language === 'hi' ? 'डैशबोर्ड में परियोजनाएं देखें' : 'View Projects on Dashboard'}</span>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </button>
          )}
        </div>

      </div>
    </section>
  );
};

export default ModernBiharMission2045;
