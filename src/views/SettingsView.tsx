import React, { useState } from 'react';
import { User, Shield, BellRing, Monitor, Laptop, ChevronDown, Palette, Globe, Key, Smartphone, LogOut, Zap, UserPlus } from 'lucide-react';
import { ViewState } from '../types';
import { toast } from 'sonner';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';

interface SettingsViewProps {
    setView?: (view: ViewState) => void;
}

export const SettingsView = ({ setView }: SettingsViewProps) => {
    const [activeTab, setActiveTab] = useState('General');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Fetch user from database
    const user = useLiveQuery(() => db.users.toArray())?.[0];

    const tabs = [
        { id: 'General', icon: Monitor },
        { id: 'Account', icon: User },
        { id: 'Security', icon: Shield },
        { id: 'Notifications', icon: BellRing },
    ];

    // API Key State
    const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
    const [isSavingKey, setIsSavingKey] = useState(false);

    const handleSaveApiKey = () => {
        setIsSavingKey(true);
        // Simulate a small delay for better UX
        setTimeout(() => {
            localStorage.setItem('openai_api_key', apiKey);
            setIsSavingKey(false);
            toast.success("API Key Saved Successfully", {
                description: "Your OpenAI integration is now configured."
            });

            // Reload after a short delay to apply changes globally
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }, 800);
    };

    const renderAccount = () => {
        // If no user, show empty state prompting onboarding
        if (!user) {
            return (
                <div className="flex-1 glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center animate-fade-in">
                    <div className="p-4 bg-surface-highlight rounded-full mb-4">
                        <UserPlus size={48} className="text-text-muted" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Profile Found</h3>
                    <p className="text-text-muted max-w-md mb-6">Complete the onboarding process to set up your profile and start using all features.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary-hover transition-colors"
                    >
                        Start Onboarding
                    </button>
                </div>
            );
        }

        return (
            <div className="flex-1 space-y-8 min-w-0 animate-fade-in">
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
                                        <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=333&color=666`} className="w-full h-full rounded-full object-cover border-4 border-black" />
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
                            <input type="text" defaultValue={user.name || ''} placeholder="Enter your name" className="w-full bg-surface-dark border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Email Address</label>
                            <input type="email" defaultValue={user.email || ''} placeholder="Enter your email" className="w-full bg-surface-dark border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner" />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Professional Bio</label>
                            <textarea rows={4} className="w-full bg-surface-dark border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none shadow-inner" defaultValue={user.bio || ''} placeholder="Tell us about yourself..." />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderGeneral = () => (
        <div className="flex-1 space-y-8 min-w-0 animate-fade-in">
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

            {/* API Configuration */}
            <div className="glass-panel p-8 rounded-2xl space-y-6 border border-primary/20 bg-primary/5">
                <div className="flex items-center gap-3 mb-6">
                    <Zap size={24} className="text-yellow-400" />
                    <h3 className="text-xl font-display font-bold text-white">API Configuration</h3>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-text-muted flex justify-between">
                            <span>OpenAI API Key</span>
                            <span className="text-xs text-primary/70">Required for AI features</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="sk-..."
                                className="w-full bg-surface-dark border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner font-mono text-sm"
                            />
                            <button
                                onClick={handleSaveApiKey}
                                disabled={isSavingKey}
                                className="px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
                            >
                                {isSavingKey ? 'Saving...' : 'Save Key'}
                            </button>
                        </div>
                        <p className="text-xs text-text-muted">Your API key is stored locally on your device and never sent to our servers.</p>
                    </div>
                </div>
            </div>

            {/* Regional Settings */}
            <div className="glass-panel p-8 rounded-2xl space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <Globe size={24} className="text-blue-400" />
                    <h3 className="text-xl font-display font-bold text-white">Regional Settings</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Language</label>
                        <select className="w-full bg-surface-dark border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner appearance-none">
                            <option>English (UK)</option>
                            <option>English (US)</option>
                            <option>French</option>
                            <option>German</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Timezone</label>
                        <select className="w-full bg-surface-dark border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner appearance-none">
                            <option>London (GMT+0)</option>
                            <option>New York (EST-5)</option>
                            <option>Tokyo (JST+9)</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSecurity = () => (
        <div className="flex-1 space-y-8 min-w-0 animate-fade-in">
            {/* Password Management */}
            <div className="glass-panel p-8 rounded-2xl space-y-8">
                <div className="flex items-center gap-3 mb-6">
                    <Key size={24} className="text-emerald-400" />
                    <h3 className="text-xl font-display font-bold text-white">Password Management</h3>
                </div>
                <div className="space-y-4 max-w-lg">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Current Password</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-surface-dark border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-text-muted">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-surface-dark border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Confirm New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-surface-dark border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner" />
                    </div>
                    <div className="pt-2">
                        <button className="px-5 py-2.5 bg-primary text-black text-sm font-bold rounded-lg hover:bg-primary-hover transition-colors shadow-glow">Update Password</button>
                    </div>
                </div>
            </div>

            {/* 2FA */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex gap-4">
                    <div className="p-3 bg-accent-orange/10 rounded-xl">
                        <Smartphone className="text-accent-orange" size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Two-Factor Authentication</h3>
                        <p className="text-sm text-text-muted max-w-md mt-1">Add an extra layer of security to your account by requiring a code when logging in.</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-14 h-7 bg-surface-dark peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>

            {/* Active Sessions */}
            <div className="glass-panel p-8 rounded-2xl space-y-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Monitor size={24} className="text-slate-400" />
                        <h3 className="text-xl font-display font-bold text-white">Active Sessions</h3>
                    </div>
                    <button className="text-xs font-bold text-red-400 hover:text-red-300 uppercase tracking-wider flex items-center gap-2">
                        <LogOut size={14} /> Log Out All Devices
                    </button>
                </div>

                <div className="space-y-1">
                    {[
                        { device: 'MacBook Pro 16"', location: 'London, UK', active: 'Active now', current: true },
                        { device: 'iPhone 13 Pro', location: 'London, UK', active: 'Active 2h ago', current: false },
                        { device: 'Windows PC', location: 'New York, USA', active: 'Active 2d ago', current: false },
                    ].map((session, i) => (
                        <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-surface-highlight rounded-lg text-text-muted">
                                    {session.device.includes('iPhone') ? <Smartphone size={20} /> : <Laptop size={20} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-bold text-white">{session.device}</h4>
                                        {session.current && <span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full">THIS DEVICE</span>}
                                    </div>
                                    <p className="text-xs text-text-muted mt-0.5">{session.location} • {session.active}</p>
                                </div>
                            </div>
                            <button className="p-2 text-text-muted hover:text-white opacity-0 group-hover:opacity-100 transition-all" title="Revoke Access">
                                <LogOut size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

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
                    {activeTab === 'General' && renderGeneral()}
                    {activeTab === 'Account' && renderAccount()}
                    {activeTab === 'Security' && renderSecurity()}
                    {activeTab === 'Notifications' && (
                        <div className="flex-1 glass-panel p-8 rounded-2xl flex items-center justify-center text-text-muted animate-fade-in">
                            <div className="text-center">
                                <BellRing size={48} className="mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg font-bold text-white mb-2">Notifications</h3>
                                <p>Manage your notification preferences here.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
