# MECHANEXUS — MITE Mechatronics Club Management Platform

## 1. Project Overview & Vision
MECHANEXUS is the comprehensive, production-grade club management platform custom-built for the Mechatronics Club of Mangalore Institute of Technology and Engineering (MITE). The platform replaces disparate spreadsheets, manual WhatsApp-based task distribution, and fragmented club records with a single, modern, reactive web application.

## 2. Target Outcomes
- **Zero Spreadsheet Dependency**: Complete centralization of student directories, teams, projects, inventory/BOM requirements, and records.
- **Smart Automated Task Distribution**: Automated parsing (OCR for images, parsing for PDF/Excel) of contact/task lists with fair, workload-aware round-robin distribution to students, real-time status tracking (5 statuses), and coordinator monitoring.
- **Strict Role-Based Access Control**: Granular permissions across 4 dedicated roles: `Club Admin`, `Coordinator`, `Team Leader`, and `Student`.
- **Public Community Portal**: Engaging public club feed with project showcases, announcements, member directory, and a full "Join MECHANEXUS" recruitment pipeline with admin review and approval.
- **Audited Project & Activity Lifecycles**: Comprehensive edit history, budget tracking, component tracking, and immutable activity logs.
- **Modern Mechatronics Aesthetics**: A sleek, dark-slate mechatronics engineering design system with responsive layouts, fluid interactions, and zero clutter.

## 3. Technology Stack & Architecture
- **Frontend**: React 18+ with Vite, Tailwind CSS, Lucide React icons, React Router v6.
- **Backend & Database**: Supabase (PostgreSQL 15+, Supabase Auth, Supabase Storage buckets for documents/posters/images, and Row Level Security).
- **Edge / Serverless Computing**: Supabase Edge Functions for server-side OCR & tabular document parsing (with robust client-side fallback engine using Tesseract.js and SheetJS).
- **Deployment**: Vercel ready with standard SPA rewrite rules.

## 4. User Roles & Hierarchy
1. **Club Admin**: Master administrator. Full authority over students, teams, approval of membership applications, project oversight, task distribution, announcements, and club settings.
2. **Coordinator**: Manages events, workshops, student task distribution, list parsing, workload balancing, and progress monitoring.
3. **Team Leader**: Manages team projects, bill of materials (components required), budgets, team rosters, and milestone updates.
4. **Student**: Views assigned tasks and individual contacts/records, updates work status, uploads deliverables, participates in teams, and views announcements.
