import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wrench, Wallet, Star, Droplets, Zap, Palette, ArrowRight, Filter, 
  MoreVertical, Headphones, MessageSquare, Phone, Calendar, TrendingUp,
  MapPin, CheckCircle, Clock, Search, Bell, Mail, Plus, X, Send, Download,
  AlertCircle, BellRing
} from 'lucide-react';
import { Card } from '../common/Card';
import Button from '../common/Button';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import L from 'leaflet';
import { getSocket, joinUserRoom } from '../../services/socket';
import PointsBreakdown from '../rewards/PointsBreakdown';

const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};



const chartData = {
  Weekly: [{ name: 'Mon', val: 0 }, { name: 'Tue', val: 0 }, { name: 'Wed', val: 0 }, { name: 'Thu', val: 0 }, { name: 'Fri', val: 0 }],
  Monthly: [{ name: 'Wk1', val: 0 }, { name: 'Wk2', val: 0 }, { name: 'Wk3', val: 0 }, { name: 'Wk4', val: 0 }],
  Yearly: [{ name: 'Q1', val: 0 }, { name: 'Q2', val: 0 }, { name: 'Q3', val: 0 }, { name: 'Q4', val: 0 }]
}; // Placeholder — overridden by dynamic data below

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded shadow-xl font-bold">
        {label}: ₹{(payload[0].value * 1000).toLocaleString('en-IN')}
      </div>
    );
  }
  return null;
};

const ServiceDashboard = ({ data }) => {
  const navigate = useNavigate();

  const [localRequests, setLocalRequests] = useState([]);
  const [localSchedule, setLocalSchedule] = useState([]);
  const [localHistory, setLocalHistory] = useState([]);
  const [activeJobsCount, setActiveJobsCount] = useState(0);

  const FALLBACK_HISTORY = [];
  const FALLBACK_SCHEDULE = [];

  // Compute dynamic earnings from history
  const totalEarned = localHistory.reduce((sum, h) => sum + (parseFloat(h.cost) || 0), 0);
  const serviceFee = +(totalEarned * 0.05).toFixed(2);      // 5% platform fee
  const reimbursements = +(totalEarned * 0.15).toFixed(2);  // 15% material reimbursements
  const netPayout = +(totalEarned - serviceFee + reimbursements).toFixed(2);

  // Build chart data from history (last 5 completed jobs for weekly, etc.)
  const buildChartData = (histArr, period) => {
    if (!histArr.length) return chartData[period];
    if (period === 'Weekly') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      return days.map(d => ({ name: d, val: 0 })); // will fill when backend sends day-keyed data
    }
    return chartData[period];
  };
  const dynamicChartData = {
    Weekly: buildChartData(localHistory, 'Weekly'),
    Monthly: buildChartData(localHistory, 'Monthly'),
    Yearly: buildChartData(localHistory, 'Yearly'),
  };

  useEffect(() => {
    if (data) {
      setLocalRequests(data.availableRequests || []);
      setLocalSchedule(data.activeSchedule?.length > 0 ? data.activeSchedule : FALLBACK_SCHEDULE);
      setLocalHistory(data.history?.length > 0 ? data.history : FALLBACK_HISTORY);
      setActiveJobsCount(data.activeSchedule?.length > 0 ? data.activeSchedule.length : FALLBACK_SCHEDULE.length);
    } else {
      setLocalSchedule(FALLBACK_SCHEDULE);
      setLocalHistory(FALLBACK_HISTORY);
      setActiveJobsCount(FALLBACK_SCHEDULE.length);
    }
  }, [data]);

  // Modals
  const [acceptJobModal, setAcceptJobModal] = useState(null);
  const [assignedTech, setAssignedTech] = useState('Self');
  const [miniMapModal, setMiniMapModal] = useState(null);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [scheduleDetailModal, setScheduleDetailModal] = useState(null);
  const [historyDetailModal, setHistoryDetailModal] = useState(null);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  // Real-time notification state
  const [newTaskAlerts, setNewTaskAlerts] = useState([]);
  const [newJobsCount, setNewJobsCount] = useState(0);

  // States
  const [earningsPeriod, setEarningsPeriod] = useState('Weekly');
  const [earningsMenuOpen, setEarningsMenuOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hi! How can we help you with your current job?", sender: "Support Agent", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
  ]);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCurrentLocation([pos.coords.latitude, pos.coords.longitude]),
        () => console.log('Geolocation failed')
      );
    }
  }, []);

  // ── Socket.io: listen for real-time ticket notifications ───────
  useEffect(() => {
    const socket = getSocket();

    // Join personal room if logged in (use data.userId if available)
    if (data?.userId) joinUserRoom(data.userId);

    const handleNewTicket = (ticket) => {
      // Show bold toast
      toast.custom((t) => (
        <div className={`${
          t.visible ? 'animate-in slide-in-from-top-2' : 'animate-out slide-out-to-top-2'
        } flex items-start gap-3 bg-white dark:bg-slate-900 border-l-4 border-rose-500 rounded-xl shadow-2xl p-4 max-w-sm`}>
          <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg text-rose-600 shrink-0">
            <BellRing size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-sm text-slate-900 dark:text-white">New Task Assigned!</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 truncate">{ticket.title}</p>
            <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mt-1">{ticket.priority} Priority · {ticket.category}</p>
          </div>
          <button onClick={() => toast.dismiss(t.id)} className="text-slate-400 hover:text-slate-600 shrink-0">
            <X size={14} />
          </button>
        </div>
      ), { duration: 8000, position: 'top-right' });

      // Add to inline alert banners
      setNewTaskAlerts(prev => [{ ...ticket, alertId: Date.now() }, ...prev.slice(0, 4)]);

      // Increment new jobs counter on metric card
      setNewJobsCount(prev => prev + 1);

      // If assigned directly (common in admin-assigned model), add to schedule
      const schedItem = {
        _id: ticket.ticketId || `sch-${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: ticket.title,
        color: 'bg-primary',
        property: { title: ticket.property, address: ticket.property },
        type: ticket.category || 'Service Request',
        status: 'Scheduled',
        assignedTech: 'Self',
        isNew: true,
      };
      
      setLocalSchedule(prev => [schedItem, ...prev]);
      setActiveJobsCount(prev => prev + 1);

      // Dispatch global event so Navbar notification bell updates
      window.dispatchEvent(new CustomEvent('rentify:new_ticket', { detail: ticket }));
    };

    socket.on('new_ticket', handleNewTicket);
    socket.on('new_ticket_broadcast', handleNewTicket);

    return () => {
      socket.off('new_ticket', handleNewTicket);
      socket.off('new_ticket_broadcast', handleNewTicket);
    };
  }, [data]);
  // ──────────────────────────────────────────────────────────────

  const handleAcceptJob = () => {
    const job = acceptJobModal;
    setLocalRequests(prev => prev.map(r => r._id === job._id ? { ...r, status: 'Accepted' } : r));
    const schedItem = {
      _id: `sch-new-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: job.title || job.type,
      color: 'bg-primary',
      property: job.property,
      type: job.type || 'Service Request',
      status: 'Scheduled',
      assignedTech,
      lat: job.lat,
      lng: job.lng,
    };
    setLocalSchedule(prev => [...prev, schedItem]);
    setActiveJobsCount(prev => prev + 1);
    toast.success(`Job Accepted! Assigned to ${assignedTech} ✓`, { style: { background: '#333', color: '#fff', borderRadius: '10px' } });

    // Notify Owner Dashboard
    window.dispatchEvent(new CustomEvent('rentify:ticket_update', {
      detail: {
        ticketId: job._id,
        status: 'Accepted',
        assignedTech,
        type: job.type || 'Maintenance',
        property: job.property?.title || job.property || 'Your Property',
      }
    }));

    setAcceptJobModal(null);
    setAssignedTech('Self');
  };

  const handleOpenDirections = (address) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, '_blank');
    setMiniMapModal(null);
  };

  const handleDownloadStatement = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("Rentify Service Statement", 20, 20);
      doc.setFontSize(12);
      doc.text("Technician: Rentify Provider", 20, 30);
      doc.text(`Date Range: ${earningsPeriod}`, 20, 40);
      
      doc.autoTable({
        startY: 50,
        head: [['Job ID', 'Property', 'Type', 'Date', 'Amount']],
        body: localHistory.map(h => [h._id, 'Various', h.type || h.title, new Date(h.createdAt).toLocaleDateString(), h.amount || '₹0'])
      });

      const finalY = doc.lastAutoTable.finalY || 50;
      doc.text("Summary:", 20, finalY + 10);
      doc.text("Service Fees: -₹840", 20, finalY + 20);
      doc.text("Material Reimbursements: +₹2,400", 20, finalY + 30);
      doc.setFontSize(16);
      doc.text("Net Payout: ₹1,26,066", 20, finalY + 50);
      doc.line(20, finalY + 70, 80, finalY + 70);
      doc.setFontSize(10);
      doc.text("Authorized Signature", 20, finalY + 75);
      
      doc.save(`Service_Statement_${earningsPeriod}.pdf`);
    } catch (e) {
      toast.error("Error generating PDF");
    }
  };

  const handleDownloadReceipt = (job) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("Service Receipt", 20, 20);
      doc.setFontSize(12);
      doc.text(`Job: ${job.title}`, 20, 30);
      doc.text(`Date: ${job.date}`, 20, 40);
      doc.text(`Description: ${job.desc}`, 20, 50);
      doc.setFontSize(16);
      doc.text(`Amount: ${job.amount}`, 20, 70);
      doc.save(`Receipt_${job.id}.pdf`);
    } catch(e) {}
  };

  const handleSendChat = () => {
    if(!chatInput.trim()) return;
    setChatMessages([...chatMessages, { id: Date.now(), text: chatInput, sender: "You", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: Date.now()+1, text: "Thanks for your message, an agent will be right with you.", sender: "System", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    }, 1000);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Service Provider Report", 20, 20);
    doc.save("Service_Report.pdf");
  };

  if (!data) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12 relative overflow-hidden">

      {/* ── Real-time New Task Alert Banners ── */}
      {newTaskAlerts.length > 0 && (
        <div className="space-y-2">
          {newTaskAlerts.map((alert) => (
            <div key={alert.alertId}
              className="flex items-center gap-4 p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800 rounded-2xl animate-in slide-in-from-top-2 duration-300">
              <div className="p-2.5 bg-rose-100 dark:bg-rose-900/30 rounded-xl text-rose-600 shrink-0">
                <BellRing size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm text-rose-900 dark:text-rose-100">🔔 New Task Assigned: {alert.title}</p>
                <p className="text-xs text-rose-700/80 dark:text-rose-300/80 mt-0.5">
                  {alert.property} · <span className="font-bold uppercase">{alert.priority} Priority</span> · {alert.category}
                </p>
              </div>
              <button
                onClick={() => setNewTaskAlerts(prev => prev.filter(a => a.alertId !== alert.alertId))}
                className="p-1.5 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-500 transition-all shrink-0">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Service Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg">Manage your active jobs and property maintenance requests.</p>
        </div>
        <div className="flex space-x-3">
          <span className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold flex items-center shadow-sm">
            <Calendar size={18} className="mr-2 text-primary" />
            24 April, 2026
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-xl group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
              <Wrench size={24} />
            </div>
            <span className={`font-bold text-xs flex items-center px-2 py-1 rounded-full transition-all ${
              newJobsCount > 0
                ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 animate-pulse'
                : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
            }`}>
              <TrendingUp size={14} className="mr-1" />
              {newJobsCount > 0 ? `+${newJobsCount} New` : '+2 New'}
            </span>
          </div>
          <div className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">Active Jobs</div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{activeJobsCount}</div>
          {newJobsCount > 0 && (
            <p className="text-[10px] font-bold text-rose-500 mt-2 uppercase tracking-wider flex items-center gap-1">
              <BellRing size={10} /> {newJobsCount} unread request{newJobsCount > 1 ? 's' : ''} pending
            </p>
          )}
        </Card>

        <Card className="p-6 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-xl group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
              <Wallet size={24} />
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
              <TrendingUp size={14} className="mr-1" />
              0%
            </span>
          </div>
          <div className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">Total Earnings</div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mt-1">₹0</div>
        </Card>

        <Card className="p-6 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-xl group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-600 dark:text-amber-400">
              <Star size={24} fill="currentColor" />
            </div>
            <span className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">N/A</span>
          </div>
          <div className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">Client Rating</div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mt-1">0.00<span className="text-lg text-slate-400 font-normal">/5.0</span></div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          {/* Available Service Requests Table - Hidden for New Users or by Admin Assignment Policy */}
          {localHistory.length > 0 && (
            <Card className="bg-white dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white">Available Service Requests</h3>
                  {newJobsCount > 0 && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-xs font-black rounded-full animate-pulse">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                      {newJobsCount} new
                    </span>
                  )}
                </div>
                <button onClick={() => navigate('/service-requests')} className="text-primary font-bold text-sm flex items-center hover:underline">
                  View All <ArrowRight size={16} className="ml-1" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Job Type</th>
                      <th className="px-6 py-4">Property</th>
                      <th className="px-6 py-4">Urgency</th>
                      <th className="px-6 py-4">Estimate</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {localRequests.map((job) => (
                      <tr key={job._id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${
                        job.isNew ? 'bg-rose-50/50 dark:bg-rose-900/5 border-l-2 border-rose-400' : ''
                      }`}>
                        <td className="px-6 py-5">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${job.iconColor || 'bg-blue-50 text-blue-600'} relative`}>
                              <Wrench size={20} />
                              {job.isNew && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                                {job.title || job.type}
                                {job.isNew && <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[9px] font-black rounded uppercase">New</span>}
                              </div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ID: #{String(job._id).slice(-6)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm font-medium text-slate-600 dark:text-slate-400">{job.property?.title || 'Unknown Property'}</div>
                          <p className="text-[10px] text-slate-400">{job.property?.address}</p>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setMiniMapModal(job); }}
                            className="flex items-center gap-1 text-primary text-[10px] font-black uppercase tracking-widest hover:underline mt-1 group"
                          >
                            <MapPin size={10} className="group-hover:translate-y-[-1px] transition-transform" />
                            Get Directions
                          </button>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${job.urgencyColor}`}>
                            {job.urgency}
                          </span>
                        </td>
                        <td className="px-6 py-5 font-bold text-slate-900 dark:text-white">{job.estimate}</td>
                        <td className="px-6 py-5">
                          {job.status === 'Accepted' ? (
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg w-fit">
                              <CheckCircle size={14} /> Accepted ✓
                            </span>
                          ) : job.status === 'Completed' ? (
                            <span className="text-slate-400 text-xs font-bold uppercase">Completed</span>
                          ) : (
                            <Button onClick={() => setAcceptJobModal(job)} className="bg-primary text-white border-0 px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all">
                              Accept Job
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Map Section */}
          <Card className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border-slate-100 dark:border-slate-800 mt-8 relative z-0">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-slate-900 dark:text-white">My Job Map</h3>
              <Button onClick={() => {
                const pending = localRequests.find(r => r.status === 'Accepted' || r.status === 'OPEN');
                if(pending) handleOpenDirections(pending.property?.address);
                else toast.error('No pending jobs found!');
              }} className="bg-primary text-white border-0 py-2">
                Navigate to Next Job
              </Button>
            </div>
            <div className="h-[400px] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 relative z-0">
              <MapContainer center={[19.1136, 72.8697]} zoom={11} className="w-full h-full">
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                {currentLocation && (
                   <Marker position={currentLocation} icon={createCustomIcon('#a855f7')}>
                     <Popup><b>Your Location</b></Popup>
                   </Marker>
                )}
                {localRequests.map(job => (
                  <Marker key={job._id} position={[job.property?.location?.coordinates?.[1] || 19.1136, job.property?.location?.coordinates?.[0] || 72.8697]} icon={createCustomIcon(job.urgency === 'Emergency' ? '#ef4444' : job.status === 'RESOLVED' ? '#10b981' : '#3b82f6')}>
                    <Popup>
                      <div className="space-y-1 p-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">{job._id.toString().slice(-6)}</div>
                        <div className="font-black text-sm">{job.property?.title}</div>
                        <div className="text-xs text-slate-600">{job.title}</div>
                        <div className="font-bold text-primary text-xs mt-2">₹{job.estimatedCost || 'TBD'}</div>
                        <div className="flex gap-2 mt-3">
                          {job.status === 'OPEN' && <button onClick={() => setAcceptJobModal(job)} className="bg-primary text-white px-3 py-1 rounded text-xs font-bold flex-1">Accept</button>}
                          <button onClick={() => handleOpenDirections(job.property?.address)} className="bg-slate-100 text-slate-700 px-3 py-1 rounded text-xs font-bold flex-1 border border-slate-200">Directions</button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
            <div className="mt-4 flex gap-4 text-xs font-bold text-slate-600 dark:text-slate-400 justify-center">
               <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full border border-white shadow-sm"></div> Emergency</span>
               <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-full border border-white shadow-sm"></div> Standard</span>
               <span className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-full border border-white shadow-sm"></div> Completed</span>
               <span className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-500 rounded-full border border-white shadow-sm"></div> Current Location</span>
            </div>
          </Card>

          {/* Job History Bento Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl text-slate-900 dark:text-white">Job History</h3>
              <div className="flex space-x-2 relative">
                <button onClick={() => setFilterPanelOpen(!filterPanelOpen)} className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 transition-colors">
                  <Filter size={18} className="text-slate-500" />
                </button>
                {filterPanelOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 p-4 z-10">
                    <h4 className="font-bold text-sm mb-3">Filter History</h4>
                    <select className="w-full mb-3 p-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-900 dark:border-slate-700 outline-none"><option>All Statuses</option><option>Completed</option><option>Cancelled</option></select>
                    <select className="w-full mb-4 p-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-900 dark:border-slate-700 outline-none"><option>All Job Types</option><option>HVAC</option><option>Electrical</option><option>Plumbing</option></select>
                    <div className="flex gap-2">
                       <Button onClick={() => setFilterPanelOpen(false)} variant="outline" className="flex-1 py-1 text-xs">Clear</Button>
                       <Button onClick={() => { setFilterPanelOpen(false); toast.success('Filters applied'); }} className="flex-1 py-1 text-xs bg-primary text-white border-0">Apply</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {localHistory.map((job, i) => (
                <Card onClick={() => setHistoryDetailModal(job)} key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all cursor-pointer">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-black uppercase">{job.status}</div>
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{job.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{job.description}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{job.cost || '0'}</span>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} size={14} fill={idx < (job.rating || 5) ? "currentColor" : "none"} className={idx < (job.rating || 5) ? "" : "text-slate-200 dark:text-slate-700"} />
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar Panel */}
        <div className="lg:col-span-4 space-y-8">
          {/* Earnings Analytics */}
          <Card className="bg-white dark:bg-slate-900 p-8 rounded-2xl border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-8 relative">
              <h3 className="font-bold text-slate-900 dark:text-white">Earnings Analytics</h3>
              <button onClick={() => setEarningsMenuOpen(!earningsMenuOpen)} className="p-1"><MoreVertical size={18} className="text-slate-400 cursor-pointer hover:text-slate-700" /></button>
              {earningsMenuOpen && (
                 <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1 z-10">
                    <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">Change Period</div>
                    {['Weekly', 'Monthly', 'Yearly'].map(period => (
                       <button key={period} onClick={() => { setEarningsPeriod(period); setEarningsMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${earningsPeriod === period ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`}>
                         {period}
                       </button>
                    ))}
                    <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                    <button onClick={() => { handleDownloadStatement(); setEarningsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">Download CSV</button>
                 </div>
              )}
            </div>
            <div className="space-y-6">
              <div className="h-40 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dynamicChartData[earningsPeriod]} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} dy={10} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                    <Bar dataKey="val" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Service Fees (5%)</span>
                  <span className="font-bold text-slate-900 dark:text-white">-₹{serviceFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Material Reimbursements</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">+₹{reimbursements.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Net Payout</span>
                  <span className="text-2xl font-black text-primary">₹{netPayout.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <Button onClick={handleDownloadStatement} variant="outline" className="w-full py-3 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-bold rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center">
                <Download size={16} className="mr-2"/> Download Statement
              </Button>
            </div>
          </Card>

          {/* Support Center */}
          <Card className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-2xl text-white shadow-xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-125 transition-transform duration-1000"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-6">
                <Headphones size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Need Assistance?</h3>
              <p className="text-blue-100 text-sm mb-8 leading-relaxed opacity-90">Our support team is available 24/7 for emergency job technical issues.</p>
              <div className="space-y-3">
                <Button onClick={() => setChatDrawerOpen(true)} className="w-full bg-white text-blue-700 hover:bg-slate-100 py-3 rounded-xl font-bold shadow-lg border-0 transition-all flex items-center justify-center">
                  <MessageSquare size={16} className="mr-2" />
                  Start Live Chat
                </Button>
                <Button onClick={() => setSupportModalOpen(true)} className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold border border-white/20 transition-all flex items-center justify-center">
                  <Phone size={16} className="mr-2" />
                  Call Support
                </Button>
              </div>
            </div>
          </Card>

          {/* Today's Schedule Small List */}
          <Card className="bg-white dark:bg-slate-900 p-8 rounded-2xl border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Today's Schedule</h3>
            <div className="space-y-4">
              {localSchedule.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar size={20} className="text-slate-400" />
                  </div>
                  <p className="text-sm font-bold text-slate-400">No jobs scheduled today</p>
                  <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">Accept a request to see it here</p>
                </div>
              ) : (
                localSchedule.map((item) => {
                  const isInProgress = item.status === 'IN_PROGRESS' || item.status === 'In Progress';
                  const isCompleted  = item.status === 'RESOLVED'    || item.status === 'Completed';
                  const propName = item.property?.title || item.property || '';
                  const displayTime = item.time || (item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD');
                  return (
                    <div key={item._id} className="flex items-center space-x-4 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 p-2 rounded-xl transition-colors" onClick={() => setScheduleDetailModal(item)}>
                      <div className={`w-1.5 h-12 ${
                        isCompleted ? 'bg-emerald-500' : isInProgress ? 'bg-primary animate-pulse' : 'bg-amber-400'
                      } rounded-full shadow-lg transition-transform group-hover:scale-y-110 shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{displayTime}</div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate flex items-center gap-2">
                          {item.title}
                          {item.isNew && <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[8px] font-black rounded uppercase animate-pulse">New</span>}
                        </div>
                        {propName && <div className="text-[10px] text-slate-400 truncate">{propName}</div>}
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          isCompleted  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          isInProgress ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                         'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>{item.status}</span>
                        <span className="text-[9px] text-slate-400 font-medium">{item.assignedTech || 'Self'}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* Points Breakdown Card */}
          <PointsBreakdown defaultTab="service" />

        </div>
      </div>

      {/* Modals & Overlays */}
      
      {/* Accept Job Confirmation Modal */}
      {acceptJobModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl max-w-sm w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Accept Job?</h3>
            <p className="text-slate-500 text-sm mb-4">Are you sure you want to accept <strong>{acceptJobModal.title || acceptJobModal.type}</strong> at <strong>{acceptJobModal.property?.title || acceptJobModal.property || 'this property'}</strong>?</p>
            <div className="mb-6">
              {/* Assign To selection removed per user request */}
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setAcceptJobModal(null)} variant="outline" className="flex-1 rounded-xl">Cancel</Button>
              <Button onClick={handleAcceptJob} className="flex-1 bg-primary text-white border-0 rounded-xl">Confirm Accept</Button>
            </div>
          </div>
        </div>
      )}

      {/* Mini Map Modal */}
      {miniMapModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={() => setMiniMapModal(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden p-2" onClick={e => e.stopPropagation()}>
             <div className="p-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
               <h3 className="font-bold flex items-center gap-2"><MapPin className="text-primary"/> Location Preview</h3>
               <button onClick={() => setMiniMapModal(null)} className="text-slate-400 hover:bg-slate-100 p-1 rounded-full"><X size={20}/></button>
             </div>
             <div className="h-64 w-full relative z-0">
               <MapContainer center={[miniMapModal.lat, miniMapModal.lng]} zoom={14} className="w-full h-full">
                 <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                 <Marker position={[miniMapModal.lat, miniMapModal.lng]} icon={createCustomIcon('#3b82f6')}></Marker>
               </MapContainer>
             </div>
             <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl flex flex-col gap-3">
              <div className="font-bold text-sm text-slate-900 dark:text-white">{miniMapModal.property?.title || miniMapModal.property || 'Property'}</div>
               <Button onClick={() => handleOpenDirections(miniMapModal.property?.address || miniMapModal.property?.title || miniMapModal.property)} className="w-full bg-primary text-white border-0 py-3 rounded-xl shadow-lg shadow-primary/20">Open in Google Maps <ArrowRight size={16} className="ml-2"/></Button>
             </div>
          </div>
        </div>
      )}

      {/* Support Chat Floating Widget */}
      {chatDrawerOpen && (
        <div
          className="fixed bottom-6 right-6 z-[150] flex flex-col rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/20 dark:shadow-black/50 border border-slate-200 dark:border-slate-700 animate-in slide-in-from-bottom-4 fade-in duration-300 bg-white dark:bg-slate-900"
          style={{ width: '360px', maxWidth: 'calc(100vw - 2rem)', height: '500px', maxHeight: 'calc(100vh - 120px)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center font-bold text-sm">SA</div>
              <div>
                <div className="font-bold text-sm leading-tight">Support Agent</div>
                <div className="text-[10px] text-blue-200 flex items-center gap-1 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                  Online
                </div>
              </div>
            </div>
            <button
              onClick={() => setChatDrawerOpen(false)}
              className="text-white/70 hover:text-white hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages — scrollable */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-900/50 min-h-0">
            {chatMessages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                <div className="text-[10px] text-slate-400 mb-1 font-bold px-1">{msg.sender} • {msg.time}</div>
                <div className={`p-3 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'You'
                    ? 'bg-primary text-white rounded-tr-sm'
                    : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-tl-sm text-slate-700 dark:text-slate-200'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input — fixed at bottom */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2 shrink-0">
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendChat()}
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm transition-all dark:text-white"
            />
            <button
              onClick={handleSendChat}
              className="bg-primary hover:bg-blue-700 active:scale-95 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md shadow-blue-500/20 shrink-0"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Call Support Modal */}
      {supportModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={() => setSupportModalOpen(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden p-6 text-center animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
             <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <Phone size={28} />
             </div>
             <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Call Support</h3>
             <p className="text-slate-500 text-sm mb-6">1-800-RENTIFY</p>
             <div className="space-y-3 text-left">
               <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center gap-3"><div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">1</div><span className="font-bold text-sm">Emergency Tech Support</span></div>
               <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center gap-3"><div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</div><span className="font-bold text-sm">Payment Issues</span></div>
               <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center gap-3"><div className="w-6 h-6 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-xs font-bold">3</div><span className="font-bold text-sm">General Queries</span></div>
             </div>
             <Button onClick={() => window.open('tel:18007627873')} className="w-full mt-6 bg-primary text-white border-0 py-3 rounded-xl shadow-lg">Call Now</Button>
          </div>
        </div>
      )}

      {/* History Detail Modal */}
      {historyDetailModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={() => setHistoryDetailModal(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl p-8 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
               <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1"><CheckCircle size={14}/> {historyDetailModal.status}</div>
               <button onClick={() => setHistoryDetailModal(null)} className="text-slate-400 bg-slate-50 p-2 rounded-full hover:bg-slate-100"><X size={16}/></button>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{historyDetailModal.title}</h2>
            <div className="text-slate-500 text-sm mb-6 flex items-center gap-2"><MapPin size={14}/> Property: Riverside Towers (Mock)</div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl mb-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">"{historyDetailModal.desc}"</p>
            </div>
            <div className="flex justify-between items-center py-4 border-y border-slate-100 dark:border-slate-800 mb-6">
               <div className="text-sm font-bold text-slate-500">Total Earnings</div>
               <div className="text-2xl font-black text-emerald-600">{historyDetailModal.amount}</div>
            </div>
            <Button onClick={() => { handleDownloadReceipt(historyDetailModal); toast.success('Receipt downloading...'); }} className="w-full bg-slate-900 text-white border-0 py-3 rounded-xl flex items-center justify-center gap-2"><Download size={18}/> Download Receipt</Button>
          </div>
        </div>
      )}

      {/* Schedule Detail Modal */}
      {scheduleDetailModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={() => setScheduleDetailModal(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm shadow-2xl p-6 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="inline-block p-4 bg-blue-50 rounded-full text-blue-600 mb-4"><Clock size={32}/></div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{scheduleDetailModal.title}</h2>
              <div className="text-primary font-bold mt-1">{scheduleDetailModal.time}</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-bold">Property</span>
                <span className="font-bold text-right text-slate-900 dark:text-white">{scheduleDetailModal.property?.title || scheduleDetailModal.property || '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-bold">Type</span>
                <span className="font-bold text-right text-slate-900 dark:text-white">{scheduleDetailModal.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-bold">Assigned To</span>
                <span className="font-bold text-right text-blue-600">{scheduleDetailModal.assignedTech || 'Self'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-bold">Status</span>
                <span className={`font-bold text-right ${scheduleDetailModal.status === 'In Progress' ? 'text-blue-600' : scheduleDetailModal.status === 'Completed' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>{scheduleDetailModal.status}</span>
              </div>
            </div>

            {/* Reassign technician */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Reassign Technician</label>
              <select
                defaultValue={scheduleDetailModal.assignedTech || 'Self'}
                onChange={e => setLocalSchedule(prev => prev.map(s => s._id === scheduleDetailModal._id ? { ...s, assignedTech: e.target.value } : s))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white">
                {['Self', 'Suresh Plumber', 'Ravi Electrician', 'Mohan HVAC', 'Deepak Carpenter', 'Amit Painter'].map(t => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-3">
              {scheduleDetailModal.status === 'Scheduled' && (
                <Button onClick={() => {
                  setLocalSchedule(prev => prev.map(s => s._id === scheduleDetailModal._id ? { ...s, status: 'In Progress' } : s));
                  setScheduleDetailModal(s => ({ ...s, status: 'In Progress' }));
                  toast.success('Job started! Timer running ⏱️');

                  // Notify Owner Dashboard
                  window.dispatchEvent(new CustomEvent('rentify:ticket_update', {
                    detail: {
                      ticketId: scheduleDetailModal._id,
                      status: 'In Progress',
                      assignedTech: scheduleDetailModal.assignedTech || 'Self',
                      type: scheduleDetailModal.type,
                      property: scheduleDetailModal.property?.title || scheduleDetailModal.property || 'Your Property',
                    }
                  }));
                }} className="w-full bg-primary text-white border-0 py-3 rounded-xl">Start Job</Button>
              )}
              {scheduleDetailModal.status === 'In Progress' && (
                <Button onClick={() => {
                  const completed = scheduleDetailModal;
                  setLocalSchedule(prev => prev.filter(s => s._id !== completed._id));
                  setActiveJobsCount(prev => Math.max(0, prev - 1));
                  const earnings = '+₹' + (Math.floor(Math.random() * 8000) + 2000).toLocaleString('en-IN');
                  const historyEntry = {
                    _id: completed._id,
                    title: completed.title,
                    date: new Date().toLocaleDateString('en-IN'),
                    desc: `${completed.type} completed at ${completed.property?.title || completed.property || 'property'}.`,
                    amount: earnings,
                    rating: 5,
                    status: 'Completed',
                    type: completed.type,
                    cost: String(Math.floor(Math.random() * 8000) + 2000),
                    assignedTech: completed.assignedTech || 'Self',
                  };
                  setLocalHistory(prev => [historyEntry, ...prev]);
                  toast.success('Job complete! Added to history 💰', { icon: '✅' });

                  // Notify Owner Dashboard
                  window.dispatchEvent(new CustomEvent('rentify:ticket_update', {
                    detail: {
                      ticketId: completed._id,
                      status: 'Completed',
                      assignedTech: completed.assignedTech || 'Self',
                      type: completed.type,
                      property: completed.property?.title || completed.property || 'Your Property',
                      earnings,
                    }
                  }));

                  setScheduleDetailModal(null);
                }} className="w-full bg-emerald-500 text-white border-0 py-3 rounded-xl">Mark Complete</Button>
              )}
              <Button onClick={() => handleOpenDirections(scheduleDetailModal.property?.address || scheduleDetailModal.property?.title || scheduleDetailModal.property)} variant="outline" className="w-full py-3 rounded-xl border-slate-200 flex justify-center items-center gap-2"><MapPin size={16}/> Get Directions</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ServiceDashboard;
