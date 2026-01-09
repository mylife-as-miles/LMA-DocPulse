import React from 'react';
import { ViewState } from '../types';
import { motion } from 'framer-motion';
import { ChevronLeft, Download, Eye, FileText, Info, Share2, Printer, Search } from 'lucide-react';
import { useActionFeedback } from '../components/ActionFeedback';

interface DocumentDetailViewProps {
    setView: (view: ViewState) => void;
}

export const DocumentDetailView = ({ setView }: DocumentDetailViewProps) => {
    const { trigger: triggerDownload } = useActionFeedback('Download');
    const { trigger: triggerShare } = useActionFeedback('Share');

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col h-full overflow-hidden bg-background"
        >
            {/* Header */}
            <header className="h-16 border-b border-border bg-surface/50 backdrop-blur px-6 flex items-center justify-between shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setView('vault')}
                        className="p-2 rounded-lg hover:bg-surface-highlight text-text-muted hover:text-white transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-red-500/10 flex items-center justify-center text-red-500">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-sm leading-tight">Loan_Agreement_Alpha_Corp_Signed.pdf</h1>
                            <p className="text-xs text-text-muted">Uploaded 2 hours ago • 4.2 MB</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                     <button
                        onClick={() => triggerShare()}
                        className="p-2 rounded-lg hover:bg-surface-highlight text-text-muted hover:text-white transition-colors" title="Share"
                    >
                        <Share2 size={18} />
                    </button>
                    <button
                        onClick={() => triggerDownload()}
                        className="p-2 rounded-lg hover:bg-surface-highlight text-text-muted hover:text-white transition-colors" title="Download"
                    >
                        <Download size={18} />
                    </button>
                     <button className="p-2 rounded-lg hover:bg-surface-highlight text-text-muted hover:text-white transition-colors" title="Print">
                        <Printer size={18} />
                    </button>
                    <div className="h-6 w-px bg-border mx-2"></div>
                    <button
                        onClick={() => setView('loan_review')}
                        className="px-4 py-2 bg-primary text-black text-xs font-bold rounded-lg hover:bg-primary-hover shadow-glow transition-all"
                    >
                        Go to Analysis
                    </button>
                </div>
            </header>

            {/* Content Container */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* PDF Viewer Mock */}
                <div className="flex-1 bg-[#1a1a1a] p-8 overflow-y-auto flex justify-center custom-scrollbar">
                    <div className="w-full max-w-4xl bg-white min-h-[1000px] shadow-2xl mb-8 relative group">
                        {/* Placeholder Content */}
                        <div className="p-16 space-y-8 font-serif text-slate-800">
                             <div className="text-center mb-12">
                                <h1 className="text-2xl font-bold uppercase tracking-widest mb-4">Facility Agreement</h1>
                                <p className="text-sm text-slate-500">Dated 24 October 2024</p>
                            </div>

                            <p className="leading-loose text-justify text-sm">
                                <strong>THIS AGREEMENT</strong> is made on 24 October 2024 between <strong>ALPHA CORP</strong> as borrower (the "Borrower") and <strong>LMA BANKING GROUP</strong> as lender (the "Lender").
                            </p>

                            <h3 className="text-sm font-bold uppercase mt-8">1. Definitions and Interpretation</h3>
                            <p className="leading-loose text-justify text-sm">
                                1.1 In this Agreement, unless the context otherwise requires, the following terms shall have the meanings ascribed to them below:
                            </p>
                            <p className="pl-8 leading-loose text-justify text-sm italic text-slate-600">
                                "Facility" means the term loan facility made available under this Agreement as described in Clause 2 (The Facility).
                            </p>
                            <p className="pl-8 leading-loose text-justify text-sm italic text-slate-600">
                                "Interest Period" means, in relation to a Loan, each period determined in accordance with Clause 9 (Interest Periods).
                            </p>

                             {/* Highlight overlay */}
                             <div className="absolute top-[350px] left-[60px] right-[60px] h-[60px] bg-yellow-300/20 border border-yellow-400/50 rounded cursor-pointer hover:bg-yellow-300/30 transition-colors group/highlight">
                                <div className="absolute -right-32 top-0 bg-surface border border-border p-2 rounded shadow-xl opacity-0 group-hover/highlight:opacity-100 transition-opacity w-28">
                                    <p className="text-[10px] text-text-muted">Identified as Definition</p>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Info Sidebar */}
                <div className="w-80 border-l border-border bg-surface shrink-0 flex flex-col">
                    <div className="p-4 border-b border-border">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Info size={16} className="text-primary" /> Document Info
                        </h3>
                    </div>
                    <div className="p-4 space-y-6 flex-1 overflow-y-auto">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-text-muted uppercase">Status</p>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border text-primary bg-primary/10 border-primary/20">
                                Analyzed
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-text-muted uppercase">Entities Found</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 rounded bg-surface-highlight border border-border text-xs text-white">Alpha Corp</span>
                                <span className="px-2 py-1 rounded bg-surface-highlight border border-border text-xs text-white">LMA Banking</span>
                            </div>
                        </div>
                         <div className="space-y-1">
                            <p className="text-xs font-bold text-text-muted uppercase">Key Dates</p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-muted">Effective</span>
                                    <span className="text-white font-mono">24 Oct 2024</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-muted">Termination</span>
                                    <span className="text-white font-mono">24 Oct 2029</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
