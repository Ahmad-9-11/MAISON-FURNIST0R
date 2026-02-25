import { useState, useRef, useEffect } from 'react';
import { useMusic } from '../context/MusicContext';

export default function MusicPlayer() {
  const { currentSong, nextSong } = useMusic();
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const audioRef = useRef(null);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = volume;
  }, [volume]);

  // Handle track change
  useEffect(() => {
    if (playing && audioRef.current) {
      audioRef.current.play().catch(() => setPlaying(false));
    }
  }, [currentSong, playing]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) a.pause();
    else a.play().catch(() => {});
    setPlaying(!playing);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[300] flex items-center gap-4 rounded-2xl border border-white/20 bg-[#111111]/90 backdrop-blur-md px-5 py-3 shadow-2xl animate-in slide-in-from-left-4 duration-500">
      <audio
        ref={audioRef}
        src={currentSong?.url}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={nextSong}
      />
      
      <div className="relative group">
        <button
          type="button"
          onClick={toggle}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#b87f53] text-white shadow-lg hover:scale-105 transition-transform"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
          ) : (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
      </div>

      <div className="pr-4 border-r border-white/10">
        <p className="text-[13px] font-medium text-white truncate max-w-[120px]">{currentSong?.title}</p>
        <p className="text-[10px] uppercase tracking-widest text-[#b87f53] font-bold mt-0.5">{currentSong?.artist || 'Maison Sound'}</p>
      </div>

      <div className="flex items-center gap-3">
        <svg className="h-3 w-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828 2.828A9 9 0 013 12" /></svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-16 accent-[#b87f53] h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
          aria-label="Volume"
        />
      </div>
      
      <button 
        onClick={nextSong}
        className="text-gray-400 hover:text-white transition-colors"
        aria-label="Next Track"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
      </button>
    </div>
  );
}
