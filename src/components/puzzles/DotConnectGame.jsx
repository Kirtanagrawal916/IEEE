import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  RotateCcw, 
  Lightbulb, 
  Trophy, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  Volume2, 
  VolumeX,
  Zap,
  Info
} from 'lucide-react';
import { triggerCelebrationConfetti } from '../../utils/confettiHelper';
import { playPop, playSnap, playChimeVictory } from '../../utils/puzzleAudio';

// Color definitions with vibrant themes
export const COLORS = {
  red: { name: 'Ruby', bg: 'bg-rose-500', hex: '#f43f5e', border: 'border-rose-400', glow: 'rgba(244, 63, 94, 0.6)' },
  blue: { name: 'Sapphire', bg: 'bg-sky-500', hex: '#0ea5e9', border: 'border-sky-400', glow: 'rgba(14, 165, 233, 0.6)' },
  green: { name: 'Emerald', bg: 'bg-emerald-500', hex: '#10b981', border: 'border-emerald-400', glow: 'rgba(16, 185, 129, 0.6)' },
  amber: { name: 'Amber', bg: 'bg-amber-500', hex: '#f59e0b', border: 'border-amber-400', glow: 'rgba(245, 158, 11, 0.6)' },
  purple: { name: 'Amethyst', bg: 'bg-purple-500', hex: '#a855f7', border: 'border-purple-400', glow: 'rgba(168, 85, 247, 0.6)' },
  cyan: { name: 'Cyan', bg: 'bg-teal-400', hex: '#2dd4bf', border: 'border-teal-300', glow: 'rgba(45, 212, 191, 0.6)' },
};

// Handcrafted levels with verified solutions
const LEVELS = [
  {
    id: 1,
    name: 'Level 1: Fast Start',
    difficulty: 'Easy',
    gridSize: 4,
    points: 30,
    dots: [
      { color: 'red', r: 0, c: 0 },
      { color: 'red', r: 3, c: 1 },
      { color: 'blue', r: 0, c: 1 },
      { color: 'blue', r: 1, c: 3 },
      { color: 'green', r: 1, c: 1 },
      { color: 'green', r: 3, c: 3 },
    ],
    hintSolution: {
      red: [[0,0], [1,0], [2,0], [3,0], [3,1]],
      blue: [[0,1], [0,2], [0,3], [1,3]],
      green: [[1,1], [2,1], [2,2], [2,3], [3,3]],
    }
  },
  {
    id: 2,
    name: 'Level 2: Quadrant Flow',
    difficulty: 'Medium',
    gridSize: 5,
    points: 40,
    dots: [
      { color: 'red', r: 0, c: 0 },
      { color: 'red', r: 4, c: 0 },
      { color: 'blue', r: 0, c: 1 },
      { color: 'blue', r: 0, c: 4 },
      { color: 'amber', r: 4, c: 1 },
      { color: 'amber', r: 4, c: 4 },
      { color: 'green', r: 1, c: 1 },
      { color: 'green', r: 3, c: 4 },
    ],
    hintSolution: {
      red: [[0,0], [1,0], [2,0], [3,0], [4,0]],
      blue: [[0,1], [0,2], [0,3], [0,4]],
      amber: [[4,1], [4,2], [4,3], [4,4]],
      green: [[1,1], [1,2], [1,3], [1,4], [2,4], [3,4]],
    }
  },
  {
    id: 3,
    name: 'Level 3: Penta Bridge',
    difficulty: 'Challenging',
    gridSize: 5,
    points: 50,
    dots: [
      { color: 'red', r: 0, c: 0 },
      { color: 'red', r: 4, c: 1 },
      { color: 'blue', r: 0, c: 1 },
      { color: 'blue', r: 0, c: 4 },
      { color: 'purple', r: 1, c: 4 },
      { color: 'purple', r: 4, c: 4 },
      { color: 'amber', r: 4, c: 2 },
      { color: 'amber', r: 4, c: 3 },
      { color: 'green', r: 1, c: 1 },
      { color: 'green', r: 3, c: 3 },
    ],
    hintSolution: {
      red: [[0,0], [1,0], [2,0], [3,0], [4,0], [4,1]],
      blue: [[0,1], [0,2], [0,3], [0,4]],
      purple: [[1,4], [2,4], [3,4], [4,4]],
      amber: [[4,2], [4,3]],
      green: [[1,1], [1,2], [1,3], [2,3], [3,3]],
    }
  },
  {
    id: 4,
    name: 'Level 4: Hex Grid Circuit',
    difficulty: 'Advanced',
    gridSize: 6,
    points: 60,
    dots: [
      { color: 'red', r: 0, c: 0 },
      { color: 'red', r: 5, c: 0 },
      { color: 'blue', r: 0, c: 1 },
      { color: 'blue', r: 0, c: 5 },
      { color: 'amber', r: 5, c: 1 },
      { color: 'amber', r: 5, c: 5 },
      { color: 'purple', r: 1, c: 5 },
      { color: 'purple', r: 4, c: 5 },
      { color: 'green', r: 1, c: 1 },
      { color: 'green', r: 4, c: 4 },
    ],
    hintSolution: {
      red: [[0,0], [1,0], [2,0], [3,0], [4,0], [5,0]],
      blue: [[0,1], [0,2], [0,3], [0,4], [0,5]],
      amber: [[5,1], [5,2], [5,3], [5,4], [5,5]],
      purple: [[1,5], [2,5], [3,5], [4,5]],
      green: [[1,1], [1,2], [1,3], [1,4], [2,4], [3,4], [4,4]],
    }
  },
  {
    id: 5,
    name: 'Level 5: Master Weaver',
    difficulty: 'Expert',
    gridSize: 6,
    points: 80,
    dots: [
      { color: 'red', r: 0, c: 0 },
      { color: 'red', r: 5, c: 1 },
      { color: 'blue', r: 0, c: 1 },
      { color: 'blue', r: 0, c: 5 },
      { color: 'purple', r: 1, c: 5 },
      { color: 'purple', r: 5, c: 5 },
      { color: 'cyan', r: 5, c: 2 },
      { color: 'cyan', r: 5, c: 4 },
      { color: 'amber', r: 1, c: 1 },
      { color: 'amber', r: 4, c: 1 },
      { color: 'green', r: 1, c: 2 },
      { color: 'green', r: 4, c: 4 },
    ],
    hintSolution: {
      red: [[0,0], [1,0], [2,0], [3,0], [4,0], [5,0], [5,1]],
      blue: [[0,1], [0,2], [0,3], [0,4], [0,5]],
      purple: [[1,5], [2,5], [3,5], [4,5], [5,5]],
      cyan: [[5,2], [5,3], [5,4]],
      amber: [[1,1], [2,1], [3,1], [4,1]],
      green: [[1,2], [1,3], [1,4], [2,4], [3,4], [4,4]],
    }
  }
];

export default function DotConnectGame({ onGameWin, soundEnabled = true, onToggleSound }) {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const level = LEVELS[currentLevelIdx] || LEVELS[0];

  // Map of color -> array of [row, col] coordinates representing current path
  const [paths, setPaths] = useState({});
  // Color currently being actively drawn
  const [activeColor, setActiveColor] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [hintMessage, setHintMessage] = useState(null);

  const gridRef = useRef(null);

  // Group dots by color
  const colorDots = useMemo(() => {
    const map = {};
    level.dots.forEach(d => {
      if (!map[d.color]) map[d.color] = [];
      map[d.color].push(d);
    });
    return map;
  }, [level]);

  const uniqueColors = useMemo(() => Object.keys(colorDots), [colorDots]);

  const resetLevel = useCallback(() => {
    setPaths({});
    setActiveColor(null);
    setIsDrawing(false);
    setMoves(0);
    setSeconds(0);
    setIsTimerRunning(false);
    setHasWon(false);
    setHintMessage(null);
  }, []);

  // Reset when level changes
  useEffect(() => {
    resetLevel();
  }, [currentLevelIdx, resetLevel]);

  // Timer
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && !hasWon) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, hasWon]);

  // Check which colors are successfully connected
  const connectedColors = useMemo(() => {
    const connected = new Set();
    uniqueColors.forEach(color => {
      const p = paths[color];
      const dots = colorDots[color];
      if (p && p.length >= 2 && dots && dots.length === 2) {
        const start = p[0];
        const end = p[p.length - 1];
        const matches1 = (start[0] === dots[0].r && start[1] === dots[0].c && end[0] === dots[1].r && end[1] === dots[1].c);
        const matches2 = (start[0] === dots[1].r && start[1] === dots[1].c && end[0] === dots[0].r && end[1] === dots[0].c);
        if (matches1 || matches2) {
          connected.add(color);
        }
      }
    });
    return connected;
  }, [paths, uniqueColors, colorDots]);

  // Check victory condition
  useEffect(() => {
    if (uniqueColors.length > 0 && connectedColors.size === uniqueColors.length && !hasWon) {
      setHasWon(true);
      setIsTimerRunning(false);
      triggerCelebrationConfetti();
      if (soundEnabled) playChimeVictory();
      if (onGameWin) {
        onGameWin({
          game: 'dot-connect',
          title: `Joint Two Points (${level.name})`,
          points: level.points,
          badge: currentLevelIdx >= 3 ? 'Master Circuit Weaver' : 'Dot Connect Pro',
          timeTaken: seconds,
          moves
        });
      }
    }
  }, [connectedColors, uniqueColors, hasWon, level, currentLevelIdx, moves, seconds, soundEnabled, onGameWin]);

  // Is cell adjacent orthogonally?
  const isAdjacent = (c1, c2) => {
    if (!c1 || !c2) return false;
    const dr = Math.abs(c1[0] - c2[0]);
    const dc = Math.abs(c1[1] - c2[1]);
    return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
  };

  // Find if cell contains an endpoint dot
  const getDotAt = useCallback((r, c) => {
    return level.dots.find(d => d.r === r && d.c === c) || null;
  }, [level]);

  // Handle cell interaction (mouse down / touch start)
  const handleCellMouseDown = (r, c) => {
    if (hasWon) return;
    if (!isTimerRunning) setIsTimerRunning(true);

    const dot = getDotAt(r, c);

    if (dot) {
      // Start or re-start path for this color
      setActiveColor(dot.color);
      setIsDrawing(true);
      setPaths(prev => ({
        ...prev,
        [dot.color]: [[r, c]]
      }));
      setMoves(m => m + 1);
      if (soundEnabled) playPop();
    } else {
      // Check if clicked cell is part of an existing path
      for (const [col, p] of Object.entries(paths)) {
        const idx = p.findIndex(pt => pt[0] === r && pt[1] === c);
        if (idx !== -1) {
          setActiveColor(col);
          setIsDrawing(true);
          // Truncate path up to this point
          setPaths(prev => ({
            ...prev,
            [col]: p.slice(0, idx + 1)
          }));
          if (soundEnabled) playPop();
          return;
        }
      }
    }
  };

  // Handle entering a cell during drag
  const handleCellEnter = (r, c) => {
    if (!isDrawing || !activeColor || hasWon) return;

    const currentPath = paths[activeColor] || [];
    if (currentPath.length === 0) return;

    const last = currentPath[currentPath.length - 1];
    if (last[0] === r && last[1] === c) return; // already here

    // Must be orthogonally adjacent
    if (!isAdjacent(last, [r, c])) return;

    // Check if moving backwards (undo last step)
    if (currentPath.length >= 2) {
      const prev = currentPath[currentPath.length - 2];
      if (prev[0] === r && prev[1] === c) {
        setPaths(prevP => ({
          ...prevP,
          [activeColor]: currentPath.slice(0, -1)
        }));
        if (soundEnabled) playPop();
        return;
      }
    }

    // Check if cell is an endpoint of a DIFFERENT color
    const dot = getDotAt(r, c);
    if (dot && dot.color !== activeColor) {
      return; // cannot cross enemy endpoint
    }

    // If cell contains own endpoint and we are not at start
    const isTargetEndpoint = dot && dot.color === activeColor && (r !== currentPath[0][0] || c !== currentPath[0][1]);

    // Check if this cell is already in the current path (self loop)
    const selfLoopIdx = currentPath.findIndex(pt => pt[0] === r && pt[1] === c);
    if (selfLoopIdx !== -1) {
      // Truncate to that index
      setPaths(prevP => ({
        ...prevP,
        [activeColor]: currentPath.slice(0, selfLoopIdx + 1)
      }));
      return;
    }

    // Check if cell is part of another color's path; if so, cleanly cut the other path
    setPaths(prevP => {
      const updated = { ...prevP };
      Object.keys(updated).forEach(col => {
        if (col !== activeColor) {
          const cutIdx = updated[col].findIndex(pt => pt[0] === r && pt[1] === c);
          if (cutIdx !== -1) {
            updated[col] = updated[col].slice(0, cutIdx);
          }
        }
      });
      updated[activeColor] = [...currentPath, [r, c]];
      return updated;
    });

    if (isTargetEndpoint) {
      // Completed circuit for this pair! Instant snap
      setIsDrawing(false);
      setActiveColor(null);
      if (soundEnabled) playSnap();
    } else {
      if (soundEnabled) playPop();
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setActiveColor(null);
  };

  // Touch handlers for mobile
  const handleTouchMove = (e) => {
    if (!isDrawing || !gridRef.current) return;
    const touch = e.touches[0];
    const elem = document.elementFromPoint(touch.clientX, touch.clientY);
    if (elem) {
      const cellData = elem.getAttribute('data-cell');
      if (cellData) {
        const [r, c] = cellData.split('-').map(Number);
        handleCellEnter(r, c);
      }
    }
  };

  const handleClearColor = (color) => {
    setPaths(prev => {
      const next = { ...prev };
      delete next[color];
      return next;
    });
    setHintMessage(null);
  };

  const handleHint = () => {
    // Find an unconnected color
    const unconnected = uniqueColors.find(c => !connectedColors.has(c));
    if (!unconnected) {
      setHintMessage('All colors are already connected!');
      return;
    }

    if (level.hintSolution && level.hintSolution[unconnected]) {
      const sol = level.hintSolution[unconnected];
      // Clean up overlaps with this hint
      setPaths(prev => {
        const next = { ...prev, [unconnected]: sol };
        // Clean conflicts in other paths
        Object.keys(next).forEach(col => {
          if (col !== unconnected) {
            next[col] = next[col].filter(pt => !sol.some(s => s[0] === pt[0] && s[1] === pt[1]));
          }
        });
        return next;
      });
      setHintMessage(`💡 Linked the ${COLORS[unconnected]?.name || unconnected} pair for you! Notice how it leaves room for other paths.`);
      if (soundEnabled) playSnap();
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div 
      className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-200 dark:border-purple-500/30 p-6 md:p-8 shadow-xl space-y-6 select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      
      {/* Game Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Flow & Point Connector
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            Joint Two Points (Dot Connect)
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Connect matching colored endpoints by dragging or clicking paths through the grid. <strong className="text-pink-600 dark:text-pink-400">Lines cannot cross each other!</strong>
          </p>
        </div>

        {/* Level Switcher */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {LEVELS.map((lvl, idx) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => setCurrentLevelIdx(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentLevelIdx === idx
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Lvl {lvl.id}
            </button>
          ))}
        </div>
      </div>

      {/* Stats and Color Badges Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-purple-50 dark:bg-purple-950/40 p-3 rounded-2xl border border-purple-200 dark:border-purple-800/40 text-center">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Pairs Connected</span>
          <span className="text-base font-extrabold text-purple-700 dark:text-purple-300">
            {connectedColors.size} / {uniqueColors.length}
          </span>
        </div>

        <div className="bg-pink-50 dark:bg-pink-950/40 p-3 rounded-2xl border border-pink-200 dark:border-pink-800/40 text-center">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Grid Size</span>
          <span className="text-base font-extrabold text-pink-700 dark:text-pink-300">
            {level.gridSize} x {level.gridSize} Grid
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Moves</span>
          <span className="text-base font-extrabold text-slate-800 dark:text-white">{moves}</span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Timer</span>
          <span className="text-base font-extrabold text-slate-800 dark:text-white font-mono">{formatTime(seconds)}</span>
        </div>
      </div>

      {/* Color Indicators Pill List */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Target Pairs:</span>
        {uniqueColors.map(color => {
          const isDone = connectedColors.has(color);
          const colInfo = COLORS[color] || { name: color, hex: '#fff' };
          return (
            <button
              key={color}
              type="button"
              onClick={() => handleClearColor(color)}
              title="Click to clear this line"
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                isDone
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colInfo.hex }}></span>
              <span>{colInfo.name}</span>
              {isDone ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <span className="text-[10px] text-slate-400">pending</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Grid View */}
      <div className="flex flex-col items-center justify-center">
        
        <div 
          ref={gridRef}
          onTouchMove={handleTouchMove}
          className="p-3 bg-slate-950 rounded-3xl border-4 border-slate-800 shadow-2xl relative"
          style={{
            width: level.gridSize === 6 ? 'min(85vw, 390px)' : 'min(75vw, 340px)',
            height: level.gridSize === 6 ? 'min(85vw, 390px)' : 'min(75vw, 340px)'
          }}
        >
          {/* SVG Connecting Paths Overlay */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none p-3 z-10"
            viewBox={`0 0 ${level.gridSize * 100} ${level.gridSize * 100}`}
          >
            {Object.entries(paths).map(([color, points]) => {
              if (!points || points.length < 2) return null;
              const colInfo = COLORS[color] || { hex: '#9333ea' };
              const isCompleted = connectedColors.has(color);

              // Build path d string connecting centers of cells (cell size = 100x100)
              const d = points.reduce((acc, pt, idx) => {
                const x = pt[1] * 100 + 50;
                const y = pt[0] * 100 + 50;
                return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
              }, '');

              return (
                <g key={color}>
                  {/* Glow stroke */}
                  <path
                    d={d}
                    fill="none"
                    stroke={colInfo.hex}
                    strokeWidth="32"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={isCompleted ? 0.35 : 0.2}
                  />
                  {/* Core solid stroke */}
                  <path
                    d={d}
                    fill="none"
                    stroke={colInfo.hex}
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.95}
                  />
                </g>
              );
            })}
          </svg>

          {/* Grid Cells */}
          <div 
            className="grid gap-1.5 w-full h-full relative z-20"
            style={{ 
              gridTemplateColumns: `repeat(${level.gridSize}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${level.gridSize}, minmax(0, 1fr))`
            }}
          >
            {Array.from({ length: level.gridSize }).map((_, r) =>
              Array.from({ length: level.gridSize }).map((_, c) => {
                const dot = getDotAt(r, c);
                const colInfo = dot ? (COLORS[dot.color] || { hex: '#fff' }) : null;

                // Check if this cell is traversed by any path
                let pathColor = null;
                for (const [col, p] of Object.entries(paths)) {
                  if (p.some(pt => pt[0] === r && pt[1] === c)) {
                    pathColor = col;
                    break;
                  }
                }

                return (
                  <div
                    key={`${r}-${c}`}
                    data-cell={`${r}-${c}`}
                    onMouseDown={() => handleCellMouseDown(r, c)}
                    onMouseEnter={() => handleCellEnter(r, c)}
                    className="relative rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-center cursor-pointer transition-colors duration-150 hover:bg-slate-800/70"
                  >
                    {/* Glowing endpoint dot */}
                    {dot && (
                      <div 
                        className="relative z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white transform hover:scale-110 transition-transform"
                        style={{ 
                          backgroundColor: colInfo?.hex,
                          boxShadow: `0 0 16px ${colInfo?.glow || 'rgba(255,255,255,0.5)'}` 
                        }}
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-white shadow-inner"></span>
                      </div>
                    )}

                    {/* Path breadcrumb subtle center node if not dot */}
                    {!dot && pathColor && (
                      <div 
                        className="w-2.5 h-2.5 rounded-full z-20 opacity-90 transition-all"
                        style={{ backgroundColor: COLORS[pathColor]?.hex || '#fff' }}
                      ></div>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>

      {/* Hint Banner */}
      {hintMessage && (
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5 animate-fade-in font-medium">
          <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">{hintMessage}</div>
        </div>
      )}

      {/* Victory Callout Card */}
      {hasWon && (
        <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 rounded-3xl p-6 text-white text-center shadow-xl space-y-3 animate-fade-in">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto text-amber-300">
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold">Circuit Closed! All Points Connected! 🎉</h3>
          <p className="text-xs text-purple-100 max-w-md mx-auto">
            You successfully joined all {uniqueColors.length} matching color pairs without overlapping paths in <strong className="text-white">{moves} moves</strong> ({formatTime(seconds)})!
          </p>
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-xl text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-300" />
            + {level.points} Skill Points Credited to Your Profile
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={resetLevel}
              className="px-5 py-2 rounded-xl bg-white text-purple-900 text-xs font-bold hover:bg-purple-50 transition-all cursor-pointer shadow-md"
            >
              Replay Level
            </button>
            {currentLevelIdx < LEVELS.length - 1 && (
              <button
                type="button"
                onClick={() => setCurrentLevelIdx(currentLevelIdx + 1)}
                className="px-5 py-2 rounded-xl bg-amber-400 text-slate-900 text-xs font-bold hover:bg-amber-300 transition-all cursor-pointer shadow-md flex items-center gap-1.5"
              >
                Next Level <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Control Buttons Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          {onToggleSound && (
            <button
              type="button"
              onClick={onToggleSound}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          )}

          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            Drag between matching dots to draw wire
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Hint */}
          <button
            type="button"
            onClick={handleHint}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 hover:bg-amber-100 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Hint</span>
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={resetLevel}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

    </div>
  );
}
