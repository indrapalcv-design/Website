/**
 * Main Application Component for Adv. Alok Srivastava – Legal Case Management.
 * Provides the app shell, header, navigation and protected routing.
 */

import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import NavMenu from "./components/NavMenu";
import LanguageToggle from "./components/LanguageToggle";
import "./assets/css/style.css";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/Dashboard";
import CasesPage from "./pages/CasesPage";
import CaseDetailPage from "./pages/CaseDetail";
import CalendarPage from "./pages/CalendarPage";
import DocumentsPage from "./pages/DocumentsPage";
import TasksPage from "./pages/TasksPage";
import ClientsPage from "./pages/ClientsPage";
import TeamPage from "./pages/TeamPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";

const App: React.FC = () => {
  const { user, language, logout } = useAuth();

  // Unauthenticated users only see the login page — no case data is exposed.
  if (!user) {
    return <LoginPage />;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          <LanguageToggle />
        </div>
        <div className="header-center">
          <h1>
            {language === "hi"
              ? "एडवोकेट आलोक श्रीवास्तव"
              : "Adv. Alok Srivastava"}
          </h1>
          <p>{language === "hi" ? "लखीमपुर (LMP)" : "Lakhimpur (LMP)"}</p>
        </div>
        <div className="header-right">
          <span className="header-user">{user.name}</span>
          <button className="btn-logout" onClick={handleLogout}>
            {language === "hi" ? "लॉगआउट" : "Logout"}
          </button>
        </div>
      </header>

      <NavMenu />

      <main className="app-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/case-detail/:id" element={<CaseDetailPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      <footer className="app-footer">
        © Adv. Alok Srivastava | Lakhimpur (LMP)
      </footer>
    </>
  );
};

export default App;
