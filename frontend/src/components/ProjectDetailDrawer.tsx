import React, { useState } from 'react';
import {
  X,
  Building,
  MapPin,
  Users,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  Send,
  ExternalLink,
  Copy,
  Check,
  Edit,
  Trash2,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { ProjectAnnouncement, User } from '../types';

interface ProjectDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectAnnouncement | null;
  onEdit?: (project: ProjectAnnouncement) => void;
  onDelete?: (project: ProjectAnnouncement) => void;
  currentUser?: User | null;
  language: 'hi' | 'en';
}

export const ProjectDetailDrawer: React.FC<ProjectDetailDrawerProps> = ({
  isOpen,
  onClose,
  project,
  onEdit,
  onDelete,
  currentUser,
  language
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !project) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(project.referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stageLabels: Record<string, { hi: string; en: string; color: string; bg: string }> = {
    PLANNING: { hi: 'नियोजन एवं डीपीआर', en: 'Planning & DPR', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
    TENDERING: { hi: 'निविदा प्रक्रिया', en: 'Tendering & Bidding', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
    UNDER_CONSTRUCTION: { hi: 'निर्माण / प्रगतिशील', en: 'Under Construction', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
    COMMISSIONED: { hi: 'परीक्षण / चालू', en: 'Commissioned', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
    OPERATIONAL: { hi: 'संचालित एवं पूर्ण', en: 'Operational / Complete', color: 'text-green-800', bg: 'bg-green-50 border-green-200' },
  };

  const stageInfo = stageLabels[project.currentStage] || {
    hi: project.currentStage,
    en: project.currentStage,
    color: 'text-slate-700',
    bg: 'bg-slate-50 border-slate-200'
  };

  const parsedDocs: Array<{ name: string; url: string }> = (() => {
    try {
      if (project.documents) {
        return JSON.parse(project.documents);
      }
    } catch (e) {
      // not json
    }
    return [];
  })();

  const utilizationRate = project.sanctionedAmountCr > 0
    ? Math.round((project.utilizedAmountCr / project.sanctionedAmountCr) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-2xl bg-white shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="bg-[#18327b] text-white p-6 border-b border-blue-900/40 flex items-start justify-between">
          <div className="space-y-1.5 pr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-900 text-xs font-black tracking-wide">
                {project.referenceId}
              </span>
              <button
                onClick={handleCopyId}
                className="text-blue-200 hover:text-white p-1 rounded transition"
                title="Copy ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${stageInfo.bg} ${stageInfo.color}`}>
                {language === 'hi' ? stageInfo.hi : stageInfo.en}
              </span>
            </div>

            <h2 className="text-lg font-bold text-white leading-snug font-serif mt-2">
              {project.commitment}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(project)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                title="Edit Record"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {onDelete && (!currentUser || currentUser.role !== 'READONLY') && (
              <button
                onClick={() => onDelete(project)}
                className="p-2 rounded-lg bg-red-500/20 hover:bg-red-600 text-red-200 hover:text-white transition"
                title={language === 'hi' ? 'परियोजना हटाएं (Delete)' : 'Delete Project Record'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          
          {/* Key 1: Department & Source */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {language === 'hi' ? 'विभाग (Department)' : 'Department'}
                </span>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <Building className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span>{project.department}</span>
                </div>
              </div>

              <div className="space-y-1 text-right">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {language === 'hi' ? 'घोषणा स्रोत (Source)' : 'Source'}
                </span>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  <span>{project.source}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key 2: Physical Verified Progress */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {language === 'hi' ? 'सत्यापित भौतिक प्रगति (Verified Progress)' : 'Verified Physical Progress'}
                </span>
              </div>
              <span className="text-xl font-black text-slate-900 font-mono">
                {project.verifiedProgress}%
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  project.verifiedProgress >= 80
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600'
                    : project.verifiedProgress >= 40
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                    : 'bg-gradient-to-r from-rose-500 to-red-600'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, project.verifiedProgress))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>{language === 'hi' ? 'प्रारंभ (0%)' : 'Start (0%)'}</span>
              <span>{language === 'hi' ? 'वर्तमान स्तर: ' + project.verifiedProgress + '%' : 'Current: ' + project.verifiedProgress + '%'}</span>
              <span>{language === 'hi' ? 'पूर्ण (100%)' : 'Target (100%)'}</span>
            </div>
          </div>

          {/* Key 3: Financial Status & Budget */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              <span>{language === 'hi' ? 'वित्तीय स्थिति एवं व्यय (Financial Status)' : 'Financial Status & Expenditure'}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-100">
                <div className="text-[11px] font-semibold text-emerald-800">
                  {language === 'hi' ? 'स्वीकृत राशि (Sanctioned)' : 'Sanctioned Budget'}
                </div>
                <div className="text-lg font-black text-emerald-950 font-mono mt-0.5">
                  ₹{project.sanctionedAmountCr.toLocaleString('en-IN')} Cr
                </div>
              </div>

              <div className="bg-blue-50/60 p-3 rounded-lg border border-blue-100">
                <div className="text-[11px] font-semibold text-blue-800">
                  {language === 'hi' ? 'व्यय राशि (Utilized)' : 'Utilized Funds'}
                </div>
                <div className="text-lg font-black text-blue-950 font-mono mt-0.5">
                  ₹{project.utilizedAmountCr.toLocaleString('en-IN')} Cr
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 font-mono">
              {project.financialStatus}
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>{language === 'hi' ? 'कुल निधि उपयोगिता दर:' : 'Fund Utilization Rate:'}</span>
              <span className="font-bold text-slate-900">{utilizationRate}%</span>
            </div>
          </div>

          {/* Key 4: Location & Beneficiaries */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>{language === 'hi' ? 'स्थान एवं लक्षित लाभार्थी (Location & Beneficiaries)' : 'Location & Beneficiaries'}</span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-slate-900">{project.location}</span>
                  {project.districtName && (
                    <span className="ml-2 text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                      {project.districtName} जिला
                    </span>
                  )}
                </div>
              </div>

              {project.beneficiaries && (
                <div className="flex items-start gap-2 text-slate-700">
                  <Users className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">{project.beneficiaries}</span>
                </div>
              )}
            </div>
          </div>

          {/* Key 5: Next Milestone & Target Date */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              <span>{language === 'hi' ? 'अगला माइलस्टोन (Next Milestone)' : 'Next Milestone'}</span>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-bold text-slate-900">
                {project.nextMilestone}
              </div>
              {project.nextMilestoneDate && (
                <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md w-fit">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {language === 'hi' ? 'लक्ष्य तिथि: ' : 'Target Date: '}
                    {new Date(project.nextMilestoneDate).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Key 6: Delay or Obstacle */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
              <AlertTriangle className={`w-4 h-4 ${project.isDelayed ? 'text-rose-500' : 'text-emerald-500'}`} />
              <span>{language === 'hi' ? 'विलंब या बाधा (Delay or Obstacle)' : 'Delay or Obstacle'}</span>
            </div>

            {project.isDelayed ? (
              <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-lg space-y-1">
                <div className="flex items-center gap-2 text-rose-800 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>{language === 'hi' ? 'समीक्षा में विलंब चिन्हित' : 'Delay Identified in Review'}</span>
                </div>
                <p className="text-xs text-rose-700 leading-relaxed pl-6">
                  {project.delayOrObstacle || (language === 'hi' ? 'बाधा का विवरण प्रक्रियाधीन है।' : 'Details under review.')}
                </p>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  {project.delayOrObstacle || (language === 'hi' ? 'कोई विलंब नहीं — कार्य निर्धारित समय-सारिणी अनुसार प्रगति पर है।' : 'No obstacles — progress is on schedule.')}
                </span>
              </div>
            )}
          </div>

          {/* Key 7: Communication Status */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
              <Send className="w-4 h-4 text-indigo-600" />
              <span>{language === 'hi' ? 'पत्राचार एवं संचार स्थिति (Communication Status)' : 'Communication Status'}</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-800">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>{project.communicationStatus}</span>
            </div>
          </div>

          {/* Key 8: Documents & Reports */}
          {parsedDocs.length > 0 && (
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>{language === 'hi' ? 'संलग्न प्रतिवेदन एवं दस्तावेज' : 'Attached Reports & Documents'}</span>
              </div>

              <div className="space-y-2">
                {parsedDocs.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-xs transition"
                  >
                    <div className="flex items-center gap-2 text-slate-800 font-medium truncate">
                      <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{doc.name}</span>
                    </div>
                    <span className="text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer flex-shrink-0 ml-2">
                      {language === 'hi' ? 'डाउनलोड' : 'Download'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            {language === 'hi' ? 'अंतिम अद्यतन: ' : 'Last Updated: '}
            {new Date(project.updatedAt).toLocaleDateString()}
          </div>

          <div className="flex items-center gap-2">
            {onDelete && (!currentUser || currentUser.role !== 'READONLY') && (
              <button
                onClick={() => onDelete(project)}
                className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 border border-red-200 font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'परियोजना हटाएं' : 'Delete Project'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
            >
              {language === 'hi' ? 'बंद करें' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
