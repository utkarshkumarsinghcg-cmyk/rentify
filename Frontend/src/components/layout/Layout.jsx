import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

import SurveyRequestModal from '../property/SurveyRequestModal';
import SettingsModal from '../common/SettingsModal';
import ReceiptModal from '../payment/ReceiptModal';
import AIAssistant from '../common/AIAssistant';
import OnboardingTour from '../common/OnboardingTour';
import { ArrowUp } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { closeSurveyModal, closeSettingsModal, closeReceiptModal } from '../../store/slices/uiSlice';

const Layout = () => {
  const dispatch = useDispatch();
  const { isSurveyModalOpen, isReceiptModalOpen, selectedPayment } = useSelector((state) => state.ui);
  const [showScroll, setShowScroll] = React.useState(false);

  React.useEffect(() => {
    const checkScroll = () => {
      if (!showScroll && window.pageYOffset > 300) setShowScroll(true);
      else if (showScroll && window.pageYOffset <= 300) setShowScroll(false);
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, [showScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="min-h-screen bg-surface dark:bg-slate-950 flex flex-col">
      <Navbar />
      <SurveyRequestModal 
        isOpen={isSurveyModalOpen} 
        onClose={() => dispatch(closeSurveyModal())} 
      />
      <SettingsModal />
      <ReceiptModal 
        isOpen={isReceiptModalOpen} 
        payment={selectedPayment}
        onClose={() => dispatch(closeReceiptModal())} 
      />
      <main className="flex-1 mt-14 flex flex-col relative z-0">
        <Outlet />
      </main>
      <AIAssistant />
      <OnboardingTour />
      
      {showScroll && (
        <button 
          onClick={scrollToTop} 
          className="fixed bottom-24 right-6 w-11 h-11 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full shadow-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary dark:hover:bg-primary dark:hover:border-primary dark:hover:text-white transition-all duration-200 z-40 animate-in fade-in slide-in-from-bottom-4"
        >
          <ArrowUp size={18} />
        </button>
      )}

      <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 w-full py-12 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-8">
          <div className="flex flex-col gap-2 items-center md:items-start">
            <div className="font-bold text-slate-900 dark:text-white text-xl">Rentify</div>
            <p className="font-sans text-xs text-slate-500 dark:text-slate-400">© 2026 Rentify. Professional Property Management.</p>
          </div>
          <div className="flex gap-8 font-sans text-xs text-slate-500 dark:text-slate-400">
            <a className="hover:text-blue-600 transition-opacity underline underline-offset-4" href="#">Privacy Policy</a>
            <a className="hover:text-blue-600 transition-opacity underline underline-offset-4" href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
