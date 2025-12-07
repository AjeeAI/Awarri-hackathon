// import { useState, useEffect } from "react";
// import { 
//     Heart, CheckCircle, X, 
// } from 'lucide-react';

// const LessonView = ({ onExit, token }) => {
//   const [progress, setProgress] = useState(25);
//   const [lessonData, setLessonData] = useState(null);
//   const [selectedWords, setSelectedWords] = useState([]);
//   const [status, setStatus] = useState('idle');

//   useEffect(() => {
//     // 🔌 API: LESSON GENERATION endpoint
//     contentService.generateLesson({ topic: 'intro' }, token).then(setLessonData);
//   }, []);

//   const handleWordClick = (word) => {
//     if (status !== 'idle') return;
//     if (selectedWords.includes(word)) setSelectedWords(selectedWords.filter(w => w !== word));
//     else setSelectedWords([...selectedWords, word]);
//   };

//   const handleCheck = () => {
//     setStatus('correct');
//     setProgress(50); 
//     // 🔌 API: PROGRESS UPDATE endpoint
//     userService.updateProgress({ xp: 10 }, token);
//   };

//   const words = lessonData?.questions[0]?.words || [];
//   const targetText = lessonData?.questions[0]?.target || "Loading...";

//   return (
//     <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 relative transition-colors duration-300">
//       <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
//         <button onClick={onExit} className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"><X size={18} className="mr-2" /> Quit</button>
//         <div className="flex-1 max-w-md mx-8"><div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-green-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div></div></div>
//         <div className="flex items-center text-red-500"><Heart size={16} className="mr-2" fill="currentColor" /> 5</div>
//       </div>
//       <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
//         <div className="w-full max-w-2xl">
//           <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 mb-8">
//              <div className="mb-6"><h3 className="text-xs font-bold text-green-600 uppercase tracking-widest mb-2">Translate this sentence</h3><h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white leading-tight">"{targetText}"</h2></div>
//              <div className="min-h-20 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 border-dashed rounded-xl p-4 flex flex-wrap gap-2 items-center">
//                 {selectedWords.map((word) => (<button key={word.id} onClick={() => handleWordClick(word)} className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm font-semibold text-slate-700 dark:text-white">{word.text}</button>))}
//              </div>
//           </div>
//           <div className="flex flex-wrap gap-3 justify-center">
//             {words.map((word) => (<button key={word.id} onClick={() => handleWordClick(word)} disabled={selectedWords.includes(word)} className={`px-5 py-3 rounded-lg font-semibold text-sm border ${selectedWords.includes(word) ? 'bg-slate-100 dark:bg-slate-800 text-transparent border-transparent' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 shadow-sm'}`}>{word.text}</button>))}
//           </div>
//         </div>
//       </div>
//       <div className={`border-t p-6 ${status === 'correct' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-white dark:bg-slate-900'}`}>
//         <div className="max-w-2xl mx-auto flex justify-between items-center">
//            {status === 'correct' && <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold"><CheckCircle /> Correct!</div>}
//            <button onClick={status === 'idle' ? handleCheck : onExit} className={`px-8 py-3 rounded-xl font-bold text-white ${status === 'idle' ? 'bg-green-600' : 'bg-green-700'}`}>{status === 'idle' ? 'Check Answer' : 'Continue'}</button>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default LessonView;


import React, { useState, useEffect } from 'react';
import { X, Heart, CheckCircle, Volume2 } from 'lucide-react';
// import { apiCall } from '../../utils/api';

const LessonView = ({ onExit }) => {
  const [selectedWords, setSelectedWords] = useState([]);
  const [status, setStatus] = useState('idle'); 
  const [progress, setProgress] = useState(25);

  const question = {
    prompt: "Translate this sentence",
    context: "Market Scenario • Buying Shoes",
    target: "Elo ni bata yi?",
    words: [
      { id: 1, text: "How much" }, { id: 2, text: "market" }, { id: 3, text: "shoe" },
      { id: 4, text: "is" }, { id: 5, text: "this" }, { id: 6, text: "expensive" },
      { id: 7, text: "hello" },
    ],
    answer: ["How much", "is", "this", "shoe"]
  };

  const handleWordClick = (word) => {
    if (status !== 'idle') return;
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleCheck = () => {
    const userAnswer = selectedWords.map(w => w.text).join(" ");
    const correctAnswer = question.answer.join(" ");
    if (userAnswer === correctAnswer) { setStatus('correct'); setProgress(50); } else { setStatus('wrong'); }
  };

  return (
    <div className="flex flex-col min-h-screen h-full bg-slate-50 dark:bg-slate-950 relative transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
        <button onClick={onExit} className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors font-medium text-sm">
          <X size={18} className="mr-2" /> Quit Lesson
        </button>
        <div className="flex-1 max-w-md mx-8">
           <div className="flex justify-between text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
             <span>Progress</span><span>{progress}%</span>
           </div>
           <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
             <div className="h-full bg-green-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
           </div>
        </div>
        <div className="flex items-center text-slate-600 dark:text-slate-300 font-medium text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
          <Heart size={16} className="text-red-500 mr-2" fill="currentColor" /> 5 Lives
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-2xl">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 mb-8 transition-colors duration-300">
             <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xs font-bold text-green-600 uppercase tracking-widest mb-2">{question.context}</h3>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white leading-tight">
                    Translate: <br/> <span className="text-slate-900 dark:text-slate-200">"{question.target}"</span>
                  </h2>
                </div>
                <button className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-green-600 border border-slate-200 dark:border-slate-700 transition-colors">
                  <Volume2 size={24} />
                </button>
             </div>
             <div className="min-h-20 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 border-dashed rounded-xl p-4 flex flex-wrap gap-2 items-center">
                {selectedWords.length === 0 && <span className="text-slate-400 text-sm font-medium italic">Select words below to build your sentence...</span>}
                {selectedWords.map((word) => (
                  <button key={word.id} onClick={() => handleWordClick(word)} className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm font-semibold text-slate-700 dark:text-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all text-sm">{word.text}</button>
                ))}
             </div>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {question.words.map((word) => {
              const isSelected = selectedWords.includes(word);
              return (
                <button key={word.id} onClick={() => handleWordClick(word)} disabled={isSelected} className={`px-5 py-3 rounded-lg font-semibold text-sm transition-all border ${isSelected ? 'bg-slate-100 dark:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-700 shadow-none' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5'}`}>{word.text}</button>
              )
            })}
          </div>
        </div>
      </div>

      <div className={`border-t p-6 transition-colors duration-300 ${status === 'correct' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/50' : status === 'wrong' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
           <div className="flex-1">
             {status === 'idle' && <button onClick={() => console.log('skip')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-sm uppercase tracking-wide">Skip Exercise</button>}
             {status === 'correct' && <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center text-green-600 dark:text-green-100"><CheckCircle size={24} /></div><div><h4 className="font-bold text-green-800 dark:text-green-300">Correct!</h4><p className="text-green-600 dark:text-green-400 text-sm">Literal translation: "How much is shoe this?"</p></div></div>}
             {status === 'wrong' && <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center text-red-600 dark:text-red-100"><AlertTriangle size={24} /></div><div><h4 className="font-bold text-red-800 dark:text-red-300">Incorrect</h4><p className="text-red-600 dark:text-red-400 text-sm">Answer: How much is this shoe</p></div></div>}
           </div>
           <button onClick={status === 'idle' ? handleCheck : status === 'correct' ? onExit : () => setStatus('idle')} disabled={status === 'idle' && selectedWords.length === 0} className={`px-8 py-3 rounded-lg font-bold shadow-sm transition-all ${status === 'correct' ? 'bg-green-600 text-white hover:bg-green-700' : status === 'wrong' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600'}`}>{status === 'idle' ? 'Check Answer' : 'Continue'}</button>
        </div>
      </div>
    </div>
  );
}; 
export default LessonView;

// const LessonView = ({ onExit }) => {
//   const [selectedWords, setSelectedWords] = useState([]);
//   const [status, setStatus] = useState('idle'); 
//   const [progress, setProgress] = useState(25);
//   const [lessonData, setLessonData] = useState(null);

//   useEffect(() => {
//     apiCall('/lesson/generate', 'POST', { topic: 'intro' }).then(setLessonData);
//   }, []);

//   const handleWordClick = (word) => {
//     if (status !== 'idle') return;
//     if (selectedWords.includes(word)) setSelectedWords(selectedWords.filter(w => w !== word));
//     else setSelectedWords([...selectedWords, word]);
//   };

//   const handleCheck = () => {
//     setStatus('correct'); 
//     setProgress(50); 
//     apiCall('/user/progress', 'POST', { xp: 10 });
//   };

//   const words = lessonData?.questions[0].words || [{id:1, text:'Loading...'}];

//   return (
//     <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 relative transition-colors duration-300">
//       <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
//         <button onClick={onExit}><X size={18} className="mr-2" /></button>
//         <div className="flex-1 max-w-md mx-8"><div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-green-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div></div></div>
//         <Heart size={16} className="text-red-500 mr-2" fill="currentColor" /> 5
//       </div>
//       <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
//         <div className="w-full max-w-2xl">
//           <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8">Translate: "How much?"</h2>
//           <div className="min-h-[80px] bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-wrap gap-2 items-center mb-8">
//              {selectedWords.map((word) => (<button key={word.id} onClick={() => handleWordClick(word)} className="px-4 py-2 bg-white border rounded-lg shadow-sm font-bold text-slate-700">{word.text}</button>))}
//           </div>
//           <div className="flex flex-wrap gap-3 justify-center">
//             {words.map((word) => (<button key={word.id} onClick={() => handleWordClick(word)} disabled={selectedWords.includes(word)} className={`px-5 py-3 rounded-lg font-bold border ${selectedWords.includes(word) ? 'bg-slate-100 text-transparent' : 'bg-white shadow-sm'}`}>{word.text}</button>))}
//           </div>
//         </div>
//       </div>
//       <div className={`border-t p-6 ${status === 'correct' ? 'bg-green-100' : 'bg-white'}`}>
//         <div className="max-w-2xl mx-auto flex justify-between items-center">
//            {status === 'correct' && <div className="flex items-center gap-2 text-green-700 font-bold"><CheckCircle /> Correct!</div>}
//            <button onClick={status === 'idle' ? handleCheck : onExit} className={`px-8 py-3 rounded-xl font-bold text-white ${status === 'idle' ? 'bg-green-600' : 'bg-green-700'}`}>{status === 'idle' ? 'Check' : 'Continue'}</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LessonView;