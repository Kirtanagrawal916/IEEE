import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Crown, 
  Zap, 
  Gamepad2, 
  Trophy, 
  Sparkles, 
  Award, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Brain, 
  Layers,
  Compass,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Radio,
  Type,
  Code2,
  Calendar,
  PiggyBank,
  Search,
  FileSearch,
  Filter,
  Maximize2,
  Minimize2,
  Shuffle,
  LayoutGrid,
  Columns3,
  Flame,
  Info
} from 'lucide-react';
import QueenPlacingGame from './QueenPlacingGame';
import DotConnectGame from './DotConnectGame';
import CircuitLightsGame from './CircuitLightsGame';
import TowerOfHanoiGame from './TowerOfHanoiGame';
import KnightsQuestGame from './KnightsQuestGame';
import LaserMirrorGame from './LaserMirrorGame';
import WordScrambleGame from './WordScrambleGame';
import CodeLogicGame from './CodeLogicGame';
import DailySudokuGame from './DailySudokuGame';
import MoneyMazeGame from './MoneyMazeGame';
import CareerMysteryRoomGame from './CareerMysteryRoomGame';
import SkillWordSearchGame from './SkillWordSearchGame';
import { toggleMute, getMuted, playPop, playChimeVictory } from '../../utils/puzzleAudio';
import { triggerCelebrationConfetti } from '../../utils/confettiHelper';

export default function PuzzleHub({ user, onUpdateUserSkillPoints, showToast, defaultGame = 'queen' }) {
  const [selectedGame, setSelectedGame] = useState(defaultGame);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'career-word' | 'coding' | 'strategy'
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(!getMuted());
  const [sessionPoints, setSessionPoints] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  
  // Interactive View Controls
  const [viewMode, setViewMode] = useState('dock'); // 'dock' (compact horizontal carousel) | 'grid' (all 12 cards) | 'minimal' (pills only)
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const dockScrollRef = useRef(null);
  const arenaRef = useRef(null);

  const scrollDock = (direction) => {
    if (dockScrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      dockScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleToggleSound = () => {
    const isMutedNow = toggleMute();
    setSoundEnabled(!isMutedNow);
    if (!isMutedNow) playPop();
  };

  const handleGameWin = ({ game, title, points, badge, timeTaken, moves }) => {
    setSessionPoints(prev => prev + points);
    setSolvedCount(prev => prev + 1);

    if (badge && !unlockedBadges.includes(badge)) {
      setUnlockedBadges(prev => [...prev, badge]);
    }

    playChimeVictory();
    triggerCelebrationConfetti();

    if (onUpdateUserSkillPoints) {
      const currentPts = user?.skillPoints || 150;
      onUpdateUserSkillPoints(currentPts + points, badge);
    }

    if (showToast) {
      showToast(
        `🏆 Puzzle Solved: ${title}!`,
        `Earned +${points} Skill Points! Badge: ${badge || 'Logic Master'}`
      );
    }
  };

  const games = [
    // 1. Word Scramble
    {
      id: 'scramble',
      title: 'Word Scramble',
      subtitle: 'Career & Tech Vocabulary',
      category: 'career-word',
      tag: 'VOCABULARY',
      difficulty: 'Easy',
      pts: '+30 PTS',
      icon: Type,
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-500',
      borderColor: 'border-blue-400/40',
      desc: 'Rearrange mixed-up letters to form words related to coding, business, and tech.',
      badge: '🔤 Vocabulary Ace'
    },
    // 2. Code Logic Challenge
    {
      id: 'code-logic',
      title: 'Code Logic Challenge',
      subtitle: 'Syntax & Output Puzzles',
      category: 'coding',
      tag: 'CODING',
      difficulty: 'Medium',
      pts: '+50 PTS',
      icon: Code2,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-500',
      borderColor: 'border-emerald-400/40',
      desc: 'Predict program outputs, spot subtle software bugs, and order code blocks.',
      badge: '💻 Code Logic'
    },
    // 3. Daily Sudoku
    {
      id: 'sudoku',
      title: 'Daily Sudoku',
      subtitle: 'Number Matrix & Daily Streak',
      category: 'strategy',
      tag: 'DAILY STREAK',
      difficulty: 'Medium',
      pts: '+60 PTS',
      icon: Calendar,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-500',
      borderColor: 'border-amber-400/40',
      desc: 'Classic 9x9 number-placement puzzle with Easy, Medium, and Hard tiers.',
      badge: '🔥 Sudoku Streak'
    },
    // 4. Money Maze
    {
      id: 'money-maze',
      title: 'Money Maze',
      subtitle: 'Savings & Financial Literacy',
      category: 'strategy',
      tag: 'SIMULATION',
      difficulty: 'Adaptive',
      pts: '+45 PTS',
      icon: PiggyBank,
      color: 'from-emerald-600 to-green-700',
      textColor: 'text-emerald-500',
      borderColor: 'border-emerald-400/40',
      desc: 'Reach a ₹5,000 savings target through smart budgeting and avoiding debt traps.',
      badge: '🪙 Money Maze'
    },
    // 5. Career Mystery Room
    {
      id: 'career-mystery',
      title: 'Career Mystery Room',
      subtitle: 'Escape Room Investigation',
      category: 'career-word',
      tag: 'INVESTIGATION',
      difficulty: 'Hard',
      pts: '+75 PTS',
      icon: Search,
      color: 'from-purple-600 to-pink-600',
      textColor: 'text-purple-500',
      borderColor: 'border-purple-400/40',
      desc: 'Investigate resume red flags, decode client briefs, and ace behavioral interview chambers.',
      badge: '🕵️ Career Sleuth'
    },
    // 6. Skill Word Search
    {
      id: 'word-search',
      title: 'Skill Word Search',
      subtitle: 'Career Matrix Grid',
      category: 'career-word',
      tag: 'AWARENESS',
      difficulty: 'Easy',
      pts: '+35 PTS',
      icon: FileSearch,
      color: 'from-pink-500 to-rose-600',
      textColor: 'text-pink-500',
      borderColor: 'border-pink-400/40',
      desc: 'Discover hidden words in career grids spanning Python, UI/UX Design, and Marketing.',
      badge: '🔍 Word Finder'
    },
    // 7. Queen Placing (Classic)
    {
      id: 'queen',
      title: 'Queen Placing',
      subtitle: 'N-Queens Chess Logic',
      category: 'coding',
      tag: 'ALGORITHM',
      difficulty: 'Hard',
      pts: '+80 PTS',
      icon: Crown,
      color: 'from-amber-500 to-purple-600',
      textColor: 'text-amber-500',
      borderColor: 'border-amber-400/40',
      desc: 'Place N queens so no two queens share the same row, col, or diagonal.',
      badge: '👑 Chess Logic'
    },
    // 8. Joint Two Points (Classic)
    {
      id: 'dot-connect',
      title: 'Joint Two Points',
      subtitle: 'Color Flow & Routing',
      category: 'strategy',
      tag: 'SPATIAL',
      difficulty: 'Medium',
      pts: '+50 PTS',
      icon: Zap,
      color: 'from-pink-500 to-rose-600',
      textColor: 'text-pink-500',
      borderColor: 'border-pink-400/40',
      desc: 'Draw non-crossing wires connecting matching colored nodes across the grid.',
      badge: '🔴🟢 Flow Free'
    },
    // 9. The Knight's Quest
    {
      id: 'knight',
      title: "The Knight's Quest",
      subtitle: 'L-Hop Path & Star Quest',
      category: 'strategy',
      tag: 'TRAVERSAL',
      difficulty: 'Hard',
      pts: '+70 PTS',
      icon: Compass,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-500',
      borderColor: 'border-emerald-400/40',
      desc: 'Navigate the Chess Knight in L-shaped hops to collect all star crystals.',
      badge: '♞ Knight Quest'
    },
    // 10. Tower of Hanoi
    {
      id: 'hanoi',
      title: 'Tower of Hanoi',
      subtitle: 'Recursive Disk Stacking',
      category: 'strategy',
      tag: 'RECURSION',
      difficulty: 'Medium',
      pts: '+60 PTS',
      icon: Layers,
      color: 'from-amber-500 to-rose-600',
      textColor: 'text-amber-500',
      borderColor: 'border-amber-400/40',
      desc: 'Transfer disks from Peg A to Peg C without placing larger disks on smaller ones.',
      badge: '🗼 Recursion'
    },
    // 11. Circuit Grid
    {
      id: 'circuit',
      title: 'Circuit Grid',
      subtitle: 'Logic Matrix Flip',
      category: 'coding',
      tag: 'ENGINEERING',
      difficulty: 'Hard',
      pts: '+85 PTS',
      icon: Radio,
      color: 'from-cyan-500 to-blue-600',
      textColor: 'text-cyan-500',
      borderColor: 'border-cyan-400/40',
      desc: 'Light up every fuse across the circuit board without shorting neighboring cells.',
      badge: '⚡ Circuit Master'
    },
    // 12. Laser Matrix
    {
      id: 'laser',
      title: 'Laser Matrix',
      subtitle: '45° Optics Mirror Reflection',
      category: 'coding',
      tag: 'OPTICS LOGIC',
      difficulty: 'Expert',
      pts: '+100 PTS',
      icon: Sparkles,
      color: 'from-rose-500 to-purple-600',
      textColor: 'text-rose-500',
      borderColor: 'border-rose-400/40',
      desc: 'Rotate mirrors to bounce laser beams into target sensors around obstacles.',
      badge: '💎 Laser Optics'
    }
  ];

  // Filtered games based on tab and search
  const filteredGames = useMemo(() => {
    return games.filter(g => {
      const matchesFilter = activeFilter === 'all' || g.category === activeFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q || 
        g.title.toLowerCase().includes(q) || 
        g.subtitle.toLowerCase().includes(q) || 
        g.tag.toLowerCase().includes(q) ||
        g.desc.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [games, activeFilter, searchQuery]);

  const currentGame = useMemo(() => {
    return games.find(g => g.id === selectedGame) || games[0];
  }, [games, selectedGame]);

  const currentIndex = games.findIndex(g => g.id === selectedGame);
  const prevGame = currentIndex > 0 ? games[currentIndex - 1] : games[games.length - 1];
  const nextGame = currentIndex < games.length - 1 ? games[currentIndex + 1] : games[0];

  const handleSelectGame = (gameId) => {
    playPop();
    setSelectedGame(gameId);
  };

  const handleNextGame = () => {
    playPop();
    setSelectedGame(nextGame.id);
  };

  const handlePrevGame = () => {
    playPop();
    setSelectedGame(prevGame.id);
  };

  // Fun "Surprise Me / Random Game" Generator
  const handleRandomGame = () => {
    setIsSpinning(true);
    playPop();
    let counter = 0;
    const interval = setInterval(() => {
      const randIdx = Math.floor(Math.random() * games.length);
      setSelectedGame(games[randIdx].id);
      counter++;
      if (counter > 8) {
        clearInterval(interval);
        setIsSpinning(false);
        const finalIdx = Math.floor(Math.random() * games.length);
        setSelectedGame(games[finalIdx].id);
        if (showToast) {
          showToast("🎲 Random Arena Picked!", `Now playing "${games[finalIdx].title}"!`);
        }
      }
    }, 60);
  };

  // Keyboard navigation for power users (Left / Right arrow to change games when not in input)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' && e.altKey) {
        handleNextGame();
      } else if (e.key === 'ArrowLeft' && e.altKey) {
        handlePrevGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const CurrentIcon = currentGame.icon;

  return (
    <div className={`space-y-6 transition-all duration-300 text-slate-900 dark:text-white ${
      isFocusMode ? 'fixed inset-0 z-50 bg-[#0F0918] p-4 sm:p-8 overflow-y-auto' : ''
    }`}>
      
      {/* ========================================================
          1. COMPACT STREAMLINED ARCADE HEADER
         ======================================================== */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-2xl p-4 sm:p-5 border border-purple-500/30 text-white shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Left: Arcade Identity & Live Status */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-purple-500/30 shrink-0 animate-pulse">
            <Gamepad2 className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                Logic Arcade 🕹️
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                12 Games Ready
              </span>
            </div>
            <p className="text-xs text-purple-200/90 font-medium hidden sm:block">
              Skill challenges to sharpen problem-solving, algorithmic thinking, and earn career badges.
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center flex-wrap gap-2 justify-end">
          
          {/* Surprise Me / Randomizer Button */}
          <button
            type="button"
            onClick={handleRandomGame}
            disabled={isSpinning}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-pink-600 hover:from-amber-600 hover:to-pink-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Randomly Pick a Game"
          >
            <Shuffle className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Surprise Me!</span>
          </button>

          {/* Sound Synthesizer Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              soundEnabled
                ? 'bg-purple-600/30 border-purple-400/50 text-purple-200 hover:bg-purple-600/40'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
            }`}
            title="Toggle Synthesizer Audio Effects"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Audio On' : 'Muted'}</span>
          </button>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-xl border border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('dock')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'dock' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Carousel Dock View"
            >
              <Columns3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Expanded 12-Game Grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Focus Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsFocusMode(!isFocusMode)}
            className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isFocusMode 
                ? 'bg-pink-600 border-pink-400 text-white' 
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title={isFocusMode ? "Exit Focus Arena" : "Enter Focus Arena Mode"}
          >
            {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Session Points Chip */}
          <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/40 px-3 py-1.5 rounded-xl text-xs font-extrabold text-amber-300">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>+{sessionPoints} PTS</span>
          </div>

        </div>

      </div>

      {/* ========================================================
          2. INTERACTIVE GAME SELECTOR (DOCK OR GRID)
         ======================================================== */}
      
      {/* Category Pills & Instant Search Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All (12)', icon: Gamepad2 },
            { id: 'career-word', label: 'Career & Words (3)', icon: Type },
            { id: 'coding', label: 'Code & Logic (4)', icon: Code2 },
            { id: 'strategy', label: 'Strategy & Maze (5)', icon: Zap },
          ].map(f => {
            const FilterIcon = f.icon;
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  playPop();
                  setActiveFilter(f.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
              >
                <FilterIcon className="w-3.5 h-3.5" />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Filter Search */}
        <div className="relative min-w-[200px] sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search games or skills..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* DOCK VIEW: Sleek 1-Row Horizontal Swipeable Game Dock with Enhanced Vertical Dimensions */}
      {viewMode === 'dock' && (
        <div className="relative group">
          {/* Scroll Left Button */}
          <button
            type="button"
            onClick={() => scrollDock('left')}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 hover:scale-110 active:scale-95 transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100 hidden sm:flex"
            aria-label="Scroll challenges left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Scroll Right Button */}
          <button
            type="button"
            onClick={() => scrollDock('right')}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 hover:scale-110 active:scale-95 transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100 hidden sm:flex"
            aria-label="Scroll challenges right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div 
            ref={dockScrollRef}
            className="flex items-stretch gap-4 overflow-x-auto py-3 pb-6 scroll-smooth scrollbar-thin px-1"
          >
            {filteredGames.map((g) => {
              const isSelected = selectedGame === g.id;
              const Icon = g.icon;

              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => handleSelectGame(g.id)}
                  className={`min-w-[230px] sm:min-w-[260px] max-w-[285px] min-h-[160px] sm:min-h-[175px] p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between shrink-0 relative group/card ${
                    isSelected
                      ? 'bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-900 border-purple-400 text-white shadow-xl ring-2 ring-purple-500/40 -translate-y-1'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-lg hover:-translate-y-0.5'
                  }`}
                >
                  {/* Top Bar: Icon + Difficulty Badge + Points Pill */}
                  <div className="flex items-center justify-between gap-2 w-full">
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${g.color} flex items-center justify-center text-white shadow-md shrink-0 group-hover/card:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isSelected
                          ? 'bg-purple-800/80 text-purple-200 border border-purple-500/40'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {g.difficulty}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40'
                      }`}>
                        {g.pts}
                      </span>
                    </div>
                  </div>

                  {/* Middle Content: Title + Subtitle */}
                  <div className="my-3 space-y-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <h4 className={`font-black text-sm sm:text-base leading-snug truncate ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {g.title}
                      </h4>
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                      )}
                    </div>
                    <p className={`text-xs font-medium line-clamp-2 leading-relaxed ${isSelected ? 'text-purple-200/90' : 'text-slate-500 dark:text-slate-400'}`}>
                      {g.subtitle}
                    </p>
                  </div>

                  {/* Bottom Bar: Action Status + Tag */}
                  <div className={`pt-2.5 border-t flex items-center justify-between text-[11px] font-bold ${
                    isSelected ? 'border-purple-500/30' : 'border-slate-100 dark:border-slate-800'
                  }`}>
                    {isSelected ? (
                      <span className="text-emerald-400 flex items-center gap-1.5 font-black text-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        Active Arena
                      </span>
                    ) : (
                      <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1 group-hover/card:translate-x-0.5 transition-transform">
                        <span>Play Challenge</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    )}

                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      {g.tag}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* GRID VIEW: Optional Expanded 12-Card Grid if User Toggles Grid Mode */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 animate-fade-in">
          {filteredGames.map((g) => {
            const isSelected = selectedGame === g.id;
            const Icon = g.icon;

            return (
              <button
                key={g.id}
                type="button"
                onClick={() => handleSelectGame(g.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2.5 ${
                  isSelected
                    ? 'bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 border-purple-400 text-white shadow-xl ring-2 ring-purple-500/40 scale-[1.02]'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center text-white shadow-xs`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300">
                    {g.pts}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">{g.title}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{g.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ========================================================
          3. ACTIVE GAME ARENA WITH INTERACTIVE NAV BAR
         ======================================================== */}
      <div ref={arenaRef} className="space-y-4">
        
        {/* Arena Header Bar: Game Title, Quick Flippers, & Educational Drawer */}
        <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentGame.color} flex items-center justify-center text-white shadow-md shrink-0`}>
              <CurrentIcon className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                  {currentGame.title}
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                  {currentGame.tag}
                </span>
                <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {currentGame.pts}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {currentGame.desc}
              </p>
            </div>
          </div>

          {/* Quick Prev / Next Game Navigation Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handlePrevGame}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              title={`Switch to Previous Game: ${prevGame.title}`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden md:inline">{prevGame.title}</span>
            </button>

            <span className="text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400 px-1">
              {currentIndex + 1} / {games.length}
            </span>

            <button
              type="button"
              onClick={handleNextGame}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              title={`Switch to Next Game: ${nextGame.title}`}
            >
              <span className="hidden md:inline">{nextGame.title}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* ACTIVE PLAYABLE GAME COMPONENT */}
        <div className="transition-all duration-300">
          {selectedGame === 'scramble' && (
            <WordScrambleGame 
              onGameWin={handleGameWin}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
            />
          )}

          {selectedGame === 'code-logic' && (
            <CodeLogicGame 
              onGameWin={handleGameWin}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
            />
          )}

          {selectedGame === 'sudoku' && (
            <DailySudokuGame 
              onGameWin={handleGameWin}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
            />
          )}

          {selectedGame === 'money-maze' && (
            <MoneyMazeGame 
              onGameWin={handleGameWin}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
            />
          )}

          {selectedGame === 'career-mystery' && (
            <CareerMysteryRoomGame 
              onGameWin={handleGameWin}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
            />
          )}

          {selectedGame === 'word-search' && (
            <SkillWordSearchGame 
              onGameWin={handleGameWin}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
            />
          )}

          {selectedGame === 'queen' && (
            <QueenPlacingGame 
              onGameWin={handleGameWin}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
            />
          )}

          {selectedGame === 'dot-connect' && (
            <DotConnectGame 
              onGameWin={handleGameWin}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
            />
          )}

          {selectedGame === 'knight' && (
            <KnightsQuestGame 
              onGameWin={handleGameWin}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
            />
          )}

          {selectedGame === 'hanoi' && (
            <TowerOfHanoiGame 
              onGameWin={handleGameWin}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
            />
          )}

          {selectedGame === 'circuit' && (
            <CircuitLightsGame 
              onGameWin={handleGameWin}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
            />
          )}

          {selectedGame === 'laser' && (
            <LaserMirrorGame 
              onGameWin={handleGameWin}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
            />
          )}
        </div>

      </div>

      {/* ========================================================
          4. COMPACT COLLAPSIBLE EDUCATIONAL INSIGHT
         ======================================================== */}
      <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-purple-200 dark:border-purple-500/20 text-xs overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setShowInfoDrawer(!showInfoDrawer)}
          className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-purple-50/50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold uppercase tracking-wider text-[11px]">
            <Brain className="w-4 h-4 text-purple-500" />
            <span>Why Puzzle Games & Cognitive Challenges Matter in Tech Careers</span>
          </div>
          {showInfoDrawer ? <ChevronUp className="w-4 h-4 text-purple-500" /> : <ChevronDown className="w-4 h-4 text-purple-500" />}
        </button>

        {showInfoDrawer && (
          <div className="p-4 pt-0 text-slate-600 dark:text-slate-300 leading-relaxed font-medium border-t border-slate-100 dark:border-slate-800/60 animate-fade-in">
            Modern tech companies and clients look for problem-solving adaptability. Games like <strong>Word Scramble</strong> reinforce technical vocabulary, <strong>Code Logic Challenge</strong> builds debugging intuition, <strong>Daily Sudoku</strong> strengthens analytical focus, <strong>Money Maze</strong> teaches practical freelance budgeting, and <strong>Queen Placing</strong> sharpens constraint satisfaction skills. Every victory automatically adds Skill Points to your verified profile!
          </div>
        )}
      </div>

    </div>
  );
}
