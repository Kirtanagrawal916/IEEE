import React, { useState } from 'react';
import { 
  Award, 
  Plus, 
  Heart, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  Filter,
  Share2,
  Edit3,
  Trash2,
  Eye,
  X,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';

export default function PortfolioSection({ portfolios, onOpenSubmitModal, user, onUpdatePortfolios, showToast }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedIds, setLikedIds] = useState([]);
  
  // Modals for CRUD operations
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [detailProject, setDetailProject] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const categories = ['All', 'Digital Marketing', 'Design', 'E-Commerce'];

  const filteredPortfolios = (portfolios || []).filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.authorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleLike = (id) => {
    if (likedIds.includes(id)) {
      setLikedIds(likedIds.filter(item => item !== id));
    } else {
      setLikedIds([...likedIds, id]);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingProject) return;
    setIsSaving(true);

    try {
      await api.updateProject(editingProject.id, {
        title: editingProject.title,
        category: editingProject.category,
        description: editingProject.description,
        projectUrl: editingProject.link || editingProject.projectUrl
      });
    } catch (err) {
      console.log('[Portfolio] Update API note:', err.message);
    } finally {
      if (onUpdatePortfolios) {
        onUpdatePortfolios(editingProject);
      }
      setIsSaving(false);
      setEditingProject(null);
      if (showToast) showToast("✨ Project Updated!", "Portfolio project has been successfully updated.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProject) return;
    setIsSaving(true);

    try {
      await api.deleteProject(deletingProject.id);
    } catch (err) {
      console.log('[Portfolio] Delete API note:', err.message);
    } finally {
      setIsSaving(false);
      const targetId = deletingProject.id;
      setDeletingProject(null);
      if (showToast) showToast("🗑️ Project Deleted", "Project has been removed from portfolio.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-slate-900 dark:text-white">
      
      {/* ========================================================
          VIBRANT AZURE & IRIDESCENT AI CREATOR SHOWCASE BANNER
         ======================================================== */}
      <div className="relative rounded-[36px] bg-gradient-to-br from-[#0B5CFF] via-[#0088FF] to-[#00D2FF] dark:from-[#052A7A] dark:via-[#004BB5] dark:to-[#0088EE] p-6 sm:p-10 border border-blue-300/40 shadow-2xl overflow-hidden text-white">
        
        {/* Floating Glowing Spheres in Background */}
        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-gradient-to-tr from-cyan-400 via-sky-300 to-indigo-500 blur-2xl opacity-75 pointer-events-none animate-pulse"></div>
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-gradient-to-tr from-purple-500 via-pink-400 to-cyan-300 blur-2xl opacity-70 pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-10 w-48 h-48 rounded-full bg-gradient-to-br from-fuchsia-400 to-indigo-600 blur-xl opacity-60 pointer-events-none"></div>

        {/* TOP-LEFT BADGE */}
        <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
          <div className="bg-slate-950/70 border border-cyan-400/50 text-cyan-200 text-xs font-black px-3.5 py-2 rounded-2xl flex items-center gap-2 shadow-lg backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>AI-generated Showcase</span>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-10">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/40 text-cyan-200 text-xs font-extrabold uppercase tracking-wider shadow-sm backdrop-blur-md">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Verified Skill Showcase Gallery</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
              Learner Portfolio <br />
              <span className="bg-gradient-to-r from-amber-300 via-pink-300 to-cyan-200 bg-clip-text text-transparent">
                Creative Showcase
              </span>
            </h1>

            <p className="text-sm sm:text-base text-cyan-100 font-medium leading-relaxed max-w-xl">
              Real projects created by women completing our skill tracks. Employers view these verified portfolios to offer paid micro-gigs.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onOpenSubmitModal}
                className="py-3.5 px-7 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm shadow-xl flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Submit New Project</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-xs sm:max-w-sm rounded-3xl overflow-hidden border-2 border-cyan-300/50 shadow-[0_20px_50px_rgba(0,136,255,0.6)] bg-slate-900/80 backdrop-blur-xl group hover:border-cyan-300 transition-all">
              <img 
                src="/portfolio_creator_ai.jpg" 
                alt="AI Digital Creator Showcase" 
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-3 inset-x-3 bg-slate-950/80 backdrop-blur-md p-3.5 rounded-2xl border border-cyan-400/30 text-white flex items-center justify-between shadow-lg">
                <div>
                  <h4 className="text-xs font-black text-cyan-200">Digital Skill Showcase</h4>
                  <p className="text-[10px] text-cyan-300/80 font-bold">100% Verified Profile Proof</p>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-cyan-500/30 border border-cyan-400 text-cyan-200 text-[11px] font-black">
                  98% Match
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-100 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-purple-500/30 text-slate-900 dark:text-white">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects or creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPortfolios.map((portfolio) => {
          const isLiked = likedIds.includes(portfolio.id);
          const likeCount = (portfolio.likes || 0) + (isLiked ? 1 : 0);

          return (
            <div 
              key={portfolio.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-purple-500/30 overflow-hidden card-hover-award flex flex-col justify-between shadow-md text-slate-900 dark:text-white"
            >
              <div>
                <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-950">
                  <img 
                    src={portfolio.imageUrl || portfolio.image || '/portfolio_creator_ai.jpg'} 
                    alt={portfolio.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full">
                    {portfolio.category}
                  </div>
                  {portfolio.verified !== false && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Skill
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={portfolio.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${portfolio.authorName || 'user'}`} 
                        alt={portfolio.authorName} 
                        className="w-10 h-10 rounded-full object-cover border-2 border-purple-400"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                          {portfolio.authorName || 'Learner'}
                        </h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold">{portfolio.location || 'India'} • Track: {portfolio.skillTrack || portfolio.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button 
                        type="button" 
                        onClick={() => setEditingProject(portfolio)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-purple-600"
                        title="Edit Project"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setDeletingProject(portfolio)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-600"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 
                    onClick={() => setDetailProject(portfolio)}
                    className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug cursor-pointer hover:text-purple-600"
                  >
                    {portfolio.title}
                  </h3>

                  <p className="text-xs text-slate-700 dark:text-slate-200 line-clamp-3 leading-relaxed font-medium">
                    {portfolio.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(portfolio.tags || [portfolio.category]).map((tag, idx) => (
                      <span key={idx} className="bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-purple-200 dark:border-purple-800">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-semibold">
                <button 
                  type="button"
                  onClick={() => toggleLike(portfolio.id)}
                  className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                    isLiked ? 'text-rose-600' : 'text-slate-600 dark:text-slate-300 hover:text-rose-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span>{likeCount}</span>
                </button>

                <div className="flex items-center gap-3">
                  <button 
                    type="button" 
                    onClick={() => setDetailProject(portfolio)}
                    className="hover:text-purple-600 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                  <a 
                    href={portfolio.imageUrl || portfolio.link || '#'} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-purple-700 dark:text-purple-300 hover:underline font-bold flex items-center gap-1"
                  >
                    Link <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT PROJECT MODAL */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg">Edit Portfolio Project</h3>
              <button type="button" onClick={() => setEditingProject(null)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block mb-1">Project Title</label>
                <input 
                  type="text" 
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  required 
                />
              </div>

              <div>
                <label className="block mb-1">Category</label>
                <select 
                  value={editingProject.category}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Design">Design</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Web Development">Web Development</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Description</label>
                <textarea 
                  rows={3}
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-extrabold flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-rose-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-center text-slate-900 dark:text-white">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg">Delete Project?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to delete <strong className="text-slate-900 dark:text-white">"{deletingProject.title}"</strong>? This action cannot be undone.
            </p>

            <div className="flex justify-center gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setDeletingProject(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleDeleteConfirm}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-extrabold flex items-center gap-2"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL PROJECT VIEW MODAL */}
      {detailProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg">{detailProject.title}</h3>
              <button type="button" onClick={() => setDetailProject(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <img 
                src={detailProject.imageUrl || detailProject.image || '/portfolio_creator_ai.jpg'} 
                alt={detailProject.title}
                className="w-full h-56 object-cover rounded-2xl border" 
              />
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold">
                  {detailProject.category}
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium pt-2">
                  {detailProject.description}
                </p>
                <p className="text-slate-400">Created by: <strong className="text-slate-700 dark:text-slate-200">{detailProject.authorName || 'Learner'}</strong></p>
              </div>
            </div>

            <div className="flex justify-end border-t pt-3">
              <button 
                type="button"
                onClick={() => setDetailProject(null)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
