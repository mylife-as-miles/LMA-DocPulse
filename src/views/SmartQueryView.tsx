import React from 'react';
import {

    Search,
    Trash2,
    Paperclip,
    SlidersHorizontal,
    Brain,
    Sparkles,
    AlertTriangle,
    Calendar,
    Shield,
    DollarSign,
    Download,
    BookmarkPlus,
    ThumbsUp,
    ThumbsDown,
    ArrowRight,
    Filter,
    MoreVertical,
    ChevronDown,
    Bot
} from 'lucide-react';

import { ViewState } from '../types';

interface SmartQueryViewProps {
    setView?: (view: ViewState) => void;
}

export const SmartQueryView = ({ setView }: SmartQueryViewProps) => {
    return (
        <div className="flex flex-1 overflow-hidden relative h-full">
            {/* History Sidebar */}
            <aside className="hidden md:flex w-72 flex-col border-r border-[#222222] bg-[#050505]/50 backdrop-blur overflow-y-auto shrink-0 z-10 text-[#EDEDED]">
                <div className="flex flex-col gap-6 p-6">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-sm font-display font-bold uppercase tracking-widest text-[#00FF94]">History</h1>
                        <p className="text-[#888888] text-xs font-normal">Your recent investigations</p>
                    </div>



                    <div className="h-px bg-gradient-to-r from-transparent via-[#222222] to-transparent w-full"></div>

                    <div className="flex flex-col gap-4">
                        <p className="text-xs font-bold text-[#888888] uppercase tracking-widest px-2">Today</p>

                        <div className="group flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-[#141414] border border-transparent hover:border-[#222222] cursor-pointer transition-all">
                            <Search className="w-5 h-5 text-[#888888] mt-0.5 group-hover:text-[#00FF94] transition-colors" />
                            <div className="flex flex-col gap-1">
                                <p className="text-white text-sm font-medium leading-snug line-clamp-2 group-hover:text-[#00FF94] transition-colors">"Show all loans with floating rates"</p>
                                <span className="text-[10px] text-[#888888] font-mono">10:42 AM</span>
                            </div>
                        </div>

                        <div className="group flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-[#141414] border border-transparent hover:border-[#222222] cursor-pointer transition-all">
                            <Search className="w-5 h-5 text-[#888888] mt-0.5 group-hover:text-[#00FF94] transition-colors" />
                            <div className="flex flex-col gap-1">
                                <p className="text-white text-sm font-medium leading-snug line-clamp-2 group-hover:text-[#00FF94] transition-colors">"Compliance breaches &gt; $1M in Q2"</p>
                                <span className="text-[10px] text-[#888888] font-mono">Yesterday</span>
                            </div>
                        </div>

                        <div className="group flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-[#141414] border border-transparent hover:border-[#222222] cursor-pointer transition-all">
                            <Search className="w-5 h-5 text-[#888888] mt-0.5 group-hover:text-[#00FF94] transition-colors" />
                            <div className="flex flex-col gap-1">
                                <p className="text-white text-sm font-medium leading-snug line-clamp-2 group-hover:text-[#00FF94] transition-colors">"Maturity dates for Project Alpha"</p>
                                <span className="text-[10px] text-[#888888] font-mono">2 days ago</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6">
                        <button className="w-full py-2 px-4 border border-[#222222] rounded-lg text-xs font-mono text-[#888888] hover:text-white hover:border-[#00FF94]/50 hover:bg-[#00FF94]/5 transition-all flex items-center justify-center gap-2">
                            <Trash2 size={14} /> Clear History
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#050505] relative custom-scrollbar">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMzQsIDM0LCAzNCwgMC4yKSIvPjwvc3ZnPg==')] [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none"></div>

                <div className="flex-1 z-10">
                    <div className="max-w-[1100px] mx-auto w-full px-6 md:px-10 py-10 flex flex-col gap-10">

                        {/* Hero Section */}
                        <div className="flex flex-col items-center text-center gap-6 mt-6">
                            <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-[#141414] border border-[#222222] mb-2">
                                <div className="bg-center bg-no-repeat bg-cover rounded-xl w-12 h-12 flex items-center justify-center bg-[#0A0A0A]">
                                    <Bot size={32} className="text-[#00FF94]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white">
                                    What would you like to <span className="text-[#00FF94]">know?</span>
                                </h1>
                                <p className="text-[#888888] text-lg font-light max-w-2xl mx-auto">
                                    Analyze your loan portfolio using natural language. Just ask.
                                </p>
                            </div>
                        </div>

                        {/* Search Input */}
                        <div className="w-full max-w-3xl mx-auto relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#00FF94]/20 via-[#00FF94]/10 to-transparent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                            <div className="relative bg-[#0A0A0A] rounded-2xl border border-[#222222] shadow-2xl overflow-hidden transition-all duration-300 group-focus-within:border-[#00FF94]/50 group-focus-within:shadow-[0_0_20px_rgba(0,255,148,0.15)]">
                                <div className="p-1">
                                    <textarea
                                        className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-[#888888]/50 resize-none text-xl font-light leading-relaxed p-6 outline-none"
                                        placeholder="e.g., 'Which loans are missing LMA compliance clauses?'"
                                        rows={2}
                                    />
                                </div>
                                <div className="flex justify-between items-center px-4 py-3 bg-[#141414]/30 border-t border-white/5">
                                    <div className="flex gap-2">
                                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[#888888] hover:text-white hover:bg-white/5 transition-colors text-xs font-mono border border-transparent hover:border-white/10" title="Attach Document">
                                            <Paperclip size={18} />
                                            <span>Context</span>
                                        </button>
                                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[#888888] hover:text-white hover:bg-white/5 transition-colors text-xs font-mono border border-transparent hover:border-white/10" title="Filter Scope">
                                            <SlidersHorizontal size={18} />
                                            <span>Filters</span>
                                        </button>
                                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[#888888] hover:text-white hover:bg-white/5 transition-colors text-xs font-mono border border-transparent hover:border-white/10" title="Select Model">
                                            <Brain size={18} />
                                            <span>GPT-4o</span>
                                        </button>
                                    </div>
                                    <button className="flex items-center gap-2 bg-[#00FF94] hover:bg-[#00cc76] text-black px-6 py-2 rounded-lg font-display font-bold text-sm transition-all shadow-[0_0_10px_rgba(0,255,148,0.1)] hover:shadow-[0_0_10px_rgba(0,255,148,0.15)] transform hover:-translate-y-0.5 active:translate-y-0">
                                        <Sparkles size={20} />
                                        <span>Analyze</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Filters */}
                        <div className="flex justify-center gap-3 flex-wrap max-w-4xl mx-auto">
                            <button className="group flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full border border-[#222222] bg-[#141414] hover:border-[#00FF94] hover:bg-[#141414]/80 px-4 transition-all">
                                <AlertTriangle size={18} className="text-orange-500" />
                                <p className="text-[#888888] group-hover:text-white text-sm font-medium">High Risk Loans</p>
                            </button>
                            <button className="group flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full border border-[#222222] bg-[#141414] hover:border-[#00FF94] hover:bg-[#141414]/80 px-4 transition-all">
                                <Calendar size={18} className="text-blue-400" />
                                <p className="text-[#888888] group-hover:text-white text-sm font-medium">Q4 Maturities</p>
                            </button>
                            <button className="group flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full border border-[#222222] bg-[#141414] hover:border-[#00FF94] hover:bg-[#141414]/80 px-4 transition-all">
                                <Shield size={18} className="text-red-400" />
                                <p className="text-[#888888] group-hover:text-white text-sm font-medium">Compliance Gaps</p>
                            </button>
                            <button className="group flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full border border-[#222222] bg-[#141414] hover:border-[#00FF94] hover:bg-[#141414]/80 px-4 transition-all">
                                <DollarSign size={18} className="text-[#00FF94]" />
                                <p className="text-[#888888] group-hover:text-white text-sm font-medium">Loans &gt; $1M</p>
                            </button>
                        </div>

                        {/* Results Section */}
                        <div className="flex flex-col gap-6 animate-fade-in-up mt-8 border-t border-[#222222] pt-10">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-display font-bold text-white flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#00FF94]/10 text-[#00FF94] border border-[#00FF94]/20">
                                        <Search size={18} />
                                    </span>
                                    <span>Results for <span className="text-[#888888] font-normal italic">"Show all loans with floating rates"</span></span>
                                </h3>
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#888888] hover:text-white hover:bg-[#141414] border border-transparent hover:border-[#222222] transition-all text-xs font-mono" title="Export CSV">
                                        <Download size={18} />
                                        <span className="hidden sm:inline">Export</span>
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#888888] hover:text-white hover:bg-[#141414] border border-transparent hover:border-[#222222] transition-all text-xs font-mono" title="Save Query">
                                        <BookmarkPlus size={18} />
                                        <span className="hidden sm:inline">Save</span>
                                    </button>
                                </div>
                            </div>

                            {/* Analysis Box */}
                            <div className="relative overflow-hidden bg-gradient-to-br from-[#141414] to-[#0A0A0A] border border-[#222222] rounded-2xl p-1">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF94]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                                <div className="bg-[#0A0A0A]/50 backdrop-blur-sm rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start">
                                    <div className="p-3 bg-[#141414] rounded-xl border border-white/5 shrink-0 shadow-lg">
                                        <Sparkles className="text-[#00FF94] w-6 h-6 animate-pulse" />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="prose prose-invert max-w-none">
                                            <p className="text-lg text-white font-light leading-relaxed">
                                                I found <span className="font-bold text-[#00FF94]">12 loans</span> in your portfolio that currently have floating interest rates. Most of these are tied to LIBOR transition clauses.
                                                <span className="text-orange-400 bg-orange-400/10 px-1 rounded ml-1">3 loans</span> are flagged as high risk due to upcoming maturity dates.
                                            </p>
                                        </div>
                                        <div className="flex gap-4 pt-2">
                                            <button className="text-xs font-mono uppercase tracking-wider text-[#00FF94] hover:text-white transition-colors flex items-center gap-2 group">
                                                View Analytics <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                            <button className="text-xs font-mono uppercase tracking-wider text-[#888888] hover:text-white transition-colors flex items-center gap-2">
                                                Refine Search <Filter size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-row md:flex-col gap-2 border-l border-white/5 pl-4 md:pl-0 md:border-l-0 md:border-t-0">
                                        <button className="p-2 rounded-lg text-[#888888] hover:text-[#00FF94] hover:bg-[#00FF94]/10 transition-colors"><ThumbsUp size={20} /></button>
                                        <button className="p-2 rounded-lg text-[#888888] hover:text-red-400 hover:bg-red-400/10 transition-colors"><ThumbsDown size={20} /></button>
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="bg-[#141414]/30 backdrop-blur rounded-2xl border border-[#222222] overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-[#141414] border-b border-[#222222]">
                                                <th className="p-5 text-[11px] font-mono font-bold text-[#888888] uppercase tracking-wider">Loan ID</th>
                                                <th className="p-5 text-[11px] font-mono font-bold text-[#888888] uppercase tracking-wider">Counterparty</th>
                                                <th className="p-5 text-[11px] font-mono font-bold text-[#888888] uppercase tracking-wider text-right">Amount</th>
                                                <th className="p-5 text-[11px] font-mono font-bold text-[#888888] uppercase tracking-wider">Rate Type</th>
                                                <th className="p-5 text-[11px] font-mono font-bold text-[#888888] uppercase tracking-wider">Maturity</th>
                                                <th className="p-5 text-[11px] font-mono font-bold text-[#888888] uppercase tracking-wider text-center">Risk Score</th>
                                                <th className="p-5 text-[11px] font-mono font-bold text-[#888888] uppercase tracking-wider text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#222222]">
                                            {[
                                                { id: 'LN-2023-884', name: 'Alpha Corp', amount: '$4,500,000', rate: 'Floating', date: 'Oct 24, 2024', score: 'A+', scoreColor: 'text-[#00FF94] bg-[#00FF94]/10 border-[#00FF94]/30 shadow-[0_0_10px_rgba(0,255,148,0.2)]' },
                                                { id: 'LN-2023-902', name: 'Beta Holdings', amount: '$12,250,000', rate: 'Floating', date: 'Dec 15, 2024', score: 'B-', scoreColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
                                                { id: 'LN-2023-755', name: 'Gamma Industries', amount: '$1,100,000', rate: 'Floating', date: 'Nov 30, 2024', score: 'D', scoreColor: 'text-red-400 bg-red-500/10 border-red-500/30' },
                                                { id: 'LN-2024-101', name: 'Delta Logistics', amount: '$8,750,000', rate: 'Floating', date: 'Jan 12, 2025', score: 'A', scoreColor: 'text-[#00FF94] bg-[#00FF94]/10 border-[#00FF94]/30 shadow-[0_0_10px_rgba(0,255,148,0.2)]' }
                                            ].map((loan, idx) => (
                                                <tr
                                                    key={idx}
                                                    className="hover:bg-[#141414] transition-colors group cursor-pointer"
                                                    onClick={() => setView?.('loan_review')}
                                                >
                                                    <td className="p-5 font-mono text-sm text-[#00FF94]">{loan.id}</td>
                                                    <td className="p-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] border border-white/10 flex items-center justify-center text-xs font-bold text-white/50">
                                                                {loan.name[0]}
                                                            </div>
                                                            <span className="text-sm font-medium text-white">{loan.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-5 text-sm font-mono text-white text-right">{loan.amount}</td>
                                                    <td className="p-5">
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                            {loan.rate}
                                                        </span>
                                                    </td>
                                                    <td className="p-5 text-sm text-[#888888] font-mono">{loan.date}</td>
                                                    <td className="p-5 text-center">
                                                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border ${loan.scoreColor}`}>
                                                            {loan.score}
                                                        </div>
                                                    </td>
                                                    <td className="p-5 text-right">
                                                        <button className="text-[#888888] hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
                                                            <MoreVertical size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="bg-[#141414]/50 p-4 border-t border-[#222222] flex justify-center">
                                    <button className="text-xs font-mono font-bold text-[#888888] hover:text-[#00FF94] transition-colors flex items-center gap-2">
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
