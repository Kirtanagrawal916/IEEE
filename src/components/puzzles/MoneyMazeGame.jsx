import React, { useState } from 'react';
import { 
  IndianRupee, 
  PiggyBank, 
  Heart, 
  ShieldCheck, 
  RotateCcw, 
  Trophy, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp, 
  ArrowRight,
  ShoppingBag,
  Zap,
  Coffee,
  Briefcase
} from 'lucide-react';
import { triggerCelebrationConfetti } from '../../utils/confettiHelper';
import { playPop, playSnap, playErrorTone, playChimeVictory } from '../../utils/puzzleAudio';

const SCENARIOS = [
  // Week 1: Fixed Essentials & Setup
  {
    week: 1,
    title: 'Week 1: Housing & Groceries Setup',
    description: 'You just received your ₹20,000 monthly stipend/income. How do you plan your essential living expenses?',
    options: [
      {
        id: 'opt-1a',
        label: 'Sensible Shared Living & Bulk Grocery Cooking',
        cost: 9000,
        savingsAdd: 3000,
        energyChange: +10,
        explanation: 'Excellent 50-30-20 allocation! Budgeted rent + home cooked meals keeps costs under 50% and starts your savings early.',
        isOptimal: true
      },
      {
        id: 'opt-1b',
        label: 'Solo Luxury Studio & Daily Food Delivery Apps',
        cost: 16000,
        savingsAdd: 0,
        energyChange: +15,
        explanation: 'Over 80% spent in Week 1! Leaves you vulnerable to emergencies.',
        isOptimal: false
      },
      {
        id: 'opt-1c',
        label: 'Extreme Frugality (Skipping nutritious meals & living in unsafe space)',
        cost: 4000,
        savingsAdd: 6000,
        energyChange: -35,
        explanation: 'Extreme cutbacks harmed your health and focus. Medical bills will follow!',
        isOptimal: false
      }
    ]
  },

  // Week 2: Professional Investment vs Splurging
  {
    week: 2,
    title: 'Week 2: Upskilling Tools vs Tempting Gadgets',
    description: 'You have a chance to take on a ₹6,000 freelance gig, but you need verified skills or portfolio software.',
    options: [
      {
        id: 'opt-2a',
        label: 'Invest ₹1,500 in Certified Canva/Figma course & software tools',
        cost: 1500,
        incomeAdd: 6000,
        savingsAdd: 2000,
        energyChange: +15,
        explanation: 'High ROI move! The ₹1,500 skill investment landed a ₹6,000 client gig, netting +₹4,500 profit!',
        isOptimal: true
      },
      {
        id: 'opt-2b',
        label: 'Buy latest smartphone on high-interest EMI (₹4,500 monthly)',
        cost: 4500,
        savingsAdd: 0,
        energyChange: +5,
        explanation: 'Impulse consumer debt! High interest drains your future cash flow.',
        isOptimal: false
      },
      {
        id: 'opt-2c',
        label: 'Do nothing and rely on outdated equipment',
        cost: 0,
        savingsAdd: 0,
        energyChange: -10,
        explanation: 'Missed out on client gig revenue due to lack of verified design tools.',
        isOptimal: false
      }
    ]
  },

  // Week 3: The Unexpected Emergency
  {
    week: 3,
    title: 'Week 3: Emergency Health & Equipment Glitch',
    description: 'Your laptop charger blew out and you caught seasonal flu needing medicines (Total: ₹2,500). How do you handle it?',
    options: [
      {
        id: 'opt-3a',
        label: 'Cover from Emergency Vault buffer & visit clinic promptly',
        cost: 2500,
        savingsAdd: 0,
        energyChange: +10,
        explanation: 'This is why emergency funds exist! Handled smoothly with zero high-interest debt.',
        isOptimal: true
      },
      {
        id: 'opt-3b',
        label: 'Take a quick high-interest payday loan (36% APR)',
        cost: 3500,
        savingsAdd: 0,
        energyChange: -20,
        explanation: 'Predatory interest traps you in compounding debt cycles!',
        isOptimal: false
      },
      {
        id: 'opt-3c',
        label: 'Delay doctor visit and try working with broken screen',
        cost: 500,
        savingsAdd: 0,
        energyChange: -40,
        explanation: 'Health deteriorated severely, resulting in missed project deadlines.',
        isOptimal: false
      }
    ]
  },

  // Week 4: The Final Milestone & Goal Target
  {
    week: 4,
    title: 'Week 4: Final Month-End Balance & Savings Deposit',
    description: 'You completed your projects! You have remaining funds before the month closes. What is your strategy?',
    options: [
      {
        id: 'opt-4a',
        label: 'Deposit remaining surplus into 7% High-Yield Savings Account',
        cost: 0,
        savingsAdd: 2500,
        energyChange: +20,
        explanation: 'Goal achieved! You built a solid safety net and earned compound interest.',
        isOptimal: true
      },
      {
        id: 'opt-4b',
        label: 'Celebrate with friends at a high-end club (Spend ₹5,000)',
        cost: 5000,
        savingsAdd: -1000,
        energyChange: +10,
        explanation: 'Wiped out the hard-earned monthly savings right at the finish line!',
        isOptimal: false
      },
      {
        id: 'opt-4c',
        label: 'Invest in speculative meme coin promised on social media',
        cost: 4000,
        savingsAdd: -2000,
        energyChange: -25,
        explanation: 'High-risk gamble lost 70% of its value within 2 days.',
        isOptimal: false
      }
    ]
  }
];

export default function MoneyMazeGame({ onGameWin, soundEnabled = true, onToggleSound }) {
  const TARGET_SAVINGS = 5000;
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [wallet, setWallet] = useState(20000);
  const [savingsVault, setSavingsVault] = useState(0);
  const [energy, setEnergy] = useState(80);
  const [creditScore, setCreditScore] = useState(720);
  const [history, setHistory] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const currentScenario = SCENARIOS[currentWeekIndex];

  const handleSelectOption = (option) => {
    if (isGameOver) return;

    if (soundEnabled) playPop();

    const newWallet = wallet - option.cost + (option.incomeAdd || 0);
    const newSavings = savingsVault + option.savingsAdd;
    const newEnergy = Math.max(10, Math.min(100, energy + option.energyChange));
    const newCredit = option.isOptimal ? Math.min(850, creditScore + 25) : Math.max(500, creditScore - 30);

    setWallet(newWallet);
    setSavingsVault(newSavings);
    setEnergy(newEnergy);
    setCreditScore(newCredit);

    const logEntry = {
      week: currentScenario.week,
      choice: option.label,
      cost: option.cost,
      savingsAdd: option.savingsAdd,
      explanation: option.explanation,
      isOptimal: option.isOptimal
    };

    setHistory(prev => [...prev, logEntry]);

    if (currentWeekIndex + 1 < SCENARIOS.length) {
      setCurrentWeekIndex(prev => prev + 1);
    } else {
      // Game ended
      setIsGameOver(true);
      const won = newSavings >= TARGET_SAVINGS && newEnergy >= 40 && newWallet >= 0;
      setHasWon(won);

      if (won) {
        if (soundEnabled) playChimeVictory();
        triggerCelebrationConfetti();
        if (onGameWin) {
          onGameWin({
            game: 'money-maze',
            title: 'Money Maze: Financial Freedom',
            points: 75,
            badge: '🪙 Financial Literacy Ace',
            timeTaken: 45,
            moves: 4
          });
        }
      } else {
        if (soundEnabled) playErrorTone();
      }
    }
  };

  const handleRestart = () => {
    setCurrentWeekIndex(0);
    setWallet(20000);
    setSavingsVault(0);
    setEnergy(80);
    setCreditScore(720);
    setHistory([]);
    setIsGameOver(false);
    setHasWon(false);
  };

  const savingsProgress = Math.min(100, Math.round((savingsVault / TARGET_SAVINGS) * 100));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl max-w-4xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-1">
              <PiggyBank className="w-3.5 h-3.5" />
              Budgeting & Financial Strategy
            </span>
            <span className="text-xs font-bold text-slate-500">
              Week {Math.min(4, currentWeekIndex + 1)} of 4
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Money Maze: Target ₹5,000 Savings 🪙
          </h2>
        </div>

        <button
          type="button"
          onClick={handleRestart}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Simulation</span>
        </button>
      </div>

      {/* Live Financial Dashboard HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Wallet Balance</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center">
            <IndianRupee className="w-5 h-5 text-emerald-500" />
            <span>{wallet.toLocaleString()}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 space-y-1">
          <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider block">Savings Vault</span>
          <div className="text-xl sm:text-2xl font-black text-purple-600 dark:text-pink-400 flex items-center">
            <IndianRupee className="w-5 h-5 text-pink-500" />
            <span>{savingsVault.toLocaleString()}</span>
          </div>
          <span className="text-[10px] text-purple-600 font-bold block">Target: ₹5,000 ({savingsProgress}%)</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Energy & Health</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-1.5">
            <Heart className={`w-5 h-5 ${energy > 50 ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
            <span>{energy}%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Credit Score</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-indigo-500" />
            <span>{creditScore}</span>
          </div>
        </div>
      </div>

      {/* Progress towards Savings Goal */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
          <span>Savings Goal Progress</span>
          <span>₹{savingsVault} / ₹{TARGET_SAVINGS}</span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${savingsProgress}%` }}
          />
        </div>
      </div>

      {/* Active Question / Decision Stage */}
      {!isGameOver && currentScenario && (
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 animate-fade-in">
          
          <div className="space-y-1.5">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>{currentScenario.title}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {currentScenario.description}
            </p>
          </div>

          <div className="space-y-3">
            {currentScenario.options.map((opt, idx) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(opt)}
                className="w-full text-left p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors block">
                    {opt.label}
                  </span>
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span>Expense: ₹{opt.cost}</span>
                    {opt.savingsAdd > 0 && <span className="text-purple-600 dark:text-pink-400">+₹{opt.savingsAdd} to Savings</span>}
                    {opt.incomeAdd && <span className="text-emerald-600 font-bold">+₹{opt.incomeAdd} Gig Earnings</span>}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-400 group-hover:text-purple-600 group-hover:bg-purple-50 transition-all flex-shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>

        </div>
      )}

      {/* Game Over View */}
      {isGameOver && (
        <div className={`p-6 sm:p-8 rounded-3xl border text-center space-y-4 animate-fade-in ${
          hasWon 
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'
        }`}>
          <div className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl animate-bounce" style={{ background: hasWon ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #EF4444, #B91C1C)' }}>
            {hasWon ? <Trophy className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
          </div>

          <h3 className="text-2xl font-black">
            {hasWon ? 'Financial Freedom Achieved! 🎉' : 'Budget Depleted! ⚠️'}
          </h3>

          <p className="text-sm max-w-md mx-auto leading-relaxed font-medium">
            {hasWon
              ? `Outstanding budgeting! You saved ₹${savingsVault.toLocaleString()} (Target: ₹5,000), kept your wellbeing at ${energy}%, and avoided predatory debt traps!`
              : `You were unable to reach the ₹5,000 savings goal with balanced health. Review your decision log below to master the 50-30-20 budgeting principle.`}
          </p>

          <button
            type="button"
            onClick={handleRestart}
            className="px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      )}

      {/* Decision History Journal */}
      {history.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Monthly Decision Journal & Analysis
          </h4>

          <div className="space-y-2">
            {history.map((item, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs flex items-start gap-3"
              >
                <div className={`p-1 rounded-full ${item.isOptimal ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'} flex-shrink-0 mt-0.5`}>
                  {item.isOptimal ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                </div>

                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Week {item.week}: {item.choice}
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
