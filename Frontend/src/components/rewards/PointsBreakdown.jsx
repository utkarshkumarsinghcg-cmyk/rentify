import React, { useState } from 'react';
import { Card } from '../common/Card';
import { 
  CreditCard, Clock, CalendarCheck, UserPlus, Star, UserCheck,
  CheckCircle, Briefcase, Award, ShieldCheck, Zap
} from 'lucide-react';

export default function PointsBreakdown({ defaultTab = 'renter' }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [points, setPoints] = useState(1000);

  // Define actions for Renter
  const renterActions = [
    { id: 1, icon: CreditCard, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20', name: 'Rent payment on time', desc: 'per ₹1,000 paid', pts: 20, val: 2 },
    { id: 2, icon: Clock, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20', name: 'Early payment', desc: '3+ days before due', pts: 50, val: 5 },
    { id: 3, icon: CalendarCheck, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20', name: '6-month on-time streak', desc: 'continuous streak bonus', pts: 500, val: 50 },
    { id: 4, icon: UserPlus, color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20', name: 'Refer a new renter', desc: 'per successful referral', pts: 300, val: 30 },
    { id: 5, icon: Star, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20', name: 'Write a property review', desc: 'verified review', pts: 75, val: 7.5 },
    { id: 6, icon: UserCheck, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20', name: 'Complete KYC profile', desc: 'one-time bonus', pts: 150, val: 15 },
  ];

  // Define actions for Service Provider
  const serviceActions = [
    { id: 1, icon: Star, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20', name: '5-star rating received', desc: 'per review', pts: 100, val: 10 },
    { id: 2, icon: Star, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20', name: '4-star rating received', desc: 'per review', pts: 40, val: 4 },
    { id: 3, icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20', name: 'Job completed on time', desc: 'per job', pts: 30, val: 3 },
    { id: 4, icon: Briefcase, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20', name: 'Every 10 jobs milestone', desc: 'milestone bonus', pts: 250, val: 25 },
    { id: 5, icon: Award, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20', name: 'Monthly avg rating > 4.5', desc: 'per month', pts: 200, val: 20 },
    { id: 6, icon: ShieldCheck, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20', name: 'Zero cancellations', desc: 'in a calendar month', pts: 120, val: 12 },
  ];

  const currentActions = activeTab === 'renter' ? renterActions : serviceActions;
  const rupeeValue = (points * 0.10).toFixed(2);
  const metricNeeded = activeTab === 'renter' ? (points * 50).toLocaleString() : Math.ceil(points / 100);

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 transition-all duration-500">
      {/* Header & Tabs */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="text-amber-500" />
              Points Breakdown
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">1 Point = ₹0.10 • Min 100 pts to redeem • Valid 12 mos</p>
          </div>
          
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button 
              onClick={() => setActiveTab('renter')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'renter' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Renter
            </button>
            <button 
              onClick={() => setActiveTab('service')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'service' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Service Provider
            </button>
          </div>
        </div>
      </div>

      {/* List of Actions */}
      <div className="p-6 bg-slate-50/50 dark:bg-slate-800/20">
        <div className="space-y-3">
          {currentActions.map((action) => (
            <div key={action.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-900 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${action.color}`}>
                  <action.icon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{action.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{action.desc}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-black text-lg ${activeTab === 'renter' ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  +{action.pts} pts
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  = ₹{action.val}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Calculator */}
      <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6">Reward Calculator</h3>
        
        <div className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{points.toLocaleString()} <span className="text-lg font-bold text-slate-400">pts</span></span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">Slide to calculate</span>
          </div>
          <input 
            type="range" 
            min="100" 
            max="10000" 
            step="100" 
            value={points} 
            onChange={(e) => setPoints(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs font-bold text-slate-400 mt-2">
            <span>100</span>
            <span>10,000</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-2xl border ${activeTab === 'renter' ? 'bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30' : 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30'}`}>
            <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${activeTab === 'renter' ? 'text-blue-500' : 'text-emerald-500'}`}>Rupee Value</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">₹{rupeeValue}</div>
          </div>
          <div className="p-4 rounded-2xl border bg-slate-50 border-slate-100 dark:bg-slate-800/50 dark:border-slate-700">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              {activeTab === 'renter' ? 'Rent Needed' : '5-Star Reviews Needed'}
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {activeTab === 'renter' ? `₹${metricNeeded}` : metricNeeded}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
