import React from 'react';
import { User, Shield, BellRing, Database, Smartphone, Palette, Globe } from 'lucide-react';

export const SettingsView = () => {
    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2 custom-scrollbar">
            <div className="mx-auto max-w-4xl flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-display font-bold text-white">Settings</h2>
                    <p className="text-text-muted">Manage your account preferences and system configurations.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Settings Sidebar */}
                    <nav className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
                        {['General', 'Account', 'Notifications', 'Security', 'Integrations'].map((item, i) => (
                            <button key={i} className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${i === 0 ? 'bg-primary/10 text-primary border border-primary/20' : 'text-text-muted hover:bg-surface-highlight hover:text-white'}`}>
                                {item}
                            </button>
                        ))}
                    </nav>

                    {/* Main Settings Content */}
                    <div className="flex-1 space-y-8">
                        {/* Profile Section */}
                        <div className="glass-panel p-6 rounded-xl space-y-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <User size={20} className="text-primary" /> Profile Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-muted">Display Name</label>
                                    <input type="text" defaultValue="Alex Morgan" className="w-full bg-surface-dark border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-muted">Email Address</label>
                                    <input type="email" defaultValue="alex.morgan@lmadocpulse.com" className="w-full bg-surface-dark border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary/50" />
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-text-muted">Bio</label>
                                    <textarea rows={3} className="w-full bg-surface-dark border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 resize-none" defaultValue="Senior Credit Analyst specializing in syndicated loans and LMA compliance." />
                                </div>
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="glass-panel p-6 rounded-xl space-y-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Palette size={20} className="text-primary" /> App Appearance
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-surface-highlight/30">
                                    <div className="flex items-center gap-3">
                                        <Globe size={18} />
                                        <span className="text-sm font-medium text-white">Language</span>
                                    </div>
                                    <select className="bg-surface-dark border border-border rounded px-3 py-1 text-sm text-text-muted focus:outline-none">
                                        <option>English (US)</option>
                                        <option>French</option>
                                        <option>Spanish</option>
                                    </select>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg bg-surface-highlight/30">
                                    <div className="flex items-center gap-3">
                                        <BellRing size={18} />
                                        <span className="text-sm font-medium text-white">Email Notifications</span>
                                    </div>
                                    <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer">
                                        <div className="absolute top-1 right-1 w-4 h-4 bg-black rounded-full shadow" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
