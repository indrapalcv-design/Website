/**
 * Login Page for the Legal Case Management System.
 * Secure login form — no case data is shown on this page.
 */

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getTranslation } from "../utils/hindiUtils";

const LoginPage: React.FC = () => {
  const { login, language, setLanguage } = useAuth();
  const t = (key: string) => getTranslation(key, language);

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const success = await login(form.username, form.password);
    if (!success) {
      setError(t("invalidCredentials"));
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <button
        type="button"
        className="auth-language-toggle"
        onClick={() => setLanguage(language === "en" ? "hi" : "en")}
      >
        {language === "hi" ? "English" : "हिंदी"}
      </button>

      <div className="auth-card">
        <div className="auth-emblem" aria-hidden="true">
          ⚖
        </div>
        <div className="auth-header">
          <h2>Adv. Alok Srivastava</h2>
          <p>
            {language === "hi"
              ? "लीगल केस मैनेजमेंट प्रणाली"
              : "Legal Case Management System"}
          </p>
          <span className="auth-location">
            {language === "hi" ? "लखीमपुर (LMP)" : "Lakhimpur (LMP)"}
          </span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">{t("username")}</label>
            <input
              id="username"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t("password")}</label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary full-width"
            disabled={loading}
          >
            {loading ? t("loading") : t("signIn")}
          </button>
        </form>

        <p className="auth-footnote">
          {language === "hi"
            ? "यह प्रणाली केवल अधिकृत उपयोगकर्ताओं के लिए है।"
            : "This system is for authorised users only."}
        </p>
      </div>

      <p className="auth-copyright">
        © Adv. Alok Srivastava | Lakhimpur (LMP)
      </p>
    </div>
  );
};

export default LoginPage;
