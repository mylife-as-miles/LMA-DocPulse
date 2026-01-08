import React from 'react';
import { Bell, Info, AlertTriangle, CheckCheck, Clock } from 'lucide-react';

export const NotificationsView = () => {
    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2 custom-scrollbar">
            <div className="mx-auto max-w-3xl flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-display font-bold text-white">Notifications</h2>
                        <p className="text-text-muted">Stay updated with latest alerts and system messages.</p>
                    </div>
                    <button className="text-primary text-sm font-medium hover:text-white transition-colors">Mark all as read</button>
                </div>

                <div className="flex flex-col gap-4">
                    {[
                        { title: 'System Maintenance Scheduled', type: 'info', icon: Info, time: '2h ago', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                        { title: 'High Risk Alert: Alpha Corp', type: 'alert', icon: AlertTriangle, time: '4h ago', color: 'text-red-400', bg: 'bg-red-400/10' },
                        { title: 'Document Analysis Complete', type: 'success', icon: CheckCheck, time: '1d ago', color: 'text-primary', bg: 'bg-primary/10' },
                        { title: 'New Regulation Added', type: 'info', icon: Info, time: '2d ago', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                    ].map((notif, i) => (
                        <div key={i} className="glass-panel p-4 rounded-xl flex gap-4 hover:border-primary/30 transition-colors cursor-pointer group">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.bg} ${notif.color}`}>
                                <notif.icon size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-white font-medium group-hover:text-primary transition-colors">{notif.title}</h4>
                                    <span className="text-xs text-text-muted flex items-center gap-1">
                                        <Clock size={12} /> {notif.time}
                                    </span>
                                </div>
                                <p className="text-sm text-text-muted mt-1">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
