import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useClub } from '../context/ClubContext';
import { 
  ArrowLeft, 
  Layers, 
  DollarSign, 
  Users, 
  Plus, 
  CheckCircle2, 
  Clock, 
  History, 
  FileText, 
  Image as ImageIcon, 
  Edit3, 
  Upload,
  Cpu,
  Sparkles
} from 'lucide-react';

export const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    data, 
    currentUser, 
    updateProject, 
    addProjectComponent, 
    toggleComponentAcquired 
  } = useClub();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'bom' | 'docs' | 'history'
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddComponentOpen, setIsAddComponentOpen] = useState(false);

  const project = data.projects?.find(p => p.id === id);

  // Component form state
  const [newComp, setNewComp] = useState({
    name: '',
    quantity: 1,
    specifications: '',
    estimated_cost: 1500,
    is_acquired: false
  });

  // Edit project state
  const [editForm, setEditForm] = useState({
    status: project?.status || 'Prototyping',
    estimated_budget: project?.estimated_budget || 0,
    actual_expenditure: project?.actual_expenditure || 0,
    problem_statement: project?.problem_statement || '',
    proposed_solution: project?.proposed_solution || ''
  });

  if (!project) {
    return (
      <div className="py-20 text-center space-y-4 max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-white">Project Not Found</h2>
        <p className="text-xs text-slate-400">The project you are looking for may have been removed or does not exist.</p>
        <Link to="/projects" className="px-4 py-2 rounded-xl bg-cyan-500 text-nexus-950 font-bold text-xs inline-block">
          Return to Projects
        </Link>
      </div>
    );
  }

  const team = data.teams?.find(t => t.id === project.team_id);
  const creator = data.profiles?.find(p => p.id === project.created_by);
  const canEdit = currentUser && ['club_admin', 'coordinator', 'team_leader'].includes(currentUser.role);

  // Compute BOM costs
  const totalBOMCost = project.components?.reduce((sum, c) => sum + (Number(c.estimated_cost) || 0), 0) || 0;
  const acquiredCount = project.components?.filter(c => c.is_acquired).length || 0;

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateProject(project.id, editForm);
    setIsEditModalOpen(false);
  };

  const handleAddComponentSubmit = (e) => {
    e.preventDefault();
    if (!newComp.name.trim()) return;

    addProjectComponent(project.id, newComp);
    setNewComp({
      name: '',
      quantity: 1,
      specifications: '',
      estimated_cost: 1500,
      is_acquired: false
    });
    setIsAddComponentOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      
      {/* Top Navigation Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/projects"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Projects
        </Link>

        {canEdit && (
          <button
            onClick={() => {
              setEditForm({
                status: project.status,
                estimated_budget: project.estimated_budget,
                actual_expenditure: project.actual_expenditure,
                problem_statement: project.problem_statement,
                proposed_solution: project.proposed_solution
              });
              setIsEditModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-nexus-850 hover:bg-nexus-800 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Edit3 size={13} /> Edit Project & Budget
          </button>
        )}
      </div>

      {/* Project Header Card */}
      <div className="tech-card p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded font-bold">
                {project.category}
              </span>
              <span className="text-xs text-slate-400">
                Team: <strong className="text-slate-200">{team?.name || 'Independent'}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {project.title}
            </h1>
          </div>

          <span className={`text-xs font-bold px-3 py-1 rounded-full border self-start ${
            project.status === 'Completed'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : project.status === 'Prototyping'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          }`}>
            {project.status}
          </span>
        </div>

        {/* Budget & Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-nexus-800/80 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px] font-mono uppercase">Estimated Budget</span>
            <span className="text-base font-bold text-white font-mono">₹{Number(project.estimated_budget).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] font-mono uppercase">Actual Spent</span>
            <span className="text-base font-bold text-cyan-400 font-mono">₹{Number(project.actual_expenditure).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] font-mono uppercase">BOM Items</span>
            <span className="text-base font-bold text-white font-mono">{project.components?.length || 0} Components</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] font-mono uppercase">Initiated By</span>
            <span className="text-slate-300 truncate font-semibold block">{creator?.full_name || 'Prof. Faculty'}</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-nexus-800 pb-1">
        {[
          { id: 'overview', label: 'Overview & Solution', icon: Layers },
          { id: 'bom', label: `Bill of Materials (${project.components?.length || 0})`, icon: Cpu },
          { id: 'docs', label: `Docs & Images (${(project.documents?.length || 0) + (project.images?.length || 0)})`, icon: FileText },
          { id: 'history', label: `Revision History (${project.history?.length || 0})`, icon: History },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/60 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-nexus-900/60'
              }`}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2 space-y-6">
            <div className="tech-card p-6 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Problem Statement
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {project.problem_statement}
              </p>
            </div>

            <div className="tech-card p-6 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Proposed Mechatronics Solution
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {project.proposed_solution}
              </p>
            </div>
          </div>

          {/* Team Roster Column */}
          <div className="space-y-6">
            <div className="tech-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users size={16} className="text-cyan-400" /> Team Roster & Members
              </h3>
              <div className="space-y-3">
                {team?.members?.map(mId => {
                  const member = data.profiles?.find(p => p.id === mId);
                  const isLeader = team.leader_id === mId;

                  return (
                    <div key={mId} className="flex items-center justify-between text-xs bg-nexus-950 p-2.5 rounded-xl border border-nexus-800">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={member?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(member?.full_name || 'U')}`}
                          alt={member?.full_name}
                          className="w-7 h-7 rounded-lg object-cover ring-1 ring-cyan-500/30"
                        />
                        <div>
                          <div className="font-semibold text-white">{member?.full_name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{member?.usn}</div>
                        </div>
                      </div>
                      {isLeader && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          Leader
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BILL OF MATERIALS (BOM) */}
      {activeTab === 'bom' && (
        <div className="tech-card p-6 sm:p-8 space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-nexus-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu size={18} className="text-cyan-400" /> Hardware Components & BOM Management
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Itemize sensors, microcontrollers, motor drivers, chassis links, and acquisition status.
              </p>
            </div>

            {canEdit && (
              <button
                onClick={() => setIsAddComponentOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-nexus-950 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus size={14} /> Add BOM Item
              </button>
            )}
          </div>

          <div className="overflow-x-auto rounded-xl border border-nexus-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-nexus-950 text-[11px] font-mono uppercase text-slate-400 border-b border-nexus-800">
                <tr>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Component Name</th>
                  <th className="py-3 px-3">Qty</th>
                  <th className="py-3 px-3">Technical Specifications</th>
                  <th className="py-3 px-3 text-right">Est. Cost (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-nexus-850 bg-nexus-900/40">
                {project.components?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No hardware components added yet. Click "Add BOM Item" to specify requirements.
                    </td>
                  </tr>
                ) : (
                  project.components?.map(comp => (
                    <tr key={comp.id} className="hover:bg-nexus-850/40">
                      <td className="py-3 px-3">
                        <button
                          disabled={!canEdit}
                          onClick={() => toggleComponentAcquired(project.id, comp.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
                            comp.is_acquired
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-nexus-950 text-slate-400 border-nexus-800 hover:border-slate-600'
                          }`}
                        >
                          <CheckCircle2 size={11} className={comp.is_acquired ? 'fill-current' : ''} />
                          {comp.is_acquired ? 'Acquired' : 'Pending'}
                        </button>
                      </td>
                      <td className="py-3 px-3 font-semibold text-white">{comp.name}</td>
                      <td className="py-3 px-3 font-mono">{comp.quantity}</td>
                      <td className="py-3 px-3 text-slate-400">{comp.specifications || '—'}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-cyan-300">
                        ₹{(Number(comp.estimated_cost) || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex justify-between text-xs text-slate-400">
            <span>Progress: <strong className="text-white">{acquiredCount}</strong> of <strong className="text-white">{project.components?.length || 0}</strong> parts acquired</span>
            <span>Total BOM Estimated: <strong className="text-cyan-400 font-mono font-bold">₹{totalBOMCost.toLocaleString()}</strong></span>
          </div>
        </div>
      )}

      {/* TAB 3: DOCUMENTS & MEDIA */}
      {activeTab === 'docs' && (
        <div className="space-y-6 animate-fade-in">
          {/* Images Section */}
          <div className="tech-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ImageIcon size={16} className="text-cyan-400" /> Prototype Photographs & Media
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {project.images?.map((img, idx) => (
                <div key={idx} className="relative h-48 rounded-xl overflow-hidden border border-nexus-800 bg-nexus-950 group">
                  <img src={img} alt={`Prototype ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>

          {/* Documents Section */}
          <div className="tech-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText size={16} className="text-cyan-400" /> CAD Specs & Research Documents
            </h3>
            <div className="space-y-2">
              {project.documents?.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-nexus-950 border border-nexus-800 text-xs">
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-cyan-400" />
                    <div>
                      <div className="font-semibold text-white">{doc.name}</div>
                      <div className="text-[10px] text-slate-500">{doc.size} • Uploaded {doc.date}</div>
                    </div>
                  </div>
                  <button className="px-3 py-1 rounded-lg bg-nexus-850 hover:bg-nexus-800 text-cyan-300 font-semibold border border-nexus-700">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REVISION HISTORY / AUDIT TRAIL */}
      {activeTab === 'history' && (
        <div className="tech-card p-6 sm:p-8 space-y-6 animate-fade-in">
          <div className="border-b border-nexus-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <History size={18} className="text-cyan-400" /> Project Edit History & Audit Trail
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Maintains full accountability: who modified project attributes, budgets, or status and when.
            </p>
          </div>

          <div className="space-y-4">
            {project.history?.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">No edit history recorded yet.</div>
            ) : (
              project.history?.map((entry, idx) => {
                const modifier = data.profiles?.find(p => p.id === entry.modified_by);

                return (
                  <div key={entry.id || idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-nexus-950 border border-nexus-850 text-xs">
                    <div className="w-8 h-8 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock size={14} />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{modifier?.full_name || 'Project Editor'}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(entry.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-slate-300">
                        Modified field: <strong className="text-cyan-300 font-mono">{entry.field_changed}</strong>
                        {entry.old_value && (
                          <span> from <span className="line-through text-slate-500">{entry.old_value}</span> to <span className="text-emerald-400 font-semibold">{entry.new_value}</span></span>
                        )}
                        {!entry.old_value && entry.new_value && (
                          <span> set to <span className="text-emerald-400 font-semibold">{entry.new_value}</span></span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nexus-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-nexus-900 border border-nexus-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-nexus-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 size={16} className="text-cyan-400" /> Update Project & Budget
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Ideation">Ideation</option>
                    <option value="Prototyping">Prototyping</option>
                    <option value="Testing">Testing</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estimated Budget (₹)</label>
                  <input
                    type="number"
                    value={editForm.estimated_budget}
                    onChange={(e) => setEditForm({ ...editForm, estimated_budget: Number(e.target.value) })}
                    className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Actual Expenditure (₹)</label>
                <input
                  type="number"
                  value={editForm.actual_expenditure}
                  onChange={(e) => setEditForm({ ...editForm, actual_expenditure: Number(e.target.value) })}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Problem Statement</label>
                <textarea
                  rows={2}
                  value={editForm.problem_statement}
                  onChange={(e) => setEditForm({ ...editForm, problem_statement: e.target.value })}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Proposed Solution</label>
                <textarea
                  rows={2}
                  value={editForm.proposed_solution}
                  onChange={(e) => setEditForm({ ...editForm, proposed_solution: e.target.value })}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-nexus-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-nexus-950 font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Component Modal */}
      {isAddComponentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nexus-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-nexus-900 border border-nexus-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-nexus-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu size={16} className="text-cyan-400" /> Add BOM Component
              </h3>
              <button onClick={() => setIsAddComponentOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddComponentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Component Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RPLiDAR A1 360-deg scanner"
                  value={newComp.name}
                  onChange={(e) => setNewComp({ ...newComp, name: e.target.value })}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newComp.quantity}
                    onChange={(e) => setNewComp({ ...newComp, quantity: Number(e.target.value) })}
                    className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Est. Cost (₹)</label>
                  <input
                    type="number"
                    value={newComp.estimated_cost}
                    onChange={(e) => setNewComp({ ...newComp, estimated_cost: Number(e.target.value) })}
                    className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Technical Specs</label>
                <input
                  type="text"
                  placeholder="e.g. 12m range, 5.5Hz scan rate"
                  value={newComp.specifications}
                  onChange={(e) => setNewComp({ ...newComp, specifications: e.target.value })}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="acqCheck"
                  checked={newComp.is_acquired}
                  onChange={(e) => setNewComp({ ...newComp, is_acquired: e.target.checked })}
                  className="rounded bg-nexus-950 border-nexus-800 text-cyan-500 focus:ring-0"
                />
                <label htmlFor="acqCheck" className="text-slate-300 cursor-pointer">
                  Already acquired in lab inventory
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-nexus-800">
                <button
                  type="button"
                  onClick={() => setIsAddComponentOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-nexus-950 font-bold"
                >
                  Add Component
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
