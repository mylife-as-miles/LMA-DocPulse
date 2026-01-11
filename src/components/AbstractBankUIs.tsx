import React from 'react';

// Common simulated components
const SkeletonBar = ({ width = "w-full", className = "" }: { width?: string, className?: string }) => (
    <div className={`h-2 bg-white/10 rounded ${width} ${className}`} />
);

const SkeletonCircle = ({ size = "w-8 h-8", className = "" }: { size?: string, className?: string }) => (
    <div className={`rounded-full bg-white/10 ${size} ${className}`} />
);

// Layout 1: Modern Fintech Dashboard (Sidebar + Grid)
const LayoutFintech = () => (
    <div className="w-full h-full bg-[#0a0a0a] p-8 flex gap-6 opacity-70">
        <div className="w-64 flex flex-col gap-4 border-r border-white/5 pr-6">
            <div className="h-8 w-8 bg-blue-500/50 rounded-lg mb-8" />
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center gap-3">
                    <SkeletonCircle size="w-6 h-6" />
                    <SkeletonBar width="w-24" />
                </div>
            ))}
        </div>
        <div className="flex-1 flex flex-col gap-6">
            <div className="flex justify-between items-center mb-4">
                <SkeletonBar width="w-48" className="h-8" />
                <div className="flex gap-2">
                    <SkeletonCircle />
                    <SkeletonCircle />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col justify-between">
                        <SkeletonCircle size="w-8 h-8" className="bg-blue-500/20" />
                        <SkeletonBar width="w-20" />
                    </div>
                ))}
            </div>
            <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-6 flex items-end gap-2">
                 {[...Array(20)].map((_, i) => (
                    <div key={i} className="flex-1 bg-blue-500/20 rounded-t" style={{ height: `${Math.random() * 80 + 20}%` }} />
                ))}
            </div>
        </div>
    </div>
);

// Layout 2: Data Dense Table (Top Nav + Full Table)
const LayoutTable = () => (
    <div className="w-full h-full bg-[#050505] p-8 flex flex-col gap-6 opacity-70">
        <div className="w-full h-16 border-b border-white/5 flex items-center justify-between px-4">
             <div className="flex gap-8">
                <div className="h-6 w-6 bg-green-500/50 rounded" />
                <SkeletonBar width="w-32" />
                <SkeletonBar width="w-32" />
             </div>
             <SkeletonCircle />
        </div>
        <div className="flex-1 border border-white/5 rounded-lg overflow-hidden">
            <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-4">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full"><SkeletonBar /></div>)}
            </div>
            {[...Array(12)].map((_, i) => (
                <div key={i} className="h-12 border-b border-white/5 flex items-center px-4 gap-4">
                     {[1, 2, 3, 4, 5].map(j => <div key={j} className="w-full"><SkeletonBar className="opacity-50" /></div>)}
                </div>
            ))}
        </div>
    </div>
);

// Layout 3: Trading/Analytics (Darker, High Contrast, Side Panel)
const LayoutTrading = () => (
    <div className="w-full h-full bg-black p-4 flex gap-4 opacity-70">
        <div className="flex-1 flex flex-col gap-4">
            <div className="h-2/3 border border-white/10 rounded bg-white/5 relative overflow-hidden p-4">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full flex items-center gap-1">
                        {[...Array(40)].map((_, i) => (
                            <div key={i} className="flex-1 bg-red-500/20" style={{ height: `${Math.random() * 60 + 20}%` }} />
                        ))}
                    </div>
                </div>
                <div className="absolute top-4 left-4 flex gap-4">
                    <SkeletonBar width="w-32" className="bg-red-500/50" />
                </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
                 <div className="border border-white/10 rounded bg-white/5" />
                 <div className="border border-white/10 rounded bg-white/5" />
            </div>
        </div>
        <div className="w-80 border-l border-white/10 pl-4 flex flex-col gap-2">
            {[...Array(15)].map((_, i) => (
                <div key={i} className="h-10 border-b border-white/5 flex justify-between items-center">
                    <SkeletonBar width="w-20" />
                    <SkeletonBar width="w-12" className="bg-green-500/50" />
                </div>
            ))}
        </div>
    </div>
);

// Layout 4: Document Vault (Folder Grid)
const LayoutVault = () => (
    <div className="w-full h-full bg-[#0F0F10] p-8 flex gap-8 opacity-70">
        <div className="w-16 flex flex-col items-center gap-6 border-r border-white/5">
            {[1, 2, 3, 4].map(i => <div key={i}><SkeletonCircle /></div>)}
        </div>
        <div className="flex-1">
            <div className="mb-8 flex justify-between">
                <SkeletonBar width="w-64" className="h-10" />
                <SkeletonBar width="w-32" className="h-10" />
            </div>
            <div className="grid grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] border border-white/10 rounded bg-white/5 p-4 flex flex-col justify-end gap-2">
                        <div className="w-full h-24 bg-white/5 rounded mb-auto" />
                        <SkeletonBar width="w-3/4" />
                        <SkeletonBar width="w-1/2" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const layouts = [LayoutFintech, LayoutTable, LayoutTrading, LayoutVault];
