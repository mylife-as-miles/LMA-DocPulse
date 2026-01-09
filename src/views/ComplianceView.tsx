import React from 'react';
import { RiskHeatmap } from '../components/RiskHeatmap';
import { ShieldAlert, CheckCircle, TrendingUp, AlertOctagon, Activity } from 'lucide-react';
import { useActionFeedback } from '../components/ActionFeedback';
import { ViewState } from '../types';

interface ComplianceViewProps {
    setView?: (view: ViewState) => void;
}

export const ComplianceView = ({ setView }: ComplianceViewProps) => {
     const { trigger: fixIssue } = useActionFeedback('Auto-Remediation');

    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2 custom-scrollbar bg-pattern">
            <div className="mx-auto max-w-[1600px] flex flex-col gap-8 pb-20">
                <div className="flex flex-col gap-2 relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-orange/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <h2 className="text-3xl font-display font-bold text-white relative z-10">Compliance & Risk</h2>
                    <p className="text-text-muted relative z-10">Monitor regulatory adherence and portfolio risk factors.</p>
                </div>

                {/* Compliance Score Hero */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-panel p-6 rounded-2xl md:col-span-2 relative overflow-hidden flex flex-col justify-between min-h-[280px]">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <ShieldAlert className="text-primary" size={20} /> Overall Compliance Score
                                </h3>
                                <p className="text-sm text-text-muted mt-1">Real-time assessment across all active facilities</p>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Excellent</span>
                        </div>

                        <div className="flex items-end gap-6 mt-8 relative z-10">
                            <div className="text-7xl font-display font-bold text-white tracking-tighter">
                                94<span className="text-2xl text-text-muted font-norma align-top">%</span>
                            </div>
                            <div className="pb-4">
                                <p className="text-sm font-medium text-emerald-400 flex items-center gap-1">
                                    <TrendingUp size={16} /> +2.4%
                                </p>
                                <p className="text-xs text-text-muted">vs last month</p>
                            </div>
                        </div>

                        <div className="w-full bg-surface-highlight h-2 rounded-full mt-8 overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-500 to-primary h-full w-[94%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center gap-6">
                        {[
                            { label: 'Critical Issues', value: '3', color: 'text-red-500', icon: AlertOctagon },
                            { label: 'Pending Reviews', value: '12', color: 'text-accent-orange', icon: Activity },
                            { label: 'Audits Passed', value: '156', color: 'text-primary', icon: CheckCircle },
                        ].map((stat, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl bg-surface-highlight/50 ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white leading-none">{stat.value}</p>
                                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider mt-1">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Risk Heatmap Section */}
                <div className="glass-panel p-8 rounded-2xl border border-white/5 relative bg-gradient-to-b from-white/[0.02] to-transparent">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white">Portfolio Risk Heatmap</h3>
                            <p className="text-xs text-text-muted">Concentration by Industry & Region</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-muted hover:text-white transition-colors">By Industry</button>
                            <button className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-muted hover:text-white transition-colors">By Region</button>
                        </div>
                    </div>
                    <RiskHeatmap />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Critical Violations */}
                    <div className="glass-panel p-0 rounded-2xl overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-border/50 flex justify-between items-center bg-red-500/5">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <ShieldAlert size={18} className="text-red-500" />
                                Critical Violations
                            </h3>
                            <button
                                onClick={() => setView?.('violations_log')}
                                className="text-xs text-red-400 hover:text-white transition-colors uppercase font-bold tracking-wider"
                            >
                                View All
                            </button>
                        </div>
                        <div className="p-4 space-y-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group border border-transparent hover:border-white/10">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-red-500 shadow-glow-sm"></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-white font-bold text-sm group-hover:text-red-400 transition-colors">Missing LIBOR Fallback Clause</h4>
                                            <span className="text-[10px] text-text-muted font-mono bg-surface-highlight px-2 py-0.5 rounded">High</span>
                                        </div>
                                        <p className="text-xs text-text-muted mt-1">Loan #884{i} • Alpha Corp</p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); fixIssue(); }}
                                        className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-500 shadow-lg shadow-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        Fix
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recently Cleared */}
                    <div className="glass-panel p-0 rounded-2xl overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-border/50 flex justify-between items-center bg-primary/5">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <CheckCircle size={18} className="text-primary" />
                                Recently Cleared
                            </h3>
                        </div>
                        <div className="p-4 space-y-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        <CheckCircle size={14} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-medium text-sm">Covenant Verification Complete</h4>
                                        <p className="text-xs text-text-muted mt-0.5">Loan #992{i} • Omega Ltd</p>
                                    </div>
                                    <span className="text-[10px] font-mono text-text-muted">2h ago</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
