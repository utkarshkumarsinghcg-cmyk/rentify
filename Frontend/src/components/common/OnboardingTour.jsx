import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from './Button';
import { X, ChevronRight, CheckCircle } from 'lucide-react';

const OnboardingTour = () => {
  const { isAuthenticated, user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isAuthenticated) {
      const hasSeenTour = localStorage.getItem(`rentify_tour_seen_${user?.id || 'guest'}`);
      if (!hasSeenTour) {
        // slight delay to let the dashboard render
        setTimeout(() => setIsVisible(true), 1500);
      }
    }
  }, [isAuthenticated, user]);

  const handleFinish = () => {
    localStorage.setItem(`rentify_tour_seen_${user?.id || 'guest'}`, 'true');
    setIsVisible(false);
  };

  const skipTour = () => {
    handleFinish();
  };

  if (!isVisible) return null;

  const steps = [
    { title: "Welcome to Rentify", desc: "Your premium property management dashboard. Here are your key metrics." },
    { title: "Your Active Rentals", desc: "View your active rentals, leases, and overall occupancy statistics." },
    { title: "Instant Payments", desc: "Quick Pay your rent or collect funds instantly via our secure payment gateway." },
    { title: "Maintenance Tracking", desc: "Submit, track, and manage all your maintenance requests in real-time." }
  ];

  return (
    <div className="fixed inset-0 z-[300] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2rem] p-10 shadow-2xl relative animate-in zoom-in-95">
         <button onClick={skipTour} className="absolute top-6 right-6 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition-colors"><X size={20}/></button>
         
         <div className="flex gap-2 mb-8">
           {steps.map((_, i) => (
             <div key={i} className={`h-1.5 flex-1 rounded-full ${i + 1 <= step ? 'bg-primary' : 'bg-slate-100 dark:bg-slate-800'}`}></div>
           ))}
         </div>

         <div className="text-center py-8">
           <h2 className="text-2xl font-black mb-4">{steps[step - 1].title}</h2>
           <p className="text-slate-500 font-medium leading-relaxed px-4">{steps[step - 1].desc}</p>
         </div>

         <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
           <button onClick={skipTour} className="text-xs font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white uppercase tracking-widest">Skip Tour</button>
           
           {step < steps.length ? (
             <Button onClick={() => setStep(step + 1)} className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-0 rounded-xl px-6">
               Next <ChevronRight size={16} className="ml-2" />
             </Button>
           ) : (
             <Button onClick={handleFinish} className="bg-primary text-white border-0 rounded-xl px-6 shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
               Get Started <CheckCircle size={16} className="ml-2" />
             </Button>
           )}
         </div>
      </div>
    </div>
  );
};

export default OnboardingTour;
