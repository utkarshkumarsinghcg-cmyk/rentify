import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { X, User, Bell, Shield, CreditCard, LogOut } from 'lucide-react';
import { closeSettingsModal } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import Button from './Button';
import Input from './Input';
import { Card, CardContent } from './Card';
import { toast } from 'react-toastify';

const SettingsModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSettingsModalOpen } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  if (!isSettingsModalOpen) return null;

  const handleClose = () => dispatch(closeSettingsModal());
  
  const handleSave = () => {
    toast.success('Settings updated successfully!');
    handleClose();
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(closeSettingsModal());
    navigate('/');
    toast.info('Logged out successfully');
  };

  return (
    <div 
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div 
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <User size={20} className="text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Account Settings</h2>
              <p className="text-xs text-slate-500">Manage your profile and preferences</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Profile Section */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <User size={14} /> Profile Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Full Name" defaultValue={user?.name || ''} placeholder="John Doe" />
              <Input label="Email Address" defaultValue={user?.email || ''} placeholder="john@example.com" disabled />
            </div>
            <Input label="Phone Number" defaultValue="(555) 000-0000" placeholder="+1 (555) 000-0000" />
          </section>

          {/* Preferences */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Bell size={14} /> Notifications
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Notifications</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded border-slate-300" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">SMS Alerts</span>
                <input type="checkbox" className="w-4 h-4 text-primary rounded border-slate-300" />
              </label>
            </div>
          </section>

          {/* Payment Info (Conditional for Owner) */}
          {user?.role === 'owner' && (
            <section className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <CreditCard size={14} /> Payout Method
              </h3>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                    <CreditCard size={18} className="text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Chase Checking •••• 4321</p>
                    <p className="text-xs text-slate-500">Last payout: Oct 12, 2026</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">Edit</Button>
              </div>
            </section>
          )}

          {/* Security */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Shield size={14} /> Security
            </h3>
            <Button variant="outline" size="sm" className="w-full md:w-auto">Change Password</Button>
          </section>

          {/* Danger Zone */}
          <section className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-red-500">Danger Zone</h3>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                className="text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-2" /> Log Out
              </Button>
              <Button variant="ghost" className="text-slate-400 hover:text-red-600 text-xs">Delete Account</Button>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
