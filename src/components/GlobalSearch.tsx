import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, CreditCard, ArrowRight, Command } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { ViewState } from '../types';

interface GlobalSearchProps {
    setView: (view: ViewState) => void;
    onSelectLoan?: (id: string) => void;
    onSelectDoc?: (id: number) => void;
}

export const GlobalSearch = ({ setView, onSelectLoan, onSelectDoc }: GlobalSearchProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Keyboard shortcut listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Fetch and filter data
    const loans = useLiveQuery(() => db.loans.toArray()) || [];
    const docs = useLiveQuery(() => db.docs.toArray()) || [];

    const filteredLoans = query
        ? loans.filter(l =>
            l.id.toLowerCase().includes(query.toLowerCase()) ||
            l.counterparty.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5)
        : [];

    const filteredDocs = query
        ? docs.filter(d =>
            d.name.toLowerCase().includes(query.toLowerCase()) ||
            d.type.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5)
        : [];

    const hasResults = filteredLoans.length > 0 || filteredDocs.length > 0;

    const handleSelectLoan = (id: string) => {
        if (onSelectLoan) onSelectLoan(id);
        setView('loan_review');
        setIsOpen(false);
        setQuery('');
    };

    const handleSelectDoc = (id: number) => {
        if (onSelectDoc) onSelectDoc(id);
        setView('document_detail');
        setIsOpen(false);
        setQuery('');
    };

    return (
        <>
            {/* Trigger Button (Header Search Input Replacement) */}
            <div
                onClick={() => setIsOpen(true)}
                className="relative hidden w-80 lg:block group cursor-pointer"
            >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-primary transition-colors" size={18} />
                <div className="h-10 w-full rounded-full border border-border bg-surface/50 pl-10 pr-4 flex items-center justify-between text-sm text-text-muted group-hover:border-primary/50 group-hover:bg-surface-highlight transition-all shadow-inner">
                    <span>Search...</span>
                    <div className="flex items-center gap-1 opacity-50">
                        <kbd className="hidden sm:inline-block rounded border border-gray-600 bg-gray-800 px-1.5 py-0.5 text-[10px] font-light text-gray-400 font-mono">Ctrl</kbd>
                        <span className="text-xs">K</span>
                    </div>
                </div>
            </div>

            {/* Mobile Trigger */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden text-text-muted hover:text-white"
            >
                <Search size={20} />
            </button>


            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
                    {/* Backyard Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-2xl bg-[#050505] border border-border/50 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[70vh]">
                        {/* Search Input Header */}
                        <div className="flex items-center gap-4 px-4 py-4 border-b border-border/50 bg-surface/50">
                            <Search className="text-primary" size={24} />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search loans, documents, counterparties..."
                                className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder-text-muted/50"
                            />
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 rounded-lg hover:bg-white/10 text-text-muted transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Results Area */}
                        <div className="overflow-y-auto custom-scrollbar p-2">
                            {!query && (
                                <div className="p-12 text-center text-text-muted">
                                    <Command size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>Start typing to search your portfolio.</p>
                                    <p className="text-xs mt-2 opacity-50">Try "Term Loan" or "Ref #123"</p>
                                </div>
                            )}

                            {query && !hasResults && (
                                <div className="p-8 text-center text-text-muted">
                                    <p>No results found for "{query}"</p>
                                </div>
                            )}

                            {/* Loan Results */}
                            {filteredLoans.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="px-3 py-2 text-xs font-bold text-text-muted uppercase tracking-wider">Loans</h3>
                                    <div className="space-y-1">
                                        {filteredLoans.map(loan => (
                                            <button
                                                key={loan.id}
                                                onClick={() => handleSelectLoan(loan.id)}
                                                className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-surface-highlight group transition-all text-left"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                                                        <CreditCard size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white group-hover:text-primary transition-colors">{loan.counterparty}</p>
                                                        <p className="text-xs text-text-muted">{loan.type} • {loan.id}</p>
                                                    </div>
                                                </div>
                                                <ArrowRight size={16} className="text-text-muted opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Document Results */}
                            {filteredDocs.length > 0 && (
                                <div>
                                    <h3 className="px-3 py-2 text-xs font-bold text-text-muted uppercase tracking-wider">Documents</h3>
                                    <div className="space-y-1">
                                        {filteredDocs.map(doc => (
                                            <button
                                                key={doc.id}
                                                onClick={() => handleSelectDoc(doc.id!)}
                                                className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-surface-highlight group transition-all text-left"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                                        <FileText size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white group-hover:text-blue-400 transition-colors">{doc.name}</p>
                                                        <p className="text-xs text-text-muted">{doc.type} • {new Date(doc.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <ArrowRight size={16} className="text-text-muted opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2 border-t border-border/50 bg-surface/30 flex items-center justify-between text-[10px] text-text-muted">
                            <div className="flex gap-4">
                                <span><kbd className="bg-surface border border-border px-1 rounded">↵</kbd> to select</span>
                                <span><kbd className="bg-surface border border-border px-1 rounded">esc</kbd> to close</span>
                            </div>
                            <span>{filteredLoans.length + filteredDocs.length} results</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
