/**
 * Team – junior advocate and clerk accounts plus case assignment.
 */

import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useCases } from "../context/CasesContext";
import { getTranslation } from "../utils/hindiUtils";
import usersData from "../data/sample-users.json";
import { JUNIOR_NAMES } from "../data/cases";

type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  role: string;
};

const initialMembers: Member[] = Object.values(usersData).map((entry) => ({
  id: entry.id,
  name: entry.name,
  email: entry.email,
  phone: entry.phone,
  username: entry.username,
  role: entry.role,
}));

const TeamPage: React.FC = () => {
  const { language, isAdmin, user } = useAuth();
  const { cases, assignJunior } = useCases();
  const t = (key: string) => getTranslation(key, language);

  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    role: "junior",
  });
  const [feedback, setFeedback] = useState("");

  if (!isAdmin) {
    return (
      <div className="page">
        <p className="empty-state">
          {language === "hi"
            ? "यह पृष्ठ केवल प्रशासक के लिए है।"
            : "This page is available to the administrator only."}
        </p>
      </div>
    );
  }

  const handleCreate = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.username.trim()) return;

    setMembers((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: form.name.trim(),
        email: form.email,
        phone: form.phone,
        username: form.username.trim(),
        role: form.role,
      },
    ]);
    setFeedback(`${t("saved")}: ${form.name.trim()}`);
    setForm({ name: "", email: "", phone: "", username: "", password: "", role: "junior" });
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>{t("team")}</h1>
          <p className="page-subtitle">
            {members.length} {language === "hi" ? "सदस्य" : "members"}
          </p>
        </div>
      </header>

      {feedback && <div className="alert alert-success">{feedback}</div>}

      <div className="two-column">
        <section className="panel">
          <h2>{t("team")}</h2>
          <ul className="entry-list">
            {members.map((member) => (
              <li key={member.id}>
                <span className="entry-title">{member.name}</span>
                <span className="entry-meta">
                  {member.username} · {member.email} · {member.phone}
                </span>
                <span className="badge badge-primary">
                  {member.role === "admin"
                    ? t("admin")
                    : member.role === "junior"
                      ? t("juniorRole")
                      : t("clerkRole")}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h2>{t("createUser")}</h2>
          <form onSubmit={handleCreate} className="stack-form">
            <label>
              {t("name")}
              <input
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </label>
            <label>
              {t("email")}
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </label>
            <label>
              {t("phone")}
              <input
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
              />
            </label>
            <label>
              {t("username")}
              <input
                required
                value={form.username}
                onChange={(event) => setForm({ ...form, username: event.target.value })}
              />
            </label>
            <label>
              {t("password")}
              <input
                type="password"
                minLength={6}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
              />
            </label>
            <label>
              {t("role")}
              <select
                value={form.role}
                onChange={(event) => setForm({ ...form, role: event.target.value })}
              >
                <option value="junior">{t("juniorRole")}</option>
                <option value="clerk">{t("clerkRole")}</option>
              </select>
            </label>
            <button className="btn btn-primary" type="submit">
              {t("createUser")}
            </button>
          </form>
        </section>
      </div>

      <section className="panel">
        <h2>{t("assignCase")}</h2>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("caseId")}</th>
                <th>{t("caseTitle")}</th>
                <th>{t("assignedJunior")}</th>
                <th>{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.caseTitle}</td>
                  <td>{item.assignedJunior || t("unassigned")}</td>
                  <td>
                    <div className="row-actions">
                      <select
                        value={item.assignedJunior ?? ""}
                        onChange={(event) =>
                          assignJunior(item.id, event.target.value || null)
                        }
                      >
                        <option value="">{t("removeCase")}</option>
                        {JUNIOR_NAMES.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="page-subtitle">
        {language === "hi"
          ? `लॉगिन: ${user?.username}`
          : `Signed in as: ${user?.username}`}
      </p>
    </div>
  );
};

export default TeamPage;
