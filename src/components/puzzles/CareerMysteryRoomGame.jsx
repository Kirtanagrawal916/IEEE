import React, { useState } from 'react';
import { 
  Key, 
  Lock, 
  Unlock, 
  Search, 
  FileText, 
  Briefcase, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Trophy, 
  RotateCcw, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  Brain,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { triggerCelebrationConfetti } from '../../utils/confettiHelper';
import { playPop, playSnap, playErrorTone, playChimeVictory } from '../../utils/puzzleAudio';

const ROOMS = [
  // Room 1: The Resume Red Flag Vault
  {
    id: 1,
    title: 'Room 1: The Applicant Resume Vault',
    subtitle: 'Identify 4 critical red flags on the resume to unlock the door',
    desc: 'Recruiters reject 75% of resumes in the first 7 seconds due to preventable mistakes. Click on 4 suspicious sections to flag them.',
    errors: [
      { id: 'err-1', text: 'Email: party_vibes_2024@funmail.com', feedback: '🚩 Unprofessional email address! Always use professional firstname.lastname@...' },
      { id: 'err-2', text: 'Experianced in Pythn & Javascrpt', feedback: '🚩 Spelling and typo errors in core technical keywords!' },
      { id: 'err-3', text: 'Helped the marketing team do lots of stuff', feedback: '🚩 Vague, unquantified statement! Needs metrics (e.g. "Grew Instagram by 40% in 3 months").' },
      { id: 'err-4', text: 'References: Call my friend Rahul anytime', feedback: '🚩 Informal references without verified professional recommendations.' },
    ],
    cleanSections: [
      { id: 'clean-1', text: 'Education: B.Tech Computer Science (2025)' },
      { id: 'clean-2', text: 'Portfolio: github.com/herearn/showcase' },
      { id: 'clean-3', text: 'Certifications: Certified Meta Social Media Associate' }
    ]
  },

  // Room 2: The Encrypted Client Brief
  {
    id: 2,
    title: 'Room 2: The Client Brief Decryption Chamber',
    subtitle: 'Decode the ambiguous client brief to extract verified deliverables',
    desc: 'Clients often send rushed, vague messages. Select the only professional proposal that protects you from unpaid scope creep.',
    choices: [
      {
        id: 'brief-opt-1',
        label: 'Accept verbal promise: "Just make it look nice and we will pay whatever we feel like after 2 months"',
        isCorrect: false,
        feedback: '🚩 High risk of non-payment and zero legal protection!'
      },
      {
        id: 'brief-opt-2',
        label: 'Define Scope: 3 Instagram Carousel Posts, 2 Revisions, 50% upfront escrow deposit via HerEarn',
        isCorrect: true,
        feedback: '🎯 Perfect! Clear deliverables, defined revision limits, and secure upfront escrow protection.'
      },
      {
        id: 'brief-opt-3',
        label: 'Agree to unlimited revisions and free bonus logo creation',
        isCorrect: false,
        feedback: '🚩 Severe scope creep! You will be doing 3x the work for zero compensation.'
      }
    ]
  },

  // Room 3: The Recruiter STAR Interview Chamber
  {
    id: 3,
    title: 'Room 3: The Recruiter STAR Interview Chamber',
    subtitle: 'Answer the behavioral interview question using the STAR framework',
    desc: 'Hiring Manager asks: "Tell me about a time you encountered a tight deadline and unexpected hurdle on a project."',
    choices: [
      {
        id: 'star-opt-1',
        label: 'STAR Response: "When a teammate dropped out 2 days before client launch (S/T), I reorganized our Figma asset pipeline (A), enabling us to deliver 100% of banners on time with a 15% increase in engagement (R)."',
        isCorrect: true,
        feedback: '🏆 Flawless STAR response (Situation, Task, Action, Result) with quantified business impact!'
      },
      {
        id: 'star-opt-2',
        label: '"I usually just panic and drink 5 cups of coffee and stay up all night doing everything myself."',
        isCorrect: false,
        feedback: '🚩 Shows poor project management, lack of delegation, and burnout risk.'
      },
      {
        id: 'star-opt-3',
        label: '"It was not my fault, the client was really difficult and kept changing their mind."',
        isCorrect: false,
        feedback: '🚩 Blaming the client in an interview is an immediate disqualifier!'
      }
    ]
  }
];

export default function CareerMysteryRoomGame({ onGameWin, soundEnabled = true, onToggleSound }) {
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [foundErrors, setFoundErrors] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [unlockedRooms, setUnlockedRooms] = useState([1]);
  const [roomFeedback, setRoomFeedback] = useState(null);
  const [hasWonAll, setHasWonAll] = useState(false);

  const room = ROOMS[currentRoomIndex];

  // Room 1: Handle clicking on resume item
  const handleToggleResumeItem = (item, isError) => {
    if (foundErrors.includes(item.id)) return;

    if (isError) {
      if (soundEnabled) playSnap();
      const updated = [...foundErrors, item.id];
      setFoundErrors(updated);
      setRoomFeedback({ type: 'success', msg: item.feedback });

      if (updated.length === room.errors.length) {
        if (soundEnabled) playChimeVictory();
        setUnlockedRooms(prev => [...new Set([...prev, 2])]);
      }
    } else {
      if (soundEnabled) playErrorTone();
      setRoomFeedback({ type: 'error', msg: 'That section is clean and well-structured! Look for formatting or professionalism red flags.' });
    }
  };

  // Rooms 2 & 3: Handle Multiple Choice
  const handleSelectChoice = (choice) => {
    setSelectedChoice(choice.id);

    if (choice.isCorrect) {
      if (soundEnabled) playChimeVictory();
      setRoomFeedback({ type: 'success', msg: choice.feedback });

      const nextRoomId = room.id + 1;
      if (nextRoomId <= ROOMS.length) {
        setUnlockedRooms(prev => [...new Set([...prev, nextRoomId])]);
      } else {
        // Completed all mystery rooms!
        setHasWonAll(true);
        triggerCelebrationConfetti();
        if (onGameWin) {
          onGameWin({
            game: 'career-mystery',
            title: 'Career Mystery Room: Unlocked!',
            points: 100,
            badge: '🕵️ Career Sleuth',
            timeTaken: 60,
            moves: 6
          });
        }
      }
    } else {
      if (soundEnabled) playErrorTone();
      setRoomFeedback({ type: 'error', msg: choice.feedback });
    }
  };

  const handleNextRoom = () => {
    if (currentRoomIndex + 1 < ROOMS.length) {
      setCurrentRoomIndex(prev => prev + 1);
      setSelectedChoice(null);
      setRoomFeedback(null);
    }
  };

  const handleRestart = () => {
    setCurrentRoomIndex(0);
    setFoundErrors([]);
    setSelectedChoice(null);
    setUnlockedRooms([1]);
    setRoomFeedback(null);
    setHasWonAll(false);
  };

  const isCurrentRoomCleared = room.id === 1 
    ? foundErrors.length === room.errors.length 
    : Boolean(selectedChoice && room.choices.find(c => c.id === selectedChoice)?.isCorrect);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl max-w-4xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 flex items-center gap-1">
              <Search className="w-3.5 h-3.5" />
              Career Readiness & Investigation
            </span>
            <span className="text-xs font-bold text-slate-500">
              Chamber {currentRoomIndex + 1} of {ROOMS.length}
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Career Mystery Room 🕵️‍♀️
          </h2>
        </div>

        {/* Room Progress Pills */}
        <div className="flex items-center gap-2">
          {ROOMS.map(r => {
            const isUnlocked = unlockedRooms.includes(r.id);
            const isCurrent = currentRoomIndex + 1 === r.id;

            return (
              <button
                key={r.id}
                type="button"
                disabled={!isUnlocked}
                onClick={() => {
                  setCurrentRoomIndex(r.id - 1);
                  setRoomFeedback(null);
                }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-400'
                    : isUnlocked
                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-50'
                }`}
              >
                {isUnlocked ? r.id : <Lock className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Atmospheric Clue Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/40 text-white space-y-2">
        <h3 className="font-extrabold text-base flex items-center gap-2 text-pink-300">
          <Key className="w-4 h-4 text-amber-400" />
          <span>{room.title}</span>
        </h3>
        <p className="text-xs text-purple-200 leading-relaxed font-medium">
          {room.desc}
        </p>
      </div>

      {/* Room 1: The Resume Inspection Board */}
      {room.id === 1 && (
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
            <span>Red Flags Discovered:</span>
            <span className="text-purple-600 dark:text-pink-400 font-extrabold text-sm">
              {foundErrors.length} / {room.errors.length}
            </span>
          </div>

          {/* Interactive Resume Sheet */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 shadow-xl space-y-3 font-sans">
            <div className="border-b border-slate-200 dark:border-slate-700 pb-3 flex items-center justify-between">
              <div>
                <h4 className="font-black text-lg text-slate-900 dark:text-white">Sample Candidate Resume</h4>
                <p className="text-xs text-slate-500 font-semibold">Junior Digital Marketer Applicant</p>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 bg-white dark:bg-slate-900 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                Tap suspected lines
              </span>
            </div>

            {/* Resume Lines */}
            <div className="space-y-2 pt-2 text-xs sm:text-sm">
              {/* Error Line 1 */}
              <button
                type="button"
                onClick={() => handleToggleResumeItem(room.errors[0], true)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer font-mono ${
                  foundErrors.includes('err-1')
                    ? 'bg-rose-100 dark:bg-rose-950/70 border-rose-400 text-rose-800 dark:text-rose-200 line-through'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-purple-400'
                }`}
              >
                {room.errors[0].text}
              </button>

              {/* Clean Line 1 */}
              <button
                type="button"
                onClick={() => handleToggleResumeItem(room.cleanSections[0], false)}
                className="w-full text-left p-3 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300 font-mono text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                {room.cleanSections[0].text}
              </button>

              {/* Error Line 2 */}
              <button
                type="button"
                onClick={() => handleToggleResumeItem(room.errors[1], true)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer font-mono ${
                  foundErrors.includes('err-2')
                    ? 'bg-rose-100 dark:bg-rose-950/70 border-rose-400 text-rose-800 dark:text-rose-200 line-through'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-purple-400'
                }`}
              >
                {room.errors[1].text}
              </button>

              {/* Clean Line 2 */}
              <button
                type="button"
                onClick={() => handleToggleResumeItem(room.cleanSections[1], false)}
                className="w-full text-left p-3 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300 font-mono text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                {room.cleanSections[1].text}
              </button>

              {/* Error Line 3 */}
              <button
                type="button"
                onClick={() => handleToggleResumeItem(room.errors[2], true)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer font-mono ${
                  foundErrors.includes('err-3')
                    ? 'bg-rose-100 dark:bg-rose-950/70 border-rose-400 text-rose-800 dark:text-rose-200 line-through'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-purple-400'
                }`}
              >
                {room.errors[2].text}
              </button>

              {/* Error Line 4 */}
              <button
                type="button"
                onClick={() => handleToggleResumeItem(room.errors[3], true)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer font-mono ${
                  foundErrors.includes('err-4')
                    ? 'bg-rose-100 dark:bg-rose-950/70 border-rose-400 text-rose-800 dark:text-rose-200 line-through'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-purple-400'
                }`}
              >
                {room.errors[3].text}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rooms 2 & 3: Strategic Multiple Choice Decision */}
      {room.id > 1 && (
        <div className="space-y-3 max-w-2xl mx-auto">
          {room.choices.map((choice) => {
            const isSelected = selectedChoice === choice.id;
            let cardStyle = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:border-purple-400';
            if (isSelected) {
              cardStyle = choice.isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-md ring-2 ring-emerald-400'
                : 'bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-900 dark:text-rose-200';
            }

            return (
              <button
                key={choice.id}
                type="button"
                onClick={() => handleSelectChoice(choice)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer leading-relaxed ${cardStyle}`}
              >
                {choice.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Feedback Alert Box */}
      {roomFeedback && (
        <div className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-1 max-w-2xl mx-auto animate-fade-in ${
          roomFeedback.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
        }`}>
          <div className="flex items-center gap-2 font-bold">
            {roomFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-rose-500" />}
            <span>{roomFeedback.type === 'success' ? 'Discovery Unlocked!' : 'Investigation Notice'}</span>
          </div>
          <p className="font-medium leading-relaxed">
            {roomFeedback.msg}
          </p>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-between max-w-2xl mx-auto pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={handleRestart}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart Mystery</span>
        </button>

        {isCurrentRoomCleared && currentRoomIndex + 1 < ROOMS.length && (
          <button
            type="button"
            onClick={handleNextRoom}
            className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg transition-all cursor-pointer flex items-center gap-1.5 animate-pulse"
          >
            <span>Unlock Next Chamber</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {hasWonAll && (
          <div className="inline-flex items-center gap-2 text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-4 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>All Career Mystery Rooms Cleared! (+100 PTS)</span>
          </div>
        )}
      </div>

    </div>
  );
}
