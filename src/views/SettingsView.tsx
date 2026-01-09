import React, { useState } from 'react';
import { User, Shield, BellRing, Monitor, Laptop, ChevronDown, Palette } from 'lucide-react';
import { ViewState } from '../types';

interface SettingsViewProps {
    setView?: (view: ViewState) => void;
}

export const SettingsView = ({ setView }: SettingsViewProps) => { // Added setView prop
    const [activeTab, setActiveTab] = useState('General');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const tabs = [
        { id: 'General', icon: Monitor },
        { id: 'Acccount', icon: User },
        { id: 'Security', icon: Shield },
        { id: 'Notifications', icon: BellRing },
    ];

    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2 custom-scrollbar bg-pattern h-full">
            <div className="mx-auto max-w-6xl flex flex-col gap-8 pb-20 h-full">
                <div className="flex flex-col gap-2 relative">
                    <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                    <h2 className="text-3xl font-display font-bold text-white relative z-10">System Preferences</h2>
                    <p className="text-text-muted relative z-10">Configure your workspace and account settings.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 relative z-10 flex-1">
                    {/* Settings Sidebar */}
                    <nav className={`flex flex-col gap-2 shrink-0 transition-all duration-300 ${isSidebarOpen ? 'w-full lg:w-64' : 'w-full lg:w-16 items-center lg:items-start'}`}>
                        <div className="flex justify-between items-center px-2 mb-2 w-full">
                            {isSidebarOpen && <span className="text-xs font-bold text-text-muted uppercase tracking-wider hidden lg:block">Menu</span>}
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="text-text-muted hover:text-white transition-colors p-1 hidden lg:block"
                                title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                            >
                                <ChevronDown className={isSidebarOpen ? "rotate-90" : "-rotate-90"} size={16} />
                            </button>
                        </div>

                        {tabs.map((tab, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    rounded-xl font-bold transition-all flex items-center gap-3 group relative overflow-hidden
                                    ${isSidebarOpen
                                        ? 'text-left px-5 py-4 text-sm w-full'
                                        : 'justify-center p-3 w-12 h-12'
                                    }
                                    ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-primary/20 to-transparent text-primary border border-primary/20 shadow-glow-sm'
                                        : 'text-text-muted hover:bg-surface-highlight hover:text-white border border-transparent'
                                    }
                                `}
                                title={!isSidebarOpen ? tab.id : ''}
                            >
                                <tab.icon size={18} className={`shrink-0 ${activeTab === tab.id ? 'text-primary' : 'text-slate-500 group-hover:text-white transition-colors'}`} />
                                {isSidebarOpen && <span>{tab.id}</span>}
                            </button>
                        ))}
                    </nav>

                    {/* Main Settings Content */}
                    <div className="flex-1 space-y-8 min-w-0">
                        {/* Interactive Profile Section */}
                        <div className="glass-panel p-8 rounded-2xl space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

                            <div className="flex items-center justify-between border-b border-border/50 pb-6">
                                <div>
                                    <h3 className="text-xl font-display font-bold text-white">Profile Customization</h3>
                                    <p className="text-sm text-text-muted mt-1">Update your public profile and details.</p>
                                </div>
                                <button
                                    onClick={() => setView?.('public_profile')}
                                    className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium text-white hover:border-primary transition-colors"
                                >
                                    View Public Profile
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Avatar</label>
                                    <div className="flex items-center gap-6">
                                        <div className="relative group cursor-pointer">
                                            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-br from-primary to-accent-blue">
                                                <img src="https://picsum.photos/100/100" className="w-full h-full rounded-full object-cover border-4 border-black" />
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-xs font-bold text-white">Change</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <button className="px-4 py-2 bg-primary text-black text-sm font-bold rounded-lg hover:bg-primary-hover transition-colors">Upload New</button>
                                            <button className="block text-xs text-red-400 hover:text-red-300 transition-colors">Remove Profile Picture</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Display Name</label>
                                    <input type="text" defaultValue="Alex Morgan" className="w-full bg-surface-dark border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Email Address</label>
                                    <input type="email" defaultValue="alex.morgan@lmadocpulse.com" className="w-full bg-surface-dark border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner" />
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Professional Bio</label>
                                    <textarea rows={4} className="w-full bg-surface-dark border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none shadow-inner" defaultValue="Senior Credit Analyst specializing in syndicated loans and LMA compliance. Leveraging advanced analytics to drive decision making." />
                                </div>
                            </div>
                        </div>

                        {/* Toggle Preferences */}
                        <div className="glass-panel p-8 rounded-2xl space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Palette size={24} className="text-accent-orange" />
                                <h3 className="text-xl font-display font-bold text-white">Interface & Experience</h3>
                            </div>

                            <div className="space-y-4 divide-y divide-border/30">
                                {[
                                    { title: 'Dark Mode', desc: 'Use system theme preference', active: true, icon: Monitor },
                                    { title: 'Compact View', desc: 'Display more data on screen', active: false, icon: Laptop },
                                    { title: 'Animation Effects', desc: 'Enable smooth transitions', active: true, icon: Palette },
                                ].map((pref, i) => (
                                    <div key={i} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${pref.active ? 'bg-primary/10 text-primary' : 'bg-surface-highlight text-text-muted'}`}>
                                                <pref.icon size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white">{pref.title}</h4>
                                                <p className="text-xs text-text-muted">{pref.desc}</p>
                                            </div>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${pref.active ? 'bg-primary' : 'bg-surface-highlight'}`}>
                                            <div className={`absolute top-1 w-4 h-4 rounded-full shadow transition-all bg-white ${pref.active ? 'left-7' : 'left-1'}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
