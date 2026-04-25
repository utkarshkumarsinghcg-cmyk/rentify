import React from 'react';
import { MapPin, Bed, Bath, Square, Heart, Sparkles } from 'lucide-react';

const PropertyCard = ({ property, isAiMatch }) => {
    return (
        <div className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden">
                <img 
                    src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80'} 
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-900 dark:text-white text-xs font-bold rounded-full shadow-sm">
                        {property.type.toUpperCase()}
                    </span>
                    {isAiMatch && (
                        <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                            <Sparkles size={12} />
                            {property.matchScore}% Match
                        </span>
                    )}
                </div>

                <button className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full text-slate-400 hover:text-rose-500 transition-colors shadow-sm">
                    <Heart size={18} />
                </button>

                <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-2xl font-bold">${property.price.toLocaleString()}<span className="text-sm font-normal opacity-80">/mo</span></p>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{property.title}</h3>
                <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-4">
                    <MapPin size={14} className="mr-1" />
                    <span className="line-clamp-1">{property.location.address}, {property.location.city}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-t border-slate-50 dark:border-slate-800">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center text-slate-900 dark:text-white font-semibold">
                            <Bed size={16} className="mr-1 text-indigo-500" />
                            {property.bedrooms}
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Beds</span>
                    </div>
                    <div className="flex flex-col items-center border-x border-slate-50 dark:border-slate-800">
                        <div className="flex items-center text-slate-900 dark:text-white font-semibold">
                            <Bath size={16} className="mr-1 text-indigo-500" />
                            {property.bathrooms}
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Baths</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center text-slate-900 dark:text-white font-semibold">
                            <Square size={16} className="mr-1 text-indigo-500" />
                            {property.area}
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Sq Ft</span>
                    </div>
                </div>

                <button className="w-full mt-4 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 text-slate-900 dark:text-white hover:text-white font-bold rounded-2xl transition-all duration-300 transform active:scale-95">
                    View Details
                </button>
            </div>
        </div>
    );
};

export default PropertyCard;
