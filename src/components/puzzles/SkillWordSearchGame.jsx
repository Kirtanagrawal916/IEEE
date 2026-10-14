import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Search, 
  Trophy, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Lightbulb, 
  Award, 
  Layers, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { triggerCelebrationConfetti } from '../../utils/confettiHelper';
import { playPop, playSnap, playErrorTone, playChimeVictory } from '../../utils/puzzleAudio';

const CATEGORIES = [
  {
    id: 'python-tech',
    name: 'Python & Tech',
    badge: '🐍 Python Scout',
    words: ['PYTHON', 'REACT', 'API', 'GITHUB', 'HTML', 'NODE', 'DATABASE'],
    grid: [
      ['P', 'Y', 'T', 'H', 'O', 'N', 'A', 'P', 'I', 'R'],
      ['R', 'E', 'A', 'C', 'T', 'G', 'I', 'T', 'H', 'U'],
      ['O', 'H', 'T', 'M', 'L', 'S', 'E', 'R', 'V', 'E'],
      ['G', 'I', 'T', 'H', 'U', 'B', 'A', 'S', 'E', 'D'],
      ['R', 'D', 'A', 'T', 'A', 'B', 'A', 'S', 'E', 'N'],
      ['A', 'N', 'O', 'D', 'E', 'F', 'G', 'H', 'I', 'O'],
      ['M', 'A', 'P', 'I', 'C', 'O', 'D', 'I', 'N', 'D'],
      ['M', 'Y', 'S', 'Q', 'L', 'K', 'J', 'H', 'G', 'E'],
      ['E', 'X', 'P', 'R', 'E', 'S', 'S', 'B', 'C', 'D'],
      ['R', 'F', 'U', 'L', 'L', 'S', 'T', 'A', 'C', 'K'],
    ]
  },
  {
    id: 'design-creative',
    name: 'UI/UX & Design',
    badge: '🎨 Design Detective',
    words: ['FIGMA', 'CANVA', 'LAYOUT', 'VECTOR', 'FONT', 'COLOR', 'PIXEL'],
    grid: [
      ['F', 'I', 'G', 'M', 'A', 'C', 'A', 'N', 'V', 'A'],
      ['L', 'A', 'Y', 'O', 'U', 'T', 'B', 'C', 'D', 'E'],
      ['V', 'E', 'C', 'T', 'O', 'R', 'F', 'O', 'N', 'T'],
      ['C', 'O', 'L', 'O', 'R', 'P', 'I', 'X', 'E', 'L'],
      ['U', 'I', 'U', 'X', 'A', 'S', 'S', 'E', 'T', 'S'],
      ['P', 'A', 'L', 'E', 'T', 'T', 'E', 'F', 'I', 'G'],
      ['I', 'C', 'O', 'N', 'S', 'B', 'R', 'A', 'N', 'D'],
      ['T', 'Y', 'P', 'O', 'G', 'R', 'A', 'P', 'H', 'Y'],
      ['D', 'E', 'S', 'I', 'G', 'N', 'M', 'O', 'C', 'K'],
      ['S', 'K', 'E', 'T', 'C', 'H', 'L', 'O', 'G', 'O'],
    ]
  },
  {
    id: 'freelance-career',
    name: 'Freelancing & Finance',
    badge: '💼 Freelance Lexicon',
    words: ['ESCROW', 'CLIENT', 'INVOICE', 'GIG', 'STIPEND', 'PAYOUT'],
    grid: [
      ['E', 'S', 'C', 'R', 'O', 'W', 'C', 'L', 'I', 'E'],
      ['C', 'L', 'I', 'E', 'N', 'T', 'I', 'N', 'V', 'O'],
      ['I', 'N', 'V', 'O', 'I', 'C', 'E', 'G', 'I', 'G'],
      ['S', 'T', 'I', 'P', 'E', 'N', 'D', 'E', 'A', 'R'],
      ['P', 'A', 'Y', 'O', 'U', 'T', 'M', 'O', 'N', 'E'],
      ['B', 'U', 'D', 'G', 'E', 'T', 'W', 'A', 'L', 'L'],
      ['F', 'R', 'E', 'E', 'L', 'A', 'N', 'C', 'E', 'R'],
      ['C', 'O', 'N', 'T', 'R', 'A', 'C', 'T', 'O', 'R'],
      ['M', 'I', 'L', 'E', 'S', 'T', 'O', 'N', 'E', 'S'],
      ['P', 'O', 'R', 'T', 'F', 'O', 'L', 'I', 'O', 'S'],
    ]
  }
];

export default function SkillWordSearchGame({ onGameWin, soundEnabled = true, onToggleSound }) {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [selectedCoords, setSelectedCoords] = useState([]); // [{ r, c }]
  const [foundWords, setFoundWords] = useState([]); // Array of word strings
  const [foundPaths, setFoundPaths] = useState({}); // { word: [{ r, c }] }
  const [hintWord, setHintWord] = useState(null);
  const [score, setScore] = useState(0);

  const activeCategory = CATEGORIES[categoryIndex];

  // Reset category
  const loadCategory = useCallback((idx) => {
    setCategoryIndex(idx);
    setSelectedCoords([]);
    setFoundWords([]);
    setFoundPaths({});
    setHintWord(null);
  }, []);

  // Handle cell click
  const handleCellClick = (r, c) => {
    if (soundEnabled) playPop();

    // If starting a new selection
    if (selectedCoords.length === 0) {
      setSelectedCoords([{ r, c }]);
      return;
    }

    // If clicking same as last, toggle off
    const last = selectedCoords[selectedCoords.length - 1];
    if (last.r === r && last.c === c) {
      setSelectedCoords(selectedCoords.slice(0, -1));
      return;
    }

    // Add coordinate
    const nextCoords = [...selectedCoords, { r, c }];
    setSelectedCoords(nextCoords);

    // Check if formed string matches any unfound word (forward or reverse)
    const formedStr = nextCoords.map(coord => activeCategory.grid[coord.r][coord.c]).join('');
    const reversedStr = formedStr.split('').reverse().join('');

    const matchingWord = activeCategory.words.find(w => 
      !foundWords.includes(w) && (w === formedStr || w === reversedStr)
    );

    if (matchingWord) {
      // Word found!
      if (soundEnabled) playSnap();
      const newFound = [...foundWords, matchingWord];
      setFoundWords(newFound);
      setFoundPaths(prev => ({ ...prev, [matchingWord]: nextCoords }));
      setSelectedCoords([]);
      setScore(s => s + 25);

      // Check if all words in category found!
      if (newFound.length === activeCategory.words.length) {
        if (soundEnabled) playChimeVictory();
        triggerCelebrationConfetti();
        if (onGameWin) {
          onGameWin({
            game: 'skill-word-search',
            title: `Word Search: ${activeCategory.name}`,
            points: 75,
            badge: activeCategory.badge,
            timeTaken: 30,
            moves: activeCategory.words.length
          });
        }
      }
    }
  };

  // Check if a coordinate is in currently active selection
  const isSelected = (r, c) => {
    return selectedCoords.some(coord => coord.r === r && coord.c === c);
  };

  // Check if coordinate is in any permanently found word path
  const isFoundPathCell = (r, c) => {
    return Object.values(foundPaths).some(path =>
      path.some(coord => coord.r === r && coord.c === c)
    );
  };

  const handleClearSelection = () => {
    setSelectedCoords([]);
  };

  const handleShowHint = () => {
    const unfound = activeCategory.words.find(w => !foundWords.includes(w));
    if (unfound) {
      setHintWord(unfound);
      if (soundEnabled) playPop();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-pink-100 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/50 flex items-center gap-1">
              <Search className="w-3.5 h-3.5" />
              Career Vocabulary Search
            </span>
            <span className="text-xs font-bold text-slate-500">
              Found: {foundWords.length} / {activeCategory.words.length}
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Skill Word Search 🔍
          </h2>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold flex-wrap">
          {CATEGORIES.map((cat, idx) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => loadCategory(idx)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                categoryIndex === idx
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: 10x10 Word Search Grid */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center space-y-4">
          <div className="p-3 sm:p-4 bg-slate-900 rounded-3xl border-2 border-slate-800 shadow-2xl inline-block select-none">
            <div className="grid grid-cols-10 gap-1 sm:gap-1.5">
              {activeCategory.grid.map((row, r) =>
                row.map((letter, c) => {
                  const selected = isSelected(r, c);
                  const isFound = isFoundPathCell(r, c);
                  const isHinted = hintWord && letter === hintWord[0] && !isFound;

                  let cellBg = 'bg-slate-800 text-slate-200 hover:bg-slate-700';
                  if (selected) {
                    cellBg = 'bg-pink-500 text-white ring-2 ring-pink-300 z-10 scale-105';
                  } else if (isFound) {
                    cellBg = 'bg-emerald-600/80 text-white font-black';
                  } else if (isHinted) {
                    cellBg = 'bg-amber-500/40 text-amber-300 ring-2 ring-amber-400';
                  }

                  return (
                    <button
                      key={`ws-${r}-${c}`}
                      type="button"
                      onClick={() => handleCellClick(r, c)}
                      className={`w-7 h-7 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-mono text-xs sm:text-base font-black transition-all cursor-pointer shadow-sm ${cellBg}`}
                    >
                      {letter}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Selection Toolbar */}
          <div className="flex items-center gap-3 text-xs">
            {selectedCoords.length > 0 && (
              <span className="font-mono bg-purple-50 dark:bg-purple-950 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold">
                Selected: {selectedCoords.map(c => activeCategory.grid[c.r][c.c]).join('')}
              </span>
            )}

            <button
              type="button"
              onClick={handleClearSelection}
              disabled={selectedCoords.length === 0}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer font-semibold"
            >
              Clear Selection
            </button>
          </div>
        </div>

        {/* Right: Word Checklist & Rewards */}
        <div className="lg:col-span-4 space-y-5">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Word Bank to Find</span>
              <span className="text-pink-600 font-extrabold">{foundWords.length}/{activeCategory.words.length}</span>
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {activeCategory.words.map(w => {
                const isFound = foundWords.includes(w);

                return (
                  <div
                    key={w}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                      isFound
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 line-through opacity-80'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold'
                    }`}
                  >
                    <span>{w}</span>
                    {isFound && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <button
                type="button"
                onClick={handleShowHint}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Need a hint?</span>
              </button>
              {hintWord && (
                <span className="text-[11px] font-bold text-amber-500">
                  Starts with '{hintWord[0]}'
                </span>
              )}
            </div>
          </div>

          {/* Category Reward Badge Preview */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 border border-purple-500/20 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Category Reward</span>
            <div className="flex items-center justify-center gap-1.5 text-sm font-black text-purple-700 dark:text-purple-300">
              <Award className="w-4 h-4 text-pink-500" />
              <span>{activeCategory.badge}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              +{75} Skill Points upon category completion!
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
