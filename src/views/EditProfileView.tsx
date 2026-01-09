import React from 'react';
import { ViewState } from '../types';
import { motion } from 'framer-motion';
import { ChevronLeft, Save, User, Mail, Briefcase, MapPin, Phone } from 'lucide-react';
import { useActionFeedback } from '../components/ActionFeedback';

interface EditProfileViewProps {
    setView: (view: ViewState) => void;
}

export const EditProfileView = ({ setView }: EditProfileViewProps) => {
    const { trigger: saveProfile } = useActionFeedback('Update Profile');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        await saveProfile(async () => {
             // Mock API call
        });
        setTimeout(() => setView('profile'), 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2 custom-scrollbar"
        >
             <div className="mx-auto max-w-3xl flex flex-col gap-8 pb-20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setView('profile')}
                            className="p-2 rounded-full hover:bg-surface-highlight text-text-muted hover:text-white transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div>
                            <h2 className="text-3xl font-display font-bold text-white">Edit Profile</h2>
                            <p className="text-text-muted mt-1">Update your personal information.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSave} className="glass-panel p-8 rounded-2xl space-y-8">
                    {/* Avatar Upload */}
                    <div className="flex items-center gap-6 pb-6 border-b border-border/50">
                        <div className="w-24 h-24 rounded-full bg-surface-highlight border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors group">
                             <User className="text-text-muted group-hover:text-primary transition-colors" size={32} />
                        </div>
                        <div>
                            <button type="button" className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-bold text-white hover:bg-white/10 transition-colors">
                                Change Avatar
                            </button>
                            <p className="text-xs text-text-muted mt-2">JPG, GIF or PNG. Max size 800K.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-text-muted flex items-center gap-2">
                                <User size={14} /> Full Name
                            </label>
                            <input type="text" defaultValue="Alex Morgan" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-text-muted flex items-center gap-2">
                                <Briefcase size={14} /> Job Title
                            </label>
                            <input type="text" defaultValue="Senior Credit Analyst" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-text-muted flex items-center gap-2">
                                <Mail size={14} /> Email
                            </label>
                            <input type="email" defaultValue="alex.morgan@lmadocpulse.com" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-text-muted flex items-center gap-2">
                                <Phone size={14} /> Phone
                            </label>
                            <input type="tel" defaultValue="+44 20 7123 4567" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                         <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold uppercase text-text-muted flex items-center gap-2">
                                <MapPin size={14} /> Location
                            </label>
                            <input type="text" defaultValue="London, United Kingdom" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold uppercase text-text-muted">Bio</label>
                            <textarea rows={4} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary resize-none" defaultValue="Dedicated Senior Credit Analyst with over 8 years of experience in syndicated loans and LMA compliance." />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t border-border/50">
                        <button
                            type="button"
                            onClick={() => setView('profile')}
                            className="px-6 py-2.5 rounded-lg border border-border text-text-muted font-bold text-sm hover:text-white transition-all"
                        >
                            Cancel
                        </button>
                         <button
                            type="submit"
                            className="px-8 py-2.5 rounded-lg bg-primary text-black font-bold text-sm hover:shadow-glow transition-all flex items-center gap-2"
                        >
                            <Save size={18} /> Save Changes
                        </button>
                    </div>
                </form>
             </div>
        </motion.div>
    );
};
