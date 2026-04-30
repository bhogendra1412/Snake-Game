import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 flex flex-col p-4 md:p-8 font-sans relative overflow-hidden select-none">
      <div className="mesh-bg pointer-events-none"></div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-8 h-full">
        
        {/* Header */}
        <header className="flex justify-between items-end shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.4em] text-cyan-400 font-bold mb-1">Project Genesis</span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white italic">
              SONIC<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">SNAKE</span>
            </h1>
          </div>
        </header>

        {/* Central Layout Area */}
        <main className="flex-1 flex flex-col lg:flex-row gap-8 min-h-0">
          
          <section className="flex-1 relative glass rounded-3xl overflow-hidden neon-border-cyan flex items-center justify-center p-4 min-h-[500px]">
             <SnakeGame />
          </section>

          <section className="w-full lg:w-80 flex flex-col shrink-0">
             <MusicPlayer />
          </section>

        </main>

        <footer className="text-[10px] text-slate-600 flex justify-between border-t border-white/5 pt-4 uppercase tracking-[0.2em] shrink-0 mt-4">
          <div>Build v1.0.4-Alpha // Neon Interface</div>
          <div className="hidden md:block">Latency: 12ms // Buffer: 100%</div>
          <div>&copy; 2024 SONIC LABS</div>
        </footer>
      </div>
    </div>
  );
}
