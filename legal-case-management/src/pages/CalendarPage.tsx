/**
 * Hearing calendar with month, week and day views.
 * Colour coding: today (red), urgent (orange), upcoming (navy), completed (green).
 */

import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCases } from "../context/CasesContext";
import { getTranslation, formatDateIndian } from "../utils/hindiUtils";
import { daysBetween, isPast, todayISO, type LegalCase } from "../data/cases";

type View = "month" | "week" | "day";

const toISO = (date: Date): string => {
  const copy = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return copy.toISOString().slice(0, 10);
};

const monthLabel = (date: Date, language: string): string =>
  date.toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN", {
    month: "long",
    year: "numeric",
  });

const CalendarPage: React.FC = () => {
  const { user, language, isAdmin } = useAuth();
  const { cases } = useCases();
  const t = (key: string) => getTranslation(key, language);

  const [view, setView] = useState<View>("month");
  const [cursor, setCursor] = useState(() => new Date());

  const visibleCases =
    isAdmin || !user ? cases : cases.filter((item) => item.assignedJunior === user.name);

  const today = todayISO();

  const hearingFor = (iso: string): LegalCase[] =>
    visibleCases.filter((item) => item.nextHearingDate === iso);

  const toneFor = (item: LegalCase): string => {
    if (item.caseStatus === "Closed" || item.caseStatus === "Judgment") return "done";
    if (isPast(item.nextHearingDate)) return "done";
    if (item.nextHearingDate === today) return "today";
    const diff = daysBetween(today, item.nextHearingDate);
    if (diff >= 0 && diff <= 3) return "urgent";
    return "upcoming";
  };

  const monthDays = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // Monday first
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i += 1) cells.push(null);
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(new Date(year, month, day));
    }
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  const weekDays = useMemo(() => {
    const start = new Date(cursor);
    const offset = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - offset);
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return day;
    });
  }, [cursor]);

  const shift = (amount: number) => {
    const next = new Date(cursor);
    if (view === "month") next.setMonth(cursor.getMonth() + amount);
    else if (view === "week") next.setDate(cursor.getDate() + amount * 7);
    else next.setDate(cursor.getDate() + amount);
    setCursor(next);
  };

  const rangeLabel =
    view === "month"
      ? monthLabel(cursor, language)
      : view === "week"
        ? `${formatDateIndian(toISO(weekDays[0]))} – ${formatDateIndian(
            toISO(weekDays[6]),
          )}`
        : formatDateIndian(toISO(cursor));

  const dayCell = (date: Date) => {
    const iso = toISO(date);
    const items = hearingFor(iso);
    return (
      <div
        key={iso}
        className={
          iso === today ? "calendar-day is-today" : "calendar-day"
        }
      >
        <span className="calendar-date">{date.getDate()}</span>
        {items.map((item) => (
          <span key={item.id} className={`calendar-chip ${toneFor(item)}`}>
            {item.caseTitle.length > 22
              ? `${item.caseTitle.slice(0, 22)}…`
              : item.caseTitle}
          </span>
        ))}
      </div>
    );
  };

  const dayList = (date: Date) => {
    const iso = toISO(date);
    const items = hearingFor(iso);
    return (
      <section className="panel" key={iso}>
        <h2>
          {date.toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </h2>
        {items.length === 0 ? (
          <p className="empty-state">{t("noHearings")}</p>
        ) : (
          <ul className="entry-list">
            {items.map((item) => (
              <li key={item.id}>
                <span className="entry-title">{item.caseTitle}</span>
                <span className="entry-meta">
                  {item.courtName} · {item.caseNumber} ·{" "}
                  {item.assignedJunior || t("unassigned")}
                </span>
                <span className={`badge ${toneFor(item) === "done" ? "badge-success" : "badge-warn"}`}>
                  {item.caseStatus}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>{t("calendar")}</h1>
          <p className="page-subtitle">{rangeLabel}</p>
        </div>
        <div className="calendar-controls">
          <button className="btn btn-secondary btn-xs" onClick={() => shift(-1)}>
            ‹
          </button>
          <button
            className="btn btn-secondary btn-xs"
            onClick={() => setCursor(new Date())}
          >
            {t("today")}
          </button>
          <button className="btn btn-secondary btn-xs" onClick={() => shift(1)}>
            ›
          </button>
        </div>
      </header>

      <div className="view-switcher">
        {(["month", "week", "day"] as View[]).map((item) => (
          <button
            key={item}
            className={view === item ? "view-btn active" : "view-btn"}
            onClick={() => setView(item)}
          >
            {t(item)}
          </button>
        ))}
      </div>

      <div className="legend">
        <span className="legend-item">
          <i className="dot today" /> {t("today")}
        </span>
        <span className="legend-item">
          <i className="dot urgent" /> {t("urgent")}
        </span>
        <span className="legend-item">
          <i className="dot upcoming" /> {t("upcoming")}
        </span>
        <span className="legend-item">
          <i className="dot done" /> {t("completed")}
        </span>
      </div>

      {view === "month" && (
        <section className="panel calendar-panel">
          <div className="calendar-weekdays">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
          <div className="calendar-grid">
            {monthDays.map((date, index) =>
              date ? dayCell(date) : <div key={`blank-${index}`} className="calendar-day is-blank" />,
            )}
          </div>
        </section>
      )}

      {view === "week" && (
        <div className="calendar-week">{weekDays.map((date) => dayList(date))}</div>
      )}

      {view === "day" && dayList(cursor)}
    </div>
  );
};

export default CalendarPage;
