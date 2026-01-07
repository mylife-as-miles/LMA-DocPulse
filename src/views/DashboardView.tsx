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
import { CHART_DATA, LOANS_DATA } from '../data/mockData';

export const DashboardView = () => (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2 custom-scrollbar">
        <div className="mx-auto max-w-[1600px] flex flex-col gap-6">

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Active Loans"
                    value="142"
                    trend="+5%"
                    trendUp={true}
                    icon={<Landmark size={22} />}
                    iconColorClass="text-text-muted group-hover:text-primary group-hover:bg-primary/10"
                />
                <StatCard
                    title="Compliance Score"
                    value="94%"
                    trend="+2%"
                    trendUp={true}
                    icon={<CheckCircle2 size={22} />}
                    iconColorClass="text-text-muted group-hover:text-primary group-hover:bg-primary/10"
                />
                <StatCard
                    title="Critical Risks"
                    value="3"
                    badge="+1 New"
                    badgeColorClass="bg-accent-red/10 text-accent-red border-accent-red/20"
                    icon={<AlertTriangle size={22} />}
                    iconColorClass="text-text-muted group-hover:text-accent-red group-hover:bg-accent-red/10"
                />
                <StatCard
                    title="Pending Approvals"
                    value="12"
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
                            <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-black hover:shadow-glow-sm transition-all">
                                Export
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 min-h-[250px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <div className="lg:col-span-1 glass-panel rounded-2xl p-6 flex flex-col h-full">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-lg font-display font-bold text-white">Live Alerts</h3>
                        <button className="text-xs font-medium text-primary hover:text-white transition-colors">View Log</button>
                    </div>

                    <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar flex-1 pr-1">
                        <AlertItem
                            title="LIBOR Clause Missing"
                            time="2m"
                            subtitle="Loan #8839 • Syndicated Term"
                            icon={<Gavel size={18} />}
                            colorClass="text-accent-red group-hover:bg-accent-red group-hover:text-black"
                        />
                        <AlertItem
                            title="Doc Incomplete"
                            time="45m"
                            subtitle="Loan #4402 • Acme Corp"
                            icon={<FileText size={18} />}
                            colorClass="text-accent-orange group-hover:bg-accent-orange group-hover:text-black"
                        />
                        <AlertItem
                            title="AI Suggestion"
                            time="2h"
                            subtitle="Optimization for Loan #9921"
                            icon={<Bot size={18} />}
                            colorClass="text-primary group-hover:bg-primary group-hover:text-black"
                        />
                    </div>

                    <button className="mt-4 w-full rounded-lg bg-surface-highlight/50 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all border border-transparent hover:border-white">
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
                            <button className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-muted hover:text-white hover:border-primary/50 transition-all">
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
                                {LOANS_DATA.map((loan) => (
                                    <tr key={loan.id} className="hover:bg-surface-highlight/40 transition-colors group cursor-pointer">
                                        <td className="px-6 py-4 font-mono text-primary text-xs group-hover:underline">{loan.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`h-6 w-6 rounded flex items-center justify-center text-[10px] font-bold border ${loan.initialColor}`}>
                                                    {loan.initial}
                                                </div>
                                                <span className="font-medium">{loan.counterparty}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-[10px] font-bold uppercase border tracking-wider ${loan.riskColor}`}>
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Risk Heatmap */}
                <div className="lg:col-span-1 glass-panel rounded-2xl p-6">
                    <RiskHeatmap />
                </div>
            </div>

        </div>
    </div>
);
