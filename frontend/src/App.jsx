import { 
  Mic, Send, Volume2, BookOpen, Heart, Flame, 
  LayoutDashboard, MessageCircle, Award, Settings, 
  User, CheckCircle, AlertTriangle, Menu, X, 
  Star, Lock, MapPin, Zap, ChevronRight, Trophy, Crown,
  Bell, LogOut, Globe, Edit3, ArrowLeft, Check, Play,
  Circle, CheckSquare, MoreHorizontal, Moon, Sun,
  Mail, Key, UserPlus, Baby, Smile, Briefcase, Plane, GraduationCap,
  Music, Target, BookA, Sparkles, Footprints, Headphones,
  Utensils, ShoppingBag, Save, Camera, Loader2, Languages
} from 'lucide-react';
import './App.css'
import AuthView from './components/LoginSignup';
import OnboardingView from './components/Onboarding';
import DashboardView from './components/Dashboard';
import LearnView from './components/LearnView';
import LessonView from './components/LessonView';
import { Route, Routes } from 'react-router-dom';

function App() {
  

  return (
    <div>
      <Routes>
        <Route path='/' element={<AuthView/>}/>
        <Route path='/onboarding' element={<OnboardingView/>}/>
      </Routes>

      {/* <AuthView/> */}
      {/* <OnboardingView/> */}
      {/* <DashboardView /> */}
      {/* <LearnView /> */}
      {/* <LessonView /> */}
    </div>
  )
}

export default App
