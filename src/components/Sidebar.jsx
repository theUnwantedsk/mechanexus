import React from 'react';
import { NavLink } from 'react-router-dom';
import { useClub } from '../context/ClubContext';
import { 
  LayoutDashboard, 
  Workflow, 
  Layers, 
  Users, 
  Calendar, 
  CheckSquare, 
  History, 
  UserCheck, 
  BookOpen, 
  FileText,
  Sliders
} from 'lucide-react';

export const Sidebar = () => {
  const { currentUser, data } = useClub();
  const role = currentUser?.role || 'student';

  // Count pending membership applications for Admin
  const pendingAppsCount = data.membershipApplications?.filter(a => a.status === 'pending').length || 0;
  
  // Count student assigned incomplete records
  const myAssignedIncompleteCount = data.tasks?.reduce((total, task) => {
    const mine = task.records?.filter(r => r.assigned_to === currentUser?.id && r.status !== 'Completed').length || 0;
    return total + mine;
  }, 0) || 0;

  const links = [
    {
      label: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['club_admin', 'coordinator', 'team_leader', 'student']
    },
    {
      label: 'Smart Task Engine',
      path: '/tasks/distribute',
      icon: Workflow,
      badge: 'Flagship',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      roles: ['club_admin', 'coordinator']
    },
    {
      label: 'My Assigned Tasks',
      path: '/tasks/my-tasks',
      icon: CheckSquare,
      badge: myAssignedIncompleteCount > 0 ? myAssignedIncompleteCount : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      roles: ['student', 'team_leader', 'coordinator', 'club_admin']
    },
    {
      label: 'Projects & BOM',
      path: '/projects',
      icon: Layers,
      roles: ['club_admin', 'coordinator', 'team_leader', 'student']
    },
    {
      label: 'Teams & Codes',
      path: '/teams',
      icon: Users,
      roles: ['club_admin', 'coordinator', 'team_leader', 'student']
    },
    {
      label: 'Events & Workshops',
      path: '/events',
      icon: Calendar,
      roles: ['club_admin', 'coordinator', 'team_leader', 'student']
    },
    {
      label: 'Membership Review',
      path: '/admin/memberships',
      icon: UserCheck,
      badge: pendingAppsCount > 0 ? pendingAppsCount : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      roles: ['club_admin']
    },
    {
      label: 'Activity Audit Logs',
      path: '/logs',
      icon: History,
      roles: ['club_admin', 'coordinator']
    }
  ];

  const visibleLinks = links.filter(l => l.roles.includes(role));

  return (
    <aside className="w-64 bg-nexus-900/60 border-r border-nexus-800/80 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-mono tracking-wider text-slate-400 uppercase px-3 mb-2 font-semibold flex items-center justify-between">
            <span>Navigation</span>
            <span className="text-cyan-400 font-normal capitalize">{role?.replace('_', ' ')}</span>
          </div>

          <nav className="space-y-1">
            {visibleLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-nexus-850/80 border border-transparent'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon size={16} className="text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${item.badgeColor || 'bg-cyan-500/20 text-cyan-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Quick Links Section */}
        <div className="pt-4 border-t border-nexus-800/80">
          <div className="text-[11px] font-mono tracking-wider text-slate-400 uppercase px-3 mb-2 font-semibold">
            Public Portals
          </div>
          <div className="space-y-1">
            <NavLink
              to="/"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-nexus-850/60 transition-all"
            >
              <BookOpen size={14} /> Community Feed
            </NavLink>
            <NavLink
              to="/directory"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-nexus-850/60 transition-all"
            >
              <Users size={14} /> Member Directory
            </NavLink>
          </div>
        </div>
      </div>

      {/* System Status info */}
      <div className="pt-4 border-t border-nexus-800/80 text-[11px] text-slate-400 space-y-1 px-2">
        <div className="flex items-center justify-between">
          <span>Engine Status:</span>
          <span className="text-emerald-400 font-mono font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Platform:</span>
          <span className="text-slate-300 font-mono">v1.0-prod</span>
        </div>
      </div>
    </aside>
  );
};
