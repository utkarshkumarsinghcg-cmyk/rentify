import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openAuthModal } from '../store/slices/uiSlice';
import Button from '../components/common/Button';
import { 
  Sparkles, 
  TrendingUp, 
  Megaphone, 
  ShieldCheck, 
  Wrench, 
  Activity, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const OwnerLanding = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    localStorage.setItem('rentify_user_role', 'owner');
  }, []);

  const handleSignup = () => {
    dispatch(openAuthModal('signup'));
  };

  return (
    <div className="bg-surface dark:bg-slate-950 font-inter antialiased min-h-screen flex flex-col">
      <Helmet>
        <title>Rentify | Maximize Your Property Yield</title>
      </Helmet>

      <main className="max-w-7xl mx-auto px-6 py-12 flex-1">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24 pt-12">
          <div className="space-y-8 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
              <Sparkles size={16} className="fill-current" />
              <span className="text-xs font-bold uppercase tracking-wider">AI-Powered Management</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-tight text-slate-900 dark:text-white tracking-tight">
              Maximize Your Portfolio's Potential with <span className="text-primary">AI</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl font-medium">
              Experience the future of property management. Our intelligent platform automates tedious tasks, predicts maintenance needs, and secures high-quality tenants effortlessly.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                size="lg" 
                className="px-10 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                onClick={handleSignup}
              >
                List Your Property
                <ArrowRight size={20} />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-10 py-4 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
              >
                Book Demo
              </Button>
            </div>
          </div>
          
          <div className="relative animate-in slide-in-from-right duration-700">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/10 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full"></div>
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 group">
              <img 
                alt="Modern office interior" 
                className="w-full h-auto object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-1000" 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=60" 
              />
              {/* Floating Stats Card */}
              <div className="absolute -bottom-8 -left-8 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 z-20 hidden lg:block animate-bounce-subtle">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Avg. Portfolio Growth</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">+18.5%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-24">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Intelligent Solutions for Modern Owners</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Streamlining every aspect of the rental lifecycle</p>
          </div>
          
          <div className="grid grid-cols-12 gap-6">
            {/* Large Card: Automated Listings */}
            <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-10 group hover:shadow-xl transition-all duration-300">
              <div className="flex-1 space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Megaphone size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Automated Listings</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  Our AI crafts compelling property descriptions and syndicates them across 50+ major rental platforms instantly. Optimize pricing in real-time based on market data.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                    <CheckCircle size={18} className="text-emerald-500" />
                    Dynamic Market Pricing
                  </li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                    <CheckCircle size={18} className="text-emerald-500" />
                    Multi-platform Sync
                  </li>
                </ul>
              </div>
              <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                <img 
                  alt="Luxury apartment" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop&q=60" 
                />
              </div>
            </div>

            {/* Medium Card: Verified Tenants */}
            <div className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6 group hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Verified Tenants</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Comprehensive background checks, income verification, and rental history analysis powered by neural screening.
              </p>
              <div className="pt-4">
                <div className="flex items-center -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-${2+i}00`}></div>
                  ))}
                  <span className="ml-4 text-[10px] font-black uppercase tracking-widest text-slate-400">12k+ Verified this month</span>
                </div>
              </div>
            </div>

            {/* Medium Card: Maintenance Tracking */}
            <div className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6 group hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <Wrench size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Maintenance</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Predictive alerts before issues become expensive. 24/7 automated dispatch for urgent repairs.
              </p>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">HVAC Health</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Optimal</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 w-[92%] h-full"></div>
                </div>
              </div>
            </div>

            {/* Large Card: Dashboard Preview */}
            <div className="col-span-12 lg:col-span-8 bg-primary rounded-[2.5rem] p-10 shadow-xl shadow-primary/20 relative overflow-hidden text-white group hover:scale-[1.01] transition-all duration-300">
              <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                <Activity size={240} />
              </div>
              <div className="relative z-10 flex flex-col justify-between h-full space-y-12">
                <div className="max-w-md space-y-6">
                  <h3 className="text-3xl font-black tracking-tight">All-in-One Dashboard</h3>
                  <p className="opacity-90 font-medium leading-relaxed text-lg">
                    Monitor your entire portfolio ROI, upcoming renewals, and cash flow from a single intuitive interface designed for professional owners.
                  </p>
                </div>
                <div>
                  <Button 
                    className="bg-white text-primary px-10 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all border-0"
                    onClick={() => navigate('/dashboard')}
                  >
                    Explore Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-slate-900 dark:bg-black rounded-[3rem] p-12 lg:p-24 text-white text-center relative overflow-hidden group shadow-2xl mb-24">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_#2563eb,_transparent)] group-hover:scale-110 transition-transform duration-1000"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight">Ready to Scale Your Portfolio?</h2>
            <p className="text-lg opacity-80 font-medium">Join 5,000+ property owners who have automated their management with Rentify AI.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8">
              <Button 
                size="lg" 
                className="bg-primary text-white px-12 py-5 rounded-2xl font-bold text-xl hover:scale-105 active:scale-95 transition-all border-0 shadow-xl shadow-primary/20"
                onClick={handleSignup}
              >
                List Your Property
              </Button>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-50">No credit card required to start. Setup in under 10 minutes.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OwnerLanding;
