import React, { useState } from 'react';
import { useClub } from '../context/ClubContext';
import { 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  UserCheck, 
  Award, 
  Mail, 
  GraduationCap,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const MemberDirectory = () => {
  const { data, currentUser } = useClub();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');

  const roles = [
    { id: 'all', label: 'All Roles' },
    { id: 'club_admin', label: 'Club Admins' },
    { id: 'coordinator', label: 'Coordinators' },
    { id: 'team_leader', label: 'Team Leaders' },
    { id: 'student', label: 'Student Members' },
  ];

  const departments = [
    { id: 'all', label: 'All Departments' },
    { id: 'Mechatronics Engineering', label: 'Mechatronics' },
    { id: 'Mechanical Engineering', label: 'Mechanical' },
    { id: 'Electronics & Communication', label: 'ECE' },
  ];

  // Filter profiles: only display public ones (or all if admin)
  const filteredProfiles = data.profiles?.filter(profile => {
    // Privacy check: only show if public, or if current user is admin
    if (!profile.is_public && currentUser?.role !== 'club_admin') {
      return false;
    }

    // Role filter
    if (roleFilter !== 'all' && profile.role !== roleFilter) {
      return false;
    }

    // Dept filter
    if (deptFilter !== 'all' && profile.department !== deptFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = profile.full_name?.toLowerCase().includes(q);
      const usnMatch = profile.usn?.toLowerCase().includes(q);
      const skillsMatch = profile.skills?.some(s => s.toLowerCase().includes(q));
      if (!nameMatch && !usnMatch && !skillsMatch) return false;
    }

    return true;
  }) || [];

  const getRoleBadge = (role) => {
    switch (role) {
      case 'club_admin':
        return <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"><ShieldCheck size={12}/> Admin</span>;
      case 'coordinator':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"><UserCheck size={12}/> Coordinator</span>;
      case 'team_leader':
        return <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"><Award size={12}/> Team Lead</span>;
      default:
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"><GraduationCap size={12}/> Student</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-nexus-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-semibold mb-1">
            <Users size={14} /> MECHANEXUS Roster
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Club Member Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Explore verified innovators, project leaders, coordinators, and mechatronics engineers.
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-nexus-900 border border-nexus-800 px-4 py-2 rounded-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>Showing <strong>{filteredProfiles.length}</strong> active members</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, USN, or skill (e.g. ROS 2, PCB)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-nexus-900/80 border border-nexus-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-nexus-900/80 border border-nexus-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            {roles.map(r => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full bg-nexus-900/80 border border-nexus-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 space-y-2">
            <Users size={32} className="mx-auto text-slate-600" />
            <p className="text-sm">No club members match the selected filters.</p>
          </div>
        ) : (
          filteredProfiles.map(profile => (
            <div
              key={profile.id}
              className="tech-card p-5 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={profile.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(profile.full_name)}`}
                      alt={profile.full_name}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-cyan-500/30 group-hover:ring-cyan-500/60 transition-all"
                    />
                    <div>
                      <h3 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                        {profile.full_name}
                      </h3>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {profile.usn || 'FACULTY'}
                      </div>
                    </div>
                  </div>
                  {getRoleBadge(profile.role)}
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span>{profile.department}</span>
                  {profile.semester && <span>• Sem {profile.semester}</span>}
                </div>

                {profile.bio && (
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {profile.bio}
                  </p>
                )}

                {/* Skills tags */}
                {profile.skills && profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {profile.skills.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-nexus-950 px-2 py-0.5 rounded-md border border-nexus-800 text-cyan-300 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {profile.skills.length > 4 && (
                      <span className="text-[10px] text-slate-500 py-0.5">
                        +{profile.skills.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-nexus-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Mail size={12} /> {profile.email}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
