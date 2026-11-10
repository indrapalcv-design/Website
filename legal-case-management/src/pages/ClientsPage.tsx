/**
 * Clients – aggregated client list with contact details and linked cases.
 */

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCases } from "../context/CasesContext";
import { getTranslation } from "../utils/hindiUtils";

const ClientsPage: React.FC = () => {
  const { user, language, isAdmin } = useAuth();
  const { cases } = useCases();
  const t = (key: string) => getTranslation(key, language);

  const [search, setSearch] = useState("");

  const visibleCases =
    isAdmin || !user ? cases : cases.filter((item) => item.assignedJunior === user.name);

  const clients = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        phone: string;
        email: string;
        address: string;
        cases: { id: string; title: string }[];
      }
    >();

    visibleCases.forEach((item) => {
      const existing = map.get(item.clientName);
      if (existing) {
        existing.cases.push({ id: item.id, title: item.caseTitle });
      } else {
        map.set(item.clientName, {
          name: item.clientName,
          phone: item.clientPhone,
          email: item.clientEmail,
          address: item.clientAddress,
          cases: [{ id: item.id, title: item.caseTitle }],
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [visibleCases]);

  const filtered = clients.filter((client) => {
    const term = search.trim().toLowerCase();
    return (
      !term ||
      client.name.toLowerCase().includes(term) ||
      client.phone.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term)
    );
  });

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>{t("clients")}</h1>
          <p className="page-subtitle">
            {filtered.length} {language === "hi" ? "ग्राहक" : "clients"}
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
      </section>

      {filtered.length === 0 ? (
        <p className="empty-state">{t("noData")}</p>
      ) : (
        <div className="card-grid">
          {filtered.map((client) => (
            <section className="panel" key={client.name}>
              <h2>{client.name}</h2>
              <dl className="detail-list compact">
                <div>
                  <dt>{t("clientPhone")}</dt>
                  <dd>{client.phone}</dd>
                </div>
                <div>
                  <dt>{t("clientEmail")}</dt>
                  <dd>{client.email}</dd>
                </div>
                <div>
                  <dt>{t("clientAddress")}</dt>
                  <dd>{client.address}</dd>
                </div>
              </dl>
              <h3>{t("linkedCases")} ({client.cases.length})</h3>
              <ul className="entry-list">
                {client.cases.map((item) => (
                  <li key={item.id}>
                    <Link className="table-link" to={`/case-detail/${item.id}`}>
                      {item.id} · {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
