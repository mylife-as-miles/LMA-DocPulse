import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { ArrowUpRight, TrendingUp, DollarSign, Activity, AlertCircle } from 'lucide-react';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';

export const PortfolioAnalyticsView = () => {
    const loans = useLiveQuery(() => db.loans.toArray()) || [];

    // Parse amount string to number - with better error handling
    const parseAmount = (amtStr: string | undefined | null): number => {
        if (!amtStr || typeof amtStr !== 'string') return 0;

        // Remove currency symbols, commas, and spaces
        const cleanStr = amtStr.replace(/[$€£,\s]/g, '').trim();

        // Check for multiplier suffixes
        const hasM = /m$/i.test(cleanStr);
        const hasK = /k$/i.test(cleanStr);
        const hasB = /b$/i.test(cleanStr);

        // Extract numeric part
        const numericPart = cleanStr.replace(/[^0-9.]/g, '');
        const val = parseFloat(numericPart);

        if (isNaN(val)) return 0;

        if (hasB) return val * 1000000000;
        if (hasM) return val * 1000000;
        if (hasK) return val * 1000;

        // If no suffix but large number, assume it's already in base units
        return val;
    };

    // Aggregate data for charts
    const aggregatedData = loans.reduce((acc, loan) => {
        const date = loan.date ? new Date(loan.date) : new Date();
        const month = date.toLocaleString('default', { month: 'short' });
        const amount = parseAmount(loan.amount);

        const existing = acc.find(d => d.name === month);
        if (existing) {
            existing.value += amount;
            if (loan.risk === 'High' || loan.risk === 'Critical') {
                existing.risk += amount;
            }
        } else {
            acc.push({
                name: month,
                value: amount,
                risk: (loan.risk === 'High' || loan.risk === 'Critical') ? amount : 0
            });
        }
        return acc;
    }, [] as { name: string; value: number; risk: number }[]);

    // Sort by month order
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    aggregatedData.sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name));

    // Stats
    const totalExposure = loans.reduce((acc, l) => acc + parseAmount(l.amount), 0);
    const performantLoans = loans.filter(l => l.risk === 'Low' || l.risk === 'Medium').length;

    // Simple risk score calc
    const riskMap: Record<string, number> = { 'Low': 4, 'Medium': 3, 'High': 2, 'Critical': 1 };
    const avgRiskScoreVal = loans.length > 0
        ? loans.reduce((acc, l) => acc + (riskMap[l.risk] || 3), 0) / loans.length
        : 0;

    let avgRiskLabel = 'N/A';
    if (avgRiskScoreVal >= 3.5) avgRiskLabel = 'A';
    else if (avgRiskScoreVal >= 2.5) avgRiskLabel = 'B';
    else if (avgRiskScoreVal >= 1.5) avgRiskLabel = 'C';
    else if (avgRiskScoreVal > 0) avgRiskLabel = 'D';

    // Calculate estimated yield based on risk (simulated)
    const estimatedYield = loans.length > 0
        ? (avgRiskScoreVal * 1.5 + 2).toFixed(1) + '%' // Higher risk = Lower yield potential
        : 'N/A';

    const formatCurrency = (val: number) => {
        if (isNaN(val) || val === 0) return '$0';
        if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)}B`;
        if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
        return `$${val.toLocaleString()}`;
    };

    if (loans.length === 0) {
        return (
            <div className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2 custom-scrollbar">
                <div className="mx-auto max-w-[1600px] flex flex-col gap-6 h-full justify-center items-center text-center opacity-70">
                    <div className="p-6 rounded-full bg-surface-highlight mb-4">
                        <Activity size={48} className="text-text-muted" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">No Portfolio Data</h2>
                    <p className="text-text-muted max-w-md">Analytics will appear here once you have active loans in the system.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2 custom-scrollbar">
            <div className="mx-auto max-w-[1600px] flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-display font-bold text-white">Portfolio Analytics</h2>
                    <p className="text-text-muted">Deep dive into your loan portfolio performance and exposure.</p>
                </div>

                {/* Stats Grid */}
                <div id="analytics-stats-grid" className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Exposure', value: formatCurrency(totalExposure), change: 'Realtime', icon: DollarSign, color: 'text-primary' },
                        { label: 'Avg. Risk Score', value: avgRiskLabel, change: 'Calculated', icon: Activity, color: 'text-accent-orange' },
                        { label: 'Performant Loans', value: performantLoans.toString(), change: `${loans.length > 0 ? ((performantLoans / loans.length) * 100).toFixed(0) : 0}%`, icon: TrendingUp, color: 'text-blue-400' },
                        { label: 'Est. Yield', value: estimatedYield, change: 'Projected', icon: ArrowUpRight, color: 'text-primary' },
                    ].map((stat, i) => (
                        <div key={i} className="glass-panel p-5 rounded-xl flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className={`p-2 rounded-lg bg-surface-highlight ${stat.color}`}>
                                    <stat.icon size={20} />
                                </div>
                                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded-full">{stat.change}</span>
                            </div>
                            <div>
                                <h3 className="text-text-muted text-sm font-medium">{stat.label}</h3>
                                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div id="exposure-trends-chart" className="glass-panel p-6 rounded-xl flex flex-col h-[400px]" style={{ width: '100%', minHeight: '400px' }}>
                        <h3 className="text-lg font-bold text-white mb-6">Exposure Trends</h3>
                        {aggregatedData.length > 0 ? (
                            <div style={{ width: '100%', flex: 1, minHeight: 0 }}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={aggregatedData}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#00FF94" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#00FF94" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#333' }}
                                            itemStyle={{ color: '#fff' }}
                                            formatter={(value: number) => formatCurrency(value)}
                                        />
                                        <Area type="monotone" dataKey="value" stroke="#00FF94" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-text-muted">Not enough data for trends</div>
                        )}
                    </div>

                    <div id="risk-distribution-chart-container" className="glass-panel p-6 rounded-xl flex flex-col h-[400px]" style={{ width: '100%', minHeight: '400px' }}>
                        <h3 className="text-lg font-bold text-white mb-6">Risk Distribution</h3>
                        {aggregatedData.length > 0 ? (
                            <div style={{ width: '100%', flex: 1, minHeight: 0 }}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={aggregatedData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#333' }}
                                            cursor={{ fill: '#ffffff10' }}
                                            formatter={(value: number) => formatCurrency(value)}
                                        />
                                        <Legend />
                                        <Bar dataKey="value" name="Total Exposure" fill="#00FF94" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="risk" name="At Risk" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-text-muted">Not enough data for distribution</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
