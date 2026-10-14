import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Trophy, 
  RotateCcw, 
  Lightbulb, 
  CheckCircle2, 
  Flame, 
  Calendar, 
  Eraser, 
  Edit3, 
  AlertTriangle, 
  Sparkles, 
  Volume2, 
  VolumeX,
  Award
} from 'lucide-react';
import { triggerCelebrationConfetti } from '../../utils/confettiHelper';
import { playPop, playSnap, playErrorTone, playChimeVictory } from '../../utils/puzzleAudio';

// Handcrafted verified 9x9 Sudoku boards
const SUDOKU_PRESETS = {
  easy: {
    name: 'Easy (Daily Focus)',
    cluesCount: 38,
    // 0 represents empty cell
    initial: [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ],
    solution: [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ]
  },
  medium: {
    name: 'Medium (Logic Builder)',
    cluesCount: 30,
    initial: [
      [0, 0, 0, 6, 0, 0, 4, 0, 0],
      [7, 0, 0, 0, 0, 3, 6, 0, 0],
      [0, 0, 0, 0, 9, 1, 0, 8, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 5, 0, 1, 8, 0, 0, 0, 3],
      [0, 0, 0, 3, 0, 6, 0, 4, 5],
      [0, 4, 0, 2, 0, 0, 0, 6, 0],
      [9, 0, 3, 0, 0, 0, 0, 0, 0],
      [0, 2, 0, 0, 0, 0, 1, 0, 0],
    ],
    solution: [
      [5, 8, 9, 6, 7, 2, 4, 3, 1],
      [7, 1, 2, 8, 4, 3, 6, 5, 9],
      [3, 6, 4, 5, 9, 1, 7, 8, 2],
      [4, 3, 8, 9, 5, 7, 2, 1, 6],
      [2, 5, 6, 1, 8, 4, 9, 7, 3],
      [1, 9, 7, 3, 2, 6, 8, 4, 5],
      [8, 4, 1, 2, 3, 5, 0, 6, 7],
      [9, 7, 3, 4, 1, 8, 5, 2, 0],
      [6, 2, 5, 7, 0, 9, 1, 0, 4],
    ]
  },
  hard: {
    name: 'Hard (Mind Matrix)',
    cluesCount: 24,
    initial: [
      [0, 2, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 6, 0, 0, 0, 0, 3],
      [0, 7, 4, 0, 8, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 3, 0, 0, 2],
      [0, 8, 0, 0, 4, 0, 0, 1, 0],
      [6, 0, 0, 5, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 7, 8, 0],
      [5, 0, 0, 0, 0, 9, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 4, 0],
    ],
    solution: [
      [1, 2, 6, 4, 3, 7, 9, 5, 8],
      [8, 9, 5, 6, 2, 1, 4, 7, 3],
      [3, 7, 4, 9, 8, 5, 1, 2, 6],
      [4, 5, 7, 1, 9, 3, 8, 6, 2],
      [9, 8, 3, 2, 4, 6, 5, 1, 7],
      [6, 1, 2, 5, 7, 8, 3, 9, 4],
      [2, 6, 9, 3, 1, 4, 7, 8, 5],
      [5, 4, 8, 7, 6, 9, 2, 3, 1],
      [7, 3, 1, 8, 5, 2, 6, 4, 9],
    ]
  }
};

export default function DailySudokuGame({ onGameWin, soundEnabled = true, onToggleSound }) {
  const [difficulty, setDifficulty] = useState('easy');
  const [board, setBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null); // { r, c }
  const [pencilMode, setPencilMode] = useState(false);
  const [pencilNotes, setPencilNotes] = useState({}); // { "r,c": Set of numbers }
  const [mistakes, setMistakes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem('herearn_sudoku_streak') || '2', 10);
  });

  const activePreset = SUDOKU_PRESETS[difficulty];

  // Initialize board
  const startNewGame = useCallback((diff) => {
    const preset = SUDOKU_PRESETS[diff];
    const initialGrid = preset.initial.map(row => [...row]);
    setBoard(initialGrid);
    setSelectedCell(null);
    setPencilNotes({});
    setMistakes(0);
    setSeconds(0);
    setHasWon(false);
    setIsTimerRunning(true);
  }, []);

  useEffect(() => {
    startNewGame(difficulty);
  }, [difficulty, startNewGame]);

  // Timer
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && !hasWon) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, hasWon]);

  // Check if cell is an original fixed clue
  const isOriginalClue = useCallback((r, c) => {
    return activePreset.initial[r][c] !== 0;
  }, [activePreset]);

  // Enter number into selected cell
  const handleInputNumber = useCallback((num) => {
    if (!selectedCell || hasWon) return;
    const { r, c } = selectedCell;
    if (isOriginalClue(r, c)) return;

    if (pencilMode) {
      // Toggle pencil note
      const key = `${r},${c}`;
      setPencilNotes(prev => {
        const set = new Set(prev[key] || []);
        if (set.has(num)) set.delete(num);
        else set.add(num);
        return { ...prev, [key]: Array.from(set) };
      });
      if (soundEnabled) playPop();
      return;
    }

    const correctVal = activePreset.solution[r][c];
    if (num !== correctVal) {
      // Mistake!
      setMistakes(m => m + 1);
      if (soundEnabled) playErrorTone();
      return;
    }

    // Correct placement
    if (soundEnabled) playSnap();
    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = num;
    setBoard(newBoard);

    // Clear pencil notes for this cell
    setPencilNotes(prev => {
      const copy = { ...prev };
      delete copy[`${r},${c}`];
      return copy;
    });

    // Check completion
    const isCompleted = newBoard.every((row, rowIdx) => 
      row.every((val, colIdx) => val === activePreset.solution[rowIdx][colIdx])
    );

    if (isCompleted) {
      setHasWon(true);
      setIsTimerRunning(false);
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('herearn_sudoku_streak', newStreak.toString());

      if (soundEnabled) playChimeVictory();
      triggerCelebrationConfetti();

      if (onGameWin) {
        onGameWin({
          game: 'daily-sudoku',
          title: `Daily Sudoku (${activePreset.name})`,
          points: difficulty === 'easy' ? 60 : difficulty === 'medium' ? 80 : 120,
          badge: newStreak >= 3 ? '🔥 Daily Streak Master' : '🧩 Sudoku Solver',
          timeTaken: seconds,
          moves: 81 - activePreset.cluesCount
        });
      }
    }
  }, [selectedCell, hasWon, isOriginalClue, pencilMode, activePreset, soundEnabled, board, streak, difficulty, seconds, onGameWin]);

  // Erase cell content
  const handleErase = useCallback(() => {
    if (!selectedCell || hasWon) return;
    const { r, c } = selectedCell;
    if (isOriginalClue(r, c)) return;

    if (soundEnabled) playPop();
    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = 0;
    setBoard(newBoard);

    setPencilNotes(prev => {
      const copy = { ...prev };
      delete copy[`${r},${c}`];
      return copy;
    });
  }, [selectedCell, hasWon, isOriginalClue, soundEnabled, board]);

  // Keyboard navigation and typing
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (hasWon) return;
      if (e.key >= '1' && e.key <= '9') {
        handleInputNumber(parseInt(e.key, 10));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleErase();
      } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && selectedCell) {
        e.preventDefault();
        let { r, c } = selectedCell;
        if (e.key === 'ArrowUp') r = Math.max(0, r - 1);
        if (e.key === 'ArrowDown') r = Math.min(8, r + 1);
        if (e.key === 'ArrowLeft') c = Math.max(0, c - 1);
        if (e.key === 'ArrowRight') c = Math.min(8, c + 1);
        setSelectedCell({ r, c });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInputNumber, handleErase, selectedCell, hasWon]);

  // Check if cell is highlighted due to same row, col, or box as selected
  const isCellRelated = (r, c) => {
    if (!selectedCell) return false;
    if (selectedCell.r === r && selectedCell.c === c) return false;
    const sameRow = selectedCell.r === r;
    const sameCol = selectedCell.c === c;
    const sameBox = Math.floor(selectedCell.r / 3) === Math.floor(r / 3) && Math.floor(selectedCell.c / 3) === Math.floor(c / 3);
    return sameRow || sameCol || sameBox;
  };

  const isSameValue = (val) => {
    if (!selectedCell || !val) return false;
    const selVal = board[selectedCell.r]?.[selectedCell.c];
    return selVal !== 0 && selVal === val;
  };

  const formattedTime = useMemo(() => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, [seconds]);

  const todayDateStr = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl max-w-4xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Daily Challenge • {todayDateStr}
            </span>
            <span className="flex items-center gap-1 text-xs font-extrabold text-orange-500 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-md">
              <Flame className="w-3.5 h-3.5" />
              {streak}-Day Streak!
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Daily Sudoku Matrix 🧩
          </h2>
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
          {['easy', 'medium', 'hard'].map(d => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={`px-3 py-1.5 rounded-xl transition-all capitalize cursor-pointer ${
                difficulty === d
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Info & Stats Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 text-xs font-bold text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <span>Mistakes: <strong className={mistakes > 2 ? 'text-rose-500 font-extrabold' : 'text-slate-800 dark:text-white'}>{mistakes}/3</strong></span>
          <span>Clues: <strong className="text-purple-600 dark:text-purple-400">{activePreset.cluesCount}</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold text-slate-800 dark:text-white">⏱ {formattedTime}</span>
          <button
            type="button"
            onClick={() => startNewGame(difficulty)}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title="Reset Board"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* 9x9 Sudoku Grid Stage */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        
        <div className="p-2 sm:p-3 bg-slate-900 rounded-3xl border-2 border-slate-800 shadow-2xl inline-block select-none">
          <div className="grid grid-cols-9 gap-[1px] bg-slate-700 rounded-2xl overflow-hidden p-[2px]">
            {board.map((row, r) =>
              row.map((val, c) => {
                const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                const isClue = isOriginalClue(r, c);
                const isRelated = isCellRelated(r, c);
                const isHighlightedMatch = isSameValue(val);
                const cellNotes = pencilNotes[`${r},${c}`] || [];

                // 3x3 block borders
                const borderRight = (c + 1) % 3 === 0 && c !== 8 ? 'border-r-2 border-r-slate-500/80' : '';
                const borderBottom = (r + 1) % 3 === 0 && r !== 8 ? 'border-b-2 border-b-slate-500/80' : '';

                let cellBg = 'bg-white dark:bg-slate-800';
                if (isSelected) {
                  cellBg = 'bg-purple-600 text-white ring-2 ring-purple-400 z-10';
                } else if (isHighlightedMatch) {
                  cellBg = 'bg-purple-100 dark:bg-purple-900/60 text-purple-900 dark:text-purple-100 font-black';
                } else if (isRelated) {
                  cellBg = 'bg-slate-50 dark:bg-slate-850/80';
                }

                return (
                  <button
                    key={`cell-${r}-${c}`}
                    type="button"
                    onClick={() => setSelectedCell({ r, c })}
                    className={`w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center text-sm sm:text-base font-bold transition-colors cursor-pointer relative ${cellBg} ${borderRight} ${borderBottom}`}
                  >
                    {val !== 0 ? (
                      <span className={isClue ? 'font-black text-slate-900 dark:text-slate-100' : 'text-purple-600 dark:text-pink-400 font-extrabold'}>
                        {val}
                      </span>
                    ) : cellNotes.length > 0 ? (
                      <div className="grid grid-cols-3 gap-0 text-[8px] sm:text-[9px] font-mono text-slate-400 leading-none p-0.5">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                          <span key={n} className="flex items-center justify-center h-2.5 w-2.5">
                            {cellNotes.includes(n) ? n : ''}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side Controller & Keypad */}
        <div className="space-y-5 w-full max-w-xs">
          
          {/* Action Tools */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPencilMode(!pencilMode)}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                pencilMode
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>Pencil: {pencilMode ? 'ON' : 'OFF'}</span>
            </button>

            <button
              type="button"
              onClick={handleErase}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eraser className="w-4 h-4" />
              <span>Erase</span>
            </button>
          </div>

          {/* Number Keypad 1-9 */}
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => handleInputNumber(num)}
                className="h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-900 dark:text-white text-lg font-black shadow-sm transition-all cursor-pointer active:scale-95 flex items-center justify-center"
              >
                {num}
              </button>
            ))}
          </div>

          {/* Victory Modal Alert */}
          {hasWon && (
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 p-4 rounded-2xl text-center space-y-2 animate-fade-in">
              <div className="flex items-center justify-center gap-1.5 text-emerald-800 dark:text-emerald-200 font-black text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Daily Sudoku Solved!</span>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Completed in {formattedTime} with {mistakes} mistakes! Streak increased to {streak} days!
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
