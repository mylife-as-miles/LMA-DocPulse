import Dexie, { Table } from 'dexie';
import { Doc, Alert, Loan, Query } from './types';

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
  stats?: {
    loansReviewed: number;
    approvalRate: number;
    avgTurnaround: string;
    performance: string;
  };
  awards?: Array<{
    title: string;
    year: string;
    icon: string; // Storing icon name string to map to Lucide icon component in view
  }>;
  assignments?: Array<{
    title: string;
    progress: number;
    status: string;
  }>;
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
  queries!: Table<Query, number>;

  constructor() {
    super('LMA_DocPulse_DB');
    this.version(3).stores({
      users: '++id, email',
      docs: '++id, name, type, status, date',
      chartData: '++id, month',
      loans: 'id, counterparty, risk, status, type',
      alerts: '++id, type',
      queries: '++id, timestamp'
    });
  }
}

export const db = new AppDatabase();

// Initialize DB
export const initDB = async () => {
  // Mock data population removed as per requirements.
  // The database will start empty or preserve existing user data.
};
