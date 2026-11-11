import React from 'react';
import { Link } from 'react-router-dom';
import { useClub } from '../context/ClubContext';
import { 
  LayoutDashboard, 
  Layers, 
  Workflow, 
  Users, 
  Calendar, 
  CheckSquare, 
  Clock, 
  Sparkles, 
  ArrowUpRight, 
  ShieldCheck, 
  UserCheck, 
  Radio, 
  FileText,
  DollarSign,
  Activity
} from 'lucide-react';

export const Dashboard = () => {
  const { data, currentUser } = useClub();
  const role = currentUser?.role || 'student';

  // Metrics calculation
  const totalProjects = data.projects?.length || 0;
  const totalTeams = data.teams?.length || 0;
  const totalMembers = data.profiles?.length || 0;
  const totalEvents = data.events?.length || 0;
  const pendingApps = data.membershipApplications?.filter(a => a.status === 'pending').length || 0;

  // Student specific metrics
  const myAssignedRecords = [];
  data.tasks?.forEach(task => {
    task.records?.forEach(record => {
      if (record.assigned_to === currentUser?.id) {
        myAssignedRecords.push(record);
      }
    });
  });
  const myCompleted = myAssignedRecords.filter(r => r.status === 'Completed').length;

  // Total club budget and expenses
  const totalBudget = data.projects?.reduce((sum, p) => sum + (Number(p.estimated_budget) || 0), 0) || 0;
  const totalSpent = data.projects?.reduce((sum, p) => sum + (Number(p.actual_expenditure) || 0), 0) || 0;

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-nexus-900 via-nexus-850 to-nexus-900 border border-nexus-750 p-6 sm:p-8 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold uppercase tracking-wider">
                {role.replace('_', ' ')} Portal
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {currentUser?.usn || 'STAFF'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {currentUser?.full_name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {role === 'club_admin' && 'Central command center: Manage student rosters, allocate funds, audit project history, and oversee task distributions.'}
              {role === 'coordinator' && 'Event and workflow hub: Oversee smart task distribution, balance workloads, and track hackathon logistics.'}
              {role === 'team_leader' && 'Engineering vertical hub: Track your team members, update CAD/hardware prototypes, and manage Bill of Materials.'}
              {role === 'student' && 'Member dashboard: Track your assigned outreach contacts, participate in rover and automation teams, and attend club workshops.'}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {['club_admin', 'coordinator'].includes(role) && (
              <Link
                to="/tasks/distribute"
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-nexus-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-2 transition-all"
              >
                <Workflow size={15} /> Distribute Tasks
              </Link>
            )}
            {role === 'club_admin' && (
              <Link
                to="/admin/memberships"
                className="px-4 py-2.5 rounded-xl bg-nexus-800 hover:bg-nexus-750 text-rose-300 border border-rose-500/30 font-semibold text-xs flex items-center gap-2 transition-all"
              >
                <ShieldCheck size={15} /> Review Apps ({pendingApps})
              </Link>
            )}
            <Link
              to="/tasks/my-tasks"
              className="px-4 py-2.5 rounded-xl bg-nexus-800 hover:bg-nexus-750 text-slate-200 border border-nexus-700 font-semibold text-xs flex items-center gap-2 transition-all"
            >
              <CheckSquare size={15} /> My Tasks ({myAssignedRecords.length})
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="tech-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase">Projects</span>
            <Layers size={18} className="text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{totalProjects} Active</div>
          <div className="text-[11px] text-slate-400">
            Budget: <strong className="text-emerald-400 font-mono">₹{totalBudget.toLocaleString()}</strong>
          </div>
        </div>

        <div className="tech-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase">Teams</span>
            <Users size={18} className="text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{totalTeams} Verticals</div>
          <div className="text-[11px] text-slate-400">
            Across <strong className="text-slate-200">{totalMembers}</strong> club members
          </div>
        </div>

        <div className="tech-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase">Tasks Tracked</span>
            <Workflow size={18} className="text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {data.tasks?.reduce((s, t) => s + (t.total_records || 0), 0)} Records
          </div>
          <div className="text-[11px] text-amber-400/90">
            Across {data.tasks?.length || 0} distributed campaigns
          </div>
        </div>

        <div className="tech-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase">Workshops & Events</span>
            <Calendar size={18} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{totalEvents} Scheduled</div>
          <div className="text-[11px] text-emerald-400/90">
            Next: MECHAHACK 2026
          </div>
        </div>
      </div>

      {/* Main Grid: Projects Overview & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Projects Showcase (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers size={18} className="text-cyan-400" /> Flagship Engineering Projects
            </h2>
            <Link
              to="/projects"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              View All Projects <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="space-y-4">
            {data.projects?.map(project => {
              const team = data.teams?.find(t => t.id === project.team_id);
              const budgetPct = project.estimated_budget > 0 
                ? Math.min(100, Math.round((project.actual_expenditure / project.estimated_budget) * 100))
                : 0;

              return (
                <div
                  key={project.id}
                  className="tech-card p-5 space-y-3 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded">
                          {project.category}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {team?.name || 'Independent'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                        <Link to={`/projects/${project.id}`}>{project.title}</Link>
                      </h3>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      project.status === 'Completed'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : project.status === 'Prototyping'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {project.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {project.proposed_solution || project.description}
                  </p>

                  {/* Budget Utilization Bar */}
                  <div className="pt-2 border-t border-nexus-850 flex items-center justify-between gap-4 text-xs">
                    <div className="space-y-1 flex-1 max-w-xs">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Expenditure: ₹{Number(project.actual_expenditure).toLocaleString()}</span>
                        <span>₹{Number(project.estimated_budget).toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-nexus-950 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
                          style={{ width: `${budgetPct}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-right text-[11px] text-slate-400">
                      <span>{project.components?.length || 0} BOM items</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Activity Audit Feed (Right col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-cyan-400" /> Recent Club Activity
            </h2>
            <Link
              to="/logs"
              className="text-xs text-slate-400 hover:text-white"
            >
              Full Audit Trail
            </Link>
          </div>

          <div className="tech-card p-5 space-y-4">
            <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-1">
              {data.activityLogs?.slice(0, 7).map(log => {
                const user = data.profiles?.find(p => p.id === log.user_id);

                return (
                  <div key={log.id} className="text-xs space-y-1 border-b border-nexus-850 pb-3 last:border-b-0">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-cyan-300">{user?.full_name || 'System User'}</span>
                      <span className="text-slate-500 font-mono text-[10px]">
                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-snug">
                      {log.details}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
