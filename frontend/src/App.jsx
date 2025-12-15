import { useState } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import './App.css';

// Components
import AuthView from './components/LoginSignup';
import OnboardingView from './components/Onboarding';
import DashboardView from './components/Dashboard';
import LearnView from './components/LearnView';
import LessonView from './components/LessonView';
import SideNav from './components/SideNav';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';
import AITutor from './components/Tutor';
import Settings from './components/Settings';

const App = () => {
  // 1. Check token on initial load
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('token');
  });

  // Helper to determine if Sidebar should be hidden
  const location = useLocation();
  const hideSidebarRoutes = ['/', '/onboarding', '/lessons']; 
  const showSidebar = isLoggedIn && !hideSidebarRoutes.includes(location.pathname);

  // --- COMPONENT: Protected Route Wrapper ---
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <div className='flex h-screen bg-[#0B0F19]'>
      
      {/* Sidebar Rendering */}
      {showSidebar && <SideNav />} 

      <div className='flex-1 overflow-y-auto h-full relative'>
        <Routes>
          {/* --- PUBLIC ROUTE --- */}
          <Route 
            path='/' 
            element={<AuthView setIsLoggedIn={setIsLoggedIn} />} 
          />

          {/* --- PROTECTED ROUTES --- */}
          <Route 
            path='/onboarding' 
            element={<ProtectedRoute><OnboardingView /></ProtectedRoute>} 
          />
          
          <Route 
            path='/dashboard' 
            element={<ProtectedRoute><DashboardView /></ProtectedRoute>} 
          />

          {/* Both /learn and /curriculum point to LearnView */}
          <Route 
            path='/learn' 
            element={<ProtectedRoute><LearnView /></ProtectedRoute>} 
          />
          <Route 
            path='/curriculum' 
            element={<ProtectedRoute><LearnView /></ProtectedRoute>} 
          />
          
          {/* This route handles the actual exercise */}
          <Route 
            path='/lessons' 
            element={<ProtectedRoute><LessonView /></ProtectedRoute>} 
          />

          <Route 
            path='/profile' 
            element={<ProtectedRoute><Profile /></ProtectedRoute>} 
          />

          <Route 
            path='/leaderboard' 
            element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} 
          />

          <Route 
            path='/ai-tutor' 
            element={<ProtectedRoute><AITutor /></ProtectedRoute>} 
          />

          <Route 
            path='/settings' 
            element={<ProtectedRoute><Settings setIsLoggedIn={setIsLoggedIn} /></ProtectedRoute>} 
          />

        </Routes>
      </div>
    </div>
  );
}

export default App;