import React, { useState } from 'react';
import {
    Filter,
    Search,
    MoreHorizontal,
    ChevronDown,
    Download,
    Eye,
    CheckCircle2,
    Clock,
    AlertTriangle,
    FileText,
    ArrowUpRight
} from 'lucide-react';
import { ViewState } from '../types';

interface LoanReviewsListViewProps {
    setView?: (view: ViewState) => void;
}

export const LoanReviewsListView = ({ setView }: LoanReviewsListViewProps) => {
    const [filter, setFilter] = useState('All');

    const loans = [
        { id: 'LN-2023-884', company: 'Alpha Corp', amount: '$4.5M', type: 'Term Loan B', status: 'Approved', statusColor: 'text-primary bg-primary/10 border-primary/20', date: 'Oct 24, 2024', risk: 'Low' },
        { id: 'LN-2023-902', company: 'Beta Holdings', amount: '$12.25M', type: 'Revolver', status: 'In Review', statusColor: 'text-accent-orange bg-accent-orange/10 border-accent-orange/20', date: 'Dec 15, 2024', risk: 'Medium' },
        { id: 'LN-2023-755', company: 'Gamma Industries', amount: '$1.1M', type: 'Bridge Loan', status: 'Rejected', statusColor: 'text-accent-red bg-accent-red/10 border-accent-red/20', date: 'Nov 30, 2024', risk: 'High' },
        { id: 'LN-2024-101', company: 'Delta Logistics', amount: '$8.75M', type: 'Syndicated', status: 'Approved', statusColor: 'text-primary bg-primary/10 border-primary/20', date: 'Jan 12, 2025', risk: 'Low' },
        { id: 'LN-2024-112', company: 'Epsilon Energy', amount: '$25.0M', type: 'Project Finance', status: 'Pending', statusColor: 'text-blue-400 bg-blue-400/10 border-blue-400/20', date: 'Feb 28, 2025', risk: 'Medium' },
        { id: 'LN-2024-005', company: 'Zeta Tech', amount: '$3.2M', type: 'Venture Debt', status: 'Approved', statusColor: 'text-primary bg-primary/10 border-primary/20', date: 'Mar 10, 2025', risk: 'High' },
    ];

    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2 custom-scrollbar">
            <div className="mx-auto max-w-[1600px] flex flex-col gap-8">

                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-display font-bold text-white tracking-tight">Loan Reviews</h1>
                        <p className="text-text-muted">Manage and Audit your ongoing loan agreements.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-white transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search loans..."
                                className="h-10 w-64 rounded-lg border border-border bg-surface pl-10 pr-4 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>
                        <button className="flex items-center gap-2 h-10 px-4 rounded-lg bg-surface border border-border text-text-muted hover:text-white hover:border-text-muted transition-all text-sm font-medium">
                            <Filter size={16} />
                            Filter
                        </button>
                        <button className="flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-black transition-all text-sm font-bold shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5">
                            <Download size={16} />
                            Export
                        </button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Reviews', value: '1,248', change: '+12%', icon: FileText, color: 'text-blue-400' },
                        { label: 'Pending Action', value: '42', change: '-5%', icon: Clock, color: 'text-accent-orange' },
                        { label: 'Critical Risks', value: '15', change: '+2%', icon: AlertTriangle, color: 'text-accent-red' },
                        { label: 'Avg. Turnaround', value: '2.4 Days', change: '-8%', icon: CheckCircle2, color: 'text-primary' },
                    ].map((stat, i) => (
                        <div key={i} className="glass-panel p-5 rounded-xl border border-border/50 hover:border-border transition-colors group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2 rounded-lg bg-surface-highlight ${stat.color} bg-opacity-10`}>
                                    <stat.icon size={20} className={stat.color} />
                                </div>
                                <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-primary' : 'text-accent-red'} bg-surface-highlight px-2 py-1 rounded`}>
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-2xl font-display font-bold text-white mb-1">{stat.value}</h3>
                            <p className="text-xs text-text-muted font-medium uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Main List */}
                <div className="glass-panel rounded-2xl overflow-hidden border border-border flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface/50 border-b border-border">
                                    <th className="p-5 text-[11px] font-mono font-bold text-text-muted uppercase tracking-wider">Loan ID</th>
                                    <th className="p-5 text-[11px] font-mono font-bold text-text-muted uppercase tracking-wider">Counterparty</th>
                                    <th className="p-5 text-[11px] font-mono font-bold text-text-muted uppercase tracking-wider text-right">Amount</th>
                                    <th className="p-5 text-[11px] font-mono font-bold text-text-muted uppercase tracking-wider">Type</th>
                                    <th className="p-5 text-[11px] font-mono font-bold text-text-muted uppercase tracking-wider">Date</th>
                                    <th className="p-5 text-[11px] font-mono font-bold text-text-muted uppercase tracking-wider">Status</th>
                                    <th className="p-5 text-[11px] font-mono font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loans.map((loan, i) => (
                                    <tr
                                        key={i}
                                        className="hover:bg-surface-highlight/30 transition-colors group cursor-pointer"
                                        onClick={() => setView && setView('loan_review')}
                                    >
                                        <td className="p-5 font-mono text-sm text-primary group-hover:underline">{loan.id}</td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded bg-surface-highlight flex items-center justify-center text-xs font-bold text-white">
                                                    {loan.company.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium text-white">{loan.company}</span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-sm font-mono text-white text-right">{loan.amount}</td>
                                        <td className="p-5 text-sm text-text-muted">{loan.type}</td>
                                        <td className="p-5 text-sm text-text-muted font-mono">{loan.date}</td>
                                        <td className="p-5">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${loan.statusColor}`}>
                                                <span className="size-1.5 rounded-full bg-current"></span>
                                                {loan.status}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 rounded hover:bg-white/10 text-white transition-colors" title="View Details">
                                                    <ArrowUpRight size={16} />
                                                </button>
                                                <button className="p-2 rounded hover:bg-white/10 text-text-muted hover:text-white transition-colors">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-border flex justify-center bg-surface/30">
                        <button className="text-xs font-mono font-bold text-text-muted hover:text-white transition-colors flex items-center gap-2">
                            LOAD MORE <ChevronDown size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
