import React, { useState, useEffect } from 'react';
import { Zap, Shield, BarChart3, FileText, CheckCircle, AlertTriangle, ArrowRight, Table, Check, X } from 'lucide-react';

const features = [
    {
        id: 'extraction',
        icon: Zap,
        title: "Instant Extraction",
        subtitle: "Unstructured Data → Structured Intelligence",
        desc: "Upload complex LMA agreements and extract key terms in seconds. 99% accuracy driven by advanced LLMs.",
        color: "text-primary",
        bg: "bg-primary/10",
        border: "border-primary/20"
    },
    {
        id: 'compliance',
        icon: Shield,
        title: "Automated Compliance",
        subtitle: "Real-time Covenant Monitoring",
        desc: "Automatically cross-reference financial covenants against quarterly reports and get alerted to deviations instantly.",
        color: "text-accent-blue",
        bg: "bg-accent-blue/10",
        border: "border-accent-blue/20"
    },
    {
        id: 'analytics',
        icon: BarChart3,
        title: "Portfolio Analytics",
        subtitle: "Deep Insights at Scale",
        desc: "Visualize exposure, track covenant headroom, and generate aggregate reports across your entire loan book.",
        color: "text-accent-orange",
        bg: "bg-accent-orange/10",
        border: "border-accent-orange/20"
    }
];

export const ModernDealTeamSimulation = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    // Auto-rotation logic
    useEffect(() => {
        const duration = 5000; // 5 seconds per slide
        const intervalTime = 50;
        const steps = duration / intervalTime;

        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    setActiveIndex(current => (current + 1) % features.length);
                    return 0;
                }
                return prev + (100 / steps);
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, [activeIndex]);

    // Reset progress when manually clicked
    const handleManualClick = (index: number) => {
        setActiveIndex(index);
        setProgress(0);
    };

    return (
        <div className="w-full max-w-6xl mx-auto bg-black/40 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden flex flex-col lg:flex-row h-auto lg:h-[600px]">
            {/* Left Control Panel */}
            <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-white/5 p-6 md:p-8 flex flex-col justify-center gap-4 bg-surface/30">
                {features.map((feature, idx) => (
                    <div
                        key={idx}
                        onClick={() => handleManualClick(idx)}
                        className={`relative p-6 rounded-xl cursor-pointer transition-all duration-300 group overflow-hidden ${activeIndex === idx ? 'bg-white/5 border border-white/10 shadow-lg' : 'hover:bg-white/5 border border-transparent'
                            }`}
                    >
                        {/* Progress Bar Background for Active Item */}
                        {activeIndex === idx && (
                            <div
                                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-accent-blue transition-all ease-linear"
                                style={{ width: `${progress}%` }}
                            />
                        )}

                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-colors ${activeIndex === idx ? feature.bg + ' ' + feature.color : 'bg-surface border border-white/5 text-text-muted group-hover:text-white'
                                }`}>
                                <feature.icon size={24} />
                            </div>
                            <div>
                                <h3 className={`text-lg font-bold font-display mb-1 transition-colors ${activeIndex === idx ? 'text-white' : 'text-text-muted group-hover:text-white'}`}>
                                    {feature.title}
                                </h3>
                                <p className={`text-sm leading-relaxed transition-colors ${activeIndex === idx ? 'text-text-main' : 'text-text-muted/60'}`}>
                                    {feature.desc}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Right Simulation Stage */}
            <div className="w-full lg:w-2/3 relative bg-[#0C0C0C] bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] flex items-center justify-center p-8 md:p-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />

                {/* Simulation Container */}
                <div className="relative w-full h-full max-w-[600px] max-h-[400px]">
                    {activeIndex === 0 && <ExtractionSim key="nav-0" />}
                    {activeIndex === 1 && <ComplianceSim key="nav-1" />}
                    {activeIndex === 2 && <AnalyticsSim key="nav-2" />}
                </div>
            </div>
        </div>
    );
};

// --- Sub-Simulations ---

const ExtractionSim = () => {
    return (
        <div className="w-full h-full flex items-center justify-between gap-4 animate-fade-in relative">
            {/* PDF Document */}
            <div className="w-1/3 bg-surface border border-white/10 rounded-lg p-3 h-[280px] shadow-2xl relative group overflow-hidden transform transition-all hover:scale-105 duration-500">
                <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center text-red-500 mb-3">
                    <FileText size={16} />
                </div>
                <div className="space-y-2 opacity-50">
                    <div className="h-2 w-3/4 bg-white/20 rounded"></div>
                    <div className="h-2 w-full bg-white/20 rounded"></div>
                    <div className="h-2 w-5/6 bg-white/20 rounded"></div>
                    <div className="h-2 w-full bg-white/20 rounded"></div>
                    <br />
                    <div className="h-2 w-1/2 bg-white/20 rounded"></div>
                    <div className="h-2 w-full bg-white/20 rounded"></div>
                </div>

                {/* Scanning Beam */}
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/50 shadow-[0_0_15px_rgba(0,255,157,0.5)] animate-scan"></div>
            </div>

            {/* Arrow & Particles */}
            <div className="flex-1 flex flex-col items-center justify-center relative h-10">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                </div>
                <div className="w-8 h-8 rounded-full bg-black border border-primary flex items-center justify-center z-10 text-primary shadow-glow">
                    <ArrowRight size={16} />
                </div>
            </div>

            {/* JSON Output */}
            <div className="w-5/12 bg-[#1e1e1e] border border-white/10 rounded-lg p-4 h-[300px] shadow-2xl font-mono text-[10px] sm:text-xs overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-8 bg-[#2d2d2d] border-b border-white/5 flex items-center px-4 gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-white/40">extracted_data.json</span>
                </div>
                <div className="mt-8 space-y-1 text-blue-300">
                    <div>{`{`}</div>
                    <div className="pl-4"><span className="text-purple-400">"borrower"</span>: <span className="text-green-400 animate-typing-1">"Acme Corp"</span>,</div>
                    <div className="pl-4"><span className="text-purple-400">"amount"</span>: <span className="text-orange-400 animate-typing-2">50000000</span>,</div>
                    <div className="pl-4"><span className="text-purple-400">"currency"</span>: <span className="text-green-400 animate-typing-2">"USD"</span>,</div>
                    <div className="pl-4"><span className="text-purple-400">"covenants"</span>: {'{'}</div>
                    <div className="pl-8"><span className="text-purple-400">"leverage_ratio"</span>: <span className="text-orange-400 animate-typing-3">4.50</span>,</div>
                    <div className="pl-8"><span className="text-purple-400">"interest_cover"</span>: <span className="text-orange-400 animate-typing-3">3.00</span></div>
                    <div className="pl-4">{'}'}</div>
                    <div>{`}`}</div>
                </div>
            </div>
        </div>
    );
};

const ComplianceSim = () => {
    return (
        <div className="w-full max-w-sm mx-auto bg-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Shield size={14} className="text-accent-blue" />
                    Compliance Check
                </h3>
                <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded border border-green-500/20">Live</span>
            </div>
            <div className="p-2 space-y-2">
                {[
                    { label: "Leverage Ratio", val: "3.2x < 4.5x", status: "pass", delay: "delay-100" },
                    { label: "Interest Cover", val: "5.1x > 3.0x", status: "pass", delay: "delay-300" },
                    { label: "Capex Limit", val: "$12M > $10M", status: "fail", delay: "delay-1000" },
                ].map((item, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded bg-white/5 border border-white/5 animate-slide-in-right ${item.delay}`}>
                        <div>
                            <div className="text-xs text-text-muted mb-0.5">{item.label}</div>
                            <div className="text-sm font-mono font-bold text-white">{item.val}</div>
                        </div>
                        <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded transition-all duration-300 ${item.status === 'pass'
                            ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                            : 'bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse'
                            }`}>
                            {item.status === 'pass' ? <Check size={12} /> : <AlertTriangle size={12} />}
                            {item.status === 'pass' ? 'Pass' : 'Deviation'}
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-3 bg-red-500/10 border-t border-red-500/20">
                <div className="flex items-start gap-2">
                    <AlertTriangle size={14} className="text-red-500 mt-0.5" />
                    <div>
                        <div className="text-xs font-bold text-red-500">Action Required</div>
                        <div className="text-[10px] text-red-400/80">Capex limit exceeded by $2M. Waiver required.</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AnalyticsSim = () => {
    return (
        <div className="w-full h-full flex flex-col gap-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface border border-white/10 rounded-xl p-4 relative overflow-hidden">
                    <div className="text-xs text-text-muted mb-1">Total Exposure</div>
                    <div className="text-2xl font-bold text-white mb-2">$1.24B</div>
                    <div className="text-[10px] text-green-500 flex items-center gap-1">
                        <ArrowRight className="-rotate-45" size={10} /> +12% vs last Q
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10">
                        <BarChart3 size={64} />
                    </div>
                </div>
                <div className="bg-surface border border-white/10 rounded-xl p-4 relative overflow-hidden">
                    <div className="text-xs text-text-muted mb-1">Risk Weighted</div>
                    <div className="text-2xl font-bold text-white mb-2">Low</div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-green-500 w-1/4 rounded-full animate-grow-width"></div>
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="flex-1 bg-surface/50 border border-white/5 rounded-xl p-4 flex items-end justify-between gap-2 relative">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <div key={i} className="w-full bg-white/5 rounded-t-sm relative group hover:bg-white/10 transition-colors h-full flex items-end">
                        <div
                            className={`w-full bg-gradient-to-t from-primary/20 to-primary/60 rounded-t-sm transition-all duration-1000 ease-out group-hover:to-primary`}
                            style={{ height: `${h}%`, transitionDelay: `${i * 100}ms` }}
                        ></div>

                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            ${h}M
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
