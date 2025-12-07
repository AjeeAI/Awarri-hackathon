import { useState } from "react";
import { 
    BookOpen, Star, Zap, Globe, ArrowLeft, MoreHorizontal,  UserPlus, Baby, Smile, Plane, GraduationCap,

} from 'lucide-react';
import OptionCard from "./OptionCard";

// const OnboardingView = ({ onFinish, token }) => {
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({ ageRange: '', isGuardian: false, gender: '', language: '', motivations: [], path: '', level: '' });
//   const totalSteps = formData.path === 'new' ? 4 : 5; 

//   const handleNext = async () => {
//     if (step === totalSteps || (step === 4 && formData.path === 'new')) {
//         await userService.saveOnboarding(formData, token);
//         onFinish(formData);
//     } else {
//       setStep(step + 1);
//     }
//   };

//   const handleBack = () => { if (step > 1) setStep(step - 1); };
//   const updateData = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));
//   const toggleMotivation = (mot) => {
//     const current = formData.motivations;
//     if (current.includes(mot)) updateData('motivations', current.filter(m => m !== mot));
//     else if (current.length < 3) updateData('motivations', [...current, mot]);
//   };

//   const renderStep = () => {
//     if(step === 1) 
//         return (
//             <div className="space-y-6">
//                 <h2 className="text-2xl font-bold text-center">
//                     Tell us about yourself
//                 </h2>
//                 <div className="grid grid-cols-2 gap-3">
//                     {['2-5', '6-10', '11-15', 'Above 16'].map(r => <OptionCard key={r} selected={formData.ageRange === r} onClick={() => updateData('ageRange', r)} label={r} />)}
//                 </div>
//                 {(formData.ageRange === '2-5' || formData.ageRange === '6-10') && (
//                     <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-4 rounded-xl flex items-center gap-3">
//                         <UserPlus className="text-orange-500" />
//                         <div className="flex-1">
//                             <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
//                                 Guardian Registration
//                             </p>
//                             <p className="text-xs text-slate-500">
//                                 I am a parent/guardian registering for a child.
//                             </p>
//                         </div>
//                         <input type="checkbox" className="w-6 h-6 rounded accent-green-600" checked={formData.isGuardian} onChange={(e) => updateData('isGuardian', e.target.checked)} />
//                     </div>
//                 )}
//                 <label className="block font-bold text-slate-700 dark:text-slate-300 mt-6">
//                     Gender
//                 </label>
//                 <div className="flex gap-3">
//                     {['Male', 'Female', 'Other'].map(g => (<OptionCard key={g} selected={formData.gender === g} onClick={() => updateData('gender', g)} label={g} className="flex-1" />))}
//                 </div>
//             </div>
//         );
//     if(step === 2) 
//         return (
//             <div className="space-y-6">
//                 <h2 className="text-2xl font-bold text-center">
//                     Which language?
//                 </h2>
//                 <div className="space-y-3">
//                     {[{id:'Yoruba', sub:'South-West'}, {id:'Igbo', sub:'South-East'}, {id:'Hausa', sub:'Northern'}, {id:'Pidgin', sub:'General'}].map(l => <OptionCard key={l.id} selected={formData.language === l.id} 
//                     onClick={() => updateData('language', l.id)} 
//                     label={l.id} 
//                     sub={l.sub} 
//                     layout="row" 
//                     icon={<Globe />} />)}
//                 </div>
//             </div>
//         );
//     if(step === 3) 
//         return (
//             <div className="space-y-6">
//                 <h2 className="text-2xl font-bold text-center">
//                     Why learn?
//                 </h2>
//                 <div className="grid grid-cols-2 gap-3">
//                     {['Culture', 'Family', 'Travel', 'School'].map(m => <OptionCard key={m} selected={formData.motivations.includes(m)} onClick={() => {const n = formData.motivations.includes(m) ? formData.motivations.filter(x=>x!==m) : [...formData.motivations, m]; updateData('motivations', n)}} label={m} />)}
//                 </div>
//             </div>
//         );
//     return (
//         <div className="space-y-6">
//             <h2 className="text-2xl font-bold text-center">
//                 Path?
//             </h2>
//             <div onClick={() => updateData('path', 'new')} className={`p-6 rounded-2xl border-2 cursor-pointer ${formData.path === 'new' ? 'border-green-500 bg-green-50' : 'border-slate-200'}`}>
//                 New to language
//             </div>
//             <div onClick={() => updateData('path', 'existing')} className={`p-6 rounded-2xl border-2 cursor-pointer ${formData.path === 'existing' ? 'border-green-500 bg-green-50' : 'border-slate-200'}`}>
//                 I know some words
//             </div>
//         </div>
//     );
//   };

//   return (
//     <div className="w-full min-h-screen h-full bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
//         <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
//             <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
//                 <div className="flex gap-1">
//                     {[1, 2, 3, 4].map(s => <div key={s} className={`h-2 rounded-full ${s <= step ? 'w-8 bg-green-500' : 'w-2 bg-slate-200'}`} />)}
//                     </div>
//                 </div>
//             <div className="flex-1 overflow-y-auto p-8">
//                 {renderStep()}
//             </div>
//             <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
//                 <button onClick={handleNext} className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg">
//                     Continue
//                 </button>
//             </div>
//         </div>
//     </div>
//   );
// };


const OnboardingView = ({ onFinish }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ ageRange: '', isGuardian: false, gender: '', language: '', motivations: [], path: '', level: '' });
  const totalSteps = formData.path === 'new' ? 4 : 5; 

  const handleNext = async () => {
    if (step === totalSteps || (step === 4 && formData.path === 'new')) {
        await apiCall('/user/onboarding', 'POST', formData);
        onFinish(formData);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => { if (step > 1) setStep(step - 1); };
  const updateData = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));
  const toggleMotivation = (mot) => {
    const current = formData.motivations;
    if (current.includes(mot)) updateData('motivations', current.filter(m => m !== mot));
    else if (current.length < 3) updateData('motivations', [...current, mot]);
  };

  const renderStep = () => {
    switch (step) {
      case 1: return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center">
                    Tell us about yourself
                </h2>
                <div className="space-y-4">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">
                        How old are you?
                    </label>
                    <div className="grid grid-cols-2 gap-3">{['2-5', '6-10', '11-15', 'Above 16'].map(range => (
                        <OptionCard key={range} selected={formData.ageRange === range} onClick={() => updateData('ageRange', range)} label={range} />))}
                    </div>
                    {(formData.ageRange === '2-5' || formData.ageRange === '6-10') && (<div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-4 rounded-xl flex items-center gap-3">
                        <UserPlus className="text-orange-500" />
                        <div className="flex-1">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                Guardian Registration
                            </p>
                            <p className="text-xs text-slate-500">
                                I am a parent/guardian registering for a child.
                            </p>
                            </div>
                                <input type="checkbox" className="w-6 h-6 rounded accent-green-600" checked={formData.isGuardian} onChange={(e) => updateData('isGuardian', e.target.checked)} />
                            </div>
                    )}
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mt-6">
                        Gender
                    </label>
                    <div className="flex gap-3">
                        {['Male', 'Female', 'Other'].map(g => (<OptionCard key={g} selected={formData.gender === g} onClick={() => updateData('gender', g)} label={g} className="flex-1" />))}
                    </div>
                </div>
            </div>
        );
      case 2: return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center">
                    Which language do you want to learn?
                </h2>
                <div className="space-y-3">
                    {
                        [
                            { id: 'Yoruba', sub: 'South-West' }, 
                            { id: 'Igbo', sub: 'South-East' }, 
                            { id: 'Hausa', sub: 'Northern' }, 
                            { id: 'Pidgin English', sub: 'General' }
                        ].map(lang => (<OptionCard key={lang.id} selected={formData.language === lang.id} onClick={() => updateData('language', lang.id)} label={lang.id} sub={lang.sub} icon={<Globe size={20} />} layout="row" />))
                    }
                </div>
            </div>
        );
      case 3: return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center">
                    Why do you want to learn?
                </h2>
                <p className="text-center text-sm text-slate-500 -mt-4">
                    Choose up to 3
                </p>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { id: 'Brain Training', icon: <Zap /> }, 
                        { id: 'Family & Friends', icon: <UserPlus /> }, 
                        { id: 'Culture', icon: <BookOpen /> }, 
                        { id: 'School', icon: <GraduationCap /> }, 
                        { id: 'Travel', icon: <Plane /> }, 
                        { id: 'Other', icon: <MoreHorizontal /> }].map(mot => (<div key={mot.id} onClick={() => toggleMotivation(mot.id)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 text-center ${formData.motivations.includes(mot.id) ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : formData.motivations.length >= 3 ? 'border-slate-100 dark:border-slate-800 opacity-50 cursor-not-allowed' : 'border-slate-200 dark:border-slate-800 hover:border-green-200'}`}>
                            <div className={formData.motivations.includes(mot.id) ? 'text-green-600' : 'text-slate-400'}>
                                {mot.icon}
                            </div><span className="font-bold text-sm">{mot.id}</span>
                        </div>))
                    }
                </div>
            </div>
        );
      case 4: return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">How much do you know?</h2>
            <div className="space-y-4">
              <div onClick={() => updateData('path', 'new')} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${formData.path === 'new' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600"><Baby size={24} /></div><div><h3 className="font-bold text-lg text-slate-800 dark:text-white">I'm new to {formData.language}</h3><p className="text-sm text-slate-500">Start from scratch.</p></div></div>
              <div onClick={() => updateData('path', 'existing')} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${formData.path === 'existing' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full text-purple-600"><Smile size={24} /></div><div><h3 className="font-bold text-lg text-slate-800 dark:text-white">I know some words</h3><p className="text-sm text-slate-500">Find my level.</p></div></div>
            </div>
          </div>
        );
      case 5: return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">How well can you speak?</h2>
            <div className="space-y-3">{['Beginner', 'Intermediate', 'Advanced'].map(lvl => (<OptionCard key={lvl} selected={formData.level === lvl} onClick={() => updateData('level', lvl)} label={lvl} layout="row" icon={<Star className={formData.level === lvl ? 'fill-current' : ''} />} />))}</div>
          </div>
        );
      default: return null;
    }
  };

    return (
        <div className="w-full min-h-screen h-full bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10">
                    {step > 1 ? <button onClick={handleBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400"><ArrowLeft size={20} /></button> : <div className="w-9" />}
                    <div className="flex gap-1">{[1, 2, 3, 4, 5].map(s => { if (s === 5 && formData.path === 'new') 
                        return null; 
                        return (
                            <div key={s} className={`h-2 rounded-full transition-all duration-300 ${s <= step ? 'w-8 bg-green-500' : 'w-2 bg-slate-200 dark:bg-slate-700'}`} />); })}</div>
                    <div className="w-9" />
                </div>
                <div className="flex-1 overflow-y-auto p-8">
                    {renderStep()}
                </div>
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <button onClick={handleNext} disabled={!formData.ageRange && step === 1} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95">
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingView;