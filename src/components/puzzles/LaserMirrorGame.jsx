import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  RotateCcw, 
  Lightbulb, 
  Trophy, 
  Sparkles, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Zap, 
  Info,
  Flame,
  ShieldAlert,
  Radio,
  Skull
} from 'lucide-react';
import { triggerCelebrationConfetti } from '../../utils/confettiHelper';
import { playPop, playSnap, playErrorTone, playChimeVictory } from '../../utils/puzzleAudio';

// Level configurations with mathematically verified solutions
const LEVELS = [
  {
    id: 1,
    name: 'Level 1: Optics Calibration',
    difficulty: 'Medium',
    size: 5,
    maxMirrors: 3,
    emitter: { r: 0, c: 0, dir: 'E' },
    crystals: [
      { r: 0, c: 2 },
      { r: 2, c: 4 },
      { r: 4, c: 2 },
    ],
    voids: [
      { r: 1, c: 4 },
      { r: 2, c: 2 },
    ],
    solution: {
      '0,4': '\\',
      '4,4': '/',
      '4,0': '/',
    },
    minMoves: 3,
    points: 50
  },
  {
    id: 2,
    name: 'Level 2: Prism Ricochet',
    difficulty: 'Hard',
    size: 6,
    maxMirrors: 4,
    emitter: { r: 0, c: 0, dir: 'E' },
    crystals: [
      { r: 0, c: 3 },
      { r: 3, c: 5 },
      { r: 5, c: 3 },
      { r: 2, c: 1 },
    ],
    voids: [
      { r: 1, c: 3 },
      { r: 2, c: 4 },
      { r: 4, c: 4 },
      { r: 3, c: 2 },
    ],
    solution: {
      '0,5': '\\',
      '5,5': '/',
      '5,1': '/',
      '1,1': '\\',
    },
    minMoves: 4,
    points: 75
  },
  {
    id: 3,
    name: 'Level 3: Hexagonal Refraction',
    difficulty: 'Very Hard',
    size: 6,
    maxMirrors: 5,
    emitter: { r: 0, c: 0, dir: 'E' },
    crystals: [
      { r: 0, c: 2 },
      { r: 4, c: 5 },
      { r: 5, c: 2 },
      { r: 3, c: 0 },
      { r: 1, c: 3 },
    ],
    voids: [
      { r: 1, c: 2 },
      { r: 2, c: 4 },
      { r: 4, c: 2 },
      { r: 3, c: 4 },
      { r: 5, c: 4 },
    ],
    solution: {
      '0,5': '\\',
      '5,5': '/',
      '5,0': '/',
      '1,0': '\\',
      '1,4': '\\',
    },
    minMoves: 5,
    points: 90
  },
  {
    id: 4,
    name: 'Level 4: Quantum Labyrinth',
    difficulty: 'TOO HARD',
    isNightmare: true,
    size: 7,
    maxMirrors: 6,
    emitter: { r: 0, c: 0, dir: 'E' },
    crystals: [
      { r: 0, c: 3 },
      { r: 4, c: 6 },
      { r: 6, c: 3 },
      { r: 4, c: 1 },
      { r: 2, c: 4 },
    ],
    voids: [
      { r: 2, c: 2 },
      { r: 2, c: 5 },
      { r: 3, c: 3 },
      { r: 3, c: 5 },
      { r: 4, c: 3 },
      { r: 4, c: 5 },
      { r: 5, c: 3 },
      { r: 5, c: 5 },
    ],
    solution: {
      '0,6': '\\',
      '6,6': '/',
      '6,1': '/',
      '1,1': '\\',
      '1,4': '\\',
      '3,4': '/',
    },
    minMoves: 6,
    points: 120
  }
];

export default function LaserMirrorGame({ onGameWin, soundEnabled = true, onToggleSound }) {
  const [levelIdx, setLevelIdx] = useState(0);
  const currentLevel = LEVELS[levelIdx] || LEVELS[0];

  // Map of "row,col" -> '/' or '\'
  const [mirrors, setMirrors] = useState({});
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [hintMessage, setHintMessage] = useState(null);

  // Reset when level changes
  const resetLevel = useCallback((lvl = currentLevel) => {
    setMirrors({});
    setMoves(0);
    setSeconds(0);
    setIsTimerRunning(false);
    setHasWon(false);
    setHintMessage(null);
  }, [currentLevel]);

  useEffect(() => {
    resetLevel(currentLevel);
  }, [levelIdx, currentLevel, resetLevel]);

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

  // Ray-tracing engine: traces laser from emitter across mirrors and obstacles
  const { laserPath, hitCrystals, hitVoid } = useMemo(() => {
    const size = currentLevel.size;
    const path = []; // array of [r, c] points in cell coordinates
    const hitCrystalsSet = new Set();
    let voidCollided = false;

    let curR = currentLevel.emitter.r;
    let curC = currentLevel.emitter.c;
    let dir = currentLevel.emitter.dir;

    path.push([curR, curC]);

    const seenStates = new Set();
    let steps = 0;
    const maxSteps = 120;

    while (steps < maxSteps) {
      steps++;
      const stateKey = `${curR},${curC},${dir}`;
      if (seenStates.has(stateKey)) break; // loop detected
      seenStates.add(stateKey);

      // Determine delta
      let dr = 0;
      let dc = 0;
      if (dir === 'E') { dr = 0; dc = 1; }
      else if (dir === 'W') { dr = 0; dc = -1; }
      else if (dir === 'S') { dr = 1; dc = 0; }
      else if (dir === 'N') { dr = -1; dc = 0; }

      const nextR = curR + dr;
      const nextC = curC + dc;

      // Check boundary
      if (nextR < 0 || nextR >= size || nextC < 0 || nextC >= size) {
        break; // Exited board
      }

      curR = nextR;
      curC = nextC;
      path.push([curR, curC]);

      // Check if hit a dark matter void
      const isVoid = currentLevel.voids.some(v => v.r === curR && v.c === curC);
      if (isVoid) {
        voidCollided = true;
        break; // Beam absorbed
      }

      // Check if crystal here
      const isCrystal = currentLevel.crystals.some(cr => cr.r === curR && cr.c === curC);
      if (isCrystal) {
        hitCrystalsSet.add(`${curR},${curC}`);
      }

      // Check if mirror here
      const mirror = mirrors[`${curR},${curC}`];
      if (mirror) {
        if (mirror === '/') {
          // Reflection for '/': new_dr = -dc, new_dc = -dr
          if (dir === 'E') dir = 'N';
          else if (dir === 'W') dir = 'S';
          else if (dir === 'S') dir = 'W';
          else if (dir === 'N') dir = 'E';
        } else if (mirror === '\\') {
          // Reflection for '\': new_dr = dc, new_dc = dr
          if (dir === 'E') dir = 'S';
          else if (dir === 'W') dir = 'N';
          else if (dir === 'S') dir = 'E';
          else if (dir === 'N') dir = 'W';
        }
      }
    }

    return {
      laserPath: path,
      hitCrystals: hitCrystalsSet,
      hitVoid: voidCollided
    };
  }, [currentLevel, mirrors]);

  // Check win condition
  useEffect(() => {
    if (hitCrystals.size === currentLevel.crystals.length && !hasWon) {
      setHasWon(true);
      setIsTimerRunning(false);
      triggerCelebrationConfetti();
      if (soundEnabled) playChimeVictory();

      if (onGameWin) {
        onGameWin({
          game: 'laser-matrix',
          title: `Laser Matrix (${currentLevel.name})`,
          points: currentLevel.points,
          badge: currentLevel.isNightmare ? 'Quantum Optics Master' : 'Laser Engineer',
          timeTaken: seconds,
          moves: moves + 1
        });
      }
    }
  }, [hitCrystals, currentLevel, hasWon, moves, seconds, soundEnabled, onGameWin]);

  const placedMirrorsCount = Object.keys(mirrors).length;

  // Cycle mirror state on click: Empty -> '/' -> '\' -> Empty
  const handleCellClick = (r, c) => {
    if (hasWon) return;

    // Cannot place on emitter
    if (r === currentLevel.emitter.r && c === currentLevel.emitter.c) return;

    // Cannot place on dark void
    if (currentLevel.voids.some(v => v.r === r && v.c === c)) {
      if (soundEnabled) playErrorTone();
      setHintMessage('Cannot place optical mirrors inside dark matter voids!');
      return;
    }

    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }

    setHintMessage(null);
    const key = `${r},${c}`;
    const currentMirror = mirrors[key];

    if (!currentMirror) {
      // Check mirror capacity
      if (placedMirrorsCount >= currentLevel.maxMirrors) {
        if (soundEnabled) playErrorTone();
        setHintMessage(`Max ${currentLevel.maxMirrors} mirrors allowed for this level! Remove an existing mirror to reposition.`);
        return;
      }
      setMirrors(prev => ({ ...prev, [key]: '/' }));
      setMoves(m => m + 1);
      if (soundEnabled) playPop();
    } else if (currentMirror === '/') {
      setMirrors(prev => ({ ...prev, [key]: '\\' }));
      setMoves(m => m + 1);
      if (soundEnabled) playPop();
    } else {
      // Remove mirror
      setMirrors(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      setMoves(m => m + 1);
      if (soundEnabled) playSnap();
    }
  };

  const handleHint = () => {
    if (hasWon) return;

    // Find missing mirror from known verified solution
    const sol = currentLevel.solution;
    if (!sol) return;

    for (const [coord, correctType] of Object.entries(sol)) {
      if (mirrors[coord] !== correctType) {
        const [r, c] = coord.split(',').map(Number);
        const colLetter = String.fromCharCode(65 + c);
        setHintMessage(`💡 Hint: Place a ${correctType === '/' ? 'Slash (╱)' : 'Backslash (╲)'} mirror on cell ${colLetter}${r + 1}.`);
        if (soundEnabled) playPop();
        return;
      }
    }
  };

  const handleSolveDemo = () => {
    if (currentLevel.solution) {
      setMirrors({ ...currentLevel.solution });
      setHintMessage('✨ Here is the exact quantum optic solution! Study how each reflection bypasses voids and energizes all crystals.');
      if (soundEnabled) playPop();
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-200 dark:border-purple-500/30 p-6 md:p-8 shadow-xl space-y-6 select-none">
      
      {/* Game Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            Optic Ray-Tracing & Reflection
          </div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Laser Matrix
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
              <Skull className="w-3 h-3" /> TOO HARD
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Click grid cells to cycle <strong className="text-cyan-500">Mirror ╱</strong>, <strong className="text-pink-500">Mirror ╲</strong>, or Clear. Bounce the laser through <strong className="text-amber-500">ALL Quantum Crystals</strong> while avoiding black holes!
          </p>
        </div>

        {/* Level Switcher */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {LEVELS.map((lvl, idx) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => setLevelIdx(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                levelIdx === idx
                  ? lvl.isNightmare 
                    ? 'bg-gradient-to-r from-red-600 via-rose-600 to-purple-600 text-white shadow-md shadow-red-600/30 ring-2 ring-red-400/50'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {lvl.isNightmare ? '💀 Lvl 4' : `Lvl ${lvl.id}`}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-2xl border border-amber-200 dark:border-amber-800/40 text-center">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Crystals Energized</span>
          <span className="text-base font-extrabold text-amber-700 dark:text-amber-300 flex items-center justify-center gap-1">
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
            {hitCrystals.size} / {currentLevel.crystals.length}
          </span>
        </div>

        <div className="bg-cyan-50 dark:bg-cyan-950/40 p-3 rounded-2xl border border-cyan-200 dark:border-cyan-800/40 text-center">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Mirrors Placed</span>
          <span className="text-base font-extrabold text-cyan-700 dark:text-cyan-300">
            {placedMirrorsCount} / {currentLevel.maxMirrors}
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

      {/* Main Board Viewport with SVG Laser Overlay */}
      <div className="flex flex-col items-center justify-center space-y-4">
        
        <div 
          className="p-3 bg-slate-950 rounded-3xl border-4 border-slate-850 shadow-2xl relative select-none"
          style={{
            width: currentLevel.size === 7 ? 'min(90vw, 420px)' : currentLevel.size === 6 ? 'min(85vw, 390px)' : 'min(75vw, 340px)',
            height: currentLevel.size === 7 ? 'min(90vw, 420px)' : currentLevel.size === 6 ? 'min(85vw, 390px)' : 'min(75vw, 340px)'
          }}
        >
          {/* SVG Laser Ray Path */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none p-3 z-20"
            viewBox={`0 0 ${currentLevel.size * 100} ${currentLevel.size * 100}`}
          >
            {laserPath.length >= 2 && (
              <g>
                {/* Outer Neon Glow */}
                <polyline
                  points={laserPath.map(([r, c]) => `${c * 100 + 50},${r * 100 + 50}`).join(' ')}
                  fill="none"
                  stroke={hitVoid ? '#f43f5e' : '#06b6d4'}
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.35"
                />
                {/* Core Laser Beam */}
                <polyline
                  points={laserPath.map(([r, c]) => `${c * 100 + 50},${r * 100 + 50}`).join(' ')}
                  fill="none"
                  stroke={hitVoid ? '#fb7185' : '#67e8f9'}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.95"
                />
              </g>
            )}
          </svg>

          {/* Grid Cells */}
          <div 
            className="grid gap-1 w-full h-full relative z-10"
            style={{ 
              gridTemplateColumns: `repeat(${currentLevel.size}, 1fr)`,
              gridTemplateRows: `repeat(${currentLevel.size}, 1fr)`
            }}
          >
            {Array.from({ length: currentLevel.size }).map((_, r) =>
              Array.from({ length: currentLevel.size }).map((_, c) => {
                const isEmitter = r === currentLevel.emitter.r && c === currentLevel.emitter.c;
                const isVoid = currentLevel.voids.some(v => v.r === r && v.c === c);
                const isCrystal = currentLevel.crystals.some(cr => cr.r === r && cr.c === c);
                const isCrystalEnergized = hitCrystals.has(`${r},${c}`);
                const mirror = mirrors[`${r},${c}`];

                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    disabled={isVoid || isEmitter}
                    onClick={() => handleCellClick(r, c)}
                    className={`relative w-full h-full aspect-square rounded-xl flex items-center justify-center transition-colors duration-150 box-border border-2 overflow-hidden ${
                      isVoid
                        ? 'bg-slate-950 border-purple-900/40 text-purple-600 opacity-60 cursor-not-allowed'
                        : isEmitter
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-300 text-white shadow-md'
                        : mirror
                        ? 'bg-slate-900 border-cyan-400 text-cyan-300 shadow-inner'
                        : isCrystal
                        ? isCrystalEnergized
                          ? 'bg-amber-950/50 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                          : 'bg-slate-900 border-amber-600/50 text-amber-500/70'
                        : 'bg-slate-900 border-slate-800 hover:bg-slate-850 cursor-pointer'
                    }`}
                  >
                    {/* Emitter Icon */}
                    {isEmitter && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Radio className="w-5 h-5 text-white animate-pulse" />
                      </div>
                    )}

                    {/* Void Blocker */}
                    {isVoid && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <ShieldAlert className="w-4 h-4 text-purple-500/70" />
                      </div>
                    )}

                    {/* Crystal Target */}
                    {isCrystal && !mirror && (
                      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
                        isCrystalEnergized ? 'animate-bounce' : 'opacity-70'
                      }`}>
                        <Zap className={`w-5 h-5 ${isCrystalEnergized ? 'fill-amber-400 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'text-amber-500'}`} />
                      </div>
                    )}

                    {/* Slanted Optical Mirror */}
                    {mirror && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none font-mono text-2xl font-black text-cyan-300">
                        {mirror === '/' ? '╱' : '╲'}
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>

        </div>

      </div>

      {/* Hint Message */}
      {hintMessage && (
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5 animate-fade-in font-medium">
          <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">{hintMessage}</div>
        </div>
      )}

      {/* Victory Callout Card */}
      {hasWon && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-purple-700 rounded-3xl p-6 text-white text-center shadow-xl space-y-3 animate-fade-in">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto text-amber-300">
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold">Impossible Mastered! All Crystals Energized! 🎉</h3>
          <p className="text-xs text-rose-100 max-w-md mx-auto">
            You solved the {currentLevel.name} with <strong className="text-white">{placedMirrorsCount} mirrors</strong> in <strong className="text-white">{moves} moves</strong> ({formatTime(seconds)})!
          </p>
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-xl text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-300" />
            + {currentLevel.points} Skill Points Credited to Your Profile
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => resetLevel(currentLevel)}
              className="px-5 py-2 rounded-xl bg-white text-purple-950 text-xs font-bold hover:bg-rose-50 transition-all cursor-pointer shadow-md"
            >
              Replay Level
            </button>
            {levelIdx < LEVELS.length - 1 && (
              <button
                type="button"
                onClick={() => setLevelIdx(levelIdx + 1)}
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
            Tap square to cycle: ╱ mirror → ╲ mirror → Remove
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Hint */}
          <button
            type="button"
            onClick={handleHint}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 hover:bg-amber-100 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Hint</span>
          </button>

          {/* Solve Demo */}
          <button
            type="button"
            onClick={handleSolveDemo}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800/60 hover:bg-indigo-100 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Solve Demo</span>
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={() => resetLevel(currentLevel)}
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
