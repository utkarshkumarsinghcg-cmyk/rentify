import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, MapPin, Droplets, Zap, Palette, Wrench, ChevronDown, CheckCircle } from 'lucide-react';
import { Card } from '../components/common/Card';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const initialJobs = [
  { id: 'SR-8821', type: 'Pipe Burst Repair', icon: Droplets, iconColor: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20', property: 'Skyline Apartments, Unit 4B', urgency: 'Emergency', urgencyColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', estimate: '$450 - $600', status: 'Available' },
  { id: 'SR-8845', type: 'Outlets Inspection', icon: Zap, iconColor: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20', property: 'Greenwood Estates', urgency: 'Standard', urgencyColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', estimate: '$120 - $180', status: 'Available' },
  { id: 'SR-8902', type: 'Living Room Repaint', icon: Palette, iconColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20', property: 'Oak Ridge Heights', urgency: 'Standard', urgencyColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', estimate: '$800 - $1,100', status: 'Available' },
  { id: 'SR-8922', type: 'HVAC Maintenance', icon: Wrench, iconColor: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20', property: 'Riverside Towers', urgency: 'Completed', urgencyColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', estimate: '$320.00', status: 'Completed' },
  { id: 'SR-8924', type: 'Emergency Plumbing', icon: Droplets, iconColor: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20', property: 'Downtown Lofts', urgency: 'Emergency', urgencyColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', estimate: '$550 - $700', status: 'Available' }
];

const ServiceRequestsPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(initialJobs);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All'); // All, Emergency, Standard, Completed

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.type.toLowerCase().includes(searchQuery.toLowerCase()) || job.property.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    
    if (filter === 'Emergency') return job.urgency === 'Emergency';
    if (filter === 'Standard') return job.urgency === 'Standard';
    if (filter === 'Completed') return job.status === 'Completed';
    return true;
  });

  const handleAcceptJob = (id) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status: 'Accepted' } : j));
    toast.success('Job Accepted! Added to your schedule ✓', { style: { background: '#333', color: '#fff', borderRadius: '10px' }});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm hover:bg-slate-50 transition-colors border border-slate-100 dark:border-slate-800">
            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">All Service Requests</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Browse and accept available maintenance jobs.</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border-slate-100 dark:border-slate-800 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by job type or property name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary text-sm transition-colors dark:text-white"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {['All', 'Emergency', 'Standard', 'Completed'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${filter === f ? 'bg-primary text-white border-primary' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Job List */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? filteredJobs.map(job => (
          <Card key={job.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border-slate-100 dark:border-slate-800 hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group">
            <div className="flex gap-4 items-center">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${job.iconColor}`}>
                <job.icon size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-black text-lg text-slate-900 dark:text-white">{job.type}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${job.urgencyColor}`}>{job.urgency}</span>
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1">
                  <MapPin size={14}/> {job.property}
                </div>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(job.property)}`, '_blank')}
                  className="flex items-center gap-1 text-primary text-xs font-black uppercase tracking-widest hover:underline mt-2 opacity-0 group-hover:opacity-100 transition-opacity w-fit"
                >
                  <MapPin size={12} className="group-hover:translate-y-[-1px] transition-transform" /> Get Directions
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between w-full md:w-auto gap-6 border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
              <div className="text-left md:text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Est. Payout</div>
                <div className="font-black text-lg text-slate-900 dark:text-white">{job.estimate}</div>
              </div>
              <div>
                {job.status === 'Accepted' ? (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2.5 rounded-xl w-fit border border-emerald-100 dark:border-emerald-900/30">
                    <CheckCircle size={16} /> Accepted ✓
                  </span>
                ) : job.status === 'Completed' ? (
                  <span className="flex items-center gap-1 text-slate-400 font-bold text-sm px-4 py-2.5 w-fit uppercase tracking-widest">
                    <CheckCircle size={16} /> Completed
                  </span>
                ) : (
                  <Button onClick={() => handleAcceptJob(job.id)} className="bg-primary text-white border-0 px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Accept Job
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )) : (
          <div className="py-20 text-center text-slate-500 font-medium bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            No service requests found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceRequestsPage;
