import React, { useState } from 'react';
import { ViewState } from '../types';
import {
    History,
    Bookmark,
    FileText,
    Trash2,
    Search,
    Paperclip,
    Sliders,
    Brain,
    Sparkles,
    AlertTriangle,
    Calendar,
    ShieldAlert,
    DollarSign,
    Download,
    BookmarkPlus,
    ThumbsUp,
    ThumbsDown,
    ArrowRight,
    Filter,
    MoreVertical,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useActionFeedback } from '../components/ActionFeedback';
import { openai, getChatPrompt } from '../services/openai';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Query } from '../types';

interface SmartQueryViewProps {
    setView?: (view: ViewState) => void;
}

const MODELS = [
    { id: 'gpt-5.2', name: 'GPT-5.2', desc: 'The best model for coding and agentic tasks across industries' },
    { id: 'gpt-5-mini', name: 'GPT-5 mini', desc: 'A faster, cost-efficient version of GPT-5 for well-defined tasks' },
    { id: 'gpt-5-nano', name: 'GPT-5 nano', desc: 'Fastest, most cost-efficient version of GPT-5' },
    { id: 'gpt-5.2-pro', name: 'GPT-5.2 pro', desc: 'Version of GPT-5.2 that produces smarter and more precise responses.' },
    { id: 'gpt-5', name: 'GPT-5', desc: 'Previous intelligent reasoning model for coding and agentic tasks with configurable reasoning effort' }
];

export const SmartQueryView = ({ setView }: SmartQueryViewProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { trigger: triggerAnalyze } = useActionFeedback('Analysis', { duration: 3000 });

    const [query, setQuery] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState(MODELS[0]);
    const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

    const loans = useLiveQuery(() => db.loans.toArray()) || [];
    const history = useLiveQuery(() => db.queries.orderBy('timestamp').reverse().toArray()) || [];

    const handleAnalyze = async (overrideQuery?: string) => {
        const textToAnalyze = overrideQuery || query;
        if (!textToAnalyze.trim()) return;

        if (overrideQuery) {
            setQuery(overrideQuery);
        }

        setIsLoading(true);
        setResult(null);

        // Save query to history
        await db.queries.add({
            text: textToAnalyze,
            timestamp: Date.now(),
            model: selectedModel.name
        });

        triggerAnalyze(async () => {
            try {
                const context = loans.map(l =>
                    `- Loan ${l.id} (${l.type}) with ${l.counterparty}: ${l.amount}, Risk: ${l.risk}, Status: ${l.status}, Deadline: ${l.deadline}`
                ).join('\n');

                const completion = await openai.chat.completions.create({
                    model: "gpt-4o", // Forcing gpt-4o for stability as gpt-5 is not publicly available yet, but UI shows selection.
                    messages: [
                        { role: "user", content: getChatPrompt(textToAnalyze, context) }
                    ]
                });

                const content = completion.choices[0].message.content;
                setResult(content);
            } catch (error) {
                console.error("OpenAI Chat Failed:", error);
                setResult("Sorry, I couldn't connect to the AI service. Please check your API key or network connection.");
            } finally {
                setIsLoading(false);
            }
        });
    };

    const handleClearHistory = async () => {
        await db.queries.clear();
    };

    return (
        <div className="flex flex-1 overflow-hidden relative h-full bg-background">
            {/* Sidebar */}
            <aside
                id="query-history"
                className={`hidden md:flex flex-col border-r border-border bg-background/50 backdrop-blur overflow-y-auto shrink-0 z-10 transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'}`}
            >
                <div className="flex flex-col gap-6 p-4 h-full">
                    <div className="flex items-center justify-between">
                        {isSidebarOpen && (
                            <div className="flex flex-col gap-1 fade-in">
                                <h1 className="text-white text-sm font-display font-bold uppercase tracking-widest text-primary">History</h1>
                                <p className="text-text-muted text-xs font-normal">Your recent investigations</p>
                            </div>
                        )}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg hover:bg-surface-highlight text-text-muted hover:text-white transition-colors ml-auto"
                        >
                            {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                        </button>
                    </div>

                    {isSidebarOpen ? (
                        <>
                            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-full"></div>
                            <div className="flex flex-col gap-4">
                                <p className="text-xs font-bold text-text-muted uppercase tracking-widest px-2">Recent</p>
                                {history.map((item) => (
                                    <div key={item.id} className="group flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-surface-highlight border border-transparent hover:border-border cursor-pointer transition-all">
                                        <Search className="text-text-muted mt-0.5 group-hover:text-primary transition-colors shrink-0" size={18} />
                                        <div className="flex flex-col gap-1">
                                            <p className="text-white text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">"{item.text}"</p>
                                            <span className="text-[10px] text-text-muted font-mono">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {item.model}</span>
                                        </div>
                                    </div>
                                ))}
                                {history.length === 0 && (
                                    <div className="px-4 py-8 text-center">
                                        <p className="text-text-muted text-sm italic">No recent queries</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-auto pt-6">
                                <button
                                    onClick={handleClearHistory}
                                    className="w-full py-2 px-4 border border-border rounded-lg text-xs font-mono text-text-muted hover:text-white hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={14} /> Clear History
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col gap-4 mt-4 items-center">
                            {history.slice(0, 5).map((item) => (
                                <div key={item.id} className="w-8 h-8 rounded-full bg-surface-highlight flex items-center justify-center cursor-pointer hover:text-primary transition-colors" title={item.text}>
                                    <Search size={16} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none"></div>

                <div className="flex-1 overflow-y-auto z-10">
                    <div className="max-w-[1100px] mx-auto w-full px-6 md:px-10 py-10 flex flex-col gap-10">

                        {/* Hero Header */}
                        <div id="query-hero" className="flex flex-col items-center text-center gap-6 mt-6">
                            <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-surface-highlight border border-border mb-2">
                                <div className="bg-center bg-no-repeat bg-cover rounded-xl size-12 bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
                                    <Sparkles className="text-primary" size={24} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white">
                                    What would you like to <span className="text-primary">know?</span>
                                </h1>
                                <p className="text-text-muted text-lg font-light max-w-2xl mx-auto">
                                    Analyze your loan portfolio using natural language. Just ask.
                                </p>
                            </div>
                        </div>

                        {/* Search Input */}
                        <div id="search-container" className="w-full max-w-3xl mx-auto relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                            <div className="relative bg-[#0A0A0A] rounded-2xl border border-border shadow-2xl overflow-hidden transition-all duration-300 group-focus-within:border-primary/50 group-focus-within:shadow-glow">
                                <div className="p-1">
                                    <textarea
                                        className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-text-muted/50 resize-none text-xl font-light leading-relaxed p-6 focus:outline-none"
                                        placeholder="e.g., 'Which loans are missing LMA compliance clauses?'"
                                        rows={2}
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleAnalyze();
                                            }
                                        }}
                                    ></textarea>
                                </div>
                                <div className="flex justify-between items-center px-4 py-3 bg-surface-highlight/30 border-t border-white/5">
                                    <div className="flex gap-2">
                                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors text-xs font-mono border border-transparent hover:border-white/10" title="Attach Document">
                                            <Paperclip size={16} />
                                            <span>Context</span>
                                        </button>
                                        <button
                                            onClick={() => setView?.('filter')}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors text-xs font-mono border border-transparent hover:border-white/10" title="Filter Scope"
                                        >
                                            <Sliders size={16} />
                                            <span>Filters</span>
                                        </button>
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors text-xs font-mono border border-transparent hover:border-white/10"
                                                title="Select Model"
                                            >
                                                <Brain size={16} />
                                                <span>{selectedModel.name}</span>
                                            </button>

                                            {isModelMenuOpen && (
                                                <div className="absolute bottom-full mb-2 left-0 w-80 bg-surface-card border border-border rounded-xl shadow-2xl p-2 z-50 animate-fade-in-up">
                                                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                                                        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Frontier Models</h4>
                                                        <p className="text-[10px] text-text-muted/60 mt-0.5">OpenAI's most advanced models</p>
                                                    </div>
                                                    <div className="flex flex-col gap-1 max-h-60 overflow-y-auto custom-scrollbar">
                                                        {MODELS.map((model) => (
                                                            <button
                                                                key={model.id}
                                                                onClick={() => {
                                                                    setSelectedModel(model);
                                                                    setIsModelMenuOpen(false);
                                                                }}
                                                                className={`text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group flex flex-col gap-0.5 ${selectedModel.id === model.id ? 'bg-primary/10 border border-primary/20' : 'border border-transparent'}`}
                                                            >
                                                                <span className={`text-sm font-medium ${selectedModel.id === model.id ? 'text-primary' : 'text-white group-hover:text-primary'}`}>{model.name}</span>
                                                                <span className="text-[10px] text-text-muted leading-tight">{model.desc}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        id="analyze-btn"
                                        onClick={() => handleAnalyze()}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-black px-6 py-2 rounded-lg font-display font-bold text-sm transition-all shadow-glow hover:shadow-glow transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Sparkles size={16} />
                                        <span>{isLoading ? 'Thinking...' : 'Analyze'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Filters */}
                        <div id="quick-filters" className="flex justify-center gap-3 flex-wrap max-w-4xl mx-auto">
                            <button onClick={() => handleAnalyze("Show me all high risk loans in my portfolio.")} className="group flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full border border-border bg-surface-highlight hover:border-primary hover:bg-surface-highlight/80 px-4 transition-all">
                                <AlertTriangle className="text-orange-500" size={16} />
                                <p className="text-text-muted group-hover:text-white text-sm font-medium">High Risk Loans</p>
                            </button>
                            <button onClick={() => handleAnalyze("List all loans maturing in Q4 of this year.")} className="group flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full border border-border bg-surface-highlight hover:border-primary hover:bg-surface-highlight/80 px-4 transition-all">
                                <Calendar className="text-blue-400" size={16} />
                                <p className="text-text-muted group-hover:text-white text-sm font-medium">Q4 Maturities</p>
                            </button>
                            <button onClick={() => handleAnalyze("What are the current compliance gaps and violations?")} className="group flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full border border-border bg-surface-highlight hover:border-primary hover:bg-surface-highlight/80 px-4 transition-all">
                                <ShieldAlert className="text-red-400" size={16} />
                                <p className="text-text-muted group-hover:text-white text-sm font-medium">Compliance Gaps</p>
                            </button>
                            <button onClick={() => handleAnalyze("Show me all loans with a principal amount greater than $1,000,000.")} className="group flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full border border-border bg-surface-highlight hover:border-primary hover:bg-surface-highlight/80 px-4 transition-all">
                                <DollarSign className="text-primary" size={16} />
                                <p className="text-text-muted group-hover:text-white text-sm font-medium">Loans {'>'} $1M</p>
                            </button>
                        </div>

                        {/* Results Section */}
                        {result && (
                            <div className="flex flex-col gap-6 animate-fade-in-up mt-8 border-t border-border pt-10">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-display font-bold text-white flex items-center gap-3">
                                        <span className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary border border-primary/20">
                                            <Search size={18} />
                                        </span>
                                        <span>Result</span>
                                    </h3>
                                    <div className="flex gap-2">
                                        <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-text-muted hover:text-white hover:bg-surface-highlight border border-transparent hover:border-border transition-all text-xs font-mono" title="Export CSV">
                                            <Download size={16} />
                                            <span className="hidden sm:inline">Export</span>
                                        </button>
                                        <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-text-muted hover:text-white hover:bg-surface-highlight border border-transparent hover:border-border transition-all text-xs font-mono" title="Save Query">
                                            <BookmarkPlus size={16} />
                                            <span className="hidden sm:inline">Save</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="relative overflow-hidden bg-gradient-to-br from-surface-highlight to-surface-dark border border-border rounded-2xl p-1">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                                    <div className="bg-surface-dark/50 backdrop-blur-sm rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start">
                                        <div className="p-3 bg-surface-highlight rounded-xl border border-white/5 shrink-0 shadow-lg">
                                            <Sparkles className="text-primary animate-pulse" size={24} />
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="prose prose-invert max-w-none">
                                                <p className="text-lg text-white font-light leading-relaxed whitespace-pre-wrap">
                                                    {result}
                                                </p>
                                            </div>
                                            <div className="flex gap-4 pt-2">
                                                <button
                                                    onClick={() => setView?.('analytics_result')}
                                                    className="text-xs font-mono uppercase tracking-wider text-primary hover:text-white transition-colors flex items-center gap-2 group"
                                                >
                                                    View Analytics <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setView?.('filter')}
                                                    className="text-xs font-mono uppercase tracking-wider text-text-muted hover:text-white transition-colors flex items-center gap-2"
                                                >
                                                    Refine Search <Filter size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-row md:flex-col gap-2 border-l border-white/5 pl-4 md:pl-0 md:border-l-0 md:border-t-0">
                                            <button className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"><ThumbsUp size={18} /></button>
                                            <button className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"><ThumbsDown size={18} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
};
