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
import { layouts } from '../components/AbstractBankUIs';
import { ScanningFeature } from '../components/ScanningFeature';

gsap.registerPlugin(ScrollTrigger);

interface LandingPageProps {
    setView: (view: ViewState) => void;
}

export const LandingPage = ({ setView }: LandingPageProps) => {
    const heroRef = useRef(null);
    const marqueeRef = useRef<HTMLDivElement>(null);
    const featuresRef = useRef(null);
    const ctaRef = useRef(null);
    const [currentLayoutIndex, setCurrentLayoutIndex] = React.useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentLayoutIndex((prev) => (prev + 1) % layouts.length);
        }, 400);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Hero Animation
        const tl = gsap.timeline();
        tl.fromTo(".hero-text",
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power4.out" }
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
                            onClick={() => setView('auth')}
                            className="text-sm font-bold text-white hover:text-primary transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setView('auth')}
                            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-black text-sm font-bold rounded-full transition-all shadow-glow hover:scale-105 active:scale-95"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section ref={heroRef} className="relative h-screen min-h-[800px] w-full flex items-center justify-center overflow-hidden">
                 {/* Flashing Background UI */}
                 <div className="absolute inset-0 z-0">
                    {layouts.map((Layout, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-0 ${index === currentLayoutIndex ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <Layout />
                        </div>
                    ))}
                    {/* Dark overlay to ensure text readability */}
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background"></div>
                </div>

                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

                <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10 px-6 mt-[-50px]">
                    <div className="hero-text inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold uppercase tracking-wider mb-8 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        New: AI-Powered Smart Extraction 2.0
                    </div>

                    <h1 className="hero-text text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-white mb-8 leading-[1.1] drop-shadow-2xl">
                        Document Intelligence <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary bg-[200%_auto] animate-shine">
                            Reimagined.
                        </span>
                    </h1>

                    <p className="hero-text text-lg md:text-xl text-text-muted max-w-2xl mb-10 leading-relaxed drop-shadow-md">
                        Automate LMA compliance, extract critical data, and streamline your syndicated loan workflow with the world's most advanced AI engine.
                    </p>

                    <div className="hero-text flex flex-col sm:flex-row items-center gap-4">
                        <button
                            onClick={() => setView('auth')}
                            className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-hover text-black text-base font-bold rounded-full transition-all shadow-glow flex items-center justify-center gap-2 group hover:scale-105"
                        >
                            Start Free Trial
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 bg-surface/50 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white text-base font-bold rounded-full transition-all flex items-center justify-center gap-2">
                            <Play size={18} className="fill-current" />
                            Watch Demo
                        </button>
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
            <section className="py-32 bg-white/[0.02] border-y border-white/5 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <div className="lg:w-1/2 space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-bold uppercase tracking-wider">
                                <FileText size={12} />
                                Smart Parsing
                            </div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                                Turn unstructured PDFs into <span className="text-primary">structured intelligence.</span>
                            </h2>
                            <p className="text-lg text-text-muted leading-relaxed font-light">
                                Eliminate manual data entry. Our proprietary engine parses complex LMA loan agreements, identifying definitions, clauses, and schedules with human-level precision.
                            </p>
                            <ul className="space-y-4 mt-8">
                                {[
                                    "Automatic Clause Recognition & Linking",
                                    "Entity Extraction (Borrowers, Lenders, Agents)",
                                    "Export to Excel, JSON, or API"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-white font-medium">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 shadow-[0_0_10px_rgba(0,255,157,0.2)]">
                                            <CheckCircle size={14} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="lg:w-1/2 relative perspective-[2000px]">
                            <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/20 to-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
                            <ScanningFeature />
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
                            onClick={() => setView('auth')}
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
