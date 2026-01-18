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

import { LOANS_DATA, INITIAL_ALERTS } from './data/mockData';

// Initialize DB
export const initDB = async () => {
  // Check and seed Loans
  const loansCount = await db.loans.count();
  if (loansCount === 0) {
    await db.loans.bulkAdd(LOANS_DATA);
    console.log("Seeded Loans");
  }

  // Check and seed Alerts
  const alertsCount = await db.alerts.count();
  if (alertsCount === 0) {
    await db.alerts.bulkAdd(INITIAL_ALERTS);
    console.log("Seeded Alerts");
  }

  // Check and seed User (for Profile & Stats)
  const usersCount = await db.users.count();
  if (usersCount === 0) {
    await db.users.add({
      email: 'alex.morgan@lmadocpulse.com',
      password: 'password123',
      name: 'Alex Morgan',
      title: 'Senior Credit Analyst',
      location: 'New York, USA',
      bio: 'Specializing in syndicated loans and LMA compliance with over 10 years of experience in structured finance.',
      skills: ['LMA Standards', 'Credit Risk', 'Financial Modeling', 'Legal Frameworks'],
      stats: {
        loansReviewed: 142,
        approvalRate: 87,
        avgTurnaround: '2.4 Days',
        performance: 'Top 5%'
      },
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256',
      awards: [
        { title: 'Analyst of the Year', year: '2025', icon: 'Award' },
        { title: 'Deal Closer', year: '2024', icon: 'Briefcase' }
      ]
    });
    console.log("Seeded User Profile");
  }
};
