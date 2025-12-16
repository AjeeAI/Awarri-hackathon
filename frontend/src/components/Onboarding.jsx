import { useState } from "react";
import { 
    BookOpen, Star, Zap, Globe, ArrowLeft, MoreHorizontal,  
    UserPlus, Baby, Smile, Plane, GraduationCap
} from 'lucide-react';
import { useNavigate } from "react-router-dom"; 
import OptionCard from "./OptionCard";

// Base API URL for the user profile endpoint
const API_BASE_URL = "http://127.0.0.1:8000/api";

const OnboardingView = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({ 
    age_range: '', 
    is_guardian: false, 
    gender: '', 
    target_language: '', 
    motivations: [], 
    learning_path: '', 
    profeciency_level: '' 
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(""); 

  const totalSteps = formData.learning_path === 'new' ? 4 : 5; 

  const handleNext = async () => {
    if (step === totalSteps) {
        // --- FINAL SUBMISSION LOGIC ---
        try {
            setIsSubmitting(true);
            setLoadingMessage("Creating your profile..."); 

            const token = localStorage.getItem("token"); 

            if (!token) {
                alert("Authentication error: No token found. Please login again.");
                return;
            }

            // --- STEP 1: SAVE USER PROFILE ---
            const response = await fetch(`${API_BASE_URL}/user/onboarding`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                const isDuplicate = response.status === 400 && data.detail === 'Onboarding data already exists for this user.';
                if (!isDuplicate) {
                    if (response.status === 401) throw new Error("Unauthorized. Please login again.");
                    console.error("Backend Validation Error:", data);
                    throw new Error(data.detail || 'Onboarding failed.');
                }
            }

            // --- STEP 2: GENERATE CURRICULUM ---
            setLoadingMessage("AI is crafting your personalized curriculum...");
            
            // Construct Query Params
            const queryParams = new URLSearchParams({
                age: formData.age_range,
                proficiency: formData.profeciency_level,
                language: formData.target_language,
                // Add this if your backend uses it for context
                // reason: formData.motivations.join(", ") 
            }).toString();

            const curriculumResponse = await fetch(`https://8000-01kbncv6hstyfzvadn6zffk7f9.cloudspaces.litng.ai/api/curriculum?${queryParams}`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({}), 
            });

            if (!curriculumResponse.ok) {
                const err = await curriculumResponse.json();
                console.error("AI Generation Error:", err);
                throw new Error(err.detail?.[0]?.msg || err.detail || "Failed to generate curriculum.");
            }

            const responseData = await curriculumResponse.json();
            let finalCurriculum = null;

            // --- ROBUST PARSING LOGIC START ---
            
            // Case A: Backend returned clean JSON directly (Success)
            if (responseData.overview && responseData.weeks) {
                finalCurriculum = responseData;
            } 
            // Case B: Backend failed to parse but sent raw_text (Fallback)
            // This handles the error you saw: { error: "Failed to parse...", raw_text: "..." }
            else if (responseData.raw_text) {
                console.warn("Backend failed strict parsing. Attempting frontend fallback...");
                try {
                    // Manually parse the raw string
                    finalCurriculum = JSON.parse(responseData.raw_text);
                } catch (e) {
                    console.error("Manual parsing failed:", e);
                    throw new Error("AI generated invalid data structure. Please try again.");
                }
            }
            // Case C: Unexpected format
            else {
                console.error("Unexpected response structure:", responseData);
                throw new Error("Received unexpected data format from AI.");
            }
            // --- ROBUST PARSING LOGIC END ---

            // --- STEP 3: STORE & NAVIGATE ---
            localStorage.setItem("userCurriculum", JSON.stringify(finalCurriculum));
            navigate('/dashboard');

        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
            setLoadingMessage("");
        }
        
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
                <h2 className="text-2xl font-bold text-center">Tell us about yourself</h2>
                <div className="space-y-4">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">How old are you?</label>
                    <div className="grid grid-cols-2 gap-3">
                        {['2-5', '6-10', '11-15', 'Above 16'].map(range => (
                            <OptionCard key={range} selected={formData.age_range === range} onClick={() => updateData('age_range', range)} label={range} />
                        ))}
                    </div>
                    {(formData.age_range === '2-5' || formData.age_range === '6-10') && (
                        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-4 rounded-xl flex items-center gap-3">
                            <UserPlus className="text-orange-500" />
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Guardian Registration</p>
                                <p className="text-xs text-slate-500">I am a parent/guardian registering for a child.</p>
                            </div>
                            <input type="checkbox" className="w-6 h-6 rounded accent-green-600" checked={formData.is_guardian} onChange={(e) => updateData('is_guardian', e.target.checked)} />
                        </div>
                    )}
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mt-6">Gender</label>
                    <div className="flex gap-3">
                        {['Male', 'Female'].map(g => (
                            <OptionCard key={g} selected={formData.gender === g} onClick={() => updateData('gender', g)} label={g} className="flex-1" />
                        ))}
                    </div>
                </div>
            </div>
        );
      case 2: return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center">Which language do you want to learn?</h2>
                <div className="space-y-3">
                    {[
                        { id: 'Yoruba', sub: 'South-West' }, 
                        { id: 'Igbo', sub: 'South-East' }, 
                        { id: 'Hausa', sub: 'Northern' }, 
                        { id: 'Pidgin English', sub: 'General' }
                    ].map(lang => (
                        <OptionCard key={lang.id} selected={formData.target_language === lang.id} onClick={() => updateData('target_language', lang.id)} label={lang.id} sub={lang.sub} icon={<Globe size={20} />} layout="row" />
                    ))}
                </div>
            </div>
        );
      case 3: return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center">Why do you want to learn?</h2>
                <p className="text-center text-sm text-slate-500 -mt-4">Choose up to 3</p>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { id: 'Brain Training', icon: <Zap /> }, 
                        { id: 'Family & Friends', icon: <UserPlus /> }, 
                        { id: 'Culture', icon: <BookOpen /> }, 
                        { id: 'School', icon: <GraduationCap /> }, 
                        { id: 'Travel', icon: <Plane /> }, 
                        { id: 'Other', icon: <MoreHorizontal /> }
                    ].map(mot => (
                        <div key={mot.id} onClick={() => toggleMotivation(mot.id)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 text-center ${formData.motivations.includes(mot.id) ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : formData.motivations.length >= 3 ? 'border-slate-100 dark:border-slate-800 opacity-50 cursor-not-allowed' : 'border-slate-200 dark:border-slate-800 hover:border-green-200'}`}>
                            <div className={formData.motivations.includes(mot.id) ? 'text-green-600' : 'text-slate-400'}>{mot.icon}</div>
                            <span className="font-bold text-sm">{mot.id}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
      case 4: return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">How much do you know?</h2>
            <div className="space-y-4">
              <div onClick={() => updateData('learning_path', 'new')} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${formData.learning_path === 'new' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600"><Baby size={24} /></div>
                  <div><h3 className="font-bold text-lg text-slate-800 dark:text-white">I'm new to {formData.target_language}</h3><p className="text-sm text-slate-500">Start from scratch.</p></div>
              </div>
              <div onClick={() => updateData('learning_path', 'existing')} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${formData.learning_path === 'existing' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full text-purple-600"><Smile size={24} /></div>
                  <div><h3 className="font-bold text-lg text-slate-800 dark:text-white">I know some words</h3><p className="text-sm text-slate-500">Find my level.</p></div>
              </div>
            </div>
          </div>
        );
      case 5: return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">How well can you speak?</h2>
            <div className="space-y-3">
                {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                    <OptionCard key={lvl} selected={formData.profeciency_level === lvl} onClick={() => updateData('profeciency_level', lvl)} label={lvl} layout="row" icon={<Star className={formData.profeciency_level === lvl ? 'fill-current' : ''} />} />
                ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

    return (
        <div className="w-full min-h-screen h-full bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10">
                    {step > 1 ? <button onClick={handleBack} disabled={isSubmitting} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 disabled:opacity-50"><ArrowLeft size={20} /></button> : <div className="w-9" />}
                    
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => { 
                            if (s === 5 && formData.learning_path === 'new') return null; 
                            return (
                                <div key={s} className={`h-2 rounded-full transition-all duration-300 ${s <= step ? 'w-8 bg-green-500' : 'w-2 bg-slate-200 dark:bg-slate-700'}`} />
                            ); 
                        })}
                    </div>
                    <div className="w-9" />
                </div>
                
                <div className="flex-1 overflow-y-auto p-8">
                    {renderStep()}
                </div>
                
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <button 
                        onClick={handleNext} 
                        disabled={isSubmitting || (!formData.age_range && step === 1)} 
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (loadingMessage || 'Processing...') : (step === totalSteps ? 'Finish & Start' : 'Continue')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingView;