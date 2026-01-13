import { Alert, Loan } from '../types';

export const CHART_DATA = [
    { month: 'MAY', score: 30 },
    { month: 'JUN', score: 45 },
    { month: 'JUL', score: 48 },
    { month: 'AUG', score: 60 },
    { month: 'SEP', score: 92 },
    { month: 'OCT', score: 94 },
];

export const LOANS_DATA: Loan[] = [
    {
        id: '#LN-884-X',
        counterparty: 'Omega Holdings',
        amount: '$12.5M',
        type: 'Term Loan A',
        status: 'In Review',
        date: 'Oct 24, 2023',
        risk: 'Critical',
        deadline: 'Oct 26, 2023'
    },
    {
        id: '#LN-901-A',
        counterparty: 'Vertex Global',
        amount: '$4.2M',
        type: 'Revolver',
        status: 'Pending',
        date: 'Oct 25, 2023',
        risk: 'Medium',
        deadline: 'Oct 28, 2023'
    },
    {
        id: '#LN-102-B',
        counterparty: 'Apex Partners',
        amount: '$25.0M',
        type: 'Syndicated',
        status: 'Approved',
        date: 'Oct 20, 2023',
        risk: 'Low',
        deadline: 'Nov 02, 2023'
    },
    {
        id: '#LN-2024-005',
        counterparty: 'Zeta Tech',
        amount: '$3.2M',
        type: 'Venture Debt',
        status: 'Approved',
        date: 'Mar 10, 2025',
        risk: 'High',
        deadline: 'Mar 15, 2025'
    },
    {
        id: '#LN-2023-902',
        counterparty: 'Beta Holdings',
        amount: '$12.25M',
        type: 'Revolver',
        status: 'In Review',
        date: 'Dec 15, 2024',
        risk: 'Medium',
        deadline: 'Dec 20, 2024'
    },
    {
        id: '#LN-2023-755',
        counterparty: 'Gamma Industries',
        amount: '$1.1M',
        type: 'Bridge Loan',
        status: 'Rejected',
        date: 'Nov 30, 2024',
        risk: 'High',
        deadline: 'Dec 05, 2024'
    }
];

export const INITIAL_ALERTS: Alert[] = [
    { title: "LIBOR Clause Missing", time: "2m", subtitle: "Loan #8839 • Syndicated Term", type: 'critical' },
    { title: "Doc Incomplete", time: "45m", subtitle: "Loan #4402 • Acme Corp", type: 'warning' },
    { title: "AI Suggestion", time: "2h", subtitle: "Optimization for Loan #9921", type: 'info' }
];
