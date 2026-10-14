import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import QueenPlacingGame from './QueenPlacingGame';
import DotConnectGame from './DotConnectGame';
import CircuitLightsGame from './CircuitLightsGame';
import TowerOfHanoiGame from './TowerOfHanoiGame';
import KnightsQuestGame from './KnightsQuestGame';
import { toggleMute, getMuted } from '../../utils/puzzleAudio';

export default function PuzzleHub({ user, onUpdateUserSkillPoints, showToast, defaultGame = 'queen' }) {
  const [selectedGame, setSelectedGame] = useState(defaultGame); // 'queen' | 'dot-connect' | 'knight' | 'hanoi' | 'circuit'
  const [soundEnabled, setSoundEnabled] = useState(!getMuted());
  const [sessionPoints, setSessionPoints] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState([]);

  const handleToggleSound = () => {
    const isMutedNow = toggleMute();
    setSoundEnabled(!isMutedNow);
  };

  const handleGameWin = ({ game, title, points, badge, timeTaken, moves }) => {
    setSessionPoints(prev => prev + points);
    setSolvedCount(prev => prev + 1);

    if (badge && !unlockedBadges.includes(badge)) {
      setUnlockedBadges(prev => [...prev, badge]);
    }

    if (onUpdateUserSkillPoints) {
      const currentPts = user?.skillPoints || 150;
      onUpdateUserSkillPoints(currentPts + points, badge);
    }

    if (showToast) {
      showToast(
        `🏆 Puzzle Solved: ${title}!`,
        `Earned +${points} Skill Points in ${moves} moves (${timeTaken}s)! Badge: ${badge || 'Logic Master'}`
      );
    }
  };

  const games = [
    {
      id: 'queen',
      title: 'Queen Placing',
      subtitle: 'N-Queens Chess Logic',
      tag: 'Algorithmic Classic',
      icon: Crown,
      color: 'from-amber-500 to-purple-600',
      textColor: 'text-amber-500',
      borderColor: 'border-amber-400/40',
      desc: 'Place N queens so no two queens share the same row, col, or diagonal.',
      badge: '👑 Chess Logic'
    },
    {
      id: 'dot-connect',
      title: 'Joint Two Points',
      subtitle: 'Color Flow & Circuit',
      tag: 'Spatial Routing',
      icon: Zap,
      color: 'from-pink-500 to-rose-600',
      textColor: 'text-pink-500',
      borderColor: 'border-pink-400/40',
      desc: 'Draw non-crossing wires connecting matching colored nodes across the grid.',
      badge: '🔴🟢 Flow Free'
    },
    {
      id: 'knight',
      title: "The Knight's Quest",
      subtitle: 'L-Hop Path & Star Quest',
      tag: 'Graph Traversal',
      icon: Compass,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-500',
      borderColor: 'border-emerald-400/40',
      desc: 'Navigate the Chess Knight in L-shaped hops to collect all star crystals without hitting obstacles.',
      badge: '♞ Knight Quest'
    },
    {
      id: 'hanoi',
      title: 'Tower of Hanoi',
      subtitle: 'Recursive Disk Stacking',
      tag: 'Recursion Master',
      icon: Layers,
      color: 'from-amber-500 to-rose-600',
      textColor: 'text-amber-500',
      borderColor: 'border-amber-400/40',
      desc: 'Transfer all disks from Peg A to Peg C without placing larger disks on smaller ones.',
      badge: '🗼 Recursion'
    },
    {
      id: 'circuit',
      title: 'Circuit Grid',
      subtitle: 'Logic Matrix Flip',
      tag: 'Engineering Flip',
      icon: Brain,
      color: 'from-cyan-500 to-blue-600',
      textColor: 'text-cyan-500',
      borderColor: 'border-cyan-400/40',
      desc: 'Energize all circuit nodes by toggling cross patterns to 100% power.',
      badge: '💡 Lights Out'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-slate-900 dark:text-white">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 md:p-10 border border-purple-500/30 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs font-bold uppercase tracking-wider">
              <Gamepad2 className="w-3.5 h-3.5 text-pink-400" />
              Cognitive & Problem Solving Arena
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Mini Puzzle Games & Logic Lab 🧩
            </h1>

            <p className="text-sm sm:text-base text-purple-100 font-medium leading-relaxed">
              Sharpen your analytical mindset with interactive logic puzzles! Solve the classic <strong className="text-amber-300">Queen Placing (N-Queens)</strong> challenge or <strong className="text-pink-300">Joint Two Points (Dot Connect)</strong> to train algorithmic thinking and earn bonus Career Skill Points.
            </p>

            {/* Session Stats Chips */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-purple-200">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10">
                <Trophy className="w-4 h-4 text-amber-400" />
                Session Earned: <strong className="text-amber-300 font-bold">+{sessionPoints} PTS</strong>
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Puzzles Solved: <strong className="text-white">{solvedCount}</strong>
              </span>
              {unlockedBadges.length > 0 && (
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md border border-pink-400/30 text-pink-200">
                  <Award className="w-4 h-4 text-pink-400" />
                  {unlockedBadges.length} New Badge(s)!
                </span>
              )}
            </div>
          </div>

          {/* Sound & Motivation Widget */}
          <div className="bg-slate-900/80 border border-purple-400/30 p-5 rounded-3xl text-center backdrop-blur-md w-full md:w-auto space-y-3">
            <span className="text-[11px] text-purple-300 font-bold uppercase block">Interactive Controls</span>
            
            <button
              type="button"
              onClick={handleToggleSound}
              className={`w-full px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                soundEnabled
                  ? 'bg-purple-600/30 border-purple-400/50 text-purple-200'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
              <span>Synthesizer Audio: {soundEnabled ? 'ON' : 'MUTED'}</span>
            </button>

            <div className="text-[10px] text-purple-300/80 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>+30 to +80 PTS per completed puzzle</span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Selector Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {games.map(g => {
          const isSelected = selectedGame === g.id;
          const Icon = g.icon;

          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setSelectedGame(g.id)}
              className={`p-4 rounded-3xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                isSelected
                  ? 'bg-gradient-to-br from-white to-purple-50 dark:from-slate-900 dark:to-purple-950/60 border-purple-500 shadow-xl ring-2 ring-purple-500/50'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${g.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {g.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-tight">
                    {g.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">{g.subtitle}</p>
                </div>

                <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {g.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold">
                <span className={isSelected ? 'text-purple-600 dark:text-purple-400 text-[11px]' : 'text-slate-400 text-[11px]'}>
                  {isSelected ? '● Playing' : 'Play'}
                </span>
                <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1 text-purple-600 dark:text-purple-400' : 'text-slate-400 group-hover:translate-x-0.5'}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Game Player Area */}
      <div className="transition-all duration-300">
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
      </div>

      {/* Why Puzzles Matter in Tech & Careers Educational Footnote */}
      <div className="bg-gradient-to-r from-purple-50 via-slate-50 to-pink-50 dark:from-purple-950/30 dark:via-slate-900 dark:to-pink-950/30 rounded-3xl p-6 border border-purple-200 dark:border-purple-500/20 text-xs space-y-3">
        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold uppercase tracking-wider">
          <Brain className="w-4 h-4" />
          <span>Why Puzzle Solving in the Course Hub?</span>
        </div>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          Top employers and engineering recruiters prioritize <strong>algorithmic thinking, constraint satisfaction, and problem decomposition</strong>. Puzzles like <em>N-Queens</em> illustrate recursive backtracking algorithms, while <em>Dot Connect</em> simulates network graph routing. Practicing these mini-games sharpens mental agility for technical interviews, coding assessments, and strategic project management!
        </p>
      </div>

    </div>
  );
}
