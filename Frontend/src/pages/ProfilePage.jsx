import React, { useState, useRef } from 'react';
import { Card } from '../components/common/Card';
import Button from '../components/common/Button';
import { User, Shield, Settings as SettingsIcon, Link as LinkIcon, AlertTriangle, Upload, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const ProfilePage = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('Personal');
  const [avatar, setAvatar] = useState(`https://i.pravatar.cc/150?u=${user?.id || 'guest'}`);
  const [formData, setFormData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: '+91 98765 43210',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: true,
    language: 'en-IN',
    timezone: 'Asia/Kolkata',
    emailNotif: true,
    smsNotif: false,
    pushNotif: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setAvatar(reader.result); toast.success('Avatar updated ✓'); };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (section) => {
    toast.success(`${section} updated successfully ✓`);
  };

  const tabs = [
    { name: 'Personal', icon: User },
    { name: 'Security', icon: Shield },
    { name: 'Preferences', icon: SettingsIcon },
    { name: 'Linked Accounts', icon: LinkIcon },
    { name: 'Danger Zone', icon: AlertTriangle }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-in fade-in duration-700 w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Account Settings</h1>
        <p className="text-slate-500 font-medium">Manage your personal profile, security preferences, and connected services.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-2">
          {tabs.map(t => (
            <button 
              key={t.name}
              onClick={() => setActiveTab(t.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === t.name ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <t.icon size={18} /> {t.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          <Card className="bg-white dark:bg-slate-900 border-0 shadow-2xl rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
             
             {activeTab === 'Personal' && (
               <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                 <h3 className="font-black text-2xl">Personal Information</h3>
                 <div className="flex items-center gap-6">
                   <div className="relative group">
                     <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-[1.5rem] object-cover shadow-lg" />
                     <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-slate-900/50 rounded-[1.5rem] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                       <Upload size={20} />
                       <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Upload</span>
                     </button>
                     <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Profile Picture</p>
                     <p className="text-sm font-medium text-slate-500">JPG, GIF or PNG. Max size of 800K</p>
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                     <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl p-4 outline-none font-medium focus:ring-2 focus:ring-primary/20" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                     <input name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl p-4 outline-none font-medium focus:ring-2 focus:ring-primary/20" />
                   </div>
                   <div className="space-y-2 md:col-span-2">
                     <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                     <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl p-4 outline-none font-medium focus:ring-2 focus:ring-primary/20" />
                   </div>
                 </div>
                 <Button onClick={() => handleSave('Personal Info')} className="bg-primary text-white border-0 px-8 py-4 rounded-2xl shadow-xl font-black mt-4">Save Changes</Button>
               </div>
             )}

             {activeTab === 'Security' && (
               <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                 <h3 className="font-black text-2xl">Security</h3>
                 <div className="space-y-4">
                   <h4 className="font-bold text-sm text-slate-400 uppercase tracking-widest">Change Password</h4>
                   <input type="password" placeholder="Current Password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl p-4 outline-none font-medium focus:ring-2 focus:ring-primary/20" />
                   <input type="password" placeholder="New Password" name="newPassword" value={formData.newPassword} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl p-4 outline-none font-medium focus:ring-2 focus:ring-primary/20" />
                   <input type="password" placeholder="Confirm New Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl p-4 outline-none font-medium focus:ring-2 focus:ring-primary/20" />
                   <Button onClick={() => handleSave('Password')} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-0 px-8 py-3 rounded-xl font-black">Update Password</Button>
                 </div>
                 <hr className="border-slate-100 dark:border-slate-800" />
                 <div className="flex justify-between items-center">
                   <div>
                     <h4 className="font-bold">Two-Factor Authentication</h4>
                     <p className="text-sm text-slate-500 mt-1">Add an extra layer of security to your account.</p>
                   </div>
                   <input type="checkbox" name="twoFactor" checked={formData.twoFactor} onChange={handleChange} className="toggle accent-primary w-12 h-6" />
                 </div>
               </div>
             )}

             {activeTab === 'Preferences' && (
               <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                 <h3 className="font-black text-2xl">Preferences</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Language</label>
                     <select name="language" value={formData.language} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl p-4 outline-none font-bold focus:ring-2 focus:ring-primary/20">
                        <option value="en-IN">English (India)</option><option value="hi">Hindi</option><option value="mr">Marathi</option>
                     </select>
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Timezone</label>
                     <select name="timezone" value={formData.timezone} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl p-4 outline-none font-bold focus:ring-2 focus:ring-primary/20">
                        <option value="Asia/Kolkata">India Standard Time (IST)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Asia/Dubai">Dubai (GST)</option>
                     </select>
                   </div>
                 </div>
                 <hr className="border-slate-100 dark:border-slate-800" />
                 <div className="space-y-4">
                   <h4 className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-4">Notification Settings</h4>
                   <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl"><span className="font-bold text-sm">Email Notifications</span> <input type="checkbox" name="emailNotif" checked={formData.emailNotif} onChange={handleChange} className="accent-primary w-5 h-5" /></div>
                   <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl"><span className="font-bold text-sm">SMS Alerts</span> <input type="checkbox" name="smsNotif" checked={formData.smsNotif} onChange={handleChange} className="accent-primary w-5 h-5" /></div>
                   <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl"><span className="font-bold text-sm">Push Notifications</span> <input type="checkbox" name="pushNotif" checked={formData.pushNotif} onChange={handleChange} className="accent-primary w-5 h-5" /></div>
                 </div>
                 <Button onClick={() => handleSave('Preferences')} className="bg-primary text-white border-0 px-8 py-4 rounded-2xl shadow-xl font-black mt-4">Save Preferences</Button>
               </div>
             )}

             {activeTab === 'Linked Accounts' && (
               <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                 <h3 className="font-black text-2xl">Linked Accounts</h3>
                 <div className="space-y-4">
                   <div className="flex items-center justify-between p-6 border border-slate-100 dark:border-slate-800 rounded-3xl bg-slate-50 dark:bg-slate-800/50">
                     <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                         <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                       </div>
                       <div>
                         <div className="font-black text-slate-900 dark:text-white">Google</div>
                         <div className="text-xs text-slate-500 font-bold mt-1">Connected as {formData.email}</div>
                       </div>
                     </div>
                     <Button variant="outline" className="text-xs border-slate-200">Disconnect</Button>
                   </div>
                   <div className="flex items-center justify-between p-6 border border-slate-100 dark:border-slate-800 rounded-3xl">
                     <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-sm">
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.702z"/></svg>
                       </div>
                       <div>
                         <div className="font-black text-slate-900 dark:text-white">Apple</div>
                         <div className="text-xs text-slate-500 font-bold mt-1">Not connected</div>
                       </div>
                     </div>
                     <Button className="text-xs bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-0">Connect</Button>
                   </div>
                 </div>
               </div>
             )}

             {activeTab === 'Danger Zone' && (
               <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                 <h3 className="font-black text-2xl text-red-500">Danger Zone</h3>
                 <p className="text-slate-500 font-medium">Permanently delete your account and all associated data. This action cannot be undone.</p>
                 <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-3xl">
                   <h4 className="font-black text-red-700 dark:text-red-400 mb-2">Delete Account</h4>
                   <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-6">If you delete your account, your leases, transaction history, and profile data will be permanently wiped.</p>
                   <Button onClick={() => { if(window.confirm('Are you absolutely sure? This cannot be undone.')) toast.success('Account scheduled for deletion.'); }} className="bg-red-500 text-white border-0 px-6 py-3 rounded-xl font-black shadow-lg shadow-red-500/20 hover:bg-red-600">Delete My Account</Button>
                 </div>
               </div>
             )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
