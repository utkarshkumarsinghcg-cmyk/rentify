import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';
import Button from './Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl p-10 max-w-lg text-center border border-red-100 dark:border-red-900/30">
             <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
               <AlertOctagon size={40} />
             </div>
             <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">System Interruption</h2>
             <p className="text-slate-500 font-medium mb-8">We encountered an unexpected error while loading this component. Our engineers have been notified.</p>
             <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-left overflow-hidden mb-8">
               <p className="text-xs font-mono text-slate-400 break-words">{this.state.error?.toString()}</p>
             </div>
             <Button onClick={() => window.location.reload()} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-0 py-4 rounded-xl font-black shadow-xl">
               <RefreshCw size={18} className="mr-2" /> Reload Application
             </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
