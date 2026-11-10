/**
 * Hindi / English language utilities for the Legal Case Management system.
 */

export const LANGUAGE_KEY = "app_language";

export type Language = "en" | "hi";

export const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem(LANGUAGE_KEY);
  if (saved === "en" || saved === "hi") return saved;
  const browser = navigator.language || "";
  return browser.toLowerCase().startsWith("hi") ? "hi" : "en";
};

const en: Record<string, string> = {
  // Brand / login
  websiteName: "Legal Case Management System",
  login: "Login",
  signIn: "Sign In",
  username: "Username or Email",
  password: "Password",
  rememberMe: "Remember me",
  forgotPassword: "Forgot password",
  invalidCredentials: "Invalid username or password",
  toggleLanguage: "Switch Hindi / English",

  // Navigation
  dashboard: "Dashboard",
  cases: "Cases",
  calendar: "Calendar",
  documents: "Documents",
  tasks: "Tasks",
  clients: "Clients",
  team: "Team",
  reports: "Reports",
  settings: "Settings",
  logout: "Logout",

  // Dashboard
  todayCases: "Today's Cases",
  nextHearing: "Next Hearing Dates",
  pendingTasks: "Pending Tasks",
  recentDocuments: "Recent Documents",
  totalCases: "Total Active Cases",
  quickActions: "Quick Actions",
  quickAddCase: "Add New Case",
  addHearingDate: "Add Hearing Date",
  uploadDocument: "Upload Document",
  addJunior: "Add Junior Advocate",
  noHearingsToday: "No hearings scheduled for today",

  // Cases
  addCase: "Add New Case",
  newCase: "New Case",
  editCase: "Edit Case",
  searchCases: "Search by title, client or case number",
  filterByCourt: "Court",
  filterByStatus: "Status",
  allCourts: "All courts",
  allStatuses: "All statuses",
  allJuniors: "All juniors",
  allCategories: "All categories",
  caseId: "Case ID",
  caseNumber: "Case Number",
  caseTitle: "Case Title",
  clientName: "Client Name",
  clientPhone: "Phone",
  clientEmail: "Email",
  clientAddress: "Address",
  oppositeParty: "Opposite Party",
  courtName: "Court",
  bench: "Bench",
  judge: "Judge",
  caseType: "Case Type",
  caseStatus: "Case Status",
  filingDate: "Filing Date",
  nextHearingDate: "Next Hearing",
  caseSummary: "Case Summary",
  importantNotes: "Important Notes",
  assignedJunior: "Assigned Junior",
  unassigned: "Unassigned",
  confirmDelete: "Delete this case permanently?",
  actions: "Actions",
  caseLabel: "Case",

  // Case detail tabs
  overview: "Overview",
  hearings: "Hearings",
  documentsAttached: "Documents Attached",
  hearingHistory: "Hearing History",
  notes: "Notes",
  payments: "Payments",
  addNote: "Add Note",
  addPayment: "Add Payment",
  noteText: "Write a note",
  addHearingTitle: "Record Hearing",
  back: "Back to cases",

  // Fields
  amount: "Amount",
  description: "Description",
  status: "Status",
  date: "Date",
  outcome: "Outcome",
  category: "Category",
  uploadDate: "Upload date",
  uploadedBy: "Uploaded by",
  selectCase: "Select case",
  fileName: "File name",
  priority: "Priority",
  dueDate: "Due date",
  assignedTo: "Assigned to",
  taskTitle: "Task Title",
  taskDescription: "Description",
  addTask: "Add Task",
  allTasks: "All tasks",
  fees: "Fees",

  // Calendar
  today: "Today",
  urgent: "Urgent",
  upcoming: "Upcoming",
  completed: "Completed",
  month: "Month",
  week: "Week",
  day: "Day",
  noHearings: "No hearings scheduled",

  // Team
  createUser: "Create User",
  name: "Name",
  email: "Email",
  phone: "Phone",
  role: "Role",
  admin: "Administrator",
  juniorRole: "Junior Advocate",
  clerkRole: "Clerk",
  assignCase: "Assign Case",
  removeCase: "Remove assignment",
  assignedCases: "Assigned cases",

  // Reports
  totalActiveCases: "Total Active Cases",
  casesByCourt: "Cases by Court",
  todayHearings: "Today's Hearings",
  upcomingHearings: "Upcoming Hearings",
  pendingTasksReport: "Pending Tasks",
  juniorWiseCases: "Cases per Junior Advocate",
  casesByType: "Cases by Type",
  casesByStatus: "Cases by Status",

  // Settings
  profile: "Profile",
  security: "Security",
  languageLabel: "Language",
  sessionTimeout: "Session timeout (minutes)",
  changePassword: "Change Password",
  backup: "Backup",
  loginHistory: "Login history",

  // General
  save: "Save",
  saved: "Saved",
  cancel: "Cancel",
  delete: "Delete",
  edit: "Edit",
  view: "View",
  search: "Search",
  noData: "No data available",
  loading: "Loading...",
};

const hi: Record<string, string> = {
  // Brand / login
  websiteName: "लीगल केस मैनेजमेंट प्रणाली",
  login: "लॉगिन",
  signIn: "लॉगिन करें",
  username: "उपयोगकर्ता नाम या ईमेल",
  password: "पासवर्ड",
  rememberMe: "याद रखें",
  forgotPassword: "पासवर्ड भूल गए",
  invalidCredentials: "उपयोगकर्ता नाम या पासवर्ड गलत है",
  toggleLanguage: "हिंदी / अंग्रेज़ी बदलें",

  // Navigation
  dashboard: "डैशबोर्ड",
  cases: "केस",
  calendar: "कैलेंडर",
  documents: "दस्तावेज़",
  tasks: "कार्य",
  clients: "ग्राहक",
  team: "टीम",
  reports: "रिपोर्ट",
  settings: "सेटिंग्स",
  logout: "लॉगआउट",

  // Dashboard
  todayCases: "आज के केस",
  nextHearing: "अगली सुनवाई की तारीखें",
  pendingTasks: "लंबित कार्य",
  recentDocuments: "हाल के दस्तावेज़",
  totalCases: "कुल सक्रिय केस",
  quickActions: "तत्काल कार्य",
  quickAddCase: "नया केस जोड़ें",
  addHearingDate: "सुनवाई की तारीख जोड़ें",
  uploadDocument: "दस्तावेज़ अपलोड करें",
  addJunior: "जूनियर वकील जोड़ें",
  noHearingsToday: "आज कोई सुनवाई नहीं है",

  // Cases
  addCase: "नया केस जोड़ें",
  newCase: "नया केस",
  editCase: "केस संपादित करें",
  searchCases: "शीर्षक, ग्राहक या केस नंबर से खोजें",
  filterByCourt: "कोर्ट",
  filterByStatus: "स्थिति",
  allCourts: "सभी कोर्ट",
  allStatuses: "सभी स्थितियाँ",
  allJuniors: "सभी जूनियर",
  allCategories: "सभी श्रेणियाँ",
  caseId: "केस आईडी",
  caseNumber: "केस नंबर",
  caseTitle: "केस शीर्षक",
  clientName: "ग्राहक का नाम",
  clientPhone: "फोन",
  clientEmail: "ईमेल",
  clientAddress: "पता",
  oppositeParty: "विपक्षी पक्ष",
  courtName: "कोर्ट",
  bench: "बेंच",
  judge: "जज",
  caseType: "केस प्रकार",
  caseStatus: "केस की स्थिति",
  filingDate: "फाइलिंग तिथि",
  nextHearingDate: "अगली सुनवाई",
  caseSummary: "केस सारांश",
  importantNotes: "महत्त्वपूर्ण नोट्स",
  assignedJunior: "नियुक्त जूनियर",
  unassigned: "अनिर्धारित",
  confirmDelete: "क्या यह केस स्थायी रूप से हटाएं?",
  actions: "कार्य",
  caseLabel: "केस",

  // Case detail tabs
  overview: "सारांश",
  hearings: "सुनवाइयाँ",
  documentsAttached: "संलग्न दस्तावेज़",
  hearingHistory: "सुनवाई इतिहास",
  notes: "नोट्स",
  payments: "भुगतान",
  addNote: "नोट जोड़ें",
  addPayment: "भुगतान जोड़ें",
  noteText: "नोट लिखें",
  addHearingTitle: "सुनवाई दर्ज करें",
  back: "केस सूची पर वापस",

  // Fields
  amount: "राशि",
  description: "विवरण",
  status: "स्थिति",
  date: "तारीख",
  outcome: "परिणाम",
  category: "श्रेणी",
  uploadDate: "अपलोड तारीख",
  uploadedBy: "अपलोड करने वाला",
  selectCase: "केस चुनें",
  fileName: "फ़ाइल नाम",
  priority: "प्राथमिकता",
  dueDate: "नियत तारीख",
  assignedTo: "सौंपा गया",
  taskTitle: "कार्य शीर्षक",
  taskDescription: "विवरण",
  addTask: "कार्य जोड़ें",
  allTasks: "सभी कार्य",
  fees: "शुल्क",

  // Calendar
  today: "आज",
  urgent: "आपातकालीन",
  upcoming: "आने वाला",
  completed: "पूर्ण",
  month: "माह",
  week: "सप्ताह",
  day: "दिन",
  noHearings: "कोई सुनवाई निर्धारित नहीं",

  // Team
  createUser: "उपयोगकर्ता बनाएं",
  name: "नाम",
  email: "ईमेल",
  phone: "फोन",
  role: "भूमिका",
  admin: "प्रशासक",
  juniorRole: "जूनियर वकील",
  clerkRole: "क्लर्क",
  assignCase: "केस आवंटित करें",
  removeCase: "आवंटन हटाएं",
  assignedCases: "सौंपे गए केस",

  // Reports
  totalActiveCases: "कुल सक्रिय केस",
  casesByCourt: "कोर्ट के अनुसार केस",
  todayHearings: "आज की सुनवाई",
  upcomingHearings: "आने वाली सुनवाई",
  pendingTasksReport: "लंबित कार्य",
  juniorWiseCases: "जूनियर वकील के अनुसार केस",
  casesByType: "प्रकार के अनुसार केस",
  casesByStatus: "स्थिति के अनुसार केस",

  // Settings
  profile: "प्रोफ़ाइल",
  security: "सुरक्षा",
  languageLabel: "भाषा",
  sessionTimeout: "सत्र समय-सीमा (मिनट)",
  changePassword: "पासवर्ड बदलें",
  backup: "बैकअप",
  loginHistory: "लॉगिन इतिहास",

  // General
  save: "सहेजें",
  saved: "सहेजा गया",
  cancel: "रद्द करें",
  delete: "हटाएं",
  edit: "संपादित करें",
  view: "देखें",
  search: "खोजें",
  noData: "कोई जानकारी उपलब्ध नहीं",
  loading: "लोड हो रहा है...",
};

export const legalTranslations: Record<Language, Record<string, string>> = {
  en,
  hi,
};

export const getTranslation = (key: string, lang: Language): string =>
  legalTranslations[lang][key] ?? legalTranslations.en[key] ?? key;

/** Format an ISO date as dd/mm/yyyy. */
export const formatDateIndian = (dateStr: string): string => {
  if (!dateStr) return "—";
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
