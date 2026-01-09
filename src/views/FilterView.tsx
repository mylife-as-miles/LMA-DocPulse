import React, { useState } from 'react';
import { ViewState } from '../types';
import { motion } from 'framer-motion';
import { X, Search, Calendar, Filter, DollarSign, ShieldAlert, Check } from 'lucide-react';

interface FilterViewProps {
    setView: (view: ViewState) => void;
}

export const FilterView = ({ setView }: FilterViewProps) => {
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    const toggleFilter = (filter: string) => {
        if (selectedFilters.includes(filter)) {
            setSelectedFilters(selectedFilters.filter(f => f !== filter));
        } else {
            setSelectedFilters([...selectedFilters, filter]);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2 custom-scrollbar bg-background"
        >
             <div className="mx-auto max-w-4xl flex flex-col gap-8 pb-20">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-display font-bold text-white">Advanced Filters</h2>
                        <p className="text-text-muted mt-1">Refine your view across the entire portfolio.</p>
                    </div>
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 rounded-full hover:bg-surface-highlight text-text-muted hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Filter Groups */}
                <div className="space-y-8">
                    {/* Status */}
                    <div className="glass-panel p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Filter size={18} className="text-primary" /> Loan Status
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {['Active', 'Pending Approval', 'In Review', 'Rejected', 'Matured', 'Defaulted'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => toggleFilter(status)}
                                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                                        selectedFilters.includes(status)
                                            ? 'bg-primary text-black border-primary font-bold shadow-glow-sm'
                                            : 'bg-surface border-border text-text-muted hover:text-white hover:border-primary/50'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Risk Level */}
                    <div className="glass-panel p-6 rounded-2xl">
                         <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <ShieldAlert size={18} className="text-accent-red" /> Risk Classification
                        </h3>
                         <div className="flex flex-wrap gap-3">
                            {['Low Risk', 'Medium Risk', 'High Risk', 'Critical'].map(risk => (
                                <button
                                    key={risk}
                                    onClick={() => toggleFilter(risk)}
                                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                                        selectedFilters.includes(risk)
                                            ? 'bg-accent-red text-white border-accent-red font-bold shadow-glow-sm'
                                            : 'bg-surface border-border text-text-muted hover:text-white hover:border-accent-red/50'
                                    }`}
                                >
                                    {risk}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="glass-panel p-6 rounded-2xl">
                         <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Calendar size={18} className="text-blue-400" /> Date Range
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-text-muted">From</label>
                                <input type="date" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary font-mono" />
                            </div>
                             <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-text-muted">To</label>
                                <input type="date" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary font-mono" />
                            </div>
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="glass-panel p-6 rounded-2xl">
                         <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <DollarSign size={18} className="text-green-400" /> Facility Amount
                        </h3>
                        <div className="px-2">
                            <input type="range" className="w-full h-2 bg-surface-highlight rounded-lg appearance-none cursor-pointer accent-primary" />
                            <div className="flex justify-between mt-2 text-xs font-mono text-text-muted">
                                <span>$0M</span>
                                <span>$500M+</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-border">
                    <button
                        onClick={() => setSelectedFilters([])}
                        className="px-6 py-3 rounded-xl border border-border text-text-muted font-bold text-sm hover:bg-surface-highlight hover:text-white transition-all"
                    >
                        Reset All
                    </button>
                    <button
                        onClick={() => window.history.back()}
                        className="px-8 py-3 rounded-xl bg-primary text-black font-bold text-sm hover:shadow-glow transition-all flex items-center gap-2"
                    >
                        <Check size={18} /> Apply Filters
                    </button>
                </div>
             </div>
        </motion.div>
    );
};
