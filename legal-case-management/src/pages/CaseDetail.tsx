/**
 * Case Detail – tabbed view with overview, hearings, documents, tasks, notes, payments.
 */

import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCases } from "../context/CasesContext";
import { getTranslation, formatDateIndian } from "../utils/hindiUtils";
import {
  PRIORITIES,
  TASK_STATUSES,
  DOCUMENT_CATEGORIES,
  JUNIOR_NAMES,
} from "../data/cases";

type Tab = "overview" | "hearings" | "documents" | "tasks" | "notes" | "payments";

const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, isAdmin, user } = useAuth();
  const {
    cases,
    addHearing,
    addDocument,
    addTask,
    updateTaskStatus,
    addNote,
    addPayment,
    assignJunior,
  } = useCases();
  const t = (key: string) => getTranslation(key, language);

  const [tab, setTab] = useState<Tab>("overview");

  const [hearing, setHearing] = useState({ date: "", outcome: "", notes: "" });
  const [document, setDocument] = useState({ name: "", category: "Petition" });
  const [task, setTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    priority: "Medium",
  });
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState({ amount: "", description: "" });

  const legalCase = cases.find((item) => item.id === id);

  if (!legalCase) {
    return (
      <div className="page">
        <p className="empty-state">{t("noData")}</p>
        <Link className="btn btn-secondary" to="/cases">
          {t("back")}
        </Link>
      </div>
    );
  }

  const canView =
    isAdmin || !user || legalCase.assignedJunior === user.name;

  if (!canView) {
    return (
      <div className="page">
        <p className="empty-state">
          {language === "hi"
            ? "आपको इस केस को देखने की अनुमति नहीं है।"
            : "You do not have permission to view this case."}
        </p>
        <Link className="btn btn-secondary" to="/cases">
          {t("back")}
        </Link>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "overview", label: t("overview") },
    { key: "hearings", label: t("hearings"), count: legalCase.hearingHistory.length },
    { key: "documents", label: t("documents"), count: legalCase.documents.length },
    { key: "tasks", label: t("tasks"), count: legalCase.tasks.length },
    { key: "notes", label: t("notes"), count: legalCase.notes.length },
    { key: "payments", label: t("payments"), count: legalCase.payments.length },
  ];

  const submitHearing = (event: FormEvent) => {
    event.preventDefault();
    if (!hearing.date) return;
    addHearing(legalCase.id, { ...hearing });
    setHearing({ date: "", outcome: "", notes: "" });
  };

  const submitDocument = (event: FormEvent) => {
    event.preventDefault();
    if (!document.name.trim()) return;
    addDocument(legalCase.id, {
      id: `DOC-${Date.now()}`,
      name: document.name.trim(),
      category: document.category,
      uploadedBy: user?.name ?? "",
      uploadDate: new Date().toISOString().slice(0, 10),
      filePath: `/uploads/${document.name.trim()}`,
    });
    setDocument({ name: "", category: "Petition" });
  };

  const submitTask = (event: FormEvent) => {
    event.preventDefault();
    if (!task.title.trim()) return;
    addTask(legalCase.id, {
      id: `TASK-${Date.now()}`,
      title: task.title.trim(),
      description: task.description,
      assignedTo: task.assignedTo || null,
      dueDate: task.dueDate || new Date().toISOString().slice(0, 10),
      priority: task.priority,
      status: "Pending",
    });
    setTask({ title: "", description: "", assignedTo: "", dueDate: "", priority: "Medium" });
  };

  const submitNote = (event: FormEvent) => {
    event.preventDefault();
    if (!note.trim()) return;
    addNote(legalCase.id, note.trim());
    setNote("");
  };

  const submitPayment = (event: FormEvent) => {
    event.preventDefault();
    const amount = Number(payment.amount);
    if (!amount) return;
    addPayment(legalCase.id, {
      amount,
      description: payment.description,
      date: new Date().toISOString().slice(0, 10),
      status: "Paid",
    });
    setPayment({ amount: "", description: "" });
  };

  const totalPaid = legalCase.payments.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="page">
      <Link className="back-link" to="/cases">
        ← {t("back")}
      </Link>

      <header className="page-header">
        <div>
          <h1>{legalCase.caseTitle}</h1>
          <p className="page-subtitle">
            {legalCase.id} · {legalCase.caseNumber} · {legalCase.courtName}
          </p>
        </div>
        <span className="badge badge-primary">{legalCase.caseStatus}</span>
      </header>

      <nav className="tab-bar">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            className={tab === item.key ? "tab active" : "tab"}
            onClick={() => setTab(item.key)}
          >
            {item.label}
            {typeof item.count === "number" ? ` (${item.count})` : ""}
          </button>
        ))}
      </nav>

      {tab === "overview" && (
        <div className="two-column">
          <section className="panel">
            <h2>{t("caseSummary")}</h2>
            <p>{legalCase.caseSummary || "—"}</p>
            <h2>{t("importantNotes")}</h2>
            <p>{legalCase.importantNotes || "—"}</p>
          </section>

          <section className="panel">
            <h2>{t("caseLabel")}</h2>
            <dl className="detail-list">
              <div>
                <dt>{t("clientName")}</dt>
                <dd>{legalCase.clientName}</dd>
              </div>
              <div>
                <dt>{t("clientPhone")}</dt>
                <dd>{legalCase.clientPhone}</dd>
              </div>
              <div>
                <dt>{t("clientEmail")}</dt>
                <dd>{legalCase.clientEmail}</dd>
              </div>
              <div>
                <dt>{t("clientAddress")}</dt>
                <dd>{legalCase.clientAddress}</dd>
              </div>
              <div>
                <dt>{t("oppositeParty")}</dt>
                <dd>{legalCase.oppositeParty}</dd>
              </div>
              <div>
                <dt>{t("judge")}</dt>
                <dd>{legalCase.judge}</dd>
              </div>
              <div>
                <dt>{t("bench")}</dt>
                <dd>{legalCase.bench}</dd>
              </div>
              <div>
                <dt>{t("filingDate")}</dt>
                <dd>{formatDateIndian(legalCase.filingDate)}</dd>
              </div>
              <div>
                <dt>{t("nextHearingDate")}</dt>
                <dd>{formatDateIndian(legalCase.nextHearingDate)}</dd>
              </div>
              <div>
                <dt>{t("assignedJunior")}</dt>
                <dd>
                  {isAdmin ? (
                    <select
                      value={legalCase.assignedJunior ?? ""}
                      onChange={(event) =>
                        assignJunior(legalCase.id, event.target.value || null)
                      }
                    >
                      <option value="">{t("unassigned")}</option>
                      {JUNIOR_NAMES.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    legalCase.assignedJunior || t("unassigned")
                  )}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      )}

      {tab === "hearings" && (
        <div className="two-column">
          <section className="panel">
            <h2>{t("hearingHistory")}</h2>
            {legalCase.hearingHistory.length === 0 ? (
              <p className="empty-state">{t("noData")}</p>
            ) : (
              <ul className="timeline">
                {legalCase.hearingHistory.map((item, index) => (
                  <li key={`${item.date}-${index}`}>
                    <span className="timeline-date">{formatDateIndian(item.date)}</span>
                    <span className="timeline-body">
                      <strong>{item.outcome}</strong>
                      <small>{item.notes}</small>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="panel">
            <h2>{t("addHearingTitle")}</h2>
            <form onSubmit={submitHearing} className="stack-form">
              <label>
                {t("date")}
                <input
                  type="date"
                  required
                  value={hearing.date}
                  onChange={(event) =>
                    setHearing((prev) => ({ ...prev, date: event.target.value }))
                  }
                />
              </label>
              <label>
                {t("outcome")}
                <input
                  value={hearing.outcome}
                  onChange={(event) =>
                    setHearing((prev) => ({ ...prev, outcome: event.target.value }))
                  }
                />
              </label>
              <label>
                {t("notes")}
                <textarea
                  rows={2}
                  value={hearing.notes}
                  onChange={(event) =>
                    setHearing((prev) => ({ ...prev, notes: event.target.value }))
                  }
                />
              </label>
              <button className="btn btn-primary" type="submit">
                {t("save")}
              </button>
            </form>
          </section>
        </div>
      )}

      {tab === "documents" && (
        <div className="two-column">
          <section className="panel">
            <h2>{t("documentsAttached")}</h2>
            {legalCase.documents.length === 0 ? (
              <p className="empty-state">{t("noData")}</p>
            ) : (
              <ul className="entry-list">
                {legalCase.documents.map((doc) => (
                  <li key={doc.id}>
                    <span className="entry-title">📄 {doc.name}</span>
                    <span className="entry-meta">
                      {doc.category} · {formatDateIndian(doc.uploadDate)} ·{" "}
                      {doc.uploadedBy}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="panel">
            <h2>{t("uploadDocument")}</h2>
            <form onSubmit={submitDocument} className="stack-form">
              <label>
                {t("fileName")}
                <input
                  required
                  placeholder="e.g. Affidavit.pdf"
                  value={document.name}
                  onChange={(event) =>
                    setDocument((prev) => ({ ...prev, name: event.target.value }))
                  }
                />
              </label>
              <label>
                {t("category")}
                <select
                  value={document.category}
                  onChange={(event) =>
                    setDocument((prev) => ({ ...prev, category: event.target.value }))
                  }
                >
                  {DOCUMENT_CATEGORIES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {language === "hi" ? "फ़ाइल चुनें" : "Choose file"} (PDF, DOC, DOCX, JPG, PNG)
                <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
              </label>
              <button className="btn btn-primary" type="submit">
                {t("save")}
              </button>
            </form>
          </section>
        </div>
      )}

      {tab === "tasks" && (
        <div className="two-column">
          <section className="panel">
            <h2>{t("tasks")}</h2>
            {legalCase.tasks.length === 0 ? (
              <p className="empty-state">{t("noData")}</p>
            ) : (
              <ul className="entry-list">
                {legalCase.tasks.map((item) => (
                  <li key={item.id}>
                    <span className="entry-title">{item.title}</span>
                    <span className="entry-meta">
                      {item.assignedTo || t("unassigned")} ·{" "}
                      {formatDateIndian(item.dueDate)} · {item.priority}
                    </span>
                    <select
                      value={item.status}
                      onChange={(event) =>
                        updateTaskStatus(legalCase.id, item.id, event.target.value)
                      }
                    >
                      {TASK_STATUSES.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {isAdmin && (
            <section className="panel">
              <h2>{t("addTask")}</h2>
              <form onSubmit={submitTask} className="stack-form">
                <label>
                  {t("taskTitle")}
                  <input
                    required
                    value={task.title}
                    onChange={(event) =>
                      setTask((prev) => ({ ...prev, title: event.target.value }))
                    }
                  />
                </label>
                <label>
                  {t("taskDescription")}
                  <textarea
                    rows={2}
                    value={task.description}
                    onChange={(event) =>
                      setTask((prev) => ({ ...prev, description: event.target.value }))
                    }
                  />
                </label>
                <label>
                  {t("assignedTo")}
                  <select
                    value={task.assignedTo}
                    onChange={(event) =>
                      setTask((prev) => ({ ...prev, assignedTo: event.target.value }))
                    }
                  >
                    <option value="">{t("unassigned")}</option>
                    {JUNIOR_NAMES.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  {t("dueDate")}
                  <input
                    type="date"
                    value={task.dueDate}
                    onChange={(event) =>
                      setTask((prev) => ({ ...prev, dueDate: event.target.value }))
                    }
                  />
                </label>
                <label>
                  {t("priority")}
                  <select
                    value={task.priority}
                    onChange={(event) =>
                      setTask((prev) => ({ ...prev, priority: event.target.value }))
                    }
                  >
                    {PRIORITIES.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
                <button className="btn btn-primary" type="submit">
                  {t("save")}
                </button>
              </form>
            </section>
          )}
        </div>
      )}

      {tab === "notes" && (
        <div className="two-column">
          <section className="panel">
            <h2>{t("notes")}</h2>
            {legalCase.notes.length === 0 ? (
              <p className="empty-state">{t("noData")}</p>
            ) : (
              <ul className="note-list">
                {legalCase.notes.map((text, index) => (
                  <li key={index}>{text}</li>
                ))}
              </ul>
            )}
          </section>

          <section className="panel">
            <h2>{t("addNote")}</h2>
            <form onSubmit={submitNote} className="stack-form">
              <label>
                {t("noteText")}
                <textarea
                  rows={4}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                />
              </label>
              <button className="btn btn-primary" type="submit">
                {t("save")}
              </button>
            </form>
          </section>
        </div>
      )}

      {tab === "payments" && (
        <div className="two-column">
          <section className="panel">
            <h2>{t("payments")}</h2>
            <p className="page-subtitle">
              {t("fees")}: ₹{totalPaid.toLocaleString("en-IN")}
            </p>
            {legalCase.payments.length === 0 ? (
              <p className="empty-state">{t("noData")}</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t("date")}</th>
                    <th>{t("description")}</th>
                    <th>{t("amount")}</th>
                    <th>{t("status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {legalCase.payments.map((item, index) => (
                    <tr key={index}>
                      <td>{formatDateIndian(item.date)}</td>
                      <td>{item.description}</td>
                      <td>₹{item.amount.toLocaleString("en-IN")}</td>
                      <td>
                        <span className="badge badge-success">{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {isAdmin && (
            <section className="panel">
              <h2>{t("addPayment")}</h2>
              <form onSubmit={submitPayment} className="stack-form">
                <label>
                  {t("amount")}
                  <input
                    type="number"
                    min="0"
                    required
                    value={payment.amount}
                    onChange={(event) =>
                      setPayment((prev) => ({ ...prev, amount: event.target.value }))
                    }
                  />
                </label>
                <label>
                  {t("description")}
                  <input
                    value={payment.description}
                    onChange={(event) =>
                      setPayment((prev) => ({ ...prev, description: event.target.value }))
                    }
                  />
                </label>
                <button className="btn btn-primary" type="submit">
                  {t("save")}
                </button>
              </form>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default CaseDetail;
