import React from 'react';
import { ViewState } from '../types';
import { motion } from 'framer-motion';
import { ChevronLeft, Share2, Award, Briefcase, MapPin, Mail, Linkedin, Twitter } from 'lucide-react';
import { useActionFeedback } from '../components/ActionFeedback';

interface PublicProfileViewProps {
    setView: (view: ViewState) => void;
}

export const PublicProfileView = ({ setView }: PublicProfileViewProps) => {
    const { trigger: copyLink } = useActionFeedback('Copy Link');

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 overflow-y-auto p-0 relative custom-scrollbar bg-white text-slate-900"
        >
             {/* Public facing profile is often lighter/cleaner */}
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
                                    src="https://picsum.photos/100/100"
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">Alex Morgan</h1>
                                <p className="text-lg text-slate-500 font-medium">Senior Credit Analyst at LMA DocPulse</p>
                                <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-sm text-slate-400">
                                    <span className="flex items-center gap-1"><MapPin size={14} /> London, UK</span>
                                    <span className="flex items-center gap-1"><Briefcase size={14} /> 8 Years Exp.</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button onClick={() => copyLink()} className="flex-1 md:flex-none px-6 py-2.5 rounded-lg bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                <Share2 size={18} /> Share Profile
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="md:col-span-2 space-y-8">
                            <section>
                                <h3 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">About</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Senior Credit Analyst specializing in syndicated loans and LMA compliance.
                                    Experienced in structuring complex financial deals and leveraging AI technology to streamline documentation review processes.
                                    Proven track record of maintaining high portfolio health and regulatory adherence.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">Experience</h3>
                                <div className="space-y-6">
                                    {[
                                        { role: 'Senior Credit Analyst', company: 'LMA DocPulse', date: '2021 - Present' },
                                        { role: 'Credit Risk Associate', company: 'Global Banking Corp', date: '2017 - 2021' },
                                        { role: 'Junior Analyst', company: 'FinTech Solutions', date: '2015 - 2017' },
                                    ].map((job, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center shrink-0">
                                                <Briefcase size={20} className="text-slate-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{job.role}</h4>
                                                <p className="text-sm text-slate-500">{job.company}</p>
                                                <p className="text-xs text-slate-400 mt-1">{job.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="space-y-8">
                            <section>
                                <h3 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">Connect</h3>
                                <div className="flex flex-col gap-3">
                                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-colors">
                                        <Linkedin size={20} className="text-[#0077b5]" /> /in/alexmorgan
                                    </a>
                                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-colors">
                                        <Twitter size={20} className="text-[#1da1f2]" /> @alexmorgan_fin
                                    </a>
                                     <a href="#" className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-colors">
                                        <Mail size={20} className="text-slate-400" /> Contact Me
                                    </a>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">Achievements</h3>
                                <div className="space-y-3">
                                    {[
                                        'Top Performer 2024',
                                        'Certified LMA Practitioner',
                                        'FinTech Innovation Award'
                                    ].map((award, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <Award size={16} className="text-yellow-500" />
                                            <span className="text-sm text-slate-600 font-medium">{award}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
