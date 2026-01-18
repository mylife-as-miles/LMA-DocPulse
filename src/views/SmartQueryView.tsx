import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
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
    X,
    Check,
    File,
    Database,
    User,
    Bot,
    AlertCircle,
    Loader2,
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

    // State
    const [query, setQuery] = useState('');
    const [result, setResult] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedModel, setSelectedModel] = useState({ name: 'GPT-4 Turbo', icon: Sparkles });
    // const messagesEndRef = React.useRef<HTMLDivElement>(null); // Not needed for single turn usually, unless auto-scroll to result
    const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

    // Context Selection State
    const [isContextModalOpen, setIsContextModalOpen] = useState(false);
    const [contextTab, setContextTab] = useState<'loans' | 'docs'>('loans');
    const [selectedContextIds, setSelectedContextIds] = useState<string[]>([]);

    // Result State
    const [currentQueryId, setCurrentQueryId] = useState<number | undefined>(undefined);
    const { trigger: triggerSave, state: saveState } = useActionFeedback('Saved', { duration: 2000 });

    const loans = useLiveQuery(() => db.loans.toArray()) || [];
    const docs = useLiveQuery(() => db.docs.toArray()) || [];
    const history = useLiveQuery(() => db.queries.orderBy('timestamp').reverse().toArray()) || [];

    // Helper to handle selection
    const toggleSelection = (id: string) => {
        setSelectedContextIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const selectAll = (type: 'loans' | 'docs') => {
        const ids = type === 'loans'
            ? loans.map(l => l.id)
            : docs.map(d => d.id!.toString());

        // If all currently visible are selected, deselect them. Otherwise select all.
        const allVisibleSelected = ids.every(id => selectedContextIds.includes(id));

        if (allVisibleSelected) {
            setSelectedContextIds(prev => prev.filter(id => !ids.includes(id)));
        } else {
            // Add any that aren't already selected
            const newIds = ids.filter(id => !selectedContextIds.includes(id));
            setSelectedContextIds(prev => [...prev, ...newIds]);
        }
    };

    const handleAnalyze = async (overrideQuery?: string) => {
        if (!query.trim() && !overrideQuery) return;

        const textToAnalyze = overrideQuery || query;
        setIsAnalyzing(true);
        setResult(''); // Clear previous result

        // If override (clicked suggestion), set it as query
        if (overrideQuery) setQuery(overrideQuery);

        // context setup
        let contextContent = '';
        if (selectedContextIds.length > 0) {
            if (contextTab === 'loans') {
                const relevantLoans = loans.filter(l => selectedContextIds.includes(l.id?.toString() || ''));
                contextContent = `Context: Analysis is limited to the following loans: ${JSON.stringify(relevantLoans)}. `;
            } else {
                const relevantDocs = docs.filter(d => selectedContextIds.includes(d.id?.toString() || ''));
                contextContent = `Context: Analysis is limited to the following documents: ${relevantDocs.map(d => d.name).join(', ')}. `;
            }
        }

        // Create new query record immediately
        const id = await db.queries.add({
            text: textToAnalyze,
            timestamp: Date.now(),
            model: selectedModel.name,
            result: '',
            bookmarked: false
        });
        setCurrentQueryId(id as number);

        triggerAnalyze(async () => {
            try {
                const systemPrompt = `You are a specialized AI assistant for analyzing loan agreements... ${contextContent}`;

                const completion = await openai.chat.completions.create({
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: textToAnalyze }
                    ],
                    model: "gpt-4-turbo-preview",
                });

                const content = completion.choices[0].message.content || "No response generated.";
                setResult(content);

                // Update record with result
                if (id) {
                    await db.queries.update(id as number, { result: content });
                }

            } catch (error) {
                console.error("AI Error:", error);
                const errorMsg = "Sorry, I couldn't connect to the AI service. Please check your API key or network connection.";
                setResult(errorMsg);
            } finally {
                setIsAnalyzing(false);
            }
        });
    };

    const handleClearHistory = async () => {
        await db.queries.clear();
        setCurrentQueryId(undefined);
        setResult('');
        setQuery('');
    };

    const handleExportResult = () => {
        if (!result) return;

        const content = `Query: ${query}\n\nResult:\n${result}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `analysis_result_${Date.now()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };



    const handleSaveQuery = async () => {
        if (currentQueryId) {
            await db.queries.update(currentQueryId, { bookmarked: true });
            triggerSave();
        }
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
                                    <div
                                        key={item.id}
                                        onClick={() => {
                                            setQuery(item.text);
                                            setResult(item.result || '');
                                            setCurrentQueryId(item.id);
                                        }}
                                        className={`group flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-surface-highlight border cursor-pointer transition-all ${currentQueryId === item.id ? 'bg-surface-highlight border-primary/50' : 'border-transparent hover:border-border'}`}
                                    >
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
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        setQuery(item.text);
                                        setResult(item.result || '');
                                        setCurrentQueryId(item.id);
                                    }}
                                    className={`w-8 h-8 rounded-full bg-surface-highlight flex items-center justify-center cursor-pointer hover:text-primary transition-colors ${currentQueryId === item.id ? 'ring-2 ring-primary' : ''}`}
                                    title={item.text}
                                >
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

                <div className="flex-1 overflow-y-auto z-10 flex flex-col">
                    {/* Main Result Area */}
                    <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 custom-scrollbar flex flex-col gap-6">
                        {!result && !isAnalyzing ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex-1 flex flex-col items-center justify-center text-center text-text-muted mt-20"
                            >
                                <Sparkles size={48} className="text-primary mb-6 opacity-50" />
                                <h3 className="text-2xl font-bold text-white mb-2">How can I help you today?</h3>
                                <p className="max-w-md mx-auto">
                                    Analyze anything about your loan documents, covenants, compliance, or market trends.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 w-full max-w-2xl">
                                    <button
                                        onClick={() => handleAnalyze("Identify high risk loans in the portfolio")}
                                        className="p-4 rounded-xl bg-surface border border-border hover:border-primary/50 hover:bg-surface-highlight transition-all text-left group"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 rounded-lg bg-red-500/10 text-red-500 group-hover:bg-red-500/20">
                                                <AlertCircle size={18} />
                                            </div>
                                            <span className="font-bold text-white">High Risk Loans</span>
                                        </div>
                                        <p className="text-sm text-text-muted">Analyze portfolio for critical risk factors</p>
                                    </button>
                                    <button
                                        onClick={() => handleAnalyze("Show upcoming maturities for Q4")}
                                        className="p-4 rounded-xl bg-surface border border-border hover:border-primary/50 hover:bg-surface-highlight transition-all text-left group"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20">
                                                <Calendar size={18} />
                                            </div>
                                            <span className="font-bold text-white">Q4 Maturities</span>
                                        </div>
                                        <p className="text-sm text-text-muted">List loans maturing in the next quarter</p>
                                    </button>
                                    <button
                                        onClick={() => handleAnalyze("Summarize key compliance gaps across all documents")}
                                        className="p-4 rounded-xl bg-surface border border-border hover:border-primary/50 hover:bg-surface-highlight transition-all text-left group"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500 group-hover:bg-yellow-500/20">
                                                <ShieldAlert size={18} />
                                            </div>
                                            <span className="font-bold text-white">Compliance Gaps</span>
                                        </div>
                                        <p className="text-sm text-text-muted">Identify missing documents or covenants</p>
                                    </button>
                                    <button
                                        onClick={() => handleAnalyze("List all loans with exposure greater than $100M")}
                                        className="p-4 rounded-xl bg-surface border border-border hover:border-primary/50 hover:bg-surface-highlight transition-all text-left group"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 rounded-lg bg-green-500/10 text-green-500 group-hover:bg-green-500/20">
                                                <DollarSign size={18} />
                                            </div>
                                            <span className="font-bold text-white">Loans {'>'} $100M</span>
                                        </div>
                                        <p className="text-sm text-text-muted">Filter based on exposure thresholds</p>
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <>
                                {query && (
                                    <div className="flex justify-end">
                                        <div className="max-w-[80%] rounded-2xl p-4 bg-primary text-black rounded-tr-none">
                                            <p className="font-bold text-xs opacity-70 mb-1">QUERY</p>
                                            <p className="whitespace-pre-wrap leading-relaxed">{query}</p>
                                        </div>
                                    </div>
                                )}

                                {(result || isAnalyzing) && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex justify-start w-full"
                                    >
                                        <div className="w-full glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                                            {isAnalyzing ? (
                                                <div className="flex flex-col items-center justify-center py-12">
                                                    <Loader2 size={32} className="animate-spin text-primary mb-4" />
                                                    <p className="text-text-muted animate-pulse">Analyzing documents and generating insights...</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
                                                        <div className="flex items-center gap-2 text-primary">
                                                            <Sparkles size={18} />
                                                            <span className="font-bold uppercase tracking-wider text-sm">Analysis Result</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={handleExportResult}
                                                                className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-white transition-colors"
                                                                title="Export Result"
                                                            >
                                                                <Download size={16} />
                                                            </button>
                                                            <button
                                                                onClick={handleSaveQuery}
                                                                className={`p-2 hover:bg-white/5 rounded-lg transition-colors ${saveState === 'success' ? 'text-green-500' : 'text-text-muted hover:text-white'}`}
                                                                title="Save to Vault"
                                                            >
                                                                {saveState === 'success' ? <Check size={16} /> : <BookmarkPlus size={16} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="prose prose-invert prose-lg max-w-none">
                                                        <p className="whitespace-pre-wrap leading-relaxed text-slate-300">{result}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Input Area (Sticky Bottom) */}
                    <div className="p-4 lg:p-6 border-t border-white/5 bg-background/80 backdrop-blur-xl">
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
                                        <button
                                            onClick={() => setIsContextModalOpen(true)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-xs font-mono border ${selectedContextIds.length > 0 ? 'bg-primary/20 text-primary border-primary/30' : 'text-text-muted hover:text-white hover:bg-white/5 border-transparent hover:border-white/10'}`}
                                            title="Attach Document"
                                        >
                                            <Paperclip size={16} />
                                            <span>Context {selectedContextIds.length > 0 ? `(${selectedContextIds.length})` : '(All)'}</span>
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
                                                                    setSelectedModel({ ...model, icon: Sparkles });
                                                                    setIsModelMenuOpen(false);
                                                                }}
                                                                className={`text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group flex flex-col gap-0.5 ${selectedModel.name === model.name ? 'bg-primary/10 border border-primary/20' : 'border border-transparent'}`}
                                                            >
                                                                <span className={`text-sm font-medium ${selectedModel.name === model.name ? 'text-primary' : 'text-white group-hover:text-primary'}`}>{model.name}</span>
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
                                        disabled={isAnalyzing}
                                        className={`p-3 rounded-xl transition-all shadow-glow ${query.trim() || isAnalyzing ? 'bg-primary text-black hover:bg-primary-hover hover:scale-105 active:scale-95' : 'bg-surface-highlight text-text-muted cursor-not-allowed'}`}
                                    >
                                        {isAnalyzing ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Context Selection Modal */}
            {isContextModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="w-full max-w-2xl bg-[#09090b] border border-border rounded-xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
                        <div className="p-4 border-b border-border flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Database size={18} className="text-primary" /> Analysis Context
                                </h3>
                                <p className="text-xs text-text-muted">Select specific items to focus the AI analysis</p>
                            </div>
                            <button onClick={() => setIsContextModalOpen(false)} className="text-text-muted hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex border-b border-border">
                            <button
                                onClick={() => setContextTab('loans')}
                                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${contextTab === 'loans' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-text-muted hover:text-white hover:bg-white/5'}`}
                            >
                                Active Loans ({loans.length})
                            </button>
                            <button
                                onClick={() => setContextTab('docs')}
                                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${contextTab === 'docs' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-text-muted hover:text-white hover:bg-white/5'}`}
                            >
                                Documents ({docs.length})
                            </button>
                        </div>

                        <div className="p-2 border-b border-border bg-surface-highlight/30 flex justify-between items-center">
                            <span className="text-xs text-text-muted px-2">
                                {selectedContextIds.length} items selected
                            </span>
                            <button
                                onClick={() => selectAll(contextTab)}
                                className="text-xs text-primary hover:text-primary-hover px-2 py-1 hover:bg-primary/10 rounded transition-colors"
                            >
                                Toggle All {contextTab === 'loans' ? 'Loans' : 'Documents'}
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                            {contextTab === 'loans' ? (
                                <div className="space-y-1">
                                    {loans.map(loan => (
                                        <div
                                            key={loan.id}
                                            onClick={() => toggleSelection(loan.id)}
                                            className={`p-3 rounded-lg border cursor-pointer flex items-center gap-3 transition-all ${selectedContextIds.includes(loan.id) ? 'bg-primary/10 border-primary/30' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                                        >
                                            <div className={`size-5 rounded border flex items-center justify-center shrink-0 ${selectedContextIds.includes(loan.id) ? 'bg-primary border-primary text-black' : 'border-text-muted'}`}>
                                                {selectedContextIds.includes(loan.id) && <Check size={14} strokeWidth={3} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className={`text-sm font-medium truncate ${selectedContextIds.includes(loan.id) ? 'text-primary' : 'text-white'}`}>
                                                        {loan.counterparty}
                                                    </p>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${loan.risk === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-surface-highlight border-border text-text-muted'}`}>
                                                        {loan.risk}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-text-muted truncate">{loan.id} • {loan.amount} • {loan.type}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {loans.length === 0 && <p className="text-center text-text-muted py-8 text-sm">No loans found</p>}
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {docs.map(doc => (
                                        <div
                                            key={doc.id}
                                            onClick={() => doc.id && toggleSelection(doc.id.toString())}
                                            className={`p-3 rounded-lg border cursor-pointer flex items-center gap-3 transition-all ${doc.id && selectedContextIds.includes(doc.id.toString()) ? 'bg-primary/10 border-primary/30' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                                        >
                                            <div className={`size-5 rounded border flex items-center justify-center shrink-0 ${doc.id && selectedContextIds.includes(doc.id.toString()) ? 'bg-primary border-primary text-black' : 'border-text-muted'}`}>
                                                {doc.id && selectedContextIds.includes(doc.id.toString()) && <Check size={14} strokeWidth={3} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className={`text-sm font-medium truncate ${doc.id && selectedContextIds.includes(doc.id.toString()) ? 'text-primary' : 'text-white'}`}>
                                                        {doc.name}
                                                    </p>
                                                    <span className="text-[10px] text-text-muted">{doc.type}</span>
                                                </div>
                                                <p className="text-xs text-text-muted truncate">Uploaded {doc.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {docs.length === 0 && <p className="text-center text-text-muted py-8 text-sm">No documents found</p>}
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-border bg-surface flex justify-end gap-2">
                            <button
                                onClick={() => setSelectedContextIds([])}
                                className="px-4 py-2 rounded-lg text-sm text-text-muted hover:text-white hover:bg-white/5 transition-colors"
                            >
                                Clear Selection
                            </button>
                            <button
                                onClick={() => setIsContextModalOpen(false)}
                                className="px-6 py-2 rounded-lg bg-primary text-black text-sm font-bold hover:bg-primary-hover shadow-glow"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
