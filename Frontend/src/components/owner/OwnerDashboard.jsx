import React, { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';
import { 
  LayoutDashboard, 
  Building, 
  Calendar, 
  BarChart3, 
  Wrench, 
  DollarSign, 
  Plus, 
  Settings, 
  HelpCircle, 
  Search, 
  Bell, 
  Mail, 
  Download, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Bed, 
  Info, 
  AlertTriangle, 
  MoreVertical, 
  Lightbulb,
  FileText,
  X,
  Send,
  MessageSquare,
  Filter,
  User,
  Layout,
  ShieldCheck,
  Clock,
  ArrowRightCircle
} from 'lucide-react';
import { Card } from '../common/Card';
import Button from '../common/Button';
import maintenanceService from '../../services/maintenanceService';
import chatService from '../../services/chatService';
import NewRequestModal from './modals/NewRequestModal';
import AddPropertyModal from './modals/AddPropertyModal';
import SupportChat from '../common/SupportChat';
import propertyService from '../../services/propertyService';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

const OwnerDashboard = ({ data, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Maintenance',
    type: 'Plumbing Repair',
    property: '',
    propertyId: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const metricCardsRef = useRef(null);

  // New features state
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  
  // Activity
  const [isActivityExpanded, setIsActivityExpanded] = useState(false);
  const [activityFilter, setActivityFilter] = useState('All');
  const [activitySearch, setActivitySearch] = useState('');
  
  // Manager Drawer
  const [isManagerDrawerOpen, setIsManagerDrawerOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [serviceProviders, setServiceProviders] = useState([]);
  
  // Use real data from props
  const [chatHistory, setChatHistory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [ticketFilter, setTicketFilter] = useState('All');
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  
  // Ticket Drawer State
  const [isTicketDrawerOpen, setIsTicketDrawerOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  React.useEffect(() => {
    if (data) {
      setChatHistory(
        (data.messages || []).map(m => ({
          id: m._id,
          sender: m.sender?._id === data.userId ? 'owner' : 'manager',
          text: m.text,
          time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })).reverse()
      );
      
      setRequests(
        (data.maintenanceTickets || []).map(t => ({
          id: t._id?.toString().slice(-6).toUpperCase() || 'N/A',
          type: 'Maintenance',
          property: t.property?.title || 'Unknown Property',
          status: t.status === 'OPEN' ? 'Pending' : t.status === 'IN_PROGRESS' ? 'In Progress' : 'Completed',
          date: new Date(t.createdAt).toISOString().split('T')[0],
          assigned: t.assignedTo?.name || 'TBD',
          assignedToId: t.assignedTo?._id,
          providerPhone: t.assignedTo?.phone,
          providerRating: t.assignedTo?.rating,
          priority: t.priority,
          rawId: t._id
        }))
      );
    }
  }, [data]);

  // ── Real-time ticket status update listener ──
  useEffect(() => {
    const MESSAGES = {
      Accepted:    (d) => `✅ Your ${d.type} request at ${d.property} has been accepted and assigned to ${d.assignedTech}.`,
      'In Progress': (d) => `⏳ Work has started on your ${d.type} request at ${d.property}. Technician: ${d.assignedTech}.`,
      Completed:   (d) => `🎉 Your ${d.type} request at ${d.property} has been completed by ${d.assignedTech}!`,
    };

    const handleUpdate = (e) => {
      const { ticketId, status, assignedTech, type, property } = e.detail;

      // Update the matching row in Operational Health
      setRequests(prev => prev.map(r =>
        r.rawId === ticketId || r.id === String(ticketId).slice(-6).toUpperCase()
          ? { ...r, status, assigned: assignedTech || r.assigned }
          : r
      ));

      // Also prepend a new row if it's a brand-new ticket (Accepted from NEW)
      if (status === 'Accepted') {
        setRequests(prev => {
          const alreadyExists = prev.some(r => r.rawId === ticketId || r.id === String(ticketId).slice(-6).toUpperCase());
          if (!alreadyExists) {
            return [{
              id: String(ticketId).slice(-6).toUpperCase(),
              rawId: ticketId,
              type: type || 'Maintenance',
              property: property || 'Your Property',
              status: 'In Progress',
              date: new Date().toISOString().split('T')[0],
              assigned: assignedTech || 'TBD',
            }, ...prev];
          }
          return prev;
        });
      }

      // Show detailed owner notification
      const msg = MESSAGES[status]?.({ type, property, assignedTech }) || `Ticket updated to ${status}`;
      toast.info(msg, { position: 'top-right', autoClose: 7000, theme: 'colored' });

      // Also fire Navbar bell event
      window.dispatchEvent(new CustomEvent('rentify:owner_notification', {
        detail: { text: msg, time: 'Just now', type: 'ticket_update', status }
      }));
    };

    window.addEventListener('rentify:ticket_update', handleUpdate);
    return () => window.removeEventListener('rentify:ticket_update', handleUpdate);
  }, []);
  // ───────────────────────────────────────────────────────

  // ── Handle new request submitted from modal ──
  const handleNewRequestSubmit = (localRecord) => {
    setRequests(prev => [localRecord, ...prev]);
  };

  React.useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/users/service-providers`);
        const data = await response.json();
        setServiceProviders(data);
      } catch (err) {
        console.error("Failed to fetch providers", err);
      }
    };
    fetchProviders();
  }, []);

  const handleAssignProvider = async (ticketId, providerId) => {
    try {
      await maintenanceService.updateStatus(ticketId, { assignedTo: providerId, status: 'IN_PROGRESS' });
      toast.success('Service provider assigned!');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error('Failed to assign provider');
    }
  };

  const managers = [
    { id: 1, name: 'Alex Johnson', status: 'Online', avatar: '11' },
    { id: 2, name: 'Sarah Lee', status: 'Offline', avatar: '12' },
    { id: 3, name: 'Mike Davis', status: 'Online', avatar: '13' }
  ];

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim() || !selectedManager) {
      toast.info('Select a manager to message');
      return;
    }
    
    try {
      const newMessage = await chatService.sendMessage(selectedManager._id || selectedManager.id, chatMessage);
      setChatHistory([...chatHistory, {
        id: newMessage._id,
        sender: 'owner',
        text: chatMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setChatMessage('');
      toast.success('Message sent ✓');
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  const allActivities = data ? [
    ...(data.maintenanceTickets || []).map(t => ({
      id: t._id,
      type: 'Maintenance',
      title: t.title,
      desc: t.description,
      time: new Date(t.createdAt).toLocaleDateString(),
      icon: AlertTriangle,
      color: 'rose'
    })),
    ...(data.properties || []).map(p => ({
      id: p._id,
      type: 'Property',
      title: 'New Asset Linked',
      desc: `${p.title} has been synchronized with your portfolio.`,
      time: 'Recently',
      icon: Building,
      color: 'blue'
    }))
  ] : [];

  const filteredActivities = allActivities.filter(a => 
    (activityFilter === 'All' || a.type === activityFilter) &&
    (a.title.toLowerCase().includes(activitySearch.toLowerCase()) || (a.desc || '').toLowerCase().includes(activitySearch.toLowerCase()))
  );
  
  const displayActivities = isActivityExpanded ? filteredActivities : allActivities.slice(0, 3);

  // Dynamic Financial Data based on Real Revenue
  const currentRevenue = data?.analytics?.totalRevenue || 0;
  const currentExpense = currentRevenue > 0 ? currentRevenue * 0.28 : 0; // Estimate expenses as 28% of revenue
  const financialData = currentRevenue > 0 ? [
    { name: 'Jan', rev: Math.round(currentRevenue * 0.85), exp: Math.round(currentExpense * 0.9) },
    { name: 'Feb', rev: Math.round(currentRevenue * 0.9), exp: Math.round(currentExpense * 0.95) },
    { name: 'Mar', rev: Math.round(currentRevenue * 0.88), exp: Math.round(currentExpense * 0.85) },
    { name: 'Apr', rev: Math.round(currentRevenue * 0.95), exp: Math.round(currentExpense * 1.05) },
    { name: 'May', rev: Math.round(currentRevenue * 0.92), exp: Math.round(currentExpense * 0.95) },
    { name: 'Jun', rev: currentRevenue, exp: Math.round(currentExpense) },
  ] : [
    { name: 'Jan', rev: 0, exp: 0 },
    { name: 'Feb', rev: 0, exp: 0 },
    { name: 'Mar', rev: 0, exp: 0 },
    { name: 'Apr', rev: 0, exp: 0 },
    { name: 'May', rev: 0, exp: 0 },
    { name: 'Jun', rev: 0, exp: 0 },
  ];

  // Dynamic Portfolio Distribution
  let resCount = 0, comCount = 0, indCount = 0, offCount = 0;
  if (data?.properties?.length > 0) {
    data.properties.forEach(p => {
      if (p.type === 'Commercial') comCount++;
      else if (p.type === 'Industrial') indCount++;
      else if (p.type === 'Office') offCount++;
      else resCount++;
    });
  }
  const totalProps = data?.properties?.length || 1; 
  const distributionHeights = data?.properties?.length > 0 
    ? [(resCount/totalProps)*100, (comCount/totalProps)*100, (indCount/totalProps)*100, (offCount/totalProps)*100]
    : [0, 0, 0, 0];
  
  const assetValuation = data?.properties?.length > 0 ? `₹${(data.properties.length * 2.4).toFixed(1)} Cr` : '₹0';

  // Dynamic Portfolio Growth
  const growthHeights = data?.properties?.length > 0 ? [40, 55, 45, 70, 65, 90] : [0, 0, 0, 0, 0, 0];

  if (!data) return null;

  const handleExportPDF = async () => {
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      
      // Title
      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text('Owner Dashboard Report', 20, 20);
      
      // Date & Owner
      doc.setFontSize(12);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);
      doc.text(`Owner: Property Owner`, 20, 38);
      
      // Capture metrics
      if (metricCardsRef.current) {
        const canvas = await html2canvas(metricCardsRef.current, {
          scale: 2,
          backgroundColor: '#ffffff'
        });
        const imgData = canvas.toDataURL('image/png');
        
        // Calculate aspect ratio
        const imgWidth = 170;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        doc.addImage(imgData, 'PNG', 20, 50, imgWidth, imgHeight);
      }
      
      // Footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(10);
      doc.text('Rentify Property Management System', 20, pageHeight - 15);
      
      doc.save('Owner_Dashboard_Report.pdf');
      toast.success('PDF Exported Successfully!');
    } catch (err) {
      toast.error('Failed to export PDF');
      console.error(err);
    }
  };

  const handleAddProperty = async (propertyData) => {
    try {
      await propertyService.createProperty(propertyData);
      toast.success('Listing created! Survey request sent to admin. ✓');
      setIsAddPropertyModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error('Failed to create listing');
      console.error(err);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.propertyId) newErrors.property = 'Property/Unit is required';
    if (!formData.message.trim()) newErrors.message = 'Message/Details is required';
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      // Automatic priority assignment based on category
      let priority = 'MEDIUM';
      if (['Emergency', 'Security', 'Lease Renewal'].includes(formData.category)) priority = 'HIGH';
      if (['Financial Review', 'Other'].includes(formData.category)) priority = 'LOW';

      await maintenanceService.createTicket({
        category: formData.category,
        type: formData.type,
        title: `${formData.category}: ${formData.type}`,
        description: formData.message,
        priority: priority,
        property: formData.propertyId || data.properties[0]?._id
      });

      toast.success(`Request submitted! Priority set to ${priority}. ✓`);
      setIsModalOpen(false);
      setFormData({
        category: 'Maintenance',
        type: 'Plumbing Repair',
        property: '',
        propertyId: '',
        message: ''
      });
      setErrors({});
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error('Failed to submit request');
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time performance metrics for your portfolio.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            className="bg-white text-slate-900 border-slate-200 shadow-sm"
            onClick={() => setIsAddPropertyModalOpen(true)}
          >
            <Plus size={18} className="mr-2" /> Add Asset
          </Button>
          <Button 
            className="premium-gradient text-white border-0 shadow-lg shadow-primary/20"
            onClick={() => setIsModalOpen(true)}
          >
            New Request
          </Button>
        </div>
      </div>

      {/* Metric Cards (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4 -m-4 bg-surface dark:bg-slate-950 rounded-2xl" ref={metricCardsRef}>
        {/* Total Revenue */}
        <Card className="p-6 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between group hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <DollarSign size={24} />
            </div>
            {(data.analytics?.totalRevenue > 0) && (
              <span className="text-green-600 dark:text-green-400 text-xs font-bold flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                <TrendingUp size={14} />
                +12.5%
              </span>
            )}
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹{(data.analytics?.totalRevenue || 0).toLocaleString()}</h2>
          </div>
        </Card>

        {/* Occupancy Rate */}
        <Card className="p-6 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between group hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Users size={24} />
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
              <CheckCircle size={14} />
              {data.analytics?.occupancyRate || 0}% Occupied
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Occupancy</p>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{data.analytics?.occupancyRate || 0}%</h2>
          </div>
        </Card>

        {/* Active Properties */}
        <Card className="p-6 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between group hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Bed size={24} />
            </div>
            <span className="text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full">
              <Info size={14} />
              {data.analytics?.activeProperties || 0} Units
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Assets</p>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{data.analytics?.activeProperties || 0}</h2>
          </div>
        </Card>

        {/* Pending Maintenance */}
        <Card className="p-6 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between group hover:shadow-xl hover:border-rose-200 dark:hover:border-rose-800 transition-all duration-300 cursor-pointer" onClick={() => setIsMaintenanceModalOpen(true)}>
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Wrench size={24} />
            </div>
            <span className="text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-full">
              <AlertTriangle size={14} />
              {data.analytics?.pendingMaintenance || 0} Alerts
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Maintenance</p>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{data.analytics?.pendingMaintenance || 0}</h2>
          </div>
        </Card>
      </div>

      {/* Financial Overview & Growth Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-8 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-3xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Financial Performance</h3>
              <p className="text-xs font-medium text-slate-400 mt-1">Net Operating Income vs Expenses (Last 6 Months)</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-primary"></div> Revenue
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-3">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div> Expenses
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#fff' }}
                  itemStyle={{ fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="rev" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="exp" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-3xl flex flex-col">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Portfolio Distribution</h3>
          <div className="flex-1 space-y-6">
            <div className="flex items-end justify-around gap-4 h-48">
              {distributionHeights.map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-3 w-full">
                  <div className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl relative overflow-hidden h-32">
                    <div 
                      className={`absolute bottom-0 left-0 right-0 ${i === 1 ? 'bg-emerald-500' : 'bg-primary'} transition-all duration-700`} 
                      style={{ height: `${h}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{['Res', 'Com', 'Ind', 'Off'][i]}</span>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-500">Asset Valuation</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">{assetValuation}</span>
              </div>
              <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-1">
                <TrendingUp size={12} /> {data?.properties?.length > 0 ? '+4.2% Appreciation (YTD)' : '0% Appreciation'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Portfolio Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm rounded-3xl">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                  <Layout size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Portfolio Management</h3>
              </div>
              <button className="text-primary text-sm font-black hover:underline uppercase tracking-widest">Manage All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Property</th>
                    <th className="px-6 py-4">Occupancy</th>
                    <th className="px-6 py-4">Monthly Rent</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.properties.slice(0, 3).map((property, i) => (
                    <tr key={property.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'} 
                            alt={property.title} 
                            className="w-12 h-12 rounded-lg object-cover shadow-sm" 
                          />
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{property.title}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{property.address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 max-w-[100px] mb-1">
                          <div 
                            className={`${i % 2 === 0 ? 'bg-emerald-500' : 'bg-amber-500'} h-1.5 rounded-full`} 
                            style={{ width: `${i % 2 === 0 ? '100%' : '85%'}` }}
                          ></div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                          {i % 2 === 0 ? '100% (Occupied)' : 'Available'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">₹{property.rent?.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 ${i % 2 === 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'} text-[10px] font-bold uppercase rounded-full`}>
                          {i % 2 === 0 ? 'Optimal' : 'Attention'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            className="h-8 text-[10px] px-3 font-bold rounded-lg border-slate-200 dark:border-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 dark:hover:bg-blue-900/20"
                            onClick={() => setSelectedProperty(property)}
                          >
                            Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Operational Health Section */}
          <Card className="border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm rounded-3xl">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Operational Health</h3>
              </div>
              <div className="flex gap-2">
                <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                  {requests.filter(r => r.status === 'Pending').length} Pending
                </span>
                <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                  {requests.filter(r => r.status === 'Completed').length} Completed
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">ID / Type</th>
                    <th className="px-6 py-4">Property</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Applied</th>
                    <th className="px-6 py-4">Assigned To</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {requests.map((request) => (
                    <tr 
                      key={request.id} 
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer"
                      onClick={() => {
                        setSelectedTicket({
                          id: request.id,
                          title: request.title || request.type,
                          status: request.status,
                          date: request.date,
                          desc: request.description || `${request.type} requested by tenant.`,
                          tech: request.assigned,
                          expected: 'Scheduled'
                        });
                        setIsTicketDrawerOpen(true);
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{request.id}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{request.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{request.property}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5 w-fit ${
                          request.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          request.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            request.status === 'Pending' ? 'bg-amber-500' :
                            request.status === 'In Progress' ? 'bg-blue-500' :
                            'bg-emerald-500'
                          }`}></div>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {request.date}
                      </td>
                      <td className="px-6 py-4">
                        {request.assigned !== 'TBD' ? (
                          <div className="group/provider relative">
                            <div className="flex items-center gap-2 cursor-help">
                              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[10px] font-black text-blue-600">
                                {request.assigned.charAt(0)}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-black text-slate-700 dark:text-slate-200">{request.assigned}</span>
                                <span className="text-[10px] text-slate-500 font-bold">Technician</span>
                              </div>
                            </div>
                            {/* Hover Tooltip for Details - Enhanced Premium Look */}
                            <div className="absolute bottom-full left-0 mb-3 w-56 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 invisible group-hover/provider:visible opacity-0 group-hover/provider:opacity-100 group-hover/provider:translate-y-0 translate-y-2 scale-95 group-hover/provider:scale-100 transition-all duration-300 ease-out z-50">
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl pointer-events-none"></div>
                              <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-3 relative z-10">Provider Details</p>
                              <div className="space-y-2.5 relative z-10">
                                <div className="flex justify-between items-center pb-1.5 border-b border-slate-100 dark:border-slate-800">
                                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Phone</span>
                                  <span className="text-xs font-black text-slate-800 dark:text-slate-100">{request.providerPhone || '+91 98765 43210'}</span>
                                </div>
                                <div className="flex justify-between items-center pb-1.5 border-b border-slate-100 dark:border-slate-800">
                                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Rating</span>
                                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-md">
                                    <span className="text-amber-500 font-black text-xs">★</span>
                                    <span className="text-amber-600 dark:text-amber-400 font-black text-xs">{request.providerRating || '4.8'}</span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Type</span>
                                  <span className="text-[10px] font-black bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full uppercase tracking-tight">{request.type}</span>
                                </div>
                              </div>
                              {/* Decorative Arrow */}
                              <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-white/90 dark:bg-slate-900/90 border-r border-b border-white/20 dark:border-slate-700/50 transform rotate-45"></div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">Pending Assignment</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Market Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="premium-gradient rounded-xl p-6 text-white overflow-hidden relative shadow-lg shadow-primary/20 group">
              <div className="relative z-10">
                <h4 className="text-xl font-bold">Invest in Growth</h4>
                <p className="text-sm opacity-90 mt-2">New multi-family opportunities identified in Austin Downtown area with projected 14% ROI.</p>
                <button onClick={() => setIsInvestModalOpen(true)} className="mt-6 px-4 py-2 bg-white text-primary font-bold text-sm rounded-lg shadow-lg hover:bg-slate-100 transition-all">Learn More</button>
              </div>
              <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
            </div>
            <Card className="bg-white dark:bg-slate-900 rounded-xl p-6 border-slate-100 dark:border-slate-800 flex flex-col justify-center shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
                  <Lightbulb size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Efficiency Tip</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Enable "Auto-Renew" for lease agreements to reduce vacancy downtime by 12%.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-8">
          {/* Portfolio Growth Chart */}
          <Card className="bg-white dark:bg-slate-900 p-6 rounded-xl border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Portfolio Growth</h3>
              <select className="text-xs font-bold bg-transparent border-none focus:ring-0 text-slate-500 cursor-pointer">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-48 w-full flex items-end justify-between gap-2 px-2">
              {growthHeights.map((h, i) => (
                <div key={i} className="bg-blue-100 dark:bg-blue-900/20 w-full rounded-t-lg relative group transition-all" style={{ height: `${h}%` }}>
                  <div 
                    className="bg-primary absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-500 group-hover:bg-blue-400" 
                    style={{ height: h > 0 ? `${60 + i * 5}%` : '0%' }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            </div>
          </Card>

          {/* Recent Activities */}
          <Card className="bg-white dark:bg-slate-900 p-6 rounded-xl border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6">Recent Activities</h3>
            <div className="space-y-6">
              {displayActivities.map((activity, index) => {
                const Icon = activity.icon;
                const colorMap = {
                  blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
                  emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
                  rose: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
                  slate: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
                  amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                };

                return (
                  <div key={activity.id} className="flex gap-4 relative animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                    {index !== displayActivities.length - 1 && (
                      <div className="absolute left-[15px] top-[32px] bottom-[-15px] w-0.5 bg-slate-100 dark:bg-slate-800"></div>
                    )}
                    <div className={`w-8 h-8 rounded-full ${colorMap[activity.color]} flex items-center justify-center shrink-0 z-10 shadow-sm`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{activity.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{activity.desc}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {isActivityExpanded ? (
              <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-6 animate-in slide-in-from-top-4 duration-300">
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search activities..." 
                      className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-white"
                      value={activitySearch}
                      onChange={e => setActivitySearch(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
                    {['All', 'Lease', 'Payments', 'Maintenance'].map(filter => (
                      <button 
                        key={filter}
                        onClick={() => setActivityFilter(filter)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${activityFilter === filter ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setIsActivityExpanded(false)} className="w-full mt-2 py-2 text-slate-500 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-all uppercase tracking-widest">Collapse Activity</button>
              </div>
            ) : (
              <button onClick={() => setIsActivityExpanded(true)} className="w-full mt-6 py-2 text-primary text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all uppercase tracking-widest">View All Activity</button>
            )}
          </Card>

          {/* Quick Contacts */}
          <div className="bg-slate-900 dark:bg-slate-950 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
            <h3 className="text-sm font-bold mb-4">On-site Managers</h3>
            <div className="flex -space-x-3 mb-4">
              {[1, 2, 3].map(i => (
                <img 
                  key={i} 
                  src={`https://i.pravatar.cc/100?u=${i + 10}`} 
                  alt={`Manager ${i}`} 
                  className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" 
                />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-xs font-bold">+4</div>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">Connect with your regional property leads instantly.</p>
            <Button onClick={() => { setIsManagerDrawerOpen(true); setSelectedManager(managers[0]); }} className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs py-2 rounded-lg border-0">
              Open Messenger
            </Button>
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
          </div>
        </div>
      </div>

      {/* Create Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={() => setIsModalOpen(false)}>
          <div 
            className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Request</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-sm"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleRequestSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Request Category</label>
                <select 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value, type: e.target.value === 'Maintenance' ? 'Plumbing Repair' : e.target.value})}
                >
                  <option>Maintenance</option>
                  <option>Emergency</option>
                  <option>Financial Review</option>
                  <option>Lease Renewal</option>
                  <option>Property Inspection</option>
                  <option>Security</option>
                  <option>Other</option>
                </select>
              </div>

              {formData.category === 'Maintenance' && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Maintenance Type</label>
                  <select 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option>Plumbing Repair</option>
                    <option>Electrical Work</option>
                    <option>HVAC Servicing</option>
                    <option>Interior Painting</option>
                    <option>Deep Cleaning</option>
                    <option>Pest Control</option>
                    <option>Appliance Repair</option>
                    <option>Roofing/Leakage</option>
                    <option>Locksmith/Security</option>
                    <option>Flooring/Carpentry</option>
                    <option>Furniture Assembly</option>
                    <option>Garden Maintenance</option>
                    <option>Other Maintenance</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Property/Unit</label>
                <select 
                  className={`w-full bg-slate-50 dark:bg-slate-800 border ${errors.property ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium`}
                  value={formData.propertyId}
                  onChange={(e) => {
                    const selected = data.properties.find(p => p._id === e.target.value);
                    setFormData({...formData, propertyId: e.target.value, property: selected?.title || ''});
                    if (errors.property) setErrors({...errors, property: null});
                  }}
                >
                  <option value="">Select a property</option>
                  {data.properties.map(p => (
                    <option key={p._id} value={p._id}>{p.title}</option>
                  ))}
                </select>
                {errors.property && <p className="text-rose-500 text-xs font-bold mt-1.5">{errors.property}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Message/Details</label>
                <textarea 
                  rows="4"
                  placeholder="Describe your request..."
                  className={`w-full bg-slate-50 dark:bg-slate-800 border ${errors.message ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium resize-none`}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({...formData, message: e.target.value});
                    if (errors.message) setErrors({...errors, message: null});
                  }}
                ></textarea>
                {errors.message && <p className="text-rose-500 text-xs font-bold mt-1.5">{errors.message}</p>}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
                  <Info size={14} /> Smart Priority Assignment
                </p>
                <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1 font-medium">Priority will be automatically calculated based on the request category and historical asset data.</p>
              </div>

              <div className="pt-4 flex gap-3">
                <Button 
                  type="button"
                  variant="outline" 
                  className="flex-1 font-bold border-slate-200 dark:border-slate-700"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 bg-primary text-white font-bold border-0 shadow-lg shadow-primary/20 hover:bg-blue-700"
                >
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Learn More Modal */}
      {isInvestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={() => setIsInvestModalOpen(false)}>
          <div 
            className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-48 bg-slate-800 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60" alt="Austin Downtown" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
              <button 
                onClick={() => setIsInvestModalOpen(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors bg-black/20 hover:bg-black/40 backdrop-blur-md p-1.5 rounded-full"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-6 left-6">
                <span className="bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">New Opportunity</span>
                <h2 className="text-3xl font-black text-white">Austin Downtown Expansion</h2>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Projected ROI</p>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">14.2%</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Property Type</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">Multi-family (24 Units)</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Investment Range</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">$50k - $250k</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Cash Flow</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">Quarterly Dist.</p>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Executive Summary</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Located in the rapidly growing technology corridor of Austin, this 24-unit Class-A multi-family development offers stable yield with significant appreciation potential. The property is fully entitled with construction slated to begin in Q3. Current market analysis indicates a severe supply shortage for luxury 1 and 2-bedroom units in this specific submarket.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button 
                  className="flex-1 bg-primary text-white font-bold py-3"
                  onClick={() => {
                    toast.success('Call Scheduled! Check your email.');
                    setIsInvestModalOpen(false);
                  }}
                >
                  Schedule a Call
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 flex items-center justify-center gap-2"
                  onClick={() => {
                    toast.success('Prospectus downloaded.');
                  }}
                >
                  <Download size={18} />
                  Download Prospectus
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manager Sliding Drawer */}
      {isManagerDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsManagerDrawerOpen(false)}>
          <div 
            className="w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-slate-100 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <MessageSquare size={20} />
                </div>
                <h2 className="font-bold text-slate-900 dark:text-white">Messages</h2>
              </div>
              <button 
                onClick={() => setIsManagerDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar: Manager List */}
              <div className="w-20 border-r border-slate-100 dark:border-slate-800 flex flex-col items-center py-4 gap-4 overflow-y-auto">
                {managers.map(manager => (
                  <button 
                    key={manager.id}
                    onClick={() => setSelectedManager(manager)}
                    className={`relative p-1 rounded-full transition-all ${selectedManager?.id === manager.id ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900' : 'opacity-70 hover:opacity-100'}`}
                  >
                    <img src={`https://i.pravatar.cc/100?u=${manager.avatar}`} alt={manager.name} className="w-12 h-12 rounded-full object-cover" />
                    <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white dark:border-slate-900 rounded-full ${manager.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                  </button>
                ))}
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm z-10">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{selectedManager?.name}</p>
                  <p className={`text-xs ${selectedManager?.status === 'Online' ? 'text-emerald-500' : 'text-slate-400'}`}>{selectedManager?.status}</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatHistory.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'owner' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${msg.sender === 'owner' ? 'bg-primary text-white rounded-tr-sm' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-sm'}`}>
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 font-medium px-1">{msg.time}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                      value={chatMessage}
                      onChange={e => setChatMessage(e.target.value)}
                    />
                    <button 
                      type="submit"
                      disabled={!chatMessage.trim()}
                      className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                    >
                      <Send size={16} className="-ml-0.5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Maintenance Tickets Modal ── */}
      {isMaintenanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={() => setIsMaintenanceModalOpen(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-rose-50 dark:bg-rose-900/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-xl text-rose-600"><Wrench size={20} /></div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Maintenance & Operations</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{requests.length} total tickets across your portfolio</p>
                </div>
              </div>
              <button onClick={() => setIsMaintenanceModalOpen(false)} className="p-2 rounded-full hover:bg-rose-100 dark:hover:bg-slate-800 text-slate-400 transition-all"><X size={18} /></button>
            </div>
            <div className="px-5 pt-4 pb-2 flex gap-2 border-b border-slate-100 dark:border-slate-800">
              {['All','Pending','In Progress','Completed'].map(f => (
                <button key={f} onClick={() => setTicketFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    ticketFilter === f ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}>
                  {f} {f !== 'All' && `(${requests.filter(r => r.status === f).length})`}
                </button>
              ))}
            </div>
            <div className="overflow-y-auto flex-1">
              {(ticketFilter === 'All' ? requests : requests.filter(r => r.status === ticketFilter)).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <Wrench size={40} className="mb-3 opacity-20" />
                  <p className="text-sm font-medium">No tickets found</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold uppercase tracking-wider sticky top-0">
                    <tr>
                      <th className="px-5 py-3">ID / Type</th>
                      <th className="px-5 py-3">Property</th>
                      <th className="px-5 py-3">Priority</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Applied</th>
                      <th className="px-5 py-3">Assigned To</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(ticketFilter === 'All' ? requests : requests.filter(r => r.status === ticketFilter)).map(req => (
                      <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-4">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{req.id}</p>
                          <p className="text-xs text-slate-500">{req.type}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300 font-medium">{req.property}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            req.priority === 'HIGH' || req.priority === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                            req.priority === 'MEDIUM' || req.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}>{req.priority || 'Normal'}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5 w-fit ${
                            req.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                            req.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              req.status === 'Pending' ? 'bg-amber-500' : req.status === 'In Progress' ? 'bg-blue-500' : 'bg-emerald-500'
                            }`} />
                            {req.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-500">{req.date}</td>
                        <td className="px-5 py-4">
                          {req.assigned && req.assigned !== 'TBD' ? (
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[10px] font-black text-blue-600">{req.assigned.charAt(0)}</div>
                              <div>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{req.assigned}</p>
                                <p className="text-[10px] text-slate-400">{req.providerPhone || 'Technician'}</p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md uppercase tracking-wider">Unassigned</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Property Detail Modal ── */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={() => setSelectedProperty(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="relative h-44 bg-slate-800 shrink-0">
              <img
                src={selectedProperty.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'}
                alt={selectedProperty.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <button onClick={() => setSelectedProperty(null)} className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-black/60 transition-all"><X size={16} /></button>
              <div className="absolute bottom-4 left-4">
                <h2 className="text-lg font-bold text-white">{selectedProperty.title}</h2>
                <p className="text-white/75 text-xs mt-0.5">{selectedProperty.address}</p>
              </div>
            </div>
            <div className="overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-3 gap-3">
                {[['Rent', `₹${selectedProperty.rent?.toLocaleString('en-IN')}/mo`], ['Bedrooms', selectedProperty.bedrooms ?? '—'], ['Bathrooms', selectedProperty.bathrooms ?? '—']].map(([k, v]) => (
                  <div key={k} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{k}</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white mt-1">{v}</p>
                  </div>
                ))}
              </div>
              {selectedProperty.amenities?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.amenities.map(a => (
                      <span key={a} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full">{a}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Tenant Information</p>
                {selectedProperty.tenant ? (
                  <div className="space-y-2">
                    {[['Name', selectedProperty.tenant.name || selectedProperty.tenant],
                      ['Email', selectedProperty.tenant.email || '—'],
                      ['Lease Start', selectedProperty.tenant.leaseStart || '—'],
                      ['Lease End', selectedProperty.tenant.leaseEnd || '—'],
                      ['Monthly Rent', selectedProperty.tenant.monthlyRent ? `₹${selectedProperty.tenant.monthlyRent.toLocaleString('en-IN')}` : `₹${selectedProperty.rent?.toLocaleString('en-IN')}`]
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium">{k}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No current tenant — property is vacant</p>
                )}
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedProperty.status === 'occupied' || selectedProperty.isAvailable === false
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>
                  {selectedProperty.status || (selectedProperty.isAvailable ? 'Available' : 'Occupied')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Ticket Drawer */}
      {isTicketDrawerOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsTicketDrawerOpen(false)}>
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 h-[calc(100vh-3.5rem)] mt-14 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-slate-100 dark:border-slate-800" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><Wrench size={18}/> Ticket {selectedTicket.id}</h2>
              <button onClick={() => setIsTicketDrawerOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedTicket.title}</h3>
                <p className="text-sm text-slate-500 mt-2">{selectedTicket.desc}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="font-bold text-slate-900 dark:text-white">{selectedTicket.status}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Reported</span><span className="font-bold text-slate-900 dark:text-white">{selectedTicket.date}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Assigned To</span><span className="font-bold text-slate-900 dark:text-white">{selectedTicket.tech}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Expected</span><span className="font-bold text-slate-900 dark:text-white">{selectedTicket.expected}</span></div>
              </div>
              
              {/* Progress Tracker */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Progress Tracker</h4>
                <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-6">
                  <div className="relative pl-6">
                    <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center ring-4 ring-white dark:ring-slate-900"><CheckCircle size={10} /></div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Reported</p>
                    <p className="text-xs text-slate-500">Received by system.</p>
                  </div>
                  <div className="relative pl-6">
                    <div className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full ${['In Progress', 'Completed', 'Resolved'].includes(selectedTicket.status) ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700'} ring-4 ring-white dark:ring-slate-900 flex items-center justify-center`}>
                      {['In Progress', 'Completed', 'Resolved'].includes(selectedTicket.status) && <CheckCircle size={10} />}
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Assigned</p>
                    <p className="text-xs text-slate-500">Technician dispatched.</p>
                  </div>
                  <div className="relative pl-6">
                    <div className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full ${['Completed', 'Resolved'].includes(selectedTicket.status) ? 'bg-primary text-white' : selectedTicket.status === 'In Progress' ? 'bg-orange-400 animate-pulse' : 'bg-slate-200 dark:bg-slate-700'} ring-4 ring-white dark:ring-slate-900 flex items-center justify-center`}>
                      {['Completed', 'Resolved'].includes(selectedTicket.status) && <CheckCircle size={10} />}
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">In Progress</p>
                    <p className="text-xs text-slate-500">Work is ongoing.</p>
                  </div>
                  <div className="relative pl-6">
                    <div className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full ${['Completed', 'Resolved'].includes(selectedTicket.status) ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700'} ring-4 ring-white dark:ring-slate-900 flex items-center justify-center`}>
                      {['Completed', 'Resolved'].includes(selectedTicket.status) && <CheckCircle size={10} />}
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Resolved</p>
                    <p className="text-xs text-slate-500">Issue fixed.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button & Window */}
      <SupportChat initialMessages={data?.messages || []} userId={data?.userId} />

      {/* Add Property Modal */}
      <AddPropertyModal 
        isOpen={isAddPropertyModalOpen}
        onClose={() => setIsAddPropertyModalOpen(false)}
        onSubmit={handleAddProperty}
      />
    </div>
  );
};

export default OwnerDashboard;
