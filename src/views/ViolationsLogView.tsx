import React from 'react';
import { ViewState } from '../types';
import { motion } from 'framer-motion';
import { ChevronLeft, ShieldAlert, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useActionFeedback } from '../components/ActionFeedback';

interface ViolationsLogViewProps {
    setView: (view: ViewState) => void;
}

export const ViolationsLogView = ({ setView }: ViolationsLogViewProps) => {
    const { trigger: fixViolation } = useActionFeedback('Auto-Fix');

    const handleFix = (id: string) => {
        fixViolation(async () => {
            // Mock API
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2 custom-scrollbar"
        >
             <div className="mx-auto max-w-5xl flex flex-col gap-8 pb-20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setView('compliance')}
                            className="p-2 rounded-full hover:bg-surface-highlight text-text-muted hover:text-white transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div>
                            <h2 className="text-3xl font-display font-bold text-white">Compliance Violations</h2>
                            <p className="text-text-muted mt-1">Active regulatory and contractual breaches requiring attention.</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4">
                    {[
                        { id: 'V-101', severity: 'Critical', title: 'Missing LIBOR Fallback Clause', loan: 'LN-2023-884 (Alpha Corp)', desc: 'Agreement lacks standard LMA fallback language for LIBOR cessation.', deadline: '24h', type: 'Regulation' },
                        { id: 'V-102', severity: 'High', title: 'Leverage Ratio Breach', loan: 'LN-2023-902 (Beta Holdings)', desc: 'Reported ratio 4.5x exceeds covenant limit of 4.0x.', deadline: '3 Days', type: 'Covenant' },
                        { id: 'V-103', severity: 'Medium', title: 'Outdated Insurance Certificate', loan: 'LN-2023-755 (Gamma Ind)', desc: 'Insurance documentation expired on 15 Oct 2024.', deadline: '1 Week', type: 'Documentation' },
                    ].map((violation, i) => (
                        <div key={i} className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center group hover:border-red-500/30 transition-colors">
                            <div className={`p-4 rounded-xl shrink-0 ${violation.severity === 'Critical' ? 'bg-red-500/10 text-red-500' : violation.severity === 'High' ? 'bg-orange-500/10 text-orange-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                <ShieldAlert size={24} />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">{violation.title}</h3>
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                                         violation.severity === 'Critical' ? 'text-red-400 border-red-500/30 bg-red-500/5' :
                                         violation.severity === 'High' ? 'text-orange-400 border-orange-500/30 bg-orange-500/5' :
                                         'text-yellow-400 border-yellow-500/30 bg-yellow-500/5'
                                    }`}>{violation.severity}</span>
                                </div>
                                <p className="text-sm text-text-muted mb-2">{violation.desc}</p>
                                <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                                    <span>ID: {violation.id}</span>
                                    <span>•</span>
                                    <span>{violation.loan}</span>
                                    <span>•</span>
                                    <span className="text-red-400 flex items-center gap-1"><ClockIcon /> Due: {violation.deadline}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                                <button
                                    onClick={() => handleFix(violation.id)}
                                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold text-sm rounded-lg shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 size={16} /> Resolve Issue
                                </button>
                                <button className="px-6 py-2 border border-border hover:border-white text-text-muted hover:text-white font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2">
                                    View Details <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        </motion.div>
    );
};

const ClockIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);
