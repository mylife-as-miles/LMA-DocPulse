import React from 'react';
import { Loan } from '../types';

interface RiskHeatmapProps {
    loans?: Loan[];
}

export const RiskHeatmap = ({ loans = [] }: RiskHeatmapProps) => {
    // Simple logic to distribute loans into "sectors" or risk buckets for visualization
    // Since we don't extract "Sector" explicitly yet, we can simulate sectors based on risk or just visualize risk clusters.
    // Ideally, we'd extract Sector from the doc. For now, let's group by Risk to show concentration.

    const riskCounts = {
        'Low': loans.filter(l => l.risk === 'Low').length,
        'Medium': loans.filter(l => l.risk === 'Medium').length,
        'High': loans.filter(l => l.risk === 'High').length,
        'Critical': loans.filter(l => l.risk === 'Critical').length
    };

    const total = loans.length || 1; // avoid divide by zero

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h3 className="text-lg font-display font-bold text-white">Risk Heatmap</h3>
                <p className="text-xs text-text-muted mt-1">Concentration by Risk Level</p>
            </div>

            <div className="grid grid-cols-2 gap-2 flex-1 min-h-[140px]">
                {/* Low Risk Block */}
                <div className="col-span-1 row-span-2 relative group overflow-hidden rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                        <span className="text-xl font-bold text-primary mb-1">{((riskCounts.Low / total) * 100).toFixed(0)}%</span>
                        <span className="text-[10px] text-text-muted uppercase tracking-wider">Low Risk</span>
                        <span className="text-[10px] text-text-muted">({riskCounts.Low} Loans)</span>
                    </div>
                </div>

                {/* Critical Risk Block */}
                <div className="relative group overflow-hidden rounded-lg bg-accent-red/20 border border-accent-red/30 hover:bg-accent-red/30 transition-all cursor-pointer">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                         <span className="text-lg font-bold text-accent-red">{riskCounts.Critical} Crit</span>
                    </div>
                </div>

                {/* Medium & High Split */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-accent-orange/20 border border-accent-orange/30 hover:bg-accent-orange/30 transition-all cursor-pointer flex items-center justify-center flex-col group">
                        <span className="text-xs font-bold text-accent-orange group-hover:scale-110 transition-transform">{riskCounts.High}</span>
                        <span className="text-[8px] text-accent-orange">High</span>
                    </div>
                    <div className="rounded-lg bg-blue-400/20 border border-blue-400/30 hover:bg-blue-400/30 transition-all cursor-pointer flex items-center justify-center flex-col group">
                        <span className="text-xs font-bold text-blue-400 group-hover:scale-110 transition-transform">{riskCounts.Medium}</span>
                        <span className="text-[8px] text-blue-400">Med</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-[10px] text-text-muted uppercase tracking-widest font-bold">
                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow-sm"></div>Low</div>
                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>Med</div>
                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-accent-orange"></div>High</div>
                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-accent-red"></div>Crit</div>
            </div>
        </div>
    );
};
