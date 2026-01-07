import React, { useState } from 'react';
import {
  LayoutDashboard,
  PieChart,
  Files,
  ShieldCheck,
  Gavel,
  Settings,
  Search,
  Bell,
  MessageSquare,
  Landmark,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  MoreHorizontal,
  Filter,
  Bot,
  FileText,
  Menu,
  X,
  UploadCloud,
  File as FileIcon,
  Trash2,
  Image as ImageIcon,
  Info,
  Lock,
  ChevronRight,
  Plus
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// --- Types ---
type ViewState = 'dashboard' | 'vault' | 'upload';

export interface Doc {
  name: string;
  type: 'PDF' | 'DOCX' | 'XLSX' | 'File';
  size: string;
  status: string;
  date: string;
}

export interface QueueItem {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'ready' | 'error';
  errorMessage?: string;
}

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  iconColorClass: string;
  badge?: string;
  badgeColorClass?: string;
}

interface AlertItemProps {
  title: string;
  time: string;
  subtitle: string;
  icon: React.ReactNode;
  colorClass: string;
}

// --- Mock Data ---
const CHART_DATA = [
  { month: 'MAY', score: 30 },
  { month: 'JUN', score: 45 },
  { month: 'JUL', score: 48 },
  { month: 'AUG', score: 60 },
  { month: 'SEP', score: 92 },
  { month: 'OCT', score: 94 },
];

const LOANS_DATA = [
  { id: '#LN-884-X', counterparty: 'Omega Holdings', initial: 'O', initialColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', risk: 'Critical', riskColor: 'text-accent-red bg-accent-red/10 border-accent-red/20', deadline: 'Oct 26, 2023' },
  { id: '#LN-901-A', counterparty: 'Vertex Global', initial: 'V', initialColor: 'text-accent-orange bg-accent-orange/10 border-accent-orange/20', risk: 'Review', riskColor: 'text-accent-orange bg-accent-orange/10 border-accent-orange/20', deadline: 'Oct 28, 2023' },
  { id: '#LN-102-B', counterparty: 'Apex Partners', initial: 'A', initialColor: 'text-primary bg-primary/10 border-primary/20', risk: 'Safe', riskColor: 'text-primary bg-primary/10 border-primary/20', deadline: 'Nov 02, 2023' },
];

const INITIAL_VAULT_DOCS: Doc[] = [
  { name: 'LMA_Facility_Agreement_v2.pdf', type: 'PDF', size: '2.4 MB', status: 'Analyzed', date: 'Today, 10:23 AM' },
  { name: 'Syndicated_Loan_Term_Sheet.docx', type: 'DOCX', size: '1.8 MB', status: 'Pending', date: 'Yesterday, 4:15 PM' },
  { name: 'Omega_Holdings_Financials_Q3.xlsx', type: 'XLSX', size: '4.2 MB', status: 'Analyzed', date: 'Oct 24, 2023' },
  { name: 'Legal_Opinion_Letter_Draft.pdf', type: 'PDF', size: '850 KB', status: 'Review', date: 'Oct 22, 2023' },
];

// --- Components ---

const Sidebar = ({ isOpen, setIsOpen, currentView, setView }: { isOpen: boolean; setIsOpen: (v: boolean) => void, currentView: ViewState, setView: (v: ViewState) => void }) => {
  const navItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'analytics', icon: <PieChart size={20} />, label: 'Portfolio Analytics' },
    { id: 'vault', icon: <Files size={20} />, label: 'Document Vault' },
    { id: 'compliance', icon: <ShieldCheck size={20} />, label: 'Compliance' },
    { id: 'regulations', icon: <Gavel size={20} />, label: 'Regulations' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        flex w-72 flex-col border-r border-border bg-background transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Area */}
        <div className="flex h-20 items-center gap-3 px-8 border-b border-border/50">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary shadow-glow-sm">
            <div className="h-4 w-4 bg-black rounded-sm transform rotate-45" />
          </div>
          <h1 className="text-xl font-display font-bold tracking-tight text-white">LMA DocPulse</h1>
          <button className="ml-auto lg:hidden" onClick={() => setIsOpen(false)}>
            <X size={20} className="text-text-muted" />
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex flex-1 flex-col justify-between overflow-y-auto py-8 custom-scrollbar">
          <div className="flex flex-col gap-8">
            <nav className="flex flex-col gap-1 px-4">
              <p className="mb-3 px-4 text-[11px] font-bold uppercase tracking-widest text-text-muted">Overview</p>
              {navItems.map((item, idx) => {
                const isActive = (item.id === 'dashboard' && currentView === 'dashboard') ||
                  (item.id === 'vault' && (currentView === 'vault' || currentView === 'upload'));

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (item.id === 'dashboard') setView('dashboard');
                      if (item.id === 'vault') setView('vault');
                    }}
                    className={`flex w-full items-center gap-3 rounded-r-lg px-4 py-3 text-sm font-medium transition-all duration-200 border-l-[3px]
                      ${isActive
                        ? 'bg-primary-dim text-primary border-primary'
                        : 'border-transparent text-text-muted hover:bg-surface-highlight hover:text-white'
                      }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <nav className="flex flex-col gap-1 px-4">
              <p className="mb-3 px-4 text-[11px] font-bold uppercase tracking-widest text-text-muted">Settings</p>
              <a href="#" className="flex items-center gap-3 rounded-r-lg px-4 py-3 text-sm font-medium text-text-muted hover:bg-surface-highlight hover:text-white transition-all border-l-[3px] border-transparent">
                <Settings size={20} />
                Configuration
              </a>
            </nav>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-6 border-t border-border/50">
          <div className="flex items-center gap-3 rounded-xl bg-surface border border-border p-3 hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="relative">
              <img
                src="https://picsum.photos/100/100"
                alt="User"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-border group-hover:ring-primary transition-all"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-primary border-2 border-surface"></span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-bold text-white font-display">Alex Morgan</span>
              <span className="truncate text-xs text-text-muted">Senior Analyst</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const Header = ({ onMenuClick, title = "Dashboard", subtitle = "Welcome back, here's what's happening today." }: { onMenuClick: () => void, title?: string, subtitle?: string }) => {
  return (
    <header className="flex h-20 items-center justify-between px-6 lg:px-8 z-20 border-b border-border/30 lg:border-none shrink-0">
      <div className="flex items-center gap-4 lg:hidden">
        <button onClick={onMenuClick} className="text-white hover:text-primary transition-colors">
          <Menu size={24} />
        </button>
        <span className="text-lg font-bold font-display tracking-tight">LMA DocPulse</span>
      </div>

      <div className="hidden lg:flex flex-col justify-center">
        <h2 className="text-2xl font-bold font-display text-white tracking-tight">{title}</h2>
        <p className="text-xs text-text-muted">{subtitle}</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden w-80 lg:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            className="h-10 w-full rounded-full border border-border bg-surface/50 pl-10 pr-4 text-sm text-white placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner"
            placeholder="Search loans, documents..."
          />
        </div>

        <div className="flex items-center gap-3 border-l border-border/50 pl-6">
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/50 text-text-muted hover:text-primary hover:border-primary hover:bg-primary-dim transition-all">
            <Bell size={20} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary shadow-glow-sm"></span>
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/50 text-text-muted hover:text-primary hover:border-primary hover:bg-primary-dim transition-all">
            <MessageSquare size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

const StatCard = ({ title, value, icon, iconColorClass, trend, trendUp, badge, badgeColorClass }: StatCardProps) => (
  <div className="glass-panel rounded-2xl p-5 hover:bg-surface-highlight/30 transition-all group relative overflow-hidden">
    {badge === "+1 New" && (
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent-red/10 blur-xl pointer-events-none"></div>
    )}
    <div className="flex items-start justify-between mb-4 relative z-10">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-border/50 transition-all ${iconColorClass} group-hover:scale-105`}>
        {icon}
      </div>
      {trend && (
        <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold border ${trendUp ? 'bg-primary/10 text-primary border-primary/20' : 'bg-border/50 text-text-muted border-border'}`}>
          {trendUp ? <TrendingUp size={14} /> : null} {trend}
        </span>
      )}
      {badge && (
        <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold border ${badgeColorClass}`}>
          {badge}
        </span>
      )}
    </div>
    <div className="relative z-10">
      <p className="text-sm font-medium text-text-muted mb-1">{title}</p>
      <h3 className="text-3xl font-display font-bold text-white tracking-tight">{value}</h3>
    </div>
  </div>
);

const AlertItem = ({ title, time, subtitle, icon, colorClass }: AlertItemProps) => (
  <div className="flex gap-4 group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-surface-highlight/30 transition-colors">
    <div className="relative mt-1">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-border transition-all ${colorClass}`}>
        {icon}
      </div>
      {title === "LIBOR Clause Missing" && (
        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-accent-red border-2 border-background"></span>
      )}
    </div>
    <div className="flex flex-col flex-1">
      <div className="flex justify-between items-start">
        <p className={`text-sm font-semibold text-white transition-colors ${title === "LIBOR Clause Missing" ? "group-hover:text-accent-red" : title === "Doc Incomplete" ? "group-hover:text-accent-orange" : "group-hover:text-primary"}`}>
          {title}
        </p>
        <span className="text-[10px] text-text-muted">{time}</span>
      </div>
      <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
    </div>
  </div>
);

const RiskHeatmap = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-lg font-display font-bold text-white">Risk Heatmap</h3>
        <p className="text-xs text-text-muted mt-1">Concentration by Sector</p>
      </div>

      <div className="grid grid-cols-2 gap-2 flex-1 min-h-[140px]">
        <div className="col-span-1 row-span-2 relative group overflow-hidden rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
            <span className="text-xl font-bold text-primary mb-1">Tech</span>
            <span className="text-[10px] text-text-muted uppercase tracking-wider">Low Risk</span>
          </div>
        </div>
        <div className="relative group overflow-hidden rounded-lg bg-accent-red/20 border border-accent-red/30 hover:bg-accent-red/30 transition-all cursor-pointer">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
            <span className="text-sm font-bold text-accent-red">Real Estate</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-accent-orange/20 border border-accent-orange/30 hover:bg-accent-orange/30 transition-all cursor-pointer flex items-center justify-center group">
            <span className="text-[10px] font-bold text-accent-orange group-hover:scale-110 transition-transform">En</span>
          </div>
          <div className="rounded-lg bg-primary/20 border border-primary/30 hover:bg-primary/30 transition-all cursor-pointer flex items-center justify-center group">
            <span className="text-[10px] font-bold text-primary group-hover:scale-110 transition-transform">Hl</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[10px] text-text-muted uppercase tracking-widest font-bold">
        <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow-sm"></div>Safe</div>
        <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-accent-orange"></div>Warn</div>
        <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-accent-red"></div>Crit</div>
      </div>
    </div>
  );
};

// --- Views ---

const DashboardView = () => (
  <div className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2 custom-scrollbar">
    <div className="mx-auto max-w-[1600px] flex flex-col gap-6">

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Loans"
          value="142"
          trend="+5%"
          trendUp={true}
          icon={<Landmark size={22} />}
          iconColorClass="text-text-muted group-hover:text-primary group-hover:bg-primary/10"
        />
        <StatCard
          title="Compliance Score"
          value="94%"
          trend="+2%"
          trendUp={true}
          icon={<CheckCircle2 size={22} />}
          iconColorClass="text-text-muted group-hover:text-primary group-hover:bg-primary/10"
        />
        <StatCard
          title="Critical Risks"
          value="3"
          badge="+1 New"
          badgeColorClass="bg-accent-red/10 text-accent-red border-accent-red/20"
          icon={<AlertTriangle size={22} />}
          iconColorClass="text-text-muted group-hover:text-accent-red group-hover:bg-accent-red/10"
        />
        <StatCard
          title="Pending Approvals"
          value="12"
          trend="0%"
          trendUp={false}
          icon={<Clock size={22} />}
          iconColorClass="text-text-muted group-hover:text-accent-orange group-hover:bg-accent-orange/10"
        />
      </div>

      {/* Middle Section: Chart + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-2 relative z-10">
            <div>
              <h3 className="text-lg font-display font-bold text-white">Compliance Trend</h3>
              <p className="text-xs text-text-muted mt-1">Automated validation efficiency (6 Months)</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-muted hover:text-white hover:border-primary/50 transition-colors">
                Last 6M
              </button>
              <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-black hover:shadow-glow-sm transition-all">
                Export
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#00ff9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  hide
                  domain={[0, 120]} // Adding buffer for tooltip
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141416', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#00ff9d' }}
                  labelStyle={{ color: '#ffffff', marginBottom: '4px' }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#00ff9d"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                  activeDot={{ r: 6, fill: "#050505", stroke: "#00ff9d", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Alerts */}
        <div className="lg:col-span-1 glass-panel rounded-2xl p-6 flex flex-col h-full">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-display font-bold text-white">Live Alerts</h3>
            <button className="text-xs font-medium text-primary hover:text-white transition-colors">View Log</button>
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar flex-1 pr-1">
            <AlertItem
              title="LIBOR Clause Missing"
              time="2m"
              subtitle="Loan #8839 • Syndicated Term"
              icon={<Gavel size={18} />}
              colorClass="text-accent-red group-hover:bg-accent-red group-hover:text-black"
            />
            <AlertItem
              title="Doc Incomplete"
              time="45m"
              subtitle="Loan #4402 • Acme Corp"
              icon={<FileText size={18} />}
              colorClass="text-accent-orange group-hover:bg-accent-orange group-hover:text-black"
            />
            <AlertItem
              title="AI Suggestion"
              time="2h"
              subtitle="Optimization for Loan #9921"
              icon={<Bot size={18} />}
              colorClass="text-primary group-hover:bg-primary group-hover:text-black"
            />
          </div>

          <button className="mt-4 w-full rounded-lg bg-surface-highlight/50 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all border border-transparent hover:border-white">
            Run Diagnostics
          </button>
        </div>
      </div>

      {/* Bottom Row: Table + Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Attention Required Table */}
        <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden flex flex-col">
          <div className="border-b border-border px-6 py-5 flex items-center justify-between bg-surface/30">
            <h3 className="text-lg font-display font-bold text-white">Attention Required</h3>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-muted hover:text-white hover:border-primary/50 transition-all">
                <Filter size={14} />
                Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-xs uppercase text-text-muted font-semibold tracking-wider border-b border-border">
                <tr>
                  <th className="px-6 py-4">Loan ID</th>
                  <th className="px-6 py-4">Counterparty</th>
                  <th className="px-6 py-4">Risk Level</th>
                  <th className="px-6 py-4">Deadline</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-white">
                {LOANS_DATA.map((loan) => (
                  <tr key={loan.id} className="hover:bg-surface-highlight/40 transition-colors group cursor-pointer">
                    <td className="px-6 py-4 font-mono text-primary text-xs group-hover:underline">{loan.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`h-6 w-6 rounded flex items-center justify-center text-[10px] font-bold border ${loan.initialColor}`}>
                          {loan.initial}
                        </div>
                        <span className="font-medium">{loan.counterparty}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-[10px] font-bold uppercase border tracking-wider ${loan.riskColor}`}>
                        {loan.risk}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-muted text-xs">{loan.deadline}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-text-muted hover:text-white transition-colors">
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk Heatmap */}
        <div className="lg:col-span-1 glass-panel rounded-2xl p-6">
          <RiskHeatmap />
        </div>
      </div>

    </div>
  </div>
);

const UploadView = ({ setView, onUploadComplete }: { setView: (v: ViewState) => void, onUploadComplete: (newDocs: Doc[]) => void }) => {
  const [dragActive, setDragActive] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);

  // Simulate initial queue state from design if needed, or start empty. 
  // Let's start with an empty queue for real functionality, 
  // but we can pre-populate if we want to match the static design exactly initially.
  // For this task, "functional" implies we start empty and user adds files.

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']; // PDF and DOCX
    // simplistic check, can be expanded
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isDOCX = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.toLowerCase().endsWith('.docx');

    if (!isPDF && !isDOCX) {
      return { valid: false, error: 'Format not supported' };
    }
    if (file.size > 50 * 1024 * 1024) {
      return { valid: false, error: 'File too large (>50MB)' };
    }
    return { valid: true };
  };

  const processFiles = (files: FileList | null) => {
    if (!files) return;

    const newItems: QueueItem[] = Array.from(files).map(file => {
      const { valid, error } = validateFile(file);
      return {
        id: Math.random().toString(36).substring(7),
        file,
        progress: valid ? 0 : 100,
        status: valid ? 'uploading' : 'error',
        errorMessage: error
      };
    });

    setQueue(prev => [...prev, ...newItems]);

    // Simulate upload for valid files
    newItems.forEach(item => {
      if (item.status === 'uploading') {
        simulateUpload(item.id);
      }
    });
  };

  const simulateUpload = (id: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setQueue(prev => prev.map(item =>
          item.id === id ? { ...item, progress: 100, status: 'ready' } : item
        ));
      } else {
        setQueue(prev => prev.map(item =>
          item.id === id ? { ...item, progress } : item
        ));
      }
    }, 200);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const removeQueueItem = (id: string) => {
    setQueue(prev => prev.filter(i => i.id !== id));
  };

  const handleAnalyze = () => {
    const readyItems = queue.filter(i => i.status === 'ready');
    if (readyItems.length === 0) return;

    const newDocs: Doc[] = readyItems.map(item => {
      const ext = item.file.name.split('.').pop()?.toUpperCase() || 'FILE';
      return {
        name: item.file.name,
        type: (ext === 'PDF' || ext === 'DOCX' || ext === 'XLSX') ? ext as any : 'File',
        size: (item.file.size / (1024 * 1024)).toFixed(1) + ' MB',
        status: 'Analyzed', // Immediate Analysis for demo
        date: 'Just now'
      };
    });

    onUploadComplete(newDocs);
  };

  const readyCount = queue.filter(i => i.status === 'ready').length;

  return (
    <div className="flex-1 overflow-y-auto bg-pitch-black bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,148,0.05),transparent_40%)]">
      <div className="flex flex-col items-center py-10 px-4 md:px-10 lg:px-20 min-h-full">
        <div className="max-w-[1100px] w-full flex flex-col gap-10">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <button onClick={() => setView('dashboard')} className="hover:text-brand-green transition-colors">Home</button>
            <span>/</span>
            <button onClick={() => setView('vault')} className="hover:text-brand-green transition-colors">Documents</button>
            <span>/</span>
            <span className="text-brand-green">New Analysis</span>
          </nav>

          {/* Header */}
          <div className="space-y-3">
            <h1 className="text-white text-4xl md:text-5xl font-display font-bold tracking-tight text-glow">Upload Loan Agreements</h1>
            <p className="text-gray-400 text-lg font-light max-w-2xl">Upload LMA standard documents for AI extraction. Our system automatically standardizes formats and checks compliance in real-time.</p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Main Upload Area + List */}
            <div className="lg:col-span-8 flex flex-col gap-8">

              {/* Dropzone */}
              <div
                className={`group relative flex flex-col items-center justify-center rounded-2xl border border-dashed transition-all duration-300 ease-out py-16 px-6 shadow-xl overflow-hidden border-glow
                  ${dragActive
                    ? 'bg-surface-hover border-brand-green'
                    : 'bg-surface-card border-gray-700 hover:bg-surface-hover hover:border-brand-green'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className={`absolute inset-0 bg-gradient-to-b from-brand-green/5 to-transparent pointer-events-none transition-opacity ${dragActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                <div className="size-20 rounded-full bg-surface-hover group-hover:bg-brand-green/10 flex items-center justify-center text-gray-400 group-hover:text-brand-green transition-colors mb-6 shadow-lg border border-border-dim group-hover:border-brand-green/30">
                  <UploadCloud size={40} />
                </div>
                <div className="text-center space-y-2 z-10">
                  <p className="text-white text-xl font-display font-semibold group-hover:text-brand-green transition-colors">Drag & drop files here</p>
                  <p className="text-gray-500 text-sm">or click to browse from your device</p>
                </div>
                <div className="mt-8 z-10 relative">
                  <button className="pointer-events-none px-8 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold transition-all backdrop-blur-sm group-hover:border-brand-green/50 group-hover:text-brand-green">
                    Select Files
                  </button>
                  <input
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    multiple
                    type="file"
                    onChange={handleChange}
                  />
                </div>
                <p className="mt-6 text-xs text-gray-600 font-mono">PDF, DOCX up to 50MB</p>
              </div>

              {/* Queue */}
              {queue.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-white text-lg font-display font-medium flex items-center gap-2">
                    Upload Queue <span className="text-xs bg-surface-hover text-gray-400 px-2 py-0.5 rounded-full border border-border-dim">{queue.length}</span>
                  </h3>

                  {queue.map(item => (
                    <div key={item.id} className={`p-4 rounded-xl border transition-colors ${item.status === 'error' ? 'bg-surface-card border-red-900/30 relative overflow-hidden' : 'bg-surface-card border-border-dim group hover:border-gray-700'}`}>
                      {item.status === 'error' && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]"></div>
                      )}
                      <div className="flex items-center gap-4">
                        <div className={`size-10 rounded-lg flex items-center justify-center border border-border-dim
                          ${item.status === 'error' ? 'bg-surface-hover text-red-400' :
                            item.status === 'ready' ? 'bg-surface-hover text-brand-green' : 'bg-surface-hover text-brand-green'
                          }`}>
                          {item.status === 'error' ? <ImageIcon size={24} /> : <FileText size={24} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between mb-1">
                            <p className="text-white text-sm font-medium truncate">{item.file.name}</p>
                            {item.status === 'uploading' && (
                              <span className="text-xs text-brand-green font-mono">{Math.round(item.progress)}%</span>
                            )}
                            {item.status === 'ready' && (
                              <p className="text-gray-500 text-xs font-mono">{(item.file.size / 1024 / 1024).toFixed(1)} MB • Ready</p>
                            )}
                            {item.status === 'error' && (
                              <p className="text-red-400 text-xs font-mono">{item.errorMessage}</p>
                            )}
                          </div>

                          {item.status === 'uploading' && (
                            <div className="w-full bg-surface-hover rounded-full h-1 overflow-hidden">
                              <div className="bg-brand-green h-full shadow-[0_0_10px_rgba(0,255,148,0.5)] relative" style={{ width: `${item.progress}%` }}>
                                <div className="absolute inset-0 bg-white/30 w-full h-full animate-shimmer"></div>
                              </div>
                            </div>
                          )}
                        </div>

                        {item.status === 'ready' ? (
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5 text-brand-green text-xs font-bold bg-brand-green/10 px-3 py-1.5 rounded-full border border-brand-green/20">
                              <CheckCircle2 size={16} />
                              Ready
                            </span>
                            <button onClick={() => removeQueueItem(item.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                              <Trash2 size={20} />
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => removeQueueItem(item.id)} className="size-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                            <X size={20} />
                          </button>
                        )}

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Area */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-2xl bg-surface-card border border-border-dim shadow-xl flex flex-col gap-6 sticky top-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-lg font-display font-medium">Summary</h3>
                  {readyCount > 0 && (
                    <span className="size-2 rounded-full bg-brand-green animate-pulse shadow-[0_0_8px_rgba(0,255,148,0.8)]"></span>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-surface-hover border border-border-dim">
                    <span className="text-gray-400 text-sm">Files to Analyze</span>
                    <span className="text-white font-mono font-bold">{readyCount}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-surface-hover border border-border-dim">
                    <span className="text-gray-400 text-sm">Est. Time</span>
                    <span className="text-white font-mono font-bold">~{readyCount * 15}s</span>
                  </div>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={readyCount === 0}
                  className={`w-full group relative flex items-center justify-center gap-2 rounded-lg h-12 font-bold transition-all overflow-hidden
                    ${readyCount > 0
                      ? 'bg-brand-green hover:bg-[#33ffaa] text-pitch-black shadow-[0_0_20px_rgba(0,255,148,0.3)] hover:shadow-[0_0_30px_rgba(0,255,148,0.5)]'
                      : 'bg-surface-hover text-gray-500 cursor-not-allowed border border-border-dim'}`}
                >
                  {readyCount > 0 && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>}
                  <Bot size={20} className="z-10" />
                  <span className="z-10">Analyze Documents</span>
                </button>
                <button onClick={() => setQueue([])} className="w-full text-sm text-gray-500 hover:text-white transition-colors">Clear Queue</button>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-surface-card to-surface-hover border border-border-dim">
                <h4 className="text-white text-sm font-bold flex items-center gap-2 mb-4">
                  <Info size={16} className="text-brand-green" />
                  Best Practices
                </h4>
                <ul className="space-y-3 text-sm text-gray-400 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="block size-1.5 rounded-full bg-gray-600 mt-1.5 flex-shrink-0"></span>
                    Ensure scanned PDFs are legible (300+ DPI).
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="block size-1.5 rounded-full bg-gray-600 mt-1.5 flex-shrink-0"></span>
                    Avoid password-protected files.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="block size-1.5 rounded-full bg-gray-600 mt-1.5 flex-shrink-0"></span>
                    Upload complete agreements for best context.
                  </li>
                </ul>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="mt-auto flex justify-center pb-8 pt-4">
            <p className="flex items-center gap-2 text-gray-600 text-xs font-medium font-mono uppercase tracking-wider">
              <Lock size={14} />
              End-to-end encrypted
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

const DocumentVaultView = ({ setView, docs }: { setView: (v: ViewState) => void, docs: Doc[] }) => (
  <div className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2 custom-scrollbar">
    <div className="mx-auto max-w-[1600px] flex flex-col gap-6">

      {/* Header for Vault */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Document Vault</h2>
          <p className="text-xs text-text-muted mt-1">Manage and analyze your legal documents.</p>
        </div>
        <button
          onClick={() => setView('upload')}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-black hover:shadow-glow-sm transition-all"
        >
          <Plus size={18} />
          New Analysis
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-muted">Total Documents</p>
            <h3 className="text-2xl font-display font-bold text-white mt-1">{docs.length}</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Files size={20} />
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-muted">Analyzed this week</p>
            <h3 className="text-2xl font-display font-bold text-white mt-1">24</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-surface-highlight text-text-muted flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-muted">Storage Used</p>
            <h3 className="text-2xl font-display font-bold text-white mt-1">45%</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-surface-highlight text-text-muted flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="glass-panel rounded-2xl overflow-hidden flex flex-col flex-1 min-h-[500px]">
        <div className="border-b border-border px-6 py-5 flex items-center justify-between bg-surface/30">
          <h3 className="text-lg font-display font-bold text-white">Recent Files</h3>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-muted hover:text-white transition-all">
              <Filter size={14} />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase text-text-muted font-semibold tracking-wider border-b border-border">
              <tr>
                <th className="px-6 py-4 w-12"></th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date Uploaded</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-white">
              {docs.map((doc, idx) => (
                <tr key={idx} className="hover:bg-surface-highlight/40 transition-colors group cursor-pointer">
                  <td className="px-6 py-4 text-text-muted">
                    {doc.type === 'PDF' ? <FileText size={20} /> : <FileIcon size={20} />}
                  </td>
                  <td className="px-6 py-4 font-medium">{doc.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-[10px] font-bold uppercase border tracking-wider 
                      ${doc.status === 'Analyzed' ? 'text-primary bg-primary/10 border-primary/20' :
                        doc.status === 'Review' ? 'text-accent-orange bg-accent-orange/10 border-accent-orange/20' :
                          'text-text-muted bg-surface-highlight border-border'}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-muted text-xs">{doc.date}</td>
                  <td className="px-6 py-4 text-text-muted text-xs font-mono">{doc.size}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-text-muted hover:text-white transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [vaultDocs, setVaultDocs] = useState<Doc[]>(INITIAL_VAULT_DOCS);

  const handleUploadComplete = (newDocs: Doc[]) => {
    setVaultDocs(prev => [...newDocs, ...prev]);
    setCurrentView('vault');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-text-main font-sans selection:bg-primary selection:text-black">
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        currentView={currentView}
        setView={setCurrentView}
      />

      <main className="flex flex-1 flex-col overflow-hidden relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0a1e16] via-background to-background">

        {currentView !== 'upload' && (
          <Header
            onMenuClick={() => setSidebarOpen(true)}
            title={currentView === 'vault' ? 'Document Vault' : 'Dashboard'}
            subtitle={currentView === 'vault' ? 'Secure storage and analysis' : "Welcome back, here's what's happening today."}
          />
        )}

        {currentView === 'upload' && (
          <div className="lg:hidden absolute top-4 left-4 z-50">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-full bg-surface/50 text-white backdrop-blur-md border border-white/10">
              <Menu size={20} />
            </button>
          </div>
        )}

        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'vault' && <DocumentVaultView setView={setCurrentView} docs={vaultDocs} />}
        {currentView === 'upload' && <UploadView setView={setCurrentView} onUploadComplete={handleUploadComplete} />}

      </main>
    </div>
  );
}