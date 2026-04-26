import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center animate-in zoom-in-95 duration-700">
      <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-8 text-slate-400 shadow-inner">
        <AlertTriangle size={48} />
      </div>
      <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">404</h1>
      <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-400 mb-6">Page Not Found</h2>
      <p className="text-slate-500 max-w-md mx-auto font-medium mb-10">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <Button onClick={() => navigate('/')} className="bg-primary text-white border-0 px-8 py-4 rounded-xl font-black shadow-xl shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2">
        <Home size={18} /> Return to Homepage
      </Button>
    </div>
  );
};

export default NotFound;
