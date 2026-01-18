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

export interface Notification {
  id?: number;
  title: string;
  message: string;
  type: 'info' | 'alert' | 'success' | 'warning';
  timestamp: string;
  read: boolean;
  link?: string;
}

export class AppDatabase extends Dexie {
  users!: Table<User>;
  docs!: Table<Doc, number>; // Primary key is number (auto-incremented)
  chartData!: Table<ChartData, number>;
  loans!: Table<Loan, string>; // Primary key is ID string
  alerts!: Table<Alert, number>;
  queries!: Table<Query, number>;
  notifications!: Table<Notification, number>;

  constructor() {
    super('LMA_DocPulse_DB');
    this.version(4).stores({
      users: '++id, email',
      docs: '++id, name, type, status, date',
      chartData: '++id, month',
      loans: 'id, counterparty, risk, status, type',
      alerts: '++id, type',
      queries: '++id, timestamp',
      notifications: '++id, type, read, timestamp'
    });
  }
}

export const db = new AppDatabase();

// No mock data seeding - application starts completely empty
// All data comes from user uploads and interactions

// Initialize DB - reserved for future initialization logic
export const initDB = async () => {
  // Database is ready - no seeding needed
  // Users create their own profile via UserOnboarding
  // Loans/documents are created via uploads and AI analysis
  console.log("Database initialized (no seed data)");
};
