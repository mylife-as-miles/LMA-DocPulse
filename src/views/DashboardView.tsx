import React from 'react';
import {
    Landmark,
    CheckCircle2,
    AlertTriangle,
    Clock,
    Gavel,
    FileText,
    Bot,
    Filter,
    MoreHorizontal
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { StatCard } from '../components/StatCard';
import { AlertItem } from '../components/AlertItem';
import { RiskHeatmap } from '../components/RiskHeatmap';
import { useActionFeedback } from '../components/ActionFeedback';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';

import { ViewState } from '../types';

interface DashboardViewProps {
    setView?: (view: ViewState) => void;
}

export const DashboardView = ({ setView }: DashboardViewProps) => {
    const { trigger: triggerExport } = useActionFeedback('Export Data');

    const chartData = useLiveQuery(() => db.chartData.toArray()) || [];
    const loansData = useLiveQuery(() => db.loans.toArray()) || [];
    const docs = useLiveQuery(() => db.docs.toArray()) || [];
    const dbAlerts = useLiveQuery(() => db.alerts.toArray()) || [];

    // Generate dynamic alerts from loan data
    const dynamicAlerts = React.useMemo(() => {
        const generated: Array<{ title: string; time: string; subtitle: string; type: 'critical' | 'warning' | 'info' }> = [];

        // Check for critical risk loans
        loansData.filter(l => l.risk === 'Critical').forEach((loan, idx) => {
            generated.push({
                title: 'Critical Risk Detected',
                time: `${idx + 1}m`,
                subtitle: `${loan.id} • ${loan.counterparty}`,
                type: 'critical'
            });
        });

        // Check for pending review documents
        docs.filter(d => d.status === 'Review' || d.status === 'Pending').slice(0, 2).forEach((doc, idx) => {
            generated.push({
                title: 'Doc Needs Review',
                time: `${(idx + 1) * 15}m`,
                subtitle: `${doc.name}`,
                type: 'warning'
            });
        });

        // Check for high risk loans
        loansData.filter(l => l.risk === 'High').slice(0, 1).forEach(loan => {
            generated.push({
                title: 'High Risk Alert',
                time: '1h',
                subtitle: `${loan.id} • ${loan.type}`,
                type: 'warning'
            });
        });

        return generated;
    }, [loansData, docs]);

    // Combine DB alerts with dynamic alerts
    const alerts = [...dbAlerts, ...dynamicAlerts].slice(0, 5);

    // Run diagnostics - creates new alert based on analysis
    const runDiagnostics = async () => {
        const criticalCount = loansData.filter(l => l.risk === 'Critical').length;
        const pendingDocs = docs.filter(d => d.status !== 'Analyzed').length;

        if (criticalCount > 0 || pendingDocs > 0) {
            await db.alerts.add({
                title: 'Diagnostic Complete',
                time: 'now',
                subtitle: `${criticalCount} critical risks, ${pendingDocs} pending docs`,
                type: criticalCount > 0 ? 'critical' : 'warning'
            });
        } else {
            await db.alerts.add({
                title: 'System Healthy',
                time: 'now',
                subtitle: 'All systems operating normally',
                type: 'info'
            });
        }
    };

    // Calculate real stats
    const activeLoansCount = loansData.length;
    const criticalRisksCount = loansData.filter(l => l.risk === 'Critical').length;
    const pendingApprovalsCount = docs.filter(d => d.status === 'Review' || d.status === 'Pending').length;

    // Dynamic Compliance Score Calc
    // Start at 100. Deduct points for risks.
    let calculatedScore = 100;
    loansData.forEach(l => {
        if (l.risk === 'Critical') calculatedScore -= 15;
        else if (l.risk === 'High') calculatedScore -= 5;
        else if (l.risk === 'Medium') calculatedScore -= 1;
    });
    calculatedScore = Math.max(0, calculatedScore);

    // Use calculated score if chartData is empty, otherwise use DB trend logic (if we were logging history)
    // Since we cleared mock history, we just show current score.
    const currentScore = calculatedScore;
    const previousScore = 100; // Assume perfect start for demo trend if no history
    const scoreTrend = currentScore - previousScore;

    // Synthetic chart data for visualization if empty
    const displayChartData = chartData.length > 0 ? chartData : [
        { month: 'Start', score: 100 },
        { month: 'Current', score: currentScore }
    ];

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'Critical': return 'bg-accent-red/10 text-accent-red border-accent-red/20';
            case 'High': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'Medium': return 'bg-accent-orange/10 text-accent-orange border-accent-orange/20';
            case 'Low': return 'bg-primary/10 text-primary border-primary/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const getInitialColor = (name: string) => {
        const colors = [
            'border-primary text-primary',
            'border-blue-400 text-blue-400',
            'border-purple-400 text-purple-400',
            'border-orange-400 text-orange-400'
        ];
        const index = name.length % colors.length;
        return colors[index];
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2 custom-scrollbar">
            <div className="mx-auto max-w-[1600px] flex flex-col gap-6">

                {/* Top Stats Grid */}
                <div id="dashboard-stats" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Active Loans"
                        value={activeLoansCount.toString()}
                        trend="+5%"
                        trendUp={true}
                        icon={<Landmark size={22} />}
                        iconColorClass="text-text-muted group-hover:text-primary group-hover:bg-primary/10"
                    />
                    <StatCard
                        title="Compliance Score"
                        value={`${currentScore}%`}
                        trend={`${scoreTrend > 0 ? '+' : ''}${scoreTrend}%`}
                        trendUp={scoreTrend >= 0}
                        icon={<CheckCircle2 size={22} />}
                        iconColorClass="text-text-muted group-hover:text-primary group-hover:bg-primary/10"
                    />
                    <StatCard
                        title="Critical Risks"
                        value={criticalRisksCount.toString()}
                        badge={criticalRisksCount > 0 ? "+1 New" : undefined}
                        badgeColorClass="bg-accent-red/10 text-accent-red border-accent-red/20"
                        icon={<AlertTriangle size={22} />}
                        iconColorClass="text-text-muted group-hover:text-accent-red group-hover:bg-accent-red/10"
                    />
                    <StatCard
                        title="Pending Approvals"
                        value={pendingApprovalsCount.toString()}
                        trend="0%"
                        trendUp={false}
                        icon={<Clock size={22} />}
                        iconColorClass="text-text-muted group-hover:text-accent-orange group-hover:bg-accent-orange/10"
                    />
                </div>

                {/* Middle Section: Chart + Alerts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Chart */}
                    <div className="lg:col-span-2 glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between mb-2 relative z-10">
                            <div>
                                <h3 className="text-lg font-display font-bold text-white">Compliance Trend</h3>
                                <p className="text-xs text-text-muted mt-1">Automated validation efficiency (6 Months)</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-muted hover:text-white hover:border-primary/50 transition-colors">
                                    Last 6M
                                </button>
                                <button
                                    onClick={() => triggerExport()}
                                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-black hover:shadow-glow-sm transition-all"
                                >
                                    Export
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 min-h-[250px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={displayChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#00ff9d" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        hide
                                        domain={[0, 120]} // Adding buffer for tooltip
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#141416', borderColor: '#27272a', borderRadius: '8px' }}
                                        itemStyle={{ color: '#00ff9d' }}
                                        labelStyle={{ color: '#ffffff', marginBottom: '4px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#00ff9d"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorScore)"
                                        activeDot={{ r: 6, fill: "#050505", stroke: "#00ff9d", strokeWidth: 2 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Live Alerts */}
                    <div id="recent-activity-feed" className="lg:col-span-1 glass-panel rounded-2xl p-6 flex flex-col h-full">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-lg font-display font-bold text-white">Live Alerts</h3>
                            <button
                                onClick={() => setView?.('alerts_log')}
                                className="text-xs font-medium text-primary hover:text-white transition-colors"
                            >
                                View Log
                            </button>
                        </div>

                        <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar flex-1 pr-1">
                            {alerts.length > 0 ? (
                                alerts.map((alert, idx) => (
                                    <AlertItem
                                        key={alert.id || idx}
                                        title={alert.title}
                                        time={alert.time}
                                        subtitle={alert.subtitle}
                                        icon={
                                            alert.type === 'critical' ? <Gavel size={18} /> :
                                                alert.type === 'warning' ? <FileText size={18} /> :
                                                    <Bot size={18} />
                                        }
                                        colorClass={
                                            alert.type === 'critical' ? "text-accent-red group-hover:bg-accent-red group-hover:text-black" :
                                                alert.type === 'warning' ? "text-accent-orange group-hover:bg-accent-orange group-hover:text-black" :
                                                    "text-primary group-hover:bg-primary group-hover:text-black"
                                        }
                                    />
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-text-muted text-sm">
                                    No active alerts
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => runDiagnostics()}
                            className="mt-4 w-full rounded-lg bg-surface-highlight/50 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all border border-transparent hover:border-white"
                        >
                            Run Diagnostics
                        </button>
                    </div>
                </div>

                {/* Bottom Row: Table + Heatmap */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Attention Required Table */}
                    <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden flex flex-col">
                        <div className="border-b border-border px-6 py-5 flex items-center justify-between bg-surface/30">
                            <h3 className="text-lg font-display font-bold text-white">Attention Required</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setView?.('filter')}
                                    className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-muted hover:text-white hover:border-primary/50 transition-all"
                                >
                                    <Filter size={14} />
                                    Filter
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-surface text-xs uppercase text-text-muted font-semibold tracking-wider border-b border-border">
                                    <tr>
                                        <th className="px-6 py-4">Loan ID</th>
                                        <th className="px-6 py-4">Counterparty</th>
                                        <th className="px-6 py-4">Risk Level</th>
                                        <th className="px-6 py-4">Deadline</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border text-white">
                                    {loansData.map((loan) => {
                                        const initial = loan.counterparty ? loan.counterparty.charAt(0).toUpperCase() : '?';
                                        const initialColor = getInitialColor(loan.counterparty || '');
                                        const riskColor = getRiskColor(loan.risk);

                                        return (
                                            <tr
                                                key={loan.id}
                                                className="hover:bg-surface-highlight/40 transition-colors group cursor-pointer"
                                                onClick={() => setView?.('loan_review')}
                                            >
                                                <td className="px-6 py-4 font-mono text-primary text-xs group-hover:underline">{loan.id}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`h-6 w-6 rounded flex items-center justify-center text-[10px] font-bold border ${initialColor}`}>
                                                            {initial}
                                                        </div>
                                                        <span className="font-medium">{loan.counterparty}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-[10px] font-bold uppercase border tracking-wider ${riskColor}`}>
                                                        {loan.risk}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-text-muted text-xs">{loan.deadline}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-text-muted hover:text-white transition-colors">
                                                        <MoreHorizontal size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Risk Heatmap */}
                    <div className="lg:col-span-1 glass-panel rounded-2xl p-6">
                        <RiskHeatmap loans={loansData} />
                    </div>
                </div>

            </div>
        </div>
    );
};
