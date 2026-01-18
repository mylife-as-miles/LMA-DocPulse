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
                        target: 'body',
                        content: 'Welcome to the Document Vault! This is your central repository for all loan agreements and legal documents.',
                        title: 'Document Vault',
                        placement: 'center',
                        disableBeacon: true,
                    },
                    {
                        target: '#upload-btn',
                        content: 'Click here to upload new PDF loan agreements. Our AI will automatically extract clauses, covenants, and events of default.',
                        title: 'Upload Documents',
                        placement: 'left',
                    },
                    {
                        target: '#vault-stats',
                        content: 'Quick overview of your document repository: total documents, analyzed count, and storage usage.',
                        title: 'Vault Statistics',
                        placement: 'bottom',
                    },
                    {
                        target: '#vault-search',
                        content: 'Search through all your documents by name. Results update in real-time as you type.',
                        title: 'Document Search',
                        placement: 'bottom',
                    },
                    {
                        target: '#vault-export',
                        content: 'Export your document list to CSV for reporting or integration with other systems.',
                        title: 'Export Data',
                        placement: 'left',
                    },
                    {
                        target: '#document-table',
                        content: 'Click any document to view details and run analysis. You can also delete documents or open them for full review.',
                        title: 'Document Repository',
                        placement: 'top',
                    },
                    ...commonSteps
                ];
                break;
            case 'smart_query':
                viewSteps = [
                    {
                        target: 'body',
                        content: 'This is your AI-powered analyst. Ask natural language questions about your loan portfolio, risks, or compliance status.',
                        title: 'Smart Query Analyst',
                        placement: 'center',
                        disableBeacon: true,
                    },
                    {
                        target: '#query-hero',
                        content: 'Start here. The AI is context-aware and has access to all your loan documents and extracted data.',
                        title: 'Ask Anything',
                        placement: 'bottom',
                    },
                    {
                        target: '#search-container',
                        content: 'Type your question here. You can also filter the scope or select different AI models for specialized analysis.',
                        title: 'Query Interface',
                        placement: 'bottom',
                    },
                    {
                        target: '#quick-filters',
                        content: 'Not sure what to ask? Use these quick prompts to instantly analyze common risk factors and portfolio metrics.',
                        title: 'Quick Starters',
                        placement: 'top',
                    },
                    {
                        target: '#query-history',
                        content: 'Access your previous investigations here. You can revisit past insights or re-run complex queries.',
                        title: 'Investigation History',
                        placement: 'right',
                    },
                    ...commonSteps
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
                        content: 'Welcome to the Compliance Center! Monitor regulatory adherence and portfolio risk factors in real-time.',
                        title: 'Compliance Hub',
                        placement: 'center',
                        disableBeacon: true,
                    },
                    {
                        target: '#compliance-score',
                        content: 'Your overall compliance score is calculated from loan risks, violations, and regulatory status. Track trends vs last month.',
                        title: 'Compliance Score',
                        placement: 'bottom',
                    },
                    {
                        target: '#compliance-stats',
                        content: 'Quick stats: Critical issues needing attention, documents pending review, and successfully analyzed documents.',
                        title: 'Key Metrics',
                        placement: 'left',
                    },
                    {
                        target: '#risk-heatmap',
                        content: 'Visual breakdown of your portfolio by risk level. Quickly identify concentrations of high-risk loans.',
                        title: 'Risk Heatmap',
                        placement: 'top',
                    },
                    {
                        target: '#violations-panel',
                        content: 'Active violations from loans and covenants. Click "Fix" to resolve issues and reduce risk levels.',
                        title: 'Critical Violations',
                        placement: 'right',
                    },
                    {
                        target: '#analyzed-panel',
                        content: 'Recently analyzed documents that passed compliance checks. Click to view full details.',
                        title: 'Recently Analyzed',
                        placement: 'left',
                    },
                    ...commonSteps
                ];
                break;
            case 'loan_review':
                viewSteps = [
                    {
                        target: 'body',
                        content: 'This is the Loan Review workspace. Here you can analyze extracted data, review covenants against LMA standards, and approve or flag issues.',
                        title: 'Loan Review Workspace',
                        placement: 'center',
                        disableBeacon: true,
                    },
                    {
                        target: '#review-sidebar',
                        content: 'Navigate between different sections of the agreement. Indicators show the status of each section (Standard, Deviation, or Critical).',
                        title: 'Document Navigation',
                        placement: 'right',
                    },
                    {
                        target: '#confidence-card',
                        content: 'This score represents our AI\'s confidence in the extracted data accuracy. High scores indicate reliable extraction.',
                        title: 'AI Confidence Score',
                        placement: 'bottom',
                    },
                    {
                        target: '#standardization-card',
                        content: 'Measures how closely the agreement adheres to LMA standards. Lower scores may require more manual review.',
                        title: 'LMA Standardization',
                        placement: 'bottom',
                    },
                    {
                        target: '#events-of-default',
                        content: 'Review critical triggers for default. Active defaults are highlighted in red and require immediate attention.',
                        title: 'Events of Default',
                        placement: 'top',
                    },
                    {
                        target: '#approve-btn',
                        content: 'Once you have reviewed all sections and resolved any flags, click here to approve the loan agreement.',
                        title: 'Final Approval',
                        placement: 'left',
                    },
                    ...commonSteps
                ];
                break;
            case 'upload':
                viewSteps = [
                    {
                        target: 'body',
                        content: 'Welcome to the Upload Center! Here you can upload loan agreements for AI-powered analysis and clause extraction.',
                        title: 'Upload Center',
                        placement: 'center',
                        disableBeacon: true,
                    },
                    {
                        target: '#upload-dropzone',
                        content: 'Drag and drop PDF or DOCX files here, or click to browse. Our AI will extract clauses, covenants, and events of default.',
                        title: 'Drop Zone',
                        placement: 'bottom',
                    },
                    {
                        target: '#upload-summary',
                        content: 'This panel shows file count and estimated analysis time. Files are processed using GPT-4 for accurate extraction.',
                        title: 'Analysis Summary',
                        placement: 'left',
                    },
                    {
                        target: '#upload-tips',
                        content: 'Follow these best practices for optimal AI extraction: use legible PDFs (300+ DPI), avoid encrypted files, and upload complete agreements.',
                        title: 'Best Practices',
                        placement: 'left',
                    },
                    ...commonSteps
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
