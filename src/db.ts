import Dexie, { Table } from 'dexie';
import { Doc } from './types';
import { INITIAL_VAULT_DOCS } from './data/mockData';

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

export interface Loan {
    id: string;
    counterparty: string;
    initial: string;
    initialColor: string;
    risk: string;
    riskColor: string;
    deadline: string;
}

export class AppDatabase extends Dexie {
  users!: Table<User>;
  docs!: Table<Doc, number>; // Primary key is number (auto-incremented) but we'll see if Doc has an ID
  chartData!: Table<ChartData, number>;
  loans!: Table<Loan, string>; // Primary key is ID string

  constructor() {
    super('LMA_DocPulse_DB');
    this.version(1).stores({
      users: '++id, email',
      docs: '++id, name, type, status, date',
      chartData: '++id, month',
      loans: 'id, counterparty, risk'
    });
  }
}

export const db = new AppDatabase();

// Initialize DB with mock data if empty
export const initDB = async () => {
    const docsCount = await db.docs.count();
    if (docsCount === 0) {
        await db.docs.bulkAdd(INITIAL_VAULT_DOCS);
    }

    // We can also initialize other data if needed, but the prompt mainly focused on mockData replacement.
    // Let's bring in CHART_DATA and LOANS_DATA too
    const { CHART_DATA, LOANS_DATA } = await import('./data/mockData');

    const chartCount = await db.chartData.count();
    if (chartCount === 0) {
        await db.chartData.bulkAdd(CHART_DATA);
    }

    const loansCount = await db.loans.count();
    if (loansCount === 0) {
        await db.loans.bulkAdd(LOANS_DATA);
    }
};
