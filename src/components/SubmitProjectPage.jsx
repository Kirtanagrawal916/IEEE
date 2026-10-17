import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Award, 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  CheckCircle2, 
  Tag, 
  Eye, 
  Send,
  Layers,
  HelpCircle
} from 'lucide-react';
import { triggerCelebrationConfetti } from '../utils/confettiHelper';

export default function SubmitProjectPage({ user, onSubmitProject, showToast }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Digital Marketing');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600');
  const [tags, setTags] = useState('Instagram, Canva, Marketing');
  const [projectLink, setProjectLink] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const categories = [
    'Digital Marketing', 
    'Canva & Design', 
    'Content Writing', 
    'E-Commerce & Shopify', 
    'Social Media Management'
  ];

  const sampleImages = [
    { label: 'Social Media', url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600' },
    { label: 'Brand Design', url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80&w=600' },
    { label: 'E-Commerce', url: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=600' },
    { label: 'Content Writing', url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsPublishing(true);

    const newProject = {
      title,
      category,
      description,
      imageUrl: imageUrl || sampleImages[0].url,
      link: projectLink,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      verified: true
    };

    try {
      if (onSubmitProject) {
        await onSubmitProject(newProject);
      }
      triggerCelebrationConfetti();
      navigate('/portfolio');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] dark:bg-[#0F0918] text-[#1F2937] dark:text-white transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-slate-800 text-xs font-bold transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio Showcase</span>
          </Link>

          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Publish New Work Sample
          </span>
        </div>

        {/* Title Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-200 dark:border-purple-500/30 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 flex items-center justify-center text-white shadow-lg shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Publish Portfolio Project
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Add verified capstone deliverables to your public showcase to attract client micro-gigs.
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Form & Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Input Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-200 dark:border-purple-500/30 p-6 sm:p-8 shadow-md">
              <form onSubmit={handleSubmit} className="space-y-5 text-xs font-bold">
                
                {/* Project Title */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1.5">
                    Project Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 7-Day Instagram Content Plan for Handloom Boutique"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold"
                  />
                </div>

                {/* Category & Tags in Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1.5">
                      Skill Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1.5">
                      Skills & Tools (Comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="Canva, Instagram, SEO"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Project Description */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1.5">
                    Project Description & Solution <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe what challenge you solved, the brand you created for, and key deliverables produced..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold leading-relaxed"
                  />
                </div>

                {/* External / Canva Link */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1.5">
                    Live Demo / Canva / Drive Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://canva.com/design/... or Google Drive link"
                    value={projectLink}
                    onChange={(e) => setProjectLink(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold font-mono"
                  />
                </div>

                {/* Cover Image & Presets */}
                <div className="space-y-2">
                  <label className="block text-slate-700 dark:text-slate-300">
                    Project Preview Image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold font-mono"
                  />

                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Quick Image Presets:</span>
                    {sampleImages.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImageUrl(s.url)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                          imageUrl === s.url 
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-extrabold text-xs shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
                >
                  {isPublishing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Publishing Project...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Publish Project to Public Portfolio</span>
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>

          {/* Right: Live Preview Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-200 dark:border-purple-500/30 p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-500/20 pb-3">
                <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4" /> Live Card Preview
                </span>
                <span className="text-[10px] text-slate-400">Public Showcase View</span>
              </div>

              {/* The Actual Portfolio Card Preview */}
              <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-purple-500/30 overflow-hidden shadow-lg space-y-0">
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img
                    src={imageUrl || sampleImages[0].url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = sampleImages[0].url;
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {category}
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Skill
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'}
                      alt="Creator"
                      className="w-8 h-8 rounded-full object-cover border border-purple-400"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {user?.name || 'Your Name'}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {user?.location || 'India'} • Track: {category}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {title || 'Your Project Title Will Appear Here'}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {description || 'Provide a compelling description of what you designed or built to showcase your practical expertise.'}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {tags.split(',').map((t, idx) => (
                      <span
                        key={idx}
                        className="bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-[9px] font-bold px-2 py-0.5 rounded-md"
                      >
                        #{t.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
                💡 Projects in the public showcase are linked to your profile and displayed to clients seeking verified candidates for paid micro-gigs.
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
