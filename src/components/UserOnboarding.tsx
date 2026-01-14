import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';
import { toast } from 'sonner';
import { User as UserIcon, Briefcase, Mail, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const UserOnboarding = () => {
    const users = useLiveQuery(() => db.users.toArray());
    const [isOpen, setIsOpen] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [email, setEmail] = useState('');
    const [accessCode, setAccessCode] = useState(''); // Just for "advanced" feel
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (users !== undefined && users.length === 0) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [users]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email) {
            toast.error("Please fill in required fields");
            return;
        }

        try {
            await db.users.add({
                name,
                email,
                title: title || 'Analyst',
                password: 'password123', // Default for this demo flow
                bio: 'New team member',
                skills: ['Financial Analysis', 'Compliance'],
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00FF94&color=000`
            });

            toast.success(`Welcome aboard, ${name}!`);
            setIsOpen(false);

            // Optional: Reload to ensure app context picks up user state immediately if needed
            // window.location.reload(); 
        } catch (error) {
            console.error(error);
            toast.error("Failed to create profile");
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="relative w-full max-w-lg bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary/20 to-blue-500/20 p-1 h-2 w-full" />

                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-glow">
                                <ShieldCheck size={32} className="text-black" />
                            </div>
                            <h2 className="text-3xl font-display font-bold text-white mb-2">Welcome to DocPulse</h2>
                            <p className="text-text-muted">Secure Workspace Setup</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">Full Name</label>
                                    <div className="relative group">
                                        <UserIcon className="absolute left-3 top-3 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                            placeholder="Enter your name"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">Professional Title</label>
                                    <div className="relative group">
                                        <Briefcase className="absolute left-3 top-3 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                            placeholder="e.g. Senior Credit Analyst"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">Work Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-3 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                            placeholder="name@organization.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-primary to-green-500 text-black font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(0,255,148,0.4)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                            >
                                <span>Initialize Workspace</span>
                                <ArrowRight size={18} />
                            </button>

                            <p className="text-center text-[10px] text-text-muted">
                                By continuing, you acknowledge that all activity is logged for compliance purposes.
                            </p>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
