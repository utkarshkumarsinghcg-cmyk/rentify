import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openAuthModal } from '../store/slices/uiSlice';
import Button from '../components/common/Button';
import { 
  ShieldCheck, 
  ArrowRight, 
  Building, 
  Zap, 
  DollarSign, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize,
  CheckCircle,
  ChevronRight
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const RenterLanding = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    localStorage.setItem('rentify_user_role', 'tenant');
  }, []);

  return (
    <div className="bg-surface dark:bg-slate-950 font-inter antialiased min-h-screen flex flex-col">
      <Helmet>
        <title>Rentify | Find Your Perfect Home</title>
      </Helmet>

      <main className="max-w-7xl mx-auto px-6 py-12 flex-1">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center gap-12 mb-24 pt-12">
          <div className="flex-1 space-y-8 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">
              <ShieldCheck size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Secure & Verified</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-tight text-slate-900 dark:text-white tracking-tight">
              Find Your Perfect Home with <span className="text-primary">Confidence</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl font-medium">
              Experience a seamless rental journey with verified listings, instant bookings, and secure digital payments all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                onClick={() => navigate('/listings')}
              >
                Browse Listings
                <ArrowRight size={20} />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-4 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
              >
                View Demo
              </Button>
            </div>
          </div>

          <div className="flex-1 w-full animate-in slide-in-from-right duration-700">
            <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/3] shadow-2xl border border-slate-100 dark:border-slate-800 group">
              <img 
                alt="Modern cozy apartment" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60" 
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl flex items-center justify-between border border-white/20 dark:border-slate-700/50 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Building size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Premium Lofts</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Available in 12 Cities</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-primary">₹45,000</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">per month</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col gap-4 group">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">100% Verified</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Every listing on our platform goes through a rigorous 24-point background check to ensure authenticity.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col gap-4 group">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Instant Booking</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Found your dream home? Secure it instantly with our streamlined digital reservation system.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col gap-4 group">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <DollarSign size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Digital Payments</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Say goodbye to paper checks. Manage rent, deposits, and utilities through our secure payment portal.</p>
            </div>
          </div>
        </section>

        {/* Trending Section */}
        <section className="mb-24 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Trending Properties</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Handpicked selections based on verified reviews.</p>
            </div>
            <button 
              className="text-primary font-bold text-sm flex items-center gap-1 hover:underline group"
              onClick={() => navigate('/listings')}
            >
              View all 2,400+ homes
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Property Card 1 */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row group shadow-sm hover:shadow-2xl transition-all duration-500">
              <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden">
                <img 
                  alt="Luxury Loft" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop&q=60" 
                />
              </div>
              <div className="md:w-2/3 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">The Heritage Suite</h4>
                    <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase px-2 py-1 rounded">New</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-6">
                    <MapPin size={14} />
                    <span className="text-xs font-medium">Koramangala, Bengaluru</span>
                  </div>
                  <div className="flex gap-6 border-y border-slate-50 dark:border-slate-800 py-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Bed size={16} className="text-slate-300" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">2 Beds</span>
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
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">₹65,000<span className="text-xs font-normal text-slate-400">/mo</span></span>
                  <Button variant="outline" className="rounded-xl font-bold border-slate-200 dark:border-slate-800 hover:bg-primary hover:text-white hover:border-primary transition-all">
                    Details
                  </Button>
                </div>
              </div>
            </div>

            {/* Property Card 2 */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row group shadow-sm hover:shadow-2xl transition-all duration-500">
              <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden">
                <img 
                  alt="Cozy Apartment" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&auto=format&fit=crop&q=60" 
                />
              </div>
              <div className="md:w-2/3 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Sea View Residences</h4>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase px-2 py-1 rounded">Top Rated</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-6">
                    <MapPin size={14} />
                    <span className="text-xs font-medium">Worli, Mumbai</span>
                  </div>
                  <div className="flex gap-6 border-y border-slate-50 dark:border-slate-800 py-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Bed size={16} className="text-slate-300" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">1 Bed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath size={16} className="text-slate-300" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">1 Bath</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Maximize size={16} className="text-slate-300" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">850 sqft</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">₹1,20,000<span className="text-xs font-normal text-slate-400">/mo</span></span>
                  <Button variant="outline" className="rounded-xl font-bold border-slate-200 dark:border-slate-800 hover:bg-primary hover:text-white hover:border-primary transition-all">
                    Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="premium-gradient rounded-[3rem] p-12 lg:p-20 text-white flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl shadow-primary/20 relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
          
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight">Ready to move into your dream home?</h2>
            <p className="text-lg opacity-90 mb-10 font-medium">Join over 50,000 renters who found their perfect living space through Rentify's verified network.</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Button 
                size="lg"
                className="bg-white text-primary px-10 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all border-0"
                onClick={() => navigate('/listings')}
              >
                Explore Listings
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/30 text-white px-10 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all"
              >
                Contact Sales
              </Button>
            </div>
          </div>
          
          <div className="relative z-10 hidden lg:grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20 text-center shadow-xl">
              <p className="text-4xl font-black mb-1">100%</p>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Verified</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20 text-center shadow-xl">
              <p className="text-4xl font-black mb-1">Instant</p>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Approval</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RenterLanding;
