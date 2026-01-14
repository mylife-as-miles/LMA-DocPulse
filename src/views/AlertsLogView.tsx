import React from 'react';
import { ViewState } from '../types';
import { motion } from 'framer-motion';
import { ChevronLeft, AlertTriangle, Info, CheckCircle2, XCircle, Filter, Search } from 'lucide-react';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';

interface AlertsLogViewProps {
    setView: (view: ViewState) => void;
}

export const AlertsLogView = ({ setView }: AlertsLogViewProps) => {
    const alerts = useLiveQuery(() => db.alerts.toArray()) || [];
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2 custom-scrollbar"
        >
            <div className="mx-auto max-w-5xl flex flex-col gap-6 pb-20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setView('dashboard')}
                            className="p-2 rounded-full hover:bg-surface-highlight text-text-muted hover:text-white transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div>
                            <h2 className="text-3xl font-display font-bold text-white">System Alerts Log</h2>
                            <p className="text-text-muted mt-1">Real-time monitoring and diagnostic events.</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                            <input
                                type="text"
                                placeholder="Search logs..."
                                className="h-10 w-64 rounded-lg border border-border bg-surface pl-10 pr-4 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>
                        <button className="flex items-center gap-2 h-10 px-4 rounded-lg bg-surface border border-border text-text-muted hover:text-white hover:border-text-muted transition-all text-sm font-medium">
                            <Filter size={16} />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="glass-panel rounded-2xl overflow-hidden min-h-[400px] flex flex-col">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-surface/50 border-b border-border text-xs uppercase text-text-muted font-bold tracking-wider">
                            <tr>
                                <th className="p-4">Severity</th>
                                <th className="p-4">Timestamp</th>
                                <th className="p-4">Event Type</th>
                                <th className="p-4">Description</th>
                                <th className="p-4">Source</th>
                                <th className="p-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 text-sm">
                            {alerts.length > 0 ? (
                                alerts.map((log, i) => (
                                    <tr key={i} className="hover:bg-surface-highlight/20 transition-colors">
                                        <td className="p-4">
                                            {log.type === 'critical' && <span className="flex items-center gap-2 text-red-400 font-bold"><XCircle size={16} /> Critical</span>}
                                            {log.type === 'warning' && <span className="flex items-center gap-2 text-amber-400 font-bold"><AlertTriangle size={16} /> Warning</span>}
                                            {log.type === 'info' && <span className="flex items-center gap-2 text-blue-400 font-bold"><Info size={16} /> Info</span>}
                                        </td>
                                        <td className="p-4 text-text-muted font-mono text-xs">{log.time}</td>
                                        <td className="p-4 text-white font-medium">{log.title}</td>
                                        <td className="p-4 text-slate-300">{log.subtitle}</td>
                                        <td className="p-4 text-text-muted text-xs uppercase tracking-wide">System</td>
                                        <td className="p-4 text-right">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border text-green-400 border-green-500/30 bg-green-500/10">
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center text-text-muted">
                                        No alerts found in the system.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};
