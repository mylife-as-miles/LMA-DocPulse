import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    ArrowRight,
    CheckCircle,
    Shield,
    Zap,
    BarChart3,
    FileText,
    Play,
    ChevronRight,
    Command,
    Search
} from 'lucide-react';
import { ViewState } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface LandingPageProps {
    setView: (view: ViewState) => void;
}

export const LandingPage = ({ setView }: LandingPageProps) => {
    const heroRef = useRef(null);
    const marqueeRef = useRef<HTMLDivElement>(null);
    const featuresRef = useRef(null);
    const ctaRef = useRef(null);

    useEffect(() => {
        // Hero Animation
        const tl = gsap.timeline();
        tl.fromTo(".hero-text",
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power4.out" }
        )
        .fromTo(".hero-ui",
            { y: 50, opacity: 0, rotateX: 10 },
            { y: 0, opacity: 1, rotateX: 0, duration: 1.2, ease: "power3.out" },
            "-=0.5"
        );

        // Marquee Animation
        if (marqueeRef.current) {
            const content = marqueeRef.current.querySelector('.marquee-content');
            if (content) {
                gsap.to(content, {
                    xPercent: -50,
                    ease: "none",
                    duration: 20,
                    repeat: -1
                });
            }
        }

        // Features ScrollTrigger
        const features = gsap.utils.toArray('.feature-card');
        features.forEach((feature: any, i) => {
            gsap.fromTo(feature,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: feature,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // CTA Parallax
        gsap.fromTo(ctaRef.current,
            { scale: 0.9, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 1,
                scrollTrigger: {
                    trigger: ctaRef.current,
                    start: "top 70%",
                }
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    const logos = [
        "Goldman Sachs", "J.P. Morgan", "Morgan Stanley", "Citi",
        "Bank of America", "Barclays", "HSBC", "Deutsche Bank"
    ];

    return (
        <div className="min-h-screen bg-background text-text-main overflow-x-hidden font-sans selection:bg-primary selection:text-black">

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-gradient-to-tr from-primary to-accent-blue flex items-center justify-center">
                            <Zap className="text-black fill-current" size={18} />
                        </div>
                        <span className="text-xl font-display font-bold tracking-tight text-white">LMA DocPulse</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setView('dashboard')}
                            className="text-sm font-bold text-white hover:text-primary transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setView('dashboard')}
                            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-black text-sm font-bold rounded-full transition-all shadow-glow hover:scale-105 active:scale-95"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                    <div className="hero-text inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold uppercase tracking-wider mb-8">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        New: AI-Powered Smart Extraction 2.0
                    </div>

                    <h1 className="hero-text text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-white mb-8 leading-[1.1]">
                        Document Intelligence <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary bg-[200%_auto] animate-shine">
                            Reimagined.
                        </span>
                    </h1>

                    <p className="hero-text text-lg md:text-xl text-text-muted max-w-2xl mb-10 leading-relaxed">
                        Automate LMA compliance, extract critical data, and streamline your syndicated loan workflow with the world's most advanced AI engine.
                    </p>

                    <div className="hero-text flex flex-col sm:flex-row items-center gap-4">
                        <button
                            onClick={() => setView('dashboard')}
                            className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-hover text-black text-base font-bold rounded-full transition-all shadow-glow flex items-center justify-center gap-2 group"
                        >
                            Start Free Trial
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 bg-surface border border-border hover:bg-surface-highlight text-white text-base font-bold rounded-full transition-all flex items-center justify-center gap-2">
                            <Play size={18} className="fill-current" />
                            Watch Demo
                        </button>
                    </div>

                    {/* Hero UI Mockup */}
                    <div className="hero-ui mt-20 relative w-full max-w-5xl mx-auto perspective-[2000px]">
                        <div className="relative bg-[#0A0A0A] rounded-xl border border-white/10 shadow-2xl overflow-hidden aspect-[16/9] transform-gpu rotate-x-[15deg]">
                            {/* Fake Browser Header */}
                            <div className="h-10 border-b border-white/5 bg-white/[0.02] flex items-center px-4 gap-2">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                </div>
                                <div className="ml-4 flex-1 max-w-lg bg-black/20 h-6 rounded flex items-center px-3 text-[10px] text-text-muted font-mono">
                                    https://app.lmadocpulse.com/dashboard
                                </div>
                            </div>

                            {/* App Content Preview */}
                            <div className="p-6 grid grid-cols-12 gap-6 h-full bg-[radial-gradient(circle_at_50%_0%,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
                                <div className="col-span-3 space-y-4">
                                    <div className="h-24 rounded-lg bg-white/5 border border-white/5"></div>
                                    <div className="h-24 rounded-lg bg-white/5 border border-white/5"></div>
                                    <div className="h-24 rounded-lg bg-white/5 border border-white/5"></div>
                                </div>
                                <div className="col-span-6 space-y-4">
                                    <div className="h-48 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                                                <Search className="text-primary" size={32} />
                                            </div>
                                            <div className="h-2 w-32 bg-white/10 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-32 rounded-lg bg-white/5 border border-white/5"></div>
                                        <div className="h-32 rounded-lg bg-white/5 border border-white/5"></div>
                                    </div>
                                </div>
                                <div className="col-span-3 bg-white/5 rounded-lg border border-white/5 p-4 space-y-3">
                                    <div className="h-8 w-8 rounded bg-green-500/20 flex items-center justify-center text-green-500"><CheckCircle size={16} /></div>
                                    <div className="h-2 w-20 bg-white/10 rounded"></div>
                                    <div className="h-2 w-16 bg-white/10 rounded"></div>
                                    <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                                        <div className="h-2 w-full bg-white/5 rounded"></div>
                                        <div className="h-2 w-full bg-white/5 rounded"></div>
                                        <div className="h-2 w-2/3 bg-white/5 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute -right-12 top-20 bg-surface border border-border p-4 rounded-xl shadow-2xl animate-float">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                    <CheckCircle size={16} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">Compliance Checked</div>
                                    <div className="text-xs text-text-muted">Just now</div>
                                </div>
                            </div>
                            <div className="h-1 w-full bg-green-500/20 rounded-full overflow-hidden">
                                <div className="h-full w-full bg-green-500"></div>
                            </div>
                        </div>

                        <div className="absolute -left-8 bottom-20 bg-surface border border-border p-4 rounded-xl shadow-2xl animate-float-delayed">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                    <Command size={20} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">Smart Extraction</div>
                                    <div className="text-xs text-text-muted">Processing 24 documents...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Infinite Marquee */}
            <div className="py-10 border-y border-white/5 bg-black/50 overflow-hidden relative" ref={marqueeRef}>
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10"></div>

                <div className="marquee-content flex gap-20 w-max px-10">
                    {[...logos, ...logos, ...logos].map((logo, i) => (
                        <div key={i} className="text-2xl font-display font-bold text-white/20 uppercase tracking-widest whitespace-nowrap hover:text-white/40 transition-colors cursor-default">
                            {logo}
                        </div>
                    ))}
                </div>
            </div>

            {/* Features Section */}
            <section ref={featuresRef} className="py-32 px-6" id="features">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-24">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Built for the Modern Deal Team</h2>
                        <p className="text-lg text-text-muted">Everything you need to manage syndicated loans with confidence. From extraction to ongoing monitoring.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Zap size={32} />,
                                title: "Instant Extraction",
                                desc: "Upload complex LMA agreements and extract key terms in seconds, not hours. 99% accuracy driven by LLMs.",
                                color: "text-primary"
                            },
                            {
                                icon: <Shield size={32} />,
                                title: "Automated Compliance",
                                desc: "Automatically cross-reference financial covenants against quarterly reports. Get alerted to deviations instantly.",
                                color: "text-accent-blue"
                            },
                            {
                                icon: <BarChart3 size={32} />,
                                title: "Portfolio Analytics",
                                desc: "Visualize exposure, track covenant headroom, and generate aggregate reports across your entire loan book.",
                                color: "text-accent-orange"
                            }
                        ].map((feature, i) => (
                            <div key={i} className="feature-card group p-8 rounded-2xl bg-surface border border-border hover:border-primary/50 transition-all hover:bg-surface-highlight">
                                <div className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center ${feature.color} mb-6 group-hover:scale-110 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-display font-bold text-white mb-4">{feature.title}</h3>
                                <p className="text-text-muted leading-relaxed">{feature.desc}</p>
                                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                    Learn more <ChevronRight size={16} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Advanced Feature Showcase */}
            <section className="py-32 bg-white/[0.02] border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <div className="lg:w-1/2 space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-bold uppercase tracking-wider">
                                <FileText size={12} />
                                Smart Parsing
                            </div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-white">Turn unstructured PDFs into structured data.</h2>
                            <p className="text-lg text-text-muted">
                                Stop manually copying data from PDF loan agreements. Our engine identifies definitions, clauses, and schedules, converting them into a queryable database.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Recognizes standard LMA clauses automatically",
                                    "Links defined terms to their definitions",
                                    "Exports to Excel, JSON, or direct API integration"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-white">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                            <CheckCircle size={14} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="lg:w-1/2 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/20 to-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
                            <div className="relative bg-black rounded-xl border border-white/10 p-2 shadow-2xl">
                                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop" alt="Dashboard" className="rounded-lg opacity-80" />

                                <div className="absolute top-1/4 -left-10 bg-surface border border-border p-4 rounded-xl shadow-xl flex items-center gap-4 animate-float">
                                    <div className="w-10 h-10 rounded bg-red-500/20 flex items-center justify-center text-red-500">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-text-muted uppercase">Scanning</div>
                                        <div className="text-sm font-bold text-white">Facility Agreement.pdf</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div ref={ctaRef} className="max-w-5xl mx-auto relative z-10 text-center">
                    <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 tracking-tight">
                        Ready to automate your <br />
                        <span className="text-primary">loan operations?</span>
                    </h2>
                    <p className="text-xl text-text-muted mb-12 max-w-2xl mx-auto">
                        Join forward-thinking banks and private credit funds using DocPulse to scale their portfolio management.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => setView('dashboard')}
                            className="w-full sm:w-auto px-10 py-5 bg-white text-black text-lg font-bold rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            Get Started Now
                        </button>
                        <button className="w-full sm:w-auto px-10 py-5 bg-transparent border border-white/20 text-white text-lg font-bold rounded-full hover:bg-white/5 transition-colors">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5 bg-black">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-gradient-to-tr from-primary to-accent-blue flex items-center justify-center">
                            <Zap className="text-black fill-current" size={14} />
                        </div>
                        <span className="text-lg font-display font-bold text-white">LMA DocPulse</span>
                    </div>
                    <div className="flex items-center gap-8 text-sm text-text-muted">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Security</a>
                    </div>
                    <div className="text-sm text-text-muted">
                        © 2024 LMA DocPulse. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};
