import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClub } from '../context/ClubContext';
import { 
  Pin, 
  Calendar, 
  Award, 
  Sparkles, 
  Tag, 
  Plus, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Send,
  Zap,
  Users
} from 'lucide-react';

export const CommunityFeed = () => {
  const { data, currentUser, addCommunityPost, deleteCommunityPost, togglePinPost } = useClub();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'announcement',
    image_url: '',
    is_pinned: false,
    event_date: ''
  });

  const categories = [
    { id: 'all', label: 'All Updates' },
    { id: 'announcement', label: 'Announcements' },
    { id: 'workshop', label: 'Workshops & Events' },
    { id: 'project_showcase', label: 'Project Showcases' },
    { id: 'achievement', label: 'Achievements' },
  ];

  const canManage = currentUser && ['club_admin', 'coordinator'].includes(currentUser.role);

  // Filter posts
  const filteredPosts = data.communityPosts?.filter(post => {
    if (selectedCategory === 'all') return true;
    return post.category === selectedCategory;
  }) || [];

  // Sort: pinned first, then newest
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.is_pinned === b.is_pinned) {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    return a.is_pinned ? -1 : 1;
  });

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    addCommunityPost(newPost);
    setNewPost({
      title: '',
      content: '',
      category: 'announcement',
      image_url: '',
      is_pinned: false,
      event_date: ''
    });
    setIsModalOpen(false);
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'achievement':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs px-2.5 py-0.5 rounded-full font-semibold">Achievement</span>;
      case 'workshop':
        return <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs px-2.5 py-0.5 rounded-full font-semibold">Workshop</span>;
      case 'project_showcase':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs px-2.5 py-0.5 rounded-full font-semibold">Project Showcase</span>;
      default:
        return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs px-2.5 py-0.5 rounded-full font-semibold">Announcement</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-nexus-900 via-nexus-850 to-nexus-900 border border-cyan-500/20 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wide uppercase">
            <Zap size={14} className="text-cyan-400 animate-pulse" /> Official Club Hub • MITE Moodabidre
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Innovate. Automate. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
              Build the Future with MECHANEXUS.
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            The flagship Mechatronics engineering collective at MITE. We design autonomous planetary rovers, industrial 6-DOF robotic arms, agricultural UAVs, and next-gen embedded IoT systems.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/join"
              className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-nexus-950 shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Sparkles size={16} /> Join MECHANEXUS 2026
            </Link>
            <Link
              to="/directory"
              className="px-5 py-3 rounded-xl font-semibold text-sm bg-nexus-800/80 hover:bg-nexus-750 text-slate-200 border border-nexus-700 transition-all flex items-center gap-2"
            >
              <Users size={16} /> Member Directory
            </Link>
            {currentUser && (
              <Link
                to="/dashboard"
                className="px-5 py-3 rounded-xl font-semibold text-sm bg-nexus-900 hover:bg-nexus-850 text-cyan-400 border border-cyan-500/30 transition-all flex items-center gap-2"
              >
                Go to Portal <ChevronRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Community Feed Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-nexus-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            Club Community Feed
          </h2>
          <p className="text-xs text-slate-400">
            Real-time updates, event announcements, workshop alerts, and project achievements.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-nexus-950 flex items-center gap-2 shadow-md shadow-cyan-500/20 transition-all"
          >
            <Plus size={16} /> Post Announcement
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat.id
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500/60 shadow-sm'
                : 'bg-nexus-900/60 hover:bg-nexus-850 text-slate-400 hover:text-white border-nexus-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Posts Stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPosts.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 space-y-3">
            <Tag size={36} className="mx-auto text-slate-600" />
            <p className="text-sm font-medium">No community updates found in this category.</p>
          </div>
        ) : (
          sortedPosts.map(post => {
            const author = data.profiles?.find(p => p.id === post.author_id);
            return (
              <article
                key={post.id}
                className={`tech-card flex flex-col justify-between overflow-hidden group ${
                  post.is_pinned ? 'ring-1 ring-cyan-500/40 bg-nexus-900/90' : ''
                }`}
              >
                <div>
                  {/* Image banner if present */}
                  {post.image_url && (
                    <div className="relative h-48 w-full overflow-hidden bg-nexus-950 border-b border-nexus-800">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      {post.is_pinned && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-cyan-500 text-nexus-950 text-[11px] font-extrabold flex items-center gap-1 shadow-md">
                          <Pin size={12} className="fill-current" /> PINNED
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      {getCategoryBadge(post.category)}
                      {post.event_date && (
                        <span className="text-[11px] text-cyan-400 font-mono flex items-center gap-1">
                          <Calendar size={12} /> {new Date(post.event_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line line-clamp-4">
                      {post.content}
                    </p>
                  </div>
                </div>

                {/* Post Footer */}
                <div className="p-5 pt-0 border-t border-nexus-800/60 mt-4 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <img
                      src={author?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(author?.full_name || 'M')}`}
                      alt={author?.full_name || 'Admin'}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="truncate max-w-[120px] font-medium text-slate-300">{author?.full_name || 'MECHANEXUS Admin'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>

                    {canManage && (
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={() => togglePinPost(post.id)}
                          title={post.is_pinned ? 'Unpin' : 'Pin to top'}
                          className={`p-1 rounded hover:bg-nexus-800 ${post.is_pinned ? 'text-cyan-400' : 'text-slate-500'}`}
                        >
                          <Pin size={13} className={post.is_pinned ? 'fill-current' : ''} />
                        </button>
                        <button
                          onClick={() => deleteCommunityPost(post.id)}
                          title="Delete post"
                          className="p-1 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Post Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nexus-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-nexus-900 border border-nexus-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-nexus-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles size={18} className="text-cyan-400" /> New Community Post
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MECHANEXUS Rover Team Secures 1st Prize!"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="announcement">Announcement</option>
                    <option value="workshop">Workshop</option>
                    <option value="project_showcase">Project Showcase</option>
                    <option value="achievement">Achievement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Event Date (Optional)</label>
                  <input
                    type="date"
                    value={newPost.event_date}
                    onChange={(e) => setNewPost({ ...newPost, event_date: e.target.value })}
                    className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newPost.image_url}
                  onChange={(e) => setNewPost({ ...newPost, image_url: e.target.value })}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Content / Description *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details about the update, guidelines, schedule or achievements..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={newPost.is_pinned}
                  onChange={(e) => setNewPost({ ...newPost, is_pinned: e.target.checked })}
                  className="rounded bg-nexus-950 border-nexus-800 text-cyan-500 focus:ring-0"
                />
                <label htmlFor="pinCheck" className="text-slate-300 cursor-pointer">
                  Pin this announcement to top of feed
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-nexus-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-nexus-950 font-bold shadow-md shadow-cyan-500/20"
                >
                  Publish Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
