import React from 'react';

export const RiskHeatmap = () => {
    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h3 className="text-lg font-display font-bold text-white">Risk Heatmap</h3>
                <p className="text-xs text-text-muted mt-1">Concentration by Sector</p>
            </div>

            <div className="grid grid-cols-2 gap-2 flex-1 min-h-[140px]">
                <div className="col-span-1 row-span-2 relative group overflow-hidden rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                        <span className="text-xl font-bold text-primary mb-1">Tech</span>
                        <span className="text-[10px] text-text-muted uppercase tracking-wider">Low Risk</span>
                    </div>
                </div>
                <div className="relative group overflow-hidden rounded-lg bg-accent-red/20 border border-accent-red/30 hover:bg-accent-red/30 transition-all cursor-pointer">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                        <span className="text-sm font-bold text-accent-red">Real Estate</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-accent-orange/20 border border-accent-orange/30 hover:bg-accent-orange/30 transition-all cursor-pointer flex items-center justify-center group">
                        <span className="text-[10px] font-bold text-accent-orange group-hover:scale-110 transition-transform">En</span>
                    </div>
                    <div className="rounded-lg bg-primary/20 border border-primary/30 hover:bg-primary/30 transition-all cursor-pointer flex items-center justify-center group">
                        <span className="text-[10px] font-bold text-primary group-hover:scale-110 transition-transform">Hl</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-[10px] text-text-muted uppercase tracking-widest font-bold">
                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow-sm"></div>Safe</div>
                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-accent-orange"></div>Warn</div>
                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-accent-red"></div>Crit</div>
            </div>
        </div>
    );
};
