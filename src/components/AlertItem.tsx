import React from 'react';
import { AlertItemProps } from '../types';

export const AlertItem = ({ title, time, subtitle, icon, colorClass }: AlertItemProps) => (
    <div className="flex gap-4 group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-surface-highlight/30 transition-colors">
        <div className="relative mt-1">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-border transition-all ${colorClass}`}>
                {icon}
            </div>
            {title === "LIBOR Clause Missing" && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-accent-red border-2 border-background"></span>
            )}
        </div>
        <div className="flex flex-col flex-1">
            <div className="flex justify-between items-start">
                <p className={`text-sm font-semibold text-white transition-colors ${title === "LIBOR Clause Missing" ? "group-hover:text-accent-red" : title === "Doc Incomplete" ? "group-hover:text-accent-orange" : "group-hover:text-primary"}`}>
                    {title}
                </p>
                <span className="text-[10px] text-text-muted">{time}</span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
        </div>
    </div>
);
