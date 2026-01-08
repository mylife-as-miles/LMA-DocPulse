import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { ArrowUpRight, TrendingUp, DollarSign, Activity } from 'lucide-react';

const DATA = [
    { name: 'Jan', value: 4000, risk: 2400 },
    { name: 'Feb', value: 3000, risk: 1398 },
    { name: 'Mar', value: 2000, risk: 9800 },
    { name: 'Apr', value: 2780, risk: 3908 },
    { name: 'May', value: 1890, risk: 4800 },
    { name: 'Jun', value: 2390, risk: 3800 },
];

export const PortfolioAnalyticsView = () => {
    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2 custom-scrollbar">
            <div className="mx-auto max-w-[1600px] flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-display font-bold text-white">Portfolio Analytics</h2>
                    <p className="text-text-muted">Deep dive into your loan portfolio performance and exposure.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Exposure', value: '$142.5M', change: '+12.5%', icon: DollarSign, color: 'text-primary' },
                        { label: 'Avg. Risk Score', value: 'B+', change: '+2.1%', icon: Activity, color: 'text-accent-orange' },
                        { label: 'Performant Loans', value: '128', change: '+4', icon: TrendingUp, color: 'text-blue-400' },
                        { label: 'Yield', value: '6.4%', change: '+0.2%', icon: ArrowUpRight, color: 'text-primary' },
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
                    <div className="glass-panel p-6 rounded-xl flex flex-col h-[400px]">
                        <h3 className="text-lg font-bold text-white mb-6">Exposure Trends</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={DATA}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00FF94" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00FF94" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#333' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#00FF94" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="glass-panel p-6 rounded-xl flex flex-col h-[400px]">
                        <h3 className="text-lg font-bold text-white mb-6">Risk Distribution</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#333' }}
                                    cursor={{ fill: '#ffffff10' }}
                                />
                                <Legend />
                                <Bar dataKey="value" name="Performing" fill="#00FF94" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="risk" name="At Risk" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
