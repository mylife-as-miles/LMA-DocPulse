import React from 'react';
import { Menu, Search, Bell, MessageSquare } from 'lucide-react';
import { ViewState } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface HeaderProps {
    onMenuClick: () => void;
    onNotificationClick?: () => void;
    currentView: ViewState;
    setView: (view: ViewState) => void;
}

export const Header = ({ onMenuClick, onNotificationClick, currentView, setView }: HeaderProps) => {
    return (
        <header className="flex h-20 items-center justify-between px-6 lg:px-8 z-20 border-b border-border/30 lg:border-none shrink-0">
            <div className="flex items-center gap-4 lg:hidden">
                <button onClick={onMenuClick} className="text-white hover:text-primary transition-colors">
                    <Menu size={24} />
                </button>
                <span className="text-lg font-bold font-display tracking-tight">LMA DocPulse</span>
            </div>

            <div className="hidden lg:flex items-center">
                <Breadcrumbs currentView={currentView} setView={setView} />
            </div>

            <div className="flex items-center gap-6">
                <div className="relative hidden w-80 lg:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="text"
                        className="h-10 w-full rounded-full border border-border bg-surface/50 pl-10 pr-4 text-sm text-white placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner"
                        placeholder="Search loans, documents..."
                    />
                </div>

                <div className="flex items-center gap-3 border-l border-border/50 pl-6">
                    <button
                        onClick={onNotificationClick}
                        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/50 text-text-muted hover:text-primary hover:border-primary hover:bg-primary-dim transition-all"
                    >
                        <Bell size={20} />
                        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary shadow-glow-sm"></span>
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/50 text-text-muted hover:text-primary hover:border-primary hover:bg-primary-dim transition-all">
                        <MessageSquare size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};
