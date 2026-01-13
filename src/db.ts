import Dexie, { Table } from 'dexie';
import { Doc, Alert, Loan } from './types';

export interface User {
  id?: number;
  email: string;
  password: string; // Storing plain text password for now as per simple auth requirement, ideally should be hashed
  name: string;
  title?: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  avatar?: string;
}

export interface ChartData {
    id?: number;
    month: string;
    score: number;
}

export class AppDatabase extends Dexie {
  users!: Table<User>;
  docs!: Table<Doc, number>; // Primary key is number (auto-incremented)
  chartData!: Table<ChartData, number>;
  loans!: Table<Loan, string>; // Primary key is ID string
  alerts!: Table<Alert, number>;

  constructor() {
    super('LMA_DocPulse_DB');
    this.version(2).stores({
      users: '++id, email',
      docs: '++id, name, type, status, date',
      chartData: '++id, month',
      loans: 'id, counterparty, risk, status, type',
      alerts: '++id, type'
    });
  }
}

export const db = new AppDatabase();

// Initialize DB with mock data if empty
export const initDB = async () => {
    // We can also initialize other data if needed, but the prompt mainly focused on mockData replacement.
    // Let's bring in CHART_DATA and LOANS_DATA too
    const { CHART_DATA, LOANS_DATA, INITIAL_ALERTS } = await import('./data/mockData');

    const chartCount = await db.chartData.count();
    if (chartCount === 0) {
        await db.chartData.bulkAdd(CHART_DATA);
    }

    const loansCount = await db.loans.count();
    // Check if we need to re-seed loans (e.g. if we have old format data, we might want to clear it, but here we just check count)
    // For simplicity, we assume if count is 0, we add. If user wants to force reset, they can clear DB.
    if (loansCount === 0) {
        await db.loans.bulkAdd(LOANS_DATA);
    }

    const alertsCount = await db.alerts.count();
    if (alertsCount === 0) {
        await db.alerts.bulkAdd(INITIAL_ALERTS);
    }
};
