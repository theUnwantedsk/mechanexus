import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClub } from '../context/ClubContext';
import { 
  Layers, 
  Plus, 
  Search, 
  Filter, 
  DollarSign, 
  Users, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  Clock,
  Sparkles
} from 'lucide-react';

export const Projects = () => {
  const { data, currentUser, createProject } = useClub();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Project Form state
  const [newProject, setNewProject] = useState({
    title: '',
    category: 'Robotics',
    team_id: data.teams?.[0]?.id || '',
    status: 'Ideation',
    problem_statement: '',
    proposed_solution: '',
    estimated_budget: 25000,
    actual_expenditure: 0
  });

  const canCreate = currentUser && ['club_admin', 'coordinator', 'team_leader'].includes(currentUser.role);

  const categories = ['all', 'Robotics', 'Industrial Automation', 'IoT & Embedded', 'Aero & UAV', 'CAD Design'];
  const statuses = ['all', 'Ideation', 'Prototyping', 'Testing', 'Completed', 'On Hold'];

  const filteredProjects = data.projects?.filter(proj => {
    if (statusFilter !== 'all' && proj.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && proj.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = proj.title?.toLowerCase().includes(q);
      const probMatch = proj.problem_statement?.toLowerCase().includes(q);
      if (!titleMatch && !probMatch) return false;
    }
    return true;
  }) || [];

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newProject.title.trim() || !newProject.problem_statement.trim()) return;

    createProject(newProject);
    setIsModalOpen(false);
    setNewProject({
      title: '',
      category: 'Robotics',
      team_id: data.teams?.[0]?.id || '',
      status: 'Ideation',
      problem_statement: '',
      proposed_solution: '',
      estimated_budget: 25000,
      actual_expenditure: 0
    });
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-nexus-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-semibold mb-1">
            <Layers size={14} /> Club Engineering Projects
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Mechatronics Project Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track hardware prototypes, Bill of Materials (BOM), budgets, and complete revision histories.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-nexus-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <Plus size={16} /> New Project
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search projects or problem statements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-nexus-900 border border-nexus-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-nexus-900 border border-nexus-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-nexus-900 border border-nexus-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            {statuses.map(s => (
              <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 space-y-3">
            <Layers size={36} className="mx-auto text-slate-600" />
            <p className="text-sm font-semibold">No engineering projects found matching filters.</p>
          </div>
        ) : (
          filteredProjects.map(proj => {
            const team = data.teams?.find(t => t.id === proj.team_id);
            const budgetPct = proj.estimated_budget > 0 
              ? Math.min(100, Math.round((proj.actual_expenditure / proj.estimated_budget) * 100))
              : 0;

            return (
              <div
                key={proj.id}
                className="tech-card p-6 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded">
                          {proj.category}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {team?.name || 'Independent Team'}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                        <Link to={`/projects/${proj.id}`}>{proj.title}</Link>
                      </h2>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      proj.status === 'Completed'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : proj.status === 'Prototyping'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {proj.status}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase font-mono text-slate-400 block mb-0.5">Problem Statement:</span>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {proj.problem_statement}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase font-mono text-slate-400 block mb-0.5">Proposed Solution:</span>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {proj.proposed_solution}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Budget & BOM info */}
                <div className="pt-4 border-t border-nexus-850 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Budget Utilized: ₹{Number(proj.actual_expenditure).toLocaleString()} of ₹{Number(proj.estimated_budget).toLocaleString()}</span>
                    <span className="font-mono text-cyan-400 font-bold">{budgetPct}%</span>
                  </div>
                  <div className="w-full bg-nexus-950 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
                      style={{ width: `${budgetPct}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">
                      {proj.components?.length || 0} BOM items • {proj.documents?.length || 0} files
                    </span>

                    <Link
                      to={`/projects/${proj.id}`}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      Inspect Project <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nexus-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-nexus-900 border border-nexus-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-nexus-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles size={18} className="text-cyan-400" /> Create Engineering Project
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 6-Axis Articulated Sorting Manipulator"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Robotics">Robotics</option>
                    <option value="Industrial Automation">Industrial Automation</option>
                    <option value="IoT & Embedded">IoT & Embedded</option>
                    <option value="Aero & UAV">Aero & UAV</option>
                    <option value="CAD Design">CAD Design</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Assigned Team</label>
                  <select
                    value={newProject.team_id}
                    onChange={(e) => setNewProject({ ...newProject, team_id: e.target.value })}
                    className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    {data.teams?.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Initial Status</label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                    className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Ideation">Ideation</option>
                    <option value="Prototyping">Prototyping</option>
                    <option value="Testing">Testing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estimated Budget (₹)</label>
                  <input
                    type="number"
                    value={newProject.estimated_budget}
                    onChange={(e) => setNewProject({ ...newProject, estimated_budget: Number(e.target.value) })}
                    className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Problem Statement *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe the real-world engineering challenge..."
                  value={newProject.problem_statement}
                  onChange={(e) => setNewProject({ ...newProject, problem_statement: e.target.value })}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Proposed Solution *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Detail the mechanical design, sensors, controllers and software..."
                  value={newProject.proposed_solution}
                  onChange={(e) => setNewProject({ ...newProject, proposed_solution: e.target.value })}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-nexus-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-nexus-950 font-bold"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
