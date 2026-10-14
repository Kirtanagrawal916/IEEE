import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  RotateCcw, 
  Lightbulb, 
  Trophy, 
  Sparkles, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Undo2, 
  Star, 
  Flag, 
  Info,
  Compass,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { triggerCelebrationConfetti, triggerStarBurst } from '../../utils/confettiHelper';
import { playPop, playSnap, playErrorTone, playChimeVictory } from '../../utils/puzzleAudio';

// Level configurations
const LEVELS = [
  {
    id: 1,
    name: 'Level 1: Star Meadow',
    size: 5,
    knightStart: { r: 4, c: 0 },
    stars: [
      { r: 2, c: 1 },
      { r: 0, c: 2 },
      { r: 2, c: 3 },
      { r: 4, c: 4 },
    ],
    obstacles: [],
    minMoves: 4,
    points: 40
  },
  {
    id: 2,
    name: 'Level 2: Stone Pillars',
    size: 5,
    knightStart: { r: 4, c: 0 },
    stars: [
      { r: 2, c: 1 },
      { r: 0, c: 0 },
      { r: 1, c: 4 },
      { r: 3, c: 3 },
      { r: 4, c: 1 },
    ],
    obstacles: [{ r: 2, c: 2 }, { r: 3, c: 1 }],
    minMoves: 7,
    points: 50
  },
  {
    id: 3,
    name: 'Level 3: Citadel Crypt',
    size: 6,
    knightStart: { r: 5, c: 0 },
    stars: [
      { r: 3, c: 1 },
      { r: 1, c: 2 },
      { r: 0, c: 5 },
      { r: 2, c: 4 },
      { r: 4, c: 3 },
      { r: 5, c: 5 },
    ],
    obstacles: [{ r: 2, c: 2 }, { r: 3, c: 3 }, { r: 4, c: 1 }],
    minMoves: 9,
    points: 70
  },
  {
    id: 4,
    name: 'Level 4: Grandmaster Tour',
    size: 6,
    knightStart: { r: 5, c: 0 },
    stars: [
      { r: 3, c: 1 },
      { r: 1, c: 0 },
      { r: 0, c: 2 },
      { r: 2, c: 3 },
      { r: 1, c: 5 },
      { r: 3, c: 4 },
      { r: 5, c: 5 },
    ],
    obstacles: [{ r: 2, c: 1 }, { r: 3, c: 2 }, { r: 4, c: 4 }],
    minMoves: 11,
    points: 90
  }
];

// All 8 possible Knight moves (L-shapes: dx^2 + dy^2 = 5)
const KNIGHT_OFFSETS = [
  [-2, -1], [-2, 1],
  [-1, -2], [-1, 2],
  [1, -2],  [1, 2],
  [2, -1],  [2, 1]
];

export default function KnightsQuestGame({ onGameWin, soundEnabled = true, onToggleSound }) {
  const [levelIdx, setLevelIdx] = useState(0);
  const currentLevel = LEVELS[levelIdx] || LEVELS[0];

  const [knightPos, setKnightPos] = useState(currentLevel.knightStart);
  const [visitedPath, setVisitedPath] = useState([{ r: currentLevel.knightStart.r, c: currentLevel.knightStart.c }]);
  const [collectedStars, setCollectedStars] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [hintMessage, setHintMessage] = useState(null);

  // Reset when level changes
  const resetLevel = useCallback((lvl = currentLevel) => {
    setKnightPos(lvl.knightStart);
    setVisitedPath([{ r: lvl.knightStart.r, c: lvl.knightStart.c }]);
    setCollectedStars([]);
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

  // Compute all valid next positions for the Knight
  const validMoves = useMemo(() => {
    if (hasWon) return [];
    const valid = [];
    const size = currentLevel.size;
    const obstacles = currentLevel.obstacles;

    KNIGHT_OFFSETS.forEach(([dr, dc]) => {
      const nr = knightPos.r + dr;
      const nc = knightPos.c + dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
        // Must not be an obstacle
        const isObstacle = obstacles.some(o => o.r === nr && o.c === nc);
        if (!isObstacle) {
          valid.push({ r: nr, c: nc });
        }
      }
    });
    return valid;
  }, [knightPos, currentLevel, hasWon]);

  const isValidMove = (r, c) => {
    return validMoves.some(m => m.r === r && m.c === c);
  };

  const handleCellClick = (r, c) => {
    if (hasWon) return;

    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }

    // Check if clicked square is a valid L-move
    if (!isValidMove(r, c)) {
      if (soundEnabled) playErrorTone();
      setHintMessage('⚠️ Knights can only move in an L-shape (2 squares one way, 1 square sideways)! Look for the glowing gold circles.');
      return;
    }

    setHintMessage(null);
    const newPos = { r, c };
    setKnightPos(newPos);
    setVisitedPath(prev => [...prev, newPos]);
    setMoves(m => m + 1);

    // Check if a star is collected on this square
    const isStarHere = currentLevel.stars.some(
      s => s.r === r && s.c === c && !collectedStars.some(cs => cs.r === r && cs.c === c)
    );

    let updatedStars = collectedStars;
    if (isStarHere) {
      updatedStars = [...collectedStars, { r, c }];
      setCollectedStars(updatedStars);
      triggerStarBurst();
      if (soundEnabled) playSnap();
    } else {
      if (soundEnabled) playPop();
    }

    // Check Win Condition: All stars collected!
    if (updatedStars.length === currentLevel.stars.length) {
      setHasWon(true);
      setIsTimerRunning(false);
      triggerCelebrationConfetti();
      if (soundEnabled) playChimeVictory();

      if (onGameWin) {
        onGameWin({
          game: 'knights-quest',
          title: `Knight's Quest (${currentLevel.name})`,
          points: currentLevel.points,
          badge: levelIdx >= 2 ? 'Grandmaster Cavalier' : 'Knight Pathmaster',
          timeTaken: seconds,
          moves: moves + 1
        });
      }
    }
  };

  // Undo move
  const handleUndo = () => {
    if (visitedPath.length <= 1 || hasWon) return;
    const previousPath = visitedPath.slice(0, -1);
    const previousPos = previousPath[previousPath.length - 1];
    setKnightPos(previousPos);
    setVisitedPath(previousPath);

    // Recompute collected stars up to previous path
    const remainingStars = currentLevel.stars.filter(s =>
      previousPath.some(p => p.r === s.r && p.c === s.c)
    );
    setCollectedStars(remainingStars);
    setMoves(m => Math.max(0, m - 1));
    setHintMessage(null);
    if (soundEnabled) playPop();
  };

  // BFS solver for optimal hint to nearest uncollected star
  const handleHint = () => {
    if (hasWon) return;
    const uncollected = currentLevel.stars.filter(
      s => !collectedStars.some(cs => cs.r === s.r && cs.c === s.c)
    );

    if (uncollected.length === 0) return;

    // Find closest star by BFS
    const queue = [{ r: knightPos.r, c: knightPos.c, dist: 0, firstMove: null }];
    const seen = new Set([`${knightPos.r},${knightPos.c}`]);
    let recommendedMove = null;

    while (queue.length > 0) {
      const cur = queue.shift();
      if (cur.dist > 0 && uncollected.some(s => s.r === cur.r && s.c === cur.c)) {
        recommendedMove = cur.firstMove;
        break;
      }

      KNIGHT_OFFSETS.forEach(([dr, dc]) => {
        const nr = cur.r + dr;
        const nc = cur.c + dc;
        const key = `${nr},${nc}`;
        if (
          nr >= 0 && nr < currentLevel.size &&
          nc >= 0 && nc < currentLevel.size &&
          !seen.has(key) &&
          !currentLevel.obstacles.some(o => o.r === nr && o.c === nc)
        ) {
          seen.add(key);
          const firstMove = cur.dist === 0 ? { r: nr, c: nc } : cur.firstMove;
          queue.push({ r: nr, c: nc, dist: cur.dist + 1, firstMove });
        }
      });
    }

    if (recommendedMove) {
      const colLetter = String.fromCharCode(65 + recommendedMove.c);
      setHintMessage(`💡 Hint: Hop to ${colLetter}${recommendedMove.r + 1} to reach the nearest crystal!`);
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
            L-Hop Graph Traversal
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            The Knight's Quest
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Navigate the Chess Knight in <strong className="text-emerald-600 dark:text-emerald-400">L-shaped hops</strong> to collect all golden stars! Avoid obstacle boulders.
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
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Lvl {lvl.id}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 text-center">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Stars Collected</span>
          <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            {collectedStars.length} / {currentLevel.stars.length}
          </span>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/40 p-3 rounded-2xl border border-purple-200 dark:border-purple-800/40 text-center">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Grid Board</span>
          <span className="text-base font-extrabold text-purple-700 dark:text-purple-300">
            {currentLevel.size}x{currentLevel.size} Chessboard
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Moves</span>
          <span className="text-base font-extrabold text-slate-800 dark:text-white">
            {moves} <span className="text-xs text-slate-400">/ ~{currentLevel.minMoves} min</span>
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Timer</span>
          <span className="text-base font-extrabold text-slate-800 dark:text-white font-mono">{formatTime(seconds)}</span>
        </div>
      </div>

      {/* Main Board Viewport */}
      <div className="flex flex-col items-center justify-center space-y-4">
        
        <div className="p-3 bg-slate-900 rounded-3xl border-4 border-slate-800 shadow-2xl relative select-none">
          
          {/* Column letters */}
          <div 
            className="grid text-center text-[10px] font-bold text-slate-400 pb-1.5" 
            style={{ gridTemplateColumns: `repeat(${currentLevel.size}, 1fr)` }}
          >
            {Array.from({ length: currentLevel.size }).map((_, i) => (
              <span key={i}>{String.fromCharCode(65 + i)}</span>
            ))}
          </div>

          {/* Chessboard Grid */}
          <div 
            className="grid gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800"
            style={{ 
              gridTemplateColumns: `repeat(${currentLevel.size}, 1fr)`,
              gridTemplateRows: `repeat(${currentLevel.size}, 1fr)`,
              width: currentLevel.size === 6 ? 'min(85vw, 400px)' : 'min(75vw, 340px)',
              height: currentLevel.size === 6 ? 'min(85vw, 400px)' : 'min(75vw, 340px)'
            }}
          >
            {Array.from({ length: currentLevel.size }).map((_, r) =>
              Array.from({ length: currentLevel.size }).map((_, c) => {
                const isKnightHere = knightPos.r === r && knightPos.c === c;
                const isObstacle = currentLevel.obstacles.some(o => o.r === r && o.c === c);
                const hasStar = currentLevel.stars.some(
                  s => s.r === r && s.c === c && !collectedStars.some(cs => cs.r === r && cs.c === c)
                );
                const isValid = isValidMove(r, c);
                const isLightSquare = (r + c) % 2 === 0;

                // Path step number
                const stepIdx = visitedPath.findIndex(p => p.r === r && p.c === c);
                const wasVisited = stepIdx !== -1 && !isKnightHere;

                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    disabled={isObstacle}
                    onClick={() => handleCellClick(r, c)}
                    aria-label={`Square ${String.fromCharCode(65 + c)}${r + 1}`}
                    className={`relative w-full h-full aspect-square rounded-xl flex items-center justify-center transition-colors duration-150 text-center box-border border-2 overflow-hidden ${
                      isObstacle
                        ? 'bg-slate-950 border-slate-850 opacity-40 cursor-not-allowed'
                        : isKnightHere
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-300 text-white shadow-lg cursor-default'
                        : isValid
                        ? 'bg-amber-950/40 border-amber-400 hover:bg-amber-900/60 cursor-pointer animate-pulse'
                        : wasVisited
                        ? 'bg-slate-850 border-emerald-500/30 text-emerald-400/80'
                        : isLightSquare
                        ? 'bg-slate-800 border-transparent hover:bg-slate-750 text-slate-400'
                        : 'bg-slate-850 border-transparent hover:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {/* Obstacle Icon */}
                    {isObstacle && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                        <ShieldAlert className="w-4 h-4 text-slate-600" />
                      </div>
                    )}

                    {/* Knight Piece */}
                    {isKnightHere && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-xl sm:text-2xl drop-shadow filter">♞</span>
                      </div>
                    )}

                    {/* Star to collect */}
                    {!isKnightHere && hasStar && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-bounce">
                        <Star className="w-5 h-5 fill-amber-400 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                      </div>
                    )}

                    {/* Footprint number trail on past cells */}
                    {wasVisited && !hasStar && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-[10px] font-black text-emerald-400/70">{stepIdx + 1}</span>
                      </div>
                    )}

                    {/* Valid Move Target Indicator Dot */}
                    {isValid && !hasStar && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Row ranks */}
          <div className="flex justify-between text-[10px] font-bold text-slate-500 pt-1.5 px-2">
            <span>Rank 1</span>
            <span>Rank {currentLevel.size}</span>
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
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-3xl p-6 text-white text-center shadow-xl space-y-3 animate-fade-in">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto text-amber-300">
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold">Quest Completed! All Stars Collected! 🎉</h3>
          <p className="text-xs text-emerald-100 max-w-md mx-auto">
            You guided the Knight to all {currentLevel.stars.length} star crystals in <strong className="text-white">{moves} L-hops</strong> ({formatTime(seconds)})!
          </p>
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-xl text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-300" />
            + {currentLevel.points} Skill Points Credited to Your Profile
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => resetLevel(currentLevel)}
              className="px-5 py-2 rounded-xl bg-white text-emerald-900 text-xs font-bold hover:bg-emerald-50 transition-all cursor-pointer shadow-md"
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
            Click glowing gold circles to leap the Knight
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Undo */}
          <button
            type="button"
            disabled={visitedPath.length <= 1 || hasWon}
            onClick={handleUndo}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>

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
