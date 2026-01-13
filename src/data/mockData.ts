import { Alert } from '../types';

export const CHART_DATA = [
    { month: 'MAY', score: 30 },
    { month: 'JUN', score: 45 },
    { month: 'JUL', score: 48 },
    { month: 'AUG', score: 60 },
    { month: 'SEP', score: 92 },
    { month: 'OCT', score: 94 },
];

export const LOANS_DATA = [
    { id: '#LN-884-X', counterparty: 'Omega Holdings', initial: 'O', initialColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', risk: 'Critical', riskColor: 'text-accent-red bg-accent-red/10 border-accent-red/20', deadline: 'Oct 26, 2023' },
    { id: '#LN-901-A', counterparty: 'Vertex Global', initial: 'V', initialColor: 'text-accent-orange bg-accent-orange/10 border-accent-orange/20', risk: 'Review', riskColor: 'text-accent-orange bg-accent-orange/10 border-accent-orange/20', deadline: 'Oct 28, 2023' },
    { id: '#LN-102-B', counterparty: 'Apex Partners', initial: 'A', initialColor: 'text-primary bg-primary/10 border-primary/20', risk: 'Safe', riskColor: 'text-primary bg-primary/10 border-primary/20', deadline: 'Nov 02, 2023' },
];

export const INITIAL_ALERTS: Alert[] = [
    { title: "LIBOR Clause Missing", time: "2m", subtitle: "Loan #8839 • Syndicated Term", type: 'critical' },
    { title: "Doc Incomplete", time: "45m", subtitle: "Loan #4402 • Acme Corp", type: 'warning' },
    { title: "AI Suggestion", time: "2h", subtitle: "Optimization for Loan #9921", type: 'info' }
];

// Deprecated since we use empty state for Vault
// export const INITIAL_VAULT_DOCS: Doc[] = [ ... ];
