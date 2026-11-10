/**
 * Typed access to the demo case data plus derived collections used across pages.
 */

import rawCases from "./sample-cases.json";

export interface CaseDocument {
  id: string;
  name: string;
  category: string;
  uploadedBy: string;
  uploadDate: string;
  filePath: string;
}

export interface HearingEntry {
  date: string;
  outcome: string;
  notes: string;
}

export interface CaseTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string | null;
  dueDate: string;
  priority: string;
  status: string;
}

export interface Payment {
  amount: number;
  description: string;
  date: string;
  status: string;
}

export interface LegalCase {
  id: string;
  caseNumber: string;
  caseTitle: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  oppositeParty: string;
  courtName: string;
  bench: string;
  judge: string;
  caseType: string;
  caseStatus: string;
  filingDate: string;
  nextHearingDate: string;
  assignedJunior: string | null;
  caseSummary: string;
  importantNotes: string;
  documents: CaseDocument[];
  hearingHistory: HearingEntry[];
  tasks: CaseTask[];
  payments: Payment[];
  notes: string[];
}

export const initialCases: LegalCase[] = rawCases.cases.map((item) => ({
  ...item,
  assignedJunior: item.assignedJunior ?? null,
  notes: [],
}));

export const CASE_TYPES = [
  "Civil",
  "Criminal",
  "Family",
  "Revenue",
  "Writ",
  "Appeal",
];

export const CASE_STATUSES = [
  "Filing",
  "Hearing",
  "Evidence",
  "Arguments",
  "Order Reserved",
  "Judgment",
  "Appeal",
  "Closed",
];

export const DOCUMENT_CATEGORIES = [
  "Petition",
  "Affidavit",
  "Evidence",
  "Court Order",
  "Judgment",
  "Vakalatnama",
  "Other",
];

export const PRIORITIES = ["Low", "Medium", "High", "Urgent"];
export const TASK_STATUSES = ["Pending", "In Progress", "Completed"];
export const JUNIOR_NAMES = ["Adv. Rajesh Kumar", "Adv. Priya Sharma"];

/** Today as an ISO date (yyyy-mm-dd). */
export const todayISO = (): string => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
};

export const daysBetween = (a: string, b: string): number => {
  const first = new Date(a + "T00:00:00");
  const second = new Date(b + "T00:00:00");
  return Math.round((second.getTime() - first.getTime()) / 86400000);
};

export const isUpcomingWithin = (date: string, days: number): boolean => {
  const diff = daysBetween(todayISO(), date);
  return diff >= 0 && diff < days;
};

export const isPast = (date: string): boolean => daysBetween(todayISO(), date) < 0;
