import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, SlidersHorizontal, MapPin, Bed, Bath, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';
import { Card } from '../components/common/Card';

const propertiesData = [
  { id: 1, name: "Oberoi Splendour", location: "Andheri East, Mumbai", price: 55000, beds: 3, baths: 3, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&auto=format&fit=crop", desc: "Luxury residence with world-class amenities and premium finishings in Mumbai's heart." },
  { id: 2, name: "Prestige Lake Ridge", location: "Whitefield, Bengaluru", price: 38000, beds: 2, baths: 2, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=250&auto=format&fit=crop", desc: "Modern flat in tech-hub area with landscape views and excellent connectivity." },
  { id: 3, name: "DLF Capital Greens", location: "Moti Nagar, New Delhi", price: 42000, beds: 3, baths: 2, image: "https://images.unsplash.com/photo-1502672260266-1c1e54823861?w=400&h=250&auto=format&fit=crop", desc: "Spacious apartment in a green complex with gated security and sports facilities." },
  { id: 4, name: "Lodha World One", location: "Worli, Mumbai", price: 125000, beds: 4, baths: 4, image: "https://images.unsplash.com/photo-1493246507139-91e8bef99c17?w=400&h=250&auto=format&fit=crop", desc: "Ultra-luxury skyscraper living with iconic sea-link views and concierge services." },
  { id: 5, name: "Godrej Prime", location: "Chembur, Mumbai", price: 45000, beds: 2, baths: 2, image: "https://images.unsplash.com/photo-1536376074432-bf12177d4f4f?w=400&h=250&auto=format&fit=crop", desc: "Well-ventilated apartment with modern smart-home features and clubhouse access." },
  { id: 6, name: "Brigade Meadows", location: "Kanakapura, Bengaluru", price: 28000, beds: 2, baths: 1, image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=250&auto=format&fit=crop", desc: "Eco-friendly living with organic gardens and open spaces away from city noise." },
];

const PropertiesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [bedFilter, setBedFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [sortOption, setSortOption] = useState('Newest');
  
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const filteredProperties = propertiesData.filter(p => {
    // Search
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase()) && !p.location.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    // Beds
    if (bedFilter === '1 Bed' && p.beds !== 1) return false;
    if (bedFilter === '2 Beds' && p.beds !== 2) return false;
    if (bedFilter === '3 Beds' && p.beds !== 3) return false;
    
    // Price
    if (priceFilter === 'Under ₹30,000' && p.price >= 30000) return false;
    if (priceFilter === '₹30,000–₹60,000' && (p.price < 30000 || p.price > 60000)) return false;
    if (priceFilter === '₹60,000+' && p.price <= 60000) return false;
    
    return true;
  }).sort((a, b) => {
    if (sortOption === 'Price Low–High') return a.price - b.price;
    if (sortOption === 'Price High–Low') return b.price - a.price;
    return 0; // Newest (default order for now)
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-full shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">All Properties</h1>
          </div>
          
          <div className="relative w-full md:w-96 shadow-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-white font-medium"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          
          {/* Bed Tabs */}
          <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 hide-scrollbar">
            {['All', '1 Bed', '2 Beds', '3 Beds'].map(tab => (
              <button
                key={tab}
                onClick={() => setBedFilter(tab)}
                className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-colors ${bedFilter === tab ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Price Dropdown */}
            <div className="relative flex-1 sm:flex-none">
              <select 
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full sm:w-48 appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-primary outline-none cursor-pointer"
              >
                <option value="All">Any Price</option>
                <option value="Under ₹30,000">Under ₹30,000</option>
                <option value="₹30,000–₹60,000">₹30,000–₹60,000</option>
                <option value="₹60,000+">₹60,000+</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex-1 sm:flex-none flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-slate-400 hidden sm:block" />
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full sm:w-48 appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-primary outline-none cursor-pointer"
              >
                <option value="Newest">Sort: Newest</option>
                <option value="Price Low–High">Price: Low–High</option>
                <option value="Price High–Low">Price: High–Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProperties.map(property => (
              <Card key={property.id} className="bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group flex flex-col h-full">
                <div className="h-56 overflow-hidden relative">
                  <img 
                    src={property.image} 
                    alt={property.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black px-3 py-1.5 rounded-lg shadow-lg">
                    ₹{property.price.toLocaleString('en-IN')}<span className="text-xs text-slate-500 font-bold">/mo</span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">{property.name}</h3>
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-1">
                      <MapPin size={14} className="text-primary" /> {property.location}
                    </p>
                  </div>
                  
                  <div className="flex gap-3 mb-4 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md flex items-center gap-1.5">
                      <Bed size={14} /> {property.beds} {property.beds === 1 ? 'Bed' : 'Beds'}
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md flex items-center gap-1.5">
                      <Bath size={14} /> {property.baths} {property.baths === 1 ? 'Bath' : 'Baths'}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-2">
                    {property.desc}
                  </p>
                  
                  <div className="mt-auto">
                    <Button 
                      onClick={() => { setSelectedProperty(property); setIsPropertyModalOpen(true); }}
                      variant="outline" 
                      className="w-full border-blue-200 dark:border-blue-900 text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 font-bold py-2.5"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No properties found</h3>
            <p className="text-slate-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>

      {/* Property Detail Modal */}
      {isPropertyModalOpen && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={() => setIsPropertyModalOpen(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="relative h-56">
              <img src={selectedProperty.image} className="w-full h-full object-cover" alt="Property" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              <button onClick={() => setIsPropertyModalOpen(false)} className="absolute top-4 right-4 bg-black/40 text-white p-1.5 rounded-full hover:bg-black/60 transition-colors"><X size={20} /></button>
              
              <div className="absolute bottom-4 left-6">
                <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">Available</span>
                <h2 className="text-2xl font-black text-white">{selectedProperty.name}</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-end mb-4">
                <p className="text-sm font-medium text-slate-500 flex items-center gap-1">
                  <MapPin size={14} className="text-primary" /> {selectedProperty.location}
                </p>
                <div className="text-2xl font-black text-primary">₹{selectedProperty.price.toLocaleString('en-IN')}<span className="text-sm text-slate-500 font-bold">/mo</span></div>
              </div>
              <div className="flex gap-4 mb-6 text-sm font-bold text-slate-700 dark:text-slate-300">
                <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5"><Bed size={14} /> {selectedProperty.beds} {selectedProperty.beds === 1 ? 'Bed' : 'Beds'}</span>
                <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5"><Bath size={14} /> {selectedProperty.baths} {selectedProperty.baths === 1 ? 'Bath' : 'Baths'}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                {selectedProperty.desc} This property offers the perfect blend of modern convenience and comfort. Schedule a tour today to see it for yourself!
              </p>
              <Button 
                onClick={() => {
                  toast.success("Tour Requested! We'll contact you soon ✓", {
                    style: { borderRadius: '10px', background: '#333', color: '#fff' }
                  });
                  setIsPropertyModalOpen(false);
                }} 
                className="w-full bg-primary text-white border-0 shadow-lg shadow-primary/20 py-3.5 rounded-xl font-bold hover:bg-blue-700"
              >
                Request Tour
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertiesPage;
