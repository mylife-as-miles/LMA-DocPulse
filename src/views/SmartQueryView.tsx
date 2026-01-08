import React, { useState } from 'react';
import { ViewState } from '../types';
import {
    Send,
    Bot,
    Sparkles,
    Zap,
    Clock,
    TrendingUp,
    ArrowRight,
    Search,
    ChevronDown,
    MoreHorizontal
} from 'lucide-react';

interface SmartQueryViewProps {
    setView?: (view: ViewState) => void;
}

export const SmartQueryView = ({ setView }: SmartQueryViewProps) => {
    const [query, setQuery] = useState('');

    const suggestions = [
        { icon: Zap, text: "Compare leverage ratios against market standards" },
        { icon: TrendingUp, text: "Analyze covenant headroom across portfolio" },
        { icon: Clock, text: "Draft a waiver request for loan #10294" },
    ];

    return (
        <div className="flex flex-1 overflow-hidden relative h-full bg-background bg-[radial-gradient(circle_at_50%_0%,#1a2e26,transparent_70%)]">
            {/* Sidebar */}
            <aside className="hidden md:flex w-80 flex-col border-r border-border bg-background/50 backdrop-blur-xl overflow-y-auto shrink-0 z-10">
                <div className="p-6">
                    <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl border border-white/10 transition-all group font-medium text-sm">
                        <span className="bg-primary/20 text-primary p-1 rounded-lg group-hover:scale-110 transition-transform"><Bot size={16} /></span>
                        New Chat
                    </button>
                </div>

                <div className="flex-1 px-4 space-y-6">
                    <div>
                        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider px-2 mb-3">Today</h3>
                        <div className="space-y-1">
                            {['Portfolio Risk Assessment', 'Covenant Analysis #10294'].map((item, i) => (
                                <button key={i} className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-surface-highlight hover:text-white transition-colors truncate">
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider px-2 mb-3">Previous 7 Days</h3>
                        <div className="space-y-1">
                            {['Libor Transition Clause', 'Market Trends report'].map((item, i) => (
                                <button key={i} className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-surface-highlight hover:text-white transition-colors truncate">
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-border/50">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-surface-highlight cursor-pointer transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-blue p-[1.5px]">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold text-primary">Pro</div>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-white">Upgrade Plan</h4>
                            <p className="text-[10px] text-text-muted">Get advanced models</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col relative">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 space-y-8">
                    {/* Empty State / Welcome */}
                    <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-12">
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-primary/20 to-accent-blue/20 rounded-3xl flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                                <Sparkles size={40} className="text-primary relative z-10" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-display font-bold text-white mb-2">How can I help today?</h1>
                                <p className="text-lg text-text-muted">Ask anything about your portfolio, documents, or compliance.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {suggestions.map((s, i) => (
                                <button key={i} className="text-left p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-primary/30 transition-all group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="p-1.5 rounded-lg bg-surface-highlight text-primary group-hover:scale-110 transition-transform">
                                            <s.icon size={18} />
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-slate-200 group-hover:text-white">{s.text}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-6 pt-2 max-w-4xl mx-auto w-full relative z-20">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent-blue/50 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                        <div className="relative flex flex-col bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden focus-within:border-primary/50 transition-colors">
                            <textarea
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Message LMA Intelligence..."
                                className="w-full bg-transparent text-white placeholder-slate-500 p-4 min-h-[60px] max-h-[200px] resize-none focus:outline-none text-base"
                                rows={1}
                            />
                            <div className="flex justify-between items-center p-2 pl-4 bg-surface-highlight/30 border-t border-white/5">
                                <div className="flex gap-2">
                                    <button className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Attach file">
                                        <span className="material-symbols-outlined text-[20px]">attach_file</span>
                                    </button>
                                    <button className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Voice input">
                                        <span className="material-symbols-outlined text-[20px]">mic</span>
                                    </button>
                                </div>
                                <button
                                    className={`p-2 rounded-lg transition-all ${query.trim() ? 'bg-primary text-black hover:bg-primary-hover shadow-glow' : 'bg-white/10 text-slate-500 cursor-not-allowed'}`}
                                    disabled={!query.trim()}
                                >
                                    <ArrowRight size={18} className={query.trim() ? 'animate-pulse' : ''} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-[10px] text-slate-600 mt-3">
                        AI can make mistakes. Please verify important information.
                    </p>
                </div>
            </main>
        </div>
    );
};
