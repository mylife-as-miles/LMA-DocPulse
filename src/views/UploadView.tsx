import React, { useState } from 'react';
import {
    UploadCloud,
    FileText,
    X,
    File as FileIcon,
    CheckCircle2,
    Trash2,
    Image as ImageIcon,
    Bot,
    Info,
    Lock
} from 'lucide-react';
import { ViewState, Doc, QueueItem } from '../types';

interface UploadViewProps {
    setView: (v: ViewState) => void;
    onUploadComplete: (newDocs: Doc[]) => void;
}

export const UploadView = ({ setView, onUploadComplete }: UploadViewProps) => {
    const [dragActive, setDragActive] = useState(false);
    const [queue, setQueue] = useState<QueueItem[]>([]);

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
