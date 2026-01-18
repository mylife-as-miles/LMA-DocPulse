import React from 'react';
import { ViewState } from '../types';
import { motion } from 'framer-motion';
import { ChevronLeft, BarChart2, PieChart, TrendingUp, Download, Share2, Check, Copy } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useActionFeedback } from '../components/ActionFeedback';

interface AnalyticsResultViewProps {
    setView: (view: ViewState) => void;
    queryId?: number;
}

export const AnalyticsResultView = ({ setView, queryId }: AnalyticsResultViewProps) => {

    const { trigger: triggerShare, state: shareState } = useActionFeedback('Link Copied', { duration: 2000 });
    const { trigger: triggerExport, state: exportState } = useActionFeedback('Report Exported', { duration: 2000 });

    const loans = useLiveQuery(() => db.loans.toArray()) || [];

    // Fetch specific query if ID provided, otherwise get latest
    const selectedQuery = useLiveQuery(
        () => queryId ? db.queries.get(queryId) : db.queries.orderBy('timestamp').reverse().first(),
        [queryId]
    );

    // Fallback if no query found (e.g. valid ID but deleted, or clean state)
    const latestQuery = selectedQuery || { text: "Show all loans", result: "Analysis pending..." };
    const queryText = latestQuery.text;

    // --- Dynamic Analysis Logic ---

    // 1. Identify Filters from Query
    const searchTerms = queryText.toLowerCase();
    const isFloating = searchTerms.includes('floating');
    const isFixed = searchTerms.includes('fixed');
    const isHighRisk = searchTerms.includes('high') || searchTerms.includes('critical');
    const isCompliance = searchTerms.includes('compliance') || searchTerms.includes('gap');

    // 2. Filter Loans
    const filteredLoans = loans.filter(loan => {
        if (isFloating) return loan.type === 'Term Loan A' || loan.type === 'RCF'; // Approximate mapping
        if (isFixed) return loan.type === 'Term Loan B';
        if (isHighRisk) return loan.risk === 'Critical' || loan.risk === 'High';
        if (isCompliance) return loan.status === 'In Review' || loan.risk !== 'Low';
        return true; // Default to all if no specific filter detected
    });

    const activeLoans = filteredLoans.length > 0 ? filteredLoans : loans; // Fallback to all if filter returns empty (optional, or show 0)

    // 3. Calculate Stats
    const parseAmount = (amtStr: string) => {
        if (!amtStr) return 0;
        return parseFloat(amtStr.replace(/[^0-9.]/g, '')) || 0;
    };

    const totalExposure = activeLoans.reduce((sum, loan) => sum + parseAmount(loan.amount), 0);
    const uniqueEntities = new Set(activeLoans.map(l => l.counterparty)).size;

    // Mock spread calculation based on Risk
    const calculateSpread = (risk: string) => {
        switch (risk) {
            case 'Critical': return 650;
            case 'High': return 450;
            case 'Medium': return 325;
            case 'Low': return 185;
            default: return 300;
        }
    };
    const avgSpread = Math.round(activeLoans.reduce((sum, l) => sum + calculateSpread(l.risk), 0) / (activeLoans.length || 1));

    // 4. Generate Chart Data
    // Pie Chart: Distribution by Risk or Type depending on query
    const distributionData = React.useMemo(() => {
        const map = new Map<string, number>();
        activeLoans.forEach(l => {
            const key = isHighRisk ? l.counterparty : (l.type || 'Unknown'); // Group by counterparty if looking at risk, else by type
            map.set(key, (map.get(key) || 0) + 1);
        });
        return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
    }, [activeLoans, isHighRisk]);

    // Bar Chart: Maturity Timeline (Mocking quarters based on ID/Random for demo as dates aren't fully standard)
    const timelineData = React.useMemo(() => {
        const quarters = { 'Q1': 0, 'Q2': 0, 'Q3': 0, 'Q4': 0 };
        activeLoans.forEach(l => {
            // Deterministic pseudo-random placement based on length of name
            const q = (l.counterparty?.length || 0) % 4;
            const qKey = Object.keys(quarters)[q] as keyof typeof quarters;
            quarters[qKey]++;
        });
        return Object.entries(quarters).map(([name, loans]) => ({ name, loans }));
    }, [activeLoans]);

    const COLORS = ['#00FF94', '#0088FE', '#FFBB28', '#FF8042', '#A020F0', '#FF0000'];

    const handleShare = () => {
        navigator.clipboard.writeText(`LMA Analytics: ${queryText} - Exposure: $${(totalExposure / 1000000).toFixed(1)}M`);
        triggerShare();
    };

    const handleExport = () => {
        const report = {
            query: queryText,
            timestamp: new Date().toISOString(),
            metrics: {
                exposure: totalExposure,
                spread: avgSpread,
                entities: uniqueEntities,
                loanCount: activeLoans.length
            },
            loans: activeLoans
        };
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics_report_${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        triggerExport();
    };

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
                            <p className="text-text-muted mt-1 max-w-2xl truncate">Deep dive results for "{queryText}".</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleShare}
                            className="p-2 rounded-lg bg-surface border border-border text-text-muted hover:text-white transition-colors relative"
                            title="Copy Link"
                        >
                            {shareState === 'success' ? <Check size={18} className="text-primary" /> : <Share2 size={18} />}
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-black text-sm font-bold rounded-lg hover:shadow-glow transition-all"
                        >
                            {exportState === 'success' ? <Check size={18} /> : <Download size={18} />}
                            <span>{exportState === 'success' ? 'Exported' : 'Export Report'}</span>
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
                            <p className="text-2xl font-bold text-white">${(totalExposure / 1000000).toFixed(1)}M</p>
                        </div>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 text-green-400 rounded-xl">
                            <BarChart2 size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-text-muted uppercase font-bold">Avg. Spread</p>
                            <p className="text-2xl font-bold text-white">{avgSpread} bps</p>
                        </div>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                            <PieChart size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-text-muted uppercase font-bold">Affected Entities</p>
                            <p className="text-2xl font-bold text-white">{uniqueEntities}</p>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-panel p-6 rounded-2xl h-[400px] flex flex-col" style={{ width: '100%', minHeight: '400px' }}>
                        <h3 className="text-lg font-bold text-white mb-6">{isHighRisk ? 'Exposure by Counterparty' : 'Portfolio Distribution'}</h3>
                        <div style={{ width: '100%', flex: 1, minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie
                                        data={distributionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {distributionData.map((entry, index) => (
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
                        <h3 className="text-lg font-bold text-white mb-6">Maturity Timeline (Estimated)</h3>
                        <div style={{ width: '100%', flex: 1, minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={timelineData}>
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
                    <h3 className="text-lg font-bold text-white mb-4">AI Result Context</h3>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {latestQuery.result || "No specific AI commentary available for this query."}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};
