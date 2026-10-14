import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, 
  Lightbulb, 
  Trophy, 
  Sparkles, 
  ChevronRight, 
  Volume2, 
  VolumeX,
  Zap,
  Info
} from 'lucide-react';
import { triggerCelebrationConfetti } from '../../utils/confettiHelper';
import { playPop, playSnap, playChimeVictory } from '../../utils/puzzleAudio';

const SIZES = [
  { size: 3, name: '3x3 Circuit', points: 25 },
  { size: 4, name: '4x4 Matrix', points: 40 },
  { size: 5, name: '5x5 Supergrid', points: 60 },
];

export default function CircuitLightsGame({ onGameWin, soundEnabled = true, onToggleSound }) {
  const [boardSize, setBoardSize] = useState(3);
  const [grid, setGrid] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [hintMessage, setHintMessage] = useState(null);

  // Initialize with solvable scrambles
  useEffect(() => {
    startNewGame(boardSize);
  }, [boardSize]);

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

  const startNewGame = (size = boardSize) => {
    // Start with all ON (true), then simulate 4-6 random valid clicks so it's guaranteed solvable
    const initial = Array(size).fill(false).map(() => Array(size).fill(true));
    
    // Simulate scramble
    const scrambleMoves = size === 3 ? 4 : size === 4 ? 6 : 8;
    for (let k = 0; k < scrambleMoves; k++) {
      const r = Math.floor(Math.random() * size);
      const c = Math.floor(Math.random() * size);
      toggleNeighbors(initial, r, c, size);
    }

    setGrid(initial);
    setMoves(0);
    setSeconds(0);
    setIsTimerRunning(false);
    setHasWon(false);
    setHintMessage(null);
  };

  const toggleNeighbors = (matrix, r, c, size) => {
    const coords = [
      [r, c],
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1]
    ];
    coords.forEach(([row, col]) => {
      if (row >= 0 && row < size && col >= 0 && col < size) {
        matrix[row][col] = !matrix[row][col];
      }
    });
  };

  const handleCellClick = (r, c) => {
    if (hasWon) return;
    if (!isTimerRunning) setIsTimerRunning(true);

    const nextGrid = grid.map(row => [...row]);
    toggleNeighbors(nextGrid, r, c, boardSize);
    setGrid(nextGrid);
    setMoves(m => m + 1);
    setHintMessage(null);
    if (soundEnabled) playPop();

    // Check if all are true (ON)
    const allLit = nextGrid.every(row => row.every(val => val === true));
    if (allLit) {
      setHasWon(true);
      setIsTimerRunning(false);
      triggerCelebrationConfetti();
      if (soundEnabled) playChimeVictory();
      if (onGameWin) {
        onGameWin({
          game: 'circuit-grid',
          title: `Circuit Grid (${boardSize}x${boardSize})`,
          points: boardSize * 15,
          badge: 'Logic Grid Dynamo',
          timeTaken: seconds,
          moves: moves + 1
        });
      }
    }
  };

  const activeCount = grid.reduce((acc, row) => acc + row.filter(Boolean).length, 0);
  const totalCount = boardSize * boardSize;

  const handleHint = () => {
    setHintMessage("💡 Hint: Clicking corners and edges affects fewer cells than clicking the center! Focus on turning off isolated unlit nodes.");
    if (soundEnabled) playSnap();
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-200 dark:border-purple-500/30 p-6 md:p-8 shadow-xl space-y-6">
      
      {/* Game Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-cyan-500 fill-cyan-500" />
            Circuit Logic Flip
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            Circuit Grid (Power Flip)
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Light up all energy nodes to power the grid! Each flip toggles the clicked node and its 4 adjacent neighbors.
          </p>
        </div>

        {/* Board Size Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          {SIZES.map((b) => (
            <button
              key={b.size}
              type="button"
              onClick={() => setBoardSize(b.size)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                boardSize === b.size
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-cyan-50 dark:bg-cyan-950/40 p-3 rounded-2xl border border-cyan-200 dark:border-cyan-800/40 text-center">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Powered Nodes</span>
          <span className="text-base font-extrabold text-cyan-700 dark:text-cyan-300">
            {activeCount} / {totalCount}
          </span>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/40 p-3 rounded-2xl border border-purple-200 dark:border-purple-800/40 text-center">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Grid Power</span>
          <span className="text-base font-extrabold text-purple-700 dark:text-purple-300">
            {Math.round((activeCount / totalCount) * 100)}%
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

      {/* Grid */}
      <div className="flex flex-col items-center justify-center">
        <div 
          className="p-3 bg-slate-950 rounded-3xl border-4 border-slate-800 shadow-2xl relative select-none"
          style={{
            width: boardSize === 5 ? 'min(80vw, 360px)' : 'min(70vw, 310px)',
            height: boardSize === 5 ? 'min(80vw, 360px)' : 'min(70vw, 310px)'
          }}
        >
          <div 
            className="grid gap-2 w-full h-full"
            style={{ 
              gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${boardSize}, minmax(0, 1fr))`
            }}
          >
            {grid.map((row, r) =>
              row.map((isLit, c) => (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  onClick={() => handleCellClick(r, c)}
                  className={`rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer border ${
                    isLit
                      ? 'bg-gradient-to-br from-cyan-400 to-blue-600 border-cyan-300 shadow-[0_0_18px_rgba(6,182,212,0.6)] text-white scale-[0.98]'
                      : 'bg-slate-900 border-slate-800 text-slate-600 hover:bg-slate-800/80'
                  }`}
                >
                  <Zap className={`w-6 h-6 transition-transform ${isLit ? 'fill-white scale-110 drop-shadow' : 'opacity-20'}`} />
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Hint */}
      {hintMessage && (
        <div className="p-3.5 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-300 dark:border-cyan-800/60 rounded-2xl text-xs text-cyan-900 dark:text-cyan-200 flex items-start gap-2.5 animate-fade-in font-medium">
          <Info className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">{hintMessage}</div>
        </div>
      )}

      {/* Victory */}
      {hasWon && (
        <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 rounded-3xl p-6 text-white text-center shadow-xl space-y-3 animate-fade-in">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto text-amber-300">
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold">Circuit 100% Energized! 🎉</h3>
          <p className="text-xs text-cyan-100 max-w-md mx-auto">
            You powered up all {totalCount} energy grid nodes in <strong className="text-white">{moves} flips</strong> ({formatTime(seconds)})!
          </p>
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-xl text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-300" />
            + {boardSize * 15} Skill Points Credited to Your Profile
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => startNewGame(boardSize)}
              className="px-5 py-2 rounded-xl bg-white text-cyan-900 text-xs font-bold hover:bg-cyan-50 transition-all cursor-pointer shadow-md"
            >
              Play Again
            </button>
            {boardSize < 5 && (
              <button
                type="button"
                onClick={() => setBoardSize(boardSize === 3 ? 4 : 5)}
                className="px-5 py-2 rounded-xl bg-amber-400 text-slate-900 text-xs font-bold hover:bg-amber-300 transition-all cursor-pointer shadow-md flex items-center gap-1.5"
              >
                Next Grid <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Toolbar */}
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
            Each click flips 5 nodes in a cross pattern
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleHint}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 hover:bg-amber-100 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Hint</span>
          </button>

          <button
            type="button"
            onClick={() => startNewGame(boardSize)}
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
