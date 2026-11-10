/**
 * Navigation Menu for the Legal Case Management System.
 * Shows links according to the signed-in user's role.
 */
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTranslation } from "../utils/hindiUtils";

type NavItem = { key: string; href: string };

const ADMIN_ITEMS: NavItem[] = [
  { key: "dashboard", href: "/dashboard" },
  { key: "cases", href: "/cases" },
  { key: "calendar", href: "/calendar" },
  { key: "documents", href: "/documents" },
  { key: "tasks", href: "/tasks" },
  { key: "clients", href: "/clients" },
  { key: "team", href: "/team" },
  { key: "reports", href: "/reports" },
  { key: "settings", href: "/settings" },
];

const JUNIOR_ITEMS: NavItem[] = [
  { key: "dashboard", href: "/dashboard" },
  { key: "cases", href: "/cases" },
  { key: "calendar", href: "/calendar" },
  { key: "documents", href: "/documents" },
  { key: "tasks", href: "/tasks" },
  { key: "clients", href: "/clients" },
  { key: "reports", href: "/reports" },
];

const CLERK_ITEMS: NavItem[] = [
  { key: "dashboard", href: "/dashboard" },
  { key: "cases", href: "/cases" },
  { key: "documents", href: "/documents" },
  { key: "tasks", href: "/tasks" },
];

const NavMenu: React.FC = () => {
  const { language, isAdmin, isJunior } = useAuth();
  const t = (key: string) => getTranslation(key, language);

  const navItems = isAdmin
    ? ADMIN_ITEMS
    : isJunior
      ? JUNIOR_ITEMS
      : CLERK_ITEMS;

  return (
    <nav className="nav-menu">
      <ul className="nav-links">
        {navItems.map((item) => (
          <li key={item.href}>
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {t(item.key)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavMenu;
