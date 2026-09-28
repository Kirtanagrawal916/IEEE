import React, { useState } from 'react';
import { X, Sparkles, Upload, Link as LinkIcon, Award, Image as ImageIcon } from 'lucide-react';

export default function SubmitProjectModal({ isOpen, onClose, onSubmitProject }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Digital Marketing');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600');
  const [tags, setTags] = useState('Instagram, Canva, Marketing');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitProject({
      title,
      category,
      description,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600',
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      verified: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-white shadow-2xl relative">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Publish Portfolio Project</h2>
          <p className="text-xs text-slate-400">
            Showcase your completed capstone work to verify your skills & unlock client micro-gigs.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Project Title</label>
            <input
              type="text"
              required
              placeholder="e.g. 7-Day Instagram Content Plan for Handloom Boutique"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500"
              >
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Design">Design & Canva</option>
                <option value="E-Commerce">E-Commerce</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="Canva, Strategy, Social"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Project Description & Results</label>
            <textarea
              required
              rows={3}
              placeholder="Describe what you created, tools used, and key outcomes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500"
            ></textarea>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Image URL or Preview Link</label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-primary justify-center py-3 font-bold mt-2"
          >
            Publish to Public Gallery & Unlock Gigs
          </button>
        </form>

      </div>
    </div>
  );
}
