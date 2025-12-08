import { useState } from "react";
import {  
  User, ChevronRight, Mail, Key, Loader2, 
} from 'lucide-react';


const SignUp = ({ onAuthSuccess }) => {
//   const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
     const response = await fetch()
      const token = response.token;
      const user = response.user || { name: formData.name, id: response.userId };
      onAuthSuccess(isSignup, token, user);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen h-full flex items-center justify-center p-4 bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="w-full max-w-md z-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl text-white font-bold text-3xl shadow-lg shadow-green-600/20 mb-4">N</div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">N-ATLaS</h1>
                <p className="text-slate-500 dark:text-slate-400">Your gateway to Nigerian languages.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-white">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
                <div className="space-y-4">
                    {isSignup && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-slate-400" size={20} />
                                <input type="text" onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all dark:text-white" placeholder="John Doe" />
                            </div>
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                            <input type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all dark:text-white" placeholder="you@example.com" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-3 text-slate-400" size={20} />
                            <input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all dark:text-white" placeholder="••••••••" />
                        </div>
                    </div>
                    <button onClick={handleSubmit} disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                        {isLoading ? <Loader2 className="animate-spin" /> : <>{isSignup ? 'Sign Up' : 'Log In'} <ChevronRight size={20} /></>}
                    </button>
                </div>
                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500">
                        {isSignup ? 'Already have an account?' : "Don't have an account?"} 
                        <button onClick={() => setIsSignup(!isSignup)} className="ml-2 font-bold text-green-600 hover:underline">
                            {isSignup ? 'Log In' : 'Sign Up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SignUp;