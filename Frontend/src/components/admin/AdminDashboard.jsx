import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { 
  Users, Building, DollarSign, ShieldAlert, BarChart3, Settings, Search, 
  ArrowUpRight, X, Activity, Server, Key, CreditCard, Bell, Clock, CheckCircle, 
  AlertTriangle, Lock, FileText, Share2, Download, TerminalSquare, AlertCircle, MessageSquare,
  Wrench
} from 'lucide-react';
import Button from '../common/Button';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import toast from 'react-hot-toast';
import maintenanceService from '../../services/maintenanceService';
import userService from '../../services/userService';
import chatService from '../../services/chatService';
import inspectionService from '../../services/inspectionService';

// --- MOCK DATA ---
const initialEntities = [
  { id: 1, name: 'John Renter', email: 'john@example.com', role: 'Resident', status: 'Online', date: 'Oct 24, 2025', avatar: '1', pulse: true },
  { id: 2, name: 'Sarah Owner', email: 'sarah@example.com', role: 'Asset Owner', status: 'Online', date: 'Oct 23, 2025', avatar: '2', pulse: true },
  { id: 3, name: 'Mike Tech', email: 'mike@service.com', role: 'Field Tech', status: 'Away', date: 'Oct 22, 2025', avatar: '3', pulse: true },
];

const initialFeed = [
  { id: 1, event: 'Brute Force Attempt', time: '2m ago', level: 'high', location: 'IP: 192.168.1.1', desc: '14 failed login attempts detected in 30 seconds from a single IP address.' },
  { id: 2, event: 'Large Withdrawal', time: '1h ago', level: 'mid', location: 'Asset: Skyline', desc: 'Unusual transfer of $15,000 initiated by Sarah Owner to external account.' },
  { id: 3, event: 'New Admin Created', time: '3h ago', level: 'mid', location: 'By: SuperUser', desc: 'A new super admin account was provisioned bypassing standard workflow.' },
  { id: 4, event: 'Database Snapshot', time: '5h ago', level: 'low', location: 'System Auto', desc: 'Routine encrypted database snapshot successfully saved to S3.' },
];

const chartData = {
  Today: [ { time: '00:00', lat: 110, thru: 80 }, { time: '06:00', lat: 125, thru: 85 }, { time: '12:00', lat: 140, thru: 110 }, { time: '18:00', lat: 124, thru: 95 }, { time: '23:59', lat: 115, thru: 85 } ],
  'Last 7 Days': [ { time: 'Mon', lat: 120, thru: 90 }, { time: 'Tue', lat: 115, thru: 95 }, { time: 'Wed', lat: 130, thru: 80 }, { time: 'Thu', lat: 124, thru: 100 }, { time: 'Fri', lat: 110, thru: 105 } ],
  'Last 30 Days': [ { time: 'W1', lat: 125, thru: 85 }, { time: 'W2', lat: 135, thru: 90 }, { time: 'W3', lat: 115, thru: 100 }, { time: 'W4', lat: 124, thru: 110 } ]
};

const forecastData = [
  { month: 'Jul', actual: 1200, projected: 1200 },
  { month: 'Aug', actual: 1350, projected: 1300 },
  { month: 'Sep', actual: null, projected: 1540 },
];

const revenueData = [
  { name: 'Tenants', val: 85400 },
  { name: 'Owners', val: 32000 },
  { name: 'Services', val: 11000 },
];

// --- CUSTOM TOOLTIPS ---
const AreaTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl font-bold text-xs border border-slate-700">
        <div className="mb-2 text-slate-400">{label}</div>
        <div className="text-blue-400">Latency: {payload[0].value}ms</div>
        <div className="text-purple-400">Throughput: {payload[1].value}k/s</div>
      </div>
    );
  }
  return null;
};

const AdminDashboard = ({ data, onRefresh }) => {
  const navigate = useNavigate();

  const [entities, setEntities] = useState([]);
  const [feed, setFeed] = useState([]);
  const [alertsCount, setAlertsCount] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [infraPeriod, setInfraPeriod] = useState('Today');
  const [systemStatus, setSystemStatus] = useState('Operational');

  // Chat States
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [replyText, setReplyText] = useState('');

  // Modals
  const [globalConfigOpen, setGlobalConfigOpen] = useState(false);
  const [configTab, setConfigTab] = useState('System');
  const [healthModalOpen, setHealthModalOpen] = useState(false);
  const [auditUser, setAuditUser] = useState(null);
  const [securityEvent, setSecurityEvent] = useState(null);
  const [forecastOpen, setForecastOpen] = useState(false);
  const [revenueOpen, setRevenueOpen] = useState(false);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [maintenanceTickets, setMaintenanceTickets] = useState([]);
  const [inspectors, setInspectors] = useState([]);
  const [inspectionTasks, setInspectionTasks] = useState([]);

  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('rentify_global_config');
    return saved ? JSON.parse(saved) : { maintenanceMode: false, newRegistrations: true, autoBackup: true, sessionTimeout: 30, '2fa': true, fee: 2.5 };
  });

  const [services, setServices] = useState([
    { name: 'API Gateway', status: '🟢', ms: 45, check: '2m ago' },
    { name: 'Auth Service', status: '🟢', ms: 112, check: '2m ago' },
    { name: 'Payment Engine', status: '🟢', ms: 89, check: '2m ago' },
    { name: 'Notification Service', status: '🟢', ms: 34, check: '2m ago' },
    { name: 'Database Cluster', status: '🟢', ms: 12, check: '2m ago' },
  ]);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  // --- Effects ---
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (data) {
      setEntities(data.users || []);
      setFeed(data.recentTickets?.map(t => ({
        id: t._id,
        event: t.title || t.type,
        time: new Date(t.createdAt).toLocaleTimeString(),
        level: t.urgency === 'Emergency' ? 'high' : 'mid',
        location: t.property?.title || 'Unknown',
        desc: t.description
      })) || []);
      setAlertsCount(data.stats?.alerts || 0);
    }
  }, [data]);

  useEffect(() => {
    const fetchDispatchData = async () => {
      try {
        const [providers, tickets, insp, tasks, convs] = await Promise.all([
          userService.getServiceProviders(),
          maintenanceService.getAllTickets(),
          userService.getInspectors(),
          inspectionService.getInspections(),
          chatService.getConversations()
        ]);
        setServiceProviders(providers);
        setMaintenanceTickets(tickets);
        setInspectors(insp);
        setInspectionTasks(tasks);
        setConversations(convs);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };
    fetchDispatchData();
  }, [data, isChatOpen]);

  // --- Handlers ---
  const handleAssignProvider = async (ticketId, providerId) => {
    try {
      await maintenanceService.assignProvider(ticketId, providerId);
      toast.success('Technician dispatched successfully! ✓');
      const updatedTickets = await maintenanceService.getAllTickets();
      setMaintenanceTickets(updatedTickets);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error('Dispatch failed');
    }
  };

  const handleAssignInspector = async (taskId, inspectorId) => {
    try {
      await inspectionService.updateInspection(taskId, { inspector: inspectorId });
      toast.success('Inspector assigned successfully! ✓');
      const updatedTasks = await inspectionService.getInspections();
      setInspectionTasks(updatedTasks);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error('Assignment failed');
    }
  };

  const filteredEntities = entities.filter(e => 
    e.name.toLowerCase().includes(debouncedQuery.toLowerCase()) || 
    e.email.toLowerCase().includes(debouncedQuery.toLowerCase()) || 
    e.role.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  // Handlers
  const handleSaveConfig = () => {
    localStorage.setItem('rentify_global_config', JSON.stringify(config));
    toast.success('Global config updated ✓');
    setGlobalConfigOpen(false);
  };

  const runHealthCheck = () => {
    setIsCheckingHealth(true);
    let index = 0;
    const interval = setInterval(() => {
      // Use latest state to check length
      setServices(prev => {
        if (index >= prev.length) {
          clearInterval(interval);
          setIsCheckingHealth(false);
          
          // Final resolution logic
          setTimeout(() => {
            if (Math.random() > 0.7) {
              setServices(curr => {
                const next = [...curr];
                if (next[2]) next[2] = { ...next[2], status: '🔴', ms: 5000, check: 'Just now' };
                return next;
              });
              setSystemStatus('Degraded');
              toast.error('Payment Engine is down!');
            } else {
              setServices(curr => curr.map(s => ({...s, status: '🟢', ms: Math.floor(Math.random()*100)+10, check: 'Just now'})));
              setSystemStatus('Operational');
              toast.success('All systems nominal ✓');
            }
          }, 100);
          return prev;
        }

        const next = [...prev];
        next[index] = { ...next[index], status: '🟡', check: 'Checking...' };
        index++;
        return next;
      });
    }, 400);
  };

  const handleAuditAction = (action) => {
    if (action === 'suspend') {
      if (window.confirm(`Suspend ${auditUser.name}? This will revoke all access.`)) {
        setEntities(entities.map(e => e.id === auditUser.id ? { ...e, pulse: false, status: 'Suspended' } : e));
        setAuditUser({ ...auditUser, pulse: false, status: 'Suspended' });
        toast.success(`${auditUser.name} suspended.`);
      }
    } else if (action === 'reset') {
      toast.success('Password reset email sent ✓');
    } else if (action === 'download') {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text(`Audit Report: ${auditUser.name}`, 20, 20);
      doc.setFontSize(12);
      doc.text(`Role: ${auditUser.role}`, 20, 30);
      doc.text(`Email: ${auditUser.email}`, 20, 40);
      doc.text(`Status: ${auditUser.status}`, 20, 50);
      doc.autoTable({ startY: 60, head: [['Timestamp', 'Action']], body: [ ['10 mins ago', 'Logged in'], ['1 hour ago', 'Viewed Dashboard'], ['1 day ago', 'Updated Profile'] ] });
      doc.save(`Audit_${auditUser.name.replace(' ','_')}.pdf`);
    }
  };

  const handleSecurityAction = (action) => {
    if (action === 'block') {
      toast.success(`IP blocked successfully ✓`);
    } else if (action === 'revert') {
      if (window.confirm('Are you sure you want to revert this action?')) {
        toast.success('Action reverted ✓');
      }
    } else if (action === 'dismiss') {
      setFeed(feed.filter(f => f.id !== securityEvent.id));
      setAlertsCount(prev => Math.max(0, prev - 1));
      setSecurityEvent(null);
    }
  };

  const downloadForecast = () => {
    const doc = new jsPDF();
    doc.text("Q3 Growth Forecast Report", 20, 20);
    doc.text("Projected: +14% user onboarding increase", 20, 30);
    doc.save("Q3_Forecast.pdf");
  };

  const shareForecast = () => {
    navigator.clipboard.writeText(window.location.href + '#forecast-q3');
    toast.success("Link copied ✓");
  };

  const openConversation = async (conv) => {
    setSelectedConv(conv);
    try {
      const messages = await chatService.getConversation(conv.user._id);
      setChatMessages(messages);
      await chatService.markAsRead(conv.user._id);
      // Update local unread state
      setConversations(prev => prev.map(c => c.user._id === conv.user._id ? { ...c, unread: false } : c));
    } catch (err) {
      toast.error('Failed to load conversation');
    }
  };

  const handleSendMessage = async () => {
    if (!replyText.trim() || !selectedConv) return;
    try {
      const newMessage = await chatService.sendMessage(selectedConv.user._id, replyText);
      setChatMessages([...chatMessages, newMessage]);
      setReplyText('');
      // Update last message in sidebar
      setConversations(prev => prev.map(c => 
        c.user._id === selectedConv.user._id 
        ? { ...c, lastMessage: replyText, updatedAt: new Date() } 
        : c
      ));
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  const scrollToSecurity = () => {
    document.getElementById('security-feed')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!data) return null;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">System <span className="text-primary">Command</span></h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">Real-time health monitoring and global oversight for Rentify.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setHealthModalOpen(true)} className={`flex items-center gap-2 px-4 py-2 ${systemStatus === 'Operational' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'} rounded-2xl text-xs font-black uppercase hover:opacity-80 transition-opacity`}>
            <div className={`w-2 h-2 ${systemStatus === 'Operational' ? 'bg-green-500' : 'bg-red-500'} rounded-full animate-pulse`}></div>
            SYSTEM {systemStatus.toUpperCase()}
          </button>
          
          <button 
            onClick={() => setIsChatOpen(true)}
            className="relative p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-all group"
          >
            <MessageSquare size={20} />
            {conversations.some(c => c.unread) && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce">
                {conversations.filter(c => c.unread).length}
              </span>
            )}
          </button>

          <Button onClick={() => setGlobalConfigOpen(true)} variant="primary" className="premium-gradient soft-glow text-white border-0 px-6 font-black rounded-2xl shadow-lg hover:scale-105 transition-transform">
            <Settings size={18} className="mr-2" /> Global Config
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Total Ecosystem Users" value={data.stats?.users || 0} trend="+12.4%" icon={Users} color="blue" onClick={() => navigate('/admin/entities')} />
        <MetricCard label="Global Active Assets" value={data.stats?.properties || 0} trend="+5.2%" icon={Building} color="purple" onClick={() => navigate('/admin/assets')} />
        <MetricCard label="Ecosystem Revenue" value={`₹${data.stats?.revenue || 0}`} trend="+18.1%" icon={DollarSign} color="green" onClick={() => setRevenueOpen(true)} />
        <MetricCard label="Security Alerts" value={alertsCount} trend="-2.5%" icon={ShieldAlert} color="orange" onClick={scrollToSecurity} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* User Management & Traffic */}
        <div className="lg:col-span-2 space-y-10">
          <Card className="border-0 shadow-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
            <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h3 className="font-black text-2xl tracking-tight text-slate-900 dark:text-white">Entity Directory</h3>
                <p className="text-sm text-slate-500 mt-1">Full oversight of users, owners, and field staff.</p>
              </div>
              <div className="relative w-full sm:w-auto flex items-center">
                <Search className="absolute left-4 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search identities..." 
                  className="w-full sm:w-64 pl-12 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 dark:text-white outline-none transition-all"
                />
                {searchQuery && <X onClick={() => setSearchQuery('')} className="absolute right-4 text-slate-400 cursor-pointer hover:text-slate-600" size={16} />}
              </div>
            </div>
            <div className="overflow-x-auto min-h-[300px]">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 dark:bg-slate-800/30 text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-10 py-6">Identity</th>
                    <th className="px-6 py-6">ID / Contact</th>
                    <th className="px-6 py-6">Location</th>
                    <th className="px-6 py-6 text-center">Role</th>
                    <th className="px-6 py-6 text-center">Pulse</th>
                    <th className="px-10 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {filteredEntities.length > 0 ? filteredEntities.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <img src={`https://i.pravatar.cc/100?u=${user._id}`} className="w-10 h-10 rounded-2xl object-cover shadow-sm" alt="" />
                          <div>
                            <div className="font-black text-slate-900 dark:text-white text-sm">{user.name}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-700 dark:text-slate-300">#{user._id.toString().slice(-6).toUpperCase()}</span>
                          <span className="text-[10px] font-bold text-slate-400">{user.phone || '+91 98XXX XXXXX'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 max-w-[120px] block truncate" title={user.address || 'Not Provided'}>
                          {user.address || 'Global (Remote)'}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1.5 rounded-xl uppercase tracking-tighter">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></div>
                          <span className="text-[10px] font-black text-green-600 uppercase tracking-tight">Active</span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <Button 
                          onClick={() => setAuditUser(user)} 
                          variant="outline" 
                          className="h-9 text-[10px] px-4 font-black rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300"
                        >
                          Audit
                        </Button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="6" className="px-10 py-16 text-center text-slate-400 font-bold italic">No ecosystem results found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-8 text-center border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
               <button onClick={() => navigate('/admin/entities')} className="text-xs font-black text-slate-400 hover:text-primary transition-colors tracking-widest uppercase">View Complete Directory Oversight</button>
            </div>
          </Card>

          {/* Performance Chart Live */}
          <Card className="p-10 border-0 shadow-2xl bg-slate-900 text-white rounded-[2.5rem] relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-black text-2xl tracking-tight">Infrastructure Pulse</h3>
                  <p className="text-slate-400 text-sm mt-1">Global latency and throughput metrics.</p>
                </div>
                <div className="flex gap-2">
                  <div className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-wider">99.9% Uptime</div>
                  <div className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-wider text-blue-400">124ms Latency</div>
                </div>
              </div>
              
              <div className="flex gap-2 mb-6">
                 {['Today', 'Last 7 Days', 'Last 30 Days'].map(p => (
                   <button key={p} onClick={() => setInfraPeriod(p)} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${infraPeriod === p ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{p}</button>
                 ))}
              </div>

              <div className="h-64 w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData[infraPeriod]} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorLat" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorThru" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Tooltip content={<AreaTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area type="monotone" dataKey="lat" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLat)" animationDuration={1000} />
                    <Area type="monotone" dataKey="thru" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorThru)" animationDuration={1000} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
          </Card>

          {/* Daily Management Reports - NEW SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
             <Card className="p-8 border-0 shadow-xl bg-white dark:bg-slate-900 rounded-[2.5rem]">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl">
                      <BarChart3 size={20} />
                   </div>
                   <h4 className="font-black text-lg text-slate-900 dark:text-white">Inspector Daily Report</h4>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-sm p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <span className="font-bold text-slate-500">Scheduled Inspections</span>
                      <span className="font-black text-slate-900 dark:text-white">24</span>
                   </div>
                   <div className="flex justify-between items-center text-sm p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <span className="font-bold text-slate-500">Resolved Flags</span>
                      <span className="font-black text-emerald-600">18</span>
                   </div>
                   <div className="flex justify-between items-center text-sm p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <span className="font-bold text-slate-500">Critical Alerts</span>
                      <span className="font-black text-rose-500">3</span>
                   </div>
                   <Button variant="outline" className="w-full mt-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-slate-200">Download Detailed PDF</Button>
                </div>
             </Card>

             <Card className="p-8 border-0 shadow-xl bg-white dark:bg-slate-900 rounded-[2.5rem]">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl">
                      <Wrench size={20} />
                   </div>
                   <h4 className="font-black text-lg text-slate-900 dark:text-white">Service Manager Report</h4>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-sm p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <span className="font-bold text-slate-500">Tasks Completed</span>
                      <span className="font-black text-slate-900 dark:text-white">42</span>
                   </div>
                   <div className="flex justify-between items-center text-sm p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <span className="font-bold text-slate-500">Avg. Response Time</span>
                      <span className="font-black text-blue-600">2.4h</span>
                   </div>
                   <div className="flex justify-between items-center text-sm p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <span className="font-bold text-slate-500">Customer Rating</span>
                      <span className="font-black text-amber-500">★ 4.9</span>
                   </div>
                   <Button variant="outline" className="w-full mt-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-slate-200">View Technician Metrics</Button>
                </div>
             </Card>
          </div>
        </div>

        {/* Security & Intelligence */}
        <div className="space-y-10">
          <Card id="maintenance-dispatch" className="border-0 shadow-xl bg-white dark:bg-slate-900 rounded-[2.5rem] p-10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-xl tracking-tight text-slate-900 dark:text-white">Maintenance Dispatch</h3>
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center relative">
                <Wrench size={18} />
                {maintenanceTickets.filter(t => t.status === 'OPEN').length > 0 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>}
              </div>
            </div>
            <div className="space-y-6">
              {maintenanceTickets.slice(0, 3).map((ticket) => (
                <div key={ticket._id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary/50 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{ticket.type}</div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate max-w-[150px]">{ticket.property?.title}</h4>
                    </div>
                    {ticket.assignedTo ? (
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-md uppercase">Assigned</span>
                        <span className="text-[9px] font-bold text-slate-400 mt-1">{ticket.assignedTo.name}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-black text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-md uppercase">Pending</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex -space-x-2">
                       {serviceProviders.slice(0, 3).map(p => (
                         <img key={p._id} src={`https://i.pravatar.cc/100?u=${p._id}`} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 object-cover" title={p.name} />
                       ))}
                    </div>
                    <select 
                      className="bg-white dark:bg-slate-900 text-[9px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                      value={ticket.assignedTo?._id || ''}
                      onChange={(e) => handleAssignProvider(ticket._id, e.target.value)}
                    >
                      <option value="">{ticket.assignedTo ? 'Change Tech' : 'Assign Tech'}</option>
                      {serviceProviders.map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              {maintenanceTickets.length === 0 && <div className="text-center py-10 text-slate-400 font-bold italic">No pending tickets</div>}
            </div>
          </Card>

          <Card id="inspector-dispatch" className="border-0 shadow-xl bg-white dark:bg-slate-900 rounded-[2.5rem] p-10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-xl tracking-tight text-slate-900 dark:text-white">Inspector Dispatch</h3>
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center relative">
                <Search size={18} />
                {inspectionTasks.filter(t => t.status === 'PENDING').length > 0 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>}
              </div>
            </div>
            <div className="space-y-6">
              {inspectionTasks.length > 0 ? inspectionTasks.slice(0, 3).map((task) => (
                <div key={task._id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-amber-500/50 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">{task.type}</div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate max-w-[150px]">{task.property?.title}</h4>
                    </div>
                    {task.inspector ? (
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md uppercase">Scheduled</span>
                        <span className="text-[9px] font-bold text-slate-400 mt-1">{task.inspector.name}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-black text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded-md uppercase">Needs Assignment</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex -space-x-2">
                       {inspectors.slice(0, 3).map(p => (
                         <img key={p._id} src={`https://i.pravatar.cc/100?u=${p._id}`} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 object-cover" title={p.name} />
                       ))}
                    </div>
                    <select 
                      className="bg-white dark:bg-slate-900 text-[9px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                      value={task.inspector?._id || ''}
                      onChange={(e) => handleAssignInspector(task._id, e.target.value)}
                    >
                      <option value="">{task.inspector ? 'Reassign' : 'Assign Inspector'}</option>
                      {inspectors.map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-slate-400 font-bold italic">Queue is clear</div>
              )}
            </div>
          </Card>

          <Card className="premium-gradient p-10 text-white border-0 rounded-[2.5rem] relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-black text-2xl mb-2">Growth Engine</h3>
              <p className="text-white/70 text-sm mb-8 leading-relaxed">System prediction shows a <span className="text-white font-bold">+14% increase</span> in user onboarding for Q3 based on current marketing spend.</p>
              <Button onClick={() => setForecastOpen(true)} className="w-full bg-white text-primary hover:bg-slate-100 h-14 font-black rounded-2xl shadow-xl transition-all hover:scale-[1.02]">
                Review Q3 Forecast
              </Button>
            </div>
            <BarChart3 className="absolute -bottom-10 -right-10 text-white/10 w-48 h-48 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
          </Card>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Global Config Modal */}
      {globalConfigOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 text-slate-900 dark:text-white" onClick={() => setGlobalConfigOpen(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[400px] animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
             {/* Tabs Side */}
             <div className="bg-slate-50 dark:bg-slate-800 p-6 md:w-1/3 flex flex-col gap-2 border-r border-slate-100 dark:border-slate-700">
               <h3 className="font-black text-xl mb-6 flex items-center gap-2"><Settings className="text-primary"/> Settings</h3>
               {[
                 { name: 'System', icon: Server },
                 { name: 'Security', icon: Key },
                 { name: 'Payments', icon: CreditCard },
                 { name: 'Notifications', icon: Bell }
               ].map(tab => (
                 <button key={tab.name} onClick={() => setConfigTab(tab.name)} className={`flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-colors text-left ${configTab === tab.name ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                   <tab.icon size={16}/> {tab.name}
                 </button>
               ))}
             </div>
             {/* Content Side */}
             <div className="p-8 md:w-2/3 flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-lg mb-6 uppercase tracking-wider text-slate-400">{configTab} Configuration</h4>
                  
                  {configTab === 'System' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center"><span className="font-bold text-sm">Maintenance Mode</span> <input type="checkbox" checked={config.maintenanceMode} onChange={e => setConfig({...config, maintenanceMode: e.target.checked})} className="toggle" /></div>
                      <div className="flex justify-between items-center"><span className="font-bold text-sm">New Registrations</span> <input type="checkbox" checked={config.newRegistrations} onChange={e => setConfig({...config, newRegistrations: e.target.checked})} className="toggle" /></div>
                      <div className="flex justify-between items-center"><span className="font-bold text-sm">Auto-Backup</span> <input type="checkbox" checked={config.autoBackup} onChange={e => setConfig({...config, autoBackup: e.target.checked})} className="toggle" /></div>
                    </div>
                  )}

                  {configTab === 'Security' && (
                    <div className="space-y-6">
                      <div className="space-y-2"><span className="font-bold text-sm">Session Timeout (Minutes): {config.sessionTimeout}</span> <input type="range" min="5" max="120" value={config.sessionTimeout} onChange={e => setConfig({...config, sessionTimeout: parseInt(e.target.value)})} className="w-full accent-primary" /></div>
                      <div className="flex justify-between items-center"><span className="font-bold text-sm">Enforce 2FA</span> <input type="checkbox" checked={config['2fa']} onChange={e => setConfig({...config, '2fa': e.target.checked})} className="toggle" /></div>
                      <div className="space-y-2"><span className="font-bold text-sm">IP Whitelist</span> <textarea placeholder="Enter IP addresses separated by comma" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-0 outline-none text-sm" rows="3"></textarea></div>
                    </div>
                  )}

                  {configTab === 'Payments' && (
                    <div className="space-y-6">
                      <div className="space-y-2"><span className="font-bold text-sm">Platform Fee (%)</span> <input type="number" step="0.1" value={config.fee} onChange={e => setConfig({...config, fee: parseFloat(e.target.value)})} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-0 outline-none" /></div>
                      <div className="space-y-2"><span className="font-bold text-sm">Payout Schedule</span> <select className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-0 outline-none font-bold"><option>Daily</option><option>Weekly</option><option>Monthly</option></select></div>
                      <div className="space-y-2"><span className="font-bold text-sm">Base Currency</span> <select className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-0 outline-none font-bold"><option>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option></select></div>
                    </div>
                  )}

                  {configTab === 'Notifications' && (
                    <div className="space-y-6">
                      <p className="text-sm text-slate-500 mb-4">Set thresholds to trigger global admin alerts.</p>
                      <div className="space-y-2"><span className="font-bold text-sm">Security Alerts/hr {'>'} 50</span> <input type="range" className="w-full accent-red-500" /></div>
                      <div className="space-y-2"><span className="font-bold text-sm">Revenue Drop {'>'} 10%</span> <input type="range" className="w-full accent-orange-500" /></div>
                    </div>
                  )}

                </div>
                <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <Button variant="outline" onClick={() => setGlobalConfigOpen(false)} className="px-6 rounded-xl border-slate-200">Cancel</Button>
                  <Button onClick={handleSaveConfig} className="bg-primary text-white border-0 px-8 rounded-xl font-black shadow-lg">Save Changes</Button>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* System Health Modal */}
      {healthModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 text-slate-900 dark:text-white" onClick={() => setHealthModalOpen(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-md shadow-2xl p-8 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-xl flex items-center gap-2"><Activity className="text-primary" /> System Health</h3>
              <button onClick={() => setHealthModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X size={18}/></button>
            </div>
            <div className="space-y-4 mb-8">
              {services.map((s, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                   <div className="flex items-center gap-3"><span className="text-lg">{s.status}</span> <span className="font-bold text-sm">{s.name}</span></div>
                   <div className="text-right">
                     <div className="font-black text-xs">{s.ms}ms</div>
                     <div className="text-[10px] text-slate-400 font-bold uppercase">{s.check}</div>
                   </div>
                </div>
              ))}
            </div>
            <Button onClick={runHealthCheck} disabled={isCheckingHealth} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-0 py-4 rounded-xl font-black shadow-xl disabled:opacity-50 flex items-center justify-center gap-2">
              {isCheckingHealth ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Checking...</> : 'Run Health Check'}
            </Button>
          </div>
        </div>
      )}

      {/* User Audit Modal - REDESIGNED */}
      {auditUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 text-slate-900 dark:text-white" onClick={() => setAuditUser(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
             {/* Glass Header */}
             <div className="relative h-48 bg-primary/10 overflow-hidden">
               <div className="absolute inset-0 premium-gradient opacity-20"></div>
               <div className="absolute inset-0 backdrop-blur-3xl"></div>
               <button onClick={() => setAuditUser(null)} className="absolute top-6 right-6 p-3 bg-white/20 hover:bg-white/40 dark:bg-slate-800/40 rounded-2xl transition-all z-20 text-white"><X size={20}/></button>
               
               <div className="absolute bottom-[-40px] left-10 flex items-end gap-6 z-10">
                 <div className="relative">
                   <img src={`https://i.pravatar.cc/200?u=${auditUser._id}`} className="w-32 h-32 rounded-[2.5rem] object-cover border-[6px] border-white dark:border-slate-900 shadow-2xl" alt="" />
                   <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white dark:border-slate-900 rounded-full"></div>
                 </div>
                 <div className="mb-12">
                   <h3 className="font-black text-4xl tracking-tight text-slate-900 dark:text-white">{auditUser.name}</h3>
                   <div className="flex items-center gap-2 mt-1">
                     <span className="text-slate-500 font-bold text-sm">{auditUser.email}</span>
                     <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                     <span className="px-3 py-0.5 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-tighter border border-primary/20">{auditUser.role}</span>
                   </div>
                 </div>
               </div>
             </div>

             <div className="p-10 pt-16">
               {/* Bento Layout Grid */}
               <div className="grid grid-cols-3 gap-4 mb-10">
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800/50 flex flex-col justify-between hover:border-primary/30 transition-colors">
                     <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl w-fit mb-4"><TerminalSquare size={18} /></div>
                     <div>
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Entity ID</div>
                       <div className="font-black text-slate-900 dark:text-white text-sm">#{auditUser._id.toString().slice(-8).toUpperCase()}</div>
                     </div>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800/50 flex flex-col justify-between hover:border-primary/30 transition-colors">
                     <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl w-fit mb-4"><Activity size={18} /></div>
                     <div>
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone</div>
                       <div className="font-black text-slate-900 dark:text-white text-sm">{auditUser.phone || '+91 98XXX XXXXX'}</div>
                     </div>
                  </div>
                  <div className="p-6 bg-slate-900 dark:bg-primary rounded-3xl text-white flex flex-col justify-between shadow-lg shadow-primary/20">
                     <div className="p-2 bg-white/20 rounded-xl w-fit mb-4"><ShieldAlert size={18} /></div>
                     <div>
                       <div className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Status</div>
                       <div className="font-black text-sm">SECURE_ACTIVE</div>
                     </div>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800/50 col-span-3 flex items-center justify-between group">
                     <div className="flex items-center gap-4">
                       <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm"><Building size={20} className="text-slate-400" /></div>
                       <div>
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Residence</div>
                         <div className="font-bold text-slate-600 dark:text-slate-300 text-sm leading-tight mt-0.5">{auditUser.address || 'No primary residence recorded in ecosystem.'}</div>
                       </div>
                     </div>
                     <ArrowUpRight className="text-slate-300 group-hover:text-primary transition-colors" size={20} />
                  </div>
               </div>

               {/* Activity Trace Timeline */}
               <div className="mb-10">
                  <div className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-3">
                    <div className="h-[2px] w-8 bg-slate-100 dark:bg-slate-800"></div> Ecosystem Activity Trace
                  </div>
                  <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800">
                    {[
                      { act: 'Network Authorization', icon: Lock, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                      { act: 'Internal Ledger Update', icon: Server, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                      { act: 'Interface Interaction', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-6 items-start relative z-10 group/item">
                        <div className={`w-6 h-6 rounded-lg ${item.bg} flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm transition-transform group-hover/item:scale-125`}>
                          <item.icon size={10} className={item.color} />
                        </div>
                        <div className="flex-1 flex justify-between items-center pb-4 border-b border-slate-50 dark:border-slate-800 last:border-0">
                          <span className="font-bold text-slate-700 dark:text-slate-300 group-hover/item:text-primary transition-colors text-sm">{item.act}</span> 
                          <span className="text-[10px] font-black text-slate-400 uppercase">{i*2 + 1}H AGO</span>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="flex gap-4">
                 <Button onClick={() => handleAuditAction('download')} className="flex-[2] premium-gradient text-white border-0 rounded-2xl py-5 font-black shadow-2xl hover:translate-y-[-2px] active:translate-y-0 transition-all flex items-center justify-center gap-3">
                   <Download size={20}/> Generate Full Protocol Audit
                 </Button>
                 <Button onClick={() => handleAuditAction('suspend')} variant="outline" className="flex-1 bg-rose-50/50 text-rose-600 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/30 rounded-2xl font-black hover:bg-rose-100 transition-colors flex items-center justify-center gap-2">
                   <Lock size={18}/> Revoke Access
                 </Button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Security Event Modal */}
      {securityEvent && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 text-slate-900 dark:text-white" onClick={() => setSecurityEvent(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-sm shadow-2xl p-8 animate-in zoom-in-95 text-center" onClick={e => e.stopPropagation()}>
             <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${securityEvent.level === 'high' ? 'bg-red-100 text-red-500' : 'bg-orange-100 text-orange-500'}`}>
               <AlertCircle size={32} />
             </div>
             <h3 className="font-black text-xl mb-1">{securityEvent.event}</h3>
             <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{securityEvent.time} • {securityEvent.location}</div>
             <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
               {securityEvent.desc}
             </div>
             <div className="space-y-3">
               {securityEvent.event.includes('Brute') && <Button onClick={() => handleSecurityAction('block')} className="w-full bg-red-500 text-white border-0 py-3 rounded-xl font-black">Block IP</Button>}
               {securityEvent.event.includes('Withdrawal') && <Button onClick={() => handleSecurityAction('revert')} className="w-full bg-orange-500 text-white border-0 py-3 rounded-xl font-black">Revert Action</Button>}
               <Button onClick={() => handleSecurityAction('dismiss')} variant="outline" className="w-full py-3 rounded-xl font-black border-slate-200">Dismiss Alert</Button>
               <Button variant="ghost" className="w-full text-slate-400 text-xs hover:text-slate-900">Escalate to SuperAdmin</Button>
             </div>
          </div>
        </div>
      )}

      {/* Forecast Modal */}
      {forecastOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 text-slate-900 dark:text-white" onClick={() => setForecastOpen(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-2xl shadow-2xl p-8 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
             <div className="flex justify-between items-start mb-6">
               <div>
                 <h3 className="font-black text-2xl">Q3 Growth Forecast Report</h3>
                 <p className="text-primary font-bold mt-1 tracking-wide text-sm">+14% user onboarding increase</p>
               </div>
               <button onClick={() => setForecastOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X size={18}/></button>
             </div>
             <div className="h-48 w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-6 p-4">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={forecastData}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
                   <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} dy={10} />
                   <Tooltip cursor={{ stroke: '#cbd5e1' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}/>
                   <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, strokeWidth: 2 }} />
                   <Line type="monotone" dataKey="projected" stroke="#8b5cf6" strokeWidth={4} strokeDasharray="5 5" dot={{ r: 6, strokeWidth: 2 }} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
             <div className="grid grid-cols-2 gap-6 mb-8">
               <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                 <h4 className="font-black text-xs uppercase text-slate-400 mb-2">Marketing Spend</h4>
                 <div className="flex justify-between text-sm mb-1"><span className="font-bold">Social Ads</span> <span>$14,500</span></div>
                 <div className="flex justify-between text-sm mb-1"><span className="font-bold">Partnerships</span> <span>$8,200</span></div>
                 <div className="flex justify-between text-sm pt-2 border-t border-slate-200 dark:border-slate-700 mt-2"><span className="font-black text-primary">Total</span> <span className="font-black">$22,700</span></div>
               </div>
               <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                 <h4 className="font-black text-xs uppercase text-slate-400 mb-2">AI Recommendations</h4>
                 <ul className="text-xs space-y-2 font-bold text-slate-600 dark:text-slate-300">
                   <li>• Increase ad spend in urban hubs (+ROI)</li>
                   <li>• Target 'Asset Owners' via LinkedIn</li>
                   <li>• Run a Q3 referral promotion</li>
                 </ul>
               </div>
             </div>
             <div className="flex gap-3">
               <Button onClick={downloadForecast} className="flex-1 bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-0 rounded-xl py-3 font-black"><Download size={16} className="mr-2"/> Export Forecast PDF</Button>
               <Button onClick={shareForecast} variant="outline" className="flex-1 rounded-xl py-3 font-black border-slate-200"><Share2 size={16} className="mr-2"/> Share Report</Button>
             </div>
          </div>
        </div>
      )}

      {/* Revenue Modal */}
      {revenueOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 text-slate-900 dark:text-white" onClick={() => setRevenueOpen(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-lg shadow-2xl p-8 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
               <h3 className="font-black text-2xl">Revenue Breakdown</h3>
               <button onClick={() => setRevenueOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X size={18}/></button>
            </div>
            <div className="h-64 w-full mb-6">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}/>
                    <Bar dataKey="val" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
            <Button onClick={() => setRevenueOpen(false)} className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-0 py-3 rounded-xl font-black">Close</Button>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4" onClick={() => setIsChatOpen(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-4xl h-[80vh] shadow-2xl flex overflow-hidden animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            {/* Sidebar */}
            <div className="w-1/3 border-r border-slate-100 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-800/30">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-black text-2xl dark:text-white">Support Center</h3>
                <p className="text-sm text-slate-500 font-bold mt-1">Manage user queries</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {conversations.length > 0 ? conversations.map((conv, i) => (
                  <div 
                    key={i} 
                    onClick={() => openConversation(conv)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-4 ${selectedConv?.user?._id === conv.user._id ? 'bg-primary text-white shadow-lg' : 'hover:bg-white dark:hover:bg-slate-800 dark:text-slate-300'}`}
                  >
                    <div className="relative">
                      <img src={`https://i.pravatar.cc/100?u=${conv.user._id}`} className="w-10 h-10 rounded-xl" alt="" />
                      {conv.unread && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></div>}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="font-black text-sm truncate">{conv.user.name}</div>
                      <div className={`text-xs truncate ${selectedConv?.user?._id === conv.user._id ? 'text-white/70' : 'text-slate-400'}`}>
                        {conv.lastMessage}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-10 text-slate-400 font-bold">No conversations yet</div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
              {selectedConv ? (
                <>
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <img src={`https://i.pravatar.cc/100?u=${selectedConv.user._id}`} className="w-10 h-10 rounded-xl" alt="" />
                      <div>
                        <div className="font-black text-lg dark:text-white">{selectedConv.user.name}</div>
                        <div className="text-xs text-primary font-bold uppercase tracking-wider">{selectedConv.user.role}</div>
                      </div>
                    </div>
                    <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full dark:text-white"><X size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30 dark:bg-slate-900/50">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === 'me' || msg.sender?._id === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-4 rounded-3xl text-sm font-medium shadow-sm ${
                          msg.sender === 'me' || msg.sender?._id === 'me'
                          ? 'bg-primary text-white rounded-br-sm' 
                          : 'bg-white dark:bg-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-sm'
                        }`}>
                          {msg.text}
                          <div className={`text-[9px] mt-1 opacity-50 ${msg.sender === 'me' || msg.sender?._id === 'me' ? 'text-right' : 'text-left'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                    <input 
                      type="text" 
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your reply..." 
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 dark:text-white font-medium"
                    />
                    <Button onClick={handleSendMessage} variant="primary" className="px-8 rounded-2xl font-black">Send</Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-400 flex-col gap-4">
                  <MessageSquare size={48} className="opacity-20" />
                  <div className="font-bold">Select a conversation to start chatting</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const MetricCard = ({ label, value, trend, icon: Icon, color, onClick }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
  };

  return (
    <Card onClick={onClick} className="border-0 shadow-sm bg-white dark:bg-slate-900 p-8 card-hover-effect relative overflow-hidden group rounded-[2rem] cursor-pointer">
      <div className="flex justify-between items-start relative z-10">
        <div className={`p-4 rounded-2xl ${colorMap[color]}`}>
          <Icon size={24} />
        </div>
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter ${
          trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {trend}
        </span>
      </div>
      <div className="mt-8 relative z-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1 group-hover:scale-105 transition-transform origin-left">{value}</h3>
      </div>
      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-slate-50 dark:bg-slate-800/50 rounded-full group-hover:scale-150 transition-transform duration-1000 ease-out"></div>
    </Card>
  );
};

export default AdminDashboard;
