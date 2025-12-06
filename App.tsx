import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Wiki from './components/Wiki';
import Activity from './components/Activity';
import AdminPanel from './components/AdminPanel';
import { ViewState, User } from './types';
import { Menu, X, Lock, Mail, User as UserIcon, Lock as LockIcon, Image as ImageIcon, Briefcase, CheckCircle, ArrowRight } from 'lucide-react';
import { MOCK_USERS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  
  // Data State (Lifted up to support dynamic updates)
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Auth Form State
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      avatar: '',
      role: 'viewer' as 'admin' | 'editor' | 'viewer'
  });
  const [authError, setAuthError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      setAuthError('');
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (authMode === 'login') {
          // Simulated Login
          const foundUser = allUsers.find(u => u.email === formData.email);
          if (foundUser) {
              setUser(foundUser);
              setShowLoginModal(false);
              resetForm();
          } else {
              setAuthError('Invalid email or password.');
          }
      } else {
          // Registration
          if (!formData.name || !formData.email || !formData.password) {
              setAuthError('Please fill in all required fields.');
              return;
          }
          if (allUsers.find(u => u.email === formData.email)) {
              setAuthError('User with this email already exists.');
              return;
          }

          const newUser: User = {
              id: Date.now().toString(),
              name: formData.name,
              email: formData.email,
              avatar: formData.avatar || undefined,
              role: formData.role,
              contributionScore: 0 // Start with 0 XP
          };

          setAllUsers([...allUsers, newUser]);
          setUser(newUser);
          setShowLoginModal(false);
          resetForm();
      }
  };

  const handleSocialLogin = (provider: string) => {
      const newUser: User = {
          id: Date.now().toString(),
          name: `${provider} User`,
          email: `user@${provider.toLowerCase()}.com`,
          avatar: undefined, // Could add generic provider avatar here
          role: 'editor',
          contributionScore: 0
      };
      setAllUsers(prev => [...prev, newUser]);
      setUser(newUser);
      setShowLoginModal(false);
  }

  const resetForm = () => {
      setFormData({ name: '', email: '', password: '', avatar: '', role: 'viewer' });
      setAuthError('');
      setAuthMode('login');
  };

  // Quick Login for Demo
  const handleQuickLogin = (userId: string) => {
    const foundUser = allUsers.find(u => u.id === userId);
    if (foundUser) {
        setUser(foundUser);
        setShowLoginModal(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(ViewState.DASHBOARD);
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.WIKI:
        return <Wiki user={user} />;
      case ViewState.ACTIVITY:
        return <Activity users={allUsers} />;
      case ViewState.ADMIN:
        if (!user || user.role !== 'admin') {
            return (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6 text-center">
                    <div className="bg-gray-100 p-6 rounded-full mb-6">
                        <Lock size={48} className="text-gray-300"/>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-700">Access Restricted</h2>
                    <p className="mt-2 text-gray-500 max-w-md">The Admin Console is reserved for system administrators. Please contact IT or sign in with an admin account.</p>
                </div>
            )
        }
        return <AdminPanel users={allUsers} />;
      default:
        return <div className="p-10 text-gray-500">Module under construction...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fa] flex flex-col md:flex-row overflow-hidden font-sans text-slate-800">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#0d1117] text-white p-4 flex items-center justify-between sticky top-0 z-20 shadow-md shrink-0">
        <div className="font-bold tracking-wide flex items-center gap-2">NEXUS</div>
        <button onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
        </button>
      </div>

      {/* Navigation */}
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        onLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        width={sidebarWidth}
        setWidth={setSidebarWidth}
      />

      {/* Main Content Area */}
      <main 
        className="flex-1 overflow-hidden h-[calc(100vh-60px)] md:h-screen bg-white md:bg-[#f6f8fa] transition-all duration-300 relative shadow-inner"
      >
        {renderContent()}
      </main>

      {/* Auth Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d1117]/80 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row min-h-[500px] animate-fade-in-up">
                
                {/* Left Side: Branding / Info */}
                <div className="md:w-5/12 bg-gradient-to-br from-blue-600 to-indigo-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-extrabold tracking-tight mb-2">Nexus Hub</h2>
                        <p className="text-blue-100 font-medium">Your academic growth engine.</p>
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md"><CheckCircle size={16}/></div>
                            <span className="text-sm font-medium text-blue-50">Collaborate on Docs</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md"><CheckCircle size={16}/></div>
                            <span className="text-sm font-medium text-blue-50">Track Contributions</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md"><CheckCircle size={16}/></div>
                            <span className="text-sm font-medium text-blue-50">Manage Projects</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Forms */}
                <div className="md:w-7/12 p-8 md:p-12 bg-white flex flex-col justify-center relative overflow-y-auto">
                    <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24}/></button>
                    
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {authMode === 'login' ? 'Welcome back' : 'Create an account'}
                        </h3>
                        <p className="text-gray-500 text-sm">
                            {authMode === 'login' 
                                ? 'Please enter your details to sign in.' 
                                : 'Join the community and start building.'}
                        </p>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <button onClick={() => handleSocialLogin('Google')} className="flex items-center justify-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                        </button>
                        <button onClick={() => handleSocialLogin('Apple')} className="flex items-center justify-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.38-1.07-.52-2.05-.51-3.11 0-1.03.51-2.01.66-2.96-.36C6.15 18.42 5 15.35 6.2 12.54c.99-2.32 3.05-3.15 4.67-2.9 1.04.16 2.02.66 2.76.66.75 0 2.01-.64 3.23-.52 1.35.12 2.52.74 3.2 1.9-2.77 1.63-2.3 5.48.51 6.6zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                             </svg>
                        </button>
                        <button onClick={() => handleSocialLogin('Microsoft')} className="flex items-center justify-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 23 23">
                                <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                                <path fill="#f35325" d="M1 1h10v10H1z"/>
                                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                                <path fill="#ffba08" d="M12 12h10v10H12z"/>
                            </svg>
                        </button>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleAuthSubmit} className="space-y-4">
                        {authMode === 'register' && (
                            <div className="relative group">
                                <UserIcon className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500" size={18}/>
                                <input 
                                    name="name"
                                    type="text" 
                                    placeholder="Full Name" 
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                                />
                            </div>
                        )}
                        
                        <div className="relative group">
                            <Mail className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500" size={18}/>
                            <input 
                                name="email"
                                type="email" 
                                placeholder="Email Address" 
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                            />
                        </div>

                        <div className="relative group">
                            <LockIcon className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500" size={18}/>
                            <input 
                                name="password"
                                type="password" 
                                placeholder="Password" 
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                            />
                        </div>

                        {authMode === 'register' && (
                            <>
                                <div className="relative group">
                                    <ImageIcon className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500" size={18}/>
                                    <input 
                                        name="avatar"
                                        type="text" 
                                        placeholder="Avatar URL (Optional)" 
                                        value={formData.avatar}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                                    />
                                </div>
                                <div className="relative group">
                                    <Briefcase className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500" size={18}/>
                                    <select 
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all appearance-none text-gray-600"
                                    >
                                        <option value="viewer">Viewer</option>
                                        <option value="editor">Editor</option>
                                        <option value="admin">Admin (Demo)</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {authError && <p className="text-red-500 text-sm font-medium">{authError}</p>}

                        <button 
                            type="submit" 
                            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2"
                        >
                            {authMode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={18}/>
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                            <button 
                                onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }}
                                className="text-blue-600 font-bold hover:underline"
                            >
                                {authMode === 'login' ? 'Sign up' : 'Log in'}
                            </button>
                        </p>
                    </div>

                    {authMode === 'login' && (
                        <div className="mt-8 pt-6 border-t border-gray-100">
                             <p className="text-xs text-center text-gray-400 mb-3 uppercase tracking-wider font-semibold">Or try demo accounts</p>
                             <div className="flex gap-2 justify-center">
                                <button onClick={() => handleQuickLogin('1')} title="Admin" className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold hover:bg-purple-200 transition-colors">A</button>
                                <button onClick={() => handleQuickLogin('2')} title="Editor" className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold hover:bg-blue-200 transition-colors">E</button>
                                <button onClick={() => handleQuickLogin('3')} title="Viewer" className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold hover:bg-green-200 transition-colors">V</button>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;