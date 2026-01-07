import React from 'react';
import { Plus, Files, TrendingUp, CheckCircle2, Filter, FileText, File as FileIcon, ChevronRight } from 'lucide-react';
import { ViewState, Doc } from '../types';

interface DocumentVaultViewProps {
    setView: (v: ViewState) => void;
    docs: Doc[];
}

export const DocumentVaultView = ({ setView, docs }: DocumentVaultViewProps) => (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2 custom-scrollbar">
        <div className="mx-auto max-w-[1600px] flex flex-col gap-6">

            {/* Header for Vault */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold font-display text-white">Document Vault</h2>
                    <p className="text-xs text-text-muted mt-1">Manage and analyze your legal documents.</p>
                </div>
                <button
                    onClick={() => setView('upload')}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-black hover:shadow-glow-sm transition-all"
                >
                    <Plus size={18} />
                    New Analysis
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-text-muted">Total Documents</p>
                        <h3 className="text-2xl font-display font-bold text-white mt-1">{docs.length}</h3>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Files size={20} />
                    </div>
                </div>
                <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-text-muted">Analyzed this week</p>
                        <h3 className="text-2xl font-display font-bold text-white mt-1">24</h3>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-surface-highlight text-text-muted flex items-center justify-center">
                        <TrendingUp size={20} />
                    </div>
                </div>
                <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-text-muted">Storage Used</p>
                        <h3 className="text-2xl font-display font-bold text-white mt-1">45%</h3>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-surface-highlight text-text-muted flex items-center justify-center">
                        <CheckCircle2 size={20} />
                    </div>
                </div>
            </div>

            {/* Main List */}
            <div className="glass-panel rounded-2xl overflow-hidden flex flex-col flex-1 min-h-[500px]">
                <div className="border-b border-border px-6 py-5 flex items-center justify-between bg-surface/30">
                    <h3 className="text-lg font-display font-bold text-white">Recent Files</h3>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-muted hover:text-white transition-all">
                            <Filter size={14} />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-surface text-xs uppercase text-text-muted font-semibold tracking-wider border-b border-border">
                            <tr>
                                <th className="px-6 py-4 w-12"></th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date Uploaded</th>
                                <th className="px-6 py-4">Size</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-white">
                            {docs.map((doc, idx) => (
                                <tr key={idx} className="hover:bg-surface-highlight/40 transition-colors group cursor-pointer">
                                    <td className="px-6 py-4 text-text-muted">
                                        {doc.type === 'PDF' ? <FileText size={20} /> : <FileIcon size={20} />}
                                    </td>
                                    <td className="px-6 py-4 font-medium">{doc.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-[10px] font-bold uppercase border tracking-wider 
                      ${doc.status === 'Analyzed' ? 'text-primary bg-primary/10 border-primary/20' :
                                                doc.status === 'Review' ? 'text-accent-orange bg-accent-orange/10 border-accent-orange/20' :
                                                    'text-text-muted bg-surface-highlight border-border'}`}>
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-text-muted text-xs">{doc.date}</td>
                                    <td className="px-6 py-4 text-text-muted text-xs font-mono">{doc.size}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-text-muted hover:text-white transition-colors">
                                            <ChevronRight size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
);
