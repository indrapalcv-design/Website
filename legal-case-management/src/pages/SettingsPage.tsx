/**
 * Settings – profile, language, security and backup information.
 */

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCases } from "../context/CasesContext";
import { getTranslation } from "../utils/hindiUtils";

const SettingsPage: React.FC = () => {
  const { user, language, setLanguage, isAdmin } = useAuth();
  const { cases } = useCases();
  const t = (key: string) => getTranslation(key, language);

  const [timeout, setTimeoutValue] = useState("30");
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>{t("settings")}</h1>
          <p className="page-subtitle">{user?.username}</p>
        </div>
      </header>

      {saved && <div className="alert alert-success">{t("saved")}</div>}

      <div className="two-column">
        <section className="panel">
          <h2>{t("profile")}</h2>
          <dl className="detail-list">
            <div>
              <dt>{t("name")}</dt>
              <dd>{user?.name}</dd>
            </div>
            <div>
              <dt>{t("email")}</dt>
              <dd>{user?.email}</dd>
            </div>
            <div>
              <dt>{t("phone")}</dt>
              <dd>{user?.phone || "—"}</dd>
            </div>
            <div>
              <dt>{t("role")}</dt>
              <dd>
                {isAdmin ? t("admin") : user?.role === "junior" ? t("juniorRole") : t("clerkRole")}
              </dd>
            </div>
            <div>
              <dt>{language === "hi" ? "बार काउंसिल" : "Bar Council"}</dt>
              <dd>{user?.barNumber || "—"}</dd>
            </div>
          </dl>
        </section>

        <section className="panel">
          <h2>{t("languageLabel")}</h2>
          <div className="view-switcher">
            <button
              className={language === "en" ? "view-btn active" : "view-btn"}
              onClick={() => setLanguage("en")}
            >
              English
            </button>
            <button
              className={language === "hi" ? "view-btn active" : "view-btn"}
              onClick={() => setLanguage("hi")}
            >
              हिंदी
            </button>
          </div>

          <h2>{t("security")}</h2>
          <form
            className="stack-form"
            onSubmit={(event) => {
              event.preventDefault();
              save();
            }}
          >
            <label>
              {t("sessionTimeout")}
              <input
                type="number"
                min="5"
                max="120"
                value={timeout}
                onChange={(event) => setTimeoutValue(event.target.value)}
              />
            </label>
            <label>
              {t("changePassword")}
              <input type="password" placeholder="••••••••" minLength={6} />
            </label>
            <button className="btn btn-primary" type="submit">
              {t("save")}
            </button>
          </form>
        </section>

        <section className="panel">
          <h2>{t("backup")}</h2>
          <p className="page-subtitle">
            {language === "hi"
              ? `${cases.length} केस का डेटा इस सत्र में सुरक्षित है।`
              : `${cases.length} cases are held in this session.`}
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => {
              const payload = JSON.stringify(cases, null, 2);
              const blob = new Blob([payload], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `cases-backup-${new Date().toISOString().slice(0, 10)}.json`;
              link.click();
              URL.revokeObjectURL(url);
            }}
          >
            {language === "hi" ? "डेटा डाउनलोड करें" : "Download data backup"}
          </button>
        </section>

        <section className="panel">
          <h2>{t("security")}</h2>
          <ul className="entry-list">
            <li>
              <span className="entry-title">
                {language === "hi" ? "भूमिका आधारित पहुँच" : "Role-based access"}
              </span>
              <span className="entry-meta">
                {language === "hi"
                  ? "प्रशासक, जूनियर वकील और क्लर्क के लिए अलग-अलग अधिकार।"
                  : "Separate permissions for administrator, junior advocate and clerk."}
              </span>
            </li>
            <li>
              <span className="entry-title">
                {language === "hi" ? "सत्र समाप्ति" : "Session timeout"}
              </span>
              <span className="entry-meta">
                {timeout} {language === "hi" ? "मिनट" : "minutes"}
              </span>
            </li>
            <li>
              <span className="entry-title">
                {language === "hi" ? "सार्वजनिक खोज अवरुद्ध" : "Search engines blocked"}
              </span>
              <span className="entry-meta">
                {language === "hi"
                  ? "यह प्रणाली सार्वजनिक रूप से अनुक्रमित नहीं है।"
                  : "This system is not publicly indexed."}
              </span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
