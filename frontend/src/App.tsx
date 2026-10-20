import React, { useState, useEffect } from 'react';
import { UpGovLanding } from './components/UpGovLanding';
import { SankalpLanding } from './components/SankalpLanding';
import { SankalpGallery } from './components/SankalpGallery';
import { SankalpLogin } from './components/SankalpLogin';

// Authenticated Workspace Header & Navigation
import { TopBar } from './components/TopBar';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BiharGovHeader } from './components/BiharGovHeader';

// Modals & Detailed Views
import { ApplicationFormModal } from './components/ApplicationFormModal';
import { ApplicationTableModal } from './components/ApplicationTableModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { MasterDataModal } from './components/MasterDataModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { LoginModal } from './components/LoginModal';
import { ApplicationDetailDrawer } from './components/ApplicationDetailDrawer';
import { ApplicationDetailView } from './components/ApplicationDetailView';
import { ProjectTableModal } from './components/ProjectTableModal';
import { ProjectFormModal } from './components/ProjectFormModal';
import { ProjectDetailDrawer } from './components/ProjectDetailDrawer';
import { BiharDepartmentsDashboardHub } from './components/BiharDepartmentsDashboardHub';

import { api } from './services/api';
import { User, Application, DashboardStats, SystemSettings, ProjectAnnouncement, ProjectStats } from './types';
import {
  AlertCircle,
  FilePlus2,
  TableProperties,
  BarChart3,
  Layers3,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  TrendingUp,
  Landmark,
  ExternalLink,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const App: React.FC = () => {
  const [language, setLanguage] = useState<'hi' | 'en'>('en');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isVerifyingSession, setIsVerifyingSession] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [rbacNotice, setRbacNotice] = useState<string | null>(null);

  // Top-Level Navigation State
  // 'landing': Official Bihar Sankalp Public Landing Page
  // 'gallery': Official Photo Gallery with 3D Coverflow
  // 'login': Command & Control Login Portal
  // 'dashboard': Internal Authenticated Grievance & Application Command Center
  // 'application-detail': Full View Inspection
  const [activeView, setActiveView] = useState<'landing' | 'gallery' | 'login' | 'dashboard' | 'application-detail'>('landing');
  const [previousView, setPreviousView] = useState<'landing' | 'dashboard' | 'table'>('landing');
  const [detailAppId, setDetailAppId] = useState<number | string | null>(null);
  const [tableModalInitialTab, setTableModalInitialTab] = useState<'all' | 'important' | 'normal' | 'active_followups' | 'disposed'>('all');

  // Active Modals in Workspace
  const [activeModal, setActiveModal] = useState<
    'form' | 'table' | 'reports' | 'master' | 'admin' | null
  >(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Announcement & Project Tracking State
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);
  const [projectsList, setProjectsList] = useState<ProjectAnnouncement[]>([]);
  const [isProjectTableOpen, setIsProjectTableOpen] = useState(false);
  const [projectTableTab, setProjectTableTab] = useState<'all' | 'ongoing' | 'completed' | 'delayed'>('all');
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectAnnouncement | null>(null);
  const [isProjectDetailOpen, setIsProjectDetailOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectAnnouncement | null>(null);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Official Sammohan dashboard slides
  const sammohanSlides = [
    {
      id: 'sammohan_slide_2',
      img: '/assets/Web_Images/Slide2.webp',
      alt: 'बढ़ता बिहार, बदलता बिहार — Sammohan',
    },
    {
      id: 'sammohan_slide_1',
      img: '/assets/Web_Images/Slide1.webp',
      alt: 'सम्राट का विज़न, नए बिहार का मिशन — Sammohan',
    },
    {
      id: 'sammohan_slide_3',
      img: '/assets/Web_Images/Slide3.webp',
      alt: 'सम्राट की हुंकार, विकास को मिली रफ़्तार — Sammohan',
    },
    {
      id: 'sammohan_slide_4',
      img: '/assets/Web_Images/Slide4.webp',
      alt: 'सम्राट चौधरी की पहचान विकास, सुशासन और स्वाभिमान — Sammohan',
    },
  ];

  const [currentDashSlide, setCurrentDashSlide] = useState(0);
  const [isDashSlidePaused, setIsDashSlidePaused] = useState(false);

  // Auto-rotate Sammohan dashboard slides every 4.5s
  useEffect(() => {
    if (isDashSlidePaused) return;
    const interval = setInterval(() => {
      setCurrentDashSlide((prev) => (prev + 1) % sammohanSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isDashSlidePaused, sammohanSlides.length]);

  // Session verification and initial data load
  useEffect(() => {
    checkAuthSession();
    fetchSettings();
    loadProjectData();

    // Support browser URL hash / paths
    const handleRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();

      if (hash === '#gallery' || pathname.includes('/gallery')) {
        setActiveView('gallery');
      } else if (hash === '#login' || pathname.includes('/login')) {
        setActiveView('login');
      } else if (hash.startsWith('#dashboard') || pathname.includes('/dashboard')) {
        setActiveView('dashboard');
      } else if (hash === '#projects' || hash === '#table') {
        setActiveView('landing');
        setIsProjectTableOpen(true);
      } else if (hash === '#detail') {
        setActiveView('landing');
        setIsProjectDetailOpen(true);
      } else if (hash === '#new') {
        setActiveView('landing');
        setIsProjectFormOpen(true);
      } else {
        setActiveView('landing');
      }
    };

    handleRoute();
    window.addEventListener('popstate', handleRoute);
    window.addEventListener('hashchange', handleRoute);
    return () => {
      window.removeEventListener('popstate', handleRoute);
      window.removeEventListener('hashchange', handleRoute);
    };
  }, []);

  // Keep protected routes from rendering with a missing/expired session.
  // Direct navigation to /dashboard or #dashboard previously bypassed the button guard
  // and could leave the user on a blank React view.
  useEffect(() => {
    if (!isVerifyingSession && activeView === 'dashboard' && !currentUser) {
      setActiveView('login');
      window.history.replaceState({}, '', '#login');
    }
  }, [activeView, currentUser, isVerifyingSession]);

  const checkAuthSession = async () => {
    const token = localStorage.getItem('bacms_token');
    if (token) {
      try {
        const res = await api.getMe();
        setCurrentUser(res.user);
        loadDashboardStats();
      } catch (e) {
        localStorage.removeItem('bacms_token');
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
    setIsVerifyingSession(false);
  };

  const loadDashboardStats = async () => {
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (e) {
      console.error('Failed to load stats', e);
    }
  };

  const loadProjectData = async () => {
    try {
      const [statsRes, listRes] = await Promise.all([
        api.getProjectStats(),
        api.getProjects({ limit: 100 })
      ]);
      if (statsRes.stats) setProjectStats(statsRes.stats);
      if (listRes.projects) {
        setProjectsList(listRes.projects);
        if (listRes.projects.length > 0) {
          setSelectedProject((prev) => prev || listRes.projects[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load project tracking data', e);
    }
  };

  const handleSaveProject = async (data: Partial<ProjectAnnouncement>) => {
    if (editingProject) {
      await api.updateProject(editingProject.id, data);
    } else {
      await api.createProject(data);
    }
    await loadProjectData();
    setIsProjectFormOpen(false);
    setEditingProject(null);
  };

  const handleDeleteProject = async (proj: ProjectAnnouncement) => {
    const confirmMsg = language === 'hi'
      ? `क्या आप वाकई परियोजना ${proj.referenceId} (${proj.department}) को स्थायी रूप से हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।`
      : `Are you sure you want to permanently delete project ${proj.referenceId} (${proj.department})? This action cannot be undone.`;

    if (!window.confirm(confirmMsg)) {
      return;
    }

    try {
      await api.deleteProject(proj.id);
      await loadProjectData();
      if (selectedProject?.id === proj.id) {
        setSelectedProject(null);
        setIsProjectDetailOpen(false);
      }
      alert(language === 'hi' ? 'परियोजना रिकॉर्ड सफलतापूर्वक हटा दिया गया।' : 'Project record successfully deleted.');
    } catch (error: any) {
      alert(
        language === 'hi'
          ? 'परियोजना हटाने में विफल: ' + (error.response?.data?.error || error.message)
          : 'Failed to delete project: ' + (error.response?.data?.error || error.message)
      );
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await api.getSettings();
      if (res.settings) {
        setSettings(res.settings);
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setActiveView('landing');
    window.history.pushState({}, '', '/');
    setActiveModal(null);
    setSelectedApp(null);
    setDetailAppId(null);
    setStats(null);
    setRbacNotice(null);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    loadDashboardStats();
    setActiveView('dashboard');
    window.history.pushState({}, '', '#dashboard');
  };

  const handleOpenSection = (
    section: 'form' | 'table' | 'reports' | 'master' | 'admin'
  ) => {
    setRbacNotice(null);

    if (section === 'form') {
      if (currentUser?.role === 'READONLY') {
        setRbacNotice(
          language === 'hi'
            ? 'अनुमति अस्वीकृत: केवल-पठन (Read-Only) खाता नए आवेदन दर्ज नहीं कर सकता।'
            : 'Permission Denied: Read-Only viewer account cannot submit new applications.'
        );
        return;
      }
      if (currentUser?.role === 'REVIEWER') {
        setRbacNotice(
          language === 'hi'
            ? 'अनुमति अस्वीकृत: समीक्षक (Reviewer) खाता केवल मामलों की समीक्षा, स्थिति अद्यतन और फॉलो-अप कर सकता है।'
            : 'Permission Denied: Reviewer role cannot create applications. Reviewers can inspect records, update statuses, and add follow-ups.'
        );
        return;
      }
    }

    if (section === 'admin' && currentUser?.role !== 'ADMIN') {
      setRbacNotice(
        language === 'hi'
          ? 'अनुमति अस्वीकृत: एडमिन डैशबोर्ड केवल व्यवस्थापक (Admin) के लिए अधिकृत है।'
          : 'Permission Denied: Admin Console is restricted to Administrator role.'
      );
      return;
    }

    setActiveModal(section);
  };

  const handleStatCardClick = (
    filter: 'all' | 'important' | 'normal' | 'active_followups' | 'disposed'
  ) => {
    setTableModalInitialTab(filter);
    setActiveModal('table');
  };

  const handleSelectApplication = (app: Application) => {
    setActiveModal(null);
    setPreviousView('table');
    setDetailAppId(app.id);
    setActiveView('application-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplicationCreated = (_app: Application) => {
    loadDashboardStats();
  };

  // Loading Screen
  if (isVerifyingSession) {
    return (
      <div className="min-h-screen bg-[#18327b] flex flex-col items-center justify-center text-white p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white p-2 rounded-2xl shadow-lg">
            <img
              src="/images/bihar-government-logo.png"
              alt="Seal of Bihar"
              className="h-12 w-auto object-contain"
            />
          </div>
          <div>
            <div className="text-2xl font-black text-[#f97316] font-serif">सम्मोहन</div>
            <div className="text-xs text-blue-200">बिहार सरकार · एकीकृत अनुश्रवण प्लेटफ़ॉर्म</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-amber-300">
          <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <span>सुरक्षित सत्र सत्यापन (Verifying Session)...</span>
        </div>
      </div>
    );
  }

  // --- VIEW 1: OFFICIAL PHOTO GALLERY ---
  if (activeView === 'gallery') {
    return (
      <SankalpGallery
        onBackToHome={() => {
          setActiveView('landing');
          window.history.pushState({}, '', '/');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={language}
        onToggleLanguage={setLanguage}
      />
    );
  }

  // --- VIEW 2: OFFICIAL SANKALP COMMAND LOGIN ---
  if (activeView === 'login') {
    return (
      <SankalpLogin
        onLoginSuccess={handleLoginSuccess}
        onBackToLanding={() => {
          setActiveView('landing');
          window.history.pushState({}, '', '/');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={language}
        setLanguage={setLanguage}
        settings={settings}
      />
    );
  }

  // --- VIEW 3: OFFICIAL BIHAR SANKALP DASHBOARD LANDING PAGE (DEFAULT) ---
  if (activeView === 'landing') {
    return (
      <>
        <SankalpLanding
          onOpenLogin={() => {
            setActiveView('login');
            window.history.pushState({}, '', '#login');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenGallery={() => {
            setActiveView('gallery');
            window.history.pushState({}, '', '#gallery');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenDashboard={() => {
            if (currentUser) {
              setActiveView('dashboard');
              window.history.pushState({}, '', '#dashboard');
            } else {
              setActiveView('login');
              window.history.pushState({}, '', '#login');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isLoggedIn={!!currentUser}
          currentUser={currentUser}
          language={language}
          onToggleLanguage={setLanguage}
          projectStats={projectStats}
          onOpenTableWithTab={(tab) => {
            setProjectTableTab(tab);
            setIsProjectTableOpen(true);
          }}
          onSelectDistrict={(_dName) => {
            setProjectTableTab('all');
            setIsProjectTableOpen(true);
          }}
          projects={projectsList}
          onSelectProject={(proj) => {
            setSelectedProject(proj);
            setIsProjectDetailOpen(true);
          }}
          onDeleteProject={handleDeleteProject}
          onOpenNewForm={() => {
            if (!currentUser) {
              setActiveView('login');
            } else {
              setEditingProject(null);
              setIsProjectFormOpen(true);
            }
          }}
        />

        {/* Project Table Modal */}
        <ProjectTableModal
          isOpen={isProjectTableOpen}
          onClose={() => setIsProjectTableOpen(false)}
          projects={projectsList}
          initialTab={projectTableTab}
          currentUser={currentUser}
          onProjectDeleted={(_id) => {
            loadProjectData();
          }}
          onSelectProject={(proj) => {
            setSelectedProject(proj);
            setIsProjectDetailOpen(true);
          }}
          onOpenNewForm={() => {
            if (!currentUser) {
              setActiveView('login');
            } else {
              setEditingProject(null);
              setIsProjectFormOpen(true);
            }
          }}
          language={language}
        />

        {/* Project Detail Drawer */}
        <ProjectDetailDrawer
          isOpen={isProjectDetailOpen}
          onClose={() => setIsProjectDetailOpen(false)}
          project={selectedProject}
          currentUser={currentUser}
          onDelete={handleDeleteProject}
          onEdit={(proj) => {
            if (currentUser) {
              setEditingProject(proj);
              setIsProjectDetailOpen(false);
              setIsProjectFormOpen(true);
            } else {
              setActiveView('login');
            }
          }}
          language={language}
        />

        {/* Project Form Modal */}
        <ProjectFormModal
          isOpen={isProjectFormOpen}
          onClose={() => {
            setIsProjectFormOpen(false);
            setEditingProject(null);
          }}
          onSubmit={handleSaveProject}
          initialData={editingProject}
          language={language}
        />

        {/* Global Login Modal if invoked */}
        <LoginModal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onLoginSuccess={(user) => {
            handleLoginSuccess(user);
            setLoginModalOpen(false);
          }}
          language={language}
        />
      </>
    );
  }

  // --- VIEW 4: AUTHENTICATED SANKALP COMMAND & CONTROL WORKSPACE ---
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      
      {/* Official Government of Bihar Unified Header */}
      <BiharGovHeader
        currentUser={currentUser}
        language={language}
        onToggleLanguage={setLanguage}
        onOpenLogin={() => setActiveView('login')}
        onLogout={handleLogout}
        onOpenSection={handleOpenSection}
        onGoHome={() => {
          setActiveView('landing');
          window.history.pushState({}, '', '/');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSearch={(_query) => {
          setProjectTableTab('all');
          setIsProjectTableOpen(true);
        }}
        activeNav="dashboard"
      />

      {/* RBAC Notice Banner */}
      {rbacNotice && (
        <div className="max-w-7xl mx-auto px-4 mt-3 w-full">
          <div className="bg-amber-50 border border-amber-300 text-amber-900 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold shadow-xs animate-fadeIn">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>{rbacNotice}</span>
            </div>
            <button
              onClick={() => setRbacNotice(null)}
              className="text-amber-700 hover:text-amber-950 font-bold text-sm ml-4"
              title="Dismiss"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Main Body: Application Detail View or Command Dashboard */}
      {activeView === 'application-detail' && detailAppId ? (
        <ApplicationDetailView
          applicationId={detailAppId}
          onBack={() => {
            setActiveView('dashboard');
            if (previousView === 'table') {
              setActiveModal('table');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          currentUser={currentUser}
          onRefreshStats={loadDashboardStats}
          language={language}
        />
      ) : (
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
          
          {/* Official Sammohan slides shown at the top of the dashboard */}
          <div
            className="w-full relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 bg-slate-950 group my-2"
            onMouseEnter={() => setIsDashSlidePaused(true)}
            onMouseLeave={() => setIsDashSlidePaused(false)}
          >
            {/* Sliding Strip */}
            <div
              className="flex w-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentDashSlide * 100}%)` }}
            >
              {sammohanSlides.map((slide, sIdx) => (
                <div
                  key={slide.id}
                  className="w-full flex-shrink-0 relative h-[240px] sm:h-[320px] md:h-[380px] lg:h-[420px] bg-slate-950 flex items-center justify-center overflow-hidden"
                >
                  {/* Ambient matching background */}
                  <img
                    src={slide.img}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none select-none"
                  />
                  {/* Crisp uncropped slide in High Quality */}
                  <img
                    src={slide.img}
                    alt={slide.alt}
                    className="relative z-10 max-w-full max-h-full w-auto h-auto object-contain select-none drop-shadow-md filter brightness-105 contrast-[1.02]"
                    loading={sIdx === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              ))}
            </div>

            {/* Left Previous Arrow */}
            <button
              type="button"
              onClick={() => setCurrentDashSlide((prev) => (prev - 1 + sammohanSlides.length) % sammohanSlides.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-sm opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-20 shadow-md cursor-pointer active:scale-95"
              aria-label="Previous Slide"
              title="पिछली स्लाइड"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Next Arrow */}
            <button
              type="button"
              onClick={() => setCurrentDashSlide((prev) => (prev + 1) % sammohanSlides.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-sm opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-20 shadow-md cursor-pointer active:scale-95"
              aria-label="Next Slide"
              title="अगली स्लाइड"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Bottom Controls Bar (Indicator Pills + Counter) */}
            <div className="absolute bottom-3 inset-x-0 flex items-center justify-center z-20 pointer-events-none">
              <div className="inline-flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-white shadow-xl pointer-events-auto">
                {sammohanSlides.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setCurrentDashSlide(dotIdx)}
                    className={`transition-all duration-300 rounded-full h-2.5 cursor-pointer ${
                      dotIdx === currentDashSlide
                        ? 'w-8 bg-[#C35504] shadow-md'
                        : 'w-2.5 bg-white/70 hover:bg-white'
                    }`}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                    title={`Slide ${dotIdx + 1}`}
                  />
                ))}

                <span className="text-xs font-mono font-bold text-amber-300 pl-1 border-l border-white/20">
                  {String(currentDashSlide + 1).padStart(2, '0')} / {String(sammohanSlides.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Dashboard Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-[#f97316] font-serif">सम्मोहन</span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {language === 'hi' ? 'बिहार सरकार • घोषणा एवं परियोजना अनुश्रवण' : 'Govt of Bihar • Announcement & Project Tracking'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {language === 'hi'
                  ? 'घोषणा एवं परियोजना अनुश्रवण डैशबोर्ड'
                  : 'Announcement and Project Tracking Dashboard'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
                {language === 'hi'
                  ? '38 जिलों में विकास घोषणाओं, वित्तीय आवंटन, मील के पत्थरों (Milestones) एवं वास्तविक प्रगति का केंद्रीय अनुश्रवण।'
                  : 'Centralized governance tracking of state announcements, financial commitments, milestones, and verified delivery across 38 districts.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {currentUser?.role !== 'READONLY' && (
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setIsProjectFormOpen(true);
                  }}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#18327b] hover:bg-[#12245a] text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition transform active:scale-95 cursor-pointer"
                >
                  <FilePlus2 className="w-4 h-4 text-amber-300" />
                  <span>{language === 'hi' ? 'नई घोषणा दर्ज करें' : '+ New Announcement'}</span>
                </button>
              )}

              <button
                onClick={() => {
                  setProjectTableTab('all');
                  setIsProjectTableOpen(true);
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition transform active:scale-95 cursor-pointer"
              >
                <TableProperties className="w-4 h-4" />
                <span>{language === 'hi' ? 'परियोजना रजिस्टर (11 क्षेत्र)' : 'Project Register (11 Fields)'}</span>
              </button>

              <button
                onClick={() => handleOpenSection('reports')}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-300 transition cursor-pointer"
              >
                <BarChart3 className="w-4 h-4 text-slate-700" />
                <span>{language === 'hi' ? 'एनालिटिक्स' : 'Analytics'}</span>
              </button>
            </div>
          </div>


          {/* Database Summary Overview Cards (Announcement & Project Tracking) */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
              <span>{language === 'hi' ? 'लाइव परियोजना सांख्यिकी' : 'Live Project Tracking Statistics'}</span>
              <span className="text-emerald-700 font-mono text-[11px] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Real-time Synced (MongoDB)</span>
              </span>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
              
              {/* Total Announcements */}
              <div
                onClick={() => {
                  setProjectTableTab('all');
                  setIsProjectTableOpen(true);
                }}
                className="p-3 border-r border-slate-100 last:border-none cursor-pointer rounded-xl hover:bg-blue-50/70 transition group"
              >
                <div className="text-xs text-slate-500 font-semibold uppercase group-hover:text-[#18327b]">
                  {language === 'hi' ? 'कुल घोषणाएं' : 'Total'}
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#18327b] mt-1 group-hover:scale-105 transition-transform">
                  {projectStats?.totalAnnouncements ?? 15}
                </div>
                <div className="text-[11px] text-slate-400 group-hover:text-blue-600 font-medium">
                  {language === 'hi' ? 'घोषणा रजिस्टर &rarr;' : 'Register &rarr;'}
                </div>
              </div>

              {/* Ongoing Projects */}
              <div
                onClick={() => {
                  setProjectTableTab('ongoing');
                  setIsProjectTableOpen(true);
                }}
                className="p-3 border-r border-slate-100 last:border-none cursor-pointer rounded-xl hover:bg-amber-50/70 transition group"
              >
                <div className="text-xs text-amber-700 font-semibold uppercase flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>{language === 'hi' ? 'प्रगतिरत' : 'Ongoing'}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-800 mt-1 group-hover:scale-105 transition-transform">
                  {projectStats?.ongoingProjects ?? 11}
                </div>
                <div className="text-[11px] text-slate-400 group-hover:text-amber-700 font-medium">
                  {language === 'hi' ? 'निर्माण में &rarr;' : 'In Progress &rarr;'}
                </div>
              </div>

              {/* Completed Projects */}
              <div
                onClick={() => {
                  setProjectTableTab('completed');
                  setIsProjectTableOpen(true);
                }}
                className="p-3 border-r border-slate-100 last:border-none cursor-pointer rounded-xl hover:bg-emerald-50/70 transition group"
              >
                <div className="text-xs text-emerald-700 font-semibold uppercase flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{language === 'hi' ? 'पूर्ण' : 'Completed'}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-800 mt-1 group-hover:scale-105 transition-transform">
                  {projectStats?.completedProjects ?? 4}
                </div>
                <div className="text-[11px] text-slate-400 group-hover:text-emerald-700 font-medium">
                  {language === 'hi' ? 'लोकार्पित &rarr;' : 'Delivered &rarr;'}
                </div>
              </div>

              {/* Delayed Projects */}
              <div
                onClick={() => {
                  setProjectTableTab('delayed');
                  setIsProjectTableOpen(true);
                }}
                className="p-3 border-r border-slate-100 last:border-none cursor-pointer rounded-xl hover:bg-red-50/70 transition group"
              >
                <div className="text-xs text-red-600 font-semibold uppercase flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-red-600" />
                  <span>{language === 'hi' ? 'विलंबित' : 'Delayed'}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-red-700 mt-1 group-hover:scale-105 transition-transform">
                  {projectStats?.delayedProjects ?? 6}
                </div>
                <div className="text-[11px] text-slate-400 group-hover:text-red-600 font-medium">
                  {language === 'hi' ? 'बाधा निवारण &rarr;' : 'Obstacles &rarr;'}
                </div>
              </div>

              {/* Sanctioned Budget */}
              <div className="p-3 border-r border-slate-100 last:border-none rounded-xl bg-slate-50/50">
                <div className="text-xs text-indigo-700 font-semibold uppercase">
                  {language === 'hi' ? 'स्वीकृत राशि' : 'Sanctioned'}
                </div>
                <div className="text-xl sm:text-2xl font-black text-indigo-900 mt-1">
                  ₹{(projectStats?.totalSanctionedCr ?? 31790).toLocaleString('en-IN')} <span className="text-xs font-bold text-indigo-600">Cr</span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {language === 'hi' ? 'कुल बजट' : 'Total Budget'}
                </div>
              </div>

              {/* Spent / Utilized */}
              <div className="p-3 border-r border-slate-100 last:border-none rounded-xl bg-slate-50/50">
                <div className="text-xs text-emerald-700 font-semibold uppercase">
                  {language === 'hi' ? 'व्यय राशि' : 'Utilized'}
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-900 mt-1">
                  ₹{(projectStats?.totalUtilizedCr ?? 16420).toLocaleString('en-IN')} <span className="text-xs font-bold text-emerald-600">Cr</span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {language === 'hi' ? 'वित्तीय प्रगति' : 'Disbursed'}
                </div>
              </div>

              {/* Average Progress */}
              <div className="p-3 rounded-xl bg-amber-50/50">
                <div className="text-xs text-amber-800 font-semibold uppercase flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3 text-amber-700" />
                  <span>{language === 'hi' ? 'औसत प्रगति' : 'Avg Progress'}</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-900 mt-1">
                  {projectStats?.avgProgress ?? 68}%
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {language === 'hi' ? 'भौतिक सत्यापन' : 'Verified'}
                </div>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div
              onClick={() => {
                setEditingProject(null);
                setIsProjectFormOpen(true);
              }}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <FilePlus2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'hi' ? 'घोषणा प्रविष्टि एवं अद्यतन' : 'Announcement Entry & Update'}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {language === 'hi'
                    ? 'संदर्भ संख्या, विभाग, प्रतिबद्धता, स्थान, वित्तीय स्थिति एवं माइलस्टोन के साथ आधिकारिक घोषणाओं का नया पंजीकरण।'
                    : 'Register new government commitments with Reference ID, department, beneficiaries, financial outlay, and milestones.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-orange-600">
                <span>{language === 'hi' ? 'प्रविष्टि फॉर्म खोलें' : 'Open Entry Form'}</span>
                <span>&rarr;</span>
              </div>
            </div>

            <div
              onClick={() => {
                setProjectTableTab('all');
                setIsProjectTableOpen(true);
              }}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-blue-100 text-[#18327b] flex items-center justify-center font-bold">
                  <TableProperties className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {/* Personal Database Desk */}
                  {language === 'hi' ? 'परियोजना डेटाबेस रजिस्टर (11 क्षेत्र)' : 'Personal Database Desk — Project Register (11 Fields)'}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {language === 'hi'
                    ? 'संदर्भ आईडी, विभाग, प्रतिबद्धता, स्थान, वित्तीय स्थिति, वर्तमान चरण, सत्यापित प्रगति, आगामी माइलस्टोन एवं CSV निर्यात।'
                    : 'Search, filter, inspect 11 official fields, update milestone delivery, and export CSV audit reports across 38 districts.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#18327b]">
                <span>{language === 'hi' ? 'रजिस्टर खोलें' : 'Open Register'}</span>
                <span>&rarr;</span>
              </div>
            </div>

            <div
              onClick={() => handleOpenSection('reports')}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'hi' ? 'वित्तीय एवं माइलस्टोन रिपोर्ट' : 'Financial & Milestone Analytics'}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {language === 'hi'
                    ? '48 विभागों का बजट आवंटन, व्यय अनुपात, माइलस्टोन अनुपालन दर एवं विलंब कारकों का तुलनात्मक विश्लेषण।'
                    : 'Department-wise budget breakdown, expenditure ratios, milestone compliance curves, and delay mitigation indicators.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
                <span>{language === 'hi' ? 'एनालिटिक्स देखें' : 'View Analytics'}</span>
                <span>&rarr;</span>
              </div>
            </div>

            <div
              onClick={() => handleOpenSection('master')}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Layers3 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'hi' ? '38 जिला एवं विभागीय मास्टर डेटा' : 'Bihar Master Data Desk'}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {language === 'hi'
                    ? '38 जिलों, 243 विधानसभा क्षेत्रों, 48 विभागों एवं प्रशासनिक नोडल पदाधिकारियों की आधिकारिक सूची।'
                    : 'Official catalog of 38 districts, 243 assembly constituencies, 48 departments, and administrative nodal contacts.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>{language === 'hi' ? 'मास्टर डेटा देखें' : 'View Master Data'}</span>
                <span>&rarr;</span>
              </div>
            </div>

          </div>

          {/* All 48 Bihar Government Departments Dashboard Hub with Icon Tiles & In-place Data Management */}
          <BiharDepartmentsDashboardHub
            language={language}
            projects={projectsList}
            onSaveProject={handleSaveProject}
            onDeleteProject={handleDeleteProject}
          />

          {/* Embedded Live Projects Register Preview */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#18327b]">
                  <Landmark className="w-4 h-4 text-[#f97316]" />
                  <span>{language === 'hi' ? 'सक्रिय विकास परियोजनाएं' : 'Active State Development Projects'}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  {language === 'hi' ? 'बिहार सरकार की प्रमुख घोषणाएं एवं मील के पत्थर' : 'Flagship Bihar Government Announcements & Milestones'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setProjectTableTab('all');
                  setIsProjectTableOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#18327b] hover:bg-[#12245a] text-white text-xs font-bold transition shadow-sm"
              >
                <span>{language === 'hi' ? 'सभी परियोजनाएं देखें' : 'View Full Register'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Ref ID</th>
                    <th className="py-3 px-4">{language === 'hi' ? 'विभाग एवं जिला' : 'Department & District'}</th>
                    <th className="py-3 px-4">{language === 'hi' ? 'प्रतिबद्धता / घोषणा' : 'Commitment'}</th>
                    <th className="py-3 px-4">{language === 'hi' ? 'वित्तीय स्थिति' : 'Budget'}</th>
                    <th className="py-3 px-4">{language === 'hi' ? 'वर्तमान चरण' : 'Current Stage'}</th>
                    <th className="py-3 px-4">{language === 'hi' ? 'सत्यापित प्रगति' : 'Verified Progress'}</th>
                    <th className="py-3 px-4 text-right">{language === 'hi' ? 'कार्रवाई' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projectsList.slice(0, 6).map((proj) => {
                    const isDelayed = proj.isDelayed || Boolean(proj.delayOrObstacle);
                    const isCompleted = proj.currentStage === 'COMMISSIONED' || proj.currentStage === 'OPERATIONAL' || proj.verifiedProgress >= 100;
                    return (
                      <tr key={proj.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-4 font-mono font-bold text-[#18327b] whitespace-nowrap">
                          {proj.referenceId}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{proj.department}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <span>{proj.district?.name || proj.location}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-medium text-slate-800 line-clamp-1">{proj.commitment}</div>
                          {proj.nextMilestone && (
                            <div className="text-[11px] text-amber-700 font-medium flex items-center gap-1 mt-0.5">
                              <span>🎯 {proj.nextMilestone}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-bold text-slate-900">₹{proj.sanctionedAmountCr.toLocaleString('en-IN')} Cr</div>
                          <div className="text-[11px] text-emerald-700 font-medium">₹{proj.utilizedAmountCr.toLocaleString('en-IN')} Cr spent</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800'
                                : isDelayed
                                ? 'bg-red-100 text-red-800'
                                : proj.currentStage === 'UNDER_CONSTRUCTION'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isCompleted
                                  ? 'bg-emerald-600'
                                  : isDelayed
                                  ? 'bg-red-600'
                                  : proj.currentStage === 'UNDER_CONSTRUCTION'
                                  ? 'bg-blue-600'
                                  : 'bg-amber-600'
                              }`}
                            />
                            {isCompleted
                              ? (language === 'hi' ? 'पूर्ण / लोकार्पित' : 'Completed')
                              : isDelayed
                              ? (language === 'hi' ? 'विलंबित / बाधा' : 'Delayed')
                              : proj.currentStage === 'UNDER_CONSTRUCTION'
                              ? (language === 'hi' ? 'निर्माणाधीन' : 'Under Construction')
                              : proj.currentStage === 'TENDERING'
                              ? (language === 'hi' ? 'निविदा प्रक्रिया' : 'Tendering')
                              : (language === 'hi' ? 'योजनाबद्ध' : 'Planning')}
                          </span>
                        </td>
                        <td className="py-3 px-4 min-w-[140px]">
                          <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                            <span className="text-slate-700">{proj.verifiedProgress}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isCompleted
                                  ? 'bg-emerald-500'
                                  : isDelayed
                                  ? 'bg-red-500'
                                  : 'bg-[#18327b]'
                              }`}
                              style={{ width: `${Math.min(100, proj.verifiedProgress)}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedProject(proj);
                                setIsProjectDetailOpen(true);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#18327b] hover:text-white text-slate-700 text-xs font-bold transition"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{language === 'hi' ? 'विवरण' : 'Details'}</span>
                            </button>
                            {(!currentUser || currentUser.role !== 'READONLY') && (
                              <button
                                onClick={() => handleDeleteProject(proj)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-600 text-xs font-bold transition border border-red-200 shadow-xs"
                                title={language === 'hi' ? 'परियोजना हटाएं (Delete)' : 'Delete Project Record'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>{language === 'hi' ? 'हटाएं' : 'Delete'}</span>
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

        </main>
      )}

      {/* 4. Official Footer */}
      <Footer onOpenSection={handleOpenSection} language={language} />

      {/* --- Modals & Drawers --- */}
      <ApplicationFormModal
        isOpen={activeModal === 'form'}
        onClose={() => setActiveModal(null)}
        onApplicationCreated={handleApplicationCreated}
        language={language}
        settings={settings}
      />

      <ApplicationTableModal
        isOpen={activeModal === 'table'}
        onClose={() => setActiveModal(null)}
        currentUser={currentUser}
        onSelectApplication={(app) => handleSelectApplication(app)}
        language={language}
        initialTab={tableModalInitialTab}
        onDataChanged={loadDashboardStats}
      />

      <AnalyticsModal
        isOpen={activeModal === 'reports'}
        onClose={() => setActiveModal(null)}
        language={language}
      />

      <MasterDataModal
        isOpen={activeModal === 'master'}
        onClose={() => setActiveModal(null)}
        currentUser={currentUser}
        language={language}
      />

      <AdminDashboardModal
        isOpen={activeModal === 'admin' && currentUser?.role === 'ADMIN'}
        onClose={() => setActiveModal(null)}
        currentUser={currentUser}
        language={language}
        onSettingsUpdated={(updatedSettings) => {
          setSettings(updatedSettings);
        }}
      />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={(user) => {
          handleLoginSuccess(user);
          setLoginModalOpen(false);
        }}
        language={language}
      />

      <ApplicationDetailDrawer
        application={selectedApp}
        onClose={() => setSelectedApp(null)}
        currentUser={currentUser}
        onRefresh={() => {
          loadDashboardStats();
        }}
        language={language}
      />

      {/* Announcement & Project Tracking Modals in Workspace */}
      <ProjectTableModal
        isOpen={isProjectTableOpen}
        onClose={() => setIsProjectTableOpen(false)}
        projects={projectsList}
        initialTab={projectTableTab}
        currentUser={currentUser}
        onProjectDeleted={(_id) => {
          loadProjectData();
        }}
        onSelectProject={(proj) => {
          setSelectedProject(proj);
          setIsProjectDetailOpen(true);
        }}
        onOpenNewForm={() => {
          setEditingProject(null);
          setIsProjectFormOpen(true);
        }}
        language={language}
      />

      <ProjectDetailDrawer
        isOpen={isProjectDetailOpen}
        onClose={() => setIsProjectDetailOpen(false)}
        project={selectedProject}
        currentUser={currentUser}
        onDelete={handleDeleteProject}
        onEdit={(proj) => {
          setEditingProject(proj);
          setIsProjectDetailOpen(false);
          setIsProjectFormOpen(true);
        }}
        language={language}
      />

      <ProjectFormModal
        isOpen={isProjectFormOpen}
        onClose={() => {
          setIsProjectFormOpen(false);
          setEditingProject(null);
        }}
        onSubmit={handleSaveProject}
        initialData={editingProject}
        language={language}
      />
    </div>
  );
};

export default App;
