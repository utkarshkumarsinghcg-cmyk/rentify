import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropertyCard from '../components/property/PropertyCard';
import { Search, SlidersHorizontal, Sparkles, Loader2 } from 'lucide-react';

const ListingPage = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [aiMode, setAiMode] = useState(false);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/properties');
            setProperties(response.data.data.properties);
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAISearch = async (e) => {
        e.preventDefault();
        setAiLoading(true);
        setAiMode(true);
        try {
            // Mock AI search logic
            const response = await axios.post('http://localhost:5000/api/properties/ai-recommendations', {
                preferences: { city: searchQuery }
            });
            setProperties(response.data.data.recommendations);
        } catch (error) {
            console.error('AI Search failed:', error);
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                            Discover Your Perfect Home
                            <Sparkles className="text-indigo-600 animate-pulse" size={32} />
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Browse through our curated list of smart properties</p>
                    </div>

                    {/* Search Bar */}
                    <div className="w-full md:w-1/2">
                        <form onSubmit={handleAISearch} className="relative group">
                            <input 
                                type="text"
                                placeholder={aiMode ? "Try '3 bedroom in New York under $3000'..." : "Search by city, address or zip..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-32 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <button 
                                type="submit"
                                className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2"
                            >
                                {aiLoading ? <Loader2 className="animate-spin" size={18} /> : 'AI Search'}
                            </button>
                        </form>
                        <div className="flex items-center gap-4 mt-3 ml-2">
                            <button className="flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                                <SlidersHorizontal size={14} className="mr-2" />
                                Advanced Filters
                            </button>
                            {aiMode && (
                                <button 
                                    onClick={() => { setAiMode(false); fetchProperties(); setSearchQuery(''); }}
                                    className="text-sm font-bold text-indigo-600 hover:underline"
                                >
                                    Clear AI Results
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="h-[450px] bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
                        ))}
                    </div>
                ) : properties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {properties.map((property) => (
                            <PropertyCard key={property._id} property={property} isAiMatch={aiMode} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400 mb-6">
                            <Search size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">No properties found</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your filters or search terms</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListingPage;
