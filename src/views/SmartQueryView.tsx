import React, { useState } from 'react';
import { ViewState } from '../types';
import {
    History,
    Bookmark,
    FileText,
    Trash2,
    Search,
    Paperclip,
    Sliders,
    Brain,
    Sparkles,
    AlertTriangle,
    Calendar,
    ShieldAlert,
    DollarSign,
    Download,
    BookmarkPlus,
    ThumbsUp,
    ThumbsDown,
    ArrowRight,
    Filter,
    MoreVertical,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

interface SmartQueryViewProps {
    setView?: (view: ViewState) => void;
}

export const SmartQueryView = ({ setView }: SmartQueryViewProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex flex-1 overflow-hidden relative h-full bg-background">
            {/* Sidebar */}
            <aside
                className={`hidden md:flex flex-col border-r border-border bg-background/50 backdrop-blur overflow-y-auto shrink-0 z-10 transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'}`}
            >
                <div className="flex flex-col gap-6 p-4 h-full">
                    <div className="flex items-center justify-between">
                        {isSidebarOpen && (
                            <div className="flex flex-col gap-1 fade-in">
                                <h1 className="text-white text-sm font-display font-bold uppercase tracking-widest text-primary">History</h1>
                                <p className="text-text-muted text-xs font-normal">Your recent investigations</p>
                            </div>
                        )}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg hover:bg-surface-highlight text-text-muted hover:text-white transition-colors ml-auto"
                        >
                            {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                        </button>
                    </div>

                    {isSidebarOpen ? (
                        <>
                            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-full"></div>
                            <div className="flex flex-col gap-4">
                                <p className="text-xs font-bold text-text-muted uppercase tracking-widest px-2">Today</p>
                                <div className="group flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-surface-highlight border border-transparent hover:border-border cursor-pointer transition-all">
                                    <Search className="text-text-muted mt-0.5 group-hover:text-primary transition-colors shrink-0" size={18} />
                                    <div className="flex flex-col gap-1">
                                        <p className="text-white text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">"Show all loans with floating rates"</p>
                                        <span className="text-[10px] text-text-muted font-mono">10:42 AM</span>
                                    </div>
                                </div>
                                <div className="group flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-surface-highlight border border-transparent hover:border-border cursor-pointer transition-all">
                                    <Search className="text-text-muted mt-0.5 group-hover:text-primary transition-colors shrink-0" size={18} />
                                    <div className="flex flex-col gap-1">
                                        <p className="text-white text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">"Compliance breaches {'>'} $1M in Q2"</p>
                                        <span className="text-[10px] text-text-muted font-mono">Yesterday</span>
                                    </div>
                                </div>
                                <div className="group flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-surface-highlight border border-transparent hover:border-border cursor-pointer transition-all">
                                    <Search className="text-text-muted mt-0.5 group-hover:text-primary transition-colors shrink-0" size={18} />
                                    <div className="flex flex-col gap-1">
                                        <p className="text-white text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">"Maturity dates for Project Alpha"</p>
                                        <span className="text-[10px] text-text-muted font-mono">2 days ago</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-auto pt-6">
                                <button className="w-full py-2 px-4 border border-border rounded-lg text-xs font-mono text-text-muted hover:text-white hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
                                    <Trash2 size={14} /> Clear History
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col gap-4 mt-4 items-center">
                            <div className="w-8 h-8 rounded-full bg-surface-highlight flex items-center justify-center cursor-pointer hover:text-primary transition-colors" title="Show all loans...">
                                <Search size={16} />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-surface-highlight flex items-center justify-center cursor-pointer hover:text-primary transition-colors" title="Compliance breaches...">
                                <Search size={16} />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-surface-highlight flex items-center justify-center cursor-pointer hover:text-primary transition-colors" title="Maturity dates...">
                                <Search size={16} />
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none"></div>

                <div className="flex-1 overflow-y-auto z-10">
                    <div className="max-w-[1100px] mx-auto w-full px-6 md:px-10 py-10 flex flex-col gap-10">

                        {/* Hero Header */}
                        <div className="flex flex-col items-center text-center gap-6 mt-6">
                            <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-surface-highlight border border-border mb-2">
                                <div className="bg-center bg-no-repeat bg-cover rounded-xl size-12 bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
                                    <Sparkles className="text-primary" size={24} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white">
                                    What would you like to <span className="text-primary">know?</span>
                                </h1>
                                <p className="text-text-muted text-lg font-light max-w-2xl mx-auto">
                                    Analyze your loan portfolio using natural language. Just ask.
                                </p>
                            </div>
                        </div>

                        {/* Search Input */}
                        <div className="w-full max-w-3xl mx-auto relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                            <div className="relative bg-[#0A0A0A] rounded-2xl border border-border shadow-2xl overflow-hidden transition-all duration-300 group-focus-within:border-primary/50 group-focus-within:shadow-glow">
                                <div className="p-1">
                                    <textarea
                                        className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-text-muted/50 resize-none text-xl font-light leading-relaxed p-6 focus:outline-none"
                                        placeholder="e.g., 'Which loans are missing LMA compliance clauses?'"
                                        rows={2}
                                    ></textarea>
                                </div>
                                <div className="flex justify-between items-center px-4 py-3 bg-surface-highlight/30 border-t border-white/5">
                                    <div className="flex gap-2">
                                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors text-xs font-mono border border-transparent hover:border-white/10" title="Attach Document">
                                            <Paperclip size={16} />
                                            <span>Context</span>
                                        </button>
                                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors text-xs font-mono border border-transparent hover:border-white/10" title="Filter Scope">
                                            <Sliders size={16} />
                                            <span>Filters</span>
                                        </button>
                                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors text-xs font-mono border border-transparent hover:border-white/10" title="Select Model">
                                            <Brain size={16} />
                                            <span>GPT-4o</span>
                                        </button>
                                    </div>
                                    <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-black px-6 py-2 rounded-lg font-display font-bold text-sm transition-all shadow-glow hover:shadow-glow transform hover:-translate-y-0.5 active:translate-y-0">
                                        <Sparkles size={16} />
                                        <span>Analyze</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Filters */}
                        <div className="flex justify-center gap-3 flex-wrap max-w-4xl mx-auto">
                            <button className="group flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full border border-border bg-surface-highlight hover:border-primary hover:bg-surface-highlight/80 px-4 transition-all">
                                <AlertTriangle className="text-orange-500" size={16} />
                                <p className="text-text-muted group-hover:text-white text-sm font-medium">High Risk Loans</p>
                            </button>
                            <button className="group flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full border border-border bg-surface-highlight hover:border-primary hover:bg-surface-highlight/80 px-4 transition-all">
                                <Calendar className="text-blue-400" size={16} />
                                <p className="text-text-muted group-hover:text-white text-sm font-medium">Q4 Maturities</p>
                            </button>
                            <button className="group flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full border border-border bg-surface-highlight hover:border-primary hover:bg-surface-highlight/80 px-4 transition-all">
                                <ShieldAlert className="text-red-400" size={16} />
                                <p className="text-text-muted group-hover:text-white text-sm font-medium">Compliance Gaps</p>
                            </button>
                            <button className="group flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full border border-border bg-surface-highlight hover:border-primary hover:bg-surface-highlight/80 px-4 transition-all">
                                <DollarSign className="text-primary" size={16} />
                                <p className="text-text-muted group-hover:text-white text-sm font-medium">Loans {'>'} $1M</p>
                            </button>
                        </div>

                        {/* Results Section */}
                        <div className="flex flex-col gap-6 animate-fade-in-up mt-8 border-t border-border pt-10">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-display font-bold text-white flex items-center gap-3">
                                    <span className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary border border-primary/20">
                                        <Search size={18} />
                                    </span>
                                    <span>Results for <span className="text-text-muted font-normal italic">"Show all loans with floating rates"</span></span>
                                </h3>
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-text-muted hover:text-white hover:bg-surface-highlight border border-transparent hover:border-border transition-all text-xs font-mono" title="Export CSV">
                                        <Download size={16} />
                                        <span className="hidden sm:inline">Export</span>
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-text-muted hover:text-white hover:bg-surface-highlight border border-transparent hover:border-border transition-all text-xs font-mono" title="Save Query">
                                        <BookmarkPlus size={16} />
                                        <span className="hidden sm:inline">Save</span>
                                    </button>
                                </div>
                            </div>

                            <div className="relative overflow-hidden bg-gradient-to-br from-surface-highlight to-surface-dark border border-border rounded-2xl p-1">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                                <div className="bg-surface-dark/50 backdrop-blur-sm rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start">
                                    <div className="p-3 bg-surface-highlight rounded-xl border border-white/5 shrink-0 shadow-lg">
                                        <Sparkles className="text-primary animate-pulse" size={24} />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="prose prose-invert max-w-none">
                                            <p className="text-lg text-white font-light leading-relaxed">
                                                I found <span className="font-bold text-primary">12 loans</span> in your portfolio that currently have floating interest rates. Most of these are tied to LIBOR transition clauses.
                                                <span className="text-orange-400 bg-orange-400/10 px-1 rounded ml-1">3 loans</span> are flagged as high risk due to upcoming maturity dates.
                                            </p>
                                        </div>
                                        <div className="flex gap-4 pt-2">
                                            <button className="text-xs font-mono uppercase tracking-wider text-primary hover:text-white transition-colors flex items-center gap-2 group">
                                                View Analytics <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                                            </button>
                                            <button className="text-xs font-mono uppercase tracking-wider text-text-muted hover:text-white transition-colors flex items-center gap-2">
                                                Refine Search <Filter size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-row md:flex-col gap-2 border-l border-white/5 pl-4 md:pl-0 md:border-l-0 md:border-t-0">
                                        <button className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"><ThumbsUp size={18} /></button>
                                        <button className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"><ThumbsDown size={18} /></button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-surface-highlight/30 backdrop-blur rounded-2xl border border-border overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-surface-highlight border-b border-border">
                                                <th className="p-5 text-[11px] font-mono font-bold text-text-muted uppercase tracking-wider">Loan ID</th>
                                                <th className="p-5 text-[11px] font-mono font-bold text-text-muted uppercase tracking-wider">Counterparty</th>
                                                <th className="p-5 text-[11px] font-mono font-bold text-text-muted uppercase tracking-wider text-right">Amount</th>
                                                <th className="p-5 text-[11px] font-mono font-bold text-text-muted uppercase tracking-wider">Rate Type</th>
                                                <th className="p-5 text-[11px] font-mono font-bold text-text-muted uppercase tracking-wider">Maturity</th>
                                                <th className="p-5 text-[11px] font-mono font-bold text-text-muted uppercase tracking-wider text-center">Risk Score</th>
                                                <th className="p-5 text-[11px] font-mono font-bold text-text-muted uppercase tracking-wider text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            <tr className="hover:bg-surface-highlight transition-colors group">
                                                <td className="p-5 font-mono text-sm text-primary">LN-2023-884</td>
                                                <td className="p-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-lg bg-surface-dark border border-white/10 flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-xs font-bold text-white">
                                                            AC
                                                        </div>
                                                        <span className="text-sm font-medium text-white">Alpha Corp</span>
                                                    </div>
                                                </td>
                                                <td className="p-5 text-sm font-mono text-white text-right">$4,500,000</td>
                                                <td className="p-5">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                        Floating
                                                    </span>
                                                </td>
                                                <td className="p-5 text-sm text-text-muted font-mono">Oct 24, 2024</td>
                                                <td className="p-5 text-center">
                                                    <div className="inline-flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/30 shadow-[0_0_10px_rgba(0,255,148,0.2)]">
                                                        A+
                                                    </div>
                                                </td>
                                                <td className="p-5 text-right">
                                                    <button className="text-text-muted hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-surface-highlight transition-colors group">
                                                <td className="p-5 font-mono text-sm text-primary">LN-2023-902</td>
                                                <td className="p-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-lg bg-surface-dark border border-white/10 flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-pink-500/20 text-xs font-bold text-white">
                                                            BH
                                                        </div>
                                                        <span className="text-sm font-medium text-white">Beta Holdings</span>
                                                    </div>
                                                </td>
                                                <td className="p-5 text-sm font-mono text-white text-right">$12,250,000</td>
                                                <td className="p-5">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                        Floating
                                                    </span>
                                                </td>
                                                <td className="p-5 text-sm text-text-muted font-mono">Dec 15, 2024</td>
                                                <td className="p-5 text-center">
                                                    <div className="inline-flex items-center justify-center size-8 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-bold border border-yellow-500/30">
                                                        B-
                                                    </div>
                                                </td>
                                                <td className="p-5 text-right">
                                                    <button className="text-text-muted hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-surface-highlight transition-colors group">
                                                <td className="p-5 font-mono text-sm text-primary">LN-2023-755</td>
                                                <td className="p-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-lg bg-surface-dark border border-white/10 flex items-center justify-center bg-gradient-to-br from-green-500/20 to-teal-500/20 text-xs font-bold text-white">
                                                            GI
                                                        </div>
                                                        <span className="text-sm font-medium text-white">Gamma Ind.</span>
                                                    </div>
                                                </td>
                                                <td className="p-5 text-sm font-mono text-white text-right">$1,100,000</td>
                                                <td className="p-5">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                        Floating
                                                    </span>
                                                </td>
                                                <td className="p-5 text-sm text-text-muted font-mono">Nov 30, 2024</td>
                                                <td className="p-5 text-center">
                                                    <div className="inline-flex items-center justify-center size-8 rounded-full bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/30">
                                                        D
                                                    </div>
                                                </td>
                                                <td className="p-5 text-right">
                                                    <button className="text-text-muted hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-surface-highlight transition-colors group">
                                                <td className="p-5 font-mono text-sm text-primary">LN-2024-101</td>
                                                <td className="p-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-lg bg-surface-dark border border-white/10 flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-red-500/20 text-xs font-bold text-white">
                                                            DL
                                                        </div>
                                                        <span className="text-sm font-medium text-white">Delta Log.</span>
                                                    </div>
                                                </td>
                                                <td className="p-5 text-sm font-mono text-white text-right">$8,750,000</td>
                                                <td className="p-5">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                        Floating
                                                    </span>
                                                </td>
                                                <td className="p-5 text-sm text-text-muted font-mono">Jan 12, 2025</td>
                                                <td className="p-5 text-center">
                                                    <div className="inline-flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/30 shadow-[0_0_10px_rgba(0,255,148,0.2)]">
                                                        A
                                                    </div>
                                                </td>
                                                <td className="p-5 text-right">
                                                    <button className="text-text-muted hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="bg-surface-highlight/50 p-4 border-t border-border flex justify-center">
                                    <button className="text-xs font-mono font-bold text-text-muted hover:text-primary transition-colors flex items-center gap-2">
                                        VIEW ALL 12 LOANS <ChevronDown size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};
