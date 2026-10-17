import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Briefcase, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  BrainCircuit, 
  AlertCircle, 
  RotateCcw, 
  Target, 
  ChevronRight,
  Sparkles,
  Wand2,
  Copy,
  Check,
  BookOpen,
  Play,
  Lock
} from 'lucide-react';
import { getQuizForCategory } from '../data/opportunityQuizzes';
import { triggerCelebrationConfetti } from '../utils/confettiHelper';
import { getMatchingTrackForOpportunity } from '../utils/trackLockHelper';

export default function OpportunityApplyPage({ 
  gig, 
  user, 
  userPortfolios = [], 
  onBack, 
  onConfirmApplySuccess 
}) {
  const navigate = useNavigate();
  const matchingTrack = getMatchingTrackForOpportunity(gig);

  const [step, setStep] = useState(1); // 1: Application Form, 2: Quiz Assessment, 3: Eligibility Results
  const [coverNote, setCoverNote] = useState('');
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(userPortfolios[0]?.id || 'capstone-default');
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  // AI Proposal Generator State
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [proposalTone, setProposalTone] = useState('professional');
  const [aiSuccessMsg, setAiSuccessMsg] = useState(false);

  // Quiz state
  const questions = getQuizForCategory(gig?.category);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { questionId: optionIndex }
  const [selectedOption, setSelectedOption] = useState(null);
  const [resultData, setResultData] = useState(null);

  if (!gig) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4 text-slate-900 dark:text-white">
        <h2 className="text-xl font-bold">No Opportunity Selected for Application</h2>
        <button onClick={onBack} className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs">
          Back to Opportunities Board
        </button>
      </div>
    );
  }

  // Handle Form Submission -> Move to Quiz Step
  const handleProceedToQuiz = (e) => {
    e.preventDefault();
    if (!coverNote.trim()) return;
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle selecting an option in current quiz question
  const handleSelectOption = (optionIdx) => {
    setSelectedOption(optionIdx);
    setUserAnswers(prev => ({
      ...prev,
      [questions[currentQIndex].id]: optionIdx
    }));
  };

  // AI Proposal Generator Action
  const handleGenerateAIProposal = (tone = 'professional') => {
    setIsGeneratingAI(true);
    setProposalTone(tone);

    const attachedProject = userPortfolios.find(p => p.id === selectedPortfolioId) || userPortfolios[0];
    const projectTitle = attachedProject?.title || `${gig?.category || 'Skill'} Capstone Project`;
    const skillsList = (gig?.skillsRequired || ['Hands-on Design', 'Deliverables']).slice(0, 3).join(', ');
    const candidateName = user?.name || 'Applicant';

    setTimeout(() => {
      let generated = '';
      if (tone === 'professional') {
        generated = `Dear Hiring Manager at ${gig?.company || 'Partner'},\n\nI am writing to express my strong interest in the ${gig?.title || 'Micro-Gig'} opportunity. Having completed hands-on learning in ${gig?.category || 'Practical Skills'} on HerEarn, I possess verified capabilities in ${skillsList}.\n\nAs tangible proof of my execution standards, I have attached my verified capstone project: '${projectTitle}'. I am prepared to begin immediately, meet all deadline deliverables, and communicate proactively.\n\nThank you for reviewing my profile.\n\nSincerely,\n${candidateName}`;
      } else if (tone === 'creative') {
        generated = `Hello ${gig?.company || 'Team'}! ✨\n\nI’m thrilled to apply for your ${gig?.title || 'Micro-Gig'} project! As an active creator specialized in ${gig?.category || 'Visual Design'}, I love transforming briefs into polished, high-converting deliverables.\n\nI've attached my verified project '${projectTitle}' so you can see my style and quality firsthand. I’d love to collaborate and guarantee prompt, top-tier turnaround on your milestones.\n\nWarm regards,\n${candidateName}`;
      } else {
        // concise
        generated = `Hi ${gig?.company || 'Team'},\n\nI am ready to deliver on your ${gig?.title || 'Micro-Gig'} requirements. I have verified coursework in ${gig?.category || 'Skills'} and practical experience in ${skillsList}.\n\nAttached is my verified project '${projectTitle}' as proof of quality. Ready to start right away!\n\nBest,\n${candidateName}`;
      }

      setCoverNote(generated);
      setIsGeneratingAI(false);
      setAiSuccessMsg(true);
      setTimeout(() => setAiSuccessMsg(false), 3500);
    }, 600);
  };

  // Handle Next Question or Finish Quiz
  const handleNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      setSelectedOption(userAnswers[questions[nextIdx].id] ?? null);
    } else {
      // Calculate Quiz Results
      evaluateQuizResults();
    }
  };

  // Calculate score and eligibility threshold
  const evaluateQuizResults = () => {
    let earnedPoints = 0;
    let maxPoints = 0;
    const difficultyBreakdown = {
      Easy: { correct: 0, total: 0 },
      Medium: { correct: 0, total: 0 },
      Hard: { correct: 0, total: 0 }
    };

    questions.forEach((q) => {
      const diff = q.difficulty || 'Easy';
      const points = q.points || 10;
      maxPoints += points;
      difficultyBreakdown[diff].total += 1;

      const userAns = userAnswers[q.id];
      if (userAns === q.correctAnswer) {
        earnedPoints += points;
        difficultyBreakdown[diff].correct += 1;
      }
    });

    const percentage = Math.round((earnedPoints / maxPoints) * 100);
    const PASSING_THRESHOLD = 60; // 60% score required for eligibility
    const isEligible = percentage >= PASSING_THRESHOLD;

    const summary = {
      earnedPoints,
      maxPoints,
      percentage,
      isEligible,
      passingThreshold: PASSING_THRESHOLD,
      difficultyBreakdown
    };

    setResultData(summary);
    setIsQuizSubmitted(true);
    setStep(3);

    // Always unlock the corresponding course track upon application
    triggerCelebrationConfetti();
    if (onConfirmApplySuccess) {
      onConfirmApplySuccess(gig.id, coverNote, selectedPortfolioId, summary);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle retaking quiz
  const handleRetryQuiz = () => {
    setUserAnswers({});
    setSelectedOption(null);
    setCurrentQIndex(0);
    setIsQuizSubmitted(false);
    setResultData(null);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentQuestion = questions[currentQIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in text-slate-900 dark:text-white">
      
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 text-xs font-extrabold text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-slate-800 transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Opportunity Details
        </button>

        {/* Step Indicator Badges */}
        <div className="flex items-center gap-2 text-xs font-extrabold">
          <span className={`px-3 py-1 rounded-full border ${step === 1 ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 border-transparent'}`}>
            1. Details
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className={`px-3 py-1 rounded-full border ${step === 2 ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 border-transparent'}`}>
            2. Skill Quiz
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className={`px-3 py-1 rounded-full border ${step === 3 ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 border-transparent'}`}>
            3. Eligibility
          </span>
        </div>
      </div>

      {/* Target Opportunity Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 border border-purple-500/30 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img 
            src={gig.logo} 
            alt={gig.company} 
            className="w-14 h-14 rounded-2xl object-cover border border-purple-300 shadow-md bg-white shrink-0"
          />
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-200 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Briefcase className="w-3 h-3 text-pink-400" />
              {gig.category} • {gig.type}
            </div>
            <h1 className="text-xl font-bold text-white">{gig.title}</h1>
            <p className="text-xs text-purple-200 font-semibold">{gig.company} • Stipend: <strong className="text-emerald-400 font-extrabold">{gig.stipend}</strong></p>
          </div>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-2xl border border-purple-400/20 text-center text-xs backdrop-blur-md">
          <span className="text-[10px] text-purple-300 font-bold uppercase block">Eligibility Requirement</span>
          <span className="text-emerald-400 font-extrabold text-xs">≥ 60% Quiz Pass Score</span>
        </div>
      </div>

      {/* STEP 1: APPLICATION FORM DETAILS */}
      {step === 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-purple-500/30 shadow-md space-y-6">
          <div className="space-y-1 pb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Step 1: Fill Application Proposal & Attach Work
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Submit your proposal note and select a verified portfolio project to attach to your application.
            </p>
          </div>

          <form onSubmit={handleProceedToQuiz} className="space-y-5 text-xs">
            
            {/* Attach Portfolio Project */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Select Proof-of-Work Portfolio Project to Attach
              </label>
              
              {userPortfolios && userPortfolios.length > 0 ? (
                <select
                  value={selectedPortfolioId}
                  onChange={(e) => setSelectedPortfolioId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 font-semibold text-xs"
                >
                  {userPortfolios.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.category || 'Verified Project'})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800/60 text-purple-900 dark:text-purple-300 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-extrabold block">Attached: Course Skill Track Capstone Badge</span>
                    <span className="text-[11px] text-purple-700 dark:text-purple-400">Default verified skill badge attached from profile.</span>
                  </div>
                  <span className="text-xs bg-purple-600 text-white font-bold px-3 py-1 rounded-xl shrink-0">Verified</span>
                </div>
              )}
            </div>

            {/* Proposal Message with AI Assist */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Proposal Note to Client Partner</span>
                  <span className="text-pink-500">*</span>
                </label>

                {/* AI Assistant Quick Generator */}
                <div className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-950/60 p-1 rounded-2xl border border-purple-200 dark:border-purple-800/60 shadow-xs">
                  <span className="text-[10px] font-extrabold text-purple-700 dark:text-purple-300 px-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-pink-500 animate-spin" />
                    AI Proposal:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleGenerateAIProposal('professional')}
                    disabled={isGeneratingAI}
                    title="Generate formal, client-ready proposal"
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                      proposalTone === 'professional' && aiSuccessMsg
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
                        : 'hover:bg-purple-200 dark:hover:bg-purple-900/50 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    Professional
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGenerateAIProposal('creative')}
                    disabled={isGeneratingAI}
                    title="Generate upbeat, creative pitch"
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                      proposalTone === 'creative' && aiSuccessMsg
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
                        : 'hover:bg-purple-200 dark:hover:bg-purple-900/50 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    Creative
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGenerateAIProposal('concise')}
                    disabled={isGeneratingAI}
                    title="Generate quick, punchy pitch"
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                      proposalTone === 'concise' && aiSuccessMsg
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
                        : 'hover:bg-purple-200 dark:hover:bg-purple-900/50 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    Concise
                  </button>
                </div>
              </div>

              {aiSuccessMsg && (
                <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 text-[11px] font-bold flex items-center justify-between animate-fade-in border border-purple-300 dark:border-purple-700">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                    Customized proposal generated based on your attached project & gig deliverables! You can edit it below.
                  </span>
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
              )}

              <textarea
                required
                rows={5}
                placeholder="Hi! I have mastered skill tracks in this area and built hands-on projects. I am excited to handle your deliverables with quality and deliver on time..."
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                className={`w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-4 rounded-2xl border ${
                  isGeneratingAI ? 'opacity-60 animate-pulse' : ''
                } border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 placeholder-slate-400 text-xs font-medium transition-all`}
              ></textarea>
            </div>

            {/* Escrow Guarantee Box */}
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
              <p className="flex items-center gap-1.5 font-extrabold">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Next Step: Topic Skill Quiz Assessment
              </p>
              <p className="text-emerald-700 dark:text-emerald-400 text-[11px]">
                Upon clicking proceed, you will take a short 6-question quiz across Easy, Medium, and Hard difficulty levels for <strong>{gig.category}</strong>. Scoring 60%+ unlocks immediate candidate eligibility status!
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl btn-gradient-award text-xs font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Skill Assessment Quiz</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: INTERACTIVE SKILL QUIZ (EASY, MEDIUM, HARD) */}
      {step === 2 && currentQuestion && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-purple-500/30 shadow-xl space-y-6">
          
          {/* Quiz Top Progress & Difficulty Indicator */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  Skill Assessment Quiz for {gig.category}
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Question {currentQIndex + 1} of {questions.length}
              </p>
            </div>

            {/* Difficulty Badge */}
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                currentQuestion.difficulty === 'Easy'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                  : currentQuestion.difficulty === 'Medium'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300'
                  : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-300'
              }`}>
                Difficulty: {currentQuestion.difficulty} ({currentQuestion.points} pts)
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-full transition-all duration-300"
              style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Box */}
          <div className="bg-purple-50/60 dark:bg-purple-950/40 p-5 rounded-2xl border border-purple-200 dark:border-purple-800/60 space-y-2">
            <span className="text-[11px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              {currentQuestion.difficulty} Level Challenge:
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((optText, optionIdx) => {
              const isSelected = selectedOption === optionIdx;
              return (
                <button
                  key={optionIdx}
                  type="button"
                  onClick={() => handleSelectOption(optionIdx)}
                  className={`w-full text-left p-4 rounded-2xl border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-pink-400 shadow-md ring-2 ring-purple-400/40'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-purple-400 hover:bg-purple-50/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-extrabold text-xs ${
                      isSelected
                        ? 'bg-white text-purple-900'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {String.fromCharCode(65 + optionIdx)}
                    </span>
                    <span>{optText}</span>
                  </div>

                  {isSelected && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              disabled={currentQIndex === 0}
              onClick={() => {
                const prevIdx = currentQIndex - 1;
                setCurrentQIndex(prevIdx);
                setSelectedOption(userAnswers[questions[prevIdx].id] ?? null);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous Question
            </button>

            <button
              type="button"
              disabled={selectedOption === null}
              onClick={handleNextQuestion}
              className="px-6 py-3 rounded-2xl btn-gradient-award text-xs font-extrabold shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
            >
              {currentQIndex < questions.length - 1 ? (
                <>
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>Submit Assessment & Check Score</span>
                </>
              )}
            </button>
          </div>

        </div>
      )}

      {/* STEP 3: ELIGIBILITY QUIZ RESULTS & SCORE EVALUATION */}
      {step === 3 && resultData && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-purple-500/30 shadow-xl space-y-6">
          
          {/* Result Banner */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 p-6 sm:p-8 rounded-3xl text-white space-y-4 shadow-xl border border-emerald-400/30 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-md">
              <Award className="w-10 h-10 text-amber-300 animate-bounce" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-200">
                Quiz Assessment Score: {resultData.percentage}% • Application Registered
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                🎉 Application Submitted & Course Lectures Unlocked!
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium max-w-lg mx-auto">
                Your application for <strong>{gig.title}</strong> has been saved. As part of this opportunity, your profile now has permanent unlocked access to all video lectures for <strong>{matchingTrack?.title || 'this track'}</strong>!
              </p>
            </div>
          </div>

          {/* Dedicated Course Track Unlocked Announcement Box */}
          {matchingTrack && (
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/40 text-white shadow-xl space-y-4 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shrink-0 shadow-lg">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Lectures Open In Profile
                      </span>
                      <span className="text-[11px] text-purple-300 font-semibold">{matchingTrack.duration}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-white mt-1">
                      {matchingTrack.title}
                    </h3>
                    <p className="text-xs text-purple-200/90 leading-relaxed">
                      All video lectures, modules, and capstone materials are now unlocked for you. All other courses remain locked until you apply for their corresponding opportunities.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/courses/${matchingTrack.id}`)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 hover:opacity-95 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 hover:scale-105"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Course Lectures</span>
                </button>
              </div>
            </div>
          )}

          {/* Difficulty Score Breakdown Cards (Easy, Medium, Hard) */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Score Breakdown by Difficulty Level:
            </h3>

            <div className="grid sm:grid-cols-3 gap-4">
              {['Easy', 'Medium', 'Hard'].map((diff) => {
                const b = resultData.difficultyBreakdown[diff];
                const pct = b.total > 0 ? Math.round((b.correct / b.total) * 100) : 0;
                return (
                  <div 
                    key={diff} 
                    className={`p-4 rounded-2xl border space-y-1 text-center ${
                      pct >= 50 
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800' 
                        : 'bg-rose-50/60 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
                    }`}
                  >
                    <span className="text-[10px] font-extrabold uppercase tracking-wider block text-slate-600 dark:text-slate-300">
                      {diff} Level
                    </span>
                    <span className="text-xl font-extrabold block text-slate-900 dark:text-white">
                      {b.correct} / {b.total} Correct
                    </span>
                    <span className={`text-xs font-bold ${pct >= 50 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {pct}% Accuracy
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-4">
            {matchingTrack && (
              <button
                type="button"
                onClick={() => navigate(`/courses/${matchingTrack.id}`)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white text-xs font-extrabold shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Open Course Lectures in Profile</span>
              </button>
            )}
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Back to Opportunities Board
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
