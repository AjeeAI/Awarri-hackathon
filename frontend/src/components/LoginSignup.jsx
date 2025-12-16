import { useState, useEffect } from "react";
import { 
  User, ChevronRight, Mail, Key, Loader2, AlertCircle, Eye, EyeOff 
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
// FIX: Restored to your original path (assuming image is in same folder as component)
import logo from './logo.jpg'; 

// Best Practice: Use environment variables for API URLs in a real app
const API_URL = "http://127.0.0.1:8000";

const AuthView = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); 
  
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    name: '' 
  });

  // LOGIC FIX: If user opens the app and is already logged in, send them to dashboard.
  // This replaces the PublicRoute component to prevent race conditions during signup.
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);
    setError("");

    try {
      const endpoint = isSignup ? "/signup" : "/login";
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Authentication failed");
      }   

      // 1. Store Token
      localStorage.setItem("token", data.access_token || data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // 2. Update App State
      setIsLoggedIn(true);

      // 3. Navigate Correctly
      if (isSignup) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen h-full flex items-center justify-center p-4 bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="w-full max-w-md z-10">
            <div className="text-center mb-8 flex flex-col items-center">
                {/* Logo */}
                <img 
                  src={logo} 
                  alt="AwaSabi Logo" 
                  className="w-20 h-20 rounded-full shadow-lg shadow-green-600/20 mb-4 object-cover border-2 border-green-600"
                />
                
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">AwaSabi</h1>
                <p className="text-slate-500 dark:text-slate-400">Your gateway to Nigerian languages.</p>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-white">
                  {isSignup ? 'Create Account' : 'Welcome Back'}
                </h2>

                {/* Error Banner */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field (Signup Only) */}
                    {isSignup && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-slate-400" size={20} />
                                <input 
                                  type="text" 
                                  required
                                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all dark:text-white" 
                                  placeholder="John Doe" 
                                />
                            </div>
                        </div>
                    )}
                    
                    {/* Email Field */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                            <input 
                              type="email" 
                              required
                              onChange={(e) => setFormData({...formData, email: e.target.value})} 
                              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all dark:text-white" 
                              placeholder="you@example.com" 
                            />
                        </div>
                    </div>

                    {/* Password Field with Toggle */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-3 text-slate-400" size={20} />
                            <input 
                              type={showPassword ? "text" : "password"} 
                              required
                              onChange={(e) => setFormData({...formData, password: e.target.value})} 
                              className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all dark:text-white" 
                              placeholder="••••••••" 
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={isLoading} 
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <>{isSignup ? 'Sign Up' : 'Log In'} <ChevronRight size={20} /></>}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500">
                        {isSignup ? 'Already have an account?' : "Don't have an account?"} 
                        <button 
                          type="button"
                          onClick={() => {
                            setError("");
                            setIsSignup(!isSignup);
                          }} 
                          className="ml-2 font-bold text-green-600 hover:underline"
                        >
                            {isSignup ? 'Log In' : 'Sign Up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AuthView;