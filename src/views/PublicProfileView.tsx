import React from 'react';
import { ViewState } from '../types';
import { motion } from 'framer-motion';
import { ChevronLeft, Share2, Award, MapPin, UserPlus } from 'lucide-react';
import { useActionFeedback } from '../components/ActionFeedback';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';

interface PublicProfileViewProps {
    setView: (view: ViewState) => void;
}

export const PublicProfileView = ({ setView }: PublicProfileViewProps) => {
    const { trigger: copyLink } = useActionFeedback('Copy Link');

    // Fetch user from database
    const user = useLiveQuery(() => db.users.toArray())?.[0];

    // Empty state if no user
    if (!user) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex items-center justify-center p-8 bg-surface"
            >
                <div className="text-center">
                    <div className="p-4 bg-surface-highlight rounded-full inline-block mb-4">
                        <UserPlus size={48} className="text-text-muted" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">No Profile Found</h2>
                    <p className="text-text-muted mb-6">Complete onboarding to create your profile.</p>
                    <button
                        onClick={() => setView('settings')}
                        className="px-6 py-3 bg-primary text-black font-bold rounded-lg"
                    >
                        Go to Settings
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 overflow-y-auto p-0 relative custom-scrollbar bg-white text-slate-900"
        >
            <div className="h-64 w-full bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
                <div className="absolute top-6 left-6 z-10">
                    <button
                        onClick={() => setView('settings')}
                        className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors backdrop-blur-md"
                    >
                        <ChevronLeft size={24} />
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 pb-20 -mt-24 relative z-10">
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                            <div className="w-32 h-32 rounded-full p-1 bg-white shadow-lg -mt-20">
                                <img
                                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=333&color=666&size=256`}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">{user.name || 'Anonymous User'}</h1>
                                <p className="text-lg text-slate-500 font-medium">{user.title || 'No title set'}</p>
                                <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-sm text-slate-400">
                                    <span className="flex items-center gap-1"><MapPin size={14} />{user.location || 'Location not set'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button onClick={() => copyLink()} className="flex-1 md:flex-none px-6 py-2.5 rounded-lg bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                <Share2 size={18} />Share Profile
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="md:col-span-2 space-y-8">
                            <section>
                                <h3 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">About</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {user.bio || 'No bio provided yet. Update your profile in settings.'}
                                </p>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {user.skills && user.skills.length > 0 ? (
                                        user.skills.map((skill, i) => (
                                            <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">{skill}</span>
                                        ))
                                    ) : (
                                        <span className="text-slate-400">No skills added yet</span>
                                    )}
                                </div>
                            </section>
                        </div>

                        <div className="space-y-8">
                            <section>
                                <h3 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">Stats</h3>
                                {user.stats ? (
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Loans Reviewed</span>
                                            <span className="font-bold text-slate-900">{user.stats.loansReviewed}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Approval Rate</span>
                                            <span className="font-bold text-slate-900">{user.stats.approvalRate}%</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-slate-400">No stats available yet</p>
                                )}
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">Awards</h3>
                                <div className="space-y-3">
                                    {user.awards && user.awards.length > 0 ? (
                                        user.awards.map((award, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <Award size={16} className="text-yellow-500" />
                                                <span className="text-sm text-slate-600 font-medium">{award.title} ({award.year})</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-slate-400">No awards yet</p>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
