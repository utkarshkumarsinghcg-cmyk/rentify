import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openAuthModal } from '../store/slices/uiSlice';
import Button from '../components/common/Button';
import { 
  CheckCircle, 
  Briefcase, 
  DollarSign, 
  Users, 
  Check, 
  ArrowRight,
  Wrench,
  Clock,
  ChevronRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const ServiceLanding = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="bg-surface dark:bg-slate-950 font-inter antialiased min-h-screen flex flex-col">
      <Helmet>
        <title>Rentify | Grow Your Maintenance Business</title>
      </Helmet>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 pt-12">
            <div className="flex-1 space-y-8 animate-in slide-in-from-left duration-700">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-widest">
                Service Provider Portal
              </span>
              <h1 className="text-5xl lg:text-7xl font-black leading-tight text-slate-900 dark:text-white tracking-tight">
                Grow Your Business <br/>
                <span className="text-primary">Faster</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl font-medium">
                Connect with thousands of property owners, manage your team seamlessly, and get paid instantly for every completed job.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="px-10 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                  onClick={() => dispatch(openAuthModal('signup'))}
                >
                  Apply as a Provider
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-10 py-4 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
            
            <div className="flex-1 relative animate-in slide-in-from-right duration-700">
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 border border-slate-100 dark:border-slate-800 group">
                <img 
                  className="w-full h-[500px] object-cover group-hover:scale-110 transition-transform duration-1000" 
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=60" 
                  alt="Professional maintenance technician"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl z-20 max-w-[260px] border border-slate-100 dark:border-slate-700 animate-bounce-subtle">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck size={18} />
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">Verified Account</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Your business is now eligible for premium commercial job queues.</p>
              </div>
            </div>
          </div>
          
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-slate-50/50 dark:bg-slate-900/20 rounded-l-[100px] hidden lg:block"></div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-24 bg-surface dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Powerful tools for scale</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">Rentify provides the infrastructure you need to transition from a solo contractor to a powerhouse maintenance firm.</p>
            </div>
            
            <div className="grid grid-cols-12 gap-6">
              {/* Large Card: Verified Job Queue */}
              <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-10 group hover:shadow-xl transition-all duration-300">
                <div className="flex-1 space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Briefcase size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Verified Job Queue</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Access a filtered stream of high-intent jobs from property managers. No cold calling, no bidding wars—just work ready for execution.</p>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                      <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Check size={12} strokeWidth={4} />
                      </div>
                      Real-time notifications
                    </li>
                    <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                      <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Check size={12} strokeWidth={4} />
                      </div>
                      Pre-authorized budget
                    </li>
                    <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                      <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Check size={12} strokeWidth={4} />
                      </div>
                      Location-based routing
                    </li>
                  </ul>
                </div>
                <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 overflow-hidden border border-slate-100 dark:border-slate-800">
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm flex items-center justify-between border-l-4 border-primary animate-in fade-in slide-in-from-right duration-500 delay-100">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">HVAC Repair</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sunrise Apartments • 1.2km</p>
                      </div>
                      <span className="text-primary font-black text-xl">₹12,500</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm flex items-center justify-between opacity-50">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Emergency Plumb</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Oak Tower • 2.5km</p>
                      </div>
                      <span className="text-primary font-black text-xl">₹6,800</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Small Card: Instant Earnings */}
              <div className="col-span-12 lg:col-span-4 bg-primary rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-xl shadow-primary/20 group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                  <TrendingUp size={160} />
                </div>
                <div className="space-y-6 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                    <DollarSign size={28} />
                  </div>
                  <h3 className="text-2xl font-bold">Instant Earnings</h3>
                  <p className="opacity-80 font-medium leading-relaxed">Stop waiting 30 days for invoices. Get paid within 24 hours of job completion through our secure payment rail.</p>
                </div>
                <div className="mt-12 text-5xl font-black tracking-tighter relative z-10">₹12,45,000</div>
              </div>

              {/* Small Card: Client Management */}
              <div className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 group hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-8 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <Users size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Client Portal</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">A dedicated CRM for your maintenance business. Keep history of every repair, property, and tenant interaction.</p>
              </div>

              {/* Medium Card: Equipment Tracking */}
              <div className="col-span-12 lg:col-span-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] overflow-hidden relative border border-slate-100 dark:border-slate-800 group">
                <div className="p-10 relative z-10 max-w-md">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-8 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                    <Wrench size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Team & Fleet Ops</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Dispatch technicians, track equipment usage, and manage your inventory all in one place. Scale your operations without the paperwork.</p>
                </div>
                <img 
                  className="absolute right-0 bottom-0 w-1/2 h-full object-cover rounded-tl-[100px] hidden md:block group-hover:scale-105 transition-transform duration-1000" 
                  src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&auto=format&fit=crop&q=60" 
                  alt="Professional tools"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-slate-900 dark:bg-black text-white rounded-[3rem] p-12 lg:p-24 text-center relative overflow-hidden group shadow-2xl">
              <div className="relative z-10 space-y-8">
                <h2 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight">Ready to take the next step?</h2>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">Join 5,000+ top-rated service providers who have scaled their businesses with Rentify. Verification takes less than 48 hours.</p>
                <div className="flex flex-col md:flex-row gap-6 justify-center items-center pt-8">
                  <Button 
                    size="lg" 
                    className="bg-primary text-white px-12 py-5 rounded-2xl font-bold text-xl hover:scale-105 active:scale-95 transition-all border-0 shadow-xl shadow-primary/20"
                    onClick={() => dispatch(openAuthModal('signup'))}
                  >
                    Apply as a Provider
                  </Button>
                  <span className="text-slate-500 font-bold text-sm tracking-wide">No monthly fees. 5% platform commission only.</span>
                </div>
              </div>
              
              {/* Decorative blurs */}
              <div className="absolute -top-24 -left-24 w-80 h-80 bg-primary rounded-full blur-[150px] opacity-20 group-hover:scale-125 transition-transform duration-1000"></div>
              <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-emerald-500 rounded-full blur-[150px] opacity-20 group-hover:scale-125 transition-transform duration-1000"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ServiceLanding;
