import React from 'react';
import { RiskHeatmap } from '../components/RiskHeatmap';
import { ShieldAlert, FileWarning, CheckCircle, Scale } from 'lucide-react';

export const ComplianceView = () => {
    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2 custom-scrollbar">
            <div className="mx-auto max-w-[1600px] flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-display font-bold text-white">Compliance & Risk</h2>
                    <p className="text-text-muted">Monitor regulatory adherence and portfolio risk factors.</p>
                </div>

                {/* Risk Heatmap Section */}
                <div className="glass-panel p-6 rounded-xl">
                    <RiskHeatmap />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldAlert className="text-red-400" />
                            <h3 className="text-lg font-bold text-white">Critical Violations</h3>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-surface-highlight/50 border border-red-500/20">
                                    <div className="w-2 h-16 bg-red-500 rounded-full" />
                                    <div className="flex-1">
                                        <h4 className="text-white font-medium">Missing LIBOR Fallback Clause</h4>
                                        <p className="text-sm text-text-muted mt-1">Loan #884{i} • Alpha Corp</p>
                                    </div>
                                    <button className="px-3 py-1.5 text-xs font-bold bg-red-500 text-white rounded hover:bg-red-600 transition-colors">Review</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <CheckCircle className="text-primary" />
                            <h3 className="text-lg font-bold text-white">Recently Cleared</h3>
                        </div>
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-surface-highlight/50 border border-primary/20">
                                    <div className="w-2 h-16 bg-primary rounded-full" />
                                    <div className="flex-1">
                                        <h4 className="text-white font-medium">Covenant Verification Complete</h4>
                                        <p className="text-sm text-text-muted mt-1">Loan #992{i} • Omega Ltd</p>
                                    </div>
                                    <span className="text-xs font-mono text-primary flex items-center gap-1">
                                        <CheckCircle size={12} /> Verified
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
