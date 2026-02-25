import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMusic } from '../../context/MusicContext';

export default function MusicManagementPage() {
  const { songs, addSong, deleteSong } = useMusic();
  const [form, setForm] = useState({ title: '', artist: '', url: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.url) return;
    addSong(form);
    setForm({ title: '', artist: '', url: '' });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="font-heading text-4xl font-light text-[#111] mb-10 ml-8">Aural Atmosphere</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 p-8">
        {/* Add Song Form */}
        <div className="rounded-2xl bg-white border border-[#e5e7eb] p-8 shadow-sm h-fit">
          <h3 className="font-heading text-2xl font-light text-[#111] mb-6">New Composition</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Track Title</label>
              <input 
                type="text" 
                value={form.title} 
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border-b border-[#e5e7eb] py-2 focus:border-[#b87f53] focus:outline-none transition-colors"
                placeholder="e.g. Midnight Lounge"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Artist / Composer</label>
              <input 
                type="text" 
                value={form.artist} 
                onChange={(e) => setForm({ ...form, artist: e.target.value })}
                className="w-full border-b border-[#e5e7eb] py-2 focus:border-[#b87f53] focus:outline-none transition-colors"
                placeholder="Artist name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Audio URL (MP3)</label>
              <input 
                type="url" 
                value={form.url} 
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="w-full border-b border-[#e5e7eb] py-2 focus:border-[#b87f53] focus:outline-none transition-colors"
                placeholder="https://..."
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full rounded-full bg-[#111] py-3 text-sm font-semibold text-white hover:bg-[#b87f53] transition-all shadow-md"
            >
              Add to Repertoire
            </button>
          </form>
        </div>

        {/* Songs List */}
        <div className="rounded-2xl bg-white border border-[#e5e7eb] overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#faf9f8] border-b border-[#e5e7eb]">
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-500">Track</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-500">Artist</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {songs.map((song) => (
                <tr key={song.id} className="group hover:bg-[#fafafa] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 rounded-full bg-[#f3f1ef] flex items-center justify-center text-[#b87f53]">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                      </div>
                      <p className="font-medium text-[#111]">{song.title}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-gray-500">{song.artist || 'Unknown'}</td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => deleteSong(song.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
