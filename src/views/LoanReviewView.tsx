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
    FileText,
    PenTool,
    User,
    ChevronLeft
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { ViewState } from '../types';

interface LoanReviewViewProps {
    loanId?: string;
    setView?: (view: ViewState) => void;
}

export const LoanReviewView = ({ loanId, setView }: LoanReviewViewProps) => {
    const [activeSection, setActiveSection] = useState('summary');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const loan = useLiveQuery(() => loanId ? db.loans.get(loanId) : Promise.resolve(undefined), [loanId]);

    const renderEmptyState = (section: string) => (
        <div className="px-10 pb-8 flex flex-col items-center justify-center min-h-[400px] text-center opacity-70">
            <div className="p-4 rounded-full bg-surface-highlight mb-4">
                <FileText size={32} className="text-text-muted" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Data for {section}</h3>
            <p className="text-text-muted max-w-sm">
                Detailed extraction data is not available for this loan record. This is a simplified view based on the loan registry.
            </p>
        </div>
    );

    const renderSummary = () => (
        <div className="px-10 pb-8 space-y-8 animate-fade-in">
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
                            <label className="text-text-muted text-[11px] font-bold uppercase tracking-wider mb-2 block font-display">Type</label>
                            <div className="text-white text-sm font-mono p-3 bg-surface-highlight rounded border border-border">
                                {loan?.type || 'N/A'}
                            </div>
                        </div>
                        <div className="group">
                            <label className="text-text-muted text-[11px] font-bold uppercase tracking-wider mb-2 block font-display">Total Amount</label>
                            <div className="text-white text-sm font-mono p-3 bg-surface-highlight rounded border border-border">
                                {loan?.amount || 'N/A'}
                            </div>
                        </div>
                        <div className="group">
                            <label className="text-text-muted text-[11px] font-bold uppercase tracking-wider mb-2 block font-display">Deadline</label>
                             <div className="text-white text-sm font-mono p-3 bg-surface-highlight rounded border border-border flex justify-between items-center">
                                {loan?.deadline || 'N/A'}
                                <Calendar className="text-text-muted" size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );

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

                                return (
                                    <div
                                        key={idx}
                                        className={`
                                            flex items-center justify-between rounded-lg cursor-pointer group z-10 relative
                                            ${isSidebarOpen ? 'px-3 py-2' : 'p-2 justify-center'}
                                            ${isActive ? 'bg-surface-highlight border border-border' : 'hover:bg-surface-highlight'}
                                        `}
                                        title={!isSidebarOpen ? section : ''}
                                        onClick={() => setActiveSection(sectionId)}
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


                {/* Header */}
                <div className="px-10 py-2 flex flex-wrap justify-between items-end gap-6 mb-8 mt-4">
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => setView && setView('loan_reviews')}
                            className="flex items-center gap-1 text-text-muted hover:text-white transition-colors text-sm mb-2"
                        >
                            <ChevronLeft size={16} /> Back to List
                        </button>
                        <h1 className="text-white text-4xl font-display font-bold tracking-tight">Loan Agreement <span className="text-text-muted font-light">{loan.id}</span></h1>
                        <p className="text-text-muted text-sm max-w-2xl">{loan.counterparty} - {loan.type}</p>
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

                {/* Content Rendering based on active section */}
                {activeSection === 'summary' ? renderSummary() : renderEmptyState(activeSection.replace(/-/g, ' '))}

            </main>
        </div>
    );
};
