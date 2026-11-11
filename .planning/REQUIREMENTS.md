# Requirements Specification: MECHANEXUS

## 1. Authentication & Role Management (REQ-AUTH)
- **REQ-AUTH-01**: Support secure user registration and login via Supabase Auth (Email/Password).
- **REQ-AUTH-02**: Profile creation linked to `auth.users` with fields: `full_name`, `email`, `usn` (University Seat Number), `department`, `semester`, `role` (`club_admin`, `coordinator`, `team_leader`, `student`), `skills`, `bio`, `avatar_url`, and `is_public`.
- **REQ-AUTH-03**: Role enforcement via Supabase RLS and protected frontend route guards.
- **REQ-AUTH-04**: Offline/demo preview mode fallback with mock credentials if Supabase environment variables are missing during initial evaluation.

## 2. Public Community & Recruitment (REQ-COMM)
- **REQ-COMM-01**: Public feed showing announcements, workshop highlights, project showcases, and competition achievements with posters/images and pinned items.
- **REQ-COMM-02**: "Join MECHANEXUS" recruitment portal allowing non-authenticated students to submit applications (name, email, USN, dept, semester, technical interests, skills).
- **REQ-COMM-03**: Application status workflow: `Pending` -> `Approved` or `Rejected` with administrative review dashboard.
- **REQ-COMM-04**: Upon admin approval, the student is granted club membership and assigned standard student role access.
- **REQ-COMM-05**: Public Member Directory showcasing approved members with opted-in public profiles, roles, and technical domains.

## 3. Team Management (REQ-TEAM)
- **REQ-TEAM-01**: Creation of teams with team name, domain/category (Robotics, IoT, Automation, CAD, AI/Embedded), description, and leader.
- **REQ-TEAM-02**: Automatic generation of unique 6-character alphanumeric team invite codes.
- **REQ-TEAM-03**: Students can join teams using valid team codes.
- **REQ-TEAM-04**: Role hierarchy inside teams: Team Leader vs Team Member, with leader permissions to edit team projects.

## 4. Project Management System (REQ-PROJ)
- **REQ-PROJ-01**: Rich project record containing: title, abstract/description, problem statement, proposed solution, category, status (`Ideation`, `Prototyping`, `Testing`, `Completed`, `On Hold`), estimated budget, actual expenditure, components required (BOM).
- **REQ-PROJ-02**: Association with teams and multiple student members.
- **REQ-PROJ-03**: Document and image uploads stored in Supabase Storage (`project-files` bucket).
- **REQ-PROJ-04**: Immutable project edit history table tracking author, timestamp, and modification details.

## 5. Smart Task Distribution System (REQ-TASK)
- **REQ-TASK-01**: Coordinators/Admins can create distributed tasks with title, description, deadline, and assigned student pool.
- **REQ-TASK-02**: Document upload supporting PNG, JPG, PDF, XLSX, and CSV file formats.
- **REQ-TASK-03**: Automated OCR (for images) and parsing (for Excel/CSV/PDF) to extract tabular work items or contact lists (e.g. alumni names, phone, email, notes).
- **REQ-TASK-04**: Interactive verification table permitting coordinators to inspect, edit, delete, or add records before triggering distribution.
- **REQ-TASK-05**: Automated fair round-robin distribution algorithm factoring in students' existing active workloads.
- **REQ-TASK-06**: Manual record reassignment capability for coordinators.
- **REQ-TASK-07**: Scoped student task view: Students view only their allocated records and update individual record status (`Not Started`, `In Progress`, `Completed`, `Unable to Contact`, `Needs Assistance`).
- **REQ-TASK-08**: Coordinator global monitoring dashboard with real-time completion analytics and export options.

## 6. Events & Workshops (REQ-EVENT)
- **REQ-EVENT-01**: Event creation (workshops, guest lectures, hackathons, club meetings) with date, venue, banner image, description, and registration link/capacity.
- **REQ-EVENT-02**: Delegation of student duties and sub-responsibilities per event (e.g., stage, technical, logistics, photography).
- **REQ-EVENT-03**: Preparation status tracking and milestone checklists.

## 7. Activity Logs & Auditing (REQ-LOGS)
- **REQ-LOGS-01**: Automated logging for key events: project creation/edits, task creations/distributions, status updates, team code joins, and membership status changes.
- **REQ-LOGS-02**: Administrative activity feed with filtering by user, action type, and date.

## 8. Database Architecture & Security (REQ-SEC)
- **REQ-SEC-01**: Normalized relational schema with foreign key constraints, indexes, and cascades.
- **REQ-SEC-02**: PostgreSQL Row Level Security (RLS) policies ensuring users cannot mutate or view unauthorized data.
- **REQ-SEC-03**: Secure storage policies for avatars, project files, event banners, and task uploads.
- **REQ-SEC-04**: Zero client-side leakage of Supabase service role keys.

## 9. Modern UI/UX (REQ-UI)
- **REQ-UI-01**: High-tech mechatronics design system: sleek dark-mode slate/emerald/cyan palette, micro-interactions, responsive sidebars, accessible contrasts.
- **REQ-UI-02**: Polished empty states, skeletons, toast notifications, confirmation dialogs, and breadcrumb navigation.
- **REQ-UI-03**: 100% responsive across mobile, tablet, and desktop viewports.
