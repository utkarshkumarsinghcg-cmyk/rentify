import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Building, User, ShieldCheck, Wrench, ShieldAlert, CheckCircle, ArrowRight, Download } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Button from '../components/common/Button';

const RoleCard = ({ title, desc, icon: Icon, buttonText, onClick }) => (
  <div 
    onClick={onClick}
    className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-[2rem] flex flex-col h-full hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden"
  >
    {/* Subtle animated background gradient on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="relative z-10">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm border border-blue-100 dark:border-blue-800/30">
        <Icon size={28} strokeWidth={1.5} />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 leading-relaxed flex-grow mb-8 font-medium">
        {desc}
      </p>
      
      <div className="mt-auto flex items-center text-blue-600 dark:text-blue-400 font-bold text-sm tracking-wide uppercase">
        <span className="relative">
          {buttonText}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 group-hover:w-full transition-all duration-300" />
        </span>
        <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
      </div>
    </div>
  </div>
);

const MasterLanding = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const roles = [
    {
      id: 'owner',
      title: 'Owner',
      desc: 'Manage properties, track leases, and handle financial statements with ease.',
      icon: Building,
      buttonText: 'Launch Dashboard',
    },
    {
      id: 'renter',
      title: 'Renter',
      desc: 'Find a home, pay rent securely, and submit maintenance requests instantly.',
      icon: User,
      buttonText: 'Find a Home',
    },
    {
      id: 'inspector',
      title: 'Inspector',
      desc: 'Audit safety, perform walkthroughs, and generate professional PDF reports.',
      icon: ShieldCheck,
      buttonText: 'Start Audit',
    },
    {
      id: 'service',
      title: 'Service Provider',
      desc: 'Offer maintenance, manage work orders, and grow your local client base.',
      icon: Wrench,
      buttonText: 'Join Network',
    },
    {
      id: 'admin',
      title: 'Admin',
      desc: 'Govern the ecosystem, monitor security, and manage global operations.',
      icon: ShieldAlert,
      buttonText: 'Access Portal',
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Helmet>
        <title>Rentify | The All-in-One Rental Ecosystem</title>
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&auto=format&fit=crop&q=80" 
            alt="Modern apartment building" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent dark:from-slate-950 dark:via-slate-950/90" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl animate-in slide-in-from-left duration-700">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-6">
              The All-in-One <br />
              <span className="text-blue-600">Rental Ecosystem</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-lg leading-relaxed">
              Whether you're listing, renting, or maintaining, we have the tools for you. Experience a seamless property journey with Rentify.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="w-full sm:w-auto font-bold shadow-lg shadow-blue-600/20" onClick={() => document.getElementById('roles').scrollIntoView({behavior: 'smooth'})}>
                Get Started
              </Button>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto font-bold bg-slate-200/50 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-in slide-in-from-bottom duration-700">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Choose Your Experience</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Select the role that fits your needs to explore specialized features designed for your success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {roles.slice(0, 3).map((role) => (
              <RoleCard
                key={role.id}
                {...role}
                onClick={() => navigate(`/welcome/${role.id}`)}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">
            {roles.slice(3, 5).map((role) => (
              <RoleCard
                key={role.id}
                {...role}
                onClick={() => navigate(`/welcome/${role.id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bento Box Features Section */}
      <section id="how-it-works" className="py-24 bg-slate-100 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Top Left: Financials */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex-1 space-y-4 z-10">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Centralized Financials</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Automate rent collection and generate real-time tax reports with our integrated ledger system.
                </p>
              </div>
              <div className="flex-1 w-full relative">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80" 
                  alt="Financial Dashboard" 
                  className="rounded-xl shadow-2xl object-cover h-48 w-full transform md:scale-125 md:translate-x-8 md:translate-y-4"
                />
              </div>
            </div>

            {/* Top Right: Security */}
            <div className="bg-blue-600 rounded-[2rem] p-8 md:p-12 text-white shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-8 relative z-10">
                <ShieldCheck size={28} />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Trust & Security</h3>
                <p className="text-blue-100 leading-relaxed">
                  Bank-grade encryption for all transactions and sensitive document storage.
                </p>
              </div>
            </div>

            {/* Bottom Left: Mobile Ready */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Mobile Ready</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  Manage your properties on the go with our fully responsive mobile platform.
                </p>
              </div>
              <button className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors group w-fit">
                Download App <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Bottom Right: Communication */}
            <div className="lg:col-span-2 bg-[#69F0AE] rounded-[2rem] p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent pointer-events-none"></div>
              <div className="max-w-md relative z-10 text-slate-900">
                <h3 className="text-2xl font-bold mb-4">Instant Communication</h3>
                <p className="text-emerald-950/80 font-medium leading-relaxed">
                  Real-time messaging between tenants, owners, and service providers to resolve issues faster.
                </p>
              </div>
              <div className="flex -space-x-4 relative z-10 shrink-0">
                <div className="w-16 h-16 rounded-full border-4 border-[#69F0AE] bg-white overflow-hidden shadow-lg">
                  <img src="https://i.pravatar.cc/150?u=1" alt="Avatar 1" className="w-full h-full object-cover" />
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-[#69F0AE] bg-white overflow-hidden shadow-lg">
                  <img src="https://i.pravatar.cc/150?u=2" alt="Avatar 2" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default MasterLanding;
