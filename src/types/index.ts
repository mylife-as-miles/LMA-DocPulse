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
