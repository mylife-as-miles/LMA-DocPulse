import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
    Zap,
    Mail,
    Lock,
    ArrowRight,
    Github,
    Check,
    Eye,
    EyeOff,
    Shield,
    Smartphone
} from 'lucide-react';
import { ViewState } from '../types';
import { toast } from 'sonner';
import { db } from '../db';

interface AuthViewProps {
    setView: (view: ViewState) => void;
}

export const AuthView = ({ setView }: AuthViewProps) => {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); // Added name state for signup

    // Animation refs
    const leftPanelRef = useRef(null);
    const rightPanelRef = useRef(null);

    useEffect(() => {
        // Entrance Animation
        const tl = gsap.timeline();

        tl.fromTo(leftPanelRef.current,
            { x: -50, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: "power4.out" }
        )
        .fromTo(rightPanelRef.current,
            { x: 50, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: "power4.out" },
            "-=0.8"
        )
        .fromTo(".form-element",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
            "-=0.5"
        );

    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (mode === 'signup') {
                const existingUser = await db.users.where('email').equals(email).first();
                if (existingUser) {
                    toast.error("User with this email already exists.");
                    setIsLoading(false);
                    return;
                }
                await db.users.add({
                    email,
                    password,
                    name: name || email.split('@')[0]
                });
                toast.success("Account created successfully! Please log in.");
                setMode('login'); // Switch to login after signup
                setIsLoading(false);
            } else {
                const user = await db.users.where('email').equals(email).first();
                if (user && user.password === password) {
                    toast.success("Welcome back!");
                    // Store user session (simple version)
                    localStorage.setItem('currentUser', JSON.stringify(user));

                    // Exit animation
                    gsap.to(containerRef.current, {
                        opacity: 0,
                        y: -20,
                        duration: 0.5,
                        onComplete: () => setView('dashboard')
                    });
                } else {
                    toast.error("Invalid email or password.");
                    setIsLoading(false);
                }
            }
        } catch (error) {
            console.error("Auth error:", error);
            toast.error("An error occurred during authentication.");
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        const newMode = mode === 'login' ? 'signup' : 'login';

        // Transition animation
        const tl = gsap.timeline();
        tl.to(".form-element", {
            y: -10,
            opacity: 0,
            duration: 0.2,
            stagger: 0.05,
            onComplete: () => setMode(newMode)
        })
        .fromTo(".form-element",
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, delay: 0.1 }
        );
    };

    return (
        <div ref={containerRef} className="min-h-screen w-full flex bg-black text-white overflow-hidden">

            {/* Left Side - Visual Storytelling */}
            <div ref={leftPanelRef} className="hidden lg:flex w-1/2 relative bg-surface overflow-hidden flex-col justify-between p-12 border-r border-white/5">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,_var(--tw-gradient-stops))] from-accent-blue/10 via-transparent to-transparent"></div>

                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-12">
                        <div className="w-8 h-8 rounded bg-gradient-to-tr from-primary to-accent-blue flex items-center justify-center">
                            <Zap className="text-black fill-current" size={18} />
                        </div>
                        <span className="text-xl font-display font-bold tracking-tight text-white">LMA DocPulse</span>
                    </div>

                    <div className="max-w-md">
                        <h1 className="text-4xl font-display font-bold mb-6 leading-tight">
                            {mode === 'login'
                                ? "Secure access to your portfolio intelligence."
                                : "Join the future of syndicated loan management."}
                        </h1>
                        <p className="text-text-muted text-lg leading-relaxed">
                            Trusted by global financial institutions to automate compliance and extract critical data from complex legal agreements.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 space-y-8">
                    {/* Testimonial Card */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl max-w-md">
                        <div className="flex gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((_, i) => (
                                <Zap key={i} size={16} className="text-primary fill-current" />
                            ))}
                        </div>
                        <p className="text-sm text-slate-300 mb-4 italic">
                            "LMA DocPulse has completely transformed our covenant monitoring workflow. What used to take days now takes minutes."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500"></div>
                            <div>
                                <div className="text-sm font-bold text-white">Sarah Jenkins</div>
                                <div className="text-xs text-text-muted">Head of Credit, Global Bank</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 text-xs text-text-muted font-medium">
                        <span>SOC 2 Type II Certified</span>
                        <span>•</span>
                        <span>256-bit Encryption</span>
                        <span>•</span>
                        <span>GDPR Compliant</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Auth Form */}
            <div ref={rightPanelRef} className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-24 relative">
                {/* Mobile Header (only visible on small screens) */}
                <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-tr from-primary to-accent-blue flex items-center justify-center">
                        <Zap className="text-black fill-current" size={18} />
                    </div>
                    <span className="text-xl font-display font-bold tracking-tight text-white">LMA DocPulse</span>
                </div>

                <div className="w-full max-w-sm space-y-8">
                    <div className="text-center lg:text-left form-element">
                        <h2 className="text-3xl font-display font-bold text-white mb-2">
                            {mode === 'login' ? "Welcome back" : "Create account"}
                        </h2>
                        <p className="text-text-muted">
                            {mode === 'login'
                                ? "Enter your credentials to access your workspace."
                                : "Start your 14-day free trial. No credit card required."}
                        </p>
                    </div>

                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                            {mode === 'signup' && (
                                <div className="form-element space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <div className="w-[18px] flex justify-center">
                                                 <span className="text-slate-500 group-focus-within:text-primary transition-colors font-bold">Aa</span>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="form-element space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                                        placeholder="name@company.com"
                                    />
                                </div>
                            </div>

                            <div className="form-element space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Password</label>
                                    {mode === 'login' && (
                                        <button type="button" className="text-xs text-primary hover:text-primary-hover hover:underline">Forgot password?</button>
                                    )}
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-surface border border-border rounded-lg pl-10 pr-10 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {mode === 'signup' && (
                                    <div className="flex gap-1 h-1 mt-2">
                                        <div className="flex-1 bg-red-500 rounded-full"></div>
                                        <div className="flex-1 bg-yellow-500 rounded-full"></div>
                                        <div className="flex-1 bg-surface-highlight rounded-full"></div>
                                        <div className="flex-1 bg-surface-highlight rounded-full"></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="form-element w-full py-3.5 bg-primary hover:bg-primary-hover text-black text-sm font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(0,255,157,0.2)] hover:shadow-[0_0_30px_rgba(0,255,157,0.4)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6 group"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="form-element relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-black px-2 text-text-muted">Or continue with</span>
                        </div>
                    </div>

                    <div className="form-element grid grid-cols-1 gap-4">
                        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface border border-border hover:bg-surface-highlight hover:border-white/20 rounded-lg transition-all group">
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="text-sm font-medium text-white">Google</span>
                        </button>
                    </div>

                    <div className="form-element text-center mt-8">
                        <p className="text-sm text-text-muted">
                            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={toggleMode}
                                className="ml-2 text-primary hover:text-primary-hover font-bold hover:underline focus:outline-none"
                            >
                                {mode === 'login' ? "Sign up" : "Log in"}
                            </button>
                        </p>
                    </div>

                    {mode === 'login' && (
                         <div className="form-element mt-8 p-4 bg-primary/5 border border-primary/10 rounded-lg flex items-start gap-3">
                            <Shield className="text-primary shrink-0" size={18} />
                            <div className="text-xs text-text-muted">
                                <span className="text-white font-bold block mb-0.5">Enterprise Grade Security</span>
                                Your connection is encrypted and secured. We never share your data with third parties.
                            </div>
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};
