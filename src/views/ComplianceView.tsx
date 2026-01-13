import React from 'react';
import { RiskHeatmap } from '../components/RiskHeatmap';
import { ShieldAlert, CheckCircle, TrendingUp, AlertOctagon, Activity, FileText } from 'lucide-react';
import { useActionFeedback } from '../components/ActionFeedback';
import { ViewState } from '../types';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';

interface ComplianceViewProps {
    setView?: (view: ViewState) => void;
}

export const ComplianceView = ({ setView }: ComplianceViewProps) => {
    const { trigger: fixIssue } = useActionFeedback('Auto-Remediation');

    const loans = useLiveQuery(() => db.loans.toArray()) || [];
    const docs = useLiveQuery(() => db.docs.toArray()) || [];
    const chartData = useLiveQuery(() => db.chartData.toArray()) || [];
    const alerts = useLiveQuery(() => db.alerts.toArray()) || [];

    const currentScore = chartData.length > 0 ? chartData[chartData.length - 1].score : 0;
    const previousScore = chartData.length > 1 ? chartData[chartData.length - 2].score : 0;
    const scoreTrend = currentScore - previousScore;

    const criticalIssuesCount = loans.filter(l => l.risk === 'Critical').length + alerts.filter(a => a.type === 'critical').length;
    const pendingReviewsCount = docs.filter(d => d.status === 'Review' || d.status === 'Pending').length;
    const analyzedCount = docs.filter(d => d.status === 'Analyzed').length;

    const criticalAlerts = alerts.filter(a => a.type === 'critical');

    // Use Analyzed docs as "Recently Cleared" proxy for demo
    const recentlyAnalyzed = docs.filter(d => d.status === 'Analyzed').sort((a,b) => b.id! - a.id!).slice(0, 5);

    if (loans.length === 0 && docs.length === 0 && chartData.length === 0) {
        return (
             <div className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2 custom-scrollbar bg-pattern">
                 <div className="mx-auto max-w-[1600px] flex flex-col items-center justify-center h-full text-center py-20">
                     <ShieldAlert size={64} className="text-text-muted mb-6" />
                     <h2 className="text-2xl font-bold text-white">No Compliance Data</h2>
                     <p className="text-text-muted mt-2">Upload documents or add loans to generate compliance insights.</p>
                 </div>
             </div>
        );
    }

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
                            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border
                                ${currentScore >= 90 ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' :
                                  currentScore >= 70 ? 'text-accent-orange bg-accent-orange/10 border-accent-orange/20' :
                                  'text-red-500 bg-red-500/10 border-red-500/20'}`}>
                                {currentScore >= 90 ? 'Excellent' : currentScore >= 70 ? 'Good' : 'Poor'}
                            </span>
                        </div>

                        <div className="flex items-end gap-6 mt-8 relative z-10">
                            <div className="text-7xl font-display font-bold text-white tracking-tighter">
                                {currentScore}<span className="text-2xl text-text-muted font-norma align-top">%</span>
                            </div>
                            <div className="pb-4">
                                <p className={`text-sm font-medium flex items-center gap-1 ${scoreTrend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    <TrendingUp size={16} /> {scoreTrend >= 0 ? '+' : ''}{scoreTrend}%
                                </p>
                                <p className="text-xs text-text-muted">vs last month</p>
                            </div>
                        </div>

                        <div className="w-full bg-surface-highlight h-2 rounded-full mt-8 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-emerald-500 to-primary h-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000"
                                style={{ width: `${currentScore}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center gap-6">
                        {[
                            { label: 'Critical Issues', value: criticalIssuesCount.toString(), color: 'text-red-500', icon: AlertOctagon },
                            { label: 'Pending Reviews', value: pendingReviewsCount.toString(), color: 'text-accent-orange', icon: Activity },
                            { label: 'Docs Analyzed', value: analyzedCount.toString(), color: 'text-primary', icon: CheckCircle },
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
                            {criticalAlerts.length > 0 ? (
                                criticalAlerts.map((alert, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group border border-transparent hover:border-white/10">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-red-500 shadow-glow-sm"></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-white font-bold text-sm group-hover:text-red-400 transition-colors">{alert.title}</h4>
                                                <span className="text-[10px] text-text-muted font-mono bg-surface-highlight px-2 py-0.5 rounded">High</span>
                                            </div>
                                            <p className="text-xs text-text-muted mt-1">{alert.subtitle}</p>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); fixIssue(); }}
                                            className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-500 shadow-lg shadow-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            Fix
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-text-muted text-sm">No critical violations found.</div>
                            )}
                        </div>
                    </div>

                    {/* Recently Analyzed (proxy for Cleared) */}
                    <div className="glass-panel p-0 rounded-2xl overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-border/50 flex justify-between items-center bg-primary/5">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <CheckCircle size={18} className="text-primary" />
                                Recently Analyzed
                            </h3>
                        </div>
                        <div className="p-4 space-y-2">
                            {recentlyAnalyzed.length > 0 ? (
                                recentlyAnalyzed.map((doc, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                            <FileText size={14} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-white font-medium text-sm">{doc.name}</h4>
                                            <p className="text-xs text-text-muted mt-0.5">{doc.type}</p>
                                        </div>
                                        <span className="text-[10px] font-mono text-text-muted">{doc.date}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-text-muted text-sm">No recent activity.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
