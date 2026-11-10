/**
 * Dashboard – today's cases, upcoming hearings, pending tasks, total active cases.
 */

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCases } from "../context/CasesContext";
import { getTranslation, formatDateIndian } from "../utils/hindiUtils";
import { daysBetween, isUpcomingWithin, todayISO } from "../data/cases";

const Dashboard: React.FC = () => {
  const { user, language, isAdmin, isJunior } = useAuth();
  const { cases } = useCases();
  const t = (key: string) => getTranslation(key, language);

  const visibleCases =
    isAdmin || !user
      ? cases
      : cases.filter((item) => item.assignedJunior === user.name);

  const today = todayISO();

  const todayCases = visibleCases.filter(
    (item) => item.nextHearingDate === today,
  );

  const upcoming = visibleCases
    .filter(
      (item) =>
        daysBetween(today, item.nextHearingDate) > 0 &&
        isUpcomingWithin(item.nextHearingDate, 15),
    )
    .sort((a, b) => a.nextHearingDate.localeCompare(b.nextHearingDate));

  const activeCases = visibleCases.filter((item) => item.caseStatus !== "Closed");

  const allTasks = visibleCases.flatMap((item) =>
    item.tasks.map((task) => ({ ...task, caseId: item.id, caseTitle: item.caseTitle })),
  );
  const pendingTasks = allTasks.filter((task) => task.status !== "Completed");

  const recentDocuments = visibleCases
    .flatMap((item) =>
      item.documents.map((doc) => ({ ...doc, caseTitle: item.caseTitle })),
    )
    .sort((a, b) => b.uploadDate.localeCompare(a.uploadDate))
    .slice(0, 5);

  const stats = [
    { label: t("todayCases"), value: todayCases.length, accent: "#c62828" },
    { label: t("nextHearing"), value: upcoming.length, accent: "#1a237e" },
    { label: t("pendingTasks"), value: pendingTasks.length, accent: "#ef6c00" },
    { label: t("recentDocuments"), value: recentDocuments.length, accent: "#00695c" },
    { label: t("totalCases"), value: activeCases.length, accent: "#d4af37" },
  ];

  const quickActions = [
    { label: t("quickAddCase"), to: "/cases", adminOnly: true },
    { label: t("addHearingDate"), to: "/calendar", adminOnly: false },
    { label: t("uploadDocument"), to: "/documents", adminOnly: false },
    { label: t("addJunior"), to: "/team", adminOnly: true },
  ];

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>{t("dashboard")}</h1>
          <p className="page-subtitle">
            {user?.name} ·{" "}
            {isAdmin
              ? language === "hi" ? "प्रशासक" : "Administrator"
              : isJunior
                ? language === "hi" ? "जूनियर वकील" : "Junior Advocate"
                : language === "hi" ? "क्लर्क" : "Clerk"}
          </p>
        </div>
        <span className="today-pill">
          {language === "hi" ? "आज" : "Today"}: {formatDateIndian(today)}
        </span>
      </header>

      <section className="stat-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <span className="stat-accent" style={{ background: stat.accent }} />
            <span className="stat-label">{stat.label}</span>
            <span className="stat-number">{stat.value}</span>
          </div>
        ))}
      </section>

      <section className="panel">
        <h2>{t("quickActions")}</h2>
        <div className="quick-actions">
          {quickActions
            .filter((action) => isAdmin || !action.adminOnly)
            .map((action) => (
              <Link key={action.to + action.label} className="btn btn-gold" to={action.to}>
                {action.label}
              </Link>
            ))}
        </div>
      </section>

      <div className="two-column">
        <section className="panel">
          <h2>{t("todayCases")}</h2>
          {todayCases.length === 0 ? (
            <p className="empty-state">{t("noHearingsToday")}</p>
          ) : (
            <ul className="entry-list">
              {todayCases.map((item) => (
                <li key={item.id}>
                  <Link to={`/case-detail/${item.id}`} className="entry-title">
                    {item.caseTitle}
                  </Link>
                  <span className="entry-meta">
                    {item.courtName} · {item.judge}
                  </span>
                  <span className="entry-meta">
                    {item.clientName} · {item.caseNumber}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <h2>{t("nextHearing")}</h2>
          {upcoming.length === 0 ? (
            <p className="empty-state">{t("noData")}</p>
          ) : (
            <ul className="entry-list">
              {upcoming.map((item) => (
                <li key={item.id}>
                  <Link to={`/case-detail/${item.id}`} className="entry-title">
                    {item.caseTitle}
                  </Link>
                  <span className="entry-meta">
                    {formatDateIndian(item.nextHearingDate)} · {item.courtName}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <h2>{t("pendingTasks")}</h2>
          {pendingTasks.length === 0 ? (
            <p className="empty-state">{t("noData")}</p>
          ) : (
            <ul className="entry-list">
              {pendingTasks.slice(0, 5).map((task) => (
                <li key={task.caseId + task.id}>
                  <span className="entry-title">{task.title}</span>
                  <span className="entry-meta">
                    {task.caseId} · {task.assignedTo || t("unassigned")} ·{" "}
                    {formatDateIndian(task.dueDate)}
                  </span>
                  <span className="badge badge-warn">{task.priority}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <h2>{t("recentDocuments")}</h2>
          {recentDocuments.length === 0 ? (
            <p className="empty-state">{t("noData")}</p>
          ) : (
            <ul className="entry-list">
              {recentDocuments.map((doc) => (
                <li key={doc.id}>
                  <span className="entry-title">{doc.name}</span>
                  <span className="entry-meta">
                    {doc.category} · {formatDateIndian(doc.uploadDate)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
