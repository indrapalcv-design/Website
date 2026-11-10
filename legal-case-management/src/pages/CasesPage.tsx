/**
 * Case Management – list, search, filter and full CRUD.
 */

import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCases } from "../context/CasesContext";
import { getTranslation, formatDateIndian } from "../utils/hindiUtils";
import {
  CASE_STATUSES,
  CASE_TYPES,
  JUNIOR_NAMES,
  type LegalCase,
} from "../data/cases";

const emptyForm = {
  caseNumber: "",
  caseTitle: "",
  clientName: "",
  clientPhone: "",
  clientEmail: "",
  clientAddress: "",
  oppositeParty: "",
  courtName: "District Court, Lakhimpur",
  bench: "",
  judge: "",
  caseType: "Civil",
  caseStatus: "Filing",
  filingDate: "",
  nextHearingDate: "",
  assignedJunior: "",
  caseSummary: "",
  importantNotes: "",
};

type FormState = typeof emptyForm;

const statusClass = (status: string): string => {
  if (status === "Closed") return "badge badge-muted";
  if (status === "Judgment") return "badge badge-success";
  if (status === "Order Reserved") return "badge badge-warn";
  if (status === "Evidence" || status === "Arguments") return "badge badge-info";
  return "badge badge-primary";
};

const CasesPage: React.FC = () => {
  const { user, language, isAdmin } = useAuth();
  const { cases, addCase, updateCase, deleteCase } = useCases();
  const t = (key: string) => getTranslation(key, language);

  const [search, setSearch] = useState("");
  const [court, setCourt] = useState("");
  const [status, setStatus] = useState("");
  const [junior, setJunior] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const courts = useMemo(
    () => Array.from(new Set(cases.map((item) => item.courtName))).sort(),
    [cases],
  );

  const roleScoped =
    isAdmin || !user
      ? cases
      : cases.filter((item) => item.assignedJunior === user.name);

  const filtered = roleScoped.filter((item) => {
    const term = search.trim().toLowerCase();
    const matchesTerm =
      !term ||
      item.caseTitle.toLowerCase().includes(term) ||
      item.caseNumber.toLowerCase().includes(term) ||
      item.clientName.toLowerCase().includes(term) ||
      item.oppositeParty.toLowerCase().includes(term);
    const matchesCourt = !court || item.courtName === court;
    const matchesStatus = !status || item.caseStatus === status;
    const matchesJunior = !junior || item.assignedJunior === junior;
    return matchesTerm && matchesCourt && matchesStatus && matchesJunior;
  });

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      filingDate: new Date().toISOString().slice(0, 10),
      nextHearingDate: new Date().toISOString().slice(0, 10),
    });
    setShowForm(true);
  };

  const openEdit = (item: LegalCase) => {
    setEditingId(item.id);
    setForm({
      caseNumber: item.caseNumber,
      caseTitle: item.caseTitle,
      clientName: item.clientName,
      clientPhone: item.clientPhone,
      clientEmail: item.clientEmail,
      clientAddress: item.clientAddress,
      oppositeParty: item.oppositeParty,
      courtName: item.courtName,
      bench: item.bench,
      judge: item.judge,
      caseType: item.caseType,
      caseStatus: item.caseStatus,
      filingDate: item.filingDate,
      nextHearingDate: item.nextHearingDate,
      assignedJunior: item.assignedJunior ?? "",
      caseSummary: item.caseSummary,
      importantNotes: item.importantNotes,
    });
    setShowForm(true);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const payload = {
      ...form,
      assignedJunior: form.assignedJunior || null,
    };

    if (editingId) {
      updateCase(editingId, payload);
    } else {
      addCase(payload);
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const update = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>{t("cases")}</h1>
          <p className="page-subtitle">
            {filtered.length} {language === "hi" ? "केस" : "cases"}
          </p>
        </div>
        {isAdmin && (
          <button className="btn btn-gold" onClick={openCreate}>
            + {t("addCase")}
          </button>
        )}
      </header>

      <section className="filter-bar">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("searchCases")}
          aria-label={t("search")}
        />
        <select value={court} onChange={(event) => setCourt(event.target.value)}>
          <option value="">{t("allCourts")}</option>
          {courts.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">{t("allStatuses")}</option>
          {CASE_STATUSES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        {isAdmin && (
          <select value={junior} onChange={(event) => setJunior(event.target.value)}>
            <option value="">{t("allJuniors")}</option>
            {JUNIOR_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="panel table-panel">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("caseId")}</th>
                <th>{t("caseTitle")}</th>
                <th>{t("clientName")}</th>
                <th>{t("courtName")}</th>
                <th>{t("caseType")}</th>
                <th>{t("caseStatus")}</th>
                <th>{t("nextHearingDate")}</th>
                {isAdmin && <th>{t("assignedJunior")}</th>}
                <th>{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 9 : 8} className="empty-cell">
                    {t("noData")}
                  </td>
                </tr>
              )}
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.id}</strong>
                    <br />
                    <small>{item.caseNumber}</small>
                  </td>
                  <td>
                    <Link className="table-link" to={`/case-detail/${item.id}`}>
                      {item.caseTitle}
                    </Link>
                    <br />
                    <small>{item.oppositeParty}</small>
                  </td>
                  <td>{item.clientName}</td>
                  <td>{item.courtName}</td>
                  <td>{item.caseType}</td>
                  <td>
                    <span className={statusClass(item.caseStatus)}>
                      {item.caseStatus}
                    </span>
                  </td>
                  <td>{formatDateIndian(item.nextHearingDate)}</td>
                  {isAdmin && <td>{item.assignedJunior || t("unassigned")}</td>}
                  <td>
                    <div className="row-actions">
                      <Link className="btn btn-secondary btn-xs" to={`/case-detail/${item.id}`}>
                        {t("view")}
                      </Link>
                      {isAdmin && (
                        <>
                          <button
                            className="btn btn-secondary btn-xs"
                            onClick={() => openEdit(item)}
                          >
                            {t("edit")}
                          </button>
                          <button
                            className="btn btn-danger btn-xs"
                            onClick={() => {
                              if (window.confirm(t("confirmDelete"))) {
                                deleteCase(item.id);
                              }
                            }}
                          >
                            {t("delete")}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showForm && isAdmin && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <h2>{editingId ? t("editCase") : t("newCase")}</h2>
            <form onSubmit={handleSubmit} className="form-grid">
              <label>
                {t("caseNumber")}
                <input
                  required
                  value={form.caseNumber}
                  onChange={(event) => update("caseNumber", event.target.value)}
                />
              </label>
              <label>
                {t("caseTitle")}
                <input
                  required
                  value={form.caseTitle}
                  onChange={(event) => update("caseTitle", event.target.value)}
                />
              </label>
              <label>
                {t("clientName")}
                <input
                  required
                  value={form.clientName}
                  onChange={(event) => update("clientName", event.target.value)}
                />
              </label>
              <label>
                {t("clientPhone")}
                <input
                  value={form.clientPhone}
                  onChange={(event) => update("clientPhone", event.target.value)}
                />
              </label>
              <label>
                {t("clientEmail")}
                <input
                  type="email"
                  value={form.clientEmail}
                  onChange={(event) => update("clientEmail", event.target.value)}
                />
              </label>
              <label>
                {t("clientAddress")}
                <input
                  value={form.clientAddress}
                  onChange={(event) => update("clientAddress", event.target.value)}
                />
              </label>
              <label>
                {t("oppositeParty")}
                <input
                  value={form.oppositeParty}
                  onChange={(event) => update("oppositeParty", event.target.value)}
                />
              </label>
              <label>
                {t("courtName")}
                <input
                  value={form.courtName}
                  onChange={(event) => update("courtName", event.target.value)}
                />
              </label>
              <label>
                {t("bench")}
                <input
                  value={form.bench}
                  onChange={(event) => update("bench", event.target.value)}
                />
              </label>
              <label>
                {t("judge")}
                <input
                  value={form.judge}
                  onChange={(event) => update("judge", event.target.value)}
                />
              </label>
              <label>
                {t("caseType")}
                <select
                  value={form.caseType}
                  onChange={(event) => update("caseType", event.target.value)}
                >
                  {CASE_TYPES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t("caseStatus")}
                <select
                  value={form.caseStatus}
                  onChange={(event) => update("caseStatus", event.target.value)}
                >
                  {CASE_STATUSES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t("filingDate")}
                <input
                  type="date"
                  required
                  value={form.filingDate}
                  onChange={(event) => update("filingDate", event.target.value)}
                />
              </label>
              <label>
                {t("nextHearingDate")}
                <input
                  type="date"
                  required
                  value={form.nextHearingDate}
                  onChange={(event) => update("nextHearingDate", event.target.value)}
                />
              </label>
              <label>
                {t("assignedJunior")}
                <select
                  value={form.assignedJunior}
                  onChange={(event) => update("assignedJunior", event.target.value)}
                >
                  <option value="">{t("unassigned")}</option>
                  {JUNIOR_NAMES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="full-span">
                {t("caseSummary")}
                <textarea
                  rows={3}
                  value={form.caseSummary}
                  onChange={(event) => update("caseSummary", event.target.value)}
                />
              </label>
              <label className="full-span">
                {t("importantNotes")}
                <textarea
                  rows={2}
                  value={form.importantNotes}
                  onChange={(event) => update("importantNotes", event.target.value)}
                />
              </label>
              <div className="form-actions full-span">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  {t("cancel")}
                </button>
                <button type="submit" className="btn btn-primary">
                  {t("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasesPage;
