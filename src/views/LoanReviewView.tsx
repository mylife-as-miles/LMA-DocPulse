import React, { useState, useEffect } from 'react';
import {
    CheckCircle,
    Download,
    Calendar,
    Edit,
    AlertTriangle,
    Check,
    Search,
    ChevronDown,
    FileText,
    PenTool,
    User,
    ChevronLeft,
    Shield,
    Activity,
    Flag,
    MoreHorizontal
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { ViewState, Loan, ReviewData, Covenant } from '../types';

interface LoanReviewViewProps {
    loanId?: string;
    setView?: (view: ViewState) => void;
}

export const LoanReviewView = ({ loanId, setView }: LoanReviewViewProps) => {
    const [activeSection, setActiveSection] = useState('summary');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const loan = useLiveQuery(() => loanId ? db.loans.get(loanId) : Promise.resolve(undefined), [loanId]);

    // Scroll handling for active section highlighting
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['summary', 'borrower-details', 'financial-covenants', 'events-of-default', 'signatures'];
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top <= 300) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        const mainElement = document.querySelector('main');
        if (mainElement) {
            mainElement.addEventListener('scroll', handleScroll);
            return () => mainElement.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(sectionId);
        }
    };

    if (!loan) {
        return (
            <div className="flex-1 flex items-center justify-center text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Loan Not Found</h2>
                    <button
                        onClick={() => setView && setView('loan_reviews')}
                        className="text-primary hover:underline"
                    >
                        Return to List
                    </button>
                </div>
            </div>
        );
    }

    const reviewData = loan.reviewData as ReviewData | undefined;

    // Helper to calculate color for confidence/score
    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-primary';
        if (score >= 70) return 'text-accent-orange';
        return 'text-red-500';
    };

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
                                const sectionId = section.toLowerCase().replace(/ /g, '-');
                                const isActive = activeSection === sectionId;

                                // Status Colors based on section analysis (mock logic for demo if data missing)
                                let statusColor = 'bg-primary shadow-[0_0_6px_#00ff9d]';
                                if (section === 'Financial Covenants' && reviewData?.clauseStats?.deviations > 0) {
                                    statusColor = 'bg-accent-orange shadow-[0_0_6px_#f59e0b]';
                                } else if (section === 'Events of Default') {
                                     statusColor = 'bg-red-500 shadow-[0_0_6px_#ef4444]';
                                } else if (section === 'Signatures') {
                                    statusColor = 'bg-text-muted';
                                }

                                return (
                                    <div
                                        key={idx}
                                        className={`
                                            flex items-center justify-between rounded-lg cursor-pointer group z-10 relative
                                            ${isSidebarOpen ? 'px-3 py-2' : 'p-2 justify-center'}
                                            ${isActive ? 'bg-surface-highlight border border-border' : 'hover:bg-surface-highlight'}
                                        `}
                                        title={!isSidebarOpen ? section : ''}
                                        onClick={() => scrollToSection(sectionId)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`flex items-center justify-center w-5 h-5 bg-background border rounded-full transition-colors shrink-0 ${isActive ? 'border-white' : 'border-border group-hover:border-primary'}`}>
                                                <span className={`w-2 h-2 rounded-full ${statusColor}`}></span>
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

                {/* Header */}
                <div className="px-10 py-6 sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-white/5 flex flex-wrap justify-between items-end gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-text-muted text-xs uppercase tracking-wider font-display">
                            <span onClick={() => setView && setView('dashboard')} className="cursor-pointer hover:text-white">Dashboard</span>
                            <span>/</span>
                            <span onClick={() => setView && setView('loan_reviews')} className="cursor-pointer hover:text-white">Loan Reviews</span>
                            <span>/</span>
                            <span className="text-primary">REF #{loan.id}</span>
                        </div>
                        <h1 className="text-white text-3xl font-display font-bold tracking-tight">Loan Agreement <span className="text-text-muted font-light">#{loan.id}</span></h1>
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

                <div className="px-10 space-y-8 pb-20">

                    {/* Metrics Section (Summary) */}
                    <section id="summary" className="scroll-mt-32">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* AI Confidence Card */}
                            <div className="glass-panel border border-border rounded-xl p-6 flex items-center gap-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Activity size={64} className="text-primary" />
                                </div>
                                <div className="relative w-20 h-20 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-surface-highlight" />
                                        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent"
                                            strokeDasharray={226}
                                            strokeDashoffset={226 - (226 * (reviewData?.confidenceScore || 94)) / 100}
                                            className={`${getScoreColor(reviewData?.confidenceScore || 94)} transition-all duration-1000 ease-out`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <Activity className={`absolute ${getScoreColor(reviewData?.confidenceScore || 94)}`} size={24} />
                                </div>
                                <div>
                                    <div className="text-text-muted text-[10px] font-bold uppercase tracking-wider mb-1">AI Confidence</div>
                                    <div className="text-3xl font-bold text-white mb-1">{reviewData?.confidenceScore || 94}%</div>
                                    <div className="text-primary text-xs font-medium">+2% vs avg</div>
                                </div>
                            </div>

                            {/* Standardization Score Card */}
                            <div className="glass-panel border border-border rounded-xl p-6 flex items-center gap-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Shield size={64} className="text-accent-orange" />
                                </div>
                                <div className={`w-16 h-16 rounded-full bg-surface-highlight flex items-center justify-center border-2 ${getScoreColor(reviewData?.standardizationScore || 85)} border-opacity-50`}>
                                    <Shield className={getScoreColor(reviewData?.standardizationScore || 85)} size={32} />
                                </div>
                                <div>
                                    <div className="text-text-muted text-[10px] font-bold uppercase tracking-wider mb-1">Standardization Score</div>
                                    <div className="text-3xl font-bold text-white mb-1">{reviewData?.standardizationScore || 85}%</div>
                                    <div className="text-accent-orange text-xs font-medium">Requires Review</div>
                                </div>
                            </div>

                            {/* Clauses Stats Card */}
                            <div className="glass-panel border border-border rounded-xl p-6 flex flex-col justify-center relative overflow-hidden">
                                <div className="flex justify-between items-center text-center">
                                    <div>
                                        <div className="text-text-muted text-[10px] font-bold uppercase tracking-wider mb-2">Clauses</div>
                                        <div className="text-2xl font-bold text-white">{reviewData?.clauseStats?.total || 45}</div>
                                    </div>
                                    <div className="w-px h-10 bg-border"></div>
                                    <div>
                                        <div className="text-text-muted text-[10px] font-bold uppercase tracking-wider mb-2">Standard</div>
                                        <div className="text-2xl font-bold text-primary">{reviewData?.clauseStats?.standard || 40}</div>
                                    </div>
                                    <div className="w-px h-10 bg-border"></div>
                                    <div>
                                        <div className="text-text-muted text-[10px] font-bold uppercase tracking-wider mb-2">Deviations</div>
                                        <div className="text-2xl font-bold text-accent-orange">{reviewData?.clauseStats?.deviations || 5}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Borrower Details Section */}
                    <section id="borrower-details" className="scroll-mt-32">
                        <div className="flex items-center gap-3 mb-4">
                             <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-primary">
                                <Check size={14} />
                             </div>
                             <h3 className="text-white text-lg font-display font-bold">Borrower Details</h3>
                        </div>
                        <div className="glass-panel border border-border rounded-xl p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Entity Name */}
                                <div className="p-4 bg-surface rounded-lg border border-white/5 relative group hover:border-white/10 transition-colors">
                                    <label className="text-text-muted text-[10px] font-bold uppercase tracking-wider mb-2 block">Entity Name</label>
                                    <div className="text-white font-mono text-lg">{reviewData?.borrowerDetails?.entityName || 'Acme Global Logistics Ltd.'}</div>
                                    <div className="absolute top-4 right-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity">
                                        <CheckCircle size={18} />
                                    </div>
                                </div>
                                {/* Jurisdiction */}
                                <div className="p-4 bg-surface rounded-lg border border-white/5 relative group hover:border-white/10 transition-colors">
                                    <label className="text-text-muted text-[10px] font-bold uppercase tracking-wider mb-2 block">Jurisdiction</label>
                                    <div className="text-white font-mono text-lg">{reviewData?.borrowerDetails?.jurisdiction || 'England & Wales'}</div>
                                    <div className="absolute top-4 right-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity">
                                        <CheckCircle size={18} />
                                    </div>
                                </div>
                                {/* Registration Number */}
                                <div className="p-4 bg-surface rounded-lg border border-white/5 relative group hover:border-white/10 transition-colors">
                                    <label className="text-text-muted text-[10px] font-bold uppercase tracking-wider mb-2 block">Registration Number</label>
                                    <div className="text-white font-mono text-lg">{reviewData?.borrowerDetails?.registrationNumber || '09283746'}</div>
                                    <div className="absolute top-4 right-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity">
                                        <CheckCircle size={18} />
                                    </div>
                                </div>
                                {/* Legal Address */}
                                <div className="p-4 bg-surface rounded-lg border border-white/5 relative group hover:border-white/10 transition-colors">
                                    <label className="text-text-muted text-[10px] font-bold uppercase tracking-wider mb-2 block">Legal Address</label>
                                    <div className="text-white font-mono text-lg">{reviewData?.borrowerDetails?.legalAddress || '123 Logistics Way, London, EC1A 1BB'}</div>
                                    <div className="absolute top-4 right-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity">
                                        <CheckCircle size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Financial Covenants Section */}
                    <section id="financial-covenants" className="scroll-mt-32">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded bg-accent-orange/20 flex items-center justify-center text-accent-orange">
                                    <AlertTriangle size={14} />
                                </div>
                                <h3 className="text-white text-lg font-display font-bold">Financial Covenants</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-text-muted text-sm">Show PDF Context</span>
                                <div className="w-10 h-5 bg-surface-highlight rounded-full relative cursor-pointer border border-border">
                                    <div className="absolute left-1 top-1 w-3 h-3 bg-text-muted rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel border border-border rounded-xl overflow-hidden">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-surface-highlight/50 text-text-muted text-[10px] font-bold uppercase tracking-wider">
                                <div className="col-span-4">Term Name</div>
                                <div className="col-span-4">Extracted Value</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-2 text-right">Review Actions</div>
                            </div>

                            {/* Table Rows */}
                            {reviewData?.financialCovenants && reviewData.financialCovenants.length > 0 ? (
                                reviewData.financialCovenants.map((covenant, idx) => (
                                    <div key={idx} className={`grid grid-cols-12 gap-4 p-5 border-b border-white/5 items-center hover:bg-white/[0.02] transition-colors ${covenant.status === 'DEVIATION' ? 'bg-accent-orange/5' : ''}`}>
                                        <div className="col-span-4">
                                            <div className="text-white font-bold mb-1">{covenant.termName}</div>
                                            <div className="text-text-muted text-xs">{covenant.clauseRef}</div>
                                        </div>
                                        <div className="col-span-4">
                                            <div className="flex items-center gap-2 group">
                                                <span className="text-white font-mono bg-black/30 px-2 py-1 rounded border border-white/5">
                                                    {covenant.value}
                                                </span>
                                                {covenant.description && (
                                                    <span className="text-text-muted text-xs italic">{covenant.description}</span>
                                                )}
                                                <Edit size={14} className="text-text-muted opacity-0 group-hover:opacity-100 cursor-pointer hover:text-white transition-opacity" />
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold tracking-wider border ${
                                                covenant.status === 'DEVIATION'
                                                ? 'bg-accent-orange/10 text-accent-orange border-accent-orange/20'
                                                : 'bg-primary/10 text-primary border-primary/20'
                                            }`}>
                                                {covenant.status}
                                            </span>
                                        </div>
                                        <div className="col-span-2 flex justify-end gap-2">
                                            {covenant.status === 'DEVIATION' ? (
                                                <>
                                                    <button className="h-8 px-3 rounded bg-primary text-black text-xs font-bold hover:bg-primary-hover transition-colors">
                                                        Accept
                                                    </button>
                                                    <button className="h-8 px-3 rounded border border-border text-text-muted text-xs hover:text-white hover:border-white transition-colors">
                                                        Flag Issue
                                                    </button>
                                                </>
                                            ) : (
                                                <button className="p-2 rounded hover:bg-white/5 text-text-muted hover:text-white transition-colors">
                                                    <Search size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-text-muted">No covenants extracted.</div>
                            )}
                        </div>
                    </section>

                    {/* Placeholder for Events of Default if data exists */}
                    {reviewData?.eventsOfDefault && (
                        <section id="events-of-default" className="scroll-mt-32">
                             <div className="flex items-center gap-3 mb-4">
                                <div className="w-6 h-6 rounded bg-red-500/20 flex items-center justify-center text-red-500">
                                    <AlertTriangle size={14} />
                                </div>
                                <h3 className="text-white text-lg font-display font-bold">Events of Default</h3>
                             </div>
                             <div className="glass-panel border border-border rounded-xl p-6">
                                <pre className="text-white text-sm whitespace-pre-wrap font-sans">{JSON.stringify(reviewData.eventsOfDefault, null, 2)}</pre>
                             </div>
                        </section>
                    )}

                    {/* Placeholder for Signatures */}
                    <section id="signatures" className="scroll-mt-32">
                         <div className="flex items-center gap-3 mb-4">
                                <div className="w-6 h-6 rounded bg-surface-highlight flex items-center justify-center text-text-muted">
                                    <PenTool size={14} />
                                </div>
                                <h3 className="text-white text-lg font-display font-bold">Signatures</h3>
                             </div>
                             <div className="glass-panel border border-border rounded-xl p-6">
                                <p className="text-text-muted">Signature verification status available in full report.</p>
                             </div>
                    </section>
                </div>
            </main>
        </div>
    );
};
