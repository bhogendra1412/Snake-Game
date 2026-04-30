import { useState, useEffect, useRef, useCallback } from 'react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 180;

type Point = { x: number; y: number };

const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIR = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [dir, setDir] = useState<Point>(INITIAL_DIR);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const dirRef = useRef(dir);
  dirRef.current = dir;
  
  const lastUpdateDirRef = useRef(dir);

  const spawnFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      if (!currentSnake.some(s => s.x === newFood.x && s.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDir(INITIAL_DIR);
    dirRef.current = INITIAL_DIR;
    lastUpdateDirRef.current = INITIAL_DIR;
    setScore(0);
    setFood(spawnFood(INITIAL_SNAKE));
    setGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser scrolling with arrow keys and spacebar
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'p' || e.key === 'Escape') {
        if (!gameOver) setIsPaused(p => !p);
        return;
      }

      if (gameOver && e.key === 'Enter') {
        resetGame();
        return;
      }

      const currentDir = lastUpdateDirRef.current;
      
      switch (e.key) {
        case 'ArrowUp':
          if (currentDir.y !== 1) setDir({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (currentDir.y !== -1) setDir({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (currentDir.x !== 1) setDir({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (currentDir.x !== -1) setDir({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const tick = () => {
      const currentDir = dirRef.current;
      const newHead = { 
        x: snake[0].x + currentDir.x, 
        y: snake[0].y + currentDir.y 
      };

      // Wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true);
        return;
      }

      // Self collision
      if (snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
        setGameOver(true);
        return;
      }

      const newSnake = [newHead, ...snake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(spawnFood(newSnake));
        setSpeed(s => Math.max(50, s - 2)); // gradually increase speed
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
      lastUpdateDirRef.current = currentDir;
    };

    const id = setTimeout(tick, speed);
    return () => clearTimeout(id);
  }, [snake, gameOver, isPaused, food, speed, spawnFood]);

  return (
    <div className="flex flex-col items-center w-full h-full max-w-lg mx-auto">
      {/* Header Info */}
      <div className="w-full flex justify-between items-end mb-4 px-2">
        <div className="text-left">
          <p className="text-[10px] uppercase tracking-widest text-slate-500">Current Score</p>
          <p className="text-3xl font-mono font-bold text-cyan-400">{String(score).padStart(6, '0')}</p>
        </div>
        <div className="text-right pb-1">
          <p className="text-[10px] uppercase tracking-widest text-slate-500">{isPaused && !gameOver ? "Paused" : "Status"}</p>
          <p className="text-sm font-bold text-magenta-500">{gameOver ? "Game Over" : "Playing"}</p>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative w-full aspect-square p-4 bg-black/40 rounded-lg flex-1 min-h-[300px]">
        
        <div 
          className="w-full h-full grid gap-[2px]" 
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isSnake = !isHead && snake.some(s => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`w-full h-full border border-white/5 ${
                  isHead 
                    ? 'snake-head z-10 scale-[1.1] rounded-sm' 
                    : isSnake 
                      ? 'snake-body rounded-sm' 
                      : isFood 
                        ? 'food animate-pulse z-10 scale-[0.8]' 
                        : 'bg-transparent'
                }`} 
              />
            );
          })}
        </div>

        {/* Overlay for Game Over / Paused */}
        {(gameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-lg">
            {gameOver ? (
              <>
                <h2 className="text-4xl font-bold text-[#ff00e5] mb-2 tracking-tighter">GAME OVER</h2>
                <p className="text-slate-300 mb-8">Final Score: <span className="font-mono text-cyan-400 ml-2">{score}</span></p>
                <button 
                  onClick={resetGame}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl font-bold tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,242,255,0.4)]"
                >
                  PLAY AGAIN (ENTER)
                </button>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-cyan-400 mb-2 tracking-[0.2em]">PAUSED</h2>
                <p className="text-slate-400">Press Space to Resume</p>
              </>
            )}
          </div>
        )}
        
        {/* Game Engine Active Tag */}
        <div className="absolute bottom-6 left-6 hidden md:flex items-center gap-4 bg-black/60 px-4 py-2 rounded-full border border-white/10 z-30 pointer-events-none">
          <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-200">Game Engine Active</span>
        </div>
      </div>

      <div className="mt-6 text-slate-500 text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 w-full">
        <span><kbd className="border border-white/10 px-1 py-0.5 rounded text-slate-400">Arrows</kbd> = Move</span>
        <span><kbd className="border border-white/10 px-1 py-0.5 rounded text-slate-400">Space</kbd> = Pause</span>
      </div>
    </div>
  );
}
