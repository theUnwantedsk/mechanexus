import React, { useState } from 'react';
import { useClub } from '../context/ClubContext';
import { 
  History, 
  Search, 
  Filter, 
  Clock, 
  Layers, 
  Workflow, 
  UserCheck, 
  Users, 
  Radio,
  Calendar
} from 'lucide-react';

export const ActivityLogs = () => {
  const { data } = useClub();
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const entityTypes = [
    { id: 'ALL', label: 'All Activities' },
    { id: 'PROJECT', label: 'Projects & BOM' },
    { id: 'TASK', label: 'Smart Tasks' },
    { id: 'TASK_RECORD', label: 'Record Updates' },
    { id: 'TEAM', label: 'Teams & Codes' },
    { id: 'MEMBERSHIP', label: 'Recruitment & Apps' },
    { id: 'EVENT', label: 'Events & Workshops' },
    { id: 'AUTH', label: 'Auth & Logins' }
  ];

  const filteredLogs = data.activityLogs?.filter(log => {
    if (filterType !== 'ALL' && log.entity_type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDetails = log.details?.toLowerCase().includes(q);
      const matchAction = log.action_type?.toLowerCase().includes(q);
      if (!matchDetails && !matchAction) return false;
    }
    return true;
  }) || [];

  const getEntityIcon = (type) => {
    switch (type) {
      case 'PROJECT': return <Layers size={14} className="text-cyan-400" />;
      case 'TASK':
      case 'TASK_RECORD': return <Workflow size={14} className="text-amber-400" />;
      case 'MEMBERSHIP': return <UserCheck size={14} className="text-rose-400" />;
      case 'TEAM': return <Users size={14} className="text-blue-400" />;
      case 'EVENT': return <Calendar size={14} className="text-emerald-400" />;
      default: return <Clock size={14} className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-nexus-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-semibold mb-1">
            <History size={14} /> System Audit Trail
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Activity & Accountability Logs
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time chronological record of who created projects, modified budgets, distributed tasks, and completed responsibilities.
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-nexus-900 border border-nexus-800 px-3.5 py-1.5 rounded-xl font-mono">
          Total Logs: <strong>{data.activityLogs?.length || 0}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search activity details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-nexus-900 border border-nexus-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {entityTypes.map(t => (
            <button
              key={t.id}
              onClick={() => setFilterType(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                filterType === t.id
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500/60 shadow-sm'
                  : 'bg-nexus-900/60 hover:bg-nexus-850 text-slate-400 border-nexus-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table / Stream */}
      <div className="tech-card overflow-hidden border border-nexus-800">
        <div className="divide-y divide-nexus-850">
          {filteredLogs.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <History size={32} className="mx-auto text-slate-600" />
              <p className="text-xs">No activity records match the selected filter.</p>
            </div>
          ) : (
            filteredLogs.map(log => {
              const user = data.profiles?.find(p => p.id === log.user_id);

              return (
                <div
                  key={log.id}
                  className="p-4 hover:bg-nexus-850/40 transition-colors flex items-start gap-4 text-xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-nexus-950 border border-nexus-800 flex items-center justify-center shrink-0 mt-0.5">
                    {getEntityIcon(log.entity_type)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{user?.full_name || 'System Operator'}</span>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-850">
                          {log.action_type}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-slate-300 leading-relaxed">
                      {log.details}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};
