import React from 'react';
import { ViewState } from '../types';
import { motion } from 'framer-motion';
import { ChevronLeft, Clock, FileText, CheckCircle2, MessageSquare, Edit3 } from 'lucide-react';

interface ActivityLogViewProps {
    setView: (view: ViewState) => void;
}

export const ActivityLogView = ({ setView }: ActivityLogViewProps) => {
    const activities = [
        { id: 1, type: 'review', title: 'Reviewed Loan Agreement #LN-2024-001', time: '2 hours ago', user: 'Alex Morgan', icon: FileText, color: 'text-blue-400' },
        { id: 2, type: 'approve', title: 'Approved Covenant Deviation for Alpha Corp', time: '4 hours ago', user: 'Alex Morgan', icon: CheckCircle2, color: 'text-green-400' },
        { id: 3, type: 'comment', title: 'Commented on "Financial Covenants" section', time: 'Yesterday at 4:30 PM', user: 'Alex Morgan', icon: MessageSquare, color: 'text-purple-400' },
        { id: 4, type: 'edit', title: 'Updated risk profile for Gamma Industries', time: 'Yesterday at 2:15 PM', user: 'Alex Morgan', icon: Edit3, color: 'text-amber-400' },
        { id: 5, type: 'review', title: 'Started analysis of New York Syndication Docs', time: '2 days ago', user: 'Alex Morgan', icon: FileText, color: 'text-blue-400' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
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
                            <h2 className="text-3xl font-display font-bold text-white">Activity Log</h2>
                            <p className="text-text-muted mt-1">Detailed timeline of your recent actions.</p>
                        </div>
                    </div>
                </div>

                <div className="relative border-l border-border ml-4 space-y-8">
                    {activities.map((item, i) => (
                        <div key={item.id} className="relative pl-8 group">
                            {/* Dot */}
                            <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-background ${item.color.replace('text', 'bg')} shadow-[0_0_10px_currentColor] transition-transform group-hover:scale-125`}></div>

                            <div className="glass-panel p-5 rounded-xl hover:bg-surface-highlight/10 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-surface-highlight/50 ${item.color}`}>
                                            <item.icon size={18} />
                                        </div>
                                        <h3 className="text-white font-bold text-sm">{item.title}</h3>
                                    </div>
                                    <span className="text-xs text-text-muted font-mono flex items-center gap-1">
                                        <Clock size={12} /> {item.time}
                                    </span>
                                </div>
                                <p className="text-sm text-text-muted pl-[52px]">
                                    Action performed by <span className="text-white font-medium">{item.user}</span>.
                                    Logged for audit purposes ID: <span className="font-mono text-xs opacity-50">LOG-{1000 + i}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center pt-4">
                    <button className="text-xs font-bold uppercase tracking-wider text-text-muted hover:text-white transition-colors">Load Older Activity</button>
                </div>
             </div>
        </motion.div>
    );
};
