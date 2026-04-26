import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { ShieldCheck, TrendingUp, Zap, Clock, Wrench, Wallet } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { openAuthModal, openSurveyModal } from '../store/slices/uiSlice';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Rentify | Professional Property Management</title>
        <meta name="description" content="Find Safe, Verified Rentals Near You" />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-20 overflow-hidden flex-1 bg-surface dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-label-sm mb-6 uppercase tracking-widest font-bold">
              Trust & Security First
            </span>
            <h1 className="font-h1 text-4xl md:text-5xl lg:text-6xl text-slate-900 dark:text-white mb-6 leading-tight">
              Find Safe, <span className="text-primary">Verified Rentals</span> Near You
            </h1>
            <p className="font-body-lg text-slate-600 dark:text-slate-400 mb-10 max-w-lg">
              AI-powered pricing, inspector-approved properties, and seamless automated payments built for modern living.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate('/listings')}>Browse Listings</Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>How it works</Button>
            </div>
            <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-950 object-cover" src="https://i.pravatar.cc/100?img=1" alt="User 1" />
                <img className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-950 object-cover" src="https://i.pravatar.cc/100?img=2" alt="User 2" />
                <img className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-950 object-cover" src="https://i.pravatar.cc/100?img=3" alt="User 3" />
              </div>
              <p className="text-body-sm text-slate-600 dark:text-slate-400">
                Joined by <span className="font-bold text-slate-900 dark:text-white">12,000+</span> managers and tenants
              </p>
            </div>
          </div>
          
          {/* Image/Mockup area */}
          <div className="relative">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-secondary-fixed/30 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-primary-fixed/30 blur-3xl rounded-full"></div>
            <div className="glass-card p-4 rounded-2xl shadow-xl overflow-hidden relative group">
              <img 
                className="rounded-xl object-cover w-full h-[500px] transition-transform duration-700 group-hover:scale-105" 
                alt="Modern glass skyscraper" 
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60" 
              />
              <div className="absolute bottom-10 left-10 right-10 glass-card p-6 rounded-xl border border-white/40 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-label-md text-slate-900 dark:text-white text-lg">Horizon View Apartments</h4>
                    <p className="text-body-sm text-slate-600 dark:text-slate-400">Downtown Metro • $2,450/mo</p>
                  </div>
                  <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 uppercase tracking-tighter">
                    <ShieldCheck size={12} /> Verified
                  </span>
                </div>
                <div className="flex gap-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                  <div className="text-slate-600 dark:text-slate-400 font-label-sm">2 Beds</div>
                  <div className="text-slate-600 dark:text-slate-400 font-label-sm">2 Baths</div>
                  <div className="text-slate-600 dark:text-slate-400 font-label-sm">1,200 sqft</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (How it Works) */}
      <section id="how-it-works" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900 relative border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="font-h2 text-4xl mb-4 text-slate-900 dark:text-white">Precision Managed Performance</h2>
            <p className="font-body-md text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              We've eliminated the friction of traditional rental markets with automated tools designed for total transparency and ease.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-h3 text-xl mb-3 text-slate-900 dark:text-white">Safety Inspections</h3>
              <p className="font-body-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Every listing is physically verified by professional inspectors. We check plumbing, electrical, and structural integrity before you see it.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <TrendingUp size={24} />
              </div>
              <h3 className="font-h3 text-xl mb-3 text-slate-900 dark:text-white">AI Rent Prediction</h3>
              <p className="font-body-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Our proprietary algorithms analyze local market trends and property conditions to ensure landlords price fairly and tenants pay value.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <Wallet size={24} />
              </div>
              <h3 className="font-h3 text-xl mb-3 text-slate-900 dark:text-white">Instant Payments</h3>
              <p className="font-body-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Automated escrow and instant deposit technology mean rent reaches landlords immediately while protecting tenant deposits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,_auto)]">
            
            {/* Chart Card - 2 columns wide */}
            <div className="md:col-span-2 bg-slate-900 dark:bg-slate-900 rounded-3xl p-10 flex flex-col justify-between relative overflow-hidden group border border-slate-800">
              <div className="relative z-10">
                <h3 className="font-h3 text-3xl mb-3 text-white">Master Your Real Estate Portfolio</h3>
                <p className="font-body-md text-slate-400 max-w-md mb-8">
                  Real-time insights for property managers looking to scale operations, without the paperwork headache.
                </p>
                <Button variant="secondary" className="bg-white text-slate-900 hover:bg-slate-100" onClick={() => dispatch(openAuthModal('signup'))}>
                  View Dashboard
                </Button>
              </div>
              <div className="absolute right-0 bottom-0 w-3/4 opacity-50 transition-opacity duration-700 group-hover:opacity-80">
                <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto translate-y-12 translate-x-12">
                  <path d="M0 200V120L50 140L100 80L150 110L200 40L250 90L300 20L350 60L400 10V200H0Z" fill="url(#paint0_linear)"/>
                  <path d="M0 120L50 140L100 80L150 110L200 40L250 90L300 20L350 60L400 10" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="200" y1="10" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3B82F6" stopOpacity="0.4"/>
                      <stop offset="1" stopColor="#3B82F6" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Trust Rating Card */}
            <div className="bg-primary rounded-3xl p-10 flex flex-col justify-center items-center text-center relative overflow-hidden">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck size={32} className="text-white" />
              </div>
              <h3 className="font-h3 text-2xl mb-4 text-white">99.9% Trust Rating</h3>
              <p className="font-body-sm text-white/80 mb-8">
                Our rigorous verification process ensures that every transaction is secure and every home is legitimate.
              </p>
              <div className="flex w-full justify-between border-t border-white/20 pt-6">
                <div>
                  <div className="font-bold text-white text-2xl">4.8k</div>
                  <div className="text-white/60 text-xs uppercase tracking-wider mt-1">Properties</div>
                </div>
                <div>
                  <div className="font-bold text-white text-2xl">92%</div>
                  <div className="text-white/60 text-xs uppercase tracking-wider mt-1">Retention</div>
                </div>
              </div>
            </div>

            {/* Instant Approvals Card */}
            <div className="bg-[#69F0AE] rounded-3xl p-10 flex flex-col justify-center">
              <div className="w-12 h-12 bg-black/10 rounded-xl flex items-center justify-center mb-6">
                <Zap size={24} className="text-slate-900" />
              </div>
              <h3 className="font-h3 text-xl mb-3 text-slate-900 font-bold">Instant Approvals</h3>
              <p className="font-body-sm text-slate-800">
                Sign leases in minutes, not days. Our automated background checks happen in real time.
              </p>
            </div>

            {/* Built-in Maintenance Card */}
            <div className="md:col-span-2 bg-[#E2E8F0] dark:bg-slate-900 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-200 dark:border-slate-800">
              <div className="flex-1">
                <h3 className="font-h3 text-xl mb-3 text-slate-900 dark:text-white">Built-in Maintenance</h3>
                <p className="font-body-sm text-slate-600 dark:text-slate-400">
                  Direct line to local certified technicians. Submit requests with a tap and track progress live.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex gap-6 md:gap-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Wrench size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Plumbing</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Zap size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Electric</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                    <Clock size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">HVAC</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
