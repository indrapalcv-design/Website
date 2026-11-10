/**
 * In-memory case store. Holds cases plus mutations so every page
 * (dashboard, case list, detail, calendar, documents, tasks) stays in sync.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  initialCases,
  type CaseDocument,
  type CaseTask,
  type HearingEntry,
  type LegalCase,
  type Payment,
} from "../data/cases";

type NewCaseInput = Omit<
  LegalCase,
  "id" | "documents" | "hearingHistory" | "tasks" | "payments" | "notes"
>;

type CasesContextType = {
  cases: LegalCase[];
  addCase: (input: NewCaseInput) => string;
  updateCase: (id: string, patch: Partial<LegalCase>) => void;
  deleteCase: (id: string) => void;
  addHearing: (caseId: string, hearing: HearingEntry) => void;
  addDocument: (caseId: string, document: CaseDocument) => void;
  addTask: (caseId: string, task: CaseTask) => void;
  updateTaskStatus: (caseId: string, taskId: string, status: string) => void;
  addNote: (caseId: string, note: string) => void;
  addPayment: (caseId: string, payment: Payment) => void;
  assignJunior: (caseId: string, junior: string | null) => void;
};

const CasesContext = createContext<CasesContextType | null>(null);

export const useCases = (): CasesContextType => {
  const ctx = useContext(CasesContext);
  if (!ctx) throw new Error("useCases must be used inside a CasesProvider");
  return ctx;
};

const nextId = (prefix: string, existing: string[]): string => {
  const year = new Date().getFullYear();
  let n = existing.length + 1;
  let id = `${prefix}-${year}-${String(n).padStart(3, "0")}`;
  while (existing.includes(id)) {
    n += 1;
    id = `${prefix}-${year}-${String(n).padStart(3, "0")}`;
  }
  return id;
};

export const CasesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<LegalCase[]>(initialCases);

  const patchCase = useCallback((id: string, patch: Partial<LegalCase>) => {
    setCases((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }, []);

  const addCase = useCallback((input: NewCaseInput): string => {
    let createdId = "";
    setCases((prev) => {
      createdId = nextId("CASE", prev.map((item) => item.id));
      const created: LegalCase = {
        ...input,
        id: createdId,
        documents: [],
        hearingHistory: [],
        tasks: [],
        payments: [],
        notes: [],
      };
      return [created, ...prev];
    });
    return createdId;
  }, []);

  const deleteCase = useCallback((id: string) => {
    setCases((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addHearing = useCallback((caseId: string, hearing: HearingEntry) => {
    setCases((prev) =>
      prev.map((item) =>
        item.id === caseId
          ? {
              ...item,
              hearingHistory: [...item.hearingHistory, hearing],
              nextHearingDate: hearing.date > item.nextHearingDate
                ? hearing.date
                : item.nextHearingDate,
            }
          : item,
      ),
    );
  }, []);

  const addDocument = useCallback((caseId: string, document: CaseDocument) => {
    setCases((prev) =>
      prev.map((item) =>
        item.id === caseId
          ? { ...item, documents: [document, ...item.documents] }
          : item,
      ),
    );
  }, []);

  const addTask = useCallback((caseId: string, task: CaseTask) => {
    setCases((prev) =>
      prev.map((item) =>
        item.id === caseId ? { ...item, tasks: [...item.tasks, task] } : item,
      ),
    );
  }, []);

  const updateTaskStatus = useCallback(
    (caseId: string, taskId: string, status: string) => {
      setCases((prev) =>
        prev.map((item) =>
          item.id === caseId
            ? {
                ...item,
                tasks: item.tasks.map((task) =>
                  task.id === taskId ? { ...task, status } : task,
                ),
              }
            : item,
        ),
      );
    },
    [],
  );

  const addNote = useCallback((caseId: string, note: string) => {
    setCases((prev) =>
      prev.map((item) =>
        item.id === caseId ? { ...item, notes: [note, ...item.notes] } : item,
      ),
    );
  }, []);

  const addPayment = useCallback((caseId: string, payment: Payment) => {
    setCases((prev) =>
      prev.map((item) =>
        item.id === caseId
          ? { ...item, payments: [...item.payments, payment] }
          : item,
      ),
    );
  }, []);

  const assignJunior = useCallback((caseId: string, junior: string | null) => {
    patchCase(caseId, { assignedJunior: junior });
  }, [patchCase]);

  const value = useMemo<CasesContextType>(
    () => ({
      cases,
      addCase,
      updateCase: patchCase,
      deleteCase,
      addHearing,
      addDocument,
      addTask,
      updateTaskStatus,
      addNote,
      addPayment,
      assignJunior,
    }),
    [
      cases,
      addCase,
      patchCase,
      deleteCase,
      addHearing,
      addDocument,
      addTask,
      updateTaskStatus,
      addNote,
      addPayment,
      assignJunior,
    ],
  );

  return <CasesContext.Provider value={value}>{children}</CasesContext.Provider>;
};
