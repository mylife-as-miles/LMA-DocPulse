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
    ArrowUpRight,
    Inbox,
    Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { ViewState } from '../types';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';
import { exportToCSV } from '../utils/exportUtils';

interface LoanReviewsListViewProps {
    setView?: (view: ViewState) => void;
    onSelectLoan?: (id: string) => void;
}

export const LoanReviewsListView = ({ setView, onSelectLoan }: LoanReviewsListViewProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    const loans = useLiveQuery(() => db.loans.toArray()) || [];
    const user = useLiveQuery(() => db.users.toArray())?.[0];

    // Filter Logic
    const filteredLoans = loans.filter(loan => {
        const matchesSearch =
            loan.counterparty.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loan.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'All' || loan.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleLoanClick = (loanId: string) => {
        if (onSelectLoan) onSelectLoan(loanId);
        if (setView) setView('loan_review');
    };

    const handleDeleteLoan = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm(`Are you sure you want to delete Loan #${id}?`)) {
            try {
                await db.loans.delete(id);
                toast.success('Loan deleted successfully');
            } catch (error) {
                console.error("Failed to delete loan:", error);
                toast.error('Failed to delete loan');
            }
        }
    };

    const handleExport = () => {
        if (filteredLoans.length === 0) {
            toast.error('No loans to export');
            return;
        }

        const exportData = filteredLoans.map(({ id, counterparty, amount, type, status, risk, date }) => ({
            'Loan ID': id,
            'Counterparty': counterparty,
            'Amount': amount,
            'Type': type,
            'Status': status,
            'Risk Level': risk,
            'Date': date
        }));

        exportToCSV(exportData, `loan_portfolio_${new Date().toISOString().split('T')[0]}.csv`);
        toast.success('Export started');
    };

    // Calculate stats based on FILTERED data for responsiveness
    // (Or keep global? Usually stats reflect global portfolio, but list reflects filter. Let's keep stats global for high-level view)
    const totalReviews = loans.length;
    const pendingAction = loans.filter(l => l.status === 'Pending' || l.status === 'In Review').length;
    const criticalRisks = loans.filter(l => l.risk === 'Critical').length;

    // Status color mapping
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'text-primary bg-primary/10 border-primary/20';
            case 'In Review': return 'text-accent-orange bg-accent-orange/10 border-accent-orange/20';
            case 'Rejected': return 'text-accent-red bg-accent-red/10 border-accent-red/20';
            case 'Pending': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            default: return 'text-text-muted bg-surface-highlight border-border';
        }
    };

    if (loans.length === 0) {
        return (
            <div className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2 custom-scrollbar">
                <div className="mx-auto max-w-[1600px] flex flex-col gap-8 h-full">
                    {/* Header & Controls (Simplified) */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-display font-bold text-white tracking-tight">Loan Reviews</h1>
                            <p className="text-text-muted">Manage and Audit your ongoing loan agreements.</p>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center text-center p-10 space-y-4 opacity-70">
                        <div className="w-20 h-20 rounded-full bg-surface-highlight flex items-center justify-center mb-2">
                            <FileText size={40} className="text-text-muted opacity-50" />
                        </div>
                        <div>
                            <h4 className="text-lg font-medium text-white">No loan reviews found</h4>
                            <p className="text-sm text-text-muted max-w-xs mx-auto mt-1">
                                Loans will appear here once they are added to the system.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-10 w-64 rounded-lg border border-border bg-surface pl-10 pr-4 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 h-10 px-4 rounded-lg border transition-all text-sm font-medium ${statusFilter !== 'All'
                                    ? 'bg-primary/10 border-primary text-primary'
                                    : 'bg-surface border-border text-text-muted hover:text-white hover:border-text-muted'
                                    }`}
                            >
                                <Filter size={16} />
                                {statusFilter === 'All' ? 'Filter' : statusFilter}
                                <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {showFilters && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowFilters(false)} />
                                    <div className="absolute right-0 mt-2 w-48 bg-[#0F172A] border border-border rounded-xl shadow-xl z-20 overflow-hidden animate-fade-in py-1">
                                        {['All', 'Approved', 'Pending', 'In Review', 'Rejected'].map(status => (
                                            <button
                                                key={status}
                                                onClick={() => { setStatusFilter(status); setShowFilters(false); }}
                                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-surface-highlight transition-colors flex items-center justify-between ${statusFilter === status ? 'text-primary' : 'text-text-muted'
                                                    }`}
                                            >
                                                {status}
                                                {statusFilter === status && <CheckCircle2 size={14} />}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-black transition-all text-sm font-bold shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5"
                        >
                            <Download size={16} />
                            Export
                        </button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Reviews', value: totalReviews.toString(), change: 'Realtime', icon: FileText, color: 'text-blue-400' },
                        { label: 'Pending Action', value: pendingAction.toString(), change: 'Action Req', icon: Clock, color: 'text-accent-orange' },
                        { label: 'Critical Risks', value: criticalRisks.toString(), change: 'Alert', icon: AlertTriangle, color: 'text-accent-red' },
                        { label: 'Avg. Turnaround', value: user?.stats?.avgTurnaround || 'N/A', change: '-8%', icon: CheckCircle2, color: 'text-primary' },
                    ].map((stat, i) => (
                        <div key={i} className="glass-panel p-5 rounded-xl border border-border/50 hover:border-border transition-colors group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2 rounded-lg bg-surface-highlight ${stat.color} bg-opacity-10`}>
                                    <stat.icon size={20} className={stat.color} />
                                </div>
                                <span className={`text-xs font-bold ${stat.change === 'Realtime' ? 'text-primary' : 'text-text-muted'} bg-surface-highlight px-2 py-1 rounded`}>
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
                                {filteredLoans.map((loan, i) => (
                                    <tr
                                        key={loan.id || i}
                                        className="hover:bg-surface-highlight/30 transition-colors group cursor-pointer"
                                        onClick={() => handleLoanClick(loan.id)}
                                    >
                                        <td className="p-5 font-mono text-sm text-primary group-hover:underline">{loan.id}</td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded bg-surface-highlight flex items-center justify-center text-xs font-bold text-white">
                                                    {loan.counterparty.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium text-white">{loan.counterparty}</span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-sm font-mono text-white text-right">{loan.amount}</td>
                                        <td className="p-5 text-sm text-text-muted">{loan.type}</td>
                                        <td className="p-5 text-sm text-text-muted font-mono">{loan.date}</td>
                                        <td className="p-5">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusColor(loan.status)}`}>
                                                <span className="size-1.5 rounded-full bg-current"></span>
                                                {loan.status}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 rounded hover:bg-white/10 text-white transition-colors" title="View Details">
                                                    <ArrowUpRight size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteLoan(e, loan.id)}
                                                    className="p-2 rounded hover:bg-white/10 text-text-muted hover:text-red-500 transition-colors"
                                                    title="Delete Loan"
                                                >
                                                    <Trash2 size={16} />
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
                    {/* Simplified load more */}
                    <div className="p-4 border-t border-border flex justify-center bg-surface/30">
                        <button className="text-xs font-mono font-bold text-text-muted hover:text-white transition-colors flex items-center gap-2">
                            End of List
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
