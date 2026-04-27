import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { openAuthModal, openSettingsModal, toggleTheme } from '../../store/slices/uiSlice';
import { 
  Sun, Moon, LogOut, User as UserIcon, Settings as SettingsIcon, 
  ChevronDown, Menu, X as CloseIcon, Bell, MessageSquare, Clock as ClockIcon, Search, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const RealTimeClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="hidden lg:flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 px-2 py-1">
      <ClockIcon size={12} className="text-primary/60" />
      {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
    </div>
  );
};

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.ui.theme);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [adminSearchOpen, setAdminSearchOpen] = useState(false);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');

  const isHomePage = location.pathname === '/' || location.pathname === '/home';
  const role = localStorage.getItem('rentify_user_role') || user?.role?.toLowerCase() || 'tenant';
  const dashboardLink = `/${role}-dashboard`;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        if (role === 'admin') setAdminSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setNotificationsOpen(false);
        setMessagesOpen(false);
        setAdminSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [role]);

  // Listen for real-time ticket events from ServiceDashboard socket
  useEffect(() => {
    const handleNewTicket = (e) => {
      const ticket = e.detail;
      const newNotif = {
        id: Date.now(),
        text: `🔔 New ${ticket.category} request: ${ticket.title}`,
        subtext: `${ticket.property} · ${ticket.priority} Priority`,
        type: 'ticket',
        time: 'Just now',
      };
      setNotifications(prev => [newNotif, ...prev.slice(0, 9)]);
    };

    const handleTicketUpdate = (e) => {
      const { status, type, property, assignedTech } = e.detail;
      const icons = { Accepted: '✅', 'In Progress': '⏳', Completed: '🎉' };
      const newNotif = {
        id: Date.now() + 1,
        text: `${icons[status] || '🔔'} ${type} request ${status.toLowerCase()} — ${property}`,
        subtext: `Assigned to: ${assignedTech || 'Technician'}`,
        type: 'status_' + status.toLowerCase().replace(' ', '_'),
        time: 'Just now',
      };
      setNotifications(prev => [newNotif, ...prev.slice(0, 9)]);
    };

    window.addEventListener('rentify:new_ticket', handleNewTicket);
    window.addEventListener('rentify:owner_notification', handleTicketUpdate);
    return () => {
      window.removeEventListener('rentify:new_ticket', handleNewTicket);
      window.removeEventListener('rentify:owner_notification', handleTicketUpdate);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const clearNotifications = () => {
    setNotifications([]);
    setNotificationsOpen(false);
    toast.success("All caught up!");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm">
      <div className="flex justify-between items-center px-4 md:px-6 h-14 max-w-7xl mx-auto">
        <Link to="/" className="text-lg font-black tracking-tight bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent hover:from-blue-500 hover:to-indigo-600 transition-all duration-300 shrink-0">
          Rentify
        </Link>
        
        {isHomePage && (
          <div className="hidden md:flex items-center gap-8 font-sans text-sm font-medium tracking-tight shrink-0">
            <Link to="/listings" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0">Listings</Link>
            <button onClick={() => { document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0">How it Works</button>
          </div>
        )}

        {role === 'admin' && isAuthenticated && !isHomePage && (
          <div className="hidden lg:block relative w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search (Ctrl+K)..." 
              onClick={() => setAdminSearchOpen(true)}
              readOnly
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none cursor-pointer text-slate-500"
            />
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-4">
          {isAuthenticated && <RealTimeClock />}

          <button onClick={() => dispatch(toggleTheme())} className="p-2 text-slate-500 hover:text-primary transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <>
              <Link to={dashboardLink} className="hidden sm:block text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0">Dashboard</Link>
              <Link to="/payments" className="hidden sm:block text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0">Payments</Link>
              
              {/* Messages */}
              <div className="relative">
                <button onClick={() => {setMessagesOpen(!messagesOpen); setNotificationsOpen(false);}} className="p-2 text-slate-500 hover:text-primary transition-colors relative">
                  <MessageSquare size={18} />
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                </button>
                {messagesOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-4 animate-in slide-in-from-top-2 z-50">
                    <h4 className="font-black text-sm mb-4">Messages</h4>
                    <div className="text-center py-6 text-slate-400 font-bold text-sm">No new messages</div>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="relative">
                <button onClick={() => {setNotificationsOpen(!notificationsOpen); setMessagesOpen(false);}} className="p-2 text-slate-500 hover:text-primary transition-colors relative">
                  <Bell size={18} />
                  {notifications.length > 0 && <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[9px] font-black flex items-center justify-center">{notifications.length}</div>}
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-4 animate-in slide-in-from-top-2 z-50">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-black text-sm">Notifications</h4>
                      <button onClick={clearNotifications} className="text-xs font-bold text-primary hover:underline">Mark all read</button>
                    </div>
                    {notifications.length > 0 ? (
                      <div className="space-y-2 max-h-72 overflow-y-auto">
                        {notifications.map(n => (
                          <div key={n.id} className={`p-3 rounded-xl text-sm border cursor-pointer hover:border-primary transition-colors ${
                            n.type === 'ticket'
                              ? 'bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'
                          }`}>
                            <p className="font-bold text-slate-900 dark:text-white">{n.text}</p>
                            {n.subtext && <p className="text-xs text-slate-500 mt-0.5">{n.subtext}</p>}
                            {n.time && <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{n.time}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-slate-400 font-bold text-sm">No new notifications</div>
                    )}
                  </div>
                )}
              </div>

              <div className="relative group">
                <button className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary transition-colors focus:outline-none py-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`} alt="avatar" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <ChevronDown size={14} className="text-slate-400 group-hover:text-primary transition-colors" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                  <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.name || 'User'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || 'user@example.com'}</p>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-primary mt-1">{role}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                      <UserIcon size={16} /> Profile
                    </button>
                    <button onClick={() => dispatch(openSettingsModal())} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                      <SettingsIcon size={16} /> Account Settings
                    </button>
                  </div>
                  <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <LogOut size={16} /> Log out
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {!isHomePage && <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>}
              <Button variant="primary" size="sm" className="hidden sm:flex" onClick={() => navigate('/signup')}>Get Started</Button>
            </div>
          )}
          
          <button className="md:hidden p-2 text-slate-600 dark:text-slate-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Admin Global Search Modal */}
      {adminSearchOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/50 backdrop-blur-sm p-4 flex justify-center items-start pt-20" onClick={() => setAdminSearchOpen(false)}>
           <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
             <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <Search className="text-slate-400" size={20} />
                <input 
                  autoFocus
                  value={adminSearchQuery}
                  onChange={e => setAdminSearchQuery(e.target.value)}
                  placeholder="Search Users, Properties, Transactions..." 
                  className="flex-1 bg-transparent border-0 outline-none text-lg dark:text-white"
                />
                <button onClick={() => setAdminSearchOpen(false)} className="text-slate-400 hover:text-slate-600"><CloseIcon size={20}/></button>
             </div>
             {adminSearchQuery && (
               <div className="p-2 max-h-96 overflow-y-auto">
                 <div className="px-4 py-2 text-xs font-black uppercase text-slate-400">Users</div>
                  <div onClick={() => {navigate('/admin/entities'); setAdminSearchOpen(false);}} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-3 rounded-lg"><UserIcon size={16} className="text-blue-500"/> <span className="font-bold">Arjun Mehta</span></div>
                  <div onClick={() => {navigate('/admin/entities'); setAdminSearchOpen(false);}} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-3 rounded-lg"><UserIcon size={16} className="text-purple-500"/> <span className="font-bold">Priya Sharma</span></div>
                 
                 <div className="px-4 py-2 text-xs font-black uppercase text-slate-400 mt-2">Properties</div>
                  <div onClick={() => {navigate('/admin/assets'); setAdminSearchOpen(false);}} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-3 rounded-lg"><CheckCircle size={16} className="text-green-500"/> <span className="font-bold">Oberoi Splendour</span></div>
                 
                 <div className="px-4 py-2 text-xs font-black uppercase text-slate-400 mt-2">Transactions</div>
                  <div onClick={() => {navigate('/payments'); setAdminSearchOpen(false);}} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-3 rounded-lg"><ClockIcon size={16} className="text-orange-500"/> <span className="font-bold text-slate-500 line-through">TXN-8821</span> <span className="font-bold">₹95,000</span></div>
               </div>
             )}
           </div>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4">
            {isAuthenticated && (
              <>
                <Link to={dashboardLink} onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-400 font-bold p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">Dashboard</Link>
                <Link to="/payments" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-400 font-bold p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">Payments</Link>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-400 font-bold p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">Profile</Link>
              </>
            )}
            {!isAuthenticated && (
              <Button variant="primary" size="sm" className="w-full" onClick={() => {navigate('/signup'); setIsMobileMenuOpen(false);}}>Get Started</Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
