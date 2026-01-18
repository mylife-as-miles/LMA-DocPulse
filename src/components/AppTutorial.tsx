import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step, TooltipRenderProps, EVENTS } from 'react-joyride';
import { ViewState } from '../types';
import { X, ArrowRight, Zap, Target, BookOpen, BarChart3, MessageSquare } from 'lucide-react';

interface AppTutorialProps {
    currentView: ViewState;
}

// Custom Tooltip Component for maximum customization
const CustomTooltip = ({
    continuous,
    index,
    step,
    backProps,
    closeProps,
    primaryProps,
    tooltipProps,
    isLastStep,
    size
}: TooltipRenderProps) => {
    return (
        <div {...tooltipProps} className="bg-[#141416]/95 backdrop-blur-xl border border-primary/20 rounded-2xl p-6 max-w-sm shadow-[0_0_50px_rgba(0,255,157,0.15)] relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-surface-highlight border border-border">
                            {index === 0 ? <Zap size={16} className="text-primary" /> :
                                isLastStep ? <Target size={16} className="text-accent-orange" /> :
                                    <BookOpen size={16} className="text-blue-400" />}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Tip {index + 1} of {size}</span>
                    </div>
                    <button {...closeProps} className="text-text-muted hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {step.title && <h3 className="text-lg font-display font-bold text-white mb-2">{step.title}</h3>}
                <div className="text-sm text-text-muted leading-relaxed mb-6">{step.content}</div>

                <div className="flex justify-between items-center pt-2">
                    <button {...backProps} className={`text-xs font-bold text-text-muted hover:text-white transition-colors uppercase tracking-wide ${index === 0 ? 'invisible' : ''}`}>
                        Back
                    </button>
                    <button
                        {...primaryProps}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-primary-hover hover:scale-105 active:scale-95 transition-all shadow-glow"
                    >
                        {isLastStep ? 'Finish' : 'Next'} <ArrowRight size={14} />
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-surface-highlight w-full">
                <div
                    className="h-full bg-primary transition-all duration-300 ease-out"
                    style={{ width: `${((index + 1) / size) * 100}%` }}
                ></div>
            </div>
        </div>
    );
};

export const AppTutorial = ({ currentView }: AppTutorialProps) => {
    const [run, setRun] = useState(false);
    const [steps, setSteps] = useState<Step[]>([]);

    useEffect(() => {
        // Reset and check if we should run for this view - v4 resets tutorials
        const tutorialKey = `tutorial_seen_v4_${currentView}`;
        const hasSeen = localStorage.getItem(tutorialKey);

        const commonSteps = [
            {
                target: '#sidebar-nav',
                content: 'Navigate between Dashboard, Vault, Analytics, and Compliance modules using this panel.',
                title: 'System Navigation',
                placement: 'right',
                disableBeacon: true,
            },
            {
                target: '#global-search',
                content: 'Instantly find loans, documents, or covenants across your entire portfolio.',
                title: 'Global Search',
                placement: 'bottom',
            },
            {
                target: '#user-profile-menu',
                content: 'Access your profile, settings, and logout options here.',
                title: 'User Profile',
                placement: 'left',
            }
        ];

        let viewSteps: Step[] = [];

        switch (currentView) {
            case 'dashboard':
                viewSteps = [
                    {
                        target: 'body',
                        content: 'Welcome to your LMA DocPulse Dashboard. Get a bird\'s-eye view of your portfolio performance, risks, and recent updates.',
                        title: 'Command Center',
                        placement: 'center',
                    },
                    {
                        target: '#dashboard-stats',
                        content: 'Key performance indicators at a glance: Active Loans, Risk Exposure, and Compliance Score.',
                        title: 'Active Metrics',
                        placement: 'bottom',
                    },
                    {
                        target: '#recent-activity-feed',
                        content: 'Live stream of system events, new uploads, and completed analyses.',
                        title: 'Live Activity',
                        placement: 'left',
                    },
                    ...commonSteps
                ];
                break;
            case 'vault':
                viewSteps = [
                    {
                        target: '#upload-btn',
                        content: 'Start here by uploading PDF loan agreements for instant AI analysis.',
                        title: 'Document Ingestion',
                        placement: 'left',
                    },
                    {
                        target: '#document-table',
                        content: 'Manage your entire document repository with advanced sorting and version control.',
                        title: 'Repository',
                        placement: 'top',
                    }
                ];
                break;
            case 'analytics':
                viewSteps = [
                    {
                        target: 'body',
                        content: 'Welcome to Portfolio Analytics! This is your data command center for deep portfolio insights.',
                        title: 'Analytics Overview',
                        placement: 'center',
                        disableBeacon: true,
                    },
                    {
                        target: '#analytics-stats-grid',
                        content: 'Monitor real-time portfolio health with key metrics including Total Exposure, Average Risk Score, Performant Loans, and Estimated Yield projections.',
                        title: 'Portfolio Health Metrics',
                        placement: 'bottom',
                    },
                    {
                        target: '#exposure-trends-chart',
                        content: 'Track your financial exposure trends over time. This dynamic chart visualizes liquidity allocation and historical growth patterns across months.',
                        title: 'Exposure Trends',
                        placement: 'right',
                    },
                    {
                        target: '#risk-distribution-chart-container',
                        content: 'Identify risk concentrations at a glance. The green bars show total exposure while red bars highlight capital at risk. Use this to spot portfolio imbalances.',
                        title: 'Risk Distribution Analysis',
                        placement: 'left',
                    },
                    ...commonSteps
                ];
                break;
            case 'compliance':
                viewSteps = [
                    {
                        target: 'body',
                        content: 'The Compliance Center helps you maintain regulatory standards and identify violations across your portfolio.',
                        title: 'Compliance Hub',
                        placement: 'center',
                        disableBeacon: true,
                    },
                    ...commonSteps
                ];
                break;
            case 'loan_review':
                viewSteps = [
                    {
                        target: 'body',
                        content: 'This is the Loan Review workspace. Analyze extracted data, review covenants, and approve or flag issues.',
                        title: 'Loan Analysis',
                        placement: 'center',
                        disableBeacon: true,
                    }
                ];
                break;
            default:
                viewSteps = [];
        }

        if (!hasSeen && viewSteps.length > 0) {
            setSteps(viewSteps);
            setRun(true);
        } else {
            setRun(false);
        }
    }, [currentView]);

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRun(false);
            localStorage.setItem(`tutorial_seen_v4_${currentView}`, 'true');
        }
    };

    return (
        <Joyride
            steps={steps}
            run={run}
            continuous
            scrollToFirstStep
            showProgress
            showSkipButton
            callback={handleJoyrideCallback}
            tooltipComponent={CustomTooltip}
            styles={{
                options: {
                    zIndex: 10000,
                    arrowColor: '#141416', // Matches surface
                    overlayColor: 'rgba(5, 5, 5, 0.85)', // Matches background #050505
                    primaryColor: '#00ff9d',
                    textColor: '#ffffff',
                    backgroundColor: '#141416'
                },
                spotlight: {
                    borderRadius: '12px',
                },
                beacon: {
                    inner: '#00ff9d',
                    outer: '#00ff9d'
                }
            }}
            disableOverlayClose={true}
            spotlightPadding={8}
        />
    );
};
