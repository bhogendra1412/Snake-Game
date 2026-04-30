import { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: 'AI Track 1: Neon Genesis', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'AI Track 2: Cyber Synthetics', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'AI Track 3: Gridline Grooves', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => {
        console.error('Playback failed:', e);
        // Browsers block autoplay until user interaction
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <>
      <div className="glass p-4 rounded-2xl flex-1 flex flex-col gap-4 mb-8">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-white/10 pb-2">Playlist</h2>
        <div className="flex flex-col gap-2 overflow-hidden">
          {TRACKS.map((track, idx) => {
            const isActive = idx === currentTrackIndex;
            return (
              <button 
                key={track.id}
                onClick={() => { setCurrentTrackIndex(idx); setIsPlaying(true); }}
                className={`p-3 rounded-xl border flex items-center gap-3 text-left transition-all ${
                  isActive ? 'bg-cyan-500/10 border-cyan-500/30' : 'hover:bg-white/5 border-transparent'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-cyan-500' : 'bg-white/10'}`}>
                  {isActive && <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-black border-b-[6px] border-b-transparent ml-1"></div>}
                </div>
                <div>
                  <p className={`text-sm font-bold leading-none ${isActive ? 'text-white' : 'text-slate-300'}`}>{track.title}</p>
                  <p className={`text-[10px] uppercase mt-1 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>AI Artist</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="glass p-6 rounded-3xl flex flex-col justify-between neon-border-magenta shrink-0">
        <audio
          ref={audioRef}
          src={currentTrack.url}
          onEnded={handleEnded}
          className="hidden"
        />
        
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-40 h-40 bg-gradient-to-br from-cyan-900 to-magenta-900 rounded-2xl relative overflow-hidden flex items-center justify-center group border border-white/20">
            <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className={`text-white font-black text-6xl opacity-20 ${isPlaying ? 'animate-pulse' : ''}`}>AI</div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-400 w-2/3"></div>
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">{currentTrack.title}</h3>
            <p className="text-magenta-400 text-xs font-medium uppercase">Playing via Protocol</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 mt-6">
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full w-[40%] bg-gradient-to-r from-cyan-400 to-magenta-500 transition-all duration-1000"></div>
          </div>
          <div className="flex justify-between items-center px-4">
            <button onClick={handlePrev} className="text-slate-400 hover:text-white transform active:scale-95 transition-all">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center transform active:scale-95 hover:bg-slate-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
              {isPlaying ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
            <button onClick={handleNext} className="text-slate-400 hover:text-white transform active:scale-95 transition-all">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
