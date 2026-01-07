import React from 'react';
import { TrendingUp } from 'lucide-react';
import { StatCardProps } from '../types';

export const StatCard = ({ title, value, icon, iconColorClass, trend, trendUp, badge, badgeColorClass }: StatCardProps) => (
    <div className="glass-panel rounded-2xl p-5 hover:bg-surface-highlight/30 transition-all group relative overflow-hidden">
        {badge === "+1 New" && (
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent-red/10 blur-xl pointer-events-none"></div>
        )}
        <div className="flex items-start justify-between mb-4 relative z-10">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-border/50 transition-all ${iconColorClass} group-hover:scale-105`}>
                {icon}
            </div>
            {trend && (
                <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold border ${trendUp ? 'bg-primary/10 text-primary border-primary/20' : 'bg-border/50 text-text-muted border-border'}`}>
                    {trendUp ? <TrendingUp size={14} /> : null} {trend}
                </span>
            )}
            {badge && (
                <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold border ${badgeColorClass}`}>
                    {badge}
                </span>
            )}
        </div>
        <div className="relative z-10">
            <p className="text-sm font-medium text-text-muted mb-1">{title}</p>
            <h3 className="text-3xl font-display font-bold text-white tracking-tight">{value}</h3>
        </div>
    </div>
);
