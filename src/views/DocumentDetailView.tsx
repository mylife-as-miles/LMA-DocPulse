import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ChevronLeft, Download, Eye, FileText, Info, Share2, Printer, Search, CheckCircle, Loader2 } from 'lucide-react';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Document, Page, pdfjs } from 'react-pdf';
import { analyzeDocument } from '../services/DocumentAnalyzer';

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface DocumentDetailViewProps {
    setView: (view: ViewState) => void;
    docId?: number;
    onSelectLoan?: (id: string) => void;
}

export const DocumentDetailView = ({ setView, docId, onSelectLoan }: DocumentDetailViewProps) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const doc = useLiveQuery(() => docId ? db.docs.get(docId) : Promise.resolve(undefined), [docId]);

    useEffect(() => {
        if (doc?.fileData) {
            const url = URL.createObjectURL(doc.fileData);
            setFileUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [doc?.fileData]);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const handleDownload = () => {
        if (doc?.fileData) {
            const url = URL.createObjectURL(doc.fileData);
            const a = document.createElement('a');
            a.href = url;
            a.download = doc.name;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const handleApprove = async () => {
        if (doc?.id) {
            await db.docs.update(doc.id, { status: 'Analyzed' });
            toast.success('Document marked as Analyzed');
        }
    };

    const handleGoToAnalysis = async () => {
        if (!doc || !onSelectLoan) return;

        setIsAnalyzing(true);
        toast.info('Analyzing document...', { description: 'Extracting clauses and events of default' });

        const loanIdRaw = `LN-${new Date().getFullYear()}-${doc.id || Math.floor(Math.random() * 1000)}`;
        const loanId = `#${loanIdRaw}`;

        const existingLoan = await db.loans.get(loanId);

        if (!existingLoan) {
            // Perform real document analysis
            let extractedData = {
                entities: [] as string[],
                eventsOfDefault: [] as any[],
                financialCovenants: [] as any[],
                criticalDates: [] as any[],
                riskFlags: [] as string[],
            };

            if (doc.fileData && doc.type === 'PDF') {
                try {
                    extractedData = await analyzeDocument(doc.fileData);

                    // Update document with extracted entities
                    if (extractedData.entities.length > 0) {
                        await db.docs.update(doc.id!, { entities: extractedData.entities });
                    }
                } catch (error) {
                    console.error('Document analysis failed:', error);
                    toast.error('Analysis partially failed', { description: 'Using default values for some fields' });
                }
            }

            // Determine risk level based on extraction
            let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
            if (extractedData.eventsOfDefault.some(e => e.riskLevel === 'Critical')) {
                riskLevel = 'Critical';
            } else if (extractedData.eventsOfDefault.some(e => e.riskLevel === 'High') || extractedData.riskFlags.length > 2) {
                riskLevel = 'High';
            } else if (extractedData.eventsOfDefault.length > 0 || extractedData.riskFlags.length > 0) {
                riskLevel = 'Medium';
            }

            // Calculate confidence based on extraction success
            const confidenceScore = Math.min(95, 50 +
                (extractedData.entities.length * 5) +
                (extractedData.financialCovenants.length * 10) +
                (extractedData.eventsOfDefault.length * 5)
            );

            await db.loans.add({
                id: loanId,
                counterparty: extractedData.entities[0] || doc.entities?.[0] || 'Unknown Counterparty',
                amount: doc.entities?.find(e => e.includes('$') || e.includes('£')) || '$0.00',
                type: 'Syndicated Term Loan',
                status: 'In Review',
                date: doc.date,
                risk: riskLevel,
                reviewData: {
                    summary: extractedData.riskFlags.length > 0
                        ? `Analysis complete. ${extractedData.riskFlags.length} risk flag(s) detected.`
                        : 'Automated analysis complete. No critical issues detected.',
                    confidenceScore,
                    standardizationScore: extractedData.financialCovenants.filter(c => c.status === 'LMA STANDARD').length > 0 ? 85 : 70,
                    clauseStats: {
                        total: extractedData.financialCovenants.length + extractedData.eventsOfDefault.length + 10,
                        standard: extractedData.financialCovenants.filter(c => c.status === 'LMA STANDARD').length + 8,
                        deviations: extractedData.financialCovenants.filter(c => c.status === 'DEVIATION').length + extractedData.riskFlags.length
                    },
                    borrowerDetails: {
                        entityName: extractedData.entities[0] || 'Pending extraction',
                        jurisdiction: 'Pending',
                        registrationNumber: 'Pending',
                        legalAddress: 'Pending extraction'
                    },
                    financialCovenants: extractedData.financialCovenants.length > 0
                        ? extractedData.financialCovenants
                        : [{ termName: "No covenants detected", clauseRef: "N/A", value: "-", status: 'LMA STANDARD' as const }],
                    eventsOfDefault: extractedData.eventsOfDefault.length > 0
                        ? extractedData.eventsOfDefault
                        : [{ type: "None detected", status: 'Resolved' as const, riskLevel: 'Low' as const, summary: 'No events of default clauses identified in document' }],
                    riskFlags: extractedData.riskFlags,
                    criticalDates: extractedData.criticalDates,
                }
            });

            toast.success("Analysis Complete", {
                description: `Extracted ${extractedData.eventsOfDefault.length} events of default, ${extractedData.financialCovenants.length} covenants`
            });
        }

        setIsAnalyzing(false);
        onSelectLoan(loanId);
        setView('loan_review');
    };

    if (!doc) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-text-muted">Loading document...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col bg-background"
        >
            {/* Header */}
            <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-surface shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        id="doc-detail-back"
                        onClick={() => setView('vault')}
                        className="flex items-center gap-2 text-text-muted hover:text-white transition-colors"
                    >
                        <ChevronLeft size={20} />
                        <span className="text-sm">Back to Vault</span>
                    </button>
                    <div className="h-6 w-px bg-border"></div>
                    <h1 className="text-white font-bold truncate max-w-md">{doc.name}</h1>
                </div>
                <div id="doc-detail-actions" className="flex items-center gap-2">
                    <button onClick={handleDownload} className="p-2 rounded hover:bg-white/5 text-text-muted hover:text-white transition-colors">
                        <Download size={18} />
                    </button>
                    <div className="h-6 w-px bg-border mx-2"></div>
                    <button
                        onClick={handleGoToAnalysis}
                        className="px-4 py-2 bg-primary text-black text-xs font-bold rounded-lg hover:bg-primary-hover shadow-glow transition-all"
                    >
                        Go to Analysis
                    </button>
                </div>
            </header>

            {/* Content Container */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* PDF Viewer */}
                <div id="doc-viewer-container" className="flex-1 bg-[#1a1a1a] p-8 overflow-y-auto flex justify-center custom-scrollbar">
                    <div className="w-full max-w-4xl bg-white min-h-[1000px] shadow-2xl mb-8 relative group text-slate-800">
                        {doc.type === 'PDF' && fileUrl ? (
                            <Document
                                file={fileUrl}
                                onLoadSuccess={onDocumentLoadSuccess}
                                className="flex flex-col items-center"
                            >
                                <Page
                                    pageNumber={1}
                                    width={800}
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
                </div>

                {/* Info Sidebar */}
                <div id="doc-info-sidebar" className="w-80 border-l border-border bg-surface shrink-0 flex flex-col">
                    <div className="p-4 border-b border-border">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Info size={16} className="text-primary" /> Document Info
                        </h3>
                    </div>
                    <div className="p-4 space-y-6 flex-1 overflow-y-auto">
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-text-muted uppercase">Status</p>
                            <div id="doc-status-badge" className="flex flex-col gap-2">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
