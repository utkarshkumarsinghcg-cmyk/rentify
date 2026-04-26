import React, { useEffect } from 'react';
import { X, Star, Phone, Building, Calendar, Wrench, User } from 'lucide-react';
import Button from '../common/Button';

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={star <= Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600'}
        />
      ))}
      <span className="ml-1 text-sm font-bold text-slate-700 dark:text-slate-300">{rating}</span>
    </div>
  );
};

const MaintenanceDetailModal = ({ isOpen, request, onClose }) => {
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

  if (!isOpen || !request) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const staff = request.assignedStaff;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      {/* Modal */}
      <div 
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
              <Wrench size={20} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Request Details</h2>
              <p className="text-xs text-slate-500">Maintenance ticket info</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Issue Info */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Issue Details</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Wrench size={16} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Issue</p>
                  <p className="font-bold text-slate-900 dark:text-white">{request.issue}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building size={16} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Property</p>
                  <p className="font-bold text-slate-900 dark:text-white">{request.propertyTitle}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Reported On</p>
                  <p className="font-bold text-slate-900 dark:text-white">{request.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  request.status === 'pending'
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {request.status}
                </span>
              </div>
            </div>
          </section>

          {/* Assigned Staff */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Staff</h3>
            {staff ? (
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 space-y-4 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{staff.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Maintenance Technician</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <Star size={12} /> Rating
                    </p>
                    <StarRating rating={staff.rating} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <Phone size={12} /> Contact
                    </p>
                    <a
                      href={`tel:${staff.phone}`}
                      className="font-bold text-primary hover:underline text-sm"
                    >
                      {staff.phone}
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 text-center border border-dashed border-slate-200 dark:border-slate-700">
                <User size={24} className="text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No staff assigned yet</p>
                <p className="text-xs text-slate-400 mt-1">Our team will assign a technician shortly.</p>
              </div>
            )}
          </section>
        </div>

        <div className="px-6 pb-6">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDetailModal;
