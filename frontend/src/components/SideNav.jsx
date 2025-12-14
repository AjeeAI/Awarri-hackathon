// import React, { useEffect, useState } from 'react';
// import { 
//   LayoutGrid, 
//   BookOpen, 
//   MessageSquare, 
//   Trophy, 
//   User, 
//   Settings 
// } from 'lucide-react';
// import { NavLink } from 'react-router-dom';

// const SideNav = () => {
//   // 1. State for dynamic user data
//   const [user, setUser] = useState({ name: 'Guest User', email: '' });

//   // 2. Load user from localStorage on mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
    
//     // Check if storedUser exists AND is not the string "undefined"
//     if (storedUser && storedUser !== "undefined") {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (e) {
//         console.error("Failed to parse user data", e);
//         // Optional: clear the bad data automatically if parsing fails
//         localStorage.removeItem('user');
//       }
//     }
//   }, []);

//   // 3. Helper to get initials (e.g., "John Doe" -> "JD")
//   const getInitials = (name) => {
//     return name
//       .split(' ')
//       .map(word => word[0])
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   const navItems = [
//     { name: 'Dashboard', icon: LayoutGrid, path: '/dashboard' },
//     { name: 'Curriculum', icon: BookOpen, path: '/curriculum' },
//     { name: 'Translator', icon: MessageSquare, path: '/ai-tutor' },
//     { name: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
//     { name: 'Profile', icon: User, path: '/profile' }, 
//   ];

//   return (
//     <div className="h-screen w-64 bg-[#0B0F19] text-slate-400 flex flex-col p-6 border-r border-slate-800/50 flex-shrink-0">
//       {/* --- Logo Section --- */}
//       <div className="flex items-center gap-3 mb-12">
//         <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-green-900/20">
//           N
//         </div>
//         <span className="text-xl font-bold text-white tracking-wide">N-ATLaS</span>
//       </div>

//       {/* --- Navigation Items --- */}
//       <nav className="flex-1 space-y-3">
//         {navItems.map((item) => (
//           <NavLink
//             key={item.name}
//             to={item.path}
//             end={item.path === '/dashboard'} 
//             className={({ isActive }) => `
//               w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group font-medium text-[15px]
//               ${isActive 
//                 ? 'border border-green-500 text-green-500 bg-green-500/5 shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
//                 : 'border border-transparent hover:text-white hover:bg-white/5'
//               }
//             `}
//           >
//             <item.icon size={22} className="transition-colors" />
//             <span>{item.name}</span>
//           </NavLink>
//         ))}
//       </nav>

//       {/* --- User Profile Footer (Now Fully Clickable & Dynamic) --- */}
//       <div className="mt-auto pt-6 border-t border-slate-800/60">
//         <NavLink 
//             to="/settings"
//             className={({ isActive }) => `
//                 flex items-center gap-3 group cursor-pointer p-2 rounded-xl transition-all duration-200
//                 ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}
//             `}
//         >
//           {/* Dynamic Initials */}
//           <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700 group-hover:border-slate-500 transition-colors">
//             {getInitials(user.name)}
//           </div>
          
//           <div className="flex-1 overflow-hidden">
//             {/* Dynamic Name */}
//             <p className="text-sm font-bold text-white truncate group-hover:text-green-500 transition-colors">
//                 {user.name}
//             </p>
//             <p className="text-[11px] text-slate-500 font-medium">View Settings</p>
//           </div>
          
//           <Settings size={18} className="text-slate-600 group-hover:text-white transition-colors" />
//         </NavLink>
//       </div>
//     </div>
//   );
// };

// export default SideNav;



import React, { useEffect, useState } from 'react';
import { 
  LayoutGrid, 
  BookOpen, 
  MessageSquare, 
  Trophy, 
  User, 
  Settings,
  Menu, // Imported Menu icon for Hamburger
  X     // Imported X icon for closing
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const SideNav = () => {
  // 1. State for dynamic user data
  const [user, setUser] = useState({ name: 'Guest User', email: '' });
  
  // 2. State for Mobile Menu Toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 3. Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    // Check if storedUser exists AND is not the string "undefined"
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data", e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // 4. Helper to get initials
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutGrid, path: '/dashboard' },
    { name: 'Curriculum', icon: BookOpen, path: '/curriculum' },
    { name: 'Translator', icon: MessageSquare, path: '/ai-tutor' },
    { name: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
    { name: 'Profile', icon: User, path: '/profile' }, 
  ];

  return (
    <>
      {/* --- Mobile Hamburger Button --- */}
      {/* Only visible on mobile (md:hidden), fixed position */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#0B0F19] text-white rounded-lg border border-slate-800 shadow-lg hover:bg-slate-800 transition-colors"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* --- Mobile Overlay --- */}
      {/* Darkens background when menu is open on mobile. Clicking it closes the menu. */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* --- Sidebar Container --- */}
      <div className={`
        fixed inset-y-0 left-0 z-50 h-screen w-64 bg-[#0B0F19] text-slate-400 flex flex-col p-6 border-r border-slate-800/50 flex-shrink-0
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:inset-auto
      `}>
        
        {/* --- Logo Section --- */}
        <div className="flex items-center gap-3 mb-12 mt-8 md:mt-0">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-green-900/20">
            N
          </div>
          <span className="text-xl font-bold text-white tracking-wide">N-ATLaS</span>
        </div>

        {/* --- Navigation Items --- */}
        <nav className="flex-1 space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/dashboard'}
              // Close menu when a link is clicked on mobile
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `
                w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group font-medium text-[15px]
                ${isActive 
                  ? 'border border-green-500 text-green-500 bg-green-500/5 shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
                  : 'border border-transparent hover:text-white hover:bg-white/5'
                }
              `}
            >
              <item.icon size={22} className="transition-colors" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* --- User Profile Footer --- */}
        <div className="mt-auto pt-6 border-t border-slate-800/60">
          <NavLink 
              to="/settings"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `
                  flex items-center gap-3 group cursor-pointer p-2 rounded-xl transition-all duration-200
                  ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}
              `}
          >
            {/* Dynamic Initials */}
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700 group-hover:border-slate-500 transition-colors">
              {getInitials(user.name)}
            </div>
            
            <div className="flex-1 overflow-hidden">
              {/* Dynamic Name */}
              <p className="text-sm font-bold text-white truncate group-hover:text-green-500 transition-colors">
                  {user.name}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">View Settings</p>
            </div>
            
            <Settings size={18} className="text-slate-600 group-hover:text-white transition-colors" />
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default SideNav;