import React, { useEffect } from 'react';
import { X, MapPin, Bed, Bath, Move, ShieldCheck, Star } from 'lucide-react';
import Button from '../common/Button';
import ContactForm from '../common/ContactForm';

const ListingDetailModal = ({ isOpen, property, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !property) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300 custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white shadow-xl transition-all"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left: Image & Quick Stats */}
          <div className="p-8 lg:p-12 border-r border-slate-100 dark:border-slate-800">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-8 shadow-2xl">
              <img src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'} alt={property.title} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{property.title}</h2>
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                  <MapPin size={16} className="text-primary" /> {property.address}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-primary">₹{(property.rent || 0).toLocaleString('en-IN')}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">per month</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700">
              <div className="flex flex-col items-center gap-2">
                <Bed size={20} className="text-primary" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">{property.bedrooms || 0} Beds</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Bath size={20} className="text-primary" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">{property.bathrooms || 0} Baths</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Move size={20} className="text-primary" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">{property.type}</span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                <ShieldCheck size={20} className="text-emerald-500" />
                <div>
                  <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Verified Listing</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">This property has been physically inspected by our team.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form & Details */}
          <div className="p-8 lg:p-12 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Contact Agent</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Fill in your details below and the property manager will reach out to you within 24 hours.</p>
              <ContactForm propertyTitle={property.title} />
            </div>

            <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Star size={16} className="text-amber-400 fill-amber-400" /> Property Amenities
              </h4>
              <div className="flex flex-wrap gap-2">
                {(property.amenities || []).map((tag) => (
                  <span key={tag} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailModal;
