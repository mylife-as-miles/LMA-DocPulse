import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { motion } from 'framer-motion';
import { ChevronLeft, Download, Eye, FileText, Info, Share2, Printer, Search } from 'lucide-react';
import { useActionFeedback } from '../components/ActionFeedback';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface DocumentDetailViewProps {
    setView: (view: ViewState) => void;
    docId?: number;
}

export const DocumentDetailView = ({ setView, docId }: DocumentDetailViewProps) => {
    const { trigger: triggerDownload } = useActionFeedback('Download');
    const { trigger: triggerShare } = useActionFeedback('Share');

    const doc = useLiveQuery(() => docId ? db.docs.get(docId) : Promise.resolve(undefined), [docId]);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    useEffect(() => {
        if (doc && doc.fileData) {
            const url = URL.createObjectURL(doc.fileData);
            setFileUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [doc]);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const handleApprove = async () => {
        if (doc && doc.id) {
            await db.docs.update(doc.id, { status: 'Analyzed' });
        }
    };

    const handleDownload = () => {
        if (fileUrl && doc) {
            triggerDownload();
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = doc.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleShare = async () => {
        triggerShare();
        if (navigator.share && doc) {
            try {
                await navigator.share({
                    title: doc.name,
                    text: 'Shared from DocPulse',
                    url: window.location.href, // Or generate a specific link if we had a backend
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
             // Fallback
             alert('Share feature not supported on this browser or context.');
        }
    };

    const handlePrint = () => {
        if (fileUrl) {
            const printWindow = window.open(fileUrl);
            if (printWindow) {
                printWindow.print();
            }
        }
    };

    if (!doc) {
        return <div className="flex items-center justify-center h-full text-white">Loading...</div>;
    }

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
                            <h1 className="text-white font-bold text-sm leading-tight">{doc.name}</h1>
                            <p className="text-xs text-text-muted">Uploaded {doc.date} • {doc.size}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                     <button
                        onClick={handleShare}
                        className="p-2 rounded-lg hover:bg-surface-highlight text-text-muted hover:text-white transition-colors" title="Share"
                    >
                        <Share2 size={18} />
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-2 rounded-lg hover:bg-surface-highlight text-text-muted hover:text-white transition-colors" title="Download"
                    >
                        <Download size={18} />
                    </button>
                     <button
                        onClick={handlePrint}
                        className="p-2 rounded-lg hover:bg-surface-highlight text-text-muted hover:text-white transition-colors" title="Print"
                    >
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
                {/* PDF Viewer */}
                <div className="flex-1 bg-[#1a1a1a] p-8 overflow-y-auto flex justify-center custom-scrollbar">
                    <div className="w-full max-w-4xl bg-white min-h-[1000px] shadow-2xl mb-8 relative group text-slate-800">
                         {doc.type === 'PDF' && fileUrl ? (
                            <Document
                                file={fileUrl}
                                onLoadSuccess={onDocumentLoadSuccess}
                                className="flex flex-col items-center"
                            >
                                {Array.from(new Array(numPages), (el, index) => (
                                    <Page
                                        key={`page_${index + 1}`}
                                        pageNumber={index + 1}
                                        width={800} // Fixed width for consistency
                                        className="mb-4 shadow-sm"
                                    />
                                ))}
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
                <div className="w-80 border-l border-border bg-surface shrink-0 flex flex-col">
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
                </div>
            </div>
        </motion.div>
    );
};
