import React, { useEffect } from 'react';
import { X, Download, Printer, ShieldCheck, Building, User, Calendar, DollarSign } from 'lucide-react';
import Button from '../common/Button';
import { toast } from 'react-toastify';

const ReceiptModal = ({ isOpen, payment, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !payment) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      <div 
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Official Receipt</span>
          </div>
          <h2 className="text-3xl font-black mb-1">Rentify</h2>
          <p className="text-sm opacity-80">Transaction ID: #SR-{Math.floor(Math.random() * 1000000)}</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Summary */}
          <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-800 pb-6">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Amount</p>
              <p className="text-4xl font-black text-slate-900 dark:text-white">{payment.amount}</p>
            </div>
            <div className="text-right">
              <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {payment.status}
              </span>
              <p className="text-xs text-slate-500 mt-2">{payment.date}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Building size={10} /> Property
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{payment.propertyTitle}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <User size={10} /> {payment.tenant ? 'Tenant' : 'Owner'}
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{payment.tenant || 'John Doe'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Calendar size={10} /> Billing Cycle
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{payment.date.split(' ')[0]} 2026</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <DollarSign size={10} /> Payment Method
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Bank Transfer •••• 4321</p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This is a computer-generated document. No signature is required. For any queries, contact support@rentify.com
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              className="flex-1 flex items-center justify-center gap-2 font-bold h-12"
              onClick={() => window.print()}
            >
              <Printer size={16} /> Print
            </Button>
            <Button 
              variant="primary" 
              className="flex-1 flex items-center justify-center gap-2 font-bold h-12 shadow-lg shadow-primary/20"
              onClick={() => toast.success('Downloading receipt...')}
            >
              <Download size={16} /> Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
