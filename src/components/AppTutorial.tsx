import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step, Styles } from 'react-joyride';
import { ViewState } from '../types';

interface AppTutorialProps {
    currentView: ViewState;
}

export const AppTutorial = ({ currentView }: AppTutorialProps) => {
    const [run, setRun] = useState(false);
    const [steps, setSteps] = useState<Step[]>([]);

    // Custom Styles for "Advanced & Beautiful" look
    const tutorialStyles: Styles = {
        options: {
            zIndex: 10000,
            primaryColor: '#00FF94',
            backgroundColor: '#0F172A',
            textColor: '#fff',
            arrowColor: '#0F172A',
        },
        tooltip: {
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)',
            padding: '20px',
        },
        buttonNext: {
            backgroundColor: '#00FF94',
            color: '#000',
            fontFamily: 'Replica, sans-serif',
            fontWeight: 'bold',
            borderRadius: '6px',
            boxShadow: '0 0 10px rgba(0, 255, 148, 0.3)',
        },
        buttonBack: {
            color: '#94a3b8',
            marginRight: 10,
        },
        buttonSkip: {
            color: '#ef4444',
        },
        title: {
            fontFamily: 'Termina, sans-serif',
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#00FF94',
        }
    };

    // Define steps for each view
    const getStepsForView = (view: ViewState): Step[] => {
        const commonSteps: Step[] = [
            {
                target: '#sidebar-nav',
                content: 'Navigate between different modules like Dashboard, Vault, and Analytics here.',
                title: 'Navigation',
                placement: 'right',
                disableBeacon: true,
            },
            {
                target: '#global-search',
                content: 'Quickly find loans, documents, or entities across the entire platform.',
                title: 'Global Search',
                placement: 'bottom',
            },
            {
                target: '#user-profile-menu',
                content: 'Manage your profile, settings, and notifications.',
                title: 'User Menu',
                placement: 'left',
            }
        ];

        switch (view) {
            case 'dashboard':
                return [
                    {
                        target: 'body',
                        content: 'Welcome to LMA DocPulse. This is your command center for loan compliance.',
                        title: 'Welcome',
                        placement: 'center',
                    },
                    ...commonSteps,
                    {
                        target: '#dashboard-stats',
                        content: 'Real-time overview of your portfolio exposure, active loans, and critical alerts.',
                        title: 'Key Metrics',
                    },
                    {
                        target: '#recent-activity-feed',
                        content: 'Live feed of all system activities, uploads, and automated compliance checks.',
                        title: 'Activity Feed',
                    }
                ];

            case 'vault':
                return [
                    {
                        target: '#document-table',
                        content: 'Central repository of all loan agreements. Sort, filter, and manage versions.',
                        title: 'Document Vault',
                    },
                    {
                        target: '#upload-btn',
                        content: 'Drag & drop new loan agreements here for AI analysis.',
                        title: 'Upload Documents',
                    },
                    {
                        target: '#filter-panel',
                        content: 'Advanced filtering by counterparty, date, or risk level.',
                        title: 'Filters',
                    }
                ];

            case 'loan_review':
                return [
                    {
                        target: '#loan-header-status',
                        content: 'Current status of the loan review (e.g., In Review, Approved).',
                        title: 'Review Status',
                    },
                    {
                        target: '#commercial-viability',
                        content: 'AI-generated strategic analysis including Value Prop and Risk Mitigation.',
                        title: 'Commercial Viability',
                    },
                    {
                        target: '#financial-covenants',
                        content: 'Extracted covenants checked against LMA standards. Toggle "Show PDF Context" to verify.',
                        title: 'Covenant Monitoring',
                    },
                    {
                        target: '#export-btn',
                        content: 'Download a comprehensive CSV report of this review.',
                        title: 'Export Report',
                    }
                ];

            case 'analytics':
                return [
                    {
                        target: '#portfolio-exposure-chart',
                        content: 'Visualize total exposure trends over time.',
                        title: 'Exposure Analysis',
                    },
                    {
                        target: '#risk-distribution-chart',
                        content: 'Breakdown of portfolio by risk category (Low to Critical).',
                        title: 'Risk Profile',
                    }
                ];

            case 'smart_query':
                return [
                    {
                        target: '#chat-interface',
                        content: 'Ask natural language questions about your documents (e.g., "Which loans expire in 2025?").',
                        title: 'AI Assistant',
                    }
                ];

            default:
                return [];
        }
    };

    useEffect(() => {
        // Reset and check if we should run for this view
        const tutorialKey = `tutorial_seen_${currentView}`;
        const hasSeen = localStorage.getItem(tutorialKey);

        if (!hasSeen) {
            const viewSteps = getStepsForView(currentView);
            if (viewSteps.length > 0) {
                setSteps(viewSteps);
                setRun(true);
            }
        } else {
            setRun(false);
        }
    }, [currentView]);

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRun(false);
            localStorage.setItem(`tutorial_seen_${currentView}`, 'true');
        }
    };

    return (
        <Joyride
            steps={steps}
            run={run}
            continuous
            showProgress
            showSkipButton
            styles={tutorialStyles}
            callback={handleJoyrideCallback}
            disableOverlayClose={true}
            spotlightPadding={5}
        />
    );
};
