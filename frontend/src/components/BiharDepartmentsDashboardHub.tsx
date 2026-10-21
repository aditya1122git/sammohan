import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Shield,
  Search,
  Plus,
  Edit3,
  Save,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  FileText,
  Sparkles,
  TrendingUp,
  IndianRupee,
  Landmark,
  Layers,
  Filter,
  Clock,
  ArrowUpRight,
  ChevronRight,
  X,
  Trash2,
  MapPin,
  Activity,
  Briefcase,
  PhoneCall,
  Globe,
  Check,
  Calendar,
  Eye
} from 'lucide-react';
import { BIHAR_48_DEPARTMENTS, BiharDepartment } from '../data/biharDepartments';
import { DEFAULT_48_DEPARTMENT_PROFILES, DepartmentProfileData } from '../data/departmentProfiles';
import { ProjectAnnouncement, ProjectStage } from '../types';
import { FullPageWorkspace } from './FullPageWorkspace';

export const BIHAR_38_DISTRICTS = [
  'पटना (Patna)',
  'नालंदा (Nalanda)',
  'भोजपुर (Bhojpur)',
  'बक्सर (Buxar)',
  'रोहतास (Rohtas)',
  'कैमूर (Kaimur)',
  'गया (Gaya)',
  'जहानाबाद (Jehanabad)',
  'अरवल (Arwal)',
  'नवादा (Nawada)',
  'औरंगाबाद (Aurangabad)',
  'मुजफ्फरपुर (Muzaffarpur)',
  'पूर्वी चंपारण (East Champaran)',
  'पश्चिम चंपारण (West Champaran)',
  'सीतामढ़ी (Sitamarhi)',
  'शिवहर (Sheohar)',
  'वैशाली (Vaishali)',
  'सारण (Saran)',
  'सीवान (Siwan)',
  'गोपालगंज (Gopalganj)',
  'दरभंगा (Darbhanga)',
  'मधुबनी (Madhubani)',
  'समस्तीपुर (Samastipur)',
  'सहरसा (Saharsa)',
  'सुपौल (Supaul)',
  'मधेपुरा (Madhepura)',
  'पूर्णिया (Purnia)',
  'अररिया (Araria)',
  'किशनगंज (Kishanganj)',
  'कटिहार (Katihar)',
  'भागलपुर (Bhagalpur)',
  'बांका (Banka)',
  'मुंगेर (Munger)',
  'जमुई (Jamui)',
  'खगड़िया (Khagaria)',
  'लखीसराय (Lakhisarai)',
  'शेखपुरा (Sheikhpura)',
  'बेगूसराय (Begusarai)',
  'राज्यव्यापी (Statewide)'
];

interface BiharDepartmentsDashboardHubProps {
  language: 'hi' | 'en';
  projects?: ProjectAnnouncement[];
  onSaveProject?: (projectData: Partial<ProjectAnnouncement>) => Promise<void> | void;
  onDeleteProject?: (project: ProjectAnnouncement) => Promise<void> | void;
}

export const BiharDepartmentsDashboardHub: React.FC<BiharDepartmentsDashboardHubProps> = ({
  language,
  projects = [],
  onSaveProject,
  onDeleteProject,
}) => {
  // Category & search filtering
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'admin' | 'infra' | 'welfare' | 'agri' | 'edu'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Department Modal
  const [activeDept, setActiveDept] = useState<BiharDepartment | null>(null);
  const [modalTab, setModalTab] = useState<'profile' | 'projects' | 'edit'>('profile');

  // Stored Profiles (Overrides from localStorage)
  const [customProfiles, setCustomProfiles] = useState<Record<number, DepartmentProfileData>>({});

  // Locally stored manual projects
  const [localProjects, setLocalProjects] = useState<ProjectAnnouncement[]>([]);

  // Edit Profile Form State
  const [editProfileForm, setEditProfileForm] = useState<Partial<DepartmentProfileData>>({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Add New Project to Department Form State
  const [newProjectForm, setNewProjectForm] = useState<{
    commitment: string;
    location: string;
    sanctionedAmountCr: string;
    utilizedAmountCr: string;
    currentStage: ProjectStage;
    verifiedProgress: number;
    nextMilestone: string;
    nextMilestoneDate: string;
    isDelayed: boolean;
    delayOrObstacle: string;
    beneficiaries: string;
  }>({
    commitment: '',
    location: 'पटना (Patna)',
    sanctionedAmountCr: '50.00',
    utilizedAmountCr: '15.00',
    currentStage: 'UNDER_CONSTRUCTION',
    verifiedProgress: 35,
    nextMilestone: 'समीक्षा बैठक एवं तकनीकी निरीक्षण पूर्णता',
    nextMilestoneDate: '2026-11-30',
    isDelayed: false,
    delayOrObstacle: '',
    beneficiaries: 'समस्त बिहार जनसाधारण'
  });
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [projectSaveSuccess, setProjectSaveSuccess] = useState(false);

  // Load custom profiles & local projects from localStorage on mount
  useEffect(() => {
    try {
      const savedProfiles = localStorage.getItem('bihar_custom_departments_v1');
      if (savedProfiles) {
        setCustomProfiles(JSON.parse(savedProfiles));
      }

      const savedProjects = localStorage.getItem('bihar_department_manual_projects_v1');
      if (savedProjects) {
        setLocalProjects(JSON.parse(savedProjects));
      }
    } catch (e) {
      console.warn('Failed to load local department storage', e);
    }

    // Check URL hash for dept=ID
    const checkHashForDept = () => {
      const hash = window.location.hash || '';
      const match = hash.match(/dept=(\d+)/i);
      if (match) {
        const dId = parseInt(match[1]);
        const found = BIHAR_48_DEPARTMENTS.find((d) => d.id === dId);
        const tabMatch = hash.match(/tab=(profile|projects|edit)/i);
        const tab = (tabMatch ? tabMatch[1] : 'profile') as any;
        if (found) {
          handleOpenDept(found, tab);
        }
      }
    };
    checkHashForDept();
    window.addEventListener('hashchange', checkHashForDept);
    const handleDashboardHome = () => {
      setActiveDept(null);
      setModalTab('profile');
    };
    window.addEventListener('sammohan:dashboard-home', handleDashboardHome);

    return () => {
      window.removeEventListener('hashchange', checkHashForDept);
      window.removeEventListener('sammohan:dashboard-home', handleDashboardHome);
    };
  }, []);

  // Combined projects list (Prop projects + local manual projects)
  const allProjects = useMemo(() => {
    const combined = [...projects];
    localProjects.forEach((lp) => {
      if (!combined.some((p) => p.id === lp.id || p.referenceId === lp.referenceId)) {
        combined.push(lp);
      }
    });
    return combined;
  }, [projects, localProjects]);

  // Helper to get active profile for a department (merged default + custom)
  const getDepartmentProfile = (deptId: number): DepartmentProfileData => {
    const def = DEFAULT_48_DEPARTMENT_PROFILES[deptId] || {
      id: deptId,
      code: `DEP-${deptId}`,
      ministerHi: 'माननीय प्रभारी मंत्री',
      ministerEn: 'Hon’ble Minister In-Charge',
      secretaryHi: 'प्रधान सचिव / सचिव',
      secretaryEn: 'Principal Secretary',
      officeLocationHi: 'विकास भवन, पटना',
      officeLocationEn: 'Vikas Bhawan, Patna',
      websiteUrl: 'https://state.bihar.gov.in',
      helpline: '0612-2217000',
      annualBudgetCr: 1000.0,
      utilizedBudgetCr: 750.0,
      schemesHi: ['विभागीय विकास योजना', 'डिजिटल सेवा संवर्धन'],
      schemesEn: ['Departmental Development Scheme', 'Digital Citizen Services'],
      directivesHi: 'समयबद्ध प्रशासनिक डिलीवरी एवं जन-कल्याण।',
      directivesEn: 'Time-bound administrative service delivery and public welfare.'
    };
    return customProfiles[deptId] ? { ...def, ...customProfiles[deptId] } : def;
  };

  // Helper to get all projects belonging to a department
  const getDepartmentProjects = (dept: BiharDepartment): ProjectAnnouncement[] => {
    return allProjects.filter((p) => {
      if (!p.department) return false;
      const deptStr = p.department.toLowerCase();
      const nameHi = dept.nameHi.toLowerCase();
      const nameEn = dept.nameEn.toLowerCase();
      const code = dept.code.toLowerCase();
      return (
        deptStr.includes(code) ||
        deptStr.includes(nameHi) ||
        deptStr.includes(nameEn) ||
        nameHi.includes(deptStr) ||
        nameEn.includes(deptStr)
      );
    });
  };

  // Filtered 48 Departments
  const filteredDepartments = useMemo(() => {
    return BIHAR_48_DEPARTMENTS.filter((dept) => {
      const matchCat = selectedCategory === 'all' || dept.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchCat;

      const profile = getDepartmentProfile(dept.id);
      const matchSearch =
        dept.nameHi.toLowerCase().includes(q) ||
        dept.nameEn.toLowerCase().includes(q) ||
        dept.code.toLowerCase().includes(q) ||
        dept.summaryHi.toLowerCase().includes(q) ||
        dept.summaryEn.toLowerCase().includes(q) ||
        profile.ministerHi.toLowerCase().includes(q) ||
        profile.ministerEn.toLowerCase().includes(q) ||
        profile.secretaryHi.toLowerCase().includes(q) ||
        profile.schemesHi.some((s) => s.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery, customProfiles]);

  // Handle open department modal
  const handleOpenDept = (dept: BiharDepartment, initialTab: 'profile' | 'projects' | 'edit' = 'profile') => {
    setActiveDept(dept);
    setModalTab(initialTab);
    const profile = getDepartmentProfile(dept.id);
    setEditProfileForm({ ...profile });
    setProfileSaveSuccess(false);
    setProjectSaveSuccess(false);
  };

  // Save Department Profile to state and localStorage
  const handleSaveProfile = () => {
    if (!activeDept) return;
    setIsSavingProfile(true);

    const updatedProfile: DepartmentProfileData = {
      ...getDepartmentProfile(activeDept.id),
      ...editProfileForm,
      id: activeDept.id,
      code: activeDept.code
    };

    const newMap = {
      ...customProfiles,
      [activeDept.id]: updatedProfile
    };

    setCustomProfiles(newMap);
    try {
      localStorage.setItem('bihar_custom_departments_v1', JSON.stringify(newMap));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }

    setIsSavingProfile(false);
    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 3000);
  };

  // Add new project to this department
  const handleCreateProjectForDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDept || !newProjectForm.commitment.trim()) return;

    setIsSavingProject(true);

    const refCode = activeDept.code.toUpperCase();
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newRefId = `BIH-${refCode}-${new Date().getFullYear()}-${randNum}`;

    const newProj: ProjectAnnouncement = {
      id: Date.now(),
      referenceId: newRefId,
      department: activeDept.nameHi,
      commitment: newProjectForm.commitment,
      location: newProjectForm.location,
      districtName: newProjectForm.location.split(' ')[0],
      beneficiaries: newProjectForm.beneficiaries,
      financialStatus: 'SANCTIONED',
      sanctionedAmountCr: parseFloat(newProjectForm.sanctionedAmountCr) || 0,
      utilizedAmountCr: parseFloat(newProjectForm.utilizedAmountCr) || 0,
      currentStage: newProjectForm.currentStage,
      verifiedProgress: newProjectForm.verifiedProgress,
      nextMilestone: newProjectForm.nextMilestone,
      nextMilestoneDate: newProjectForm.nextMilestoneDate,
      isDelayed: newProjectForm.isDelayed,
      delayOrObstacle: newProjectForm.isDelayed ? newProjectForm.delayOrObstacle : null,
      source: 'विभागीय अनुश्रवण पोर्टल',
      communicationStatus: 'VERIFIED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // If onSaveProject prop is provided, call it
    if (onSaveProject) {
      try {
        await onSaveProject(newProj);
      } catch (err) {
        console.warn('API save project failed, saving to local state', err);
      }
    }

    // Also persist in local storage
    const updatedLocal = [newProj, ...localProjects];
    setLocalProjects(updatedLocal);
    try {
      localStorage.setItem('bihar_department_manual_projects_v1', JSON.stringify(updatedLocal));
    } catch (err) {
      console.warn('Failed to write to localStorage', err);
    }

    setIsSavingProject(false);
    setProjectSaveSuccess(true);

    // Reset form
    setNewProjectForm({
      commitment: '',
      location: 'पटना (Patna)',
      sanctionedAmountCr: '50.00',
      utilizedAmountCr: '15.00',
      currentStage: 'UNDER_CONSTRUCTION',
      verifiedProgress: 35,
      nextMilestone: 'समीक्षा बैठक एवं तकनीकी निरीक्षण पूर्णता',
      nextMilestoneDate: '2026-11-30',
      isDelayed: false,
      delayOrObstacle: '',
      beneficiaries: 'समस्त बिहार जनसाधारण'
    });

    setTimeout(() => {
      setProjectSaveSuccess(false);
      setModalTab('projects');
    }, 1500);
  };

  // Delete project from department
  const handleDeleteLocalProject = async (proj: ProjectAnnouncement) => {
    if (
      !window.confirm(
        language === 'hi'
          ? `क्या आप वाकई "${proj.commitment}" को हटाना चाहते हैं?`
          : `Are you sure you want to delete "${proj.commitment}"?`
      )
    ) {
      return;
    }

    if (onDeleteProject) {
      try {
        await onDeleteProject(proj);
      } catch (e) {
        console.warn('API delete failed', e);
      }
    }

    const filtered = localProjects.filter((p) => p.id !== proj.id && p.referenceId !== proj.referenceId);
    setLocalProjects(filtered);
    try {
      localStorage.setItem('bihar_department_manual_projects_v1', JSON.stringify(filtered));
    } catch (e) {
      console.warn('Failed to update localStorage', e);
    }
  };

  // Aggregated Stats across all 48 departments
  const totalBudgetCr = useMemo(() => {
    return BIHAR_48_DEPARTMENTS.reduce((sum, d) => {
      const p = getDepartmentProfile(d.id);
      return sum + (p.annualBudgetCr || 0);
    }, 0);
  }, [customProfiles]);

  const totalTrackedProjects = allProjects.length;

  return (
    <div className="w-full space-y-6">
      
      {/* 1. Main Header Box */}
      <div className="bg-gradient-to-r from-[#0d225c] via-[#122e7a] to-[#18327b] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-blue-900/50">
        
        {/* Background Decorative Rings */}
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="min-w-0 space-y-3 max-w-3xl">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-semibold text-amber-300 backdrop-blur-md">
              <Landmark className="w-4 h-4 text-amber-300" />
              <span>
                {language === 'hi'
                  ? '🏛️ बिहार सरकार • 48 प्रशासनिक विभाग अनुश्रवण एवं डेटा हब'
                  : '🏛️ Govt of Bihar • 48 Administrative Departments Monitoring Hub'}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight font-serif">
              <span>{language === 'hi' ? 'बिहार के सभी 48 प्रशासनिक विभाग — ' : 'All 48 Administrative Departments — '}</span>
              <span className="text-[#f97316]">
                {language === 'hi' ? 'एकीकृत डेटा व संपादन केंद्र' : 'Integrated Data & Editing Center'}
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal">
              {language === 'hi'
                ? 'प्रत्येक विभाग के आइकन पर क्लिक करके विभाग का संपूर्ण मास्टर डेटा (बजट, प्रमुख योजनाएं व परियोजनाएं) देखें तथा वहीं से सीधे नया डेटा दर्ज अथवा संपादित करें।'
                : 'Click any department icon to inspect complete departmental master data (budget, schemes & projects) and edit or add manual data in-place.'}
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid min-w-0 w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[460px] lg:flex-none">
            <div className="min-w-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">48</div>
              <div className="text-[11px] sm:text-xs font-bold text-blue-100 uppercase tracking-wider mt-1">
                {language === 'hi' ? 'कुल विभाग' : 'Departments'}
              </div>
            </div>
            <div className="min-w-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">{totalTrackedProjects}</div>
              <div className="text-[11px] sm:text-xs font-bold text-blue-100 uppercase tracking-wider mt-1">
                {language === 'hi' ? 'सक्रिय परियोजनाएं' : 'Active Projects'}
              </div>
            </div>
            <div className="min-w-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center">
              <div className="text-xl sm:text-2xl font-black text-amber-300">
                ₹{(totalBudgetCr / 1000).toFixed(1)}k Cr
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-blue-100 uppercase tracking-wider mt-1">
                {language === 'hi' ? 'कुल राज्य बजट' : 'Total Budget'}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 2. Search & Category Filters Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-thin scrollbar-thumb-slate-300">
          {[
            { id: 'all', hi: 'सभी 48 विभाग', en: 'All 48' },
            { id: 'admin', hi: 'प्रशासन व वित्त', en: 'Admin & Finance' },
            { id: 'infra', hi: 'अवसंरचना व निर्माण', en: 'Infra & Works' },
            { id: 'welfare', hi: 'स्वास्थ्य व कल्याण', en: 'Health & Welfare' },
            { id: 'agri', hi: 'कृषि व ग्रामीण', en: 'Agri & Rural' },
            { id: 'edu', hi: 'शिक्षा व उद्योग', en: 'Edu & Industry' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#18327b] text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {language === 'hi' ? cat.hi : cat.en}
            </button>
          ))}
        </div>

        {/* Live Search Bar */}
        <div className="relative min-w-[260px] sm:min-w-[320px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'hi'
                ? 'विभाग का नाम, कोड या योजना खोजें...'
                : 'Search by Dept, Code, Schemes...'
            }
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#18327b] focus:border-transparent transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* 3. Grid of 48 Department Icons / Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDepartments.map((dept) => {
          const profile = getDepartmentProfile(dept.id);
          const deptProjects = getDepartmentProjects(dept);
          const DeptIcon = dept.icon;

          return (
            <div
              key={dept.id}
              onClick={() => handleOpenDept(dept, 'profile')}
              className="group bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 hover:border-[#18327b]/50 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden transform hover:-translate-y-1"
            >
              {/* Subtle gradient strip on top of card */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-[#18327b] to-[#f97316] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Header Row: Circular Icon Badge + Code + Index */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  
                  {/* Department Emblem Logo Photo */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-center p-1 shadow-xs group-hover:scale-110 group-hover:border-[#18327b]/50 group-hover:shadow-md transition-all duration-300 overflow-hidden">
                      <img
                        src={profile.logoUrl || `/images/departments/dept_${dept.id}.svg`}
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
                    {/* Tiny state badge indicator */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center shadow-xs">
                      <span className="text-[8px] font-black text-slate-900">★</span>
                    </div>
                  </div>

                  {/* Index and Code */}
                  <div className="text-right">
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 group-hover:bg-blue-50 text-slate-600 group-hover:text-[#18327b] font-mono transition">
                      #{dept.id.toString().padStart(2, '0')} • {dept.code}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1 capitalize font-medium">
                      {dept.category === 'admin' && 'प्रशासन'}
                      {dept.category === 'infra' && 'अवसंरचना'}
                      {dept.category === 'welfare' && 'कल्याण'}
                      {dept.category === 'agri' && 'कृषि/ग्रामीण'}
                      {dept.category === 'edu' && 'शिक्षा/उद्योग'}
                    </div>
                  </div>

                </div>

                {/* Primary Hindi Name */}
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#18327b] transition-colors leading-snug line-clamp-1">
                  {dept.nameHi}
                </h3>
                
                {/* English Name */}
                <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                  {dept.nameEn}
                </p>

                {/* Summary */}
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                  {language === 'hi' ? dept.summaryHi : dept.summaryEn}
                </p>
              </div>

              {/* Bottom Footer: Budget + Projects Count + Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                
                {/* Budget Badge */}
                <div className="flex items-center gap-1 text-[11px] font-extrabold text-slate-800">
                  <span className="text-amber-600">₹</span>
                  <span>{profile.annualBudgetCr.toLocaleString()} Cr</span>
                </div>

                {/* Project Count Pill */}
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-lg bg-blue-50 group-hover:bg-[#18327b] text-[#18327b] group-hover:text-white text-[10px] font-bold transition">
                    {deptProjects.length} {language === 'hi' ? 'परियोजनाएं' : 'Projects'}
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover:bg-amber-400 group-hover:text-slate-900 flex items-center justify-center text-slate-500 transition">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Empty Search Results State */}
      {filteredDepartments.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            {language === 'hi' ? 'कोई विभाग नहीं मिला' : 'No departments match your query'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {language === 'hi'
              ? 'कृपया दूसरा खोज शब्द दर्ज करें अथवा फ़िल्टर रीसेट करें।'
              : 'Please refine your search query or reset the category filter.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#18327b] text-white text-xs font-bold"
          >
            {language === 'hi' ? 'सभी 48 विभाग देखें' : 'Reset & Show All 48'}
          </button>
        </div>
      )}

      {/* Full-page department workspace */}
      {activeDept && (
        <FullPageWorkspace>
          <section className="h-full min-w-0 w-full overflow-y-auto overflow-x-hidden overscroll-contain bg-slate-50" aria-label="Department details">
            
            {/* Page Header */}
            <div className="relative flex-shrink-0 bg-gradient-to-r from-[#0d225c] via-[#122e7a] to-[#18327b] px-4 py-4 text-white sm:px-8 sm:py-5 lg:px-10">
              
              <button
                onClick={() => setActiveDept(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition"
                aria-label={language === 'hi' ? 'विभाग पृष्ठ बंद करें' : 'Close department page'}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pr-10">
                {/* Department Emblem Logo Photo */}
                <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/30 backdrop-blur-md flex items-center justify-center flex-shrink-0 shadow-inner p-1 overflow-hidden">
                  <img
                    src={getDepartmentProfile(activeDept.id).logoUrl || `/images/departments/dept_${activeDept.id}.svg`}
                    alt={activeDept.nameHi}
                    className="w-full h-full object-contain filter drop-shadow-md"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = '/images/bihar-government-logo.png';
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-900 text-xs font-mono font-black">
                      #{activeDept.id.toString().padStart(2, '0')} • {activeDept.code}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-white/15 text-blue-100 text-xs font-medium">
                      {activeDept.category.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black font-serif text-white">
                    {activeDept.nameHi}
                  </h2>
                  <p className="text-xs sm:text-sm text-blue-200 font-medium">
                    {activeDept.nameEn}
                  </p>
                </div>
              </div>

              {/* Page Tabs Bar */}
              <div className="flex max-w-full items-center gap-2 mt-4 pt-4 border-t border-white/15 overflow-x-auto pb-1">
                <button
                  onClick={() => setModalTab('profile')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    modalTab === 'profile'
                      ? 'bg-white text-[#18327b] shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'विभागीय संपूर्ण डेटा' : 'Department Profile'}</span>
                </button>

                <button
                  onClick={() => setModalTab('projects')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    modalTab === 'projects'
                      ? 'bg-white text-[#18327b] shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>
                    {language === 'hi' ? 'परियोजनाएं एवं घोषणाएं' : 'Projects & Milestones'} (
                    {getDepartmentProjects(activeDept).length})
                  </span>
                </button>

                <button
                  onClick={() => setModalTab('edit')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    modalTab === 'edit'
                      ? 'bg-amber-400 text-slate-900 shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'डेटा संपादन एवं नया रिकॉर्ड दर्ज करें' : 'Edit & Add Data'}</span>
                </button>
              </div>

            </div>

            {/* Page Body */}
            <div className="min-w-0 bg-slate-50">
              <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6 p-4 sm:p-7 lg:p-8">
              
              {/* TAB 1: COMPLETE DEPARTMENT PROFILE */}
              {modalTab === 'profile' && (() => {
                const profile = getDepartmentProfile(activeDept.id);
                const deptProjects = getDepartmentProjects(activeDept);
                const ongoingCount = deptProjects.filter((p) => !p.currentStage.includes('COMMISSIONED') && !p.currentStage.includes('OPERATIONAL')).length;
                const completedCount = deptProjects.filter((p) => p.currentStage.includes('COMMISSIONED') || p.currentStage.includes('OPERATIONAL')).length;
                const delayedCount = deptProjects.filter((p) => p.isDelayed).length;

                return (
                  <div className="space-y-6">
                    
                    {/* KPI Cards Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                          <IndianRupee className="w-4 h-4 text-amber-500" />
                          <span>{language === 'hi' ? 'स्वीकृत वार्षिक बजट' : 'Sanctioned Budget'}</span>
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                          ₹{profile.annualBudgetCr.toLocaleString()} Cr
                        </div>
                        <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                          {language === 'hi' ? 'राजकीय आवंटन 2026-27' : 'State Allocation'}
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                          <Activity className="w-4 h-4 text-blue-500" />
                          <span>{language === 'hi' ? 'वास्तविक व्यय' : 'Actual Expenditure'}</span>
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                          ₹{profile.utilizedBudgetCr.toLocaleString()} Cr
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                          {((profile.utilizedBudgetCr / (profile.annualBudgetCr || 1)) * 100).toFixed(1)}% {language === 'hi' ? 'उपयोगिता दर' : 'utilization'}
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                          <Clock className="w-4 h-4 text-indigo-500" />
                          <span>{language === 'hi' ? 'प्रगतिशील कार्य' : 'Ongoing Work'}</span>
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-indigo-700 mt-1">
                          {ongoingCount} {language === 'hi' ? 'परियोजनाएं' : 'Projects'}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                          {completedCount} {language === 'hi' ? 'पूर्ण' : 'completed'}
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                          <AlertTriangle className="w-4 h-4 text-rose-500" />
                          <span>{language === 'hi' ? 'लंबित / समीक्षाधीन' : 'Delayed / Attention'}</span>
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-rose-600 mt-1">
                          {delayedCount}
                        </div>
                        <div className="text-[10px] text-rose-600 font-bold mt-0.5">
                          {delayedCount > 0 ? (language === 'hi' ? 'त्वरित निवारण आवश्यक' : 'Needs attention') : (language === 'hi' ? 'शून्य बाधा' : 'No bottlenecks')}
                        </div>
                      </div>
                    </div>

                    {/* Administrative Nodal Office & Contacts Grid */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#18327b]">
                        <Shield className="w-4 h-4 text-amber-500" />
                        <span>{language === 'hi' ? 'प्रशासनिक नोडल कार्यालय एवं संपर्क विवरण' : 'Nodal Office & Contacts'}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">
                            {language === 'hi' ? 'मुख्यालय / सचिवालय पता' : 'Office Address'}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                            <span>{profile.officeLocationHi}</span>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">
                            {language === 'hi' ? 'हेल्पलाइन / आधिकारिक पोर्टल' : 'Helpline & Official Portal'}
                          </span>
                          <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-800 mt-0.5">
                            <div className="flex items-center gap-1 truncate">
                              <PhoneCall className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                              <span className="truncate">{profile.helpline}</span>
                            </div>
                            <a
                              href={profile.websiteUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 underline flex-shrink-0"
                            >
                              <Globe className="w-3.5 h-3.5" />
                              <span>{language === 'hi' ? 'पोर्टल खोलें' : 'Visit Portal'}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Flagship Schemes Section */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#18327b]">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>{language === 'hi' ? 'प्रमुख फ्लैगशिप योजनाएं' : 'Key Flagship Schemes'}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {profile.schemesHi.map((scheme, sIdx) => (
                          <div
                            key={sIdx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs font-bold text-amber-900 shadow-2xs"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>{scheme}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Directives & Vision */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50/40 rounded-2xl p-5 border border-blue-200/70">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#18327b] mb-1.5">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span>{language === 'hi' ? 'विभागीय दिशानिर्देश एवं नीतिगत लक्ष्य' : 'Directives & Policy Goals'}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                        {language === 'hi' ? profile.directivesHi : profile.directivesEn}
                      </p>
                    </div>

                    {/* Call to action bar inside modal */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <button
                        onClick={() => setModalTab('projects')}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#18327b] text-white text-xs font-bold hover:bg-[#12245a] transition shadow-sm"
                      >
                        <Building2 className="w-4 h-4" />
                        <span>{language === 'hi' ? 'विभाग की सभी परियोजनाएं देखें' : 'View Department Projects'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setModalTab('edit')}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-bold transition shadow-sm"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>{language === 'hi' ? 'डेटा संशोधित करें / नया रिकॉर्ड जोड़ें' : 'Edit Data / Add Record'}</span>
                      </button>
                    </div>

                  </div>
                );
              })()}

              {/* TAB 2: PROJECTS & ANNOUNCEMENTS UNDER THIS DEPARTMENT */}
              {modalTab === 'projects' && (() => {
                const deptProjects = getDepartmentProjects(activeDept);

                return (
                  <div className="space-y-4">
                    
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {language === 'hi' ? 'पंजीकृत परियोजनाएं एवं घोषणाएं' : 'Registered Projects & Announcements'}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {language === 'hi'
                            ? `${activeDept.nameHi} के अंतर्गत कुल ${deptProjects.length} परियोजनाएं सक्रिय रूप से ट्रैक की जा रही हैं।`
                            : `Tracking ${deptProjects.length} projects under ${activeDept.nameEn}.`}
                        </p>
                      </div>

                      <button
                        onClick={() => setModalTab('edit')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#18327b] hover:bg-[#12245a] text-white text-xs font-bold transition shadow-sm"
                      >
                        <Plus className="w-4 h-4 text-amber-300" />
                        <span>{language === 'hi' ? 'नया प्रोजेक्ट जोड़ें' : 'Add New Project'}</span>
                      </button>
                    </div>

                    {deptProjects.length > 0 ? (
                      <div className="space-y-3">
                        {deptProjects.map((proj) => (
                          <div
                            key={proj.id}
                            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:border-[#18327b]/50 transition-all space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-mono font-bold">
                                  {proj.referenceId}
                                </span>
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  proj.currentStage === 'COMMISSIONED' || proj.currentStage === 'OPERATIONAL'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : proj.isDelayed
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {proj.currentStage.replace('_', ' ')}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                                  <span>{proj.location}</span>
                                </span>
                                <button
                                  onClick={() => handleDeleteLocalProject(proj)}
                                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                              {proj.commitment}
                            </h4>

                            {/* Progress bar and metrics */}
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-2 border-t border-slate-100">
                              
                              <div className="sm:col-span-6 space-y-1">
                                <div className="flex items-center justify-between text-xs font-bold">
                                  <span className="text-slate-500">{language === 'hi' ? 'धरातलीय प्रगति' : 'Physical Progress'}</span>
                                  <span className="text-[#18327b]">{proj.verifiedProgress}%</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-[#18327b] transition-all duration-500"
                                    style={{ width: `${Math.min(100, Math.max(5, proj.verifiedProgress))}%` }}
                                  />
                                </div>
                              </div>

                              <div className="sm:col-span-3 text-xs font-semibold text-slate-600">
                                <div>{language === 'hi' ? 'स्वीकृत' : 'Sanctioned'}: <span className="font-bold text-slate-900">₹{proj.sanctionedAmountCr} Cr</span></div>
                                <div>{language === 'hi' ? 'व्यय' : 'Utilized'}: <span className="font-bold text-emerald-700">₹{proj.utilizedAmountCr} Cr</span></div>
                              </div>

                              <div className="sm:col-span-3 text-xs text-slate-500 font-medium truncate">
                                <span className="block font-bold text-slate-700">{language === 'hi' ? 'आगामी लक्ष्य' : 'Milestone'}:</span>
                                <span className="truncate block" title={proj.nextMilestone}>{proj.nextMilestone}</span>
                              </div>

                            </div>

                            {/* Obstacle Alert if delayed */}
                            {proj.isDelayed && proj.delayOrObstacle && (
                              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                                <span>{proj.delayOrObstacle}</span>
                              </div>
                            )}

                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
                        <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <h4 className="text-sm font-bold text-slate-800">
                          {language === 'hi' ? 'इस विभाग में कोई परियोजना दर्ज नहीं है' : 'No projects registered yet for this department'}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                          {language === 'hi'
                            ? 'आप "डेटा संपादन एवं नया रिकॉर्ड दर्ज करें" टैब में जाकर तुरंत इस विभाग के लिए नई परियोजना जोड़ सकते हैं।'
                            : 'You can immediately add a new project under this department using the Edit & Add Data tab.'}
                        </p>
                        <button
                          onClick={() => setModalTab('edit')}
                          className="mt-4 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-bold transition shadow-sm"
                        >
                          {language === 'hi' ? '+ पहली परियोजना दर्ज करें' : '+ Add First Project'}
                        </button>
                      </div>
                    )}

                  </div>
                );
              })()}

              {/* TAB 3: EDIT DEPARTMENT PROFILE & ADD NEW PROJECT */}
              {modalTab === 'edit' && (
                <div className="space-y-8">
                  
                  {/* PART A: EDIT DEPARTMENT MASTER PROFILE */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
                    
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-[#18327b]" />
                          <span>{language === 'hi' ? 'विभाग का प्रशासनिक व वित्तीय डेटा संपादित करें' : 'Edit Department Master Profile'}</span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          {language === 'hi'
                            ? 'मंत्री, सचिव, कार्यालय पता, बजट व प्रमुख योजनाओं को अपडेट करें (स्थानीय रूप से स्थायी सुरक्षित)।'
                            : 'Update leadership, nodal address, budget, and flagship schemes.'}
                        </p>
                      </div>

                      {profileSaveSuccess && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold animate-pulse">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{language === 'hi' ? 'सफलतापूर्वक सुरक्षित!' : 'Saved Successfully!'}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'hi' ? 'विभागीय लोगो फोटो (Logo Photo URL / Path)' : 'Department Logo Photo URL / Path'}
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center flex-shrink-0 shadow-xs overflow-hidden">
                            <img
                              src={editProfileForm.logoUrl || `/images/departments/dept_${activeDept.id}.svg`}
                              alt="Logo Preview"
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.onerror = null;
                                target.src = '/images/bihar-government-logo.png';
                              }}
                            />
                          </div>
                          <input
                            type="text"
                            value={editProfileForm.logoUrl || ''}
                            onChange={(e) => setEditProfileForm({ ...editProfileForm, logoUrl: e.target.value })}
                            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#18327b]"
                            placeholder={`/images/departments/dept_${activeDept.id}.svg`}
                          />
                        </div>
                      </div>


                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'hi' ? 'मुख्यालय / सचिवालय पता' : 'Office Location / Secretariat'}
                        </label>
                        <input
                          type="text"
                          value={editProfileForm.officeLocationHi || ''}
                          onChange={(e) => setEditProfileForm({ ...editProfileForm, officeLocationHi: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#18327b]"
                          placeholder="उदा. विकास भवन, बेली रोड, पटना"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'hi' ? 'आधिकारिक पोर्टल लिंक (URL)' : 'Official Website URL'}
                        </label>
                        <input
                          type="text"
                          value={editProfileForm.websiteUrl || ''}
                          onChange={(e) => setEditProfileForm({ ...editProfileForm, websiteUrl: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#18327b]"
                          placeholder="https://..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'hi' ? 'वार्षिक स्वीकृत बजट (₹ करोड़)' : 'Annual Budget (₹ Cr)'}
                        </label>
                        <input
                          type="number"
                          value={editProfileForm.annualBudgetCr || 0}
                          onChange={(e) => setEditProfileForm({ ...editProfileForm, annualBudgetCr: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#18327b]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'hi' ? 'वास्तविक व्यय (₹ करोड़)' : 'Utilized Expenditure (₹ Cr)'}
                        </label>
                        <input
                          type="number"
                          value={editProfileForm.utilizedBudgetCr || 0}
                          onChange={(e) => setEditProfileForm({ ...editProfileForm, utilizedBudgetCr: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#18327b]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'hi' ? 'प्रमुख फ्लैगशिप योजनाएं (अल्पविराम से अलग करें)' : 'Key Flagship Schemes (Comma separated)'}
                        </label>
                        <input
                          type="text"
                          value={(editProfileForm.schemesHi || []).join(', ')}
                          onChange={(e) =>
                            setEditProfileForm({
                              ...editProfileForm,
                              schemesHi: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#18327b]"
                          placeholder="योजना 1, योजना 2, योजना 3..."
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'hi' ? 'विभागीय दिशानिर्देश एवं नीतिगत लक्ष्य' : 'Directives & Policy Goals'}
                        </label>
                        <textarea
                          rows={2}
                          value={editProfileForm.directivesHi || ''}
                          onChange={(e) => setEditProfileForm({ ...editProfileForm, directivesHi: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#18327b]"
                          placeholder="विभागीय प्राथमिकताओं का विवरण..."
                        />
                      </div>

                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={handleSaveProfile}
                        disabled={isSavingProfile}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#18327b] hover:bg-[#12245a] text-white text-xs font-bold transition shadow-sm"
                      >
                        <Save className="w-4 h-4 text-amber-300" />
                        <span>{language === 'hi' ? 'विभाग डेटा सहेजें' : 'Save Department Profile'}</span>
                      </button>
                    </div>

                  </div>

                  {/* PART B: ADD NEW PROJECT / ANNOUNCEMENT TO THIS DEPARTMENT */}
                  <form onSubmit={handleCreateProjectForDept} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
                    
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <Plus className="w-4 h-4 text-amber-500" />
                          <span>
                            {language === 'hi'
                              ? `इस विभाग में नई घोषणा / परियोजना दर्ज करें (${activeDept.nameHi})`
                              : `Add New Project / Milestone to ${activeDept.nameEn}`}
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          {language === 'hi'
                            ? 'परियोजना का शीर्षक, जिला, बजट, प्रगति व आगामी लक्ष्य दर्ज करें।'
                            : 'Enter project commitment, district, budget, progress and next milestone.'}
                        </p>
                      </div>

                      {projectSaveSuccess && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold animate-pulse">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{language === 'hi' ? 'परियोजना सफलतापूर्वक जोड़ी गई!' : 'Project Added Successfully!'}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'hi' ? 'परियोजना / घोषणा का नाम *' : 'Project Title / Commitment *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={newProjectForm.commitment}
                          onChange={(e) => setNewProjectForm({ ...newProjectForm, commitment: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#18327b]"
                          placeholder="उदा. नए बाईपास फोर-लेन का निर्माण एवं आरओबी स्थापना..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'hi' ? 'संबंधित जिला *' : 'District *'}
                        </label>
                        <select
                          value={newProjectForm.location}
                          onChange={(e) => setNewProjectForm({ ...newProjectForm, location: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#18327b]"
                        >
                          {BIHAR_38_DISTRICTS.map((dist, dIdx) => (
                            <option key={dIdx} value={dist}>
                              {dist}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'hi' ? 'वर्तमान चरण (Project Stage) *' : 'Current Stage *'}
                        </label>
                        <select
                          value={newProjectForm.currentStage}
                          onChange={(e) => setNewProjectForm({ ...newProjectForm, currentStage: e.target.value as ProjectStage })}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#18327b]"
                        >
                          <option value="PLANNING">योजना / डीपीआर चरण (Planning/DPR)</option>
                          <option value="TENDERING">निविदा प्रक्रियाधीन (Tendering)</option>
                          <option value="UNDER_CONSTRUCTION">निर्माणाधीन / क्रियान्वयनाधीन (Under Construction)</option>
                          <option value="COMMISSIONED">लोकार्पित / चालू (Commissioned)</option>
                          <option value="OPERATIONAL">पूर्णतः संचालित (Operational)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'hi' ? 'स्वीकृत राशि (₹ करोड़) *' : 'Sanctioned Amount (₹ Cr) *'}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={newProjectForm.sanctionedAmountCr}
                          onChange={(e) => setNewProjectForm({ ...newProjectForm, sanctionedAmountCr: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#18327b]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'hi' ? 'वास्तविक व्यय (₹ करोड़)' : 'Utilized Amount (₹ Cr)'}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={newProjectForm.utilizedAmountCr}
                          onChange={(e) => setNewProjectForm({ ...newProjectForm, utilizedAmountCr: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#18327b]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'hi' ? 'भौतिक प्रगति (%)' : 'Verified Progress (%)'} : {newProjectForm.verifiedProgress}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={newProjectForm.verifiedProgress}
                          onChange={(e) => setNewProjectForm({ ...newProjectForm, verifiedProgress: parseInt(e.target.value) || 0 })}
                          className="w-full h-2 rounded-lg bg-slate-200 appearance-none cursor-pointer accent-[#18327b]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'hi' ? 'आगामी लक्ष्य की तिथि' : 'Next Milestone Target Date'}
                        </label>
                        <input
                          type="date"
                          value={newProjectForm.nextMilestoneDate}
                          onChange={(e) => setNewProjectForm({ ...newProjectForm, nextMilestoneDate: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#18327b]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'hi' ? 'आगामी माइलस्टोन / लक्ष्य विवरण' : 'Next Milestone Description'}
                        </label>
                        <input
                          type="text"
                          value={newProjectForm.nextMilestone}
                          onChange={(e) => setNewProjectForm({ ...newProjectForm, nextMilestone: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#18327b]"
                          placeholder="उदा. भू-अधिग्रहण पूर्ण कर पाइलिंग कार्य प्रारंभ करना..."
                        />
                      </div>

                      <div className="sm:col-span-2 flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <input
                          type="checkbox"
                          id="isDelayedCheck"
                          checked={newProjectForm.isDelayed}
                          onChange={(e) => setNewProjectForm({ ...newProjectForm, isDelayed: e.target.checked })}
                          className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                        />
                        <label htmlFor="isDelayedCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
                          {language === 'hi'
                            ? 'क्या यह परियोजना किसी बाधा या विलंब का सामना कर रही है?'
                            : 'Is this project facing any bottleneck or delay?'}
                        </label>
                      </div>

                      {newProjectForm.isDelayed && (
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-rose-700 mb-1">
                            {language === 'hi' ? 'बाधा / विलंब का कारण विवरण' : 'Delay / Obstacle Explanation'}
                          </label>
                          <textarea
                            rows={2}
                            value={newProjectForm.delayOrObstacle}
                            onChange={(e) => setNewProjectForm({ ...newProjectForm, delayOrObstacle: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-xl bg-rose-50/50 border border-rose-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                            placeholder="उदा. रेलवे क्रॉसिंग अनापत्ति प्रमाण-पत्र (NOC) अथवा तकनीकी डिजाइन संशोधन..."
                          />
                        </div>
                      )}

                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isSavingProject}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 text-xs font-extrabold transition shadow-md"
                      >
                        <Plus className="w-4 h-4 text-slate-900" />
                        <span>
                          {language === 'hi'
                            ? 'इस विभाग में नया रिकॉर्ड सुरक्षित करें'
                            : 'Save New Department Project Record'}
                        </span>
                      </button>
                    </div>

                  </form>

                </div>
              )}

              </div>
            </div>

          </section>
        </FullPageWorkspace>
      )}

    </div>
  );
};
