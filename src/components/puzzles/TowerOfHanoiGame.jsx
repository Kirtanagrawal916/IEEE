import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  RotateCcw, 
  Lightbulb, 
  Trophy, 
  Sparkles, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Undo2, 
  Layers, 
  Play, 
  Info,
  Star
} from 'lucide-react';
import { triggerCelebrationConfetti } from '../../utils/confettiHelper';
import { playPop, playSnap, playErrorTone, playChimeVictory } from '../../utils/puzzleAudio';

// Color themes for disks by size (1 = smallest, 6 = largest)
const DISK_STYLES = {
  1: { bg: 'from-rose-400 to-pink-500', border: 'border-pink-300', text: 'text-white', widthPct: '30%' },
  2: { bg: 'from-amber-400 to-amber-500', border: 'border-amber-300', text: 'text-slate-950', widthPct: '44%' },
  3: { bg: 'from-emerald-400 to-teal-500', border: 'border-emerald-300', text: 'text-white', widthPct: '58%' },
  4: { bg: 'from-sky-400 to-blue-500', border: 'border-sky-300', text: 'text-white', widthPct: '72%' },
  5: { bg: 'from-indigo-400 to-purple-500', border: 'border-indigo-300', text: 'text-white', widthPct: '86%' },
  6: { bg: 'from-fuchsia-500 to-pink-600', border: 'border-fuchsia-300', text: 'text-white', widthPct: '100%' }
};

const DISK_OPTIONS = [
  { count: 3, label: '3 Disks (Novice)', minMoves: 7, points: 40 },
  { count: 4, label: '4 Disks (Medium)', minMoves: 15, points: 60 },
  { count: 5, label: '5 Disks (Advanced)', minMoves: 31, points: 80 },
  { count: 6, label: '6 Disks (Master)', minMoves: 63, points: 100 },
];

export default function TowerOfHanoiGame({ onGameWin, soundEnabled = true, onToggleSound }) {
  const [diskCount, setDiskCount] = useState(3);
  const [pegs, setPegs] = useState({ A: [3, 2, 1], B: [], C: [] });
  const [selectedPeg, setSelectedPeg] = useState(null);
  const [history, setHistory] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [hintMessage, setHintMessage] = useState(null);
  const [isAutoSolving, setIsAutoSolving] = useState(false);

  const autoSolveTimeoutRef = useRef(null);

  const minMoves = Math.pow(2, diskCount) - 1;

  // Initialize game when disk count changes
  const resetGame = useCallback((count = diskCount) => {
    if (autoSolveTimeoutRef.current) {
      clearTimeout(autoSolveTimeoutRef.current);
    }
    const initialDisks = Array.from({ length: count }, (_, i) => count - i); // e.g. [3, 2, 1]
    setPegs({ A: initialDisks, B: [], C: [] });
    setSelectedPeg(null);
    setHistory([]);
    setMoves(0);
    setSeconds(0);
    setIsTimerRunning(false);
    setHasWon(false);
    setHintMessage(null);
    setIsAutoSolving(false);
  }, [diskCount]);

  useEffect(() => {
    resetGame(diskCount);
    return () => {
      if (autoSolveTimeoutRef.current) clearTimeout(autoSolveTimeoutRef.current);
    };
  }, [diskCount, resetGame]);

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

  // Peg click handler
  const handlePegClick = (pegId) => {
    if (hasWon || isAutoSolving) return;

    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }

    setHintMessage(null);

    // Step 1: No peg currently selected -> Lift top disk
    if (!selectedPeg) {
      if (pegs[pegId].length === 0) {
        return; // Empty peg, nothing to lift
      }
      setSelectedPeg(pegId);
      if (soundEnabled) playPop();
      return;
    }

    // Step 2: Clicking the same peg -> Lower disk back down
    if (selectedPeg === pegId) {
      setSelectedPeg(null);
      if (soundEnabled) playPop();
      return;
    }

    // Step 3: Attempting to drop onto another peg
    const sourcePegDisks = pegs[selectedPeg];
    const targetPegDisks = pegs[pegId];
    const diskToMove = sourcePegDisks[sourcePegDisks.length - 1];
    const targetTopDisk = targetPegDisks[targetPegDisks.length - 1];

    // Check validity: target must be empty OR top disk must be strictly larger than incoming disk
    if (targetTopDisk !== undefined && targetTopDisk < diskToMove) {
      setHintMessage(`⚠️ Invalid move! You cannot place a larger disk (${diskToMove}) on top of a smaller disk (${targetTopDisk}).`);
      if (soundEnabled) playErrorTone();
      return;
    }

    // Execute Move
    const nextPegs = {
      ...pegs,
      [selectedPeg]: sourcePegDisks.slice(0, -1),
      [pegId]: [...targetPegDisks, diskToMove]
    };

    setHistory(prev => [...prev, pegs]);
    setPegs(nextPegs);
    setSelectedPeg(null);
    setMoves(m => m + 1);
    if (soundEnabled) playSnap();

    // Check Win Condition: All disks successfully on Peg C
    if (nextPegs.C.length === diskCount) {
      setHasWon(true);
      setIsTimerRunning(false);
      triggerCelebrationConfetti();
      if (soundEnabled) playChimeVictory();

      const earnedPts = diskCount * 20;
      if (onGameWin) {
        onGameWin({
          game: 'tower-of-hanoi',
          title: `Tower of Hanoi (${diskCount} Disks)`,
          points: earnedPts,
          badge: diskCount >= 5 ? 'Recursion Grandmaster' : 'Tower Stacker Pro',
          timeTaken: seconds,
          moves: moves + 1
        });
      }
    }
  };

  // Undo move
  const handleUndo = () => {
    if (history.length === 0 || hasWon || isAutoSolving) return;
    const previousState = history[history.length - 1];
    setPegs(previousState);
    setHistory(history.slice(0, -1));
    setSelectedPeg(null);
    setMoves(m => Math.max(0, m - 1));
    if (soundEnabled) playPop();
  };

  // Recursive solution generator for hint and auto-solve
  const getHanoiSequence = useCallback((n, src = 'A', dest = 'C', aux = 'B') => {
    const list = [];
    function solve(count, from, to, via) {
      if (count === 1) {
        list.push({ from, to });
        return;
      }
      solve(count - 1, from, via, to);
      list.push({ from, to });
      solve(count - 1, via, to, from);
    }
    solve(n, src, dest, aux);
    return list;
  }, []);

  const handleHint = () => {
    if (hasWon) return;

    // Suggest next step of the optimal path
    const fullSequence = getHanoiSequence(diskCount);
    const nextStep = fullSequence[moves] || fullSequence[0];

    setHintMessage(`💡 Optimal Move: Lift from Peg ${nextStep.from} and place onto Peg ${nextStep.to}.`);
    if (soundEnabled) playPop();
  };

  // Auto-solve demonstration
  const handleAutoSolve = () => {
    if (isAutoSolving) return;
    resetGame(diskCount);
    setIsAutoSolving(true);
    setIsTimerRunning(true);

    const movesList = getHanoiSequence(diskCount);
    let stepIndex = 0;

    let currentPegs = {
      A: Array.from({ length: diskCount }, (_, i) => diskCount - i),
      B: [],
      C: []
    };

    function playNextStep() {
      if (stepIndex >= movesList.length) {
        setIsAutoSolving(false);
        setIsTimerRunning(false);
        setHasWon(true);
        triggerCelebrationConfetti();
        if (soundEnabled) playChimeVictory();
        return;
      }

      const { from, to } = movesList[stepIndex];
      const disk = currentPegs[from][currentPegs[from].length - 1];

      currentPegs = {
        ...currentPegs,
        [from]: currentPegs[from].slice(0, -1),
        [to]: [...currentPegs[to], disk]
      };

      setPegs({ ...currentPegs });
      setMoves(stepIndex + 1);
      if (soundEnabled) playSnap();

      stepIndex++;
      autoSolveTimeoutRef.current = setTimeout(playNextStep, 500);
    }

    autoSolveTimeoutRef.current = setTimeout(playNextStep, 400);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const efficiency = moves === 0 ? 100 : Math.max(0, Math.round((minMoves / moves) * 100));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-200 dark:border-purple-500/30 p-6 md:p-8 shadow-xl space-y-6 select-none">
      
      {/* Game Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Recursive Algorithm Classic
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            Tower of Hanoi
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Transfer all disks from <strong className="text-purple-600 dark:text-purple-400">Peg A</strong> to <strong className="text-pink-600 dark:text-pink-400">Peg C</strong>. <strong className="text-amber-600 dark:text-amber-400">Never place a larger disk on a smaller disk!</strong>
          </p>
        </div>

        {/* Disk Count Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          {DISK_OPTIONS.map((opt) => (
            <button
              key={opt.count}
              type="button"
              disabled={isAutoSolving}
              onClick={() => setDiskCount(opt.count)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                diskCount === opt.count
                  ? 'bg-gradient-to-r from-amber-500 to-purple-600 text-white shadow-md shadow-amber-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {opt.count} Disks ({opt.minMoves} moves)
            </button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-2xl border border-amber-200 dark:border-amber-800/40 text-center">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Moves</span>
          <span className="text-base font-extrabold text-amber-700 dark:text-amber-300">
            {moves} <span className="text-xs font-semibold text-slate-400">/ {minMoves} min</span>
          </span>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/40 p-3 rounded-2xl border border-purple-200 dark:border-purple-800/40 text-center">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Optimal Target</span>
          <span className="text-base font-extrabold text-purple-700 dark:text-purple-300">
            2^{diskCount} - 1 = {minMoves}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Efficiency</span>
          <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {efficiency}%
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Timer</span>
          <span className="text-base font-extrabold text-slate-800 dark:text-white font-mono">{formatTime(seconds)}</span>
        </div>
      </div>

      {/* Main Pegs Viewport */}
      <div className="p-4 sm:p-6 bg-slate-950 rounded-3xl border-4 border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Floor Stand Base */}
        <div className="absolute bottom-6 left-6 right-6 h-4 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 rounded-full shadow-lg border-t border-amber-600/40 pointer-events-none"></div>

        {/* 3 Peg Columns */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 relative z-10 min-h-[260px] sm:min-h-[300px] pt-12 pb-8">
          {['A', 'B', 'C'].map((pegId) => {
            const disks = pegs[pegId];
            const isSelected = selectedPeg === pegId;
            const liftedDisk = isSelected ? disks[disks.length - 1] : null;
            const remainingDisks = isSelected ? disks.slice(0, -1) : disks;

            const pegTitle = pegId === 'A' ? 'Peg A (Start)' : pegId === 'B' ? 'Peg B (Auxiliary)' : 'Peg C (Target 🏆)';

            return (
              <div
                key={pegId}
                onClick={() => handlePegClick(pegId)}
                className={`relative flex flex-col items-center justify-end rounded-2xl p-2 cursor-pointer transition-all duration-200 group ${
                  isSelected
                    ? 'bg-purple-950/40 ring-2 ring-purple-500/50 shadow-inner'
                    : 'hover:bg-slate-900/60'
                }`}
              >
                {/* Lifted Disk Preview (Floating above the peg) */}
                <div className="h-10 flex items-center justify-center w-full mb-3">
                  {isSelected && liftedDisk && (
                    <div
                      style={{ width: DISK_STYLES[liftedDisk]?.widthPct || '50%' }}
                      className={`h-7 rounded-xl bg-gradient-to-r ${DISK_STYLES[liftedDisk]?.bg} border-2 ${DISK_STYLES[liftedDisk]?.border} shadow-[0_0_15px_rgba(236,72,153,0.5)] flex items-center justify-center text-xs font-black text-white animate-bounce`}
                    >
                      Disk {liftedDisk}
                    </div>
                  )}
                </div>

                {/* Vertical Wooden Pole */}
                <div className="w-3.5 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 rounded-full h-44 sm:h-52 absolute bottom-6 z-0 shadow-md border-x border-amber-600/30"></div>

                {/* Stack of resting disks */}
                <div className="w-full flex flex-col-reverse items-center gap-1.5 z-10 mb-2">
                  {remainingDisks.map((dSize) => {
                    const style = DISK_STYLES[dSize] || { bg: 'from-purple-500 to-pink-500', widthPct: '50%' };
                    return (
                      <div
                        key={dSize}
                        style={{ width: style.widthPct }}
                        className={`h-6 sm:h-7 rounded-xl bg-gradient-to-r ${style.bg} border-2 ${style.border} shadow-md flex items-center justify-center text-[11px] font-black ${style.text} transition-transform transform group-hover:scale-[1.02]`}
                      >
                        Disk {dSize}
                      </div>
                    );
                  })}
                </div>

                {/* Peg Label Badge */}
                <div className="z-10 mt-3">
                  <span className={`text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-xl uppercase tracking-wider transition-colors ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-md'
                      : pegId === 'C'
                      ? 'bg-pink-950 text-pink-300 border border-pink-700/60'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {pegTitle}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Hint / Error message */}
      {hintMessage && (
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5 animate-fade-in font-medium">
          <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">{hintMessage}</div>
        </div>
      )}

      {/* Victory Callout Card */}
      {hasWon && (
        <div className="bg-gradient-to-r from-amber-500 via-purple-600 to-pink-600 rounded-3xl p-6 text-white text-center shadow-xl space-y-3 animate-fade-in">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto text-amber-300">
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold">Tower Completed! All Disks Transferred! 🎉</h3>
          <p className="text-xs text-amber-100 max-w-md mx-auto">
            You solved the {diskCount}-disk Tower of Hanoi in <strong className="text-white">{moves} moves</strong> ({formatTime(seconds)}) with <strong className="text-white">{efficiency}% efficiency</strong>!
          </p>
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-xl text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-300" />
            + {diskCount * 20} Skill Points Credited to Your Profile
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => resetGame(diskCount)}
              className="px-5 py-2 rounded-xl bg-white text-purple-950 text-xs font-bold hover:bg-amber-50 transition-all cursor-pointer shadow-md"
            >
              Play Again
            </button>
            {diskCount < 6 && (
              <button
                type="button"
                onClick={() => setDiskCount(diskCount + 1)}
                className="px-5 py-2 rounded-xl bg-amber-400 text-slate-900 text-xs font-bold hover:bg-amber-300 transition-all cursor-pointer shadow-md flex items-center gap-1.5"
              >
                Next Disk Count <ChevronRight className="w-4 h-4" />
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
            Tap peg to lift top disk, then tap destination peg
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Undo */}
          <button
            type="button"
            disabled={history.length === 0 || isAutoSolving}
            onClick={handleUndo}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>

          {/* Hint */}
          <button
            type="button"
            disabled={isAutoSolving}
            onClick={handleHint}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 hover:bg-amber-100 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Hint</span>
          </button>

          {/* Auto Solve Demo */}
          <button
            type="button"
            disabled={isAutoSolving}
            onClick={handleAutoSolve}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800/60 hover:bg-purple-100 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isAutoSolving ? 'Solving...' : 'Solve Demo'}</span>
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={() => resetGame(diskCount)}
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
