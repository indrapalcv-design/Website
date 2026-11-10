# Adv. Alok Srivastava – Legal Case Management, Lakhimpur (LMP)

A private, bilingual (हिंदी / English) legal case management web app for a district-court practice in
Lakhimpur, Uttar Pradesh. Built with React, TypeScript and Vite.

## Features

- **Role-based access** — Administrator (full access), Junior Advocate (assigned cases only), Clerk (read + document upload).
- **Dashboard** — today's cases, upcoming hearing dates, pending tasks, recent documents, active case count, quick actions.
- **Case management** — create, edit and delete cases, with tabs for Overview, Hearings, Documents, Tasks, Notes and Payments.
- **Calendar** — month / week / day views with colour coding for today, urgent, upcoming and completed hearings.
- **Documents** — categorised as Petition, Affidavit, Evidence, Court Order, Judgment, Vakalatnama or Other.
- **Tasks** — assign to a team member with priority and Pending / In Progress / Completed status.
- **Team, Clients, Reports, Settings** — account creation, case assignment, client directory and case statistics.
- **Bilingual UI** — one-click toggle between Hindi and English across every screen.
- **Private by default** — no case data on the login screen and `noindex, nofollow` meta tags so the site is never indexed.

## Getting started

```bash
npm install
npm run dev      # development server
npm run build    # production build
npm run preview  # preview the production build
```

## Demo accounts

| Role | Username | Password |
| --- | --- | --- |
| Administrator | `alok-srivastava` | `admin123` |
| Junior Advocate | `rajesh-kumar` | `junior123` |
| Junior Advocate | `priya-sharma` | `junior456` |
| Clerk | `kailash-clerk` | `clerk123` |

Credentials and sample cases live in `src/data/sample-users.json` and `src/data/sample-cases.json`.

## Project structure

```
src/
  assets/css/style.css    navy-and-gold theme, responsive layout
  components/             nav menu, language toggle, modal and card helpers
  context/                AuthContext (login, roles, language), CasesContext (case store)
  data/                   types, demo users and demo cases
  pages/                  Dashboard, Cases, CaseDetail, Calendar, Documents, Tasks,
                          Clients, Team, Reports, Settings, Login
  utils/hindiUtils.ts     translations and Indian date formatting
```

## Note on data

Case data is held in memory for the demo, so edits reset on reload. Persisting cases (and letting
newly created team members sign in) requires a backend and database.
