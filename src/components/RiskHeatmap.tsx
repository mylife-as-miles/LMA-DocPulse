import React from 'react';
import { Loan } from '../types';

interface RiskHeatmapProps {
    loans?: Loan[];
}

export const RiskHeatmap = ({ loans = [] }: RiskHeatmapProps) => {
    const riskCounts = {
        'Low': loans.filter(l => l.risk === 'Low').length,
        'Medium': loans.filter(l => l.risk === 'Medium').length,
        'High': loans.filter(l => l.risk === 'High').length,
        'Critical': loans.filter(l => l.risk === 'Critical').length
    };

    const total = loans.length || 1; // avoid divide by zero

    const getPercentage = (count: number) => ((count / total) * 100).toFixed(0);

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h3 className="text-lg font-display font-bold text-white">Risk Heatmap</h3>
                <p className="text-xs text-text-muted mt-1">Concentration by Risk Level</p>
            </div>

            <div className="grid grid-cols-2 gap-2 flex-1 min-h-[160px]">
                {/* Low Risk Block */}
                <div className={`col-span-1 row-span-2 relative group overflow-hidden rounded-lg border transition-all cursor-pointer ${riskCounts.Low > 0
                        ? 'bg-primary/10 border-primary/20 hover:bg-primary/20'
                        : 'bg-white/5 border-white/10'
                    }`}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                        <span className={`text-2xl font-bold mb-1 ${riskCounts.Low > 0 ? 'text-primary' : 'text-text-muted'}`}>
                            {getPercentage(riskCounts.Low)}%
                        </span>
                        <span className="text-[10px] text-text-muted uppercase tracking-wider">Low Risk</span>
                        <span className="text-[10px] text-text-muted">({riskCounts.Low} Loans)</span>
                    </div>
                </div>

                {/* Critical Risk Block */}
                <div className={`relative group overflow-hidden rounded-lg border transition-all cursor-pointer ${riskCounts.Critical > 0
                        ? 'bg-red-500/20 border-red-500/30 hover:bg-red-500/30'
                        : 'bg-white/5 border-white/10'
                    }`}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                        <span className={`text-xl font-bold ${riskCounts.Critical > 0 ? 'text-red-500' : 'text-text-muted'}`}>
                            {riskCounts.Critical}
                        </span>
                        <span className={`text-[10px] uppercase tracking-wider ${riskCounts.Critical > 0 ? 'text-red-500' : 'text-text-muted'}`}>
                            Critical
                        </span>
                        <span className="text-[10px] text-text-muted">{getPercentage(riskCounts.Critical)}%</span>
                    </div>
                </div>

                {/* High & Medium Split */}
                <div className="grid grid-cols-2 gap-2">
                    {/* High Risk */}
                    <div className={`rounded-lg border transition-all cursor-pointer flex items-center justify-center flex-col group ${riskCounts.High > 0
                            ? 'bg-accent-orange/20 border-accent-orange/30 hover:bg-accent-orange/30'
                            : 'bg-white/5 border-white/10'
                        }`}>
                        <span className={`text-sm font-bold group-hover:scale-110 transition-transform ${riskCounts.High > 0 ? 'text-accent-orange' : 'text-text-muted'}`}>
                            {riskCounts.High}
                        </span>
                        <span className={`text-[8px] ${riskCounts.High > 0 ? 'text-accent-orange' : 'text-text-muted'}`}>High</span>
                        <span className="text-[8px] text-text-muted">{getPercentage(riskCounts.High)}%</span>
                    </div>
                    {/* Medium Risk */}
                    <div className={`rounded-lg border transition-all cursor-pointer flex items-center justify-center flex-col group ${riskCounts.Medium > 0
                            ? 'bg-blue-400/20 border-blue-400/30 hover:bg-blue-400/30'
                            : 'bg-white/5 border-white/10'
                        }`}>
                        <span className={`text-sm font-bold group-hover:scale-110 transition-transform ${riskCounts.Medium > 0 ? 'text-blue-400' : 'text-text-muted'}`}>
                            {riskCounts.Medium}
                        </span>
                        <span className={`text-[8px] ${riskCounts.Medium > 0 ? 'text-blue-400' : 'text-text-muted'}`}>Medium</span>
                        <span className="text-[8px] text-text-muted">{getPercentage(riskCounts.Medium)}%</span>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-between text-[10px] text-text-muted uppercase tracking-widest font-bold">
                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow-sm"></div>Low</div>
                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>Med</div>
                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-accent-orange"></div>High</div>
                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>Crit</div>
            </div>
        </div>
    );
};
