import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Save, User, Mail, Briefcase, MapPin, Phone, X, Plus } from 'lucide-react';
import { useActionFeedback } from '../components/ActionFeedback';
import { toast } from 'sonner';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';

interface EditProfileViewProps {
    setView: (view: ViewState) => void;
}

export const EditProfileView = ({ setView }: EditProfileViewProps) => {
    const { trigger: saveProfile } = useActionFeedback('Update Profile');
    const [userId, setUserId] = useState<number | undefined>(undefined);

    // Initial load of user ID
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserId(user.id);
        }
    }, []);

    // Fetch user data
    const user = useLiveQuery(
        () => (userId ? db.users.get(userId) : Promise.resolve(undefined)),
        [userId]
    );

    // Local state for form fields
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        avatar: ''
    });

    const [skills, setSkills] = useState<string[]>([]);
    const [newSkill, setNewSkill] = useState('');

    // Update local state when user data is loaded
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                title: user.title || '',
                email: user.email || '',
                phone: user.phone || '',
                location: user.location || '',
                bio: user.bio || '',
                avatar: user.avatar || ''
            });
            setSkills(user.skills || []);
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        await saveProfile(async () => {
            await db.users.update(userId, {
                name: formData.name,
                title: formData.title,
                email: formData.email,
                phone: formData.phone,
                location: formData.location,
                bio: formData.bio,
                skills: skills,
                avatar: formData.avatar
            });
        });
        setTimeout(() => setView('profile'), 1000);
    };

    const addSkill = () => {
        if (newSkill && !skills.includes(newSkill)) {
            setSkills([...skills, newSkill]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    // Ref for file input
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData(prev => ({ ...prev, avatar: base64String }));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    const removeAvatar = () => {
        setFormData(prev => ({ ...prev, avatar: '' }));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto p-0 relative custom-scrollbar bg-background h-full w-full"
        >
            {/* Hero Background - matching ProfileView */}
            <div className="h-64 w-full bg-gradient-to-r from-primary/20 via-primary/5 to-background relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-10 pb-20">

                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => setView('profile')}
                        className="p-2 rounded-full bg-surface border border-border hover:bg-surface-highlight text-text-muted hover:text-white transition-colors shadow-lg"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-3xl font-display font-bold text-white">Edit Profile</h2>
                        <p className="text-text-muted mt-1 text-sm">Update your personal details and expertise.</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                    {/* Main Info Card */}
                    <div className="glass-panel p-8 rounded-2xl space-y-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                        {/* Avatar Upload */}
                        <div className="flex items-center gap-8 pb-8 border-b border-border/50">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-2xl p-1 bg-gradient-to-br from-primary to-transparent shadow-glow">
                                    <img
                                        src={formData.avatar || "https://picsum.photos/100/100"}
                                        alt="Current Avatar"
                                        className="w-full h-full object-cover rounded-xl border-2 border-black"
                                    />
                                </div>
                                <div
                                    onClick={triggerFileUpload}
                                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    <span className="text-xs font-bold text-white">Change</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Profile Picture</h3>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={triggerFileUpload}
                                        className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-sm font-bold text-primary hover:bg-primary/20 transition-colors"
                                    >
                                        Upload New
                                    </button>
                                    <button
                                        type="button"
                                        onClick={removeAvatar}
                                        className="px-4 py-2 bg-transparent border border-border rounded-lg text-sm font-bold text-text-muted hover:text-white hover:border-white/30 transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                                <p className="text-[10px] text-text-muted mt-2">JPG, GIF or PNG. Max size 800K.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2 group">
                                <label className="text-xs font-bold uppercase text-text-muted flex items-center gap-2 group-focus-within:text-primary transition-colors">
                                    <User size={14} /> Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-surface-dark border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner"
                                />
                            </div>
                            <div className="space-y-2 group">
                                <label className="text-xs font-bold uppercase text-text-muted flex items-center gap-2 group-focus-within:text-primary transition-colors">
                                    <Briefcase size={14} /> Job Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full bg-surface-dark border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner"
                                />
                            </div>
                            <div className="space-y-2 group">
                                <label className="text-xs font-bold uppercase text-text-muted flex items-center gap-2 group-focus-within:text-primary transition-colors">
                                    <Mail size={14} /> Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-surface-dark border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner"
                                />
                            </div>
                            <div className="space-y-2 group">
                                <label className="text-xs font-bold uppercase text-text-muted flex items-center gap-2 group-focus-within:text-primary transition-colors">
                                    <Phone size={14} /> Phone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full bg-surface-dark border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2 group">
                                <label className="text-xs font-bold uppercase text-text-muted flex items-center gap-2 group-focus-within:text-primary transition-colors">
                                    <MapPin size={14} /> Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full bg-surface-dark border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2 group">
                                <label className="text-xs font-bold uppercase text-text-muted group-focus-within:text-primary transition-colors">Bio</label>
                                <textarea
                                    name="bio"
                                    rows={4}
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    className="w-full bg-surface-dark border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none shadow-inner leading-relaxed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className="glass-panel p-8 rounded-2xl space-y-6 shadow-2xl">
                        <h3 className="text-xl font-display font-bold text-white">Expertise & Skills</h3>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                placeholder="Add a skill (e.g. 'Project Management')"
                                className="flex-1 bg-surface-dark border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner"
                            />
                            <button
                                type="button"
                                onClick={addSkill}
                                className="px-4 bg-surface border border-border hover:bg-surface-highlight hover:border-primary/50 text-white rounded-lg transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-3 p-4 bg-surface-dark/50 rounded-xl border border-white/5 min-h-[100px]">
                            <AnimatePresence>
                                {skills.map((skill) => (
                                    <motion.span
                                        key={skill}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-highlight border border-border text-sm text-slate-300 group hover:border-primary/50 transition-colors"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            className="text-text-muted hover:text-white transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </motion.span>
                                ))}
                            </AnimatePresence>
                            {skills.length === 0 && (
                                <p className="text-text-muted text-sm italic w-full text-center py-2">No skills added yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setView('profile')}
                            className="px-8 py-3 rounded-lg border border-border bg-surface text-text-muted font-bold text-sm hover:text-white hover:border-white/20 transition-all shadow-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 rounded-lg bg-primary text-black font-bold text-sm hover:shadow-glow hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <Save size={18} /> Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};
