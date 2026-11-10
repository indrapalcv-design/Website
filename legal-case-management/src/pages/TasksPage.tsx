/**
 * Tasks – assign work to juniors and track Pending / In Progress / Completed.
 */

import { useMemo, useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useCases } from "../context/CasesContext";
import { getTranslation, formatDateIndian } from "../utils/hindiUtils";
import { JUNIOR_NAMES, PRIORITIES, TASK_STATUSES } from "../data/cases";

const statusBadge = (status: string): string => {
  if (status === "Completed") return "badge badge-success";
  if (status === "In Progress") return "badge badge-info";
  return "badge badge-warn";
};

const TasksPage: React.FC = () => {
  const { user, language, isAdmin } = useAuth();
  const { cases, addTask, updateTaskStatus } = useCases();
  const t = (key: string) => getTranslation(key, language);

  const [filter, setFilter] = useState("");
  const [caseId, setCaseId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");

  const visibleCases =
    isAdmin || !user ? cases : cases.filter((item) => item.assignedJunior === user.name);

  const tasks = useMemo(
    () =>
      visibleCases
        .flatMap((item) =>
          item.tasks.map((task) => ({
            ...task,
            caseId: item.id,
            caseTitle: item.caseTitle,
          })),
        )
        .filter((task) => !filter || task.status === filter)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [visibleCases, filter],
  );

  const handleCreate = (event: FormEvent) => {
    event.preventDefault();
    const target = caseId || visibleCases[0]?.id;
    if (!target || !title.trim()) return;

    addTask(target, {
      id: `TASK-${Date.now()}`,
      title: title.trim(),
      description,
      assignedTo: assignedTo || null,
      dueDate: dueDate || new Date().toISOString().slice(0, 10),
      priority,
      status: "Pending",
    });

    setTitle("");
    setDescription("");
    setAssignedTo("");
    setDueDate("");
    setPriority("Medium");
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>{t("tasks")}</h1>
          <p className="page-subtitle">
            {tasks.length} {language === "hi" ? "कार्य" : "tasks"}
          </p>
        </div>
      </header>

      <section className="filter-bar">
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="">{t("allStatuses")}</option>
          {TASK_STATUSES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </section>

      <div className="two-column">
        <section className="panel">
          <h2>{t("allTasks")}</h2>
          {tasks.length === 0 ? (
            <p className="empty-state">{t("noData")}</p>
          ) : (
            <ul className="entry-list">
              {tasks.map((task) => (
                <li key={task.caseId + task.id}>
                  <span className="entry-title">{task.title}</span>
                  <span className="entry-meta">
                    {task.caseId} · {task.assignedTo || t("unassigned")} ·{" "}
                    {formatDateIndian(task.dueDate)} · {task.priority}
                  </span>
                  <div className="task-controls">
                    <span className={statusBadge(task.status)}>{task.status}</span>
                    <select
                      value={task.status}
                      onChange={(event) =>
                        updateTaskStatus(task.caseId, task.id, event.target.value)
                      }
                    >
                      {TASK_STATUSES.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {isAdmin && (
          <section className="panel">
            <h2>{t("addTask")}</h2>
            <form onSubmit={handleCreate} className="stack-form">
              <label>
                {t("caseLabel")}
                <select value={caseId} onChange={(event) => setCaseId(event.target.value)}>
                  {visibleCases.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.id} · {item.caseTitle}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t("taskTitle")}
                <input
                  required
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </label>
              <label>
                {t("taskDescription")}
                <textarea
                  rows={2}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </label>
              <label>
                {t("assignedTo")}
                <select
                  value={assignedTo}
                  onChange={(event) => setAssignedTo(event.target.value)}
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
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                />
              </label>
              <label>
                {t("priority")}
                <select
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
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
    </div>
  );
};

export default TasksPage;
