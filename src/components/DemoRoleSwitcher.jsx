import React from 'react';
import { useClub } from '../context/ClubContext';
import { ShieldCheck, UserCheck, Users, GraduationCap, Eye } from 'lucide-react';

export const DemoRoleSwitcher = () => {
  const { currentUser, data, setCurrentUser } = useClub();

  const personas = [
    {
      role: 'club_admin',
      label: 'Admin',
      name: 'Dr. Rajashekhar',
      icon: ShieldCheck,
      color: 'border-rose-500/50 text-rose-400 bg-rose-500/10'
    },
    {
      role: 'coordinator',
      label: 'Coordinator',
      name: 'Ananya Rao',
      icon: UserCheck,
      color: 'border-amber-500/50 text-amber-400 bg-amber-500/10'
    },
    {
      role: 'team_leader',
      label: 'Team Lead',
      name: 'Rahul Sharma',
      icon: Users,
      color: 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10'
    },
    {
      role: 'student',
      label: 'Student',
      name: 'Preethi Nayak',
      icon: GraduationCap,
      color: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'
    }
  ];

  return (
    <div className="bg-nexus-900/90 border border-nexus-700/60 rounded-xl p-2 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 text-xs text-slate-400 px-2 pb-1.5 border-b border-nexus-800">
        <span className="flex items-center gap-1.5 font-medium tracking-wide uppercase text-[10px] text-cyan-400">
          <Eye size={12} /> Role Simulator (Demo Bar)
        </span>
        <span className="text-[11px] text-slate-400">
          Current: <strong className="text-white capitalize">{currentUser?.role?.replace('_', ' ') || 'Guest'}</strong>
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-2">
        {personas.map(p => {
          const matchedProfile = data.profiles.find(user => user.role === p.role);
          const isActive = currentUser?.role === p.role;
          const Icon = p.icon;

          return (
            <button
              key={p.role}
              onClick={() => {
                if (matchedProfile) {
                  setCurrentUser(matchedProfile);
                }
              }}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all text-xs font-medium border ${
                isActive 
                  ? `${p.color} ring-1 ring-white/20 shadow-sm` 
                  : 'border-nexus-800 hover:border-nexus-700 bg-nexus-950/60 text-slate-300 hover:text-white'
              }`}
            >
              <Icon size={14} className="shrink-0" />
              <div className="truncate">
                <div className="font-semibold leading-tight">{p.label}</div>
                <div className="text-[10px] text-slate-400 truncate">{p.name}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
