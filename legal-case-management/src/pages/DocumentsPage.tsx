/**
 * Documents – every uploaded document across cases, with category filter and upload.
 */

import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCases } from "../context/CasesContext";
import { getTranslation, formatDateIndian } from "../utils/hindiUtils";
import { DOCUMENT_CATEGORIES } from "../data/cases";

const DocumentsPage: React.FC = () => {
  const { user, language, isAdmin } = useAuth();
  const { cases, addDocument } = useCases();
  const t = (key: string) => getTranslation(key, language);

  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [caseId, setCaseId] = useState("");
  const [name, setName] = useState("");
  const [docCategory, setDocCategory] = useState("Petition");

  const visibleCases =
    isAdmin || !user ? cases : cases.filter((item) => item.assignedJunior === user.name);

  const documents = useMemo(
    () =>
      visibleCases
        .flatMap((item) =>
          item.documents.map((doc) => ({ ...doc, caseId: item.id, caseTitle: item.caseTitle })),
        )
        .filter((doc) => !category || doc.category === category)
        .filter((doc) => {
          const term = search.trim().toLowerCase();
          return (
            !term ||
            doc.name.toLowerCase().includes(term) ||
            doc.caseTitle.toLowerCase().includes(term)
          );
        })
        .sort((a, b) => b.uploadDate.localeCompare(a.uploadDate)),
    [visibleCases, category, search],
  );

  const handleUpload = (event: FormEvent) => {
    event.preventDefault();
    const target = caseId || visibleCases[0]?.id;
    if (!target || !name.trim()) return;

    addDocument(target, {
      id: `DOC-${Date.now()}`,
      name: name.trim(),
      category: docCategory,
      uploadedBy: user?.name ?? "",
      uploadDate: new Date().toISOString().slice(0, 10),
      filePath: `/uploads/${name.trim()}`,
    });

    setName("");
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>{t("documents")}</h1>
          <p className="page-subtitle">
            {documents.length} {language === "hi" ? "दस्तावेज" : "documents"}
          </p>
        </div>
      </header>

      <section className="filter-bar">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("search")}
          aria-label={t("search")}
        />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">{t("allCategories")}</option>
          {DOCUMENT_CATEGORIES.map((name_) => (
            <option key={name_} value={name_}>
              {name_}
            </option>
          ))}
        </select>
      </section>

      <div className="two-column">
        <section className="panel table-panel">
          <h2>{t("documents")}</h2>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("fileName")}</th>
                  <th>{t("category")}</th>
                  <th>{t("caseLabel")}</th>
                  <th>{t("uploadDate")}</th>
                  <th>{t("uploadedBy")}</th>
                </tr>
              </thead>
              <tbody>
                {documents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="empty-cell">
                      {t("noData")}
                    </td>
                  </tr>
                )}
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>📄 {doc.name}</td>
                    <td>
                      <span className="badge badge-info">{doc.category}</span>
                    </td>
                    <td>
                      <Link className="table-link" to={`/case-detail/${doc.caseId}`}>
                        {doc.caseId}
                      </Link>
                    </td>
                    <td>{formatDateIndian(doc.uploadDate)}</td>
                    <td>{doc.uploadedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Clerk cannot create cases but may upload documents. */}
        <section className="panel">
          <h2>{t("uploadDocument")}</h2>
          <form onSubmit={handleUpload} className="stack-form">
            <label>
              {t("selectCase")}
              <select value={caseId} onChange={(event) => setCaseId(event.target.value)}>
                {visibleCases.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.id} · {item.caseTitle}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t("fileName")}
              <input
                required
                placeholder="e.g. Vakalatnama.pdf"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <label>
              {t("category")}
              <select
                value={docCategory}
                onChange={(event) => setDocCategory(event.target.value)}
              >
                {DOCUMENT_CATEGORIES.map((name_) => (
                  <option key={name_} value={name_}>
                    {name_}
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
    </div>
  );
};

export default DocumentsPage;
