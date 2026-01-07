import { Doc } from '../types';

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

export const INITIAL_VAULT_DOCS: Doc[] = [
    { name: 'LMA_Facility_Agreement_v2.pdf', type: 'PDF', size: '2.4 MB', status: 'Analyzed', date: 'Today, 10:23 AM' },
    { name: 'Syndicated_Loan_Term_Sheet.docx', type: 'DOCX', size: '1.8 MB', status: 'Pending', date: 'Yesterday, 4:15 PM' },
    { name: 'Omega_Holdings_Financials_Q3.xlsx', type: 'XLSX', size: '4.2 MB', status: 'Analyzed', date: 'Oct 24, 2023' },
    { name: 'Legal_Opinion_Letter_Draft.pdf', type: 'PDF', size: '850 KB', status: 'Review', date: 'Oct 22, 2023' },
];
