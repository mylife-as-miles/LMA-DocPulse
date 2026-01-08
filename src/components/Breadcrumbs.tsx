import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { ViewState } from '../types';

interface BreadcrumbsProps {
    currentView: ViewState;
    setView: (view: ViewState) => void;
}

export const Breadcrumbs = ({ currentView, setView }: BreadcrumbsProps) => {
    const getPath = (view: ViewState) => {
        switch (view) {
            case 'dashboard': return [];
            case 'vault': return [{ label: 'Document Vault', id: 'vault' }];
            case 'upload': return [{ label: 'Document Vault', id: 'vault' }, { label: 'Upload', id: 'upload' }];
            case 'smart_query': return [{ label: 'Smart Query', id: 'smart_query' }];
            case 'analytics': return [{ label: 'Analytics', id: 'analytics' }];
            case 'compliance': return [{ label: 'Compliance', id: 'compliance' }];
            case 'notifications': return [{ label: 'Notifications', id: 'notifications' }];
            case 'settings': return [{ label: 'Settings', id: 'settings' }];
            case 'profile': return [{ label: 'Profile', id: 'profile' }];
            case 'loan_reviews': return [{ label: 'Loan Reviews', id: 'loan_reviews' }];
            case 'loan_review': return [{ label: 'Loan Reviews', id: 'loan_reviews' }, { label: 'Ref #10294', id: 'loan_review' }]; // Mock ID for now
            default: return [];
        }
    };

    const path = getPath(currentView);

    if (path.length === 0) return null;

    return (
        <nav className="flex items-center gap-2 text-sm text-text-muted animate-fade-in">
            <button
                onClick={() => setView('dashboard')}
                className="hover:text-primary transition-colors flex items-center gap-1"
            >
                <Home size={14} />
                <span className="sr-only">Dashboard</span>
            </button>

            {path.map((item, index) => (
                <React.Fragment key={index}>
                    <ChevronRight size={14} className="text-slate-600" />
                    <button
                        onClick={() => item.id && setView(item.id as ViewState)}
                        disabled={index === path.length - 1} // Disable last item
                        className={`transition-colors ${index === path.length - 1
                            ? 'text-primary font-medium cursor-default pointer-events-none'
                            : 'hover:text-primary'
                            }`}
                    >
                        {item.label}
                    </button>
                </React.Fragment>
            ))}
        </nav>
    );
};
