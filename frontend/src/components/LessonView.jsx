import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Heart, CheckCircle, Volume2, AlertTriangle, ArrowRight, Star, Loader2 } from 'lucide-react';

const LessonView = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [curriculum, setCurriculum] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState([]);
  const [status, setStatus] = useState('idle'); // 'idle' | 'correct' | 'wrong' | 'completed'
  const [lives, setLives] = useState(5);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // --- LOAD DATA ---
  useEffect(() => {
    // 1. Fetch Curriculum from LocalStorage
    const storedData = localStorage.getItem("userCurriculum");
    
    if (storedData) {
        try {
            const parsed = JSON.parse(storedData);
            setCurriculum(parsed);
        } catch (e) {
            console.error("Failed to parse curriculum", e);
            // Fallback mock data if parsing fails
            setCurriculum(getMockCurriculum());
        }
    } else {
        // Fallback if no data exists
        setCurriculum(getMockCurriculum());
    }
    setIsLoading(false);
  }, []);

  // --- HELPERS ---
  
  // Helper to extract a flat list of questions from the complicated curriculum structure
  // This simplifies navigation (Next/Prev) significantly
  const getQuestions = () => {
      if (!curriculum || !curriculum.weeks) return [];
      
      // Flatten all sessions into a single array of "quiz items"
      // For this demo, we'll create a synthetic question for each session topic
      let allQuestions = [];
      
      curriculum.weeks.forEach((week) => {
          week.sessions.forEach((session) => {
              // Create a "Translate this" question based on the topic
              // In a real app, your AI would generate specific Q&A pairs.
              // Here, we simulate it based on the session topic.
              allQuestions.push({
                  id: `${week.week}-${session.session}`,
                  type: 'translate',
                  prompt: "Translate this phrase",
                  context: `${week.theme} • ${session.topic}`,
                  // Mock data for the exercise
                  target: session.topic.includes("Greeting") ? "Bawo ni" : "Mo nlo si oja", 
                  correct_answer: session.topic.includes("Greeting") ? ["How", "are", "you"] : ["I", "am", "going", "to", "market"],
                  options: [
                      {id: 1, text: "How"}, {id: 2, text: "are"}, {id: 3, text: "you"}, 
                      {id: 4, text: "I"}, {id: 5, text: "am"}, {id: 6, text: "going"}, 
                      {id: 7, text: "to"}, {id: 8, text: "market"}, {id: 9, text: "is"}, 
                      {id: 10, text: "good"}
                  ].sort(() => Math.random() - 0.5) // Shuffle options
              });
          });
      });
      return allQuestions;
  };

  const questions = getQuestions();
  const currentQ = questions[currentQuestionIndex];

  // Update progress bar whenever index changes
  useEffect(() => {
      if (questions.length > 0) {
          setProgress(Math.round(((currentQuestionIndex) / questions.length) * 100));
      }
  }, [currentQuestionIndex, questions.length]);


  // --- HANDLERS ---

  const handleWordClick = (word) => {
    if (status !== 'idle') return;
    
    if (selectedWords.some(w => w.id === word.id)) {
      // Deselect
      setSelectedWords(selectedWords.filter(w => w.id !== word.id));
    } else {
      // Select
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleCheck = () => {
    if (!currentQ) return;

    const userAnswer = selectedWords.map(w => w.text).join(" ");
    const correctAnswer = currentQ.correct_answer.join(" ");

    if (userAnswer === correctAnswer) {
        setStatus('correct');
        setScore(prev => prev + 10); // +10 XP for correct answer
        // Play success sound here if desired
    } else {
        setStatus('wrong');
        setLives(prev => Math.max(0, prev - 1));
        // Play error sound here
    }
  };

  const handleContinue = () => {
      if (status === 'correct' || status === 'wrong') {
          // Move to next question
          if (currentQuestionIndex < questions.length - 1) {
              setCurrentQuestionIndex(prev => prev + 1);
              setSelectedWords([]); // Reset selection
              setStatus('idle');    // Reset status
          } else {
              // End of Lesson
              setStatus('completed');
              setProgress(100);
          }
      }
  };

  const handleExit = () => {
      navigate('/dashboard');
  };

  // --- RENDERERS ---

  if (isLoading) {
      return (
          <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
              <Loader2 className="animate-spin text-green-600" size={48} />
          </div>
      );
  }

  // GAME OVER STATE (0 Lives)
  if (lives === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-6 text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <Heart size={48} className="text-red-500 fill-current" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Out of Lives!</h2>
            <p className="text-slate-500 mb-8">Don't worry, practice makes perfect.</p>
            <button onClick={handleExit} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform">
                Return to Dashboard
            </button>
        </div>
      );
  }

  // COMPLETED STATE
  if (status === 'completed') {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-6 text-center relative overflow-hidden">
            {/* Confetti or decoration could go here */}
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <Star size={48} className="text-yellow-500 fill-current" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Lesson Complete!</h2>
            <p className="text-slate-500 mb-8">You're getting better every day.</p>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-1">Total XP</div>
                    <div className="text-2xl font-black text-green-600">+{score}</div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-1">Accuracy</div>
                    <div className="text-2xl font-black text-blue-600">{Math.round((score / (questions.length * 10)) * 100)}%</div>
                </div>
            </div>

            <button onClick={handleExit} className="w-full max-w-sm bg-green-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-green-700 transition-colors">
                Continue
            </button>
        </div>
      );
  }

  // EMPTY STATE (Safety Check)
  if (!currentQ) {
      return <div className="p-8 text-center">No questions found for this lesson. <button onClick={handleExit} className="underline">Go Back</button></div>;
  }

  // --- MAIN QUIZ UI ---
  return (
    <div className="flex flex-col min-h-screen h-full bg-slate-50 dark:bg-slate-950 relative transition-colors duration-300">
      
      {/* HEADER */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between z-10">
        <button onClick={handleExit} className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors font-medium text-sm">
          <X size={18} className="mr-2" /> Quit
        </button>
        
        {/* Progress Bar */}
        <div className="flex-1 max-w-md mx-8">
           <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
             <div className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
           </div>
        </div>

        {/* Hearts / Lives */}
        <div className="flex items-center text-red-500 font-bold text-sm bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full border border-red-100 dark:border-red-900/30">
          <Heart size={18} className="mr-2 fill-current animate-pulse" /> {lives}
        </div>
      </div>

      {/* QUESTION AREA */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto w-full max-w-3xl mx-auto">
        
        <div className="w-full">
          <h3 className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">{currentQ.context}</h3>
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-10 mb-8 transition-colors duration-300 relative overflow-hidden">
             {/* Decorative Background blob */}
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-50 dark:bg-green-900/10 rounded-full blur-2xl"></div>

             <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 relative z-10">
               <button className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 hover:scale-105 active:scale-95 flex items-center justify-center text-blue-500 border border-blue-100 dark:border-blue-900/30 transition-all shadow-sm">
                 <Volume2 size={28} />
               </button>
               <div>
                 <h2 className="text-xl md:text-2xl font-medium text-slate-500 dark:text-slate-400 mb-1">
                   {currentQ.prompt}:
                 </h2>
                 <p className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white leading-tight">
                   "{currentQ.target}"
                 </p>
               </div>
             </div>

             {/* Drop Zone */}
             <div className="min-h-24 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 border-dashed rounded-2xl p-4 flex flex-wrap gap-2 items-center transition-all">
                {selectedWords.length === 0 && (
                    <span className="text-slate-400 text-sm font-medium italic w-full text-center">Tap words below to translate...</span>
                )}
                {selectedWords.map((word, idx) => (
                  <button 
                    key={`${word.id}-${idx}`} 
                    onClick={() => handleWordClick(word)} 
                    className="animate-in fade-in zoom-in duration-200 px-4 py-2 bg-white dark:bg-slate-700 border-b-4 border-slate-200 dark:border-slate-900 rounded-xl font-bold text-slate-700 dark:text-white active:border-b-0 active:translate-y-1 transition-all text-sm md:text-base shadow-sm"
                  >
                    {word.text}
                  </button>
                ))}
             </div>
          </div>

          {/* Word Bank */}
          <div className="flex flex-wrap gap-3 justify-center">
            {currentQ.options.map((word) => {
              // Check if word is already selected (by ID) to disable it visually
              const isSelected = selectedWords.some(w => w.id === word.id);
              
              return (
                <div key={word.id} className={isSelected ? 'placeholder opacity-0 pointer-events-none' : ''}>
                     <button 
                        onClick={() => handleWordClick(word)} 
                        disabled={isSelected || status !== 'idle'} 
                        className="px-5 py-3 bg-white dark:bg-slate-900 border-b-4 border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 active:border-b-0 active:translate-y-1 transition-all text-sm md:text-base"
                    >
                        {word.text}
                    </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className={`border-t p-6 pb-8 transition-all duration-300 z-20 ${
          status === 'correct' ? 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-900/50' : 
          status === 'wrong' ? 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-900/50' : 
          'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      }`}>
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
           
           <div className="flex-1">
             {status === 'idle' && (
                <button onClick={() => handleCheck()} className="hidden md:block text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-sm uppercase tracking-wide transition-colors">
                    Skip this 
                </button>
             )}
             
             {status === 'correct' && (
                 <div className="flex items-center gap-4 animate-in slide-in-from-bottom-2 duration-300">
                     <div className="w-12 h-12 rounded-full bg-white dark:bg-green-950 flex items-center justify-center text-green-500 shadow-sm">
                         <CheckCircle size={32} fill="currentColor" className="text-white dark:text-green-500" />
                     </div>
                     <div>
                         <h4 className="font-black text-green-700 dark:text-green-400 text-lg">Nicely done!</h4>
                         <p className="text-green-600 dark:text-green-500/80 text-sm hidden md:block">Meaning: {currentQ.correct_answer.join(" ")}</p>
                     </div>
                 </div>
             )}

             {status === 'wrong' && (
                 <div className="flex items-center gap-4 animate-in slide-in-from-bottom-2 duration-300">
                     <div className="w-12 h-12 rounded-full bg-white dark:bg-red-950 flex items-center justify-center text-red-500 shadow-sm">
                         <AlertTriangle size={32} fill="currentColor" className="text-white dark:text-red-500" />
                     </div>
                     <div>
                         <h4 className="font-black text-red-700 dark:text-red-400 text-lg">Not quite...</h4>
                         <p className="text-red-600 dark:text-red-500/80 text-sm">Correct answer: <span className="font-bold">{currentQ.correct_answer.join(" ")}</span></p>
                     </div>
                 </div>
             )}
           </div>

           <button 
                onClick={status === 'idle' ? handleCheck : handleContinue} 
                disabled={status === 'idle' && selectedWords.length === 0} 
                className={`px-8 py-4 rounded-2xl font-bold shadow-lg transition-all transform active:scale-95 w-full md:w-auto min-w-[160px] flex items-center justify-center ${
                    status === 'correct' ? 'bg-green-600 text-white hover:bg-green-500 border-b-4 border-green-700 active:border-b-0' : 
                    status === 'wrong' ? 'bg-red-600 text-white hover:bg-red-500 border-b-4 border-red-700 active:border-b-0' : 
                    'bg-green-600 text-white hover:bg-green-500 border-b-4 border-green-700 active:border-b-0 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:border-transparent disabled:shadow-none'
                }`}
            >
                {status === 'idle' ? 'Check' : 'Continue'} 
                {status !== 'idle' && <ArrowRight size={20} className="ml-2" />}
           </button>
        </div>
      </div>
    </div>
  );
}; 

// Mock Data Helper (Safety Fallback)
const getMockCurriculum = () => ({
    overview: "Fallback Curriculum",
    weeks: [
        {
            week: 1, theme: "Introduction", sessions: [
                { session: 1, topic: "Greetings" },
                { session: 2, topic: "Self Introduction" },
                { session: 3, topic: "Numbers" }
            ]
        }
    ]
});

export default LessonView;