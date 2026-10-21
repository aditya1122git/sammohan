import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Search,
  Filter,
  Plus,
  Download,
  Building,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  IndianRupee,
  Layers,
  Activity,
  Send,
  Eye,
  Trash2,
  Database
} from 'lucide-react';
import { ProjectAnnouncement, ProjectStage, User } from '../types';
import { api } from '../services/api';

interface ProjectTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectAnnouncement[];
  initialTab?: 'all' | 'ongoing' | 'completed' | 'delayed';
  onSelectProject: (project: ProjectAnnouncement) => void;
  onOpenNewForm?: () => void;
  currentUser?: User | null;
  onProjectDeleted?: (id: number) => void;
  language: 'hi' | 'en';
}

export const ProjectTableModal: React.FC<ProjectTableModalProps> = ({
  isOpen,
  onClose,
  projects,
  initialTab = 'all',
  onSelectProject,
  onOpenNewForm,
  currentUser,
  onProjectDeleted,
  language
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'ongoing' | 'completed' | 'delayed'>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [selectedSource, setSelectedSource] = useState('ALL');
  const [internalProjects, setInternalProjects] = useState<ProjectAnnouncement[]>(projects);
  const [isLoading, setIsLoading] = useState(projects.length === 0);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  const safeText = (value: unknown): string => typeof value === 'string' ? value : '';

  const handleDelete = async (p: ProjectAnnouncement) => {
    const confirmMsg = language === 'hi'
      ? `क्या आप वाकई परियोजना ${p.referenceId} (${p.department} - ${safeText(p.commitment).substring(0, 40)}...) को डेटाबेस से स्थायी रूप से हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।`
      : `Are you sure you want to permanently delete project ${p.referenceId} (${p.department}) from the database? This action cannot be undone.`;

    if (!window.confirm(confirmMsg)) {
      return;
    }

    try {
      setIsDeletingId(p.id);
      await api.deleteProject(p.id);
      setInternalProjects((prev) => prev.filter((proj) => proj.id !== p.id));
      if (onProjectDeleted) {
        onProjectDeleted(p.id);
      }
      alert(language === 'hi' ? 'परियोजना रिकॉर्ड सफलतापूर्वक हटा दिया गया।' : 'Project record successfully deleted.');
    } catch (err: any) {
      alert(
        language === 'hi'
          ? 'परियोजना हटाने में विफल: ' + (err.response?.data?.error || err.message)
          : 'Failed to delete project: ' + (err.response?.data?.error || err.message)
      );
    } finally {
      setIsDeletingId(null);
    }
  };

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (projects && projects.length > 0) {
      setInternalProjects(projects);
      setIsLoading(false);
    } else if (isOpen) {
      setIsLoading(true);
      api.getProjects({ limit: 100 })
        .then(res => {
          if (res.projects) setInternalProjects(res.projects);
        })
        .catch(err => console.error('Failed to load projects', err))
        .finally(() => setIsLoading(false));
    }
  }, [projects, isOpen]);

  // Extract unique departments and sources for filter dropdowns
  const departments = useMemo(() => {
    const set = new Set<string>();
    internalProjects.forEach(p => { if (p.department) set.add(p.department); });
    return Array.from(set).sort();
  }, [internalProjects]);

  const sources = useMemo(() => {
    const set = new Set<string>();
    internalProjects.forEach(p => { if (p.source) set.add(p.source); });
    return Array.from(set).sort();
  }, [internalProjects]);

  // Tab counts
  const counts = useMemo(() => {
    return {
      all: internalProjects.length,
      ongoing: internalProjects.filter(p => ['PLANNING', 'TENDERING', 'UNDER_CONSTRUCTION'].includes(p.currentStage)).length,
      completed: internalProjects.filter(p => ['COMMISSIONED', 'OPERATIONAL'].includes(p.currentStage)).length,
      delayed: internalProjects.filter(p => p.isDelayed).length
    };
  }, [internalProjects]);

  // Filtered dataset
  const filteredProjects = useMemo(() => {
    return internalProjects.filter(p => {
      // Tab filter
      if (activeTab === 'ongoing' && !['PLANNING', 'TENDERING', 'UNDER_CONSTRUCTION'].includes(p.currentStage)) {
        return false;
      }
      if (activeTab === 'completed' && !['COMMISSIONED', 'OPERATIONAL'].includes(p.currentStage)) {
        return false;
      }
      if (activeTab === 'delayed' && !p.isDelayed) {
        return false;
      }

      // Dept filter
      if (selectedDept !== 'ALL' && p.department !== selectedDept) {
        return false;
      }

      // Stage filter
      if (selectedStage !== 'ALL' && p.currentStage !== selectedStage) {
        return false;
      }

      // Source filter
      if (selectedSource !== 'ALL' && p.source !== selectedSource) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matches =
          safeText(p.referenceId).toLowerCase().includes(q) ||
          safeText(p.commitment).toLowerCase().includes(q) ||
          safeText(p.department).toLowerCase().includes(q) ||
          safeText(p.location).toLowerCase().includes(q) ||
          safeText(p.delayOrObstacle).toLowerCase().includes(q) ||
          safeText(p.source).toLowerCase().includes(q) ||
          safeText(p.nextMilestone).toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [internalProjects, activeTab, selectedDept, selectedStage, selectedSource, searchTerm]);

  if (!isOpen) return null;

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Reference ID',
      'Department',
      'Commitment',
      'Location and Beneficiaries',
      'Financial Status',
      'Sanctioned Amount (Cr)',
      'Utilized Amount (Cr)',
      'Current Stage',
      'Verified Progress (%)',
      'Next Milestone',
      'Delay or Obstacle',
      'Source',
      'Communication Status'
    ];

    const rows = filteredProjects.map(p => [
      `"${p.referenceId}"`,
      `"${safeText(p.department).replace(/"/g, '""')}"`,
      `"${safeText(p.commitment).replace(/"/g, '""')}"`,
      `"${(safeText(p.location) + (p.beneficiaries ? ' | ' + p.beneficiaries : '')).replace(/"/g, '""')}"`,
      `"${safeText(p.financialStatus).replace(/"/g, '""')}"`,
      p.sanctionedAmountCr,
      p.utilizedAmountCr,
      p.currentStage,
      p.verifiedProgress,
      `"${safeText(p.nextMilestone).replace(/"/g, '""')}"`,
      `"${safeText(p.delayOrObstacle) || 'None'}"`,
      `"${safeText(p.source).replace(/"/g, '""')}"`,
      `"${safeText(p.communicationStatus).replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bihar_Project_Tracking_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stageBadge = (stage: ProjectStage) => {
    switch (stage) {
      case 'PLANNING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Planning</span>;
      case 'TENDERING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Tendering</span>;
      case 'UNDER_CONSTRUCTION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Construction</span>;
      case 'COMMISSIONED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Commissioned</span>;
      case 'OPERATIONAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-900 border border-green-300">Operational</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">{stage}</span>;
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 top-16 sm:top-[70px] z-40 overflow-hidden bg-white">
      <div className="relative bg-white w-full h-full flex flex-col overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="bg-[#18327b] text-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-blue-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Layers className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-serif leading-none">
                {language === 'hi'
                  ? 'घोषणा एवं परियोजना अनुश्रवण डेटाबेस'
                  : 'Announcement & Project Tracking Database'}
              </h2>
              <p className="text-xs text-blue-200 mt-1">
                {language === 'hi'
                  ? 'माननीय मुख्यमंत्री की घोषणाओं एवं प्रमुख अवसंरचना परियोजनाओं का एकीकृत रिकॉर्ड'
                  : "Integrated records of Hon'ble CM Announcements and Major Infrastructure Projects"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {onOpenNewForm && (
              <button
                onClick={onOpenNewForm}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-extrabold text-xs shadow-md transition active:scale-95"
              >
                <Plus className="w-4 h-4 text-slate-900" />
                <span>{language === 'hi' ? 'नई प्रविष्टि' : 'New Announcement'}</span>
              </button>
            )}

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition active:scale-95"
            >
              <Download className="w-4 h-4 text-blue-200" />
              <span>{language === 'hi' ? 'CSV निर्यात' : 'Export CSV'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar & Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 space-y-3">
          
          {/* Top Row: 4 Metric Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-[#18327b] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{language === 'hi' ? 'सभी घोषणाएँ' : 'All Announcements'}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {counts.all}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('ongoing')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'ongoing'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{language === 'hi' ? 'प्रगतिशील परियोजनाएँ' : 'Ongoing Projects'}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'ongoing' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700'
              }`}>
                {counts.ongoing}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'completed'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{language === 'hi' ? 'पूर्ण परियोजनाएँ' : 'Completed Projects'}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'completed' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
              }`}>
                {counts.completed}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('delayed')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'delayed'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{language === 'hi' ? 'विलंबित परियोजनाएँ' : 'Delayed Projects'}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'delayed' ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-700'
              }`}>
                {counts.delayed}
              </span>
            </button>
          </div>

          {/* Bottom Row: Search Box & Dropdown Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            
            {/* Search Box */}
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={language === 'hi' ? 'आईडी, घोषणा, विभाग, स्थान या बाधा द्वारा खोजें...' : 'Search by ID, commitment, department, obstacle...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Department Dropdown */}
            <div className="sm:col-span-3">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium truncate"
              >
                <option value="ALL">{language === 'hi' ? 'सभी विभाग (All Departments)' : 'All Departments'}</option>
                {departments.map((d, i) => (
                  <option key={i} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Stage Dropdown */}
            <div className="sm:col-span-2">
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              >
                <option value="ALL">{language === 'hi' ? 'सभी चरण (Stages)' : 'All Stages'}</option>
                <option value="PLANNING">Planning</option>
                <option value="TENDERING">Tendering</option>
                <option value="UNDER_CONSTRUCTION">Construction</option>
                <option value="COMMISSIONED">Commissioned</option>
                <option value="OPERATIONAL">Operational</option>
              </select>
            </div>

            {/* Source Dropdown */}
            <div className="sm:col-span-2">
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium truncate"
              >
                <option value="ALL">{language === 'hi' ? 'सभी स्रोत (Sources)' : 'All Sources'}</option>
                {sources.map((s, i) => (
                  <option key={i} value={s}>{s}</option>
                ))}
              </select>
            </div>

          </div>

        </div>

        {/* Table Content Area */}
        <div className="flex-1 overflow-auto bg-white">
          {isLoading ? (
            <div className="p-16 text-center text-slate-500 space-y-3">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-sm font-bold text-slate-700">
                {language === 'hi' ? 'डेटाबेस से घोषणाएँ एवं परियोजनाएँ लोड हो रही हैं...' : 'Loading announcements and projects from database...'}
              </div>
            </div>
          ) : internalProjects.length === 0 ? (
            <div className="p-16 text-center text-slate-400 space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-inner">
                <Database className="w-8 h-8" />
              </div>
              <div>
                <div className="text-base font-black text-slate-800 font-serif">
                  {language === 'hi' ? 'डेटाबेस में कोई रिकॉर्ड मौजूद नहीं है' : 'No records found in database'}
                </div>
                <div className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {language === 'hi'
                    ? 'सभी पूर्व स्वतः-उत्पन्न (Auto-Detected) डेटा हटा दिए गए हैं। आप "नई प्रविष्टि" बटन से अपनी आधिकारिक विकास घोषणाएं मैन्युअल रूप से दर्ज कर सकते हैं।'
                    : 'All auto-detected records have been cleared. Click "New Announcement" to manually record official commitments.'}
                </div>
              </div>
              {onOpenNewForm && (
                <button
                  onClick={onOpenNewForm}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-extrabold text-xs shadow-md transition active:scale-95"
                >
                  <Plus className="w-4 h-4 text-slate-900" />
                  <span>{language === 'hi' ? '+ पहली घोषणा मैन्युअल दर्ज करें' : '+ Enter First Announcement Manually'}</span>
                </button>
              )}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <AlertTriangle className="w-10 h-10 mx-auto text-slate-300" />
              <div className="text-sm font-bold text-slate-600">
                {language === 'hi' ? 'कोई रिकॉर्ड नहीं मिला' : 'No matching records found'}
              </div>
              <div className="text-xs text-slate-400 max-w-sm mx-auto">
                {language === 'hi' ? 'कृपया अपनी खोज या फ़िल्टर मानदंड समायोजित करें।' : 'Please adjust your search or filter criteria.'}
              </div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead className="sticky top-0 bg-slate-100/90 backdrop-blur-xs border-b border-slate-200 z-10 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3 w-32">Reference ID</th>
                  <th className="py-3 px-3 w-48">Department</th>
                  <th className="py-3 px-3 w-72">Commitment</th>
                  <th className="py-3 px-3 w-44">Location & Beneficiaries</th>
                  <th className="py-3 px-3 w-44">Financial Status</th>
                  <th className="py-3 px-3 w-28">Stage</th>
                  <th className="py-3 px-3 w-28 text-center">Verified Progress</th>
                  <th className="py-3 px-3 w-56">Next Milestone</th>
                  <th className="py-3 px-3 w-44">Delay or Obstacle</th>
                  <th className="py-3 px-3 w-40">Source</th>
                  <th className="py-3 px-3 w-36">Communication</th>
                  <th className="py-3 px-3 w-16 text-center">View</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredProjects.map((p) => {
                  const utilPercent = p.sanctionedAmountCr > 0
                    ? Math.round((p.utilizedAmountCr / p.sanctionedAmountCr) * 100)
                    : 0;

                  return (
                    <tr
                      key={p.id}
                      onClick={() => onSelectProject(p)}
                      className="hover:bg-amber-50/40 cursor-pointer transition-colors group"
                    >
                      {/* 1. Reference ID */}
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 group-hover:text-blue-700 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 group-hover:bg-amber-100 text-slate-800 transition">
                          {p.referenceId}
                        </span>
                      </td>

                      {/* 2. Department */}
                      <td className="py-3 px-3 font-medium text-slate-800 text-[11px]">
                        <div className="line-clamp-2" title={p.department}>
                          {p.department}
                        </div>
                      </td>

                      {/* 3. Commitment */}
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        <div className="line-clamp-2" title={p.commitment}>
                          {p.commitment}
                        </div>
                      </td>

                      {/* 4. Location & Beneficiaries */}
                      <td className="py-3 px-3 text-[11px]">
                        <div className="font-semibold text-slate-800 line-clamp-1">{p.location}</div>
                        {p.beneficiaries && (
                          <div className="text-slate-400 line-clamp-1 text-[10px]">{p.beneficiaries}</div>
                        )}
                      </td>

                      {/* 5. Financial Status */}
                      <td className="py-3 px-3 text-[11px]">
                        <div className="font-mono font-bold text-slate-900">
                          ₹{p.sanctionedAmountCr} Cr
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                          <span className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden inline-block">
                            <span
                              className="bg-emerald-500 h-full block rounded-full"
                              style={{ width: `${Math.min(100, utilPercent)}%` }}
                            />
                          </span>
                          <span>{utilPercent}% util</span>
                        </div>
                      </td>

                      {/* 6. Current Stage */}
                      <td className="py-3 px-3">
                        {stageBadge(p.currentStage)}
                      </td>

                      {/* 7. Verified Progress */}
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-900 text-xs">
                            {p.verifiedProgress}%
                          </span>
                        </div>
                        <div className="w-16 mx-auto bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${
                              p.verifiedProgress >= 80 ? 'bg-emerald-500' : p.verifiedProgress >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${p.verifiedProgress}%` }}
                          />
                        </div>
                      </td>

                      {/* 8. Next Milestone */}
                      <td className="py-3 px-3 text-[11px]">
                        <div className="font-medium text-slate-800 line-clamp-2" title={p.nextMilestone}>
                          {p.nextMilestone}
                        </div>
                        {p.nextMilestoneDate && (
                          <div className="text-[10px] text-sky-700 font-semibold mt-0.5">
                            Target: {new Date(p.nextMilestoneDate).toLocaleDateString()}
                          </div>
                        )}
                      </td>

                      {/* 9. Delay or Obstacle */}
                      <td className="py-3 px-3 text-[11px]">
                        {p.isDelayed ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-semibold text-[10px]">
                            <AlertTriangle className="w-3 h-3 text-rose-500 flex-shrink-0" />
                            <span className="truncate max-w-[120px]" title={p.delayOrObstacle || 'Delayed'}>
                              {p.delayOrObstacle || 'Delayed'}
                            </span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-[10px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                            <span>On Schedule</span>
                          </span>
                        )}
                      </td>

                      {/* 10. Source */}
                      <td className="py-3 px-3 text-[11px] text-slate-600">
                        <div className="line-clamp-1" title={p.source}>{p.source}</div>
                      </td>

                      {/* 11. Communication Status */}
                      <td className="py-3 px-3 text-[10px]">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200 truncate inline-block max-w-[120px]" title={p.communicationStatus}>
                          {p.communicationStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectProject(p);
                            }}
                            className="p-1 rounded-lg text-slate-400 group-hover:text-blue-600 hover:bg-slate-100 transition"
                            title={language === 'hi' ? 'विवरण देखें' : 'View Details'}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {(!currentUser || currentUser.role !== 'READONLY') && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(p);
                              }}
                              disabled={isDeletingId === p.id}
                              className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                              title={language === 'hi' ? 'परियोजना हटाएं (Delete)' : 'Delete Project Record'}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs text-slate-500">
          <div>
            {language === 'hi'
              ? `कुल ${filteredProjects.length} घोषणाएँ एवं परियोजनाएँ प्रदर्शित`
              : `Showing ${filteredProjects.length} announcements & projects`}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold transition text-xs"
            >
              {language === 'hi' ? 'बंद करें' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
