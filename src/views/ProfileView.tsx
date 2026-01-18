import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Award, CheckCircle, TrendingUp, Clock, FileText, UserPlus } from 'lucide-react';
import { ViewState } from '../types';
import { useActionFeedback } from '../components/ActionFeedback';
import { db, User } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';

interface ProfileViewProps {
    setView?: (view: ViewState) => void;
}

export const ProfileView = ({ setView }: ProfileViewProps) => {
    const { trigger: shareProfile } = useActionFeedback('Share Profile');
    const [userId, setUserId] = useState<number | undefined>(undefined);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserId(user.id);
        }
    }, []);

    const user = useLiveQuery(
        () => (userId ? db.users.get(userId) : Promise.resolve(undefined)),
        [userId]
    );

    if (!user) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-surface-highlight flex items-center justify-center mb-6 border border-white/5">
                    <UserPlus size={40} className="text-text-muted" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 font-display">No Profile Found</h2>
                <p className="text-text-muted max-w-md mb-8">
                    It looks like you haven't set up your profile yet. Create one to showcase your skills and track your achievements.
                </p>
                <button
                    onClick={() => setView?.('edit_profile')}
                    className="px-8 py-3 bg-primary hover:bg-primary-hover text-black font-bold rounded-full transition-all shadow-glow hover:scale-105"
                >
                    Create Profile
                </button>
            </div>
        );
    }

    const {
        name,
        title,
        email,
        phone,
        location,
        bio,
        skills,
        avatar
    } = user;

    return (
        <div className="flex-1 overflow-y-auto p-0 relative custom-scrollbar">
            {/* Hero Background */}
            <div className="h-64 w-full bg-gradient-to-r from-primary/20 via-primary/5 to-background relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
            </div>

            <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-10 space-y-8 pb-20">
                {/* Header Profile Card */}
                <div className="glass-panel p-6 lg:p-8 rounded-2xl flex flex-col md:flex-row gap-8 items-start md:items-end">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-2xl p-1 bg-gradient-to-br from-primary to-transparent shadow-glow">
                            <img
                                src={avatar || "https://picsum.photos/100/100"}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-xl border-4 border-black"
                            />
                        </div>
                        <div className="absolute -bottom-3 -right-3 bg-surface border border-border p-2 rounded-lg shadow-xl flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Online</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-2">
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-white">{name}</h1>
                        <p className="text-lg text-primary font-medium">{title || 'N/A'}</p>
                        <div className="flex flex-wrap gap-4 pt-2">
                            {email && (
                                <span className="flex items-center gap-2 text-text-muted text-sm bg-surface-highlight/50 px-3 py-1.5 rounded-full border border-border">
                                    <Mail size={14} /> {email}
                                </span>
                            )}
                            {phone && (
                                <span className="flex items-center gap-2 text-text-muted text-sm bg-surface-highlight/50 px-3 py-1.5 rounded-full border border-border">
                                    <Phone size={14} /> {phone}
                                </span>
                            )}
                            {location && (
                                <span className="flex items-center gap-2 text-text-muted text-sm bg-surface-highlight/50 px-3 py-1.5 rounded-full border border-border">
                                    <MapPin size={14} /> {location}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setView?.('edit_profile')}
                            className="px-6 py-2.5 rounded-lg bg-surface border border-border text-white text-sm font-bold hover:bg-surface-highlight transition-all"
                        >
                            Edit Profile
                        </button>
                        <button
                            onClick={() => shareProfile()}
                            className="px-6 py-2.5 rounded-lg bg-primary text-black text-sm font-bold hover:bg-primary-hover shadow-glow transition-all"
                        >
                            Share Profile
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Loans Reviewed', value: '1,248', icon: FileText, color: 'text-primary' },
                        { label: 'Approval Rate', value: '94.2%', icon: CheckCircle, color: 'text-accent-orange' },
                        { label: 'Avg. Turnaround', value: '4.5h', icon: Clock, color: 'text-blue-400' },
                        { label: 'Performance', value: 'Top 5%', icon: TrendingUp, color: 'text-primary' },
                    ].map((stat, i) => (
                        <div key={i} className="glass-panel p-5 rounded-xl group hover:border-primary/30 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2 rounded-lg bg-surface-highlight ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={20} />
                                </div>
                            </div>
                            <h3 className="text-text-muted text-xs font-bold uppercase tracking-wider">{stat.label}</h3>
                            <p className="text-2xl font-display font-bold text-white mt-1">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - About & Skills */}
                    <div className="space-y-8 lg:col-span-2">
                        {bio && (
                            <section className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                <h3 className="text-lg font-bold text-white mb-4 font-display">About Me</h3>
                                <p className="text-text-muted leading-relaxed">
                                    {bio}
                                </p>
                            </section>
                        )}

                        {skills && skills.length > 0 && (
                            <section className="glass-panel p-6 rounded-2xl">
                                <h3 className="text-lg font-bold text-white mb-6 font-display">Expertise & Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, i) => (
                                        <span key={i} className="px-3 py-1.5 rounded-full bg-surface-highlight border border-border text-sm text-slate-300 hover:text-white hover:border-primary/50 transition-colors cursor-default">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section className="glass-panel p-6 rounded-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-white font-display">Recent Activity</h3>
                                <button
                                    onClick={() => setView?.('activity_log')}
                                    className="text-primary text-xs font-bold uppercase hover:text-white transition-colors"
                                >
                                    View All
                                </button>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { title: 'Approved Loan #10294', time: '2 hours ago', desc: 'Cleared all covenant deviations for Acme Global.' },
                                    { title: 'Updated Compliance Policy', time: '1 day ago', desc: 'Revised internal risk threshold for manufacturing sector.' },
                                    { title: 'Review Completed', time: '1 day ago', desc: 'Project Beta documentation analysis finalized.' },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="flex flex-col items-center">
                                            <div className="w-2 h-2 rounded-full bg-primary shadow-glow-sm group-hover:scale-125 transition-transform"></div>
                                            {i !== 2 && <div className="w-px h-full bg-border mt-2"></div>}
                                        </div>
                                        <div className="pb-2">
                                            <h4 className="text-white font-medium text-sm group-hover:text-primary transition-colors">{item.title}</h4>
                                            <p className="text-text-muted text-xs mt-1">{item.desc}</p>
                                            <span className="text-[10px] text-slate-500 mt-2 block">{item.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Achievements & assignments */}
                    <div className="space-y-8">
                        <div className="glass-panel p-6 rounded-2xl">
                            <h3 className="text-lg font-bold text-white mb-6 font-display">Awards</h3>
                            <div className="space-y-4">
                                {[
                                    { title: 'Analyst of the Year', year: '2025', icon: Award },
                                    { title: 'Top Performer Q3', year: '2024', icon: TrendingUp },
                                    { title: 'Innovation Award', year: '2023', icon: Award },
                                ].map((award, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-surface-highlight/30 border border-transparent hover:border-primary/30 transition-all">
                                        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-transparent text-primary">
                                            <award.icon size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm">{award.title}</h4>
                                            <p className="text-text-muted text-xs">{award.year}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-panel p-6 rounded-2xl">
                            <h3 className="text-lg font-bold text-white mb-6 font-display">Current Assignments</h3>
                            <div className="space-y-3">
                                {['Project Alpha', 'Global Logistics Expansion', 'Tech Synergies Merger'].map((project, i) => (
                                    <div key={i} className="p-3 rounded-lg border border-border bg-surface hover:bg-surface-highlight transition-colors cursor-pointer">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-white">{project}</span>
                                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                        </div>
                                        <div className="w-full h-1 bg-surface-highlight rounded-full overflow-hidden">
                                            <div className="h-full bg-primary rounded-full" style={{ width: `${60 + (i * 15)}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-border">
                                <button className="w-full py-2 rounded-lg border border-dashed border-border text-text-muted text-sm hover:text-white hover:border-primary transition-all">
                                    + Assign New Project
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
