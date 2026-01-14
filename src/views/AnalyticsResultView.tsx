import React from 'react';
import { ViewState } from '../types';
import { motion } from 'framer-motion';
import { ChevronLeft, BarChart2, PieChart, TrendingUp, Download, Share2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart as RePieChart, Pie, Cell } from 'recharts';

interface AnalyticsResultViewProps {
    setView: (view: ViewState) => void;
}

export const AnalyticsResultView = ({ setView }: AnalyticsResultViewProps) => {

    const riskData = [
        { name: 'Floating', value: 12 },
        { name: 'Fixed', value: 8 },
        { name: 'Hybrid', value: 4 },
    ];

    const maturityData = [
        { name: 'Q1', loans: 4 },
        { name: 'Q2', loans: 3 },
        { name: 'Q3', loans: 8 },
        { name: 'Q4', loans: 1 },
    ];

    const COLORS = ['#00FF94', '#0088FE', '#FFBB28', '#FF8042'];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2 custom-scrollbar"
        >
            <div className="mx-auto max-w-6xl flex flex-col gap-8 pb-20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setView('smart_query')}
                            className="p-2 rounded-full hover:bg-surface-highlight text-text-muted hover:text-white transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div>
                            <h2 className="text-3xl font-display font-bold text-white">Query Analysis</h2>
                            <p className="text-text-muted mt-1">Deep dive results for "Show all loans with floating rates".</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-lg bg-surface border border-border text-text-muted hover:text-white transition-colors">
                            <Share2 size={18} />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-black text-sm font-bold rounded-lg hover:shadow-glow transition-all">
                            <Download size={18} /> Export Report
                        </button>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-text-muted uppercase font-bold">Total Exposure</p>
                            <p className="text-2xl font-bold text-white">$145.2M</p>
                        </div>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 text-green-400 rounded-xl">
                            <BarChart2 size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-text-muted uppercase font-bold">Avg. Spread</p>
                            <p className="text-2xl font-bold text-white">325 bps</p>
                        </div>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                            <PieChart size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-text-muted uppercase font-bold">Affected Entities</p>
                            <p className="text-2xl font-bold text-white">8</p>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-panel p-6 rounded-2xl h-[400px] flex flex-col" style={{ width: '100%', minHeight: '400px' }}>
                        <h3 className="text-lg font-bold text-white mb-6">Rate Type Distribution</h3>
                        <div style={{ width: '100%', flex: 1, minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie
                                        data={riskData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {riskData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#333', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                    <Legend />
                                </RePieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl h-[400px] flex flex-col" style={{ width: '100%', minHeight: '400px' }}>
                        <h3 className="text-lg font-bold text-white mb-6">Maturity Timeline</h3>
                        <div style={{ width: '100%', flex: 1, minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={maturityData}>
                                    <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{ fill: '#ffffff10' }} contentStyle={{ backgroundColor: '#18181b', borderColor: '#333', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                    <Bar dataKey="loans" fill="#00FF94" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-8 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-4">AI Insight</h3>
                    <p className="text-slate-300 leading-relaxed">
                        Analysis indicates a high concentration of floating rate loans maturing in Q3. Given the current volatility in LIBOR/SOFR spreads, it is recommended to review hedging strategies for <strong>Gamma Industries</strong> and <strong>Beta Holdings</strong>.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};
