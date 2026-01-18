import React from 'react';
import { Bell, Info, AlertTriangle, CheckCheck, Clock, FileText, XCircle } from 'lucide-react';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';
// Helper for relative time since date-fns might not be installed

const getRelativeTime = (dateString: string) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // Return original if parse fails
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return date.toLocaleDateString();
    } catch (e) {
        return dateString;
    }
};

export const NotificationsView = () => {
    // Fetch all sources of "events"
    const systemNotifications = useLiveQuery(() => db.notifications.toArray()) || [];
    const alerts = useLiveQuery(() => db.alerts.toArray()) || [];
    const docs = useLiveQuery(() => db.docs.toArray()) || [];
    const loans = useLiveQuery(() => db.loans.toArray()) || [];

    // Synthesize into a unified list
    const unifiedNotifications = [
        ...systemNotifications.map(n => ({
            id: `sys-${n.id}`,
            title: n.title,
            desc: n.message,
            type: n.type,
            time: n.timestamp,
            rawTime: new Date(n.timestamp).getTime(),
            read: n.read
        })),
        ...alerts.map(a => ({
            id: `alert-${a.id}`,
            title: a.title,
            desc: a.subtitle,
            type: a.type === 'critical' ? 'alert' : a.type === 'warning' ? 'warning' : 'info',
            time: a.time,
            rawTime: new Date(a.time).getTime() || 0, // Fallback if time string is just "2h ago" (mock data might have this) - wait, real data from verify scripts usually has timestamps or "2h ago". 
            // If the data in DB is "2h ago", sorting by date is hard. 
            // BUT, usually we store real dates in DB for "real" app. 
            // I will assume for synthesized data we might have mixed formats. 
            read: false
        })),
        ...docs.map(d => ({
            id: `doc-${d.id}`,
            title: 'Document Uploaded',
            desc: `${d.name} was successfully uploaded to the vault.`,
            type: 'success',
            time: d.date,
            rawTime: new Date(d.date).getTime(),
            read: true
        })),
        ...loans.map(l => ({
            id: `loan-${l.id}`,
            title: 'Loan Review Update',
            desc: `${l.counterparty} - Status: ${l.status}`,
            type: l.status === 'Approved' ? 'success' : l.status === 'Critical' ? 'alert' : 'info',
            time: l.date,
            rawTime: new Date(l.date).getTime(),
            read: true
        }))
    ].sort((a, b) => {
        // Try to sort by raw time if available and valid
        if (!isNaN(a.rawTime) && !isNaN(b.rawTime)) return b.rawTime - a.rawTime;
        return 0;
    });

    const getIcon = (type: string) => {
        switch (type) {
            case 'alert': return AlertTriangle;
            case 'warning': return AlertTriangle;
            case 'success': return CheckCheck;
            case 'info': return Info;
            default: return Bell;
        }
    };

    const getStyles = (type: string) => {
        switch (type) {
            case 'alert': return { color: 'text-red-400', bg: 'bg-red-400/10' };
            case 'warning': return { color: 'text-amber-400', bg: 'bg-amber-400/10' };
            case 'success': return { color: 'text-primary', bg: 'bg-primary/10' };
            default: return { color: 'text-blue-400', bg: 'bg-blue-400/10' };
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2 custom-scrollbar">
            <div className="mx-auto max-w-3xl flex flex-col gap-6 pb-20">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-display font-bold text-white">Notifications</h2>
                        <p className="text-text-muted">Stay updated with latest alerts and system messages.</p>
                    </div>
                    {unifiedNotifications.length > 0 && (
                        <button className="text-primary text-sm font-medium hover:text-white transition-colors">Mark all as read</button>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    {unifiedNotifications.length > 0 ? (
                        unifiedNotifications.map((notif, i) => {
                            const Icon = getIcon(notif.type);
                            const styles = getStyles(notif.type);
                            return (
                                <div key={i} className="glass-panel p-4 rounded-xl flex gap-4 hover:border-primary/30 transition-colors cursor-pointer group">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${styles.bg} ${styles.color}`}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-white font-medium group-hover:text-primary transition-colors">{notif.title}</h4>
                                            <span className="text-xs text-text-muted flex items-center gap-1">
                                                <Clock size={12} /> {getRelativeTime(notif.time)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-text-muted mt-1">
                                            {notif.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 rounded-full bg-surface-highlight flex items-center justify-center mb-4">
                                <Bell size={32} className="text-text-muted opacity-50" />
                            </div>
                            <h3 className="text-lg font-bold text-white">No new notifications</h3>
                            <p className="text-text-muted max-w-sm mx-auto">
                                You're all caught up! Check back later for updates on your loan portfolio and document analysis.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
