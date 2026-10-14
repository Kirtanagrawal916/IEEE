import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Crown, 
  RotateCcw, 
  Lightbulb, 
  Eye, 
  EyeOff, 
  Trophy, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Volume2, 
  VolumeX,
  ChevronRight,
  Info
} from 'lucide-react';
import { triggerCelebrationConfetti } from '../../utils/confettiHelper';
import { playPop, playErrorTone, playChimeVictory } from '../../utils/puzzleAudio';

const BOARD_SIZES = [
  { size: 4, name: '4x4 Novice', desc: '4 Queens • 2 Solutions' },
  { size: 5, name: '5x5 Medium', desc: '5 Queens • 10 Solutions' },
  { size: 6, name: '6x6 Hard', desc: '6 Queens • Tricky!' },
  { size: 8, name: '8x8 Master', desc: '8 Queens • Classic Chess' },
];

export default function QueenPlacingGame({ onGameWin, soundEnabled = true, onToggleSound }) {
  const [boardSize, setBoardSize] = useState(4);
  const [queens, setQueens] = useState([]); // [{ row, col }]
  const [showThreats, setShowThreats] = useState(true);
  const [hoverCell, setHoverCell] = useState(null);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [hintMessage, setHintMessage] = useState(null);

  const resetGame = useCallback(() => {
    setQueens([]);
    setMoves(0);
    setSeconds(0);
    setIsTimerRunning(false);
    setHasWon(false);
    setHintMessage(null);
  }, []);

  // Reset when board size changes
  useEffect(() => {
    resetGame();
  }, [boardSize, resetGame]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && !hasWon) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, hasWon]);

  // Find all conflicting queens
  const conflicts = useMemo(() => {
    const conflictingSet = new Set();
    for (let i = 0; i < queens.length; i++) {
      for (let j = i + 1; j < queens.length; j++) {
        const q1 = queens[i];
        const q2 = queens[j];
        const sameRow = q1.row === q2.row;
        const sameCol = q1.col === q2.col;
        const sameDiag = Math.abs(q1.row - q2.row) === Math.abs(q1.col - q2.col);
        if (sameRow || sameCol || sameDiag) {
          conflictingSet.add(`${q1.row},${q1.col}`);
          conflictingSet.add(`${q2.row},${q2.col}`);
        }
      }
    }
    return conflictingSet;
  }, [queens]);

  // Threat map: set of "row,col" under attack by any queen
  const threatMap = useMemo(() => {
    const threatened = new Set();
    queens.forEach(q => {
      for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
          if (r === q.row && c === q.col) continue;
          if (r === q.row || c === q.col || Math.abs(r - q.row) === Math.abs(c - q.col)) {
            threatened.add(`${r},${c}`);
          }
        }
      }
    });
    return threatened;
  }, [queens, boardSize]);

  // Check victory condition
  useEffect(() => {
    if (queens.length === boardSize && conflicts.size === 0 && !hasWon) {
      setHasWon(true);
      setIsTimerRunning(false);
      triggerCelebrationConfetti();
      if (soundEnabled) playChimeVictory();
      if (onGameWin) {
        onGameWin({
          game: 'queen-placing',
          title: `N-Queens (${boardSize}x${boardSize})`,
          points: boardSize * 15,
          badge: boardSize === 8 ? 'Grandmaster Tactician' : 'Queen Strategist',
          timeTaken: seconds,
          moves
        });
      }
    }
  }, [queens, conflicts, boardSize, hasWon, moves, seconds, soundEnabled, onGameWin]);

  const handleCellClick = (r, c) => {
    if (hasWon) return;

    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }

    setMoves(m => m + 1);
    setHintMessage(null);

    const existingIndex = queens.findIndex(q => q.row === r && q.col === c);
    if (existingIndex !== -1) {
      // Remove queen
      setQueens(queens.filter((_, idx) => idx !== existingIndex));
      if (soundEnabled) playPop();
    } else {
      // Add queen
      if (queens.length >= boardSize) {
        setHintMessage(`You already placed all ${boardSize} queens. Remove or move one to adjust!`);
        if (soundEnabled) playErrorTone();
        return;
      }
      const newQueens = [...queens, { row: r, col: c }];
      setQueens(newQueens);
      if (soundEnabled) playPop();
    }
  };

  // Backtracking solver for hints or auto-solve
  const getSolutions = useCallback((size) => {
    const results = [];
    const board = [];
    function isSafe(row, col) {
      for (let r = 0; r < row; r++) {
        const c = board[r];
        if (c === col || Math.abs(r - row) === Math.abs(c - col)) return false;
      }
      return true;
    }
    function solve(row) {
      if (row === size) {
        results.push([...board]);
        return;
      }
      for (let col = 0; col < size; col++) {
        if (isSafe(row, col)) {
          board.push(col);
          solve(row + 1);
          board.pop();
          if (results.length >= 1) return; // Just need 1 solution
        }
      }
    }
    solve(0);
    return results;
  }, []);

  const handleShowHint = () => {
    if (conflicts.size > 0) {
      setHintMessage('⚠️ You have queens threatening each other (highlighted in red). Remove conflicting queens first!');
      if (soundEnabled) playErrorTone();
      return;
    }

    // Find unoccupied rows
    const occupiedRows = new Set(queens.map(q => q.row));
    let nextRow = -1;
    for (let r = 0; r < boardSize; r++) {
      if (!occupiedRows.has(r)) {
        nextRow = r;
        break;
      }
    }

    if (nextRow === -1) {
      setHintMessage('All rows have queens!');
      return;
    }

    // Look for an unthreatened cell in this row
    const safeCols = [];
    for (let c = 0; c < boardSize; c++) {
      if (!threatMap.has(`${nextRow},${c}`)) {
        safeCols.push(c);
      }
    }

    if (safeCols.length > 0) {
      const colLetter = String.fromCharCode(65 + safeCols[0]);
      setHintMessage(`💡 Hint: Row ${nextRow + 1}, Column ${colLetter} is completely safe from all current queens!`);
      if (soundEnabled) playPop();
    } else {
      setHintMessage('💡 No safe square on row ' + (nextRow + 1) + '. Your earlier queens block all squares here. Try repositioning an earlier queen!');
      if (soundEnabled) playErrorTone();
    }
  };

  const handleShowSolution = () => {
    const sols = getSolutions(boardSize);
    if (sols && sols.length > 0) {
      const sol = sols[0];
      const solutionQueens = sol.map((c, r) => ({ row: r, col: c }));
      setQueens(solutionQueens);
      setHintMessage('✨ Here is one elegant valid placement! Study how each queen dominates its own line.');
      if (soundEnabled) playPop();
    }
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            N-Queens Algorithmic Puzzle
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            Queen's Placement
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Place <strong className="text-purple-600 dark:text-purple-400">{boardSize} Queens</strong> on the board such that no two queens attack each other horizontally, vertically, or diagonally.
          </p>
        </div>

        {/* Board Size Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          {BOARD_SIZES.map((b) => (
            <button
              key={b.size}
              type="button"
              onClick={() => setBoardSize(b.size)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                boardSize === b.size
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700'
              }`}
            >
              {b.size}x{b.size}
            </button>
          ))}
        </div>
      </div>

      {/* Status & Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-purple-50 dark:bg-purple-950/40 p-3 rounded-2xl border border-purple-200 dark:border-purple-800/40 text-center">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Queens Placed</span>
          <span className="text-base font-extrabold text-purple-700 dark:text-purple-300 flex items-center justify-center gap-1">
            <Crown className="w-4 h-4 text-amber-500 fill-amber-500 inline" />
            {queens.length} / {boardSize}
          </span>
        </div>

        <div className={`p-3 rounded-2xl border text-center transition-colors ${
          conflicts.size > 0 
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 animate-pulse'
            : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
        }`}>
          <span className="text-[10px] uppercase font-bold block opacity-80">Safety Status</span>
          <span className="text-base font-extrabold flex items-center justify-center gap-1">
            {conflicts.size > 0 ? (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                {conflicts.size / 2} Conflict(s)
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {queens.length === 0 ? 'Empty Board' : 'No Conflicts! ✨'}
              </>
            )}
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

      {/* Main Chessboard View */}
      <div className="flex flex-col items-center justify-center space-y-4">
        
        {/* Chessboard Container */}
        <div className="p-3 bg-slate-900 rounded-3xl border-4 border-slate-800 shadow-2xl relative select-none">
          
          {/* Column letters A-H */}
          <div className="grid text-center text-[10px] font-bold text-slate-400 pb-1.5" style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))` }}>
            {Array.from({ length: boardSize }).map((_, i) => (
              <span key={i}>{String.fromCharCode(65 + i)}</span>
            ))}
          </div>

          {/* Grid Board */}
          <div 
            className="grid gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800"
            style={{ 
              gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
              gridTemplateRows: `repeat(${boardSize}, 1fr)`,
              width: boardSize === 8 ? 'min(85vw, 420px)' : boardSize === 6 ? 'min(75vw, 380px)' : 'min(70vw, 340px)',
              height: boardSize === 8 ? 'min(85vw, 420px)' : boardSize === 6 ? 'min(75vw, 380px)' : 'min(70vw, 340px)'
            }}
          >
            {Array.from({ length: boardSize }).map((_, r) =>
              Array.from({ length: boardSize }).map((_, c) => {
                const isQueen = queens.some(q => q.row === r && q.col === c);
                const isConflicted = conflicts.has(`${r},${c}`);
                const isThreatened = showThreats && threatMap.has(`${r},${c}`) && !isQueen;
                const isLightSquare = (r + c) % 2 === 0;
                const isHovered = hoverCell && hoverCell.row === r && hoverCell.col === c;

                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    onClick={() => handleCellClick(r, c)}
                    onMouseEnter={() => setHoverCell({ row: r, col: c })}
                    onMouseLeave={() => setHoverCell(null)}
                    aria-label={`Square ${String.fromCharCode(65 + c)}${r + 1}`}
                    className={`relative w-full h-full aspect-square rounded-xl flex items-center justify-center transition-colors duration-150 cursor-pointer text-center box-border border-2 overflow-hidden ${
                      isConflicted
                        ? 'bg-rose-500/30 border-rose-500 text-rose-400 shadow-inner animate-pulse'
                        : isQueen
                        ? 'bg-gradient-to-br from-amber-400 to-amber-600 border-amber-300 text-slate-950 shadow-md'
                        : isThreatened
                        ? 'bg-rose-950/40 border-rose-900/50 hover:bg-rose-900/40'
                        : isLightSquare
                        ? 'bg-slate-800 hover:bg-slate-700/80 border-transparent text-slate-400'
                        : 'bg-slate-850 hover:bg-slate-750/80 border-transparent text-slate-500'
                    }`}
                  >
                    {/* Queen Icon */}
                    {isQueen && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-md fill-white" />
                        {isConflicted && (
                          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-600 rounded-full border border-white animate-ping"></span>
                        )}
                      </div>
                    )}

                    {/* Threat dot overlay */}
                    {isThreatened && !isQueen && !isHovered && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500/50"></span>
                      </div>
                    )}

                    {/* Hover indicator on empty square */}
                    {!isQueen && isHovered && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Crown className="w-5 h-5 text-purple-300/60" />
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Row numbers */}
          <div className="flex justify-between text-[10px] font-bold text-slate-500 pt-1.5 px-2">
            <span>Rank 1</span>
            <span>Rank {boardSize}</span>
          </div>

        </div>

      </div>

      {/* Hint / Alert message banner */}
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
          <h3 className="text-xl font-extrabold">Victory! You Solved the {boardSize}-Queens Puzzle! 🎉</h3>
          <p className="text-xs text-emerald-100 max-w-md mx-auto">
            Outstanding algorithmic placement! You placed all {boardSize} queens with zero diagonal, horizontal, or vertical conflicts in <strong className="text-white">{moves} moves</strong> ({formatTime(seconds)}).
          </p>
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-xl text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-300" />
            + {boardSize * 15} Skill Points Credited to Your Profile
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => resetGame(boardSize)}
              className="px-5 py-2 rounded-xl bg-white text-emerald-800 text-xs font-bold hover:bg-emerald-50 transition-all cursor-pointer shadow-md"
            >
              Play Again
            </button>
            {boardSize < 8 && (
              <button
                type="button"
                onClick={() => setBoardSize(boardSize === 4 ? 5 : boardSize === 5 ? 6 : 8)}
                className="px-5 py-2 rounded-xl bg-amber-400 text-slate-900 text-xs font-bold hover:bg-amber-300 transition-all cursor-pointer shadow-md flex items-center gap-1.5"
              >
                Next Board Size <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Control Buttons Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
        <div className="flex items-center gap-2">
          {/* Threat Rays Toggle */}
          <button
            type="button"
            onClick={() => setShowThreats(!showThreats)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              showThreats
                ? 'bg-purple-100 dark:bg-purple-950/60 border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            {showThreats ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Threat Rays: {showThreats ? 'ON' : 'OFF'}</span>
          </button>

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
        </div>

        <div className="flex items-center gap-2">
          {/* Hint */}
          <button
            type="button"
            onClick={handleShowHint}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 hover:bg-amber-100 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Hint</span>
          </button>

          {/* Show Solution */}
          <button
            type="button"
            onClick={handleShowSolution}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800/60 hover:bg-indigo-100 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Solve Demo</span>
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={() => resetGame(boardSize)}
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
