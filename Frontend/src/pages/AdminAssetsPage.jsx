import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Building, MapPin } from 'lucide-react';
import { Card } from '../components/common/Card';
import Button from '../components/common/Button';

const AdminAssetsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm hover:bg-slate-50 border border-slate-100 dark:border-slate-800"><ArrowLeft size={20}/></button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Global Assets</h1>
          <p className="text-slate-500 text-sm">Manage all properties in the Rentify ecosystem.</p>
        </div>
      </div>
      <Card className="bg-white dark:bg-slate-900 rounded-2xl p-20 flex flex-col items-center justify-center text-center border-slate-100 dark:border-slate-800">
        <Building size={64} className="text-slate-200 mb-6" />
        <h3 className="text-2xl font-black mb-2">Asset Directory</h3>
        <p className="text-slate-500 mb-6 max-w-md">The property listings table is currently syncing with global databases. Check back later.</p>
        <Button onClick={() => navigate(-1)} className="bg-primary text-white border-0">Return to Dashboard</Button>
      </Card>
    </div>
  );
};

export default AdminAssetsPage;
