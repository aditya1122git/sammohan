import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Volume2,
  Share2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Phone,
  Shield,
  ExternalLink,
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Megaphone,
  Layers,
  ArrowRight,
  TrendingUp,
  MapPin,
  FileText,
  UserCheck,
  Compass,
  Sparkles,
  Info,
  Calendar,
  Lock,
  ChevronDown,
  Globe,
  Radio,
  FileCheck,
  ShieldCheck,
  Trash2,
  Database
} from 'lucide-react';
import { ProjectStats, ProjectAnnouncement } from '../types';
import { api } from '../services/api';
import { BiharGovHeader } from './BiharGovHeader';

interface UpGovLandingProps {
  onOpenLogin: () => void;
  onOpenDashboard: () => void;
  isLoggedIn?: boolean;
  currentUser?: any;
  onLoginSuccess?: (user: any) => void;
  onLogout?: () => void;
  language: 'hi' | 'en';
  onToggleLanguage: (lang: 'hi' | 'en') => void;
  projectStats?: ProjectStats | null;
  projects?: ProjectAnnouncement[];
  onSelectProject?: (project: ProjectAnnouncement) => void;
  onDeleteProject?: (project: ProjectAnnouncement) => void;
  onOpenNewForm?: () => void;
  onOpenTableWithTab?: (tab: 'all' | 'ongoing' | 'completed' | 'delayed') => void;
  onSelectDistrict?: (districtName: string) => void;
}

export const UpGovLanding: React.FC<UpGovLandingProps> = ({
  onOpenLogin,
  onOpenDashboard,
  isLoggedIn,
  currentUser,
  onLoginSuccess,
  onLogout,
  language,
  onToggleLanguage,
  projectStats,
  projects = [],
  onSelectProject,
  onDeleteProject,
  onOpenNewForm,
  onOpenTableWithTab,
  onSelectDistrict
}) => {
  // Accessibility states
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(0); // -1, 0, 1
  const [contrastMode, setContrastMode] = useState<'normal' | 'low' | 'high'>('normal');

  // Announcement and Project Tracking Dashboard State
  const [internalProjects, setInternalProjects] = useState<ProjectAnnouncement[]>(projects);
  const [projectFilterTab, setProjectFilterTab] = useState<'all' | 'ongoing' | 'completed' | 'delayed'>('all');
  const [projectSearchTerm, setProjectSearchTerm] = useState('');
  const [projectDeptFilter, setProjectDeptFilter] = useState('ALL');
  const [projectStageFilter, setProjectStageFilter] = useState('ALL');
  const [projectCardView, setProjectCardView] = useState<'cards' | 'table'>('cards');

  useEffect(() => {
    if (projects && projects.length > 0) {
      setInternalProjects(projects);
    } else {
      api.getProjects({ limit: 50 })
        .then(res => {
          if (res.projects) setInternalProjects(res.projects);
        })
        .catch(err => console.error('Failed to load projects', err));
    }
  }, [projects]);

  // Memoized filtered projects list
  const filteredProjects = useMemo(() => {
    return (internalProjects || []).filter((p) => {
      // Tab filter
      if (projectFilterTab === 'ongoing') {
        if (p.currentStage === 'OPERATIONAL' || p.currentStage === 'COMMISSIONED') return false;
      } else if (projectFilterTab === 'completed') {
        if (p.currentStage !== 'OPERATIONAL' && p.currentStage !== 'COMMISSIONED') return false;
      } else if (projectFilterTab === 'delayed') {
        if (!p.isDelayed) return false;
      }

      // Department filter
      if (projectDeptFilter !== 'ALL' && !p.department.toLowerCase().includes(projectDeptFilter.toLowerCase())) {
        return false;
      }

      // Search term
      if (projectSearchTerm.trim()) {
        const q = projectSearchTerm.toLowerCase();
        const matchRef = p.referenceId?.toLowerCase().includes(q);
        const matchDept = p.department?.toLowerCase().includes(q);
        const matchComm = p.commitment?.toLowerCase().includes(q);
        const matchLoc = p.location?.toLowerCase().includes(q);
        const matchBen = p.beneficiaries?.toLowerCase().includes(q);
        const matchDist = p.districtName?.toLowerCase().includes(q);
        if (!matchRef && !matchDept && !matchComm && !matchLoc && !matchBen && !matchDist) {
          return false;
        }
      }

      return true;
    });
  }, [internalProjects, projectFilterTab, projectDeptFilter, projectSearchTerm]);

  // Hero carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Hero Slides featuring user's uploaded images of CM Samrat Choudhary and PM Narendra Modi
  const heroSlides = [
    {
      id: 1,
      image: '/images/up_portal/cm_quote_vision.webp',
      titleHi: 'हमारा लक्ष्य केवल सरकार चलाना नहीं, हर बिहारी के स्वाभिमान, सामर्थ्य और समृद्धि को नई ऊँचाइयों तक पहुँचाना है — श्री सम्राट चौधरी',
      titleEn: "Our mission is to take the dignity, capability, and prosperity of every Bihari to new heights — CM Samrat Choudhary",
      subtitleHi: 'माननीय मुख्यमंत्री श्री सम्राट चौधरी : "हमारा लक्ष्य केवल सरकार चलाना नहीं, हर बिहारी के स्वाभिमान, सामर्थ्य और समृद्धि को नई ऊँचाइयों तक पहुँचाना है।"',
      subtitleEn: "Hon'ble Chief Minister Shri Samrat Choudhary : Dedicated to good governance, empowerment, and self-reliance",
    },
    {
      id: 2,
      image: '/images/up_portal/cm_quote_podium.webp',
      titleHi: 'जन-कल्याण हमारी प्राथमिकता है और सुशासन हमारी प्रतिबद्धता; विकास को मिली रफ़्तार — श्री सम्राट चौधरी',
      titleEn: "Public welfare is our priority and good governance is our commitment; accelerating development — CM Samrat Choudhary",
      subtitleHi: 'माननीय मुख्यमंत्री श्री सम्राट चौधरी : "जन-कल्याण हमारी प्राथमिकता है और सुशासन हमारी प्रतिबद्धता; विकास को मिली रफ़्तार से नए और सशक्त बिहार का निर्माण होगा।"',
      subtitleEn: "Hon'ble Chief Minister Shri Samrat Choudhary : Public welfare is our priority, good governance is our commitment",
    },
    {
      id: 3,
      image: '/images/up_portal/bihar_hero_modi_samrat.jpg',
      titleHi: 'सम्राट का विज़न, विकसित बिहार का मिशन — विश्वास, विकास एवं जन-कल्याण',
      titleEn: "Samrat's Vision, Mission of Developed Bihar — Trust, Growth & Public Welfare",
      subtitleHi: 'माननीय प्रधानमंत्री श्री नरेंद्र मोदी एवं माननीय मुख्यमंत्री श्री सम्राट चौधरी के नेतृत्व में विकसित बिहार की ओर अग्रसर',
      subtitleEn: "Steering Bihar toward Holistic Development under the Dynamic Leadership of PM Narendra Modi & CM Samrat Choudhary",
    },
    {
      id: 4,
      image: '/images/up_portal/cm_quote_jobs.webp',
      titleHi: 'युवाओं को अवसर, अंतिम पंक्ति तक न्याय और पारदर्शी सुशासन — विकसित एवं आत्मनिर्भर बिहार का अटूट संकल्प — श्री सम्राट चौधरी',
      titleEn: "Opportunities for youth, justice to the last person, and transparent governance — Resolute commitment to Viksit Bihar",
      subtitleHi: 'माननीय मुख्यमंत्री श्री सम्राट चौधरी : "युवाओं को अवसर, अंतिम पंक्ति तक न्याय और पारदर्शी सुशासन — यही विकसित बिहार का संकल्प है।"',
      subtitleEn: "Hon'ble Chief Minister Shri Samrat Choudhary : Historic milestones in youth employment and transparent delivery",
    }
  ];

  // Auto carousel effect
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, heroSlides.length]);

  // Statistics derived from database or fallback to official baseline
  const totalAnnouncements = projectStats?.totalAnnouncements ?? 15;
  const ongoingProjects = projectStats?.ongoingProjects ?? 11;
  const completedProjects = projectStats?.completedProjects ?? 4;
  const delayedProjects = projectStats?.delayedProjects ?? 6;
  const totalSanctionedCr = projectStats?.totalSanctionedCr ?? 31790;
  const avgProgress = projectStats?.avgProgress ?? 66;

  // List of all 38 Bihar Districts
  const districts38 = [
    'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar',
    'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur', 'Katihar',
    'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur',
    'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura',
    'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran'
  ];

  // Complete 38 District Highlights with Hon'ble CM Samrat Choudhary's Inspection & Visit Photos
  const all38DistrictVisits = [
    // 1. Patna Division
    {
      id: 'patna',
      name: 'Patna',
      nameHi: 'पटना',
      division: 'Patna',
      divisionHi: 'पटना प्रमंडल',
      img: '/gallery/development/1.jpg',
      visitTitleHi: 'गंगा मरीन ड्राइव एवं जेपी गंगा पथ विस्तारीकरण निरीक्षण',
      visitTitleEn: 'Ganga Marine Drive & JP Ganga Path Inspection',
      tagHi: 'माननीय मुख्यमंत्री निरीक्षण दौरा',
      tagEn: "Hon'ble CM Inspection Tour",
    },
    {
      id: 'nalanda',
      name: 'Nalanda',
      nameHi: 'नालंदा (बिहारशरीफ)',
      division: 'Patna',
      divisionHi: 'पटना प्रमंडल',
      img: '/gallery/development/3.jpg',
      visitTitleHi: 'नालंदा मेडिकल कॉलेज व हेरिटेज सर्किट निर्माण निरीक्षण',
      visitTitleEn: 'Nalanda Medical College & Heritage Circuit Review',
      tagHi: 'निर्माण कार्य स्थलीय निरीक्षण',
      tagEn: 'On-site Construction Inspection',
    },
    {
      id: 'bhojpur',
      name: 'Bhojpur',
      nameHi: 'भोजपुर (आरा)',
      division: 'Patna',
      divisionHi: 'पटना प्रमंडल',
      img: '/gallery/development/18.jpg',
      visitTitleHi: 'सड़क चौड़ीकरण एवं बाईपास परियोजना समीक्षा बैठक',
      visitTitleEn: 'Road Widening & Bypass Projects Review Meeting',
      tagHi: 'विभागीय समीक्षा बैठक',
      tagEn: 'Departmental Review Meeting',
    },
    {
      id: 'buxar',
      name: 'Buxar',
      nameHi: 'बक्सर',
      division: 'Patna',
      divisionHi: 'पटना प्रमंडल',
      img: '/gallery/development/2.jpg',
      visitTitleHi: 'बक्सर थर्मल पावर प्लांट एवं गंगा रिवरफ्रंट निरीक्षण',
      visitTitleEn: 'Buxar Thermal Power & Ganga Riverfront Inspection',
      tagHi: 'ऊर्जा एवं अवसंरचना दौरा',
      tagEn: 'Energy & Infrastructure Tour',
    },
    {
      id: 'rohtas',
      name: 'Rohtas',
      nameHi: 'रोहतास (सासाराम)',
      division: 'Patna',
      divisionHi: 'पटना प्रमंडल',
      img: '/gallery/development/11.jpg',
      visitTitleHi: 'कैमूर पहाड़ी चेक डैम एवं कृषि सिंचाई योजना लोकार्पण',
      visitTitleEn: 'Kaimur Hill Check Dam & Irrigation Dedication',
      tagHi: 'किसान व लाभार्थी सम्मान',
      tagEn: 'Beneficiary & Farmer Program',
    },
    {
      id: 'kaimur',
      name: 'Kaimur',
      nameHi: 'कैमूर (भभुआ)',
      division: 'Patna',
      divisionHi: 'पटना प्रमंडल',
      img: '/gallery/development/8.jpg',
      visitTitleHi: 'सीमावर्ती सुरक्षा, पुलिस बल एवं ग्रामीण सड़क निरीक्षण',
      visitTitleEn: 'Border Security & Rural Roads Inspection',
      tagHi: 'कानून व्यवस्था एवं सुरक्षा समीक्षा',
      tagEn: 'Law & Order Review',
    },

    // 2. Magadh Division
    {
      id: 'gaya',
      name: 'Gaya',
      nameHi: 'गयाजी',
      division: 'Magadh',
      divisionHi: 'मगध प्रमंडल',
      img: '/gallery/development/5.jpg',
      visitTitleHi: 'फल्गु रबर डैम, विष्णुपद व महाबोधि कॉरिडोर विकास समीक्षा',
      visitTitleEn: 'Falgu Rubber Dam & Mahabodhi Corridor Review',
      tagHi: 'तीर्थ विकास एवं हेरिटेज दौरा',
      tagEn: 'Heritage & Pilgrimage Tour',
    },
    {
      id: 'aurangabad',
      name: 'Aurangabad',
      nameHi: 'औरंगाबाद',
      division: 'Magadh',
      divisionHi: 'मगध प्रमंडल',
      img: '/gallery/leadership/1.jpg',
      visitTitleHi: 'उत्तर कोयल नहर परियोजना एवं औद्योगिक क्लस्टर समीक्षा',
      visitTitleEn: 'North Koel Canal & Industrial Cluster Review',
      tagHi: 'औद्योगिक निवेश व सुशासन',
      tagEn: 'Industrial Investment & Governance',
    },
    {
      id: 'nawada',
      name: 'Nawada',
      nameHi: 'नवादा',
      division: 'Magadh',
      divisionHi: 'मगध प्रमंडल',
      img: '/gallery/development/10.jpg',
      visitTitleHi: 'ककोलत जलप्रपात ईको-टूरिज्म व गंगा जल आपूर्ति निरीक्षण',
      visitTitleEn: 'Kakolat Eco-Tourism & Ganga Water Supply Review',
      tagHi: 'जनहित योजना वितरण',
      tagEn: 'Public Welfare Distribution',
    },
    {
      id: 'jehanabad',
      name: 'Jehanabad',
      nameHi: 'जहानाबाद',
      division: 'Magadh',
      divisionHi: 'मगध प्रमंडल',
      img: '/gallery/development/12.jpg',
      visitTitleHi: 'बराबर गुफाएं हेरिटेज सर्किट एवं लोक शिकायत निवारण',
      visitTitleEn: 'Barabar Caves Heritage & Public Grievance Redressal',
      tagHi: 'जनसुनवाई एवं समीक्षा',
      tagEn: 'Public Redressal & Review',
    },
    {
      id: 'arwal',
      name: 'Arwal',
      nameHi: 'अरवल',
      division: 'Magadh',
      divisionHi: 'मगध प्रमंडल',
      img: '/gallery/development/7.jpg',
      visitTitleHi: 'सोन नदी तटबंध सुरक्षा एवं जिला समाहरणालय समीक्षा',
      visitTitleEn: 'Son Embankment Protection & Collectorate Review',
      tagHi: 'प्रशासनिक कार्यशाला',
      tagEn: 'Administrative Review',
    },

    // 3. Tirhut Division
    {
      id: 'muzaffarpur',
      name: 'Muzaffarpur',
      nameHi: 'मुजफ्फरपुर',
      division: 'Tirhut',
      divisionHi: 'तिरहुत प्रमंडल',
      img: '/gallery/development/6.jpg',
      visitTitleHi: 'एसकेएमसीएच सुपर स्पेशियलिटी ब्लॉक एवं कैंसर संस्थान शिलान्यास',
      visitTitleEn: 'SKMCH Super Specialty & Cancer Hospital Foundation',
      tagHi: 'स्वास्थ्य अवसंरचना लोकार्पण',
      tagEn: 'Healthcare Dedication',
    },
    {
      id: 'east_champaran',
      name: 'East Champaran',
      nameHi: 'पूर्वी चंपारण (मोतिहारी)',
      division: 'Tirhut',
      divisionHi: 'तिरहुत प्रमंडल',
      img: '/gallery/development/13.jpg',
      visitTitleHi: 'गांधी स्मृति संग्रहालय, आदर्श विद्यालय व छात्रा संवाद',
      visitTitleEn: 'Gandhi Memorial & Model School Student Dialogue',
      tagHi: 'शिक्षा एवं युवा संवाद दौरा',
      tagEn: 'Youth & Education Dialogue',
    },
    {
      id: 'west_champaran',
      name: 'West Champaran',
      nameHi: 'पश्चिम चंपारण (बेतिया)',
      division: 'Tirhut',
      divisionHi: 'तिरहुत प्रमंडल',
      img: '/gallery/development/14.jpg',
      visitTitleHi: 'वाल्मीकि टाइगर रिजर्व ईको-टूरिज्म व विकसित बिहार महासम्मेलन',
      visitTitleEn: 'Valmiki Tiger Reserve Eco-Tourism & State Convention',
      tagHi: 'विशाल जनसभा एवं विकास घोषणा',
      tagEn: 'Public Address & Announcements',
    },
    {
      id: 'sitamarhi',
      name: 'Sitamarhi',
      nameHi: 'सीतामढ़ी',
      division: 'Tirhut',
      divisionHi: 'तिरहुत प्रमंडल',
      img: '/gallery/development/4.jpg',
      visitTitleHi: 'पुनौरा धाम जानकी मंदिर कॉरिडोर एवं भारत-नेपाल सीमा विकास',
      visitTitleEn: 'Punaura Dham Janki Mandir Corridor & Border Review',
      tagHi: 'धार्मिक पर्यटन व सीमांत विकास',
      tagEn: 'Religious Tourism & Border Dev',
    },
    {
      id: 'sheohar',
      name: 'Sheohar',
      nameHi: 'शिवहर',
      division: 'Tirhut',
      divisionHi: 'तिरहुत प्रमंडल',
      img: '/gallery/development/16.jpg',
      visitTitleHi: 'बागमती बाढ़ सुरक्षा तटबंध एवं डिजिटल क्लासरूम शुभारंभ',
      visitTitleEn: 'Bagmati Flood Embankment & Smart Classrooms Launch',
      tagHi: 'डिजिटल शिक्षा व सुरक्षा',
      tagEn: 'Digital Education Launch',
    },
    {
      id: 'vaishali',
      name: 'Vaishali',
      nameHi: 'वैशाली (हाजीपुर)',
      division: 'Tirhut',
      divisionHi: 'तिरहुत प्रमंडल',
      img: '/gallery/development/12.jpg',
      visitTitleHi: 'बुद्ध सम्यक दर्शन संग्रहालय एवं औद्योगिक पार्क निरीक्षण',
      visitTitleEn: 'Buddha Samyak Darshan Museum & Industrial Park Visit',
      tagHi: 'उद्योग एवं संस्कृति निरीक्षण',
      tagEn: 'Industry & Culture Tour',
    },

    // 4. Saran Division
    {
      id: 'saran',
      name: 'Saran',
      nameHi: 'सारण (छपरा)',
      division: 'Saran',
      divisionHi: 'सारण प्रमंडल',
      img: '/gallery/development/8.jpg',
      visitTitleHi: 'डबल डेकर फ्लाईओवर एवं जयप्रकाश विश्वविद्यालय परिसर समीक्षा',
      visitTitleEn: 'Double Decker Flyover & JP University Campus Review',
      tagHi: 'यातायात अवसंरचना निरीक्षण',
      tagEn: 'Transit Infrastructure Review',
    },
    {
      id: 'siwan',
      name: 'Siwan',
      nameHi: 'सीवान',
      division: 'Saran',
      divisionHi: 'सारण प्रमंडल',
      img: '/gallery/leadership/2.jpg',
      visitTitleHi: 'जीरादेई प्रथम राष्ट्रपति स्मारक एवं स्वास्थ्य केंद्र निरीक्षण',
      visitTitleEn: 'Ziradei Presidential Memorial & Health Centers Tour',
      tagHi: 'प्रेस ब्रीफिंग एवं समीक्षा',
      tagEn: 'Press Briefing & Inspection',
    },
    {
      id: 'gopalganj',
      name: 'Gopalganj',
      nameHi: 'गोपालगंज',
      division: 'Saran',
      divisionHi: 'सारण प्रमंडल',
      img: '/gallery/leadership/3.jpg',
      visitTitleHi: 'थावे दुर्गा मंदिर कॉरिडोर जीर्णोद्धार एवं गन्ना उद्योग समीक्षा',
      visitTitleEn: 'Thawe Temple Corridor & Sugar Mills Revival Review',
      tagHi: 'ग्रामीण विकास एवं जनसंवाद',
      tagEn: 'Rural Development & Dialogue',
    },

    // 5. Darbhanga Division
    {
      id: 'darbhanga',
      name: 'Darbhanga',
      nameHi: 'दरभंगा',
      division: 'Darbhanga',
      divisionHi: 'दरभंगा प्रमंडल',
      img: '/gallery/development/4.jpg',
      visitTitleHi: 'एम्स (AIIMS) निर्माण स्थल एवं दरभंगा एयरपोर्ट विस्तारीकरण निरीक्षण',
      visitTitleEn: 'Darbhanga AIIMS Construction & Airport Expansion Visit',
      tagHi: 'एम्स व विमानपत्तन निरीक्षण',
      tagEn: 'AIIMS & Airport Inspection',
    },
    {
      id: 'madhubani',
      name: 'Madhubani',
      nameHi: 'मधुबनी',
      division: 'Darbhanga',
      divisionHi: 'दरभंगा प्रमंडल',
      img: '/gallery/leadership/4.jpg',
      visitTitleHi: 'मिथिला चित्रकला संस्थान एवं कन्या शिक्षा संवर्धन समीक्षा',
      visitTitleEn: 'Mithila Art Institute & Girls Education Outreach',
      tagHi: 'कला, संस्कृति व शिक्षा प्रोत्साहन',
      tagEn: 'Culture & Education Promotion',
    },
    {
      id: 'samastipur',
      name: 'Samastipur',
      nameHi: 'समस्तीपुर',
      division: 'Darbhanga',
      divisionHi: 'दरभंगा प्रमंडल',
      img: '/gallery/development/10.jpg',
      visitTitleHi: 'राजेंद्र कृषि विश्वविद्यालय रिसर्च विंग व हर घर नल का जल निरीक्षण',
      visitTitleEn: 'Agricultural University & Har Ghar Nal Ka Jal Visit',
      tagHi: 'कृषि शोध एवं नल-जल समीक्षा',
      tagEn: 'Agriculture Research & Water Dev',
    },

    // 6. Kosi Division
    {
      id: 'saharsa',
      name: 'Saharsa',
      nameHi: 'सहरसा',
      division: 'Kosi',
      divisionHi: 'कोसी प्रमंडल',
      img: '/gallery/development/16.jpg',
      visitTitleHi: 'कोसी क्षेत्रीय अस्पताल आधुनिकीकरण एवं मत्सय पालन क्लस्टर',
      visitTitleEn: 'Kosi Regional Hospital Modernization & Fisheries Cluster',
      tagHi: 'स्वास्थ्य व आजीविका दौरा',
      tagEn: 'Healthcare & Livelihood Tour',
    },
    {
      id: 'supaul',
      name: 'Supaul',
      nameHi: 'सुपौल',
      division: 'Kosi',
      divisionHi: 'कोसी प्रमंडल',
      img: '/gallery/development/2.jpg',
      visitTitleHi: 'कोसी बराज तटबंध सुदृढ़ीकरण एवं 132KV ग्रिड सब-स्टेशन निरीक्षण',
      visitTitleEn: 'Kosi Barrage Embankment & 132KV Grid Sub-station Visit',
      tagHi: 'ऊर्जा एवं बाढ़ सुरक्षा निरीक्षण',
      tagEn: 'Flood Defense & Power Review',
    },
    {
      id: 'madhepura',
      name: 'Madhepura',
      nameHi: 'मधेपुरा',
      division: 'Kosi',
      divisionHi: 'कोसी प्रमंडल',
      img: '/gallery/development/9.jpg',
      visitTitleHi: 'इलेक्ट्रिक लोकोमोटिव फैक्ट्री व जननायक कर्पूरी ठाकुर मेडिकल कॉलेज',
      visitTitleEn: 'Electric Locomotive Plant & Medical College Review',
      tagHi: 'औद्योगिक व चिकित्सा समीक्षा',
      tagEn: 'Industry & Medical Inspection',
    },

    // 7. Purnia Division
    {
      id: 'purnia',
      name: 'Purnia',
      nameHi: 'पूर्णिया',
      division: 'Purnia',
      divisionHi: 'पूर्णिया प्रमंडल',
      img: '/gallery/development/7.jpg',
      visitTitleHi: 'पूर्णिया एयरपोर्ट सिविल एन्क्लेव एवं मक्का-मखाना प्रोसेसिंग हब',
      visitTitleEn: 'Purnia Airport Civil Enclave & Agro Processing Hub',
      tagHi: 'विमानन एवं कृषि उद्योग समीक्षा',
      tagEn: 'Aviation & Agro Review',
    },
    {
      id: 'katihar',
      name: 'Katihar',
      nameHi: 'कटिहार',
      division: 'Purnia',
      divisionHi: 'पूर्णिया प्रमंडल',
      img: '/gallery/development/15.jpg',
      visitTitleHi: 'मनिहारी-साहिबगंज गंगा सेतु व सामाजिक सुरक्षा पेंशन वितरण',
      visitTitleEn: 'Manihari Ganga Bridge & DBT Social Security Distribution',
      tagHi: 'पेंशन डीबीटी व सेतु निरीक्षण',
      tagEn: 'DBT Launch & Bridge Review',
    },
    {
      id: 'araria',
      name: 'Araria',
      nameHi: 'अररिया',
      division: 'Purnia',
      divisionHi: 'पूर्णिया प्रमंडल',
      img: '/gallery/development/3.jpg',
      visitTitleHi: 'जोकीहाट ग्रामीण सड़क नवीनीकरण एवं सीमावर्ती व्यापार सुविधा केंद्र',
      visitTitleEn: 'Rural Roads Upgrade & Border Trade Facilitation Centre',
      tagHi: 'सड़क एवं व्यापार समीक्षा',
      tagEn: 'Roads & Trade Review',
    },
    {
      id: 'kishanganj',
      name: 'Kishanganj',
      nameHi: 'किशनगंज',
      division: 'Purnia',
      divisionHi: 'पूर्णिया प्रमंडल',
      img: '/gallery/development/1.jpg',
      visitTitleHi: 'चाय बगान प्रसंस्करण इकाइयां एवं अल्पसंख्यक कन्या आवासीय विद्यालय',
      visitTitleEn: 'Tea Processing Units & Girls Residential School Visit',
      tagHi: 'कल्याणकारी योजना निरीक्षण',
      tagEn: 'Welfare Schemes Inspection',
    },

    // 8. Bhagalpur Division
    {
      id: 'bhagalpur',
      name: 'Bhagalpur',
      nameHi: 'भागलपुर',
      division: 'Bhagalpur',
      divisionHi: 'भागलपुर प्रमंडल',
      img: '/gallery/development/2.jpg',
      visitTitleHi: 'विक्रमशिला सेतु समानांतर फोर-लेन पुल व सिल्क पार्क निरीक्षण',
      visitTitleEn: 'Vikramshila 4-Lane Parallel Bridge & Silk Park Visit',
      tagHi: 'मेगा ब्रिज एवं सिल्क क्लस्टर',
      tagEn: 'Mega Bridge & Silk Cluster',
    },
    {
      id: 'banka',
      name: 'Banka',
      nameHi: 'बाँका',
      division: 'Bhagalpur',
      divisionHi: 'भागलपुर प्रमंडल',
      img: '/gallery/development/5.jpg',
      visitTitleHi: 'मदार पर्वत रोपवे एवं ओढ़नी डैम ईको-पर्यटन केंद्र समीक्षा',
      visitTitleEn: 'Mandar Hill Ropeway & Odhani Dam Eco-Tourism Review',
      tagHi: 'ईको-टूरिज्म विकास दौरा',
      tagEn: 'Eco-Tourism Development',
    },

    // 9. Munger Division
    {
      id: 'munger',
      name: 'Munger',
      nameHi: 'मुंगेर',
      division: 'Munger',
      divisionHi: 'मुंगेर प्रमंडल',
      img: '/gallery/development/17.jpg',
      visitTitleHi: 'मुंगेर गंगा रेल-सह-सड़क पुल अप्रोच रोड व विश्वविद्यालय भवन',
      visitTitleEn: 'Ganga Rail-cum-Road Bridge Approach & University Campus',
      tagHi: 'प्रमंडलीय विकास समीक्षा',
      tagEn: 'Divisional Review',
    },
    {
      id: 'begusarai',
      name: 'Begusarai',
      nameHi: 'बेगूसराय',
      division: 'Munger',
      divisionHi: 'मुंगेर प्रमंडल',
      img: '/gallery/development/9.jpg',
      visitTitleHi: 'बरौनी रिफाइनरी विस्तारीकरण, उर्वरक संयंत्र व युवा रोजगार मेला',
      visitTitleEn: 'Barauni Refinery & Fertilizer Plant & Employment Fair',
      tagHi: 'औद्योगिक रोजगार व नियुक्ति',
      tagEn: 'Industrial Jobs & Appointments',
    },
    {
      id: 'khagaria',
      name: 'Khagaria',
      nameHi: 'खगड़िया',
      division: 'Munger',
      divisionHi: 'मुंगेर प्रमंडल',
      img: '/gallery/development/14.jpg',
      visitTitleHi: 'कोसी-बागमती संगम सुरक्षा तटबंध व मक्का आधारित खाद्य प्रसंस्करण',
      visitTitleEn: 'Kosi-Bagmati Confluence Embankment & Maize Food Park',
      tagHi: 'खाद्य प्रसंस्करण व बांध समीक्षा',
      tagEn: 'Food Park & Flood Control',
    },
    {
      id: 'jamui',
      name: 'Jamui',
      nameHi: 'जमुई',
      division: 'Munger',
      divisionHi: 'मुंगेर प्रमंडल',
      img: '/gallery/leadership/3.jpg',
      visitTitleHi: 'नागी-नकटी पक्षी अभयारण्य पर्यटन व मेडिकल कॉलेज निर्माण निरीक्षण',
      visitTitleEn: 'Nagi-Nakti Bird Sanctuary & Medical College Site Review',
      tagHi: 'चिकित्सा महाविद्यालय निरीक्षण',
      tagEn: 'Medical College Inspection',
    },
    {
      id: 'lakhisarai',
      name: 'Lakhisarai',
      nameHi: 'लखीसराय',
      division: 'Munger',
      divisionHi: 'मुंगेर प्रमंडल',
      img: '/gallery/development/6.jpg',
      visitTitleHi: 'अशोक धाम मंदिर कॉरिडोर विकास एवं क्यूल नदी रिवरफ्रंट',
      visitTitleEn: 'Ashok Dham Temple Corridor & Kiul Riverfront Visit',
      tagHi: 'धार्मिक कॉरिडोर व घाट निर्माण',
      tagEn: 'Corridor & Ghats Development',
    },
    {
      id: 'sheikhpura',
      name: 'Sheikhpura',
      nameHi: 'शेखपुरा',
      division: 'Munger',
      divisionHi: 'मुंगेर प्रमंडल',
      img: '/gallery/development/18.jpg',
      visitTitleHi: 'गिरिहिंडा पहाड़ पर्यटन स्थल व जिला समाहरणालय सुशासन कार्यशाला',
      visitTitleEn: 'Girihinda Tourism & District Collectorate Governance Workshop',
      tagHi: 'सुशासन एवं विकास कार्यशाला',
      tagEn: 'Governance & Development Review',
    },
  ];

  // District Highlights (38 Districts CM Visit Showcase) States
  const [districtSelectedDivision, setDistrictSelectedDivision] = useState<string>('ALL');
  const [districtSearchQuery, setDistrictSearchQuery] = useState<string>('');
  const [districtViewMode, setDistrictViewMode] = useState<'slider' | 'grid'>('slider');
  const districtSliderRef = useRef<HTMLDivElement>(null);

  const scrollDistrictSlider = (direction: 'left' | 'right') => {
    if (districtSliderRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      districtSliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const divisionsList = [
    { id: 'ALL', nameHi: 'सभी 38 जिले', nameEn: 'All 38 Districts', count: 38 },
    { id: 'Patna', nameHi: 'पटना', nameEn: 'Patna', count: 6 },
    { id: 'Magadh', nameHi: 'मगध', nameEn: 'Magadh', count: 5 },
    { id: 'Tirhut', nameHi: 'तिरहुत', nameEn: 'Tirhut', count: 6 },
    { id: 'Saran', nameHi: 'सारण', nameEn: 'Saran', count: 3 },
    { id: 'Darbhanga', nameHi: 'दरभंगा', nameEn: 'Darbhanga', count: 3 },
    { id: 'Kosi', nameHi: 'कोसी', nameEn: 'Kosi', count: 3 },
    { id: 'Purnia', nameHi: 'पूर्णिया', nameEn: 'Purnia', count: 4 },
    { id: 'Bhagalpur', nameHi: 'भागलपुर', nameEn: 'Bhagalpur', count: 2 },
    { id: 'Munger', nameHi: 'मुंगेर', nameEn: 'Munger', count: 6 },
  ];

  const filteredDistrictVisits = useMemo(() => {
    return all38DistrictVisits.filter(d => {
      const matchDivision = districtSelectedDivision === 'ALL' || d.division === districtSelectedDivision;
      const q = districtSearchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        d.name.toLowerCase().includes(q) ||
        d.nameHi.toLowerCase().includes(q) ||
        d.visitTitleHi.toLowerCase().includes(q) ||
        d.visitTitleEn.toLowerCase().includes(q);
      return matchDivision && matchSearch;
    });
  }, [districtSelectedDivision, districtSearchQuery]);

  // Tourism Section Historical Slides Watermark
  const tourismHistoricalSlides = [
    {
      id: 'mahabodhi',
      img: '/images/tourism_slides/mahabodhi_temple.jpg',
      titleHi: 'महाबोधि महाविहार, बोधगया (यूनेस्को विश्व धरोहर)',
      titleEn: 'Mahabodhi Temple, Bodh Gaya (UNESCO World Heritage Site)',
      tagHi: 'भगवान बुद्ध की पावन ज्ञानभूमि',
      tagEn: "Land of Buddha's Enlightenment",
    },
    {
      id: 'nalanda',
      img: '/images/tourism_slides/nalanda_mahavihara.jpg',
      titleHi: 'प्राचीन नालंदा महाविहार (यूनेस्को विश्व धरोहर)',
      titleEn: 'Ancient Nalanda Mahavihara (UNESCO World Heritage Site)',
      tagHi: 'विश्व का प्राचीनतम आवासीय विश्वविद्यालय',
      tagEn: "World's Ancient Residential University",
    },
    {
      id: 'vaishali',
      img: '/images/tourism_slides/vaishali_stupa.jpg',
      titleHi: 'वैशाली स्तूप एवं सम्राट अशोक सिंह स्तंभ',
      titleEn: 'Vaishali Stupa & Ashoka Lion Pillar',
      tagHi: 'विश्व का प्रथम गणतंत्र',
      tagEn: "World's First Republic",
    },
    {
      id: 'rajgir',
      img: '/images/tourism_slides/rajgir_heritage.jpg',
      titleHi: 'विश्व शांति स्तूप एवं गृद्धकूट पर्वत, राजगीर',
      titleEn: 'Vishwa Shanti Stupa & Gridhakuta Hills, Rajgir',
      tagHi: 'शांति, ध्यान एवं प्राकृतिक रमणीयता',
      tagEn: 'Peace, Meditation & Scenic Hills',
    },
    {
      id: 'golghar',
      img: '/images/tourism_slides/golghar_patna.jpg',
      titleHi: 'ऐतिहासिक गोलघर, पटना',
      titleEn: 'Historic Golghar, Patna',
      tagHi: '1786 का ऐतिहासिक वास्तुशिल्प',
      tagEn: '1786 Historic Architectural Wonder',
    },
    {
      id: 'sabhyata_dwar',
      img: '/images/tourism_slides/sabhyata_dwar.jpg',
      titleHi: 'सभ्यता द्वार एवं गंगा रिवरफ्रंट, पटना',
      titleEn: 'Sabhyata Dwar & Ganga Riverfront, Patna',
      tagHi: 'मौर्य काल व बौद्ध सभ्यता का प्रतीक',
      tagEn: 'Symbol of Mauryan & Buddhist Heritage',
    },
  ];

  const [currentTourismSlide, setCurrentTourismSlide] = useState(0);
  const [isTourismSlidePlaying, setIsTourismSlidePlaying] = useState(true);

  // Auto-rotate tourism background watermark slides every 5.5 seconds
  useEffect(() => {
    if (!isTourismSlidePlaying) return;
    const timer = setInterval(() => {
      setCurrentTourismSlide((prev) => (prev + 1) % tourismHistoricalSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isTourismSlidePlaying, tourismHistoricalSlides.length]);

  return (
    <div
      className={`min-h-screen bg-white text-slate-800 font-sans selection:bg-amber-100 selection:text-slate-900 ${
        contrastMode === 'high' ? 'contrast-125' : contrastMode === 'low' ? 'contrast-90' : ''
      }`}
      style={{
        fontSize: fontSizeLevel === 1 ? '1.05rem' : fontSizeLevel === -1 ? '0.95rem' : '1rem'
      }}
    >
      {/* ========================================================= */}
      {/* 1. OFFICIAL BIHAR GOVERNMENT UNIFIED HEADER               */}
      {/* ========================================================= */}
      <BiharGovHeader
        currentUser={currentUser}
        language={language}
        onToggleLanguage={onToggleLanguage}
        onOpenLogin={onOpenLogin}
        onLogout={onLogout || (() => {})}
        onGoHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onOpenSection={(section) => {
          if (section === 'table') {
            if (onOpenTableWithTab) onOpenTableWithTab('all');
            else {
              const el = document.getElementById('announcement-dashboard');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          } else if (section === 'reports') {
            const el = document.getElementById('announcement-dashboard');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          } else if (section === 'master') {
            const el = document.getElementById('dignitaries');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          } else if (section === 'form') {
            if (onOpenNewForm) onOpenNewForm();
          } else if (section === 'admin') {
            if (onOpenDashboard) onOpenDashboard();
          }
        }}
        onSearch={(q) => {
          setSearchQuery(q);
          setProjectSearchTerm(q);
          const el = document.getElementById('announcement-dashboard');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        activeNav="home"
      />

      <main id="main-content">
        {/* ========================================================= */}
        {/* 3. HERO BANNER (With 3D Stage Depth & Controls)          */}
        {/* ========================================================= */}
        <section 
          className="relative w-full bg-[#0a0f1d] overflow-hidden select-none border-b-[5px] border-amber-500 group shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
          style={{ perspective: '1400px' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative w-full min-h-[400px] sm:min-h-[480px] md:min-h-[520px] lg:min-h-[560px]">
            {/* Full-width Hero Visual Slides with 3D Depth Transitions */}
            <div className="w-full relative min-h-[400px] sm:min-h-[480px] md:min-h-[520px] lg:min-h-[560px]">
              {heroSlides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-700 ease-out transform ${
                    idx === currentSlide 
                      ? 'opacity-100 scale-100 z-10' 
                      : 'opacity-0 scale-[0.98] pointer-events-none z-0'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.titleEn}
                    className="w-full h-full object-cover object-[center_top] filter brightness-105 contrast-[1.02]"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/Web_Images/Slide1.webp';
                    }}
                  />

                  {/* Slogan Ribbon at bottom of slide with 3D Depth */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 text-white py-2.5 px-4 sm:px-6 shadow-[0_-4px_15px_rgba(0,0,0,0.4)] border-t-2 border-amber-300 flex items-center justify-between">
                    <div className="text-xs sm:text-sm font-black tracking-wide drop-shadow truncate max-w-3xl">
                      {language === 'hi' ? slide.subtitleHi : slide.subtitleEn}
                    </div>
                    <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold text-amber-200 flex-shrink-0">
                      <span>{language === 'hi' ? 'काम दमदार, डबल इंजन सरकार' : 'Double Engine Fast-Track Growth'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 3D Tactile Navigation Arrows */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 bg-gradient-to-br from-slate-900/90 via-black/80 to-slate-950/90 hover:from-amber-600 hover:to-orange-700 text-white rounded-full flex items-center justify-center backdrop-blur-md opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 z-20 shadow-[0_10px_25px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.4)] border-2 border-amber-400/50 hover:border-amber-300 hover:scale-110 active:scale-95 active:translate-y-[-46%]"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow" />
            </button>

            <button
              onClick={() => setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1))}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 bg-gradient-to-br from-slate-900/90 via-black/80 to-slate-950/90 hover:from-amber-600 hover:to-orange-700 text-white rounded-full flex items-center justify-center backdrop-blur-md opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 z-20 shadow-[0_10px_25px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.4)] border-2 border-amber-400/50 hover:border-amber-300 hover:scale-110 active:scale-95 active:translate-y-[-46%]"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow" />
            </button>

            {/* 3D Glass Dock Indicator Pills (positioned above slogan ribbon) */}
            <div className="absolute bottom-12 right-6 sm:right-10 flex items-center gap-2.5 z-20 bg-gradient-to-r from-black/80 via-slate-950/85 to-black/80 px-4 py-2 rounded-full backdrop-blur-md border border-amber-400/40 shadow-[0_8px_25px_rgba(0,0,0,0.7),inset_0_1px_2px_rgba(255,255,255,0.25)]">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-300 rounded-full h-2.5 ${
                    currentSlide === idx
                      ? 'w-8 bg-gradient-to-r from-amber-400 to-amber-300 shadow-[0_0_12px_#f59e0b]'
                      : 'w-2.5 bg-white/50 hover:bg-white'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. DIGNITARIES & OVERVIEW SECTION (Warm Sand Background)   */}
        {/* ========================================================= */}
        <section id="overview" className="bg-[#fcf8f2] py-10 sm:py-14 border-b border-[#e5ded5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column (3 cols): Dignitaries Stack with 3D Elevated Cards */}
              <div id="dignitaries" className="lg:col-span-3 space-y-3.5">
                {/* 1. PM Narendra Modi */}
                <div className="bg-white rounded-xl p-3.5 shadow-[0_4px_14px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] border border-[#e2d8cd] flex items-center gap-3.5 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer">
                  <div className="relative">
                    <img
                      src="/images/up_portal/pm_modi.jpg"
                      alt="Shri Narendra Modi"
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-300 shadow-md"
                    />
                  </div>
                  <div className="leading-tight">
                    <div className="text-sm font-extrabold text-slate-900">
                      Shri Narendra Modi
                    </div>
                    <div className="text-[11px] text-gray-600 font-medium mt-0.5">
                      Hon'ble Prime Minister of India
                    </div>
                  </div>
                </div>

                {/* 2. Governor Lt Gen Syed Ata Hasnain (Retd.) */}
                <div className="bg-white rounded-xl p-3.5 shadow-[0_4px_14px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] border border-[#e2d8cd] flex items-center gap-3.5 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer">
                  <div className="relative">
                    <img
                      src="/images/up_portal/governor_bihar.jpg"
                      alt="Lt Gen Syed Ata Hasnain (Retd.)"
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-300 shadow-md"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/bihar-government-logo.png';
                      }}
                    />
                  </div>
                  <div className="leading-tight">
                    <div className="text-sm font-extrabold text-slate-900">
                      {language === 'hi' ? 'ले. जनरल सैयद अता हसनैन (से.नि.)' : 'Lt Gen Syed Ata Hasnain (Retd.)'}
                    </div>
                    <div className="text-[11px] text-gray-600 font-medium mt-0.5">
                      {language === 'hi' ? 'माननीय राज्यपाल, बिहार' : "Hon'ble Governor, Bihar"}
                    </div>
                  </div>
                </div>

                {/* 3. CM Shri Samrat Choudhary */}
                <div className="bg-gradient-to-r from-amber-50/70 to-white rounded-xl p-3.5 shadow-[0_6px_18px_rgba(245,158,11,0.15),inset_0_1px_0_rgba(255,255,255,0.9)] border-2 border-amber-400 flex items-center gap-3.5 hover:-translate-y-1.5 hover:shadow-[0_16px_30px_rgba(245,158,11,0.25)] transition-all duration-300 cursor-pointer">
                  <div className="relative">
                    <img
                      src="/images/up_portal/cm_samrat.jpg"
                      alt="Shri Samrat Choudhary"
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-500 shadow-md"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/assets/Web_Images/cm_samrat_choudhary.png';
                      }}
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-sm font-extrabold text-slate-900">
                      Shri Samrat Choudhary
                    </div>
                    <div className="text-[11px] text-amber-800 font-bold mt-0.5">
                      Hon'ble Chief Minister, Bihar
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Column (6 cols): Overview of Bihar Narrative */}
              <div className="lg:col-span-6 space-y-4">
                <div className="border-b-2 border-slate-300 pb-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#0f2b48] font-serif">
                    {language === 'hi' ? 'बिहार का संक्षिप्त परिचय' : 'Overview of Bihar'}
                  </h2>
                </div>
                
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                  {language === 'hi'
                    ? 'बिहार, प्राचीन सभ्यता, संस्कृति और ज्ञान की पावन भूमि है, जहाँ विश्वविख्यात नालंदा और विक्रमशिला के शिक्षा केंद्रों ने विश्व को आलोकित किया। आधुनिक युग में, बिहार अपने विस्तृत एक्सप्रेसवे नेटवर्क, गंगा नदी पर भव्य सेतुओं, औद्योगिक पार्कों, उत्कृष्ट स्वास्थ्य एवं उच्च शिक्षा केंद्रों तथा स्वदेशी उत्पादों के साथ तीव्र विकास की नई गाथा लिख रहा है।'
                    : "Bihar, the heart of ancient India's intellect and spirituality, is a land of holy rivers, sacred heritage, and renowned centers of learning like Nalanda and Vikramshila. In modern times, it is emerging as a dynamic engine of Eastern India's growth with its expanding network of expressways, majestic river bridges across the Ganga, industrial corridors, and centers of educational and medical excellence."}
                </p>

                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                  {language === 'hi'
                    ? 'भगवान बुद्ध, भगवान महावीर, गुरु गोबिंद सिंह जी और आर्यभट्ट की इस पवित्र भूमि में आज पारदर्शी ई-गवर्नेंस, समयबद्ध लोक सेवाओं और सक्रिय नेतृत्व के साथ राज्य सभी 38 जिलों में समग्र विकास, निवेश-अनुकूल परिवेश और प्रत्येक नागरिक के उज्ज्वल भविष्य के लिए पूर्णतः समर्पित है।'
                    : "Since the glorious era of Lord Buddha, Lord Mahavira, Guru Gobind Singh Ji, and Aryabhata, the state has been the cradle of philosophical and scientific brilliance. Today, with its robust infrastructure, proactive leadership, and transparent e-governance across all 38 districts, Bihar offers an investor-friendly ecosystem for a prosperous future for its people and the nation."}
                </p>
              </div>

              {/* Right Column (3 cols): Helplines & Emergency Cards */}
              <div className="lg:col-span-3 space-y-3.5">
                {/* 1. CM Helpline Bihar Card (Matching up.gov.in style) */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-orange-200 hover:shadow-md transition">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 flex items-center justify-between text-white">
                    <div className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      <span>CM Helpline Bihar</span>
                    </div>
                    <img
                      src="/images/bihar-government-logo.png"
                      alt="Bihar Seal"
                      className="h-5 w-auto"
                    />
                  </div>
                  <div className="p-3 text-center">
                    <div className="text-3xl font-black text-[#1f4e8c] tracking-tight font-mono">
                      1076
                    </div>
                    <div className="text-[11px] text-gray-600 font-semibold mt-0.5">
                      Toll-Free: 1800-345-6268
                    </div>
                    <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider mt-1">
                      24x7 Citizen Redressal
                    </div>
                  </div>
                </div>

                {/* 2. Bihar 112 Emergency Card */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 p-2.5 hover:shadow-md transition flex items-center justify-center">
                  <img
                    src="/images/up_portal/bihar_112.png"
                    alt="Bihar Police ERSS 112"
                    className="h-28 w-auto object-contain drop-shadow"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/bihar-government-logo.png';
                    }}
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 6. ANNOUNCEMENT AND PROJECT TRACKING DASHBOARD (After Login) */}
        {/* ========================================================= */}
        {isLoggedIn && (
          <section id="announcement-dashboard" className="bg-[#f7f9fa] py-12 sm:py-16 border-b border-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              
              {/* Header: Exact Title and Subtitle from User's Specification */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-black uppercase tracking-widest mb-3 shadow-xs">
                  <Shield className="w-3.5 h-3.5 text-amber-700" />
                  <span>{language === 'hi' ? 'बिहार सरकार सार्वजनिक प्रतिबद्धता पंजी' : 'Government of Bihar Official Register'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
                  {language === 'hi'
                    ? 'घोषणा एवं परियोजना अनुश्रवण डैशबोर्ड'
                    : 'Announcement and Project Tracking Dashboard'}
                </h2>
                <div className="w-24 h-1.5 bg-[#1b5e4c] mx-auto mt-3 rounded-full" />
                <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-3xl mx-auto font-medium">
                  {language === 'hi'
                    ? 'महत्वपूर्ण सरकारी प्रतिबद्धताओं और विकास घोषणाओं का साझा, नियमित रूप से अद्यतन रजिस्टर।'
                    : 'Maintain a shared, regularly updated register of significant government commitments.'}
                </p>
              </div>

              {/* Active Session Status Bar */}
              <div className="mb-6 bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-900 shadow-xs">
                <div className="flex items-center gap-2.5 text-xs font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                  <span>
                    {language === 'hi'
                      ? 'सत्यापित प्रशासनिक सत्र सक्रिय: '
                      : 'Active Verified Session: '}
                      <strong className="text-emerald-950 font-black">{currentUser?.name || currentUser?.email}</strong>
                      <span className="ml-1.5 px-2 py-0.5 rounded-md bg-emerald-200/80 text-emerald-800 text-[10px] uppercase font-black">
                        {currentUser?.role || 'ADMIN'}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onOpenDashboard}
                      className="px-3 py-1.5 rounded-lg bg-[#1b5e4c] hover:bg-[#144739] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                    >
                      <Layers className="w-3.5 h-3.5 text-amber-300" />
                      <span>{language === 'hi' ? 'कमांड सेंटर कार्यस्थल' : 'Open Command Workspace'}</span>
                    </button>
                    {onLogout && (
                      <button
                        onClick={onLogout}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-gray-100 text-slate-700 border border-slate-300 text-xs font-bold transition"
                      >
                        <span>{language === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Top 6 KPI Metric Badges (Exact numbers from DB / Spec) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
              {/* KPI 1: Total Announcements */}
              <div
                onClick={() => setProjectFilterTab('all')}
                className={`bg-white p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
                  projectFilterTab === 'all' ? 'border-[#1b5e4c] ring-2 ring-emerald-600/30 bg-emerald-50/20' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">{language === 'hi' ? 'कुल घोषणाएँ' : 'Total Reg.'}</span>
                  <Layers className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">{totalAnnouncements}</div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">{language === 'hi' ? 'पंजीकृत घोषणाएँ' : 'Commitments'}</div>
              </div>

              {/* KPI 2: Ongoing */}
              <div
                onClick={() => setProjectFilterTab('ongoing')}
                className={`bg-white p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
                  projectFilterTab === 'ongoing' ? 'border-blue-600 ring-2 ring-blue-600/30 bg-blue-50/20' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">{language === 'hi' ? 'प्रगतिशील' : 'Ongoing'}</span>
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-black text-blue-700 font-mono">{ongoingProjects}</div>
                <div className="text-[10px] text-blue-700 font-semibold mt-0.5">{language === 'hi' ? 'सक्रिय क्रियान्वयन' : 'In Execution'}</div>
              </div>

              {/* KPI 3: Completed */}
              <div
                onClick={() => setProjectFilterTab('completed')}
                className={`bg-white p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
                  projectFilterTab === 'completed' ? 'border-emerald-600 ring-2 ring-emerald-600/30 bg-emerald-50/20' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">{language === 'hi' ? 'पूर्ण' : 'Completed'}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-700 font-mono">{completedProjects}</div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">{language === 'hi' ? 'लोकार्पित / चालू' : 'Delivered'}</div>
              </div>

              {/* KPI 4: Delayed / Obstacles */}
              <div
                onClick={() => setProjectFilterTab('delayed')}
                className={`bg-white p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
                  projectFilterTab === 'delayed' ? 'border-amber-600 ring-2 ring-amber-600/30 bg-amber-50/20' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">{language === 'hi' ? 'बाधित / विलंबित' : 'Delayed'}</span>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-amber-700 font-mono">{delayedProjects}</div>
                <div className="text-[10px] text-amber-700 font-semibold mt-0.5">{language === 'hi' ? 'समीक्षाधीन अवरोध' : 'Action Required'}</div>
              </div>

              {/* KPI 5: Total Sanctioned Outlay */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">{language === 'hi' ? 'स्वीकृत राशि' : 'Sanctioned'}</span>
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-purple-800 font-mono">₹{Math.round(totalSanctionedCr).toLocaleString('en-IN')} <span className="text-xs font-semibold">Cr</span></div>
                <div className="text-[10px] text-purple-700 font-semibold mt-0.5">{language === 'hi' ? 'कुल बजट आवंटन' : 'Total Outlay'}</div>
              </div>

              {/* KPI 6: Average Verified Progress */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">{language === 'hi' ? 'सत्यापित प्रगति' : 'Verified'}</span>
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-700 font-mono">{avgProgress}%</div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">{language === 'hi' ? 'भौतिक औसत प्रगति' : 'Avg Physical Rate'}</div>
              </div>
            </div>

            {/* Filter and Control Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Tab Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                <button
                  onClick={() => setProjectFilterTab('all')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                    projectFilterTab === 'all'
                      ? 'bg-[#1b5e4c] text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{language === 'hi' ? 'सभी घोषणाएँ' : 'All Announcements'}</span>
                  <span className="px-1.5 py-0.2 bg-black/20 rounded-full text-[10px]">{internalProjects.length}</span>
                </button>
                <button
                  onClick={() => setProjectFilterTab('ongoing')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                    projectFilterTab === 'ongoing'
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{language === 'hi' ? 'प्रगतिशील कार्य' : 'Ongoing'}</span>
                  <span className="px-1.5 py-0.2 bg-black/20 rounded-full text-[10px]">{ongoingProjects}</span>
                </button>
                <button
                  onClick={() => setProjectFilterTab('completed')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                    projectFilterTab === 'completed'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{language === 'hi' ? 'पूर्ण परियोजनाएं' : 'Completed'}</span>
                  <span className="px-1.5 py-0.2 bg-black/20 rounded-full text-[10px]">{completedProjects}</span>
                </button>
                <button
                  onClick={() => setProjectFilterTab('delayed')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                    projectFilterTab === 'delayed'
                      ? 'bg-amber-600 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{language === 'hi' ? 'बाधित / विलंबित' : 'Delayed / Obstacles'}</span>
                  <span className="px-1.5 py-0.2 bg-black/20 rounded-full text-[10px]">{delayedProjects}</span>
                </button>
              </div>

              {/* Search, View Toggle & Action */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search Bar */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={projectSearchTerm}
                    onChange={(e) => setProjectSearchTerm(e.target.value)}
                    placeholder={language === 'hi' ? 'खोजें (ID, विभाग, जिला...)' : 'Search (Ref ID, Dept, Dist...)'}
                    className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b5e4c] focus:bg-white transition"
                  />
                  {projectSearchTerm && (
                    <button
                      onClick={() => setProjectSearchTerm('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* View Switcher: Cards vs Table */}
                <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                  <button
                    onClick={() => setProjectCardView('cards')}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 ${
                      projectCardView === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-gray-600 hover:text-slate-900'
                    }`}
                    title="Card View with Photo"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{language === 'hi' ? 'कार्ड दृश्य' : 'Cards'}</span>
                  </button>
                  <button
                    onClick={() => setProjectCardView('table')}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 ${
                      projectCardView === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-gray-600 hover:text-slate-900'
                    }`}
                    title="11-Column Official Table View"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{language === 'hi' ? 'तालिका दृश्य' : '11-Field Table'}</span>
                  </button>
                </div>

                {/* Add New Announcement Button */}
                {onOpenNewForm && (
                  <button
                    onClick={onOpenNewForm}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                    <span>{language === 'hi' ? '+ नया प्रोजेक्ट' : '+ Add Project'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* RESULTS RENDERING */}
            {internalProjects.length === 0 ? (
              <div className="bg-white rounded-3xl border-2 border-dashed border-slate-300 p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 mb-4 shadow-inner">
                  <Database className="w-8 h-8" />
                </div>
                <div className="text-lg sm:text-xl font-black text-slate-800 font-serif">
                  {language === 'hi'
                    ? 'मैन्युअल डेटाबेस प्रविष्टि हेतु तैयार (No Records in Database)'
                    : 'Clean Database — Ready for Manual Data Entry'}
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-lg mx-auto leading-relaxed">
                  {language === 'hi'
                    ? 'सभी पूर्व स्वतः-उत्पन्न (Auto-Detected) डेटा हटा दिए गए हैं। अब आप नीचे दिए गए "+ नया प्रोजेक्ट दर्ज करें" बटन से 11-बिंदु घोषणाएँ एवं विकास योजनाएं मैन्युअल रूप से दर्ज कर सकते हैं।'
                    : 'All auto-detected/dummy records have been cleared. The database is now ready for genuine manual entry. Click "+ Add Project" to enter official commitments.'}
                </p>
                {onOpenNewForm && (
                  <div className="pt-6">
                    <button
                      onClick={onOpenNewForm}
                      className="inline-flex items-center gap-2 bg-[#1b5e4c] hover:bg-[#144739] text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black transition shadow-md active:scale-95"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>{language === 'hi' ? '+ पहला प्रोजेक्ट मैन्युअल दर्ज करें' : '+ Enter First Project Manually'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <div className="text-base font-bold text-slate-800">
                  {language === 'hi' ? 'कोई परियोजना या घोषणा नहीं मिली' : 'No announcements or projects matched your filter'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {language === 'hi' ? 'कृपया खोज शब्द या फ़िल्टर बदलकर पुनः प्रयास करें' : 'Try clearing search terms or changing tab filters'}
                </div>
                <button
                  onClick={() => {
                    setProjectSearchTerm('');
                    setProjectFilterTab('all');
                  }}
                  className="mt-4 px-4 py-1.5 bg-[#1b5e4c] text-white rounded-lg text-xs font-bold hover:bg-[#144739] transition"
                >
                  {language === 'hi' ? 'फ़िल्टर रीसेट करें' : 'Reset Filters'}
                </button>
              </div>
            ) : projectCardView === 'cards' ? (
              /* ================================================= */
              /* CARDS VIEW (Featuring "photo of" infrastructure) */
              /* ================================================= */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((proj) => {
                  const photoIndex = ((proj.id - 1) % 18) + 1;
                  const photoUrl = `/gallery/development/${photoIndex}.jpg`;
                  
                  return (
                    <div
                      key={proj.id}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                    >
                      {/* Photo Header: Note "photo of" from user's spec */}
                      <div className="relative h-48 bg-slate-900 overflow-hidden">
                        <img
                          src={photoUrl}
                          alt={proj.commitment}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/images/up_portal/bihar_hero_cm_speech_banner.jpg';
                          }}
                        />
                        {/* Gradient Scrim */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
                          {/* 1. Reference ID */}
                          <span className="px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 text-[11px] font-black tracking-wide shadow">
                            {proj.referenceId}
                          </span>
                          
                          {/* 6. Current Stage */}
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow border ${
                            proj.currentStage === 'COMMISSIONED' || proj.currentStage === 'OPERATIONAL'
                              ? 'bg-emerald-600/90 text-white border-emerald-400'
                              : proj.currentStage === 'UNDER_CONSTRUCTION'
                              ? 'bg-blue-600/90 text-white border-blue-400'
                              : 'bg-purple-600/90 text-white border-purple-400'
                          }`}>
                            {proj.currentStage.replace(/_/g, ' ')}
                          </span>
                        </div>

                        {/* Bottom Photo Overlay */}
                        <div className="absolute bottom-3 inset-x-3 flex items-end justify-between text-white">
                          <div>
                            {/* 2. Department */}
                            <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1 drop-shadow">
                              <Building2 className="w-3 h-3" />
                              <span className="truncate max-w-[200px]">{proj.department}</span>
                            </div>
                            {/* 4. Location */}
                            <div className="text-xs text-gray-200 flex items-center gap-1 mt-0.5 drop-shadow">
                              <MapPin className="w-3 h-3 text-red-400 flex-shrink-0" />
                              <span className="truncate max-w-[220px]">{proj.districtName || proj.location}</span>
                            </div>
                          </div>

                          {/* 7. Verified Progress Badge */}
                          <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 text-right">
                            <div className="text-lg font-black text-emerald-400 font-mono leading-none">
                              {proj.verifiedProgress}%
                            </div>
                            <div className="text-[9px] uppercase tracking-wider text-gray-300 mt-0.5">
                              {language === 'hi' ? 'सत्यापित' : 'Verified'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Content with 11 Fields */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                        
                        {/* 3. Commitment (Title & Details) */}
                        <div>
                          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-[#1b5e4c] transition line-clamp-2 leading-snug">
                            {proj.commitment}
                          </h3>

                          {/* 4. Beneficiaries */}
                          {proj.beneficiaries && (
                            <div className="mt-2 text-xs text-slate-600 flex items-start gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-150">
                              <UserCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{proj.beneficiaries}</span>
                            </div>
                          )}
                        </div>

                        {/* Progress Bar */}
                        <div>
                          <div className="flex items-center justify-between text-[11px] mb-1 font-bold text-slate-600">
                            <span>{language === 'hi' ? 'सत्यापित भौतिक प्रगति' : '7. Verified Progress'}</span>
                            <span className="font-mono text-emerald-700">{proj.verifiedProgress}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500"
                              style={{ width: `${proj.verifiedProgress}%` }}
                            />
                          </div>
                        </div>

                        {/* 5. Financial Status & 8. Next Milestone Matrix */}
                        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-gray-200">
                          {/* Financial Status */}
                          <div>
                            <div className="text-[10px] font-bold text-gray-500 uppercase">
                              {language === 'hi' ? '5. वित्तीय स्थिति' : '5. Financial Status'}
                            </div>
                            <div className="font-black text-slate-900 font-mono text-[13px] mt-0.5">
                              ₹{proj.sanctionedAmountCr} Cr
                            </div>
                            <div className="text-[10px] text-gray-500 truncate" title={proj.financialStatus}>
                              {proj.utilizedAmountCr > 0 ? `₹${proj.utilizedAmountCr} Cr spent` : proj.financialStatus}
                            </div>
                          </div>

                          {/* Next Milestone */}
                          <div>
                            <div className="text-[10px] font-bold text-gray-500 uppercase">
                              {language === 'hi' ? '8. आगामी मील का पत्थर' : '8. Next Milestone'}
                            </div>
                            <div className="font-semibold text-slate-800 text-[11px] mt-0.5 truncate" title={proj.nextMilestone}>
                              {proj.nextMilestone}
                            </div>
                            {proj.nextMilestoneDate && (
                              <div className="text-[10px] text-blue-600 flex items-center gap-1 font-mono">
                                <Calendar className="w-2.5 h-2.5" />
                                <span>{new Date(proj.nextMilestoneDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 9. Delay or Obstacle Alert (if present) */}
                        {proj.delayOrObstacle && (
                          <div className={`p-2.5 rounded-xl text-xs flex items-start gap-2 border ${
                            proj.isDelayed
                              ? 'bg-amber-50 border-amber-300 text-amber-900'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          }`}>
                            <AlertTriangle className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${proj.isDelayed ? 'text-amber-600' : 'text-emerald-600'}`} />
                            <div className="leading-snug">
                              <span className="font-bold">{language === 'hi' ? '9. बाधा / अवरोध:' : '9. Delay / Obstacle:'} </span>
                              <span>{proj.delayOrObstacle}</span>
                            </div>
                          </div>
                        )}

                        {/* 10. Source & 11. Communication Status footer */}
                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                          <div className="truncate max-w-[170px]" title={proj.source}>
                            <span className="font-semibold text-slate-700">10. {language === 'hi' ? 'स्रोत:' : 'Source:'}</span> {proj.source}
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            proj.communicationStatus?.includes('VERIFIED') || proj.communicationStatus?.includes('PUBLISHED')
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {proj.communicationStatus?.split(' ')[0] || 'PUBLISHED'}
                          </span>
                        </div>

                        {/* Action: Open Full 11-Field Dossier */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (onSelectProject) onSelectProject(proj);
                              else if (onOpenTableWithTab) onOpenTableWithTab('all');
                            }}
                            className="flex-1 bg-slate-900 hover:bg-[#1b5e4c] text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm group-hover:bg-[#1b5e4c]"
                          >
                            <span>{language === 'hi' ? '11-बिंदु संपूर्ण विवरण देखें' : 'View Full 11-Point Dossier'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          {isLoggedIn && onDeleteProject && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteProject(proj);
                              }}
                              className="p-2 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 border border-red-200 transition shadow-xs"
                              title={language === 'hi' ? 'परियोजना हटाएं (Delete)' : 'Delete Project Record'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ========================================================= */
              /* OFFICIAL 11-FIELD TABULAR REGISTER VIEW                   */
              /* ========================================================= */
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-800 border-collapse">
                    <thead className="bg-[#1b5e4c] text-white uppercase text-[10px] tracking-wider font-extrabold select-none">
                      <tr>
                        <th className="py-3 px-3 border-r border-emerald-800 whitespace-nowrap"># / Photo</th>
                        <th className="py-3 px-3 border-r border-emerald-800 whitespace-nowrap">1. Reference ID</th>
                        <th className="py-3 px-3 border-r border-emerald-800 whitespace-nowrap">2. Department</th>
                        <th className="py-3 px-3 border-r border-emerald-800 min-w-[220px]">3. Commitment</th>
                        <th className="py-3 px-3 border-r border-emerald-800 min-w-[180px]">4. Location & Beneficiaries</th>
                        <th className="py-3 px-3 border-r border-emerald-800 whitespace-nowrap">5. Financial Status</th>
                        <th className="py-3 px-3 border-r border-emerald-800 whitespace-nowrap">6. Current Stage</th>
                        <th className="py-3 px-3 border-r border-emerald-800 whitespace-nowrap">7. Verified Progress</th>
                        <th className="py-3 px-3 border-r border-emerald-800 min-w-[180px]">8. Next Milestone</th>
                        <th className="py-3 px-3 border-r border-emerald-800 min-w-[160px]">9. Delay / Obstacle</th>
                        <th className="py-3 px-3 border-r border-emerald-800 whitespace-nowrap">10. Source</th>
                        <th className="py-3 px-3 border-r border-emerald-800 whitespace-nowrap">11. Comm. Status</th>
                        <th className="py-3 px-3 text-center whitespace-nowrap">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredProjects.map((proj, idx) => {
                        const photoIndex = ((proj.id - 1) % 18) + 1;
                        const photoUrl = `/gallery/development/${photoIndex}.jpg`;

                        return (
                          <tr
                            key={proj.id}
                            className={`hover:bg-amber-50/50 transition cursor-pointer ${
                              idx % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'
                            }`}
                            onClick={() => {
                              if (onSelectProject) onSelectProject(proj);
                            }}
                          >
                            {/* Photo Thumbnail */}
                            <td className="py-2.5 px-3 border-r border-gray-150">
                              <img
                                src={photoUrl}
                                alt={proj.commitment}
                                className="w-12 h-10 object-cover rounded-md border border-gray-300 shadow-xs"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = '/images/up_portal/bihar_hero_cm_speech_banner.jpg';
                                }}
                              />
                            </td>

                            {/* 1. Reference ID */}
                            <td className="py-2.5 px-3 border-r border-gray-150 font-mono font-bold text-slate-900 whitespace-nowrap">
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-black border border-amber-300">
                                {proj.referenceId}
                              </span>
                            </td>

                            {/* 2. Department */}
                            <td className="py-2.5 px-3 border-r border-gray-150 font-semibold text-slate-800 whitespace-nowrap">
                              {proj.department}
                            </td>

                            {/* 3. Commitment */}
                            <td className="py-2.5 px-3 border-r border-gray-150 font-medium text-slate-900">
                              <div className="line-clamp-2" title={proj.commitment}>
                                {proj.commitment}
                              </div>
                            </td>

                            {/* 4. Location and Beneficiaries */}
                            <td className="py-2.5 px-3 border-r border-gray-150 text-slate-700">
                              <div className="font-semibold text-slate-900">{proj.districtName || proj.location}</div>
                              {proj.beneficiaries && (
                                <div className="text-[11px] text-gray-500 line-clamp-1">{proj.beneficiaries}</div>
                              )}
                            </td>

                            {/* 5. Financial Status */}
                            <td className="py-2.5 px-3 border-r border-gray-150 whitespace-nowrap">
                              <div className="font-bold text-slate-900 font-mono">₹{proj.sanctionedAmountCr} Cr</div>
                              <div className="text-[10px] text-gray-500 font-mono">₹{proj.utilizedAmountCr} Cr spent</div>
                            </td>

                            {/* 6. Current Stage */}
                            <td className="py-2.5 px-3 border-r border-gray-150 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                proj.currentStage === 'COMMISSIONED' || proj.currentStage === 'OPERATIONAL'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : proj.currentStage === 'UNDER_CONSTRUCTION'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {proj.currentStage}
                              </span>
                            </td>

                            {/* 7. Verified Progress */}
                            <td className="py-2.5 px-3 border-r border-gray-150 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <div className="w-14 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-600 rounded-full"
                                    style={{ width: `${proj.verifiedProgress}%` }}
                                  />
                                </div>
                                <span className="font-mono font-bold text-emerald-700 text-xs">{proj.verifiedProgress}%</span>
                              </div>
                            </td>

                            {/* 8. Next Milestone */}
                            <td className="py-2.5 px-3 border-r border-gray-150 text-slate-700">
                              <div className="line-clamp-2 text-[11px]" title={proj.nextMilestone}>
                                {proj.nextMilestone}
                              </div>
                            </td>

                            {/* 9. Delay or Obstacle */}
                            <td className="py-2.5 px-3 border-r border-gray-150 text-slate-700">
                              {proj.delayOrObstacle ? (
                                <span className={`text-[11px] ${proj.isDelayed ? 'text-amber-700 font-semibold' : 'text-gray-600'}`}>
                                  {proj.delayOrObstacle}
                                </span>
                              ) : (
                                <span className="text-gray-400 italic">None</span>
                              )}
                            </td>

                            {/* 10. Source */}
                            <td className="py-2.5 px-3 border-r border-gray-150 whitespace-nowrap text-[11px] text-gray-600">
                              {proj.source}
                            </td>

                            {/* 11. Communication Status */}
                            <td className="py-2.5 px-3 border-r border-gray-150 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 uppercase">
                                {proj.communicationStatus?.split(' ')[0] || 'PUBLISHED'}
                              </span>
                            </td>

                            {/* Action Button */}
                            <td className="py-2.5 px-3 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onSelectProject) onSelectProject(proj);
                                  }}
                                  className="px-2.5 py-1 bg-[#1b5e4c] hover:bg-[#144739] text-white rounded text-[11px] font-bold transition shadow-xs"
                                >
                                  {language === 'hi' ? 'देखें' : 'View'}
                                </button>
                                {isLoggedIn && onDeleteProject && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteProject(proj);
                                    }}
                                    className="p-1 rounded bg-red-50 hover:bg-red-600 hover:text-white text-red-600 border border-red-200 transition shadow-xs"
                                    title={language === 'hi' ? 'परियोजना हटाएं (Delete)' : 'Delete Project Record'}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bottom Callout Bar */}
            <div className="mt-8 bg-gradient-to-r from-[#1b5e4c] to-[#144739] text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black flex-shrink-0 shadow">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-extrabold tracking-wide">
                    {language === 'hi' ? 'सम्मोहन पोर्टल — पारदर्शी जनकल्याण एवं त्वरित क्रियान्वयन' : 'Sammohana Portal — Transparent Public Commitments & Timely Execution'}
                  </div>
                  <div className="text-xs text-emerald-100 mt-0.5">
                    {language === 'hi'
                      ? 'बिहार के सभी 38 जिलों में विकास योजनाओं का भू-संदर्भित एवं वित्तीय अनुश्रवण'
                      : 'Geo-referenced and financial progress monitoring across all 38 districts of Bihar'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => {
                    if (onOpenTableWithTab) onOpenTableWithTab('all');
                  }}
                  className="bg-white hover:bg-gray-100 text-[#1b5e4c] px-4 py-2 rounded-xl text-xs font-black transition shadow"
                >
                  {language === 'hi' ? 'पूर्ण तालिका देखें' : 'Explore Full Register'}
                </button>
                {onOpenNewForm && (
                  <button
                    onClick={onOpenNewForm}
                    className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-black transition shadow"
                  >
                    {language === 'hi' ? 'नया दर्ज करें' : 'Register Commitment'}
                  </button>
                )}
              </div>
            </div>

          </div>
        </section>
      )}



        {/* ========================================================= */}
        {/* 9. BIHAR AT A GLANCE (Deep Sepia Heritage Section)        */}
        {/* ========================================================= */}
        <section id="glance" className="bg-[#3c3532] text-white py-14 border-t-4 border-amber-500 select-none relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Bihar District Map Watermark in Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <img
              src="/images/bihar_map_transparent.png"
              alt="Bihar District Map Watermark"
              className="w-full max-w-5xl h-auto object-contain opacity-30 filter drop-shadow-[0_0_35px_rgba(0,0,0,0.85)] select-none transform scale-105"
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            
            {/* Header with Golden Diamond Divider */}
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-serif">
                {language === 'hi' ? 'बिहार: एक नज़र में (Bihar at a Glance)' : 'Bihar at a Glance'}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="w-16 h-px bg-amber-400/60" />
                <span className="w-2 h-2 rotate-45 bg-amber-400" />
                <div className="w-16 h-px bg-amber-400/60" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Statistics Badges (2.5 cols) */}
              <div className="lg:col-span-2 space-y-4 flex flex-col items-center">
                {/* Stat 1: Area */}
                <div className="w-36 h-36 rounded-full bg-white text-slate-900 flex flex-col items-center justify-center shadow-xl border-4 border-amber-400/80 p-2 text-center transform hover:scale-105 transition">
                  <img src="/images/up_portal/area.png" alt="Area" className="w-6 h-6 object-contain mb-1 opacity-80" />
                  <div className="text-base font-black font-mono">94,163</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase leading-tight">
                    Area<br />(Square km.)
                  </div>
                </div>

                {/* Stat 2: Gender Ratio */}
                <div className="w-36 h-36 rounded-full bg-white text-slate-900 flex flex-col items-center justify-center shadow-xl border-4 border-purple-400/80 p-2 text-center transform hover:scale-105 transition">
                  <img src="/images/up_portal/gender.png" alt="Gender" className="w-6 h-6 object-contain mb-1 opacity-80" />
                  <div className="text-base font-black font-mono">918:1000</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase leading-tight">
                    Gender Ratio<br />(F:M)
                  </div>
                </div>

                {/* Stat 3: Districts */}
                <div className="w-36 h-36 rounded-full bg-white text-slate-900 flex flex-col items-center justify-center shadow-xl border-4 border-rose-400/80 p-2 text-center transform hover:scale-105 transition">
                  <img src="/images/up_portal/district.png" alt="Districts" className="w-6 h-6 object-contain mb-1 opacity-80" />
                  <div className="text-2xl font-black font-mono text-rose-600">38</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase leading-tight">
                    Districts (जिले)
                  </div>
                </div>
              </div>

              {/* Center Multi-Column Districts List (7 cols) */}
              <div className="lg:col-span-8 bg-black/40 backdrop-blur-[1.5px] rounded-2xl p-6 border border-white/15 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-4 flex items-center justify-between border-b border-white/10 pb-2">
                    <span>{language === 'hi' ? 'बिहार के सभी 38 जिले (क्लिक कर परियोजनाएँ देखें)' : 'All 38 Districts of Bihar (Click to filter projects)'}</span>
                    <span className="text-[11px] text-gray-400 font-normal">State District Directory</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-[11px] font-medium text-gray-100 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
                    {districts38.map((d, dIdx) => (
                      <div
                        key={dIdx}
                        onClick={() => {
                          if (onSelectDistrict) onSelectDistrict(d);
                          else if (onOpenTableWithTab) onOpenTableWithTab('all');
                        }}
                        className="flex items-center gap-1.5 hover:text-amber-300 cursor-pointer transition hover:translate-x-0.5"
                      >
                        <span className="text-amber-400 text-xs flex-shrink-0">&#10003;</span>
                        <span className="truncate drop-shadow-xs">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Statistics Badges (2.5 cols) */}
              <div className="lg:col-span-2 space-y-4 flex flex-col items-center">
                {/* Stat 4: Population */}
                <div className="w-36 h-36 rounded-full bg-white text-slate-900 flex flex-col items-center justify-center shadow-xl border-4 border-amber-500/80 p-2 text-center transform hover:scale-105 transition">
                  <img src="/images/up_portal/population.png" alt="Population" className="w-6 h-6 object-contain mb-1 opacity-80" />
                  <div className="text-base font-black font-mono">13+ Crores</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase leading-tight">
                    Total Population<br />(Census Data)
                  </div>
                </div>

                {/* Stat 5: Density */}
                <div className="w-36 h-36 rounded-full bg-white text-slate-900 flex flex-col items-center justify-center shadow-xl border-4 border-teal-400/80 p-2 text-center transform hover:scale-105 transition">
                  <img src="/images/up_portal/density.png" alt="Density" className="w-6 h-6 object-contain mb-1 opacity-80" />
                  <div className="text-xl font-black font-mono text-teal-700">1,106</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase leading-tight">
                    Density<br />(per sq. km)
                  </div>
                </div>

                {/* Stat 6: Departments */}
                <div className="w-36 h-36 rounded-full bg-white text-slate-900 flex flex-col items-center justify-center shadow-xl border-4 border-emerald-400/80 p-2 text-center transform hover:scale-105 transition">
                  <img src="/images/up_portal/deparment.png" alt="Departments" className="w-6 h-6 object-contain mb-1 opacity-80" />
                  <div className="text-2xl font-black font-mono text-emerald-700">48</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase leading-tight">
                    Departments (विभाग)
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 11. TOURISM CIRCUIT (Bihar Historical Slide Watermark)    */}
        {/* ========================================================= */}
        <section id="tourism" className="relative bg-[#0d0b0a] text-white py-20 sm:py-28 min-h-[540px] flex flex-col justify-center overflow-hidden select-none">
          
          {/* Animated Historical Slide Watermarks */}
          {tourismHistoricalSlides.map((slide, sIdx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                sIdx === currentTourismSlide ? 'opacity-95 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              } transition-transform duration-7000`}
            >
              <img
                src={slide.img}
                alt={slide.titleHi}
                className="w-full h-full object-cover filter contrast-105 brightness-100"
              />
            </div>
          ))}

          {/* Subtle gradient to ensure historical slides are brilliantly visible in high quality */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none" />

          {/* Floating Subtle Watermark Badge (Bottom Right) */}
          <div className="absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-xl bg-black/75 backdrop-blur-md border border-amber-400/50 text-xs text-amber-300 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <span className="font-extrabold block text-white text-xs">{language === 'hi' ? tourismHistoricalSlides[currentTourismSlide].titleHi : tourismHistoricalSlides[currentTourismSlide].titleEn}</span>
              <span className="text-[10px] text-amber-300/90 font-medium">{language === 'hi' ? tourismHistoricalSlides[currentTourismSlide].tagHi : tourismHistoricalSlides[currentTourismSlide].tagEn}</span>
            </div>
          </div>

          {/* Tourism Slides Watermark Controls (Bottom Left) */}
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 shadow-xl">
            <button
              type="button"
              onClick={() => setCurrentTourismSlide((prev) => (prev - 1 + tourismHistoricalSlides.length) % tourismHistoricalSlides.length)}
              className="text-white/80 hover:text-white transition p-1 cursor-pointer hover:bg-white/10 rounded-lg"
              title="Previous Historical Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsTourismSlidePlaying(!isTourismSlidePlaying)}
              className="text-amber-400 hover:text-amber-300 transition p-1 cursor-pointer hover:bg-white/10 rounded-lg"
              title={isTourismSlidePlaying ? 'Pause' : 'Play'}
            >
              {isTourismSlidePlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-amber-400" />}
            </button>
            <button
              type="button"
              onClick={() => setCurrentTourismSlide((prev) => (prev + 1) % tourismHistoricalSlides.length)}
              className="text-white/80 hover:text-white transition p-1 cursor-pointer hover:bg-white/10 rounded-lg"
              title="Next Historical Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 ml-2 border-l border-white/20 pl-2">
              {tourismHistoricalSlides.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentTourismSlide(dotIdx)}
                  aria-label={`Slide ${dotIdx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    dotIdx === currentTourismSlide ? 'w-5 bg-amber-400 shadow-xs' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center w-full">
            
            {/* Title with Compass Icon */}
            <div className="inline-flex items-center gap-2.5 mb-6 px-5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/40 shadow-lg">
              <Compass className="w-5 h-5 text-amber-400" />
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-white">
                {language === 'hi' ? 'पर्यटन (Tourism)' : 'Tourism'}
              </h2>
            </div>

            {/* Glowing Undulating Golden Path with 5 Circuit Stations inside frosted glass */}
            <div className="relative py-8 px-4 sm:px-8 mt-2 rounded-3xl bg-black/45 backdrop-blur-md border border-white/20 shadow-2xl">
              <div className="hidden md:block absolute top-1/2 left-12 right-12 h-0.5 border-t-2 border-dashed border-amber-400/70 -translate-y-1/2" />

              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 relative z-10">
                {[
                  { name: 'Places to Visit', icon: '/images/up_portal/tourist_icon_1.png', labelHi: 'बोधगया एवं राजगीर' },
                  { name: 'Travel Advisory', icon: '/images/up_portal/tourist_icon_2.png', labelHi: 'नालंदा महाविहार' },
                  { name: 'Modes of Travelling', icon: '/images/up_portal/tourist_icon_3.png', labelHi: 'परिवहन एवं कनेक्टिविटी' },
                  { name: 'Where to Stay', icon: '/images/up_portal/tourist_icon_4.png', labelHi: 'होटल एवं अतिथि गृह' },
                  { name: 'Tourist Helpdesk', icon: '/images/up_portal/tourist_icon_5.png', labelHi: 'पर्यटक हेल्पडेस्क' }
                ].map((station, sIdx) => (
                  <a
                    key={sIdx}
                    href="https://tourism.bihar.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center p-3.5 shadow-xl group-hover:scale-115 group-hover:bg-amber-300 group-hover:shadow-amber-400/50 transition-all duration-300 mb-3 border-2 border-white/60">
                      <img
                        src={station.icon}
                        alt={station.name}
                        className="w-full h-full object-contain filter brightness-0"
                      />
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold text-white group-hover:text-amber-300 transition leading-tight drop-shadow-md">
                      {language === 'hi' ? station.labelHi : station.name}
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </section>



      </main>

      {/* ========================================================= */}
      {/* 14. OFFICIAL FOOTER (Light Cream Upper + Dark Base)       */}
      {/* ========================================================= */}
      <footer className="bg-[#fcfaf4] text-slate-800 border-t border-amber-200">
        
        {/* Upper Footer Links Grid with Assembly Secretariat Silhouette */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Column 1: Government */}
            <div>
              <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider mb-4 border-b border-amber-300 pb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rotate-45 bg-[#d9381e]" />
                <span>{language === 'hi' ? 'शासन एवं प्रशासन' : 'Government'}</span>
              </h4>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-center gap-1.5 hover:text-[#d9381e] transition cursor-pointer">
                  <span className="w-1 h-1 rotate-45 bg-amber-600" />
                  <a href="https://governor.bih.nic.in" target="_blank" rel="noopener noreferrer">
                    {language === 'hi' ? 'माननीय राज्यपाल: ले. जनरल सैयद अता हसनैन (से.नि.)' : "Hon'ble Governor: Lt Gen Syed Ata Hasnain (Retd.)"}
                  </a>
                </li>
                <li className="flex items-center gap-1.5 hover:text-[#d9381e] transition cursor-pointer">
                  <span className="w-1 h-1 rotate-45 bg-amber-600" />
                  <a href="https://cm.bihar.gov.in" target="_blank" rel="noopener noreferrer">Hon'ble CM Shri Samrat Choudhary</a>
                </li>
                <li className="flex items-center gap-1.5 hover:text-[#d9381e] transition cursor-pointer">
                  <span className="w-1 h-1 rotate-45 bg-amber-600" />
                  <a href="https://state.bihar.gov.in" target="_blank" rel="noopener noreferrer">Former CMs of Bihar</a>
                </li>
                <li className="flex items-center gap-1.5 hover:text-[#d9381e] transition cursor-pointer">
                  <span className="w-1 h-1 rotate-45 bg-amber-600" />
                  <a href="https://state.bihar.gov.in" target="_blank" rel="noopener noreferrer">Bihar State Cabinet</a>
                </li>
                <li className="flex items-center gap-1.5 hover:text-[#d9381e] transition cursor-pointer">
                  <span className="w-1 h-1 rotate-45 bg-amber-600" />
                  <a href="https://state.bihar.gov.in" target="_blank" rel="noopener noreferrer">Chief Secretary Office Bihar</a>
                </li>
              </ul>
            </div>

            {/* Column 2: Official Bihar Emblem & Project Tracking Integration */}
            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src="/images/bihar-government-logo.png"
                    alt="Bihar Government Seal"
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <div className="text-xs font-black text-slate-900">बिहार सरकार</div>
                    <div className="text-[10px] text-[#d9381e] font-bold">Government of Bihar</div>
                  </div>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  {language === 'hi'
                    ? 'सम्मोहन घोषणा एवं परियोजना अनुश्रवण प्रणाली v2.0 — पारदर्शी सुशासन, समयबद्ध माइलस्टोन एवं 38 जिलों में प्रगति।'
                    : 'Sammohana Announcement & Project Tracking System v2.0 — End-to-end multi-tier monitoring across 38 districts.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={isLoggedIn ? onOpenDashboard : onOpenLogin}
                  className="w-full bg-[#1b5e4c] hover:bg-[#144739] text-white py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isLoggedIn ? (language === 'hi' ? 'डैशबोर्ड' : 'Dashboard') : (language === 'hi' ? 'अधिकारी लॉगिन' : 'Officer Login')}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Dark Legal Bar (Matching up.gov.in) */}
        <div className="bg-[#222a27] py-4 border-t border-emerald-950 text-[11px] text-gray-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
            <div>
              Copyright &copy; 2026 - All Rights Reserved - Official Website of SAMMOHAN, Government of Bihar, India
              <div className="text-[10px] text-gray-400 mt-0.5">
                Content published and managed by Information & Public Relations Department, Government of Bihar
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
              <a href="#privacy" className="hover:text-amber-300 transition">Privacy Policy</a>
              <span>&bull;</span>
              <a href="#terms" className="hover:text-amber-300 transition">Terms & Conditions</a>
              <span>&bull;</span>
              <a href="#disclaimer" className="hover:text-amber-300 transition">Disclaimer</a>
              <span>&bull;</span>
              <a href="#accessibility" className="hover:text-amber-300 transition">Accessibility Statement</a>
            </div>
          </div>
        </div>

      </footer>
    </div>
  );
};

export default UpGovLanding;
