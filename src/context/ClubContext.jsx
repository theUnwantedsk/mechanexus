import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initialSeedData } from '../lib/initialSeed';

const ClubContext = createContext(null);

const STORAGE_KEY = 'mechanexus_state_v1';

export const ClubProvider = ({ children }) => {
  // Load state from localStorage or initialSeedData
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse cached state, falling back to seed data:', e);
    }
    return initialSeedData;
  });

  // Current active profile
  const [currentUser, setCurrentUser] = useState(() => {
    return data.profiles.find(p => p.role === 'club_admin') || data.profiles[0];
  });

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }, [data]);

  // Synchronize currentUser if profiles update
  useEffect(() => {
    if (currentUser) {
      const fresh = data.profiles.find(p => p.id === currentUser.id);
      if (fresh && JSON.stringify(fresh) !== JSON.stringify(currentUser)) {
        setCurrentUser(fresh);
      }
    }
  }, [data.profiles, currentUser]);

  // Activity logger helper
  const logActivity = useCallback((action_type, entity_type, entity_id, details) => {
    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: currentUser?.id || 'usr-admin-01',
      action_type,
      entity_type,
      entity_id: String(entity_id),
      details,
      created_at: new Date().toISOString()
    };

    setData(prev => ({
      ...prev,
      activityLogs: [newLog, ...prev.activityLogs]
    }));
  }, [currentUser]);

  // Role / Persona Switcher for painless manual testing across all 4 roles
  const switchRole = (role) => {
    const matched = data.profiles.find(p => p.role === role);
    if (matched) {
      setCurrentUser(matched);
      return matched;
    }
    return currentUser;
  };

  // Auth methods
  const login = (email, password) => {
    const user = data.profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      logActivity('USER_LOGIN', 'AUTH', user.id, `${user.full_name} logged into the portal.`);
      return { success: true, user };
    }
    return { success: false, message: 'Invalid credentials. Use demo selector or registered email.' };
  };

  const register = (profileData) => {
    const existing = data.profiles.find(p => p.email.toLowerCase() === profileData.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'A user with this college email already exists.' };
    }

    const newProfile = {
      id: `usr-${Date.now()}`,
      email: profileData.email,
      full_name: profileData.full_name,
      usn: profileData.usn || '',
      department: profileData.department || 'Mechatronics Engineering',
      semester: Number(profileData.semester) || 1,
      role: profileData.role || 'student',
      skills: profileData.skills || [],
      bio: profileData.bio || '',
      avatar_url: profileData.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(profileData.full_name)}`,
      is_public: true,
      created_at: new Date().toISOString()
    };

    setData(prev => ({
      ...prev,
      profiles: [...prev.profiles, newProfile]
    }));

    setCurrentUser(newProfile);
    logActivity('USER_REGISTERED', 'AUTH', newProfile.id, `New member ${newProfile.full_name} created an account.`);
    return { success: true, user: newProfile };
  };

  const logout = () => {
    logActivity('USER_LOGOUT', 'AUTH', currentUser?.id, `${currentUser?.full_name} logged out.`);
    setCurrentUser(null);
  };

  const updateProfile = (updatedFields) => {
    if (!currentUser) return;
    setData(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => p.id === currentUser.id ? { ...p, ...updatedFields } : p)
    }));
    logActivity('PROFILE_UPDATED', 'PROFILE', currentUser.id, `${currentUser.full_name} updated their profile info.`);
  };

  // ------------------------------------------------------------------
  // Community & Membership Handlers
  // ------------------------------------------------------------------
  const addCommunityPost = (post) => {
    const newPost = {
      id: `post-${Date.now()}`,
      author_id: currentUser?.id || 'usr-admin-01',
      title: post.title,
      content: post.content,
      category: post.category || 'announcement',
      image_url: post.image_url || '',
      is_pinned: Boolean(post.is_pinned),
      event_date: post.event_date || null,
      created_at: new Date().toISOString()
    };

    setData(prev => ({
      ...prev,
      communityPosts: [newPost, ...prev.communityPosts]
    }));

    logActivity('POST_CREATED', 'COMMUNITY', newPost.id, `Published new community post: "${newPost.title}"`);
    return newPost;
  };

  const deleteCommunityPost = (postId) => {
    setData(prev => ({
      ...prev,
      communityPosts: prev.communityPosts.filter(p => p.id !== postId)
    }));
    logActivity('POST_DELETED', 'COMMUNITY', postId, `Deleted community post ID ${postId}`);
  };

  const togglePinPost = (postId) => {
    setData(prev => ({
      ...prev,
      communityPosts: prev.communityPosts.map(p => 
        p.id === postId ? { ...p, is_pinned: !p.is_pinned } : p
      )
    }));
  };

  const submitMembershipApplication = (app) => {
    // Check if duplicate application with same email or USN
    const existing = data.membershipApplications.find(
      a => a.email.toLowerCase() === app.email.toLowerCase() || (app.usn && a.usn.toLowerCase() === app.usn.toLowerCase())
    );
    if (existing && existing.status === 'pending') {
      return { success: false, message: 'An active application with this email or USN is already under review.' };
    }

    const newApp = {
      id: `app-${Date.now()}`,
      full_name: app.full_name,
      email: app.email,
      usn: app.usn,
      department: app.department,
      semester: Number(app.semester),
      technical_interests: app.technical_interests || [],
      skills_description: app.skills_description,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    setData(prev => ({
      ...prev,
      membershipApplications: [newApp, ...prev.membershipApplications]
    }));

    logActivity('MEMBERSHIP_APPLICATION_SUBMITTED', 'MEMBERSHIP', newApp.id, `Application submitted by ${newApp.full_name} (${newApp.usn}).`);
    return { success: true, application: newApp };
  };

  const reviewMembershipApplication = (appId, status, notes = '') => {
    const app = data.membershipApplications.find(a => a.id === appId);
    if (!app) return { success: false, message: 'Application not found.' };

    setData(prev => ({
      ...prev,
      membershipApplications: prev.membershipApplications.map(a => 
        a.id === appId 
          ? { ...a, status, reviewed_by: currentUser?.id, reviewed_at: new Date().toISOString(), admin_notes: notes }
          : a
      )
    }));

    if (status === 'approved') {
      // Auto-create student profile if not exists
      const existingProfile = data.profiles.find(p => p.email.toLowerCase() === app.email.toLowerCase());
      if (!existingProfile) {
        const newProfile = {
          id: `usr-${Date.now()}`,
          email: app.email,
          full_name: app.full_name,
          usn: app.usn,
          department: app.department,
          semester: app.semester,
          role: 'student',
          skills: app.technical_interests,
          bio: app.skills_description,
          avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(app.full_name)}`,
          is_public: true,
          created_at: new Date().toISOString()
        };

        setData(prev => ({
          ...prev,
          profiles: [...prev.profiles, newProfile]
        }));
      }
    }

    logActivity(
      status === 'approved' ? 'MEMBERSHIP_APPROVED' : 'MEMBERSHIP_REJECTED',
      'MEMBERSHIP',
      appId,
      `${status === 'approved' ? 'Approved' : 'Rejected'} membership application for ${app.full_name}.`
    );

    return { success: true };
  };

  // ------------------------------------------------------------------
  // Team Management Handlers
  // ------------------------------------------------------------------
  const createTeam = (teamData) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newTeam = {
      id: `team-${Date.now()}`,
      name: teamData.name,
      team_code: code,
      domain: teamData.domain || 'Robotics & Mechatronics',
      description: teamData.description || '',
      leader_id: teamData.leader_id || currentUser?.id,
      created_by: currentUser?.id,
      created_at: new Date().toISOString(),
      members: [teamData.leader_id || currentUser?.id]
    };

    setData(prev => ({
      ...prev,
      teams: [...prev.teams, newTeam]
    }));

    logActivity('TEAM_CREATED', 'TEAM', newTeam.id, `Created team "${newTeam.name}" with code ${code}.`);
    return newTeam;
  };

  const joinTeamByCode = (teamCode) => {
    const normalizedCode = teamCode.trim().toUpperCase();
    const team = data.teams.find(t => t.team_code === normalizedCode);
    if (!team) {
      return { success: false, message: 'Invalid team invite code. Please check and try again.' };
    }

    if (team.members?.includes(currentUser?.id)) {
      return { success: false, message: 'You are already a member of this team.' };
    }

    setData(prev => ({
      ...prev,
      teams: prev.teams.map(t => 
        t.id === team.id 
          ? { ...t, members: [...(t.members || []), currentUser?.id] }
          : t
      )
    }));

    logActivity('TEAM_JOINED', 'TEAM', team.id, `${currentUser?.full_name} joined team "${team.name}" using code.`);
    return { success: true, team };
  };

  // ------------------------------------------------------------------
  // Project Management Handlers
  // ------------------------------------------------------------------
  const createProject = (projData) => {
    const newProj = {
      id: `proj-${Date.now()}`,
      team_id: projData.team_id || null,
      title: projData.title,
      category: projData.category || 'Robotics',
      status: projData.status || 'Ideation',
      problem_statement: projData.problem_statement || '',
      proposed_solution: projData.proposed_solution || '',
      estimated_budget: Number(projData.estimated_budget) || 0,
      actual_expenditure: Number(projData.actual_expenditure) || 0,
      documents: projData.documents || [],
      images: projData.images || ['https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800'],
      components: projData.components || [],
      history: [
        {
          id: `h-${Date.now()}`,
          modified_by: currentUser?.id,
          field_changed: 'created',
          old_value: null,
          new_value: 'Project initialized',
          created_at: new Date().toISOString()
        }
      ],
      created_by: currentUser?.id,
      created_at: new Date().toISOString()
    };

    setData(prev => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));

    logActivity('PROJECT_CREATED', 'PROJECT', newProj.id, `Created project "${newProj.title}"`);
    return newProj;
  };

  const updateProject = (projectId, updatedFields) => {
    const current = data.projects.find(p => p.id === projectId);
    if (!current) return;

    // Detect history changes
    const historyEntries = [];
    ['status', 'estimated_budget', 'actual_expenditure', 'title'].forEach(field => {
      if (updatedFields[field] !== undefined && String(updatedFields[field]) !== String(current[field])) {
        historyEntries.push({
          id: `h-${Date.now()}-${field}`,
          modified_by: currentUser?.id,
          field_changed: field,
          old_value: String(current[field]),
          new_value: String(updatedFields[field]),
          created_at: new Date().toISOString()
        });
      }
    });

    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => 
        p.id === projectId 
          ? { 
              ...p, 
              ...updatedFields, 
              history: [...(p.history || []), ...historyEntries] 
            }
          : p
      )
    }));

    logActivity('PROJECT_UPDATED', 'PROJECT', projectId, `Updated project "${current.title}" (${historyEntries.map(h => h.field_changed).join(', ') || 'details'})`);
  };

  const addProjectComponent = (projectId, comp) => {
    const newComp = {
      id: `c-${Date.now()}`,
      name: comp.name,
      quantity: Number(comp.quantity) || 1,
      specifications: comp.specifications || '',
      estimated_cost: Number(comp.estimated_cost) || 0,
      is_acquired: Boolean(comp.is_acquired)
    };

    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => 
        p.id === projectId 
          ? { ...p, components: [...(p.components || []), newComp] }
          : p
      )
    }));

    logActivity('BOM_COMPONENT_ADDED', 'PROJECT', projectId, `Added BOM component: ${newComp.name} (${newComp.quantity} pcs)`);
  };

  const toggleComponentAcquired = (projectId, compId) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          components: p.components.map(c => 
            c.id === compId ? { ...c, is_acquired: !c.is_acquired } : c
          )
        };
      })
    }));
  };

  // ------------------------------------------------------------------
  // Smart Task Distribution Engine
  // ------------------------------------------------------------------
  const calculateStudentWorkloads = () => {
    const workloads = {};
    // Initialize for all student profiles
    data.profiles.forEach(p => {
      workloads[p.id] = {
        student: p,
        totalAllocated: 0,
        inProgress: 0,
        completed: 0
      };
    });

    data.tasks.forEach(task => {
      task.records?.forEach(rec => {
        if (rec.assigned_to && workloads[rec.assigned_to]) {
          workloads[rec.assigned_to].totalAllocated += 1;
          if (rec.status === 'Completed') {
            workloads[rec.assigned_to].completed += 1;
          } else {
            workloads[rec.assigned_to].inProgress += 1;
          }
        }
      });
    });

    return workloads;
  };

  const distributeRecordsFairly = (records, studentIds) => {
    if (!studentIds.length) return records;

    const workloads = calculateStudentWorkloads();
    
    // Sort selected students by current active (in-progress) workload ascending
    // Students with lighter existing workloads receive remainder records first
    const sortedStudents = [...studentIds].sort((a, b) => {
      const loadA = workloads[a]?.inProgress || 0;
      const loadB = workloads[b]?.inProgress || 0;
      return loadA - loadB;
    });

    const n = sortedStudents.length;
    return records.map((rec, index) => {
      const assignedStudentId = sortedStudents[index % n];
      return {
        ...rec,
        id: rec.id || `rec-${Date.now()}-${index}`,
        assigned_to: assignedStudentId,
        status: rec.status || 'Not Started',
        student_notes: rec.student_notes || ''
      };
    });
  };

  const createTaskWithDistribution = (taskData, verifiedRecords, selectedStudentIds) => {
    const distributedRecords = distributeRecordsFairly(verifiedRecords, selectedStudentIds);

    // Compute assignments summary
    const assignmentsMap = {};
    selectedStudentIds.forEach(id => {
      assignmentsMap[id] = { student_id: id, allocated_count: 0, completed_count: 0 };
    });
    distributedRecords.forEach(rec => {
      if (rec.assigned_to && assignmentsMap[rec.assigned_to]) {
        assignmentsMap[rec.assigned_to].allocated_count += 1;
      }
    });

    const newTask = {
      id: `task-${Date.now()}`,
      title: taskData.title,
      description: taskData.description || '',
      deadline: taskData.deadline || null,
      created_by: currentUser?.id,
      total_records: distributedRecords.length,
      completed_records: 0,
      status: 'In Progress',
      source_filename: taskData.source_filename || 'manual_entry.xlsx',
      created_at: new Date().toISOString(),
      assignments: Object.values(assignmentsMap),
      records: distributedRecords
    };

    setData(prev => ({
      ...prev,
      tasks: [newTask, ...prev.tasks]
    }));

    logActivity('TASK_DISTRIBUTED', 'TASK', newTask.id, `Distributed ${distributedRecords.length} records fairly among ${selectedStudentIds.length} students for "${newTask.title}".`);
    return newTask;
  };

  const updateTaskRecordStatus = (taskId, recordId, newStatus, studentNotes = '') => {
    setData(prev => {
      const task = prev.tasks.find(t => t.id === taskId);
      if (!task) return prev;

      let completedDelta = 0;
      const updatedRecords = task.records.map(r => {
        if (r.id === recordId) {
          if (r.status !== 'Completed' && newStatus === 'Completed') completedDelta = 1;
          if (r.status === 'Completed' && newStatus !== 'Completed') completedDelta = -1;
          return {
            ...r,
            status: newStatus,
            student_notes: studentNotes !== undefined ? studentNotes : r.student_notes
          };
        }
        return r;
      });

      const newCompletedTotal = (task.completed_records || 0) + completedDelta;
      const overallStatus = newCompletedTotal >= task.total_records ? 'Completed' : 'In Progress';

      return {
        ...prev,
        tasks: prev.tasks.map(t => 
          t.id === taskId 
            ? { 
                ...t, 
                records: updatedRecords, 
                completed_records: Math.max(0, newCompletedTotal),
                status: overallStatus
              }
            : t
        )
      };
    });

    logActivity('TASK_RECORD_UPDATED', 'TASK_RECORD', recordId, `Updated status to "${newStatus}" for record in task.`);
  };

  const reassignTaskRecord = (taskId, recordId, newStudentId) => {
    setData(prev => {
      const task = prev.tasks.find(t => t.id === taskId);
      if (!task) return prev;

      const updatedRecords = task.records.map(r => 
        r.id === recordId ? { ...r, assigned_to: newStudentId } : r
      );

      return {
        ...prev,
        tasks: prev.tasks.map(t => 
          t.id === taskId ? { ...t, records: updatedRecords } : t
        )
      };
    });

    const targetStudent = data.profiles.find(p => p.id === newStudentId);
    logActivity('TASK_RECORD_REASSIGNED', 'TASK_RECORD', recordId, `Reassigned record to ${targetStudent?.full_name || 'student'}.`);
  };

  // ------------------------------------------------------------------
  // Events & Workshops Handlers
  // ------------------------------------------------------------------
  const createEvent = (eventData) => {
    const newEvent = {
      id: `event-${Date.now()}`,
      title: eventData.title,
      description: eventData.description || '',
      event_date: eventData.event_date,
      venue: eventData.venue || 'MITE Campus',
      banner_url: eventData.banner_url || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000',
      status: eventData.status || 'Upcoming',
      schedule: eventData.schedule || [],
      responsibilities: eventData.responsibilities || [],
      created_by: currentUser?.id,
      created_at: new Date().toISOString()
    };

    setData(prev => ({
      ...prev,
      events: [newEvent, ...prev.events]
    }));

    logActivity('EVENT_CREATED', 'EVENT', newEvent.id, `Created event "${newEvent.title}" on ${new Date(newEvent.event_date).toLocaleDateString()}`);
    return newEvent;
  };

  const toggleEventDuty = (eventId, dutyId) => {
    setData(prev => ({
      ...prev,
      events: prev.events.map(ev => {
        if (ev.id !== eventId) return ev;
        return {
          ...ev,
          responsibilities: ev.responsibilities.map(r => 
            r.id === dutyId ? { ...r, is_completed: !r.is_completed } : r
          )
        };
      })
    }));
  };

  const assignEventDuty = (eventId, studentId, area, dutyDetails) => {
    const newDuty = {
      id: `er-${Date.now()}`,
      student_id: studentId,
      area,
      duty_details: dutyDetails,
      is_completed: false
    };

    setData(prev => ({
      ...prev,
      events: prev.events.map(ev => 
        ev.id === eventId 
          ? { ...ev, responsibilities: [...(ev.responsibilities || []), newDuty] }
          : ev
      )
    }));

    const student = data.profiles.find(p => p.id === studentId);
    logActivity('EVENT_DUTY_ASSIGNED', 'EVENT', eventId, `Assigned "${area}" duty to ${student?.full_name}.`);
  };

  const resetAllDataToSeed = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(initialSeedData);
    setCurrentUser(initialSeedData.profiles[0]);
  };

  const value = {
    data,
    currentUser,
    setCurrentUser,
    switchRole,
    login,
    register,
    logout,
    updateProfile,
    // Community & Memberships
    addCommunityPost,
    deleteCommunityPost,
    togglePinPost,
    submitMembershipApplication,
    reviewMembershipApplication,
    // Teams
    createTeam,
    joinTeamByCode,
    // Projects
    createProject,
    updateProject,
    addProjectComponent,
    toggleComponentAcquired,
    // Tasks
    calculateStudentWorkloads,
    createTaskWithDistribution,
    updateTaskRecordStatus,
    reassignTaskRecord,
    // Events
    createEvent,
    toggleEventDuty,
    assignEventDuty,
    // Logs & Utilities
    logActivity,
    resetAllDataToSeed,
    isSupabaseConfigured
  };

  return <ClubContext.Provider value={value}>{children}</ClubContext.Provider>;
};

export const useClub = () => {
  const context = useContext(ClubContext);
  if (!context) {
    throw new Error('useClub must be used within a ClubProvider');
  }
  return context;
};
