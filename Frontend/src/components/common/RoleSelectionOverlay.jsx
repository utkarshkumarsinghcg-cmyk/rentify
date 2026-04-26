import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Building, ShieldCheck, Wrench, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoleCard = ({ role, title, desc, icon: Icon, color, onClick }) => (
  <button
    onClick={onClick}
    className="group relative flex flex-col items-center p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-center"
  >
    <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
      <Icon size={32} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
    <div className="absolute inset-0 rounded-[2.5rem] border-2 border-transparent group-hover:border-primary/20 transition-colors pointer-events-none" />
  </button>
);

const RoleSelectionOverlay = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [hasDismissed, setHasDismissed] = React.useState(localStorage.getItem('role_selected') === 'true');
  const navigate = useNavigate();

  if (isAuthenticated || hasDismissed) return null;

  const handleRoleSelect = (role) => {
    localStorage.setItem('role_selected', 'true');
    setHasDismissed(true);
    // Navigate to the specific persona landing page
    navigate(`/welcome/${role}`);
  };

  const roles = [
    {
      id: 'renter',
      title: 'Renter',
      desc: 'Find and book verified properties with ease.',
      icon: User,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    },
    {
      id: 'owner',
      title: 'Property Owner',
      desc: 'Manage your portfolio and track revenue.',
      icon: Building,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    },
    {
      id: 'inspector',
      title: 'Inspector',
      desc: 'Perform audits and ensure property safety.',
      icon: ShieldCheck,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    },
    {
      id: 'service',
      title: 'Service Provider',
      desc: 'Handle maintenance and repairs efficiently.',
      icon: Wrench,
      color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    },
    {
      id: 'admin',
      title: 'Platform Admin',
      desc: 'System governance and global operations.',
      icon: ShieldAlert,
      color: 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 overflow-y-auto custom-scrollbar">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-700" />

      {/* Content */}
      <div className="relative w-full max-w-7xl mx-auto py-12 animate-in zoom-in-95 slide-in-from-bottom-10 duration-700">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6">
            Welcome to Rentify
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            How will you use <span className="text-primary">Rentify?</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto font-medium">
            Select your primary role to customize your experience and access relevant tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              {...role}
              onClick={() => handleRoleSelect(role.id)}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => {
              localStorage.setItem('role_selected', 'true');
              setHasDismissed(true);
            }}
            className="text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
          >
            I'll decide later →
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionOverlay;
