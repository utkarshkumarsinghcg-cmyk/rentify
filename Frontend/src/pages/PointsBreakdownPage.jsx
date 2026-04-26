import React from 'react';
import PointsBreakdown from '../components/rewards/PointsBreakdown';

const PointsBreakdownPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Rewards Program</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Earn points for good behavior and redeem them for rent discounts or cash payouts.</p>
      </div>
      
      <div className="w-full flex justify-center">
        <PointsBreakdown />
      </div>
    </div>
  );
};

export default PointsBreakdownPage;
