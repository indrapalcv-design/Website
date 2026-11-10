/**
 * Authentication Context for the Legal Case Management System.
 * Handles login, logout, role-based access control and language preference.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { getInitialLanguage, LANGUAGE_KEY } from "../utils/hindiUtils";
import usersData from "../data/sample-users.json";

export type UserRole = "admin" | "junior" | "clerk";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  phone?: string;
  barNumber?: string;
  joined?: string;
}

type AuthContextType = {
  user: User | null;
  language: "en" | "hi";
  setLanguage: Dispatch<SetStateAction<"en" | "hi">>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkRole: (role: UserRole) => boolean;
  isAdmin: boolean;
  isJunior: boolean;
  isClerk: boolean;
};

const STORAGE_KEY = "loggedInUser";

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
};

type StoredUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  password?: string;
  role: string;
  phone?: string;
  barNumber?: string;
  joined?: string;
};

const demoUsers = Object.values(usersData) as StoredUser[];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<"en" | "hi">(getInitialLanguage());

  // Restore session
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved) as User);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Persist language choice
  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language);
    document.documentElement.lang = language === "hi" ? "hi" : "en";
  }, [language]);

  const login = async (username: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 300)); // simulate API call

    const identifier = username.trim().toLowerCase();
    const match = demoUsers.find(
      (candidate) =>
        (candidate.username.toLowerCase() === identifier ||
          candidate.email.toLowerCase() === identifier) &&
        candidate.password === password,
    );

    if (!match) return false;

    const authenticated: User = {
      id: match.id,
      name: match.name,
      email: match.email,
      username: match.username,
      role: match.role as UserRole,
      phone: match.phone,
      barNumber: match.barNumber,
      joined: match.joined,
    };

    setUser(authenticated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticated));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const checkRole = (role: UserRole): boolean => user?.role === role;

  const value: AuthContextType = {
    user,
    language,
    setLanguage,
    login,
    logout,
    checkRole,
    isAdmin: checkRole("admin"),
    isJunior: checkRole("junior"),
    isClerk: checkRole("clerk"),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
