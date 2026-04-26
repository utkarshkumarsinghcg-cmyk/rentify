import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openAuthModal } from '../store/slices/uiSlice';
import Button from '../components/common/Button';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle, 
  FileEdit, 
  Zap, 
  Calendar, 
  Wrench, 
  Gauge,
  Bed,
  Bath,
  Maximize,
  ChevronRight
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const InspectorLanding = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="bg-surface dark:bg-slate-950 font-inter antialiased min-h-screen flex flex-col">
      <Helmet>
        <title>Rentify | Streamline Your Inspection Workflow</title>
      </Helmet>

      <main className="max-w-7xl mx-auto px-6 py-12 flex-1">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24 pt-12">
          <div className="lg:col-span-6 space-y-8 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
              <ShieldCheck size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Professional Inspection Network</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-tight text-slate-900 dark:text-white tracking-tight">
              Streamline Your <br/>
              <span className="text-primary">Inspection Workflow</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl font-medium">
              The all-in-one platform for property inspectors. Digitize your audits, generate real-time reports, and manage your schedule effortlessly in a high-tech ecosystem.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                size="lg" 
                className="px-10 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                onClick={() => dispatch(openAuthModal('signup'))}
              >
                Join the Network
                <ArrowRight size={20} />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-10 py-4 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
              >
                View Demo
              </Button>
            </div>
          </div>
          
          <div className="lg:col-span-6 relative animate-in slide-in-from-right duration-700">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 group bg-white dark:bg-slate-900">
              <img 
                alt="High-tech inspection interface" 
                className="w-full h-auto object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-1000" 
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop&q=60" 
              />
              {/* Floating UI Card Overlay */}
              <div className="absolute bottom-8 -left-12 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 max-w-xs hidden xl:block animate-bounce-subtle">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400">
                    <CheckCircle size={18} />
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">Audit Complete</div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Real-time report synced with Rentify cloud successfully.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="py-24">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Tools Built for Precision</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">Modernize every aspect of your professional workflow with our integrated feature set.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Item 1 */}
            <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-8 items-center group hover:shadow-xl transition-all duration-300">
              <div className="flex-1 space-y-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl inline-block group-hover:scale-110 transition-transform">
                  <FileEdit size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Digital Audit Tools</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Eliminate paperwork with dynamic mobile forms. Capture data, notes, and photos directly in the field with offline sync capabilities.</p>
              </div>
              <div className="flex-1 w-full h-48 bg-slate-50 dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                <img 
                  alt="Audit interface" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=60" 
                />
              </div>
            </div>

            {/* Bento Item 2 */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between group hover:shadow-xl transition-all duration-300">
              <div className="space-y-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl inline-block group-hover:scale-110 transition-transform">
                  <Zap size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Real-time Reports</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Generate PDF reports instantly after completion. Send polished, professional results to clients before you even leave.</p>
              </div>
            </div>

            {/* Bento Item 3 */}
            <div className="bg-primary rounded-3xl p-10 shadow-xl shadow-primary/20 text-white flex flex-col justify-between group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                <Calendar size={120} />
              </div>
              <div className="space-y-4 relative z-10">
                <div className="p-3 bg-white/20 text-white rounded-xl inline-block">
                  <Calendar size={24} />
                </div>
                <h3 className="text-2xl font-bold">Automated Scheduling</h3>
                <p className="opacity-90 leading-relaxed font-medium">Sync your calendar and let clients book directly. Route optimization included for multi-site days.</p>
              </div>
              <div className="mt-8 pt-8 border-t border-white/10 relative z-10">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-primary bg-slate-${2+i}00`}></div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-primary bg-primary-container flex items-center justify-center text-[10px] font-bold">+12</div>
                </div>
                <div className="mt-2 text-[10px] font-black uppercase tracking-widest opacity-70">Active bookings this week</div>
              </div>
            </div>

            {/* Bento Item 4 */}
            <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row-reverse gap-8 items-center group hover:shadow-xl transition-all duration-300">
              <div className="flex-1 space-y-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl inline-block group-hover:scale-110 transition-transform">
                  <Wrench size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Professional Toolset</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Integrate with thermal cameras, moisture meters, and 360° cameras to deliver more comprehensive insights than ever before.</p>
              </div>
              <div className="flex-1 w-full h-48 bg-slate-50 dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                <img 
                  alt="Professional tools" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&auto=format&fit=crop&q=60" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Deliverables Section */}
        <section className="py-24 bg-white dark:bg-slate-900 rounded-[3rem] p-12 lg:p-20 shadow-sm border border-slate-100 dark:border-slate-800 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Deliver High-End <br/>Deliverables</h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">Your clients receive a premium property summary that makes your professional expertise stand out. Clear, icon-based metrics and high-res visuals.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 group hover:border-primary transition-all">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-primary group-hover:scale-110 transition-transform">
                    <Gauge size={20} />
                  </div>
                  <div className="font-bold text-slate-700 dark:text-slate-200">95% faster report generation</div>
                </div>
                <div className="flex items-center gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 group hover:border-emerald-500 transition-all">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-emerald-500 group-hover:scale-110 transition-transform">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="font-bold text-slate-700 dark:text-slate-200">Certified industry standards</div>
                </div>
              </div>
            </div>
            
            <div className="p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-700/50">
              {/* Property Summary Preview */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-6 hover:translate-y-[-4px] transition-transform">
                <img 
                  alt="Property thumbnail" 
                  className="w-full sm:w-32 h-32 rounded-xl object-cover" 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&auto=format&fit=crop&q=60" 
                />
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white">Lodha World View</h4>
                      <span className="text-primary font-black text-xl">₹1,25,000</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Unit 402 • Luxury Penthouse</p>
                  </div>
                  <div className="flex gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <Bed size={16} className="text-slate-300" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">3 Beds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath size={16} className="text-slate-300" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">2 Baths</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Maximize size={16} className="text-slate-300" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">1,200 sqft</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-slate-900 dark:bg-black rounded-[3rem] p-12 lg:p-20 text-white text-center relative overflow-hidden group">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_#2563eb,_transparent)] group-hover:scale-110 transition-transform duration-1000"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">Ready to upgrade your professional toolkit?</h2>
            <p className="text-lg opacity-80 font-medium">Join thousands of inspectors who have already modernized their workflow with Rentify. Start your 14-day free trial today.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button 
                size="lg"
                className="bg-primary text-white px-12 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all border-0"
                onClick={() => dispatch(openAuthModal('signup'))}
              >
                Join the Network
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/20 text-white px-12 py-4 rounded-2xl font-bold backdrop-blur-md hover:bg-white/20 transition-all"
              >
                Talk to Sales
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default InspectorLanding;
