import React, { useState } from 'react';
import { Plus, Files, TrendingUp, CheckCircle2, Filter, FileText, File as FileIcon, ChevronRight, Inbox, Trash2, Download, Search, ChevronDown, Check } from 'lucide-react';
import { db } from '../db';
import { toast } from 'sonner';
import { ViewState, Doc } from '../types';
import { exportToCSV } from '../utils/exportUtils';

interface DocumentVaultViewProps {
    setView: (v: ViewState) => void;
    docs: Doc[];
    onSelectDoc: (id: number) => void;
}

export const DocumentVaultView = ({ setView, docs, onSelectDoc }: DocumentVaultViewProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    // Filter Logic
    const filteredDocs = docs.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'All' || doc.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const handleDocClick = (doc: Doc) => {
        if (doc.id) {
            onSelectDoc(doc.id);
            setView('document_detail');
        }
    };

    const handleDeleteDoc = async (e: React.MouseEvent, id?: number) => {
        e.stopPropagation();
        if (!id) return;
        if (confirm('Are you sure you want to delete this document from the vault?')) {
            try {
                await db.docs.delete(id);
                toast.success('Document deleted successfully');
            } catch (error) {
                console.error("Failed to delete doc:", error);
                toast.error('Failed to delete document');
            }
        }
    };

    const handleExport = () => {
        if (filteredDocs.length === 0) {
            toast.error('No documents to export');
            return;
        }
        const exportData = filteredDocs.map(({ id, name, type, status, date, size }) => ({
            'ID': id,
            'Name': name,
            'Type': type,
            'Status': status,
            'Date': date,
            'Size': size
        }));
        exportToCSV(exportData, `document_vault_${new Date().toISOString().split('T')[0]}.csv`);
        toast.success('Export started');
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2 custom-scrollbar">
            <div className="mx-auto max-w-[1600px] flex flex-col gap-6">

                {/* Header for Vault */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold font-display text-white">Document Vault</h2>
                        <p className="text-xs text-text-muted mt-1">Manage and analyze your legal documents.</p>
                    </div>
                    <button
                        id="upload-btn"
                        onClick={() => setView('upload')}
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-black hover:shadow-glow-sm transition-all"
                    >
                        <Plus size={18} />
                        New Analysis
                    </button>
                </div>

                {/* Stats - Using GLOBAL docs size as metrics typically reflect total system state */}
                <div id="vault-stats" className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
                            <h3 className="text-2xl font-display font-bold text-white mt-1">{docs.filter(d => d.status === 'Analyzed').length}</h3>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-surface-highlight text-text-muted flex items-center justify-center">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-text-muted">Storage Used</p>
                            <h3 className="text-2xl font-display font-bold text-white mt-1">
                                {(docs.reduce((acc, doc) => acc + parseFloat(doc.size), 0)).toFixed(1)} MB
                            </h3>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-surface-highlight text-text-muted flex items-center justify-center">
                            <CheckCircle2 size={20} />
                        </div>
                    </div>
                </div>

                {/* Main List */}
                <div id="document-table" className="glass-panel rounded-2xl overflow-hidden flex flex-col flex-1 min-h-[500px]">
                    <div className="border-b border-border px-6 py-5 flex items-center justify-between bg-surface/30 gap-4">
                        <h3 className="text-lg font-display font-bold text-white hidden md:block">Recent Files</h3>

                        <div id="vault-search" className="flex-1 max-w-md relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-white transition-colors" size={16} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search documents..."
                                className="w-full h-9 rounded-lg bg-surface border border-border pl-9 pr-4 text-sm text-white focus:outline-none focus:border-primary transition-all"
                            />
                        </div>

                        <div className="flex gap-2 relative">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-all ${typeFilter !== 'All'
                                    ? 'bg-primary/10 border-primary text-primary'
                                    : 'bg-surface border-border text-text-muted hover:text-white'
                                    }`}
                            >
                                <Filter size={14} />
                                {typeFilter === 'All' ? 'Filter Type' : typeFilter}
                                <ChevronDown size={14} />
                            </button>

                            {/* Type Filter Dropdown */}
                            {showFilters && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowFilters(false)} />
                                    <div className="absolute top-full right-0 mt-2 w-40 bg-[#0F172A] border border-border rounded-xl shadow-xl z-20 overflow-hidden animate-fade-in py-1">
                                        {['All', 'PDF', 'Word'].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => { setTypeFilter(type); setShowFilters(false); }}
                                                className={`w-full text-left px-4 py-2 text-xs hover:bg-surface-highlight transition-colors flex items-center justify-between ${typeFilter === type ? 'text-primary font-bold' : 'text-text-muted'
                                                    }`}
                                            >
                                                {type}
                                                {typeFilter === type && <Check size={12} />}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}

                            <button
                                id="vault-export"
                                onClick={handleExport}
                                className="flex items-center gap-1.5 rounded-md bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition-all"
                            >
                                <Download size={14} />
                                Export
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto flex-1 flex flex-col">
                        {docs.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 space-y-4">
                                <div className="w-20 h-20 rounded-full bg-surface-highlight flex items-center justify-center mb-2">
                                    <Inbox size={40} className="text-text-muted opacity-50" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-medium text-white">No documents found</h4>
                                    <p className="text-sm text-text-muted max-w-xs mx-auto mt-1">
                                        Your vault is empty. Upload documents to start analyzing and managing them here.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setView('upload')}
                                    className="mt-4 px-6 py-2.5 bg-surface border border-border rounded-lg text-sm text-white hover:bg-surface-highlight transition-colors flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    Upload Document
                                </button>
                            </div>
                        ) : (
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
                                    {filteredDocs.map((doc, idx) => (
                                        <tr
                                            key={doc.id || idx}
                                            onClick={() => handleDocClick(doc)}
                                            className="hover:bg-surface-highlight/40 transition-colors group cursor-pointer"
                                        >
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
                                            <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                                <button
                                                    onClick={(e) => handleDeleteDoc(e, doc.id)}
                                                    className="p-2 rounded hover:bg-white/10 text-text-muted hover:text-red-500 transition-colors"
                                                    title="Delete Document"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDocClick(doc); }}
                                                    className="p-2 rounded hover:bg-white/10 text-text-muted hover:text-white transition-colors"
                                                >
                                                    <ChevronRight size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
