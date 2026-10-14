import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Terminal, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Lightbulb, 
  Trophy, 
  ArrowRight, 
  Bug, 
  Layers,
  Sparkles,
  HelpCircle,
  Check
} from 'lucide-react';
import { playPop, playSnap, playErrorTone, playChimeVictory } from '../../utils/puzzleAudio';

const CODE_PUZZLES = [
  // 1. Predict Output
  {
    id: 'predict-1',
    mode: 'predict',
    title: 'Loop Accumulator',
    language: 'javascript',
    code: `let total = 0;
for (let i = 1; i <= 4; i++) {
  total += i * 2;
}
console.log(total);`,
    options: ['12', '20', '16', '24'],
    correctAnswer: '20',
    explanation: 'i takes values 1, 2, 3, 4. Increments are 2, 4, 6, 8. Sum: 2 + 4 + 6 + 8 = 20.',
    hint: 'Trace each loop iteration: i=1 gives 2, i=2 gives 4, i=3 gives 6, i=4 gives 8.'
  },
  {
    id: 'predict-2',
    mode: 'predict',
    title: 'Array Filter & Transform',
    language: 'javascript',
    code: `const scores = [3, 6, 9, 12];
const result = scores
  .filter(n => n > 5)
  .map(n => n / 3);
console.log(result);`,
    options: ['[6, 9, 12]', '[2, 3, 4]', '[1, 2, 3, 4]', '[3, 4]'],
    correctAnswer: '[2, 3, 4]',
    explanation: 'Filter keeps numbers > 5 ([6, 9, 12]). Then map divides each by 3, yielding [2, 3, 4].',
    hint: 'First remove numbers less than or equal to 5, then divide each remaining item by 3.'
  },
  {
    id: 'predict-3',
    mode: 'predict',
    title: 'String Slicing & Join',
    language: 'javascript',
    code: `const title = "DEVELOPER";
const prefix = title.slice(0, 3);
const suffix = title.slice(-3);
console.log(prefix + "_" + suffix);`,
    options: ['DEV_PER', 'DEV_OPER', 'DEVE_PER', 'DEV_EVE'],
    correctAnswer: 'DEV_PER',
    explanation: 'title.slice(0, 3) extracts "DEV" and title.slice(-3) extracts the last 3 chars "PER". Combined: "DEV_PER".',
    hint: 'slice(0, 3) takes the first 3 letters. slice(-3) counts 3 letters from the end.'
  },

  // 2. Find the Bug
  {
    id: 'bug-1',
    mode: 'bug',
    title: 'Off-By-One Array Boundary',
    language: 'javascript',
    lines: [
      { num: 1, text: 'const items = ["Logo", "Banner", "Flyer"];' },
      { num: 2, text: 'for (let i = 0; i <= items.length; i++) {' },
      { num: 3, text: '  console.log(items[i].toUpperCase());' },
      { num: 4, text: '}' },
    ],
    bugLine: 2,
    explanation: 'Line 2 uses "i <= items.length", which accesses items[3] (undefined). Calling .toUpperCase() on undefined crashes with a TypeError! It should be "i < items.length".',
    hint: 'Look closely at the comparison operator in the loop header.'
  },
  {
    id: 'bug-2',
    mode: 'bug',
    title: 'Accidental Variable Reassignment',
    language: 'javascript',
    lines: [
      { num: 1, text: 'const hourlyRate = 750;' },
      { num: 2, text: 'const totalHours = 10;' },
      { num: 3, text: 'hourlyRate = hourlyRate * 1.2; // Bonus' },
      { num: 4, text: 'const payout = hourlyRate * totalHours;' },
    ],
    bugLine: 3,
    explanation: 'Line 3 attempts to reassign "hourlyRate", which was declared with "const". In JavaScript, assigning to a const variable throws a TypeError!',
    hint: 'Check which variable declaration keyword was used on line 1.'
  },

  // 3. Arrange Code Blocks
  {
    id: 'arrange-1',
    mode: 'arrange',
    title: 'Calculate Freelance Invoice',
    language: 'javascript',
    correctOrder: [
      'const subtotal = 5000;',
      'const discount = 0.10;',
      'const taxRate = 0.18;',
      'const discounted = subtotal * (1 - discount);',
      'const total = discounted * (1 + taxRate);',
      'return Math.round(total);'
    ],
    hint: 'Define base subtotal and rates first, compute discounted price, add tax, and return total.'
  }
];

export default function CodeLogicGame({ onGameWin, soundEnabled = true, onToggleSound }) {
  const [activePuzzleIndex, setActivePuzzleIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedBugLine, setSelectedBugLine] = useState(null);
  const [arrangedBlocks, setArrangedBlocks] = useState([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const puzzle = CODE_PUZZLES[activePuzzleIndex];

  // Initialize arrange blocks shuffled
  useEffect(() => {
    if (puzzle.mode === 'arrange') {
      const shuffled = [...puzzle.correctOrder].sort(() => Math.random() - 0.5);
      setArrangedBlocks(shuffled);
    }
    setSelectedOption(null);
    setSelectedBugLine(null);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setShowHint(false);
  }, [activePuzzleIndex, puzzle]);

  // Handle Predict selection
  const handleCheckPredict = (option) => {
    setSelectedOption(option);
    const correct = option === puzzle.correctAnswer;
    setIsAnswerChecked(true);
    setIsCorrect(correct);

    if (correct) {
      if (soundEnabled) playChimeVictory();
      setScore(s => s + 50);
      setStreak(st => st + 1);

      if (onGameWin) {
        onGameWin({
          game: 'code-logic',
          title: `Code Logic: ${puzzle.title}`,
          points: 50,
          badge: streak >= 2 ? '💻 Algorithm Master' : '💻 Code Logic Ace',
          timeTaken: 15,
          moves: 1
        });
      }
    } else {
      if (soundEnabled) playErrorTone();
      setStreak(0);
    }
  };

  // Handle Bug Line selection
  const handleCheckBugLine = (lineNum) => {
    setSelectedBugLine(lineNum);
    const correct = lineNum === puzzle.bugLine;
    setIsAnswerChecked(true);
    setIsCorrect(correct);

    if (correct) {
      if (soundEnabled) playChimeVictory();
      setScore(s => s + 60);
      setStreak(st => st + 1);

      if (onGameWin) {
        onGameWin({
          game: 'code-logic',
          title: `Bug Hunt: ${puzzle.title}`,
          points: 60,
          badge: '🐛 Bug Hunter',
          timeTaken: 20,
          moves: 1
        });
      }
    } else {
      if (soundEnabled) playErrorTone();
      setStreak(0);
    }
  };

  // Move arrange block up/down
  const moveBlock = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= arrangedBlocks.length) return;

    if (soundEnabled) playPop();
    const copy = [...arrangedBlocks];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setArrangedBlocks(copy);
    setIsAnswerChecked(false);
  };

  // Check arranged order
  const handleCheckArranged = () => {
    const correct = arrangedBlocks.every((block, idx) => block === puzzle.correctOrder[idx]);
    setIsAnswerChecked(true);
    setIsCorrect(correct);

    if (correct) {
      if (soundEnabled) playChimeVictory();
      setScore(s => s + 70);
      setStreak(st => st + 1);

      if (onGameWin) {
        onGameWin({
          game: 'code-logic',
          title: `Code Architecture: ${puzzle.title}`,
          points: 70,
          badge: '🧱 Code Architect',
          timeTaken: 25,
          moves: 4
        });
      }
    } else {
      if (soundEnabled) playErrorTone();
      setStreak(0);
    }
  };

  const handleNextPuzzle = () => {
    setActivePuzzleIndex(prev => (prev + 1) % CODE_PUZZLES.length);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
      
      {/* Header Info Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
              {puzzle.mode === 'predict' ? 'Predict Output' : puzzle.mode === 'bug' ? 'Find The Bug' : 'Arrange Sequence'}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Puzzle {activePuzzleIndex + 1} of {CODE_PUZZLES.length}
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {puzzle.title} 💻
          </h2>
        </div>

        {/* HUD Score */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-300 text-xs font-extrabold">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>{score} PTS</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-300 text-xs font-extrabold">
            <span>Streak: {streak}🔥</span>
          </div>
        </div>
      </div>

      {/* Mode 1: Predict Output */}
      {puzzle.mode === 'predict' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Terminal / Code Editor Container */}
          <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-950 font-mono text-xs sm:text-sm">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-slate-400 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span className="ml-2 font-bold text-slate-300">script.js</span>
              </div>
              <span className="text-[11px] text-slate-500">JavaScript ES6</span>
            </div>
            <pre className="p-5 text-emerald-400 leading-relaxed overflow-x-auto whitespace-pre">
              {puzzle.code}
            </pre>
          </div>

          {/* Prompt */}
          <p className="text-sm font-bold text-center text-slate-700 dark:text-slate-300">
            What will be printed to the console?
          </p>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-3">
            {puzzle.options.map((opt) => {
              const isSelected = selectedOption === opt;
              let btnStyle = 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:border-purple-400';
              if (isAnswerChecked && isSelected) {
                btnStyle = isCorrect
                  ? 'bg-emerald-500 border-emerald-600 text-white font-black'
                  : 'bg-rose-500 border-rose-600 text-white font-black';
              } else if (isAnswerChecked && opt === puzzle.correctAnswer) {
                btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-300 font-bold';
              }

              return (
                <button
                  key={opt}
                  type="button"
                  disabled={isAnswerChecked && isCorrect}
                  onClick={() => handleCheckPredict(opt)}
                  className={`p-4 rounded-2xl border font-mono text-sm sm:text-base font-bold transition-all cursor-pointer shadow-sm ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 2: Find the Bug */}
      {puzzle.mode === 'bug' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <p className="text-sm font-bold text-center text-slate-700 dark:text-slate-300">
            Click on the line containing the software bug:
          </p>

          {/* Clickable Code Lines */}
          <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-950 font-mono text-xs sm:text-sm">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-slate-400 text-xs">
              <span className="font-bold text-slate-300">buggy_module.js</span>
              <span className="text-rose-400 font-semibold flex items-center gap-1">
                <Bug className="w-3.5 h-3.5" /> 1 Syntax / Runtime Error Present
              </span>
            </div>

            <div className="p-3 divide-y divide-slate-900">
              {puzzle.lines.map((line) => {
                const isSelected = selectedBugLine === line.num;
                let lineBg = 'hover:bg-slate-900/90 text-slate-300';
                if (isAnswerChecked && isSelected) {
                  lineBg = isCorrect
                    ? 'bg-emerald-950/70 border border-emerald-500 text-emerald-300'
                    : 'bg-rose-950/70 border border-rose-500 text-rose-300';
                }

                return (
                  <button
                    key={line.num}
                    type="button"
                    onClick={() => handleCheckBugLine(line.num)}
                    className={`w-full text-left py-2 px-3 rounded-lg flex items-center gap-4 transition-all cursor-pointer ${lineBg}`}
                  >
                    <span className="text-slate-500 select-none w-6 text-right font-bold">{line.num}</span>
                    <span className="flex-1 font-mono">{line.text}</span>
                    {isSelected && (
                      <span className="text-xs font-bold">
                        {isCorrect ? '✅ BUG FOUND' : '❌ NO BUG HERE'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Arrange Sequence */}
      {puzzle.mode === 'arrange' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <p className="text-sm font-bold text-center text-slate-700 dark:text-slate-300">
            Reorder the code blocks from top to bottom in correct logical sequence:
          </p>

          <div className="space-y-2.5 font-mono text-xs sm:text-sm">
            {arrangedBlocks.map((block, idx) => (
              <div
                key={block}
                className="p-3.5 bg-slate-900 border border-slate-700 rounded-2xl flex items-center justify-between gap-3 text-slate-200 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-purple-400 font-bold flex items-center justify-center text-xs">
                    {idx + 1}
                  </span>
                  <span className="text-cyan-400">{block}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => moveBlock(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(idx, 1)}
                    disabled={idx === arrangedBlocks.length - 1}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                  >
                    ▼
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleCheckArranged}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-lg hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer"
            >
              Verify Code Execution Sequence
            </button>
          </div>
        </div>
      )}

      {/* Feedback & Explanation Drawer */}
      {isAnswerChecked && (
        <div className={`p-4 rounded-2xl border text-sm space-y-1.5 max-w-2xl mx-auto animate-fade-in ${
          isCorrect 
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
        }`}>
          <div className="flex items-center gap-2 font-bold">
            {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-rose-500" />}
            <span>{isCorrect ? 'Awesome! Correct Solution!' : 'Incorrect Analysis'}</span>
          </div>
          <p className="text-xs leading-relaxed font-medium">
            {puzzle.explanation}
          </p>
        </div>
      )}

      {/* Hint & Next Button Controls */}
      <div className="flex items-center justify-between max-w-2xl mx-auto pt-2 border-t border-slate-100 dark:border-slate-800">
        <div>
          {showHint ? (
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              💡 {puzzle.hint}
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 cursor-pointer"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Show Hint</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleNextPuzzle}
          className="px-5 py-2 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>Next Challenge</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
