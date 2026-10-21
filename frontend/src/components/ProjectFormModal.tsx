import React, { useState, useEffect } from 'react';
import {
  X,
  Building,
  MapPin,
  Users,
  IndianRupee,
  Clock,
  AlertTriangle,
  FileText,
  Sparkles,
  Send,
  Save,
  CheckCircle2
} from 'lucide-react';
import { ProjectAnnouncement, District } from '../types';
import { BIHAR_48_DEPARTMENTS } from '../data/biharDepartments';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ProjectAnnouncement>) => Promise<void>;
  initialData?: ProjectAnnouncement | null;
  districts?: District[];
  language: 'hi' | 'en';
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  districts = [],
  language
}) => {
  const [formData, setFormData] = useState({
    referenceId: '',
    department: 'Road Construction (पथ निर्माण विभाग)',
    commitment: '',
    location: '',
    beneficiaries: '',
    districtName: '',
    sanctionedAmountCr: 0,
    utilizedAmountCr: 0,
    financialStatus: '',
    currentStage: 'UNDER_CONSTRUCTION' as any,
    verifiedProgress: 0,
    nextMilestone: '',
    nextMilestoneDate: '',
    delayOrObstacle: '',
    isDelayed: false,
    source: "Hon'ble CM Announcement (माननीय मुख्यमंत्री घोषणा)",
    communicationStatus: 'ACTION_INITIATED (कार्रवाई प्रारंभ)'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        referenceId: initialData.referenceId || '',
        department: initialData.department || 'Road Construction (पथ निर्माण विभाग)',
        commitment: initialData.commitment || '',
        location: initialData.location || '',
        beneficiaries: initialData.beneficiaries || '',
        districtName: initialData.districtName || '',
        sanctionedAmountCr: initialData.sanctionedAmountCr || 0,
        utilizedAmountCr: initialData.utilizedAmountCr || 0,
        financialStatus: initialData.financialStatus || '',
        currentStage: initialData.currentStage || 'UNDER_CONSTRUCTION',
        verifiedProgress: initialData.verifiedProgress || 0,
        nextMilestone: initialData.nextMilestone || '',
        nextMilestoneDate: initialData.nextMilestoneDate
          ? new Date(initialData.nextMilestoneDate).toISOString().split('T')[0]
          : '',
        delayOrObstacle: initialData.delayOrObstacle || '',
        isDelayed: Boolean(initialData.isDelayed),
        source: initialData.source || "Hon'ble CM Announcement (माननीय मुख्यमंत्री घोषणा)",
        communicationStatus: initialData.communicationStatus || 'ACTION_INITIATED (कार्रवाई प्रारंभ)'
      });
    } else {
      setFormData({
        referenceId: `BHR-ANNC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        department: 'Road Construction (पथ निर्माण विभाग)',
        commitment: '',
        location: '',
        beneficiaries: '',
        districtName: '',
        sanctionedAmountCr: 0,
        utilizedAmountCr: 0,
        financialStatus: '',
        currentStage: 'UNDER_CONSTRUCTION',
        verifiedProgress: 0,
        nextMilestone: '',
        nextMilestoneDate: '',
        delayOrObstacle: '',
        isDelayed: false,
        source: "Hon'ble CM Announcement (माननीय मुख्यमंत्री घोषणा)",
        communicationStatus: 'ACTION_INITIATED (कार्रवाई प्रारंभ)'
      });
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.commitment.trim() || !formData.location.trim()) {
      setError(language === 'hi' ? 'कृपया प्रतिबद्धता और स्थान दर्ज करें।' : 'Please fill in commitment and location.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const finStatus = formData.financialStatus ||
        `Sanctioned: ₹${formData.sanctionedAmountCr} Cr | Utilized: ₹${formData.utilizedAmountCr} Cr`;

      await onSubmit({
        ...formData,
        financialStatus: finStatus,
        sanctionedAmountCr: Number(formData.sanctionedAmountCr) || 0,
        utilizedAmountCr: Number(formData.utilizedAmountCr) || 0,
        verifiedProgress: Number(formData.verifiedProgress) || 0,
        nextMilestoneDate: formData.nextMilestoneDate ? new Date(formData.nextMilestoneDate).toISOString() : null
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const departmentsList = BIHAR_48_DEPARTMENTS.map((department) => {
    const englishName = department.nameEn.replace(/ Department$/, '');
    return {
      id: department.id,
      value: `${englishName} (${department.nameHi})`,
      label: language === 'hi'
        ? `${department.nameHi} (${englishName})`
        : `${englishName} (${department.nameHi})`
    };
  });

  return (
    <div className="fixed inset-x-0 bottom-0 top-16 sm:top-[70px] z-40 overflow-hidden bg-white">
      <div className="relative bg-white w-full h-full overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-[#18327b] text-white p-5 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white/10">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif leading-none">
                {initialData
                  ? (language === 'hi' ? 'घोषणा / परियोजना विवरण संपादित करें' : 'Edit Announcement / Project')
                  : (language === 'hi' ? 'नई घोषणा / परियोजना प्रविष्टि' : 'New Announcement / Project Entry')}
              </h2>
              <div className="text-xs text-blue-200 mt-1">
                {language === 'hi' ? 'संदर्भ आईडी: ' : 'Reference ID: '}
                <span className="font-mono font-bold text-amber-300">{formData.referenceId}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Reference ID & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'संदर्भ आईडी (Reference ID)' : 'Reference ID'} *
              </label>
              <input
                type="text"
                value={formData.referenceId}
                onChange={(e) => setFormData({ ...formData, referenceId: e.target.value })}
                required
                className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-8">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'विभाग (Department)' : 'Department'} *
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
              >
                {departmentsList.map((department) => (
                  <option key={department.id} value={department.value}>{department.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Commitment / Announcement Statement */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'प्रतिबद्धता / घोषणा विवरण (Commitment)' : 'Commitment / Announcement'} *
            </label>
            <textarea
              rows={2}
              value={formData.commitment}
              onChange={(e) => setFormData({ ...formData, commitment: e.target.value })}
              placeholder={language === 'hi' ? 'योजना या घोषणा का पूर्ण विवरण दर्ज करें...' : 'Enter announcement commitment details...'}
              required
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* 3. Location, Beneficiaries & District */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'स्थान (Location)' : 'Location'} *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Danapur - Bihta Section"
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'जिला (District)' : 'District'}
              </label>
              <input
                type="text"
                value={formData.districtName}
                onChange={(e) => setFormData({ ...formData, districtName: e.target.value })}
                placeholder="e.g. Patna, Gaya, Muzaffarpur"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'लक्षित लाभार्थी (Beneficiaries)' : 'Beneficiaries'}
              </label>
              <input
                type="text"
                value={formData.beneficiaries}
                onChange={(e) => setFormData({ ...formData, beneficiaries: e.target.value })}
                placeholder="e.g. 25,00,000 citizens"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 4. Financial Status */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {language === 'hi' ? 'वित्तीय स्थिति (Financial Status)' : 'Financial Status'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'स्वीकृत राशि (₹ Cr)' : 'Sanctioned Budget (₹ Cr)'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.sanctionedAmountCr}
                  onChange={(e) => setFormData({ ...formData, sanctionedAmountCr: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'व्यय राशि (₹ Cr)' : 'Utilized Funds (₹ Cr)'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.utilizedAmountCr}
                  onChange={(e) => setFormData({ ...formData, utilizedAmountCr: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                />
              </div>
            </div>
          </div>

          {/* 5. Current Stage & Verified Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'वर्तमान चरण (Current Stage)' : 'Current Stage'} *
              </label>
              <select
                value={formData.currentStage}
                onChange={(e) => setFormData({ ...formData, currentStage: e.target.value as any })}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              >
                <option value="PLANNING">PLANNING (नियोजन एवं डीपीआर)</option>
                <option value="TENDERING">TENDERING (निविदा प्रक्रिया)</option>
                <option value="UNDER_CONSTRUCTION">UNDER CONSTRUCTION (प्रगतिशील निर्माण)</option>
                <option value="COMMISSIONED">COMMISSIONED (परीक्षण / चालू)</option>
                <option value="OPERATIONAL">OPERATIONAL (पूर्ण एवं संचालित)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>{language === 'hi' ? 'सत्यापित भौतिक प्रगति (%)' : 'Verified Progress (%)'}</span>
                <span className="font-mono text-amber-600 font-bold">{formData.verifiedProgress}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.verifiedProgress}
                onChange={(e) => setFormData({ ...formData, verifiedProgress: parseInt(e.target.value, 10) || 0 })}
                className="w-full accent-amber-500 mt-2"
              />
            </div>
          </div>

          {/* 6. Next Milestone & Target Date */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'अगला माइलस्टोन (Next Milestone)' : 'Next Milestone'} *
              </label>
              <input
                type="text"
                value={formData.nextMilestone}
                onChange={(e) => setFormData({ ...formData, nextMilestone: e.target.value })}
                placeholder="e.g. Pier capping and girder launching on span 8-12"
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'लक्ष्य तिथि (Target Date)' : 'Target Date'}
              </label>
              <input
                type="date"
                value={formData.nextMilestoneDate}
                onChange={(e) => setFormData({ ...formData, nextMilestoneDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 7. Delay or Obstacle */}
          <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDelayed}
                  onChange={(e) => setFormData({ ...formData, isDelayed: e.target.checked })}
                  className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <span className={formData.isDelayed ? 'text-rose-700 font-black' : 'text-slate-700'}>
                  {language === 'hi' ? 'कार्य में विलंब या बाधा चिन्हित है' : 'Work is Delayed / Bottleneck Encountered'}
                </span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                {language === 'hi' ? 'विलंब या बाधा का विवरण (Delay or Obstacle)' : 'Obstacle Description'}
              </label>
              <input
                type="text"
                value={formData.delayOrObstacle}
                onChange={(e) => setFormData({ ...formData, delayOrObstacle: e.target.value })}
                placeholder={language === 'hi' ? 'उदा. भूमि अधिग्रहण प्रक्रियाधीन / अनापत्ति प्रमाण-पत्र प्रतीक्षित' : 'e.g. Utility shifting or NOC pending'}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              />
            </div>
          </div>

          {/* 8. Source & Communication Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'घोषणा स्रोत (Source)' : 'Source'} *
              </label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
              >
                <option value="Hon'ble CM Announcement (माननीय मुख्यमंत्री घोषणा)">Hon'ble CM Announcement (माननीय मुख्यमंत्री घोषणा)</option>
                <option value="Cabinet Decision (मंत्रिमंडल निर्णय)">Cabinet Decision (मंत्रिमंडल निर्णय)</option>
                <option value="Budget Speech (बजट अभिभाषण)">Budget Speech (बजट अभिभाषण)</option>
                <option value="Pragati Review Meeting (समीक्षा बैठक)">Pragati Review Meeting (समीक्षा बैठक)</option>
                <option value="Jan Samvad / Public Initiative (जन संवाद)">Jan Samvad / Public Initiative (जन संवाद)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'पत्राचार एवं संचार स्थिति (Communication Status)' : 'Communication Status'} *
              </label>
              <select
                value={formData.communicationStatus}
                onChange={(e) => setFormData({ ...formData, communicationStatus: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
              >
                <option value="COMPLIANCE_VERIFIED (सत्यापित एवं अनुपालन पूर्ण)">COMPLIANCE_VERIFIED (सत्यापित एवं अनुपालन पूर्ण)</option>
                <option value="ACTION_INITIATED (कार्रवाई प्रारंभ)">ACTION_INITIATED (कार्रवाई प्रारंभ)</option>
                <option value="QUERY_RAISED (स्पष्टीकरण मांगा गया)">QUERY_RAISED (स्पष्टीकरण मांगा गया)</option>
                <option value="PENDING_REVIEW (समीक्षा लंबित)">PENDING_REVIEW (समीक्षा लंबित)</option>
              </select>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
            >
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#18327b] to-[#12245b] text-white font-bold text-xs hover:from-blue-900 hover:to-indigo-950 transition shadow-md active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>
                {isSubmitting
                  ? (language === 'hi' ? 'सुरक्षित किया जा रहा है...' : 'Saving...')
                  : (language === 'hi' ? 'रिकॉर्ड सुरक्षित करें' : 'Save Record')}
              </span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
