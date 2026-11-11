import React, { useState } from 'react';
import { useClub } from '../context/ClubContext';
import { 
  User, 
  Mail, 
  GraduationCap, 
  ShieldCheck, 
  Save, 
  Sparkles, 
  Plus, 
  X, 
  Eye, 
  EyeOff,
  Check
} from 'lucide-react';

export const Profile = () => {
  const { currentUser, updateProfile } = useClub();
  
  const [formData, setFormData] = useState({
    full_name: currentUser?.full_name || '',
    usn: currentUser?.usn || '',
    department: currentUser?.department || 'Mechatronics Engineering',
    semester: currentUser?.semester || 5,
    bio: currentUser?.bio || '',
    avatar_url: currentUser?.avatar_url || '',
    is_public: currentUser?.is_public !== undefined ? currentUser.is_public : true
  });

  const [skills, setSkills] = useState(currentUser?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    if (!skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (s) => {
    setSkills(skills.filter(item => item !== s));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      ...formData,
      skills
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-nexus-800 pb-5">
        <div className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-semibold mb-1">
          <User size={14} /> Profile Settings
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          My Member Profile & Technical Skills
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage how your skills, portfolio bio, and directory visibility appear across MECHANEXUS.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Profile Card */}
        <div className="tech-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-nexus-800">
            <img
              src={formData.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(formData.full_name || 'U')}`}
              alt={formData.full_name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-cyan-500/40 shadow-xl"
            />
            <div className="space-y-1.5 text-center sm:text-left">
              <h2 className="text-xl font-bold text-white">{currentUser?.full_name}</h2>
              <div className="text-xs text-slate-400 font-mono">{currentUser?.email}</div>
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 capitalize">
                  {currentUser?.role?.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-400 font-mono">{currentUser?.usn}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">USN</label>
              <input
                type="text"
                value={formData.usn}
                onChange={(e) => setFormData({ ...formData, usn: e.target.value.toUpperCase() })}
                className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white uppercase font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Mechatronics Engineering">Mechatronics Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 text-xs">Bio & Engineering Interests</label>
            <textarea
              rows={3}
              placeholder="Share what engineering verticals you are building or research interests..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {/* Technical Skills Manager */}
          <div className="space-y-3 pt-2">
            <label className="block text-slate-300 font-semibold text-xs">
              Technical Skills & Proficiencies
            </label>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. ROS 2, SolidWorks, KiCad, YOLOv8, STM32..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="flex-1 bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 rounded-xl bg-nexus-800 hover:bg-nexus-750 text-cyan-300 border border-nexus-700 text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus size={14} /> Add Skill
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-nexus-950 border border-nexus-800 text-cyan-300 text-xs font-medium"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-400"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Directory Privacy Toggle */}
          <div className="p-4 rounded-xl bg-nexus-950 border border-nexus-800 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <div className="font-semibold text-white flex items-center gap-1.5">
                {formData.is_public ? <Eye size={14} className="text-cyan-400" /> : <EyeOff size={14} className="text-slate-400" />}
                Public Directory Visibility
              </div>
              <div className="text-[11px] text-slate-400">
                Allow other students and recruiters to view your profile in the Club Member Directory.
              </div>
            </div>

            <input
              type="checkbox"
              checked={formData.is_public}
              onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
              className="rounded bg-nexus-900 border-nexus-700 text-cyan-500 w-4 h-4 focus:ring-0"
            />
          </div>

          {/* Save Action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-nexus-800">
            {savedSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold animate-fade-in">
                <Check size={14} /> Profile updated successfully!
              </span>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-nexus-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
            >
              <Save size={15} /> Save Changes
            </button>
          </div>

        </div>
      </form>

    </div>
  );
};
