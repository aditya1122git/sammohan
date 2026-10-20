import React, { useState } from 'react';
import {
  Phone,
  Shield,
  FileText,
  Search,
  MapPin,
  ExternalLink,
  Users,
  AlertTriangle,
  Award,
  Video,
  FileCheck,
  Building,
  Car,
  HeartHandshake,
  Lock,
  Globe,
  Radio,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Bookmark,
  Share2
} from 'lucide-react';

interface BiharPoliceCoreServicesProps {
  language: 'hi' | 'en';
  onSelectDistrict?: (districtName: string) => void;
  onOpenTable?: () => void;
  onOpenNewForm?: () => void;
}

export const BiharPoliceCoreServices: React.FC<BiharPoliceCoreServicesProps> = ({
  language,
  onSelectDistrict,
  onOpenTable,
  onOpenNewForm,
}) => {
  const [selectedDirDistrict, setSelectedDirDistrict] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'citizens' | 'officers'>('all');

  const districtsList = [
    'Patna', 'Nalanda', 'Gaya', 'Aurangabad', 'Nawada', 'Jehanabad', 'Arwal', 'Rohtas',
    'Kaimur', 'Bhojpur', 'Buxar', 'Saran', 'Siwan', 'Gopalganj', 'Muzaffarpur', 'Vaishali',
    'Sitamarhi', 'Sheohar', 'Purba Champaran', 'Pashchim Champaran', 'Darbhanga', 'Madhubani',
    'Samastipur', 'Saharsa', 'Supaul', 'Madhepura', 'Purnia', 'Katihar', 'Araria', 'Kishanganj',
    'Bhagalpur', 'Banka', 'Munger', 'Lakhisarai', 'Sheikhpura', 'Jamui', 'Khagaria', 'Begusarai'
  ];

  // 12 Quick Citizen Services Cards with Navy Top Tabs (exact match to police.bihar.gov.in)
  const citizenServicesGrid = [
    {
      id: 'transfers',
      title: 'TRANSFERS / POSTINGS',
      titleHi: 'स्थानांतरण / पदस्थापन',
      desc: 'Official departmental transfer orders & Gazetted officer postings',
      icon: Users,
    },
    {
      id: 'cyber',
      title: 'REPORT CYBER CRIME',
      titleHi: 'साइबर अपराध रिपोर्ट',
      desc: 'Instant online financial fraud reporting & National Cyber Portal 1930',
      icon: Shield,
    },
    {
      id: 'fir',
      title: 'VIEW FIR',
      titleHi: 'ऑनलाइन प्राथमिकी (FIR) देखें',
      desc: 'Search, view and download digitized e-FIR copy across all 38 districts',
      icon: FileText,
    },
    {
      id: 'thana',
      title: 'NEAREST POLICE STATION',
      titleHi: 'निकटतम पुलिस स्टेशन',
      desc: 'GIS geo-location locator for nearest Thana, SHO contact & jurisdiction',
      icon: MapPin,
    },
    {
      id: 'erss',
      title: 'ERSS ONLINE COMPLAINT',
      titleHi: 'ईआरएसएस 112 शिकायत',
      desc: '24x7 Emergency Response Support System live complaint lodging',
      icon: Phone,
    },
    {
      id: 'grievance',
      title: 'PUBLIC GRIEVANCE',
      titleHi: 'जन शिकायत निवारण',
      desc: 'Integrated portal for public grievance tracking and escalation',
      icon: HeartHandshake,
    },
    {
      id: 'press',
      title: 'PRESS RELEASE',
      titleHi: 'प्रेस विज्ञप्ति',
      desc: 'Official police briefings, crime control bulletins & advisories',
      icon: Radio,
    },
    {
      id: 'vehicle',
      title: 'VEHICLE ENQUIRY',
      titleHi: 'वाहन जांच / सत्यापन',
      desc: 'Stolen vehicle verification, Vahan registration & blacklist verification',
      icon: Car,
    },
    {
      id: 'missing',
      title: 'MISSING PERSONS INFO',
      titleHi: 'लापता व्यक्ति सूचना',
      desc: 'Statewide missing persons directory, child tracing & reunion portal',
      icon: Users,
    },
    {
      id: 'passport',
      title: 'PASSPORT STATUS',
      titleHi: 'पासपोर्ट सत्यापन स्थिति',
      desc: 'Track local police verification status for passport applications',
      icon: FileCheck,
    },
    {
      id: 'women',
      title: 'WOMEN PROTECTION HELPLINE',
      titleHi: 'महिला सुरक्षा हेल्पलाइन (181/1091)',
      desc: 'Dedicated women help desks in every Thana and mobile response vans',
      icon: Shield,
    },
    {
      id: 'rtps',
      title: 'CHARACTER CERTIFICATE (RTPS)',
      titleHi: 'चरित्र प्रमाण पत्र (RTPS)',
      desc: 'Time-bound delivery of Character & Verification Certificates via Service Plus',
      icon: Award,
    },
  ];

  return (
    <section className="bg-[#f8fafc] py-10 sm:py-14 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">

        {/* ========================================================= */}
        {/* 1. ABOUT BIHAR POLICE & CM LEADERSHIP SHOWCASE CARD       */}
        {/* ========================================================= */}
        <div id="about-police" className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-slate-200/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-block text-xs font-black uppercase tracking-widest text-[#001C52] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                {language === 'hi' ? 'बिहार पुलिस परिचय' : 'ABOUT BIHAR POLICE'}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#001C52] font-serif tracking-tight">
                {language === 'hi'
                  ? 'जन-सेवा, सुरक्षा एवं निष्पक्ष कानून व्यवस्था के प्रति पूर्णतः समर्पित'
                  : 'Committed to Citizen Service, Security & Firm Law Enforcement'}
              </h2>

              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                {language === 'hi'
                  ? 'मैं बिहार के सभी नागरिकों और बिहार पुलिस के अपने सभी साथियों को हार्दिक शुभकामनाएं देता हूँ। हम पूरी निष्ठा, संवेदनशीलता और व्यावहारिक दक्षता के साथ राज्य के नागरिकों की सेवा और सुरक्षा के लिए पूरी तरह संकल्पित हैं। जब पुलिस और जनता मिलकर सहयोग करती है, तो समाज विरोधी तत्वों और अपराधियों को पूरी तरह निष्प्रभावी किया जा सकता है। मैं शांति, सौहार्द और विकसित बिहार के निर्माण में सभी नागरिकों से सक्रिय सहयोग की अपील करता हूँ।'
                  : "I heartily congratulate the citizens of Bihar and my colleagues in the Bihar Police. We are committed to serving and protecting the citizens of the state with integrity and practical efficiency. You will all agree that when the police and the public cooperate, anti-social elements and criminals can be isolated and controlled more effectively. Therefore, I appeal to all citizens of Bihar to cooperate in taking effective action against such elements."}
              </p>

              <div className="pt-2 flex items-center gap-4 flex-wrap">
                <button
                  onClick={() => {
                    const el = document.getElementById('citizen-services-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#001C52] hover:bg-[#00143d] text-white text-xs font-black shadow-md transition hover:scale-105 cursor-pointer flex items-center gap-2"
                >
                  <span>{language === 'hi' ? 'विस्तार से जानें (Read more)' : 'Read more'}</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-2 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'hi' ? '38 ज़िलों में 24x7 डायल 112 सेवा सक्रिय' : 'Dial 112 Active 24x7 in All 38 Districts'}</span>
                </div>
              </div>
            </div>

            {/* Right Portrait: Hon'ble CM Shri Samrat Choudhary (4 cols) */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative p-2 rounded-3xl bg-gradient-to-b from-amber-400/40 via-blue-900/10 to-transparent shadow-xl">
                <img
                  src="/images/police_portal/CM.DNR_0c2b.jpg"
                  alt="Shri Samrat Choudhary"
                  className="w-48 sm:w-56 h-auto rounded-2xl object-cover shadow-md border-2 border-white ring-2 ring-amber-400"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/up_portal/cm_samrat.jpg';
                  }}
                />
              </div>
              <div className="mt-3">
                <div className="text-base sm:text-lg font-black text-[#001C52]">
                  {language === 'hi' ? 'श्री सम्राट चौधरी' : 'Shri Samrat Choudhary'}
                </div>
                <div className="text-xs font-bold text-amber-800">
                  {language === 'hi' ? 'माननीय मुख्यमंत्री, बिहार' : 'Chief Minister, Bihar'}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. CORE TWO-COLUMN COMMAND CENTER LAYOUT                  */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ======================================================= */}
          {/* LEFT COLUMN (8 cols): District Search + 4 Cards + 12 Svc*/}
          {/* ======================================================= */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 2a. District Police Directory Search Card */}
            <div id="district-directory-section" className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Deep Navy Card Header */}
              <div className="bg-[#001C52] text-white px-5 py-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-black tracking-wide">
                    {language === 'hi' ? 'ज़िला पुलिस निर्देशिका (District Police Directory)' : 'District Police Directory'}
                  </h3>
                  <p className="text-[11px] text-slate-300 font-medium">
                    {language === 'hi' ? 'बिहार के सभी 38 ज़िलों के पुलिस अधिकारियों एवं थानों की जानकारी' : 'Search officers & police stations across all Bihar districts'}
                  </p>
                </div>
                <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0" />
              </div>

              {/* Dropdown Selector Input */}
              <div className="p-5 space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4 text-[#001C52]" />
                  </div>
                  <select
                    value={selectedDirDistrict}
                    onChange={(e) => {
                      setSelectedDirDistrict(e.target.value);
                      if (onSelectDistrict && e.target.value) onSelectDistrict(e.target.value);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#001C52] focus:bg-white transition cursor-pointer"
                  >
                    <option value="">{language === 'hi' ? '-- ज़िला चुनें (Select a district to explore officers) --' : '-- Select a district to explore officers --'}</option>
                    {districtsList.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Quick District Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {districtsList.slice(0, 10).map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setSelectedDirDistrict(d);
                        if (onSelectDistrict) onSelectDistrict(d);
                      }}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition cursor-pointer ${
                        selectedDirDistrict === d
                          ? 'bg-[#001C52] text-white border-[#001C52] shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      const el = document.getElementById('bihar-3d-explorer');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-[11px] font-bold text-[#001C52] hover:underline px-2 py-1"
                  >
                    +28 more
                  </button>
                </div>
              </div>
            </div>

            {/* 2b. 4 Quick Services Row Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {/* Tenders */}
              <div 
                onClick={onOpenTable}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 hover:border-[#001C52] hover:shadow-md transition text-center cursor-pointer group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 text-[#001C52] flex items-center justify-center mb-2 group-hover:scale-110 transition">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div className="text-xs font-black text-slate-900">
                  {language === 'hi' ? 'निविदा (Tenders)' : 'Tenders'}
                </div>
                <div className="text-[10px] text-gray-500 font-semibold mt-0.5">
                  {language === 'hi' ? 'सक्रिय निविदाएँ' : 'Active tenders'}
                </div>
              </div>

              {/* Police Welfare */}
              <div 
                onClick={onOpenTable}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 hover:border-[#001C52] hover:shadow-md transition text-center cursor-pointer group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div className="text-xs font-black text-slate-900">
                  {language === 'hi' ? 'पुलिस कल्याण' : 'Police Welfare'}
                </div>
                <div className="text-[10px] text-gray-500 font-semibold mt-0.5">
                  {language === 'hi' ? 'कल्याण कार्यक्रम' : 'Support programs'}
                </div>
              </div>

              {/* National Cyber Crime Reporting */}
              <a 
                href="https://cybercrime.gov.in" 
                target="_blank" 
                rel="noreferrer"
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 hover:border-[#001C52] hover:shadow-md transition text-center cursor-pointer group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="text-xs font-black text-slate-900">
                  {language === 'hi' ? 'साइबर अपराध' : 'Cyber Crime'}
                </div>
                <div className="text-[10px] text-gray-500 font-semibold mt-0.5">
                  {language === 'hi' ? 'हेल्पलाइन 1930' : 'Report at 1930'}
                </div>
              </a>

              {/* Arrest Report */}
              <div 
                onClick={onOpenTable}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 hover:border-[#001C52] hover:shadow-md transition text-center cursor-pointer group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div className="text-xs font-black text-slate-900">
                  {language === 'hi' ? 'गिरफ्तारी रिपोर्ट' : 'Arrest Report'}
                </div>
                <div className="text-[10px] text-gray-500 font-semibold mt-0.5">
                  {language === 'hi' ? 'सत्यापित रिकॉर्ड' : 'Wanted / Arrest list'}
                </div>
              </div>
            </div>

            {/* 2c. Quick Citizen Services Grid (12 Cards with Navy Top Tabs) */}
            <div id="citizen-services-section" className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2">
                <h3 className="text-base sm:text-lg font-black text-[#001C52]">
                  {language === 'hi' ? 'त्वरित नागरिक सेवाएँ (Quick Citizen Services)' : 'Quick Citizen Services'}
                </h3>
                <span className="text-xs text-gray-500 font-bold">
                  {language === 'hi' ? '12 प्रमुख डिजिटल सेवाएँ' : '12 Online Services'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {citizenServicesGrid.map((svc) => {
                  const Icon = svc.icon;
                  return (
                    <div
                      key={svc.id}
                      onClick={() => {
                        if (svc.id === 'fir' || svc.id === 'transfers' || svc.id === 'press') {
                          if (onOpenTable) onOpenTable();
                        } else if (svc.id === 'grievance' || svc.id === 'erss') {
                          if (onOpenNewForm) onOpenNewForm();
                        }
                      }}
                      className="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                    >
                      {/* Signature Deep Navy Header Tab */}
                      <div className="bg-[#001C52] text-white py-2 px-3 text-center flex items-center justify-center relative">
                        <span className="text-[11px] font-black uppercase tracking-wider truncate">
                          {language === 'hi' ? svc.titleHi : svc.title}
                        </span>
                        {/* Downward notch */}
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#001C52] rotate-45" />
                      </div>

                      {/* Card Body */}
                      <div className="p-4 text-center space-y-2 pt-5">
                        <div className="w-11 h-11 mx-auto rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-[#001C52] group-hover:bg-blue-50 group-hover:scale-110 transition">
                          <Icon className="w-5 h-5" />
                        </div>
                        <p className="text-[11px] text-gray-600 font-medium leading-relaxed line-clamp-2">
                          {svc.desc}
                        </p>
                      </div>

                      {/* Bottom Accent */}
                      <div className="h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition" />
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* ======================================================= */}
          {/* RIGHT COLUMN (4 cols): Emergency 112 + Action Cards + TV*/}
          {/* ======================================================= */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Emergency Numbers Card (Deep Navy) */}
            <div id="emergency-numbers-card" className="bg-[#001C52] text-white rounded-3xl p-6 shadow-xl border border-blue-900 space-y-4">
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="text-base font-black tracking-wide">
                      {language === 'hi' ? 'आपातकालीन नंबर' : 'Emergency Numbers'}
                    </h3>
                    <p className="text-[10px] text-slate-300 font-semibold">
                      {language === 'hi' ? 'मदद केवल एक कॉल की दूरी पर' : 'Help is just a call away'}
                    </p>
                  </div>
                </div>
                <span className="bg-emerald-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                  24x7 Available
                </span>
              </div>

              {/* Emergency Hotline Rows */}
              <div className="space-y-2.5">
                {/* Police 112 */}
                <div className="bg-white/10 hover:bg-white/15 rounded-2xl p-3 flex items-center justify-between transition border border-white/10">
                  <span className="text-xs font-black uppercase text-slate-200">
                    {language === 'hi' ? 'पुलिस (Police ERSS)' : 'Police (ERSS)'}
                  </span>
                  <span className="text-2xl font-black text-amber-300 font-mono tracking-tight">
                    112
                  </span>
                </div>

                {/* Prohibition 15545 */}
                <div className="bg-white/10 hover:bg-white/15 rounded-2xl p-3 flex items-center justify-between transition border border-white/10">
                  <span className="text-xs font-black uppercase text-slate-200">
                    {language === 'hi' ? 'मद्य निषेध (Prohibition)' : 'Prohibition'}
                  </span>
                  <span className="text-2xl font-black text-white font-mono tracking-tight">
                    15545
                  </span>
                </div>

                {/* Cyber Crime 1930 */}
                <div className="bg-white/10 hover:bg-white/15 rounded-2xl p-3 flex items-center justify-between transition border border-white/10">
                  <span className="text-xs font-black uppercase text-slate-200">
                    {language === 'hi' ? 'साइबर अपराध (Cyber Crime)' : 'Cyber Crime'}
                  </span>
                  <span className="text-2xl font-black text-amber-300 font-mono tracking-tight">
                    1930
                  </span>
                </div>

                {/* Women Helpline 1091 / 181 */}
                <div className="bg-white/10 hover:bg-white/15 rounded-2xl p-3 flex items-center justify-between transition border border-white/10">
                  <span className="text-xs font-black uppercase text-slate-200">
                    {language === 'hi' ? 'महिला हेल्पलाइन (Women Helpline)' : 'Women Helpline'}
                  </span>
                  <span className="text-2xl font-black text-white font-mono tracking-tight">
                    1091
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Action Card: VIEW FIR */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#001C52] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#001C52]">
                    {language === 'hi' ? 'प्राथमिकी (FIR) देखें' : 'VIEW FIR'}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium">
                    {language === 'hi' ? 'अपनी प्राथमिकी की प्रति ऑनलाइन डाउनलोड करें' : 'View and download copy of your FIR online'}
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenTable}
                className="w-full bg-[#001C52] hover:bg-[#001338] text-white py-2.5 rounded-xl text-xs font-black shadow transition cursor-pointer"
              >
                {language === 'hi' ? 'प्राथमिकी खोजें (View FIR)' : 'View FIR'}
              </button>
            </div>

            {/* 3. Action Card: Missing Persons Database */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#001C52]">
                    {language === 'hi' ? 'लापता व्यक्ति खोज' : 'Missing Persons'}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium">
                    {language === 'hi' ? 'लापता व्यक्तियों की रिपोर्ट अथवा खोज करें' : 'Report or search for missing persons'}
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenTable}
                className="w-full bg-[#001C52] hover:bg-[#001338] text-white py-2.5 rounded-xl text-xs font-black shadow transition cursor-pointer"
              >
                {language === 'hi' ? 'डेटाबेस खोजें (Search Database)' : 'Search Database'}
              </button>
            </div>

            {/* 4. We are on YouTube / Media Card */}
            <div id="media-youtube-section" className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
              <div className="bg-[#001C52] text-white py-2.5 px-4 font-black text-xs uppercase tracking-wider flex items-center justify-between">
                <span>{language === 'hi' ? 'हम यूट्यूब पर हैं (We are on YouTube)' : 'We are on YouTube'}</span>
                <Video className="w-4 h-4 text-red-400" />
              </div>
              <div className="p-3 bg-slate-900 aspect-video relative flex items-center justify-center">
                {/* Embedded Video Feed or Police Media Broadcast */}
                <iframe
                  className="w-full h-full rounded-xl"
                  src="https://www.youtube.com/embed/videoseries?list=PLrY8Zg8f2v3w_oK"
                  title="Bihar Police Official Channel"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
