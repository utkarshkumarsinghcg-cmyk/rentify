import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { openAuthModal } from '../store/slices/uiSlice';
import { fetchProperties } from '../store/slices/propertySlice';
import { Card, CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import { Search, Filter, MapPin, Bed, Bath, Move, ShieldCheck, Zap, Heart, Star, ChevronDown } from 'lucide-react';
import Skeleton from '../components/common/Skeleton';
import ListingDetailModal from '../components/property/ListingDetailModal';

const ListingPage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { listings, loading } = useSelector((state) => state.property);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const howItWorksRef = useRef(null);

  useEffect(() => {
    // 1. Fetch Data from Database via Redux
    dispatch(fetchProperties());

    // 2. Auth Check: If not logged in, show signup popup
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        dispatch(openAuthModal('signup'));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, dispatch]);

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredListings = listings.filter(l => 
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-surface dark:bg-slate-950 min-h-screen pb-20">
      <Helmet>
        <title>Browse Listings | Rentify</title>
        <meta name="description" content="Explore verified premium rental properties with Rentify." />
      </Helmet>

      {/* Hero / Search Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">Find Your Next Home</h1>
              <p className="text-slate-500 dark:text-slate-400">Discover verified properties with transparent pricing.</p>
            </div>
            <button 
              onClick={scrollToHowItWorks}
              className="flex items-center gap-2 text-primary font-bold hover:underline group"
            >
              How it works <ChevronDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>

          <div className="mt-10 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text"
                placeholder="Search by location, property name..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-14 px-8 rounded-2xl flex items-center gap-2 font-bold border-slate-200 dark:border-slate-700">
              <Filter size={20} /> Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 rounded-2xl w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((property) => (
              <Card key={property.id} className="group overflow-hidden rounded-2xl border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'} 
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {property.status === 'BOOKED' ? (
                      <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
                        Booked
                      </span>
                    ) : property.verified && (
                      <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
                        <ShieldCheck size={12} /> Verified
                      </span>
                    )}
                    <span className="bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
                      {property.type}
                    </span>
                  </div>
                  <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md flex items-center justify-center text-white transition-all">
                    <Heart size={20} />
                  </button>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-white/20">
                      <p className="text-primary font-black text-xl">₹{(property.rent || 0).toLocaleString('en-IN')}<span className="text-[10px] font-bold text-slate-500 uppercase"> /mo</span></p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{property.title}</h3>
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm mb-6">
                    <MapPin size={14} /> {property.address}
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col items-center gap-1">
                      <Bed size={16} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{property.bedrooms || 0} Beds</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Bath size={16} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{property.bathrooms || 0} Baths</span>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Button 
                      className="flex-1 font-bold rounded-xl h-12"
                      onClick={() => {
                        setSelectedProperty(property);
                        setIsDetailModalOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                    <Button variant="outline" className="px-4 rounded-xl border-slate-200 dark:border-slate-700 h-12">
                      <Zap size={18} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <ListingDetailModal 
          isOpen={isDetailModalOpen} 
          property={selectedProperty} 
          onClose={() => setIsDetailModalOpen(false)} 
        />

        {/* Empty State */}
        {!loading && filteredListings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-6">
              <Search size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No properties found</h3>
            <p className="text-slate-500 max-w-sm">Try adjusting your filters or search keywords to find what you're looking for.</p>
            <Button variant="outline" className="mt-8 px-8" onClick={() => setSearchQuery('')}>Clear Search</Button>
          </div>
        )}

        {/* How it Works Section */}
        <section ref={howItWorksRef} id="how-it-works" className="mt-32 pt-24 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center mb-16">
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Process</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">How it works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                step: '01', 
                title: 'Find Your Space', 
                desc: 'Browse through thousands of verified listings with immersive high-res photos and transparent fee structures.',
                icon: Search
              },
              { 
                step: '02', 
                title: 'Virtual & Instant', 
                desc: 'Book a virtual tour or an instant on-site viewing. Submit your background check and get approved in under 24 hours.',
                icon: Zap
              },
              { 
                step: '03', 
                title: 'Automated Comfort', 
                desc: 'Sign your digital lease, set up automated rent payments, and manage maintenance requests from your smartphone.',
                icon: ShieldCheck
              }
            ].map((item) => (
              <div key={item.step} className="group">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-6xl font-black text-slate-100 dark:text-slate-800 group-hover:text-primary/20 transition-colors">{item.step}</span>
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                    <item.icon size={24} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          
          {!isAuthenticated && (
            <div className="mt-20 bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/20">
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Ready to find your perfect home?</h2>
                <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">Join over 12,000 tenants who found their space with Rentify.</p>
                <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-slate-50 px-12 h-16 rounded-2xl font-black text-lg shadow-xl" onClick={() => dispatch(openAuthModal('signup'))}>
                  Get Started Today
                </Button>
              </div>
              {/* Abstract Background Shapes */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ListingPage;
