import React, { useState } from 'react';
import { useClub } from '../context/ClubContext';
import { 
  Users, 
  Plus, 
  KeyRound, 
  Copy, 
  Check, 
  ShieldCheck, 
  UserCheck, 
  Sparkles, 
  ArrowRight,
  Layers,
  Search
} from 'lucide-react';

export const Teams = () => {
  const { data, currentUser, createTeam, joinTeamByCode } = useClub();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  // Create team state
  const [newTeam, setNewTeam] = useState({
    name: '',
    domain: 'Autonomous Mobile Robotics',
    description: '',
    leader_id: currentUser?.id || ''
  });

  const canCreate = currentUser && ['club_admin', 'coordinator', 'team_leader'].includes(currentUser.role);

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    setJoinError('');
    setJoinSuccess('');

    if (!joinCodeInput.trim()) return;

    const res = joinTeamByCode(joinCodeInput);
    if (res.success) {
      setJoinSuccess(`Successfully joined team "${res.team.name}"!`);
      setJoinCodeInput('');
      setTimeout(() => {
        setIsJoinModalOpen(false);
        setJoinSuccess('');
      }, 1500);
    } else {
      setJoinError(res.message);
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newTeam.name.trim()) return;

    createTeam(newTeam);
    setIsCreateModalOpen(false);
    setNewTeam({
      name: '',
      domain: 'Autonomous Mobile Robotics',
      description: '',
      leader_id: currentUser?.id || ''
    });
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-nexus-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-semibold mb-1">
            <Users size={14} /> Engineering Verticals
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Team Management & Code Invites
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Collaborate in specialized engineering teams, assign vertical leads, and share invite codes.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => {
              setJoinError('');
              setJoinSuccess('');
              setIsJoinModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-nexus-850 hover:bg-nexus-800 text-cyan-300 border border-cyan-500/40 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <KeyRound size={14} /> Join with Code
          </button>

          {canCreate && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-nexus-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
            >
              <Plus size={15} /> Create Team
            </button>
          )}
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.teams?.map(team => {
          const leader = data.profiles?.find(p => p.id === team.leader_id);
          const isMember = team.members?.includes(currentUser?.id);
          const teamProjects = data.projects?.filter(p => p.team_id === team.id) || [];

          return (
            <div
              key={team.id}
              className={`tech-card p-6 flex flex-col justify-between space-y-4 group ${
                isMember ? 'ring-1 ring-cyan-500/40 bg-nexus-900/90' : ''
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded">
                      {team.domain}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mt-1">
                      {team.name}
                    </h3>
                  </div>

                  {isMember && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      My Team
                    </span>
                  )}
                </div>

                {/* Team Code Capsule */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-nexus-950 border border-nexus-850 text-xs">
                  <span className="text-slate-400 text-[11px]">Invite Code:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-cyan-300 tracking-wider text-sm">{team.team_code}</span>
                    <button
                      onClick={() => handleCopyCode(team.team_code)}
                      title="Copy code"
                      className="p-1 rounded hover:bg-nexus-850 text-slate-400 hover:text-white"
                    >
                      {copiedCode === team.team_code ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {team.description || 'Dedicated mechatronics engineering vertical.'}
                </p>

                {/* Team Leader info */}
                <div className="pt-2 flex items-center gap-2.5 text-xs text-slate-300">
                  <img
                    src={leader?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(leader?.full_name || 'L')}`}
                    alt={leader?.full_name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-cyan-500/30"
                  />
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Team Lead</div>
                    <div className="font-semibold text-white">{leader?.full_name || 'Prof. Advisor'}</div>
                  </div>
                </div>
              </div>

              {/* Card Footer: Members & Projects */}
              <div className="pt-4 border-t border-nexus-850 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-[11px]">
                  <Users size={13} /> {team.members?.length || 0} Members
                </span>
                <span className="flex items-center gap-1 text-[11px] text-cyan-400">
                  <Layers size={13} /> {teamProjects.length} Projects
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Join Team Modal */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nexus-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-nexus-900 border border-nexus-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-nexus-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <KeyRound size={16} className="text-cyan-400" /> Join Team by Code
              </h3>
              <button onClick={() => setIsJoinModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-slate-300">
              Enter the unique 6-character team invite code provided by your team leader or coordinator:
            </p>

            {joinError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
                {joinError}
              </div>
            )}

            {joinSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold">
                {joinSuccess}
              </div>
            )}

            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  maxLength={8}
                  placeholder="e.g. ROV2026"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-4 py-3 text-center text-lg font-mono font-bold tracking-widest text-cyan-300 uppercase focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-nexus-950 font-bold"
                >
                  Join Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nexus-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-nexus-900 border border-nexus-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-nexus-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles size={16} className="text-cyan-400" /> Form New Team
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Team Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AeroMecha UAV Systems"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Domain</label>
                <input
                  type="text"
                  placeholder="e.g. Aerial Robotics, Planetary Rovers, Industrial SCADA"
                  value={newTeam.domain}
                  onChange={(e) => setNewTeam({ ...newTeam, domain: e.target.value })}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Team Leader</label>
                <select
                  value={newTeam.leader_id}
                  onChange={(e) => setNewTeam({ ...newTeam, leader_id: e.target.value })}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  {data.profiles?.map(p => (
                    <option key={p.id} value={p.id}>{p.full_name} ({p.role.replace('_', ' ')})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Goals and engineering roadmap for this team..."
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-nexus-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-nexus-950 font-bold"
                >
                  Create Team & Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
