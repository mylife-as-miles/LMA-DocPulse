export type ViewState = 'dashboard' | 'vault' | 'upload';

export interface Doc {
    name: string;
    type: 'PDF' | 'DOCX' | 'XLSX' | 'File';
    size: string;
    status: string;
    date: string;
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
