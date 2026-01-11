import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { FileText, CheckCircle, Database, BarChart2 } from 'lucide-react';

export const ScanningFeature = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scanLineRef = useRef<HTMLDivElement>(null);
    const [rows, setRows] = useState<string[]>([]);
    const [chartData, setChartData] = useState<number[]>([]);

    useEffect(() => {
        // Continuous Scanning Animation
        let scanAnim: gsap.core.Tween;
        if (scanLineRef.current) {
            scanAnim = gsap.to(scanLineRef.current, {
                top: "100%",
                duration: 2,
                repeat: -1,
                ease: "linear"
            });
        }

        // Simulating data extraction feeding in
        const interval = setInterval(() => {
            setRows(prev => {
                const newRow = `Extracted Clause: ${Math.random().toString(36).substring(7).toUpperCase()}`;
                const newRows = [newRow, ...prev];
                return newRows.slice(0, 5); // Keep last 5
            });

            setChartData(prev => {
                const newData = [...prev, Math.floor(Math.random() * 100)];
                return newData.slice(-10);
            });
        }, 800);

        return () => {
            clearInterval(interval);
            if (scanAnim) scanAnim.kill();
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-full aspect-video bg-[#0A0A0A] rounded-xl border border-white/10 shadow-2xl overflow-hidden flex">
            {/* Left Pane: Document Scan */}
            <div className="w-1/2 border-r border-white/10 p-8 relative overflow-hidden bg-white/[0.02]">
                <div className="absolute inset-0 flex flex-col gap-4 p-8 opacity-70">
                    <div className="h-4 bg-white/20 w-3/4 rounded" />
                    <div className="h-4 bg-white/20 w-full rounded" />
                    <div className="h-4 bg-white/20 w-5/6 rounded" />
                    <div className="h-4 bg-white/20 w-full rounded" />
                    <div className="h-32 bg-white/10 w-full rounded border border-white/10 mt-4" />
                    <div className="h-4 bg-white/20 w-full rounded mt-4" />
                    <div className="h-4 bg-white/20 w-2/3 rounded" />
                </div>

                {/* Scan Line */}
                <div
                    ref={scanLineRef}
                    className="absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_20px_rgba(0,255,157,0.5)] z-10"
                ></div>

                 {/* Highlight Effect behind scan line */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none mix-blend-overlay"></div>
            </div>

            {/* Right Pane: Live Data */}
            <div className="w-1/2 p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider">
                        <Database size={14} />
                        Live Extraction
                    </div>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <div className="text-[10px] text-text-muted">Processing</div>
                    </div>
                </div>

                {/* Extracted Rows */}
                <div className="flex-1 space-y-3 overflow-hidden">
                    {rows.map((row, i) => (
                        <div key={i} className="flex items-center gap-3 animate-in slide-in-from-left fade-in duration-300">
                            <CheckCircle size={14} className="text-primary shrink-0" />
                            <div className="h-8 bg-white/5 border border-white/5 rounded w-full flex items-center px-3 text-xs font-mono text-green-400/80 truncate">
                                {row}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mini Chart */}
                <div className="h-24 bg-white/5 rounded border border-white/5 p-3 flex items-end gap-1 relative overflow-hidden">
                     <div className="absolute top-2 left-2 text-[10px] text-text-muted flex items-center gap-1">
                        <BarChart2 size={10} /> Confidence Score
                     </div>
                    {chartData.map((d, i) => (
                        <div
                            key={i}
                            className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t"
                            style={{ height: `${d}%` }}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Floating Badge */}
             <div className="absolute top-4 right-4 bg-surface border border-border p-2 rounded-lg shadow-xl flex items-center gap-2 animate-pulse">
                <FileText size={14} className="text-white" />
                <span className="text-[10px] font-bold text-white">LMA.PDF</span>
            </div>
        </div>
    );
};
