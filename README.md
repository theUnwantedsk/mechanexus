# MECHANEXUS — MITE Mechatronics Club Platform

> Complete, full-stack web application custom-engineered for **MECHANEXUS**, the official Mechatronics Engineering Club at **Mangalore Institute of Technology and Engineering (MITE)**.

The platform centralizes all club operations, eliminating scattered spreadsheets and manual WhatsApp task assignments with a modern, reactive platform.

---

## ⚡ Core Features & Capabilities

### 1. 🤖 Smart Task Distribution Engine (Flagship Feature)
- **Multi-Format Ingestion**: Upload Excel spreadsheets (`.xlsx`, `.csv`) or images (`.png`, `.jpg`) with contact or task lists.
- **Client-Side OCR & SheetJS Engine**: Automatic extraction of names, phone numbers, email addresses, and designations using Tesseract.js and SheetJS.
- **Verification Table**: Coordinators inspect, edit, add, or delete extracted rows before launching distribution.
- **Workload-Aware Fair Distribution**:
  - Automatically calculates base equal allocation ($N$ records divided among $M$ selected students).
  - Remainder records are dynamically prioritized to students with lighter existing active workloads.
- **Scoped Student Task Workspace**: Students only see their assigned records and update their individual progress across 5 statuses:
  - `Not Started`
  - `In Progress`
  - `Completed`
  - `Unable to Contact`
  - `Needs Assistance`
- **Coordinator Monitoring Command Center**: Real-time progress bars, student assignment breakdown, and 1-click manual reassignment.

### 2. 🌐 Public Community Feed & "Join MECHANEXUS" Portal
- **Public Feed**: Announcements, hackathons, rover showcases, and achievements with image banners and pinned notices.
- **Recruitment Engine**: Multi-step membership application form capturing Name, USN, college email (`@mite.ac.in`), department, semester, technical domains (Robotics & ROS 2, Embedded Systems, IoT, Edge AI, CAD, UAVs), and skills statement.
- **Status Tracker**: Prospective members can track their application status (`Pending`, `Approved`, `Rejected`) using their USN.
- **Admin Review Dashboard**: Club Admins inspect candidates and 1-click approve (auto-creating student club profiles) or reject with feedback notes.
- **Member Directory**: Public roster with privacy controls (`is_public`), search by name/USN, and domain filters.

### 3. 🛠️ Project Management & Bill of Materials (BOM)
- **Full Project Metadata**: Problem statement, proposed mechatronics solution, assigned team, status (`Ideation`, `Prototyping`, `Testing`, `Completed`), budget vs actual expenditure.
- **Bill of Materials (BOM) Manager**: Itemized list of hardware components (quantity, technical specifications, estimated cost, and acquired checkbox).
- **Revision History & Audit Trail**: Immutable log tracking who modified attributes, status, or budgets with timestamps.

### 4. 👥 Team Management & Invite Codes
- **Unique 6-Character Codes**: Automatic generation of uppercase invite codes (e.g., `ROV2026`, `ARM404`).
- **Join by Code**: Students join engineering teams instantly with valid codes.
- **Team Roles**: Leaders manage project updates and BOM items; members collaborate on milestones.

### 5. 📅 Events & Workshops
- Schedule, venue, description, and countdowns for bootcamps (e.g. MECHAHACK 2026, PLC/SCADA workshop).
- **Student Responsibility Checklist**: Delegation of event preparation duties (Stage AV, Kit bundling, Guest reception) with interactive completion status.

### 6. 📜 Activity Logs & Auditing
- System-wide accountability trail tracking project edits, task distributions, student completions, team code joins, and membership approvals.

---

## 🚀 Technology Stack

- **Frontend**: React 18 + Vite (SPA)
- **Styling**: Tailwind CSS (Dark slate mechatronics theme)
- **Icons**: Lucide React
- **OCR Engine**: Tesseract.js (Browser-based worker)
- **Spreadsheet Parser**: SheetJS (XLSX)
- **Database**: PostgreSQL 15+ (Supabase)
- **Authentication**: Supabase Auth (Email / Password)
- **Storage**: Supabase Storage (`avatars`, `project-files`, `event-posters`)
- **Security**: PostgreSQL Row Level Security (RLS) policies

---

## 🏁 Quick Start & Local Development

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Start Local Development Server
```bash
pnpm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
pnpm run build
```

---

## 🎭 Instant Demo Role Switcher
For evaluation and testing without complex logins, use the **Role Simulator** at the top of the interface:
- **Club Admin**: Dr. Rajashekhar (Full system permissions, membership review, budget approvals)
- **Coordinator**: Ananya Rao (Smart Task Distribution wizard, monitoring, workshop duties)
- **Team Leader**: Rahul Sharma (Team Rover lead, BOM editor, project status)
- **Student**: Preethi Nayak (Assigned task records, progress updater, join team by code)

---

## 🗄️ Supabase Database Setup

When connecting to your live Supabase project:
1. Open your Supabase SQL Editor.
2. Run the provided migration script located at:
   `supabase/migrations/20261111000000_init_mechanexus.sql`
3. Copy your project credentials into `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. If `.env` is unpopulated, MECHANEXUS automatically operates in dual-mode with responsive local reactive persistence so all features remain 100% testable out-of-the-box!

---

## ☁️ Deployment to Vercel
The repository includes a pre-configured `vercel.json` SPA redirect file. Deploy directly with:
```bash
vercel --prod
```
