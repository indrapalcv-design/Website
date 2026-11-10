/**
 * Reports – case distribution and workload summaries.
 */

import { useAuth } from "../context/AuthContext";
import { useCases } from "../context/CasesContext";
import { getTranslation, formatDateIndian } from "../utils/hindiUtils";
import { daysBetween, isUpcomingWithin, todayISO } from "../data/cases";

type Tally = { label: string; count: number };

const tally = (values: string[]): Tally[] => {
  const map = new Map<string, number>();
  values.forEach((value) => map.set(value, (map.get(value) ?? 0) + 1));
  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
};

const ReportsPage: React.FC = () => {
  const { user, language, isAdmin } = useAuth();
  const { cases } = useCases();
  const t = (key: string) => getTranslation(key, language);

  const visible =
    isAdmin || !user ? cases : cases.filter((item) => item.assignedJunior === user.name);

  const today = todayISO();
  const active = visible.filter((item) => item.caseStatus !== "Closed");
  const todayHearings = visible.filter((item) => item.nextHearingDate === today);
  const upcoming = visible.filter(
    (item) =>
      daysBetween(today, item.nextHearingDate) > 0 &&
      isUpcomingWithin(item.nextHearingDate, 7),
  );
  const allTasks = visible.flatMap((item) => item.tasks);
  const pendingTasks = allTasks.filter((task) => task.status !== "Completed");

  const byCourt = tally(visible.map((item) => item.courtName));
  const byType = tally(visible.map((item) => item.caseType));
  const byStatus = tally(visible.map((item) => item.caseStatus));
  const byJunior = tally(
    visible.map((item) => item.assignedJunior ?? t("unassigned")),
  );

  const maxOf = (rows: Tally[]): number =>
    rows.reduce((max, row) => Math.max(max, row.count), 1);

  const bars = (rows: Tally[]) => {
    const max = maxOf(rows);
    return (
      <ul className="bar-list">
        {rows.map((row) => (
          <li key={row.label}>
            <span className="bar-label">{row.label}</span>
            <span className="bar-track">
              <span
                className="bar-fill"
                style={{ width: `${(row.count / max) * 100}%` }}
              />
            </span>
            <span className="bar-value">{row.count}</span>
          </li>
        ))}
      </ul>
    );
  };

  const summary = [
    { label: t("totalActiveCases"), value: active.length },
    { label: t("todayHearings"), value: todayHearings.length },
    { label: t("upcomingHearings"), value: upcoming.length },
    { label: t("pendingTasksReport"), value: pendingTasks.length },
  ];

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>{t("reports")}</h1>
          <p className="page-subtitle">{formatDateIndian(today)}</p>
        </div>
      </header>

      <section className="stat-grid">
        {summary.map((item) => (
          <div className="stat-card" key={item.label}>
            <span className="stat-accent" style={{ background: "#d4af37" }} />
            <span className="stat-label">{item.label}</span>
            <span className="stat-number">{item.value}</span>
          </div>
        ))}
      </section>

      <div className="two-column">
        <section className="panel">
          <h2>{t("casesByCourt")}</h2>
          {bars(byCourt)}
        </section>
        <section className="panel">
          <h2>{t("casesByType")}</h2>
          {bars(byType)}
        </section>
        <section className="panel">
          <h2>{t("casesByStatus")}</h2>
          {bars(byStatus)}
        </section>
        {isAdmin && (
          <section className="panel">
            <h2>{t("juniorWiseCases")}</h2>
            {bars(byJunior)}
          </section>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
