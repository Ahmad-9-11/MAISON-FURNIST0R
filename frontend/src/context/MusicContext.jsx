import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const MusicContext = createContext(null);

const DEFAULT_SONGS = [
  { id: '1', title: 'Maison Ambient', artist: 'Maison Sound', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '2', title: 'Ethereal Living', artist: 'Nordic Chill', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
];

export function MusicProvider({ children }) {
  const [songs, setSongs] = useState(() => {
    try {
      const saved = localStorage.getItem('furnistor_songs');
      return saved ? JSON.parse(saved) : DEFAULT_SONGS;
    } catch (e) {
      console.error('Failed to parse songs from localStorage', e);
      return DEFAULT_SONGS;
    }
  });
  
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  useEffect(() => {
    localStorage.setItem('furnistor_songs', JSON.stringify(songs));
  }, [songs]);

  const addSong = useCallback((song) => {
    const newSong = { ...song, id: Date.now().toString() };
    setSongs((prev) => [...prev, newSong]);
  }, []);

  const deleteSong = useCallback((id) => {
    setSongs((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (filtered.length === 0) return DEFAULT_SONGS;
      return filtered;
    });
    // Reset index if we delete current song
    setCurrentSongIndex(0);
  }, []);

  const nextSong = useCallback(() => {
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
  }, [songs.length]);

  const value = {
    songs,
    currentSong: songs[currentSongIndex],
    addSong,
    deleteSong,
    nextSong,
    currentSongIndex,
    setCurrentSongIndex
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within a MusicProvider');
  return context;
}
