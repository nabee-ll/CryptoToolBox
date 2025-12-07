import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, Lock, Unlock, Key, Menu, X, LogIn, LogOut, User } from 'lucide-react';
import Home from './pages/Home';
import Encryption from './pages/Encryption';
import Decryption from './pages/Decryption';
import KeyManagement from './pages/KeyManagement';
import Login from './pages/Login';
import { Button } from './components/UI';
import { UserProfile } from './types';

const NavLink = ({ to, icon, label, onClick }: { to: string; icon: React.ReactNode; label: string; onClick?: () => void }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const TopBar = ({ user, onLogout }: { user: UserProfile | null, onLogout: () => void }) => {
  const location = useLocation();
  if (location.pathname === '/login') return null;

  if (user) {
    return (
      <div className="hidden lg:flex justify-end items-center mb-6 gap-4">
        <div className="flex items-center gap-3 bg-white dark:bg-darkcard py-1.5 px-3 rounded-full border border-gray-200 dark:border-darkborder shadow-sm">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-xs">
              {user.name.charAt(0)}
            </div>
          )}
          <div className="flex flex-col">
             <span className="text-sm font-medium text-gray-900 dark:text-white leading-none">{user.name}</span>
             <span className="text-[10px] text-gray-500">{user.email}</span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onLogout} className="text-gray-600 dark:text-gray-400">
          <LogOut size={16} className="mr-2" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex justify-end items-center mb-6">
      <Link to="/login">
        <Button variant="primary" size="sm" className="shadow-none">
          <LogIn size={16} className="mr-2" />
          Login
        </Button>
      </Link>
    </div>
  );
};

const App: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const handleLogin = (profile: UserProfile) => {
    setUser(profile);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-darkbg flex font-sans transition-colors duration-200">
        
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-darkcard border-b border-gray-200 dark:border-darkborder flex items-center justify-between px-4 z-50">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white cursor-pointer hover:opacity-80 transition-opacity">
            <Shield className="text-primary-500" />
            <span>CryptoToolbox</span>
          </Link>
          <div className="flex items-center gap-3">
             {user ? (
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <button onClick={handleLogout} className="p-2 text-gray-600 dark:text-gray-300">
                    <LogOut size={20} />
                  </button>
               </div>
             ) : (
               <Link to="/login">
                 <Button variant="ghost" size="sm" className="!px-2">
                   <LogIn size={20} />
                 </Button>
               </Link>
             )}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 dark:text-gray-300">
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-darkcard border-r border-gray-200 dark:border-darkborder transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full flex flex-col">
            <Link to="/" className="h-16 flex items-center gap-2 px-6 border-b border-gray-200 dark:border-darkborder hover:opacity-80 transition-opacity cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
              <Shield className="text-primary-500 w-6 h-6" />
              <span className="font-bold text-xl text-gray-900 dark:text-white">CryptoToolbox</span>
            </Link>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <NavLink to="/" icon={<Shield size={20} />} label="Home" onClick={() => setIsMobileMenuOpen(false)} />
              <NavLink to="/encrypt" icon={<Lock size={20} />} label="Encrypt" onClick={() => setIsMobileMenuOpen(false)} />
              <NavLink to="/decrypt" icon={<Unlock size={20} />} label="Decrypt" onClick={() => setIsMobileMenuOpen(false)} />
              <NavLink to="/keys" icon={<Key size={20} />} label="Key Management" onClick={() => setIsMobileMenuOpen(false)} />
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-darkborder">
               {user && (
                 <div className="mb-4 flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Authenticated</span>
                 </div>
               )}
               <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                 <div className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                 Client-side Secure
               </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 pt-16 lg:pt-0 min-w-0">
          <div className="h-full p-4 md:p-8 overflow-y-auto">
            <TopBar user={user} onLogout={handleLogout} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/encrypt" element={<Encryption />} />
              <Route path="/decrypt" element={<Decryption />} />
              <Route path="/keys" element={<KeyManagement />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
            </Routes>
          </div>
        </main>

        {/* Overlay for mobile */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </Router>
  );
};

export default App;