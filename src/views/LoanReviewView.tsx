import React, { useState } from 'react';
import {
    CheckCircle,
    Download,
    Calendar,
    Edit,
    AlertTriangle,
    Check,
    Search,
    ChevronDown,
    FileText
} from 'lucide-react';

export const LoanReviewView = () => {
    const [activeSection, setActiveSection] = useState('summary');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex flex-1 overflow-hidden relative h-full">
            {/* Sidebar */}
            <aside
                className={`
                    flex-none flex flex-col justify-between border-r border-border bg-background transition-all duration-300 overflow-y-auto z-10 shrink-0
                    ${isSidebarOpen ? 'w-72' : 'w-16 items-center'}
                `}
            >
                <div className="flex flex-col p-4 gap-8 mt-2 w-full">
                    <div>
                        <div className="flex items-center justify-between px-3 mb-4">
                            {isSidebarOpen && (
                                <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-[0.15em] font-display animate-fade-in whitespace-nowrap">
                                    Document Sections
                                </h3>
                            )}
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="text-text-muted hover:text-white transition-colors p-1"
                                title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                            >
                                {isSidebarOpen ? <ChevronDown className="rotate-90" size={16} /> : <ChevronDown className="-rotate-90" size={16} />}
                            </button>
                        </div>

                        <div className="flex flex-col gap-1 relative w-full">
                            {isSidebarOpen && <div className="absolute left-[29px] top-4 bottom-4 w-px bg-border z-0"></div>}

                            {['Summary', 'Borrower Details', 'Financial Covenants', 'Events of Default', 'Signatures'].map((section, idx) => {
                                const isActive = section === 'Financial Covenants';

                                return (
                                    <div
                                        key={idx}
                                        className={`
                                            flex items-center justify-between rounded-lg cursor-pointer group z-10 relative
                                            ${isSidebarOpen ? 'px-3 py-2' : 'p-2 justify-center'}
                                            ${isActive ? 'bg-surface-highlight border border-border' : 'hover:bg-surface-highlight'}
                                        `}
                                        title={!isSidebarOpen ? section : ''}
                                        onClick={() => setActiveSection(section.toLowerCase())}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`flex items-center justify-center w-5 h-5 bg-background border rounded-full transition-colors shrink-0 ${isActive ? 'border-accent-orange' : 'border-border group-hover:border-primary'}`}>
                                                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-accent-orange shadow-[0_0_6px_#f59e0b]' : 'bg-primary shadow-[0_0_6px_#00ff9d]'}`}></span>
                                            </span>
                                            {isSidebarOpen && (
                                                <span className={`text-sm font-medium transition-colors whitespace-nowrap overflow-hidden text-ellipsis ${isActive ? 'text-white' : 'text-text-muted group-hover:text-white'}`}>
                                                    {section}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative scroll-smooth pb-20 custom-scrollbar bg-background bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]">
                {/* Breadcrumbs */}
                <div className="px-10 pt-8 pb-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-text-muted uppercase tracking-wide">
                        <span className="hover:text-primary transition-colors cursor-pointer">Dashboard</span>
                        <span className="text-slate-700">/</span>
                        <span className="hover:text-primary transition-colors cursor-pointer">Loan Reviews</span>
                        <span className="text-slate-700">/</span>
                        <span className="text-primary font-bold">Ref #10294</span>
                    </div>
                </div>

                {/* Header */}
                <div className="px-10 py-2 flex flex-wrap justify-between items-end gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-white text-4xl font-display font-bold tracking-tight">Loan Agreement <span className="text-text-muted font-light">#10294</span></h1>
                        <p className="text-text-muted text-sm max-w-2xl">Automated extraction and compliance monitoring against LMA standards. Review flagged deviations before final approval.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 h-10 px-5 rounded bg-surface border border-border text-text-muted hover:text-white hover:border-text-muted transition-all text-sm font-medium">
                            <Download size={18} />
                            Export Report
                        </button>
                        <button className="flex items-center gap-2 h-10 px-6 rounded bg-primary hover:bg-primary-hover text-black transition-all text-sm font-bold shadow-glow border border-transparent hover:scale-105 active:scale-95">
                            <CheckCircle size={18} />
                            Approve All
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="px-10 pb-8">
                    <div className="glass-panel rounded-lg p-1">
                        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border">
                            {/* AI Confidence */}
                            <div className="flex items-center gap-5 flex-1 p-5">
                                <div className="relative w-12 h-12 flex-none">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                        <path className="text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                        <path className="text-blue-500 drop-shadow-[0_0_3px_#3b82f6]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="94, 100" strokeLinecap="round" strokeWidth="3"></path>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <FileText className="text-blue-500" size={20} />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-text-muted text-xs font-mono uppercase tracking-wider mb-1">AI Confidence</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-display font-bold text-white">94%</span>
                                        <span className="text-xs text-emerald-500 font-medium">+2% vs avg</span>
                                    </div>
                                </div>
                            </div>

                            {/* Standardization Score */}
                            <div className="flex items-center gap-5 flex-1 p-5">
                                <div className="relative w-12 h-12 flex-none">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                        <path className="text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                        <path className="text-primary drop-shadow-[0_0_3px_#00ff9d]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="85, 100" strokeLinecap="round" strokeWidth="3"></path>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <CheckCircle className="text-primary" size={20} />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-text-muted text-xs font-mono uppercase tracking-wider mb-1">Standardization Score</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-display font-bold text-white">85%</span>
                                        <span className="text-xs text-accent-orange font-medium">Requires Review</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-around flex-1 p-5 bg-white/[0.02]">
                                <div className="text-center">
                                    <p className="text-text-muted text-[10px] uppercase font-bold tracking-wider mb-1">Clauses</p>
                                    <p className="text-white text-xl font-display font-bold">45</p>
                                </div>
                                <div className="w-px h-8 bg-border"></div>
                                <div className="text-center">
                                    <p className="text-primary text-[10px] uppercase font-bold tracking-wider mb-1">Standard</p>
                                    <p className="text-white text-xl font-display font-bold">40</p>
                                </div>
                                <div className="w-px h-8 bg-border"></div>
                                <div className="text-center">
                                    <p className="text-accent-orange text-[10px] uppercase font-bold tracking-wider mb-1">Deviations</p>
                                    <p className="text-white text-xl font-display font-bold">5</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Sections */}
                <div className="px-10 pb-20 space-y-8">

                    {/* Borrower Details Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-4 pl-1">
                            <span className="flex items-center justify-center w-6 h-6 rounded bg-primary/20 text-primary">
                                <Check size={16} />
                            </span>
                            <h3 className="text-white text-lg font-display font-bold tracking-tight">Borrower Details</h3>
                        </div>
                        <div className="glass-panel border border-border rounded-xl p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                {[
                                    { label: 'Entity Name', value: 'Acme Global Logistics Ltd.' },
                                    { label: 'Jurisdiction', value: 'England & Wales' },
                                    { label: 'Registration Number', value: '09283746' },
                                    { label: 'Legal Address', value: '123 Logistics Way, London, EC1A 1BB' }
                                ].map((field, i) => (
                                    <div key={i} className="group">
                                        <label className="text-text-muted text-[11px] font-bold uppercase tracking-wider mb-2 block font-display">{field.label}</label>
                                        <div className="relative">
                                            <input className="w-full bg-background border border-border rounded-lg text-white text-sm px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary transition-all font-mono" type="text" defaultValue={field.value} />
                                            <div className="absolute right-3 top-3 text-primary opacity-50 group-hover:opacity-100 transition-opacity" title="Standard">
                                                <CheckCircle size={18} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Financial Covenants Section */}
                    <section>
                        <div className="flex items-center justify-between mb-4 pl-1">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-accent-orange/20 text-accent-orange animate-pulse">
                                    <AlertTriangle size={16} />
                                </span>
                                <h3 className="text-white text-lg font-display font-bold tracking-tight">Financial Covenants</h3>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative inline-block w-9 h-5 align-middle select-none transition duration-200 ease-in">
                                    <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:bg-primary transition-all duration-300 top-0.5 left-0.5 checked:translate-x-full checked:border-primary" />
                                    <label htmlFor="toggle" className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-800 cursor-pointer border border-gray-700"></label>
                                </div>
                                <span className="text-xs font-medium text-text-muted group-hover:text-white transition-colors">Show PDF Context</span>
                            </label>
                        </div>

                        <div className="glass-panel border border-border rounded-xl overflow-hidden flex flex-col shadow-2xl shadow-black/50">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-border bg-white/5 text-[10px] font-bold uppercase text-text-muted tracking-[0.1em] font-display">
                                <div className="col-span-3">Term Name</div>
                                <div className="col-span-4">Extracted Value</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-3 text-right">Review Actions</div>
                            </div>

                            {/* Row 1: Standard */}
                            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border items-center hover:bg-white/[0.02] transition-colors group">
                                <div className="col-span-3">
                                    <p className="text-white font-medium text-sm">Interest Cover Ratio</p>
                                    <p className="text-slate-600 text-xs mt-0.5 font-mono">Clause 22.1</p>
                                </div>
                                <div className="col-span-4">
                                    <input className="w-full bg-transparent border-b border-transparent hover:border-border focus:border-primary text-slate-300 focus:text-white text-sm py-1 focus:bg-background/50 transition-all font-mono" type="text" defaultValue="4.00:1" />
                                </div>
                                <div className="col-span-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(0,255,157,0.1)]">
                                        LMA Standard
                                    </span>
                                </div>
                                <div className="col-span-3 flex justify-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 rounded hover:bg-white/10 text-text-muted hover:text-white transition-colors" title="View Source">
                                        <Search size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Row 2: Deviation (Expanded) */}
                            <div className="bg-accent-orange/5 border-b border-accent-orange/20 relative">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-orange shadow-[0_0_10px_#f59e0b]"></div>
                                <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center">
                                    <div className="col-span-3">
                                        <p className="text-white font-bold text-sm">Leverage Ratio</p>
                                        <p className="text-accent-orange text-xs mt-0.5 font-mono">Clause 22.2</p>
                                    </div>
                                    <div className="col-span-4">
                                        <div className="relative group/input">
                                            <input className="w-full bg-background border border-accent-orange/40 rounded text-white text-sm px-3 py-2 focus:ring-1 focus:ring-accent-orange focus:border-accent-orange pr-8 font-mono shadow-inner" type="text" defaultValue="4.50:1 (stepping down to 4.00:1)" />
                                            <Edit className="absolute right-2 top-2.5 text-accent-orange" size={16} />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-accent-orange/10 text-accent-orange border border-accent-orange/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                                            Deviation
                                        </span>
                                    </div>
                                    <div className="col-span-3 flex justify-end gap-2">
                                        <button className="flex items-center gap-1 px-3 py-1.5 rounded bg-primary text-black text-xs font-bold hover:bg-primary-hover transition-colors shadow-[0_0_10px_rgba(0,255,157,0.3)]">
                                            Accept
                                        </button>
                                        <button className="flex items-center gap-1 px-3 py-1.5 rounded bg-background border border-border text-slate-300 text-xs font-bold hover:border-accent-red hover:text-accent-red transition-colors">
                                            Flag Issue
                                        </button>
                                    </div>
                                </div>

                                <div className="mx-6 mb-6 rounded-lg border border-border bg-background overflow-hidden flex flex-col md:flex-row shadow-xl">
                                    <div className="flex-1 p-5 border-b md:border-b-0 md:border-r border-border relative">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-20"></div>
                                        <div className="flex justify-between items-center mb-3">
                                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-display">Source Document Text</p>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed font-mono p-3 rounded border border-dashed border-slate-800 bg-black/40">
                                            "...The Leverage Ratio shall not exceed <span className="bg-accent-orange/20 text-accent-orange px-1 rounded ring-1 ring-accent-orange/40">4.50:1</span> in respect of any Relevant Period ending on or before the Termination Date, provided that..."
                                        </p>
                                    </div>
                                    <div className="flex-1 p-5 bg-gradient-to-br from-background to-slate-900/50">
                                        <div className="flex justify-between items-center mb-3">
                                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-display">LMA Standard #LMA-LEV-01</p>
                                        </div>
                                        <p className="text-sm text-slate-400 leading-relaxed border-l-2 border-primary pl-3">
                                            LMA standard typically expects a Leverage Ratio cap of <span className="text-primary font-bold">4.00:1</span> or lower for this facility grade without step-down provisions unless explicitly agreed in the Term Sheet.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Row 3: Standard */}
                            <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors group border-b border-border">
                                <div className="col-span-3">
                                    <p className="text-white font-medium text-sm">Capital Expenditure</p>
                                    <p className="text-slate-600 text-xs mt-0.5 font-mono">Clause 22.4</p>
                                </div>
                                <div className="col-span-4">
                                    <input className="w-full bg-transparent border-b border-transparent hover:border-border focus:border-primary text-slate-300 focus:text-white text-sm py-1 focus:bg-background/50 transition-all font-mono" type="text" defaultValue="£5,000,000 per annum" />
                                </div>
                                <div className="col-span-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(0,255,157,0.1)]">
                                        LMA Standard
                                    </span>
                                </div>
                                <div className="col-span-3 flex justify-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 rounded hover:bg-white/10 text-text-muted hover:text-white transition-colors" title="View Source">
                                        <Search size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Facility Details Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-4 pl-1">
                            <span className="flex items-center justify-center w-6 h-6 rounded bg-primary/20 text-primary">
                                <Check size={16} />
                            </span>
                            <h3 className="text-white text-lg font-display font-bold tracking-tight">Facility Details</h3>
                        </div>
                        <div className="glass-panel border border-border rounded-xl p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="group">
                                    <label className="text-text-muted text-[11px] font-bold uppercase tracking-wider mb-2 block font-display">Currency</label>
                                    <select className="w-full bg-background border border-border rounded-lg text-white text-sm px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary font-mono appearance-none outline-none">
                                        <option>GBP (£)</option>
                                        <option>USD ($)</option>
                                        <option>EUR (€)</option>
                                    </select>
                                </div>
                                <div className="group">
                                    <label className="text-text-muted text-[11px] font-bold uppercase tracking-wider mb-2 block font-display">Total Amount</label>
                                    <div className="relative">
                                        <input className="w-full bg-background border border-border rounded-lg text-white text-sm px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary transition-all font-mono" type="text" defaultValue="150,000,000" />
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="text-text-muted text-[11px] font-bold uppercase tracking-wider mb-2 block font-display">Termination Date</label>
                                    <div className="relative">
                                        <input className="w-full bg-background border border-border rounded-lg text-white text-sm px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary transition-all font-mono" type="text" defaultValue="31 Dec 2028" />
                                        <Calendar className="text-text-muted absolute right-3 top-3" size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};
