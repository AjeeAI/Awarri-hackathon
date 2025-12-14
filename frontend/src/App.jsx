import { 
  Mic, Send, Volume2, BookOpen, Heart, Flame, 
  LayoutDashboard, MessageCircle, Award, 
  User, CheckCircle, AlertTriangle, Menu, X, 
  Star, Lock, MapPin, Zap, ChevronRight, Trophy, Crown,
  Bell, LogOut, Globe, Edit3, ArrowLeft, Check, Play,
  Circle, CheckSquare, MoreHorizontal, Moon, Sun,
  Mail, Key, UserPlus, Baby, Smile, Briefcase, Plane, GraduationCap,
  Music, Target, BookA, Sparkles, Footprints, Headphones,
  Utensils, ShoppingBag, Save, Camera, Loader2, Languages,
<<<<<<< HEAD
  Route as RouteIcon
=======
 
>>>>>>> d2a18a6d17122d00edfe0ba8848a96ad96fc04ad
} from 'lucide-react';
import './App.css'
import AuthView from './components/LoginSignup';
import OnboardingView from './components/Onboarding';
import DashboardView from './components/Dashboard';
import LearnView from './components/LearnView';
import LessonView from './components/LessonView';
<<<<<<< HEAD
import {Route, Routes } from 'react-router-dom';
=======
import { Route, Routes } from 'react-router-dom';
import SideNav from './components/SideNav';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';
import AITutor from './components/Tutor';
import Settings from './components/Settings';
import { useState } from 'react';
>>>>>>> d2a18a6d17122d00edfe0ba8848a96ad96fc04ad

const App = () => {
  // FIX 1: Check localStorage on load so refresh doesn't log you out
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('token') || false; 
  });

  return (
<<<<<<< HEAD
    <div>
      <Routes>
        <Route path='/' element={<AuthView/>}/>
        <Route path='/onboarding' element={<OnboardingView/>}/>
        <Route path='/dashboard' element={<DashboardView/>}/>
        <Route path='/learn' element={<LearnView/>}/>
        <Route path='/lessons' element={<LessonView/>}/>
      </Routes>
     
    </div>
  )
=======
    <div className='flex h-screen bg-[#0B0F19]'> {/* Ensure full height and dark bg */}
      
      {/* Sidebar only shows when logged in */}
      {isLoggedIn && <SideNav />} 

      {/* Main Content Area - Needs flex-1 to fill remaining space */}
      <div className='flex-1 overflow-y-auto h-full relative'>
        <Routes>
          {/* FIX 2: Pass setIsLoggedIn as a prop to AuthView */}
          <Route path='/' element={<AuthView setIsLoggedIn={setIsLoggedIn} />} />
          
          <Route path='/onboarding' element={<OnboardingView />} />
          <Route path='/dashboard' element={<DashboardView />} />
          <Route path='/learn' element={<LearnView />} />
          <Route path='/lessons' element={<LessonView />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/leaderboard' element={<Leaderboard />} />
          <Route path='/curriculum' element={<LearnView/>}/>
          <Route path='/ai-tutor' element={<AITutor />} />
          <Route path='/settings' element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
>>>>>>> d2a18a6d17122d00edfe0ba8848a96ad96fc04ad
}

export default App;