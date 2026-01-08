import React from 'react';
import {
    LayoutDashboard,
    PieChart,
    Files,
    ShieldCheck,
    Gavel,
    Settings,
    X,
    Sparkles
} from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    currentView: ViewState;
    setView: (v: ViewState) => void;
}

export const Sidebar = ({ isOpen, setIsOpen, currentView, setView }: SidebarProps) => {
    const navItems = [
        { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { id: 'analytics', icon: <PieChart size={20} />, label: 'Portfolio Analytics' },
        { id: 'vault', icon: <Files size={20} />, label: 'Document Vault' },
        { id: 'compliance', icon: <ShieldCheck size={20} />, label: 'Compliance' },
        { id: 'compliance', icon: <ShieldCheck size={20} />, label: 'Compliance' },
        { id: 'smart_query', icon: <Sparkles size={20} />, label: 'Smart Query' },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        flex w-72 flex-col border-r border-border bg-background transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                {/* Logo Area */}
                <div className="flex h-20 items-center gap-3 px-8 border-b border-border/50">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-primary shadow-glow-sm">
                        <div className="h-4 w-4 bg-black rounded-sm transform rotate-45" />
                    </div>
                    <h1 className="text-xl font-display font-bold tracking-tight text-white">LMA DocPulse</h1>
                    <button className="ml-auto lg:hidden" onClick={() => setIsOpen(false)}>
                        <X size={20} className="text-text-muted" />
                    </button>
                </div>

                {/* Nav Links */}
                <div className="flex flex-1 flex-col justify-between overflow-y-auto py-8 custom-scrollbar">
                    <div className="flex flex-col gap-8">
                        <nav className="flex flex-col gap-1 px-4">
                            <p className="mb-3 px-4 text-[11px] font-bold uppercase tracking-widest text-text-muted">Overview</p>
                            {navItems.map((item, idx) => {
                                const isActive = (item.id === 'dashboard' && currentView === 'dashboard') ||
                                    (item.id === 'vault' && (currentView === 'vault' || currentView === 'upload')) ||
                                    (item.id === 'smart_query' && currentView === 'smart_query');

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            if (item.id === 'dashboard') setView('dashboard');
                                            if (item.id === 'vault') setView('vault');
                                            if (item.id === 'smart_query') setView('smart_query');
                                        }}
                                        className={`flex w-full items-center gap-3 rounded-r-lg px-4 py-3 text-sm font-medium transition-all duration-200 border-l-[3px]
                      ${isActive
                                                ? 'bg-primary-dim text-primary border-primary'
                                                : 'border-transparent text-text-muted hover:bg-surface-highlight hover:text-white'
                                            }`}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </button>
                                );
                            })}
                        </nav>

                        <nav className="flex flex-col gap-1 px-4">
                            <p className="mb-3 px-4 text-[11px] font-bold uppercase tracking-widest text-text-muted">Settings</p>
                            <a href="#" className="flex items-center gap-3 rounded-r-lg px-4 py-3 text-sm font-medium text-text-muted hover:bg-surface-highlight hover:text-white transition-all border-l-[3px] border-transparent">
                                <Settings size={20} />
                                Configuration
                            </a>
                        </nav>
                    </div>
                </div>

                {/* User Profile */}
                <div className="p-6 border-t border-border/50">
                    <div className="flex items-center gap-3 rounded-xl bg-surface border border-border p-3 hover:border-primary/50 transition-colors cursor-pointer group">
                        <div className="relative">
                            <img
                                src="https://picsum.photos/100/100"
                                alt="User"
                                className="h-10 w-10 rounded-full object-cover ring-2 ring-border group-hover:ring-primary transition-all"
                            />
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-primary border-2 border-surface"></span>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="truncate text-sm font-bold text-white font-display">Alex Morgan</span>
                            <span className="truncate text-xs text-text-muted">Senior Analyst</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};
