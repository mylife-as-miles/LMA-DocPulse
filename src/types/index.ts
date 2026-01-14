import React from 'react';

export type ViewState = 'landing' | 'auth' | 'dashboard' | 'vault' | 'upload' | 'smart_query' | 'analytics' | 'compliance' | 'notifications' | 'settings' | 'loan_review' | 'profile' | 'loan_reviews' | 'filter' | 'document_detail' | 'edit_profile' | 'alerts_log' | 'activity_log' | 'violations_log' | 'public_profile' | 'analytics_result';

export interface Doc {
    id?: number;
    name: string;
    type: 'PDF' | 'DOCX' | 'XLSX' | 'File';
    size: string;
    status: string;
    date: string;
    fileData?: Blob;
    entities?: string[];
}

export interface QueueItem {
    id: string;
    file: File;
    progress: number;
    status: 'uploading' | 'ready' | 'error';
    errorMessage?: string;
}

export interface StatCardProps {
    title: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    icon: React.ReactNode;
    iconColorClass: string;
    badge?: string;
    badgeColorClass?: string;
}

export interface AlertItemProps {
    title: string;
    time: string;
    subtitle: string;
    icon: React.ReactNode;
    colorClass: string;
}

export interface Alert {
    id?: number;
    title: string;
    time: string;
    subtitle: string;
    type: 'critical' | 'warning' | 'info';
}

export interface Query {
    id?: number;
    text: string;
    timestamp: number;
    model: string;
}

export interface BorrowerDetails {
    entityName: string;
    jurisdiction: string;
    registrationNumber: string;
    legalAddress: string;
}

export interface Covenant {
    termName: string;
    clauseRef: string;
    value: string;
    status: 'LMA STANDARD' | 'DEVIATION';
    description?: string; // Additional context like "stepping down to..."
}

export interface CommercialViability {
    valueProposition: string;
    scalabilityPotential: string;
    efficiencyGains: string;
    potentialImpact: string;
}

export interface ReviewData {
    summary: string;
    confidenceScore: number; // 0-100
    standardizationScore: number; // 0-100
    clauseStats: {
        total: number;
        standard: number;
        deviations: number;
    };
    commercialViability?: CommercialViability;
    borrowerDetails: BorrowerDetails;
    financialCovenants: Covenant[];
    eventsOfDefault?: string | string[]; // Kept flexible for now
    signatures?: string | any;
}

export interface Loan {
    id: string; // e.g. "LN-2023-884"
    counterparty: string; // e.g. "Alpha Corp"
    amount: string; // e.g. "$4.5M"
    type: string; // e.g. "Term Loan B"
    status: 'Approved' | 'In Review' | 'Rejected' | 'Pending';
    date: string; // e.g. "Oct 24, 2024"
    risk: 'Low' | 'Medium' | 'High' | 'Critical';
    deadline?: string;
    reviewData?: ReviewData;
}
