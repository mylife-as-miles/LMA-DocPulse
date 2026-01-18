import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ChevronLeft, Download, Eye, FileText, Info, Share2, Printer, Search } from 'lucide-react';
import { useActionFeedback } from '../components/ActionFeedback';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// ... imports

interface DocumentDetailViewProps {
    setView: (view: ViewState) => void;
    docId?: number;
    onSelectLoan?: (id: string) => void;
}

export const DocumentDetailView = ({ setView, docId, onSelectLoan }: DocumentDetailViewProps) => {
    // ... hooks

    const handleGoToAnalysis = async () => {
        if (!doc || !onSelectLoan) return;

        // Check if a loan already exists for this document (mock logic: check by matching generated ID or similar)
        // For this demo, we'll try to find a loan that matches the doc name OR create a new one.
        const loanIdRaw = `LN-${new Date().getFullYear()}-${doc.id || Math.floor(Math.random() * 1000)}`;
        const loanId = `#${loanIdRaw}`;

        const existingLoan = await db.loans.get(loanId);

        if (!existingLoan) {
            // Create a new loan record from the document
            await db.loans.add({
                id: loanId,
                counterparty: doc.entities?.[0] || 'Unknown Counterparty',
                amount: doc.entities?.find(e => e.includes('$') || e.includes('£')) || '$0.00',
                type: 'Syndicated Term Loan', // Default for demo
                status: 'In Review',
                date: doc.date,
                risk: 'Medium', // Initial assessment
                reviewData: {
                    summary: 'Automated initial analysis complete. pending human review.',
                    confidenceScore: 88,
                    standardizationScore: 92,
                    clauseStats: { total: 45, standard: 42, deviations: 3 },
                    borrowerDetails: {
                        entityName: doc.entities?.[0] || 'Unknown Entity',
                        jurisdiction: 'United Kingdom',
                        registrationNumber: 'Pending',
                        legalAddress: 'Pending extraction'
                    },
                    financialCovenants: [
                        { termName: "Leverage Ratio", clauseRef: "Clause 22.1", value: "3.50x", status: 'LMA STANDARD' },
                        { termName: "Interest Cover", clauseRef: "Clause 22.2", value: "4.00x", status: 'LMA STANDARD' }
                    ]
                }
            });
            toast.success("Analysis Generated", { description: "New loan record created from document." });
        }

        onSelectLoan(loanId);
        setView('loan_review');
    };

    // ... render
// ...
                    <div className="h-6 w-px bg-border mx-2"></div>
                    <button
                        onClick={handleGoToAnalysis}
                        className="px-4 py-2 bg-primary text-black text-xs font-bold rounded-lg hover:bg-primary-hover shadow-glow transition-all"
                    >
                        Go to Analysis
                    </button>
                </div >
            </header >
    // ...

    {/* Content Container */ }
    < div className = "flex-1 flex overflow-hidden relative" >
        {/* PDF Viewer */ }
        < div className = "flex-1 bg-[#1a1a1a] p-8 overflow-y-auto flex justify-center custom-scrollbar" >
            <div className="w-full max-w-4xl bg-white min-h-[1000px] shadow-2xl mb-8 relative group text-slate-800">
                {doc.type === 'PDF' && fileUrl ? (
                    <Document
                        file={fileUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        className="flex flex-col items-center"
                    >
                        <Page
                            pageNumber={1}
                            width={800} // Fixed width for consistency
                            className="mb-4 shadow-sm"
                        />
                        {numPages && numPages > 1 && (
                            <p className="text-gray-500 text-sm mt-4">Showing page 1 of {numPages}</p>
                        )}
                    </Document>
                ) : doc.type === 'DOCX' ? (
                    <div className="p-10 flex flex-col items-center justify-center h-full">
                        <FileText size={64} className="text-blue-500 mb-4" />
                        <h2 className="text-xl font-bold">DOCX Preview Not Supported</h2>
                        <p className="text-slate-500 mt-2">Please download the file to view its contents.</p>
                        <button onClick={handleDownload} className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Download File</button>
                    </div>
                ) : (
                    <div className="p-10 flex flex-col items-center justify-center h-full">
                        <FileText size={64} className="text-slate-400 mb-4" />
                        <h2 className="text-xl font-bold">Preview Not Available</h2>
                        <p className="text-slate-500 mt-2">No preview available for this file type.</p>
                    </div>
                )}
            </div>
                </div >

    {/* Info Sidebar */ }
    < div className = "w-80 border-l border-border bg-surface shrink-0 flex flex-col" >
                    <div className="p-4 border-b border-border">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Info size={16} className="text-primary" /> Document Info
                        </h3>
                    </div>
                    <div className="p-4 space-y-6 flex-1 overflow-y-auto">
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-text-muted uppercase">Status</p>
                            <div className="flex flex-col gap-2">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border w-fit
                                    ${doc.status === 'Analyzed' ? 'text-primary bg-primary/10 border-primary/20' :
                                    doc.status === 'Review' ? 'text-accent-orange bg-accent-orange/10 border-accent-orange/20' :
                                    'text-text-muted bg-surface-highlight border-border'}`}>
                                    {doc.status}
                                </span>
                                {doc.status !== 'Analyzed' && (
                                    <button
                                        onClick={handleApprove}
                                        className="text-xs bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-3 py-1.5 rounded transition-colors"
                                    >
                                        Mark as Analyzed
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-text-muted uppercase">Entities Found</p>
                            <div className="flex flex-wrap gap-2">
                                {doc.entities && doc.entities.length > 0 ? (
                                    doc.entities.map((entity, idx) => (
                                        <span key={idx} className="px-2 py-1 rounded bg-surface-highlight border border-border text-xs text-white">
                                            {entity}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-text-muted italic">No entities found</span>
                                )}
                            </div>
                        </div>
                         <div className="space-y-1">
                            <p className="text-xs font-bold text-text-muted uppercase">Key Dates</p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-muted">Effective</span>
                                    <span className="text-white font-mono">{doc.date}</span>
                                </div>
                                {/* Mock termination date since we don't have it yet */}
                                {/* <div className="flex justify-between text-sm">
                                    <span className="text-text-muted">Termination</span>
                                    <span className="text-white font-mono">-</span>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </motion.div >
    );
};
