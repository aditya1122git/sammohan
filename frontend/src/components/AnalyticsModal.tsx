import React, { useEffect, useMemo, useState } from 'react';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { AlertTriangle, BarChart3, Building2, CheckCircle2, Database, Download, IndianRupee, MapPin, Search, TrendingUp, X } from 'lucide-react';
import { api } from '../services/api';
import { ProjectAnnouncement, ProjectStats } from '../types';
import { FullPageWorkspace } from './FullPageWorkspace';

ChartJS.register(ArcElement, BarElement, CategoryScale, Legend, LinearScale, Tooltip);

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'hi' | 'en';
}

type AnalyticsTab = 'overview' | 'departments' | 'districts' | 'projects';

const stageLabels: Record<string, string> = {
  PLANNING: 'Planning / DPR',
  TENDERING: 'Tendering',
  UNDER_CONSTRUCTION: 'Under Construction',
  COMMISSIONED: 'Commissioned',
  OPERATIONAL: 'Operational'
};

const formatCrore = (value: number) => `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })} Cr`;

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose, language }) => {
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [projects, setProjects] = useState<ProjectAnnouncement[]>([]);
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const loadProjectAnalytics = async () => {
      setLoading(true);
      setError('');
      try {
        const [statsResponse, projectsResponse] = await Promise.all([
          api.getProjectStats(),
          api.getProjects({ limit: 1000 })
        ]);
        setStats(statsResponse.stats);
        setProjects(projectsResponse.projects || []);
      } catch (err: any) {
        setError(err.message || 'Unable to load project analytics.');
      } finally {
        setLoading(false);
      }
    };
    loadProjectAnalytics();
  }, [isOpen]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((project) =>
      [project.referenceId, project.department, project.commitment, project.districtName, project.location]
        .some((value) => String(value || '').toLowerCase().includes(query))
    );
  }, [projects, search]);

  const utilizationRate = stats?.totalSanctionedCr
    ? Math.round((stats.totalUtilizedCr / stats.totalSanctionedCr) * 100)
    : 0;

  const stageChartData = {
    labels: Object.keys(stageLabels).map((key) => stageLabels[key]),
    datasets: [{
      data: Object.keys(stageLabels).map((key) => stats?.stageBreakdown?.[key] || 0),
      backgroundColor: ['#f59e0b', '#0ea5e9', '#4f46e5', '#10b981', '#047857'],
      borderColor: '#ffffff',
      borderWidth: 3,
      hoverOffset: 8
    }]
  };

  const topDepartments = (stats?.departmentBreakdown || []).slice(0, 10);
  const departmentProjectChart = {
    labels: topDepartments.map((item) => item.name),
    datasets: [{ label: 'Projects', data: topDepartments.map((item) => item.count), backgroundColor: '#1C4D8D', borderRadius: 7 }]
  };
  const departmentBudgetChart = {
    labels: topDepartments.map((item) => item.name),
    datasets: [
      { label: 'Sanctioned (₹ Cr)', data: topDepartments.map((item) => item.sanctionedCr), backgroundColor: '#1C4D8D', borderRadius: 6 },
      { label: 'Utilized (₹ Cr)', data: topDepartments.map((item) => item.utilizedCr), backgroundColor: '#f59e0b', borderRadius: 6 }
    ]
  };
  const topDistricts = (stats?.districtBreakdown || []).slice(0, 12);
  const districtChart = {
    labels: topDistricts.map((item) => item.name),
    datasets: [{ label: 'Projects', data: topDistricts.map((item) => item.count), backgroundColor: '#C35504', borderRadius: 7 }]
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 16, font: { family: 'Poppins', size: 10 } } },
      tooltip: { backgroundColor: '#0f172a', padding: 12, titleFont: { family: 'Poppins' }, bodyFont: { family: 'Poppins' } }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'Poppins', size: 9 }, maxRotation: 35 } },
      y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.18)' }, ticks: { precision: 0, font: { family: 'Poppins', size: 10 } } }
    }
  };

  const exportProjectsCsv = () => {
    const rows = [
      ['Reference ID', 'Department', 'Project', 'District', 'Stage', 'Progress %', 'Sanctioned Cr', 'Utilized Cr', 'Delayed'],
      ...filteredProjects.map((project) => [project.referenceId, project.department, project.commitment, project.districtName || project.location, stageLabels[project.currentStage] || project.currentStage, project.verifiedProgress, project.sanctionedAmountCr, project.utilizedAmountCr, project.isDelayed ? 'Yes' : 'No'])
    ];
    const csv = rows.map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `sammohan-project-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  const tabs: Array<{ id: AnalyticsTab; label: string; icon: React.ReactNode }> = [
    { id: 'overview', label: language === 'hi' ? 'समग्र अवलोकन' : 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'departments', label: language === 'hi' ? 'विभागवार प्रदर्शन' : 'Department Performance', icon: <Building2 className="h-4 w-4" /> },
    { id: 'districts', label: language === 'hi' ? 'जिलावार परियोजनाएं' : 'District Projects', icon: <MapPin className="h-4 w-4" /> },
    { id: 'projects', label: language === 'hi' ? 'परियोजना प्रगति' : 'Project Progress', icon: <TrendingUp className="h-4 w-4" /> }
  ];

  return (
    <FullPageWorkspace>
      <div className="flex h-full w-full flex-col overflow-hidden bg-white">
        <header className="flex flex-shrink-0 items-center justify-between gap-4 bg-[#1C4D8D] px-5 py-4 text-white sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setActiveTab('overview')} className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-orange-400 bg-[#C35504] shadow-md hover:bg-orange-700" aria-label="Open analytics overview">
              <Database className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold">{language === 'hi' ? 'परियोजना एवं बजट एनालिटिक्स' : 'Project and Budget Analytics'}</h3>
              <p className="text-xs text-blue-200">{language === 'hi' ? '48 विभागों एवं 38 जिलों में परियोजना, बजट, प्रगति और माइलस्टोन की लाइव जानकारी' : 'Live project, budget, progress and milestone insights across 48 departments and 38 districts'}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 transition hover:bg-white/20" aria-label="Close analytics"><X className="h-5 w-5" /></button>
        </header>

        <section className="flex-shrink-0 border-b border-slate-200 bg-slate-50 p-4 sm:p-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
            {[
              { label: 'Total Projects', value: stats?.totalAnnouncements ?? 0, tone: 'text-[#1C4D8D]', icon: <Database className="h-4 w-4" /> },
              { label: 'Ongoing', value: stats?.ongoingProjects ?? 0, tone: 'text-indigo-700', icon: <TrendingUp className="h-4 w-4" /> },
              { label: 'Completed', value: stats?.completedProjects ?? 0, tone: 'text-emerald-700', icon: <CheckCircle2 className="h-4 w-4" /> },
              { label: 'Delayed', value: stats?.delayedProjects ?? 0, tone: 'text-rose-700', icon: <AlertTriangle className="h-4 w-4" /> },
              { label: 'Sanctioned', value: formatCrore(stats?.totalSanctionedCr ?? 0), tone: 'text-[#1C4D8D]', icon: <IndianRupee className="h-4 w-4" /> },
              { label: 'Utilized', value: formatCrore(stats?.totalUtilizedCr ?? 0), tone: 'text-amber-700', icon: <IndianRupee className="h-4 w-4" /> },
              { label: 'Fund Utilization', value: `${utilizationRate}%`, tone: 'text-violet-700', icon: <BarChart3 className="h-4 w-4" /> },
              { label: 'Avg. Progress', value: `${stats?.avgProgress ?? 0}%`, tone: 'text-cyan-700', icon: <TrendingUp className="h-4 w-4" /> }
            ].map((metric) => (
              <div key={metric.label} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase ${metric.tone}`}>{metric.icon}<span>{metric.label}</span></div>
                <div className={`mt-1 text-lg font-black ${metric.tone}`}>{metric.value}</div>
              </div>
            ))}
          </div>
        </section>

        <nav className="flex flex-shrink-0 items-center justify-between gap-3 overflow-x-auto border-b border-slate-200 bg-white px-4 pt-3 sm:px-6">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 pb-2 text-xs font-bold transition ${activeTab === tab.id ? 'border-[#C35504] text-[#C35504]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>{tab.icon}{tab.label}</button>
            ))}
          </div>
          <button type="button" onClick={exportProjectsCsv} className="mb-2 flex items-center gap-1.5 whitespace-nowrap text-xs font-bold text-[#1C4D8D] hover:underline"><Download className="h-4 w-4" />{language === 'hi' ? 'प्रोजेक्ट CSV डाउनलोड करें' : 'Download Project CSV'}</button>
        </nav>

        <main className="flex-grow overflow-y-auto overscroll-contain bg-slate-50 p-4 text-xs sm:p-6">
          {loading && <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 text-center font-bold text-[#1C4D8D]">Loading project analytics...</div>}
          {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">{error}</div>}

          {!loading && !error && activeTab === 'overview' && (
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h4 className="text-sm font-bold text-slate-900">Project Stage Distribution</h4><p className="mt-1 text-[11px] text-slate-500">Current delivery stage of all registered projects</p>
                <div className="mt-4 h-72"><Doughnut data={stageChartData} options={{ ...chartOptions, cutout: '66%', scales: undefined }} /></div>
              </section>
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
                <h4 className="text-sm font-bold text-slate-900">Top Departments by Project Count</h4><p className="mt-1 text-[11px] text-slate-500">Departments with the highest number of tracked projects</p>
                <div className="mt-4 h-72"><Bar data={departmentProjectChart} options={chartOptions} /></div>
              </section>
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
                <h4 className="text-sm font-bold text-slate-900">Department Budget Utilization</h4><p className="mt-1 text-[11px] text-slate-500">Sanctioned and utilized funds for leading departments</p>
                <div className="mt-4 h-80"><Bar data={departmentBudgetChart} options={chartOptions} /></div>
              </section>
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h4 className="text-sm font-bold text-slate-900">Top Project Districts</h4><p className="mt-1 text-[11px] text-slate-500">Districts with the largest project footprint</p>
                <div className="mt-4 h-80"><Bar data={districtChart} options={chartOptions} /></div>
              </section>
            </div>
          )}

          {!loading && !error && activeTab === 'departments' && (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="w-full min-w-[760px] text-left">
              <thead className="border-b bg-slate-100 font-bold uppercase text-slate-700"><tr><th className="px-4 py-3">Department</th><th className="px-4 py-3 text-center">Projects</th><th className="px-4 py-3 text-right">Sanctioned</th><th className="px-4 py-3 text-right">Utilized</th><th className="px-4 py-3 text-right">Utilization</th></tr></thead>
              <tbody className="divide-y divide-slate-100">{(stats?.departmentBreakdown || []).map((department) => {
                const rate = department.sanctionedCr ? Math.round((department.utilizedCr / department.sanctionedCr) * 100) : 0;
                return <tr key={department.name} className="hover:bg-blue-50/40"><td className="px-4 py-3 font-bold text-[#1C4D8D]">{department.name}</td><td className="px-4 py-3 text-center font-bold">{department.count}</td><td className="px-4 py-3 text-right">{formatCrore(department.sanctionedCr)}</td><td className="px-4 py-3 text-right font-semibold text-amber-700">{formatCrore(department.utilizedCr)}</td><td className="px-4 py-3 text-right"><span className="rounded-full bg-emerald-50 px-2.5 py-1 font-bold text-emerald-700">{rate}%</span></td></tr>;
              })}</tbody>
            </table></div>
          )}

          {!loading && !error && activeTab === 'districts' && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{(stats?.districtBreakdown || []).map((district, index) => (
              <div key={district.name} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div><div className="text-[10px] font-bold uppercase text-slate-400">District #{index + 1}</div><div className="mt-1 font-bold text-slate-900">{district.name}</div></div><div className="rounded-xl bg-blue-50 px-3 py-2 text-center text-[#1C4D8D]"><div className="text-lg font-black">{district.count}</div><div className="text-[9px] font-bold uppercase">Projects</div></div></div>
            ))}</div>
          )}

          {!loading && !error && activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div className="relative w-full max-w-md"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search reference, department, project or district..." className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-[#1C4D8D]" /></div><div className="font-semibold text-slate-500">Showing {filteredProjects.length} projects</div></div>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="w-full min-w-[1050px] text-left">
                <thead className="border-b bg-slate-100 font-bold uppercase text-slate-700"><tr><th className="px-3 py-3">Reference</th><th className="px-3 py-3">Department / Project</th><th className="px-3 py-3">District</th><th className="px-3 py-3">Stage</th><th className="px-3 py-3 text-center">Progress</th><th className="px-3 py-3 text-right">Budget</th><th className="px-3 py-3 text-center">Status</th></tr></thead>
                <tbody className="divide-y divide-slate-100">{filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-blue-50/40"><td className="px-3 py-3 font-mono font-bold text-[#1C4D8D]">{project.referenceId}</td><td className="max-w-sm px-3 py-3"><div className="font-bold text-slate-900">{project.department}</div><div className="mt-0.5 truncate text-slate-500">{project.commitment}</div></td><td className="px-3 py-3">{project.districtName || project.location}</td><td className="px-3 py-3 font-semibold">{stageLabels[project.currentStage] || project.currentStage}</td><td className="px-3 py-3 text-center"><span className="font-bold text-indigo-700">{project.verifiedProgress}%</span></td><td className="px-3 py-3 text-right">{formatCrore(project.sanctionedAmountCr)}</td><td className="px-3 py-3 text-center">{project.isDelayed ? <span className="rounded-full bg-rose-100 px-2 py-1 font-bold text-rose-700">Delayed</span> : <span className="rounded-full bg-emerald-100 px-2 py-1 font-bold text-emerald-700">On Track</span>}</td></tr>
                ))}</tbody>
              </table></div>
            </div>
          )}
        </main>
      </div>
    </FullPageWorkspace>
  );
};
