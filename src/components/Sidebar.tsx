import React, { useState } from 'react';
import {
    LayoutDashboard,
    PieChart,
    Files,
    ShieldCheck,
    Settings,
    X,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    LogOut
} from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    currentView: ViewState;
    setView: (v: ViewState) => void;
}

export const Sidebar = ({ isOpen, setIsOpen, currentView, setView }: SidebarProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { id: 'analytics', icon: <PieChart size={20} />, label: 'Portfolio Analytics' },
        { id: 'vault', icon: <Files size={20} />, label: 'Document Vault' },
        { id: 'compliance', icon: <ShieldCheck size={20} />, label: 'Compliance' },
        { id: 'smart_query', icon: <Sparkles size={20} />, label: 'Smart Query' },
    ];

    const handleViewChange = (id: string) => {
        // Safe cast as we know the ids match ViewState (mostly)
        if (id === 'dashboard' || id === 'vault' || id === 'smart_query' || id === 'analytics' || id === 'compliance' || id === 'settings') {
            setView(id as ViewState);
        }
    };

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
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-50
                    flex flex-col border-r border-border bg-background transition-all duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    ${isCollapsed ? 'w-20' : 'w-72'}
                `}
            >
                {/* Logo Area */}
                <div className={`flex h-20 items-center px-6 border-b border-border/50 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary shadow-glow-sm">
                            <div className="h-4 w-4 bg-black rounded-sm transform rotate-45" />
                        </div>
                        {!isCollapsed && (
                            <h1 className="text-xl font-display font-bold tracking-tight text-white animate-fade-in-up">
                                LMA <span className="text-primary font-light">DocPulse</span>
                            </h1>
                        )}
                    </div>
                    <button className="ml-auto lg:hidden" onClick={() => setIsOpen(false)}>
                        <X size={20} className="text-text-muted" />
                    </button>
                </div>

                {/* Nav Links */}
                <div className="flex flex-1 flex-col justify-between overflow-y-auto py-6 custom-scrollbar overflow-x-hidden">
                    <div className="flex flex-col gap-6">
                        <nav className="flex flex-col gap-1 px-3">
                            {!isCollapsed && (
                                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-text-muted animate-fade-in">
                                    Overview
                                </p>
                            )}
                            {navItems.map((item, idx) => {
                                const isActive = currentView === item.id ||
                                    (item.id === 'vault' && currentView === 'upload');

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleViewChange(item.id)}
                                        className={`
                                            flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative
                                            ${isActive
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-text-muted hover:bg-surface-highlight hover:text-white'
                                            }
                                            ${isCollapsed ? 'justify-center' : ''}
                                        `}
                                        title={isCollapsed ? item.label : ''}
                                    >
                                        <span className={`${isActive ? 'text-primary' : 'text-text-muted group-hover:text-white'}`}>
                                            {item.icon}
                                        </span>
                                        {!isCollapsed && <span className="truncate">{item.label}</span>}

                                        {isActive && !isCollapsed && (
                                            <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary shadow-glow-sm" />
                                        )}
                                    </button>
                                );
                            })}
                        </nav>

                        <nav className="flex flex-col gap-1 px-3">
                            {!isCollapsed && (
                                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-text-muted animate-fade-in">
                                    System
                                </p>
                            )}
                            <button
                                onClick={() => setView('settings')}
                                className={`
                                    flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative
                                    ${currentView === 'settings'
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-text-muted hover:bg-surface-highlight hover:text-white'
                                    }
                                    ${isCollapsed ? 'justify-center' : ''}
                                `}
                                title={isCollapsed ? 'Settings' : ''}
                            >
                                <Settings size={20} />
                                {!isCollapsed && <span>Configuration</span>}
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Footer / Toggle */}
                <div className="p-4 border-t border-border/50 flex flex-col gap-4">
                    {/* User Profile */}
                    <div className={`flex items-center gap-3 rounded-xl bg-surface border border-border p-2 hover:border-primary/50 transition-colors cursor-pointer group ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="relative shrink-0">
                            <img
                                src="https://picsum.photos/100/100"
                                alt="User"
                                className="h-8 w-8 rounded-full object-cover ring-2 ring-border group-hover:ring-primary transition-all"
                            />
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-primary border-2 border-surface"></span>
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col overflow-hidden animate-fade-in">
                                <span className="truncate text-xs font-bold text-white font-display">Alex Morgan</span>
                                <span className="truncate text-[10px] text-text-muted">Senior Analyst</span>
                            </div>
                        )}
                        {!isCollapsed && (
                            <LogOut size={16} className="ml-auto text-text-muted hover:text-white transition-colors" />
                        )}
                    </div>

                    {/* Collapse Toggle */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex w-full items-center justify-center p-2 rounded-lg hover:bg-surface-highlight text-text-muted hover:text-white transition-all"
                    >
                        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>
            </aside>
        </>
    );
};
