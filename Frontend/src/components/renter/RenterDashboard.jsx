import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';
import SignatureCanvas from 'react-signature-canvas';
import { 
  LayoutDashboard, 
  Building, 
  Calendar, 
  BarChart3, 
  Wrench, 
  DollarSign, 
  Settings, 
  HelpCircle, 
  Search, 
  Bell, 
  Mail, 
  FileText, 
  Star, 
  ArrowRight, 
  Bed, 
  Bath, 
  Droplets, 
  Wind, 
  ChevronRight, 
  Tag, 
  CalendarCheck, 
  MapPin, 
  Plus,
  CreditCard,
  Download,
  X,
  CheckCircle,
  Clock,
  MessageSquare,
  Send,
  User,
  ArrowRightCircle,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../common/Card';
import Button from '../common/Button';
import NewRequestModal from '../owner/modals/NewRequestModal';
import chatService from '../../services/chatService';
import SupportChat from '../common/SupportChat';
import workflowService from '../../services/workflowService';

const RenterDashboard = ({ data }) => {
  const navigate = useNavigate();

  // States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('Pending'); // or 'Paid'
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const [isTicketDrawerOpen, setIsTicketDrawerOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapFilter, setMapFilter] = useState('Property');

  // Lease Renewal States
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);
  const [renewalStep, setRenewalStep] = useState(1);
  const [renewalDuration, setRenewalDuration] = useState(12);
  const signatureRef = React.useRef(null);

  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [tickets, setTickets] = React.useState([]);
  const [tourRequests, setTourRequests] = useState([]);
  const [loadingTours, setLoadingTours] = useState(false);

  React.useEffect(() => {
    if (data?.maintenanceTickets) {
      setTickets(data.maintenanceTickets);
    }
    fetchTours();
  }, [data]);

  const fetchTours = async () => {
    try {
      setLoadingTours(true);
      // We'll need an endpoint to get user's own workflow requests
      // For now, we can filter them if we had a general get requests, or just use a specific one
      const response = await workflowService.getAdminRequests(); 
      // In a real app, backend should filter by user. For now, we filter frontend.
      setTourRequests(response.filter(r => r.requester?._id === data.userId || r.requester === data.userId));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTours(false);
    }
  };

  const handleConfirmTour = async (id) => {
    try {
      await workflowService.updateRequest(id, { status: 'CONFIRMED' });
      toast.success('Interest confirmed! Admin will now finalize the assignment. ✓');
      fetchTours();
    } catch (err) {
      toast.error('Failed to confirm');
    }
  };

  React.useEffect(() => {
    const handleUpdate = (e) => {
      const { ticketId, status } = e.detail;
      setTickets(prev => prev.map(t => 
        t._id?.toString().slice(-6).toUpperCase() === ticketId || t.id === ticketId
          ? { ...t, status }
          : t
      ));
      
      // Update selected ticket drawer if it's open and matches
      setSelectedTicket(prev => {
        if (prev && (prev.id === ticketId)) {
          return { ...prev, status };
        }
        return prev;
      });
    };

    window.addEventListener('rentify:ticket_update', handleUpdate);
    return () => window.removeEventListener('rentify:ticket_update', handleUpdate);
  }, []);

  if (!data) return null;

  const lease = data.lease;
  const suggestedProperties = data.properties || [];

  // Localized rent & rewards (derived from DB)
  const upcomingRent = lease ? `₹${lease.rentAmount?.toLocaleString()}` : "₹0";
  const rewardPoints = lease ? "4,820" : "0"; // Only show rewards if they have a lease

  const mapAddress = lease?.property?.address || lease?.property?.title || "Mumbai, India";
  const searchQuery = mapFilter === 'Property' ? mapAddress : `${mapFilter} near ${mapAddress}`;
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;


  const handleDownloadLeasePDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42);
      doc.text("Rentify Lease Agreement", 20, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(100, 116, 139);
      doc.text(`Tenant Name: ${lease?.renter?.name || 'Current Resident'}`, 20, 40);
      doc.text(`Property: ${lease?.property?.title || 'Unknown'}`, 20, 50);
      doc.text(`Address: ${lease?.property?.address || 'Unknown Address'}`, 20, 60);
      doc.text(`Lease Duration: ${lease?.duration || 12} Months`, 20, 70);
      doc.text(`Rent Amount: \u20B9${lease?.rentAmount?.toLocaleString()}/month`, 20, 80);
      doc.text(`Expiry: ${new Date(lease?.endDate).toLocaleDateString()}`, 20, 90);
      
      doc.setTextColor(15, 23, 42);
      doc.text("_________________________", 20, 150);
      doc.text("Tenant Signature", 20, 160);
      
      doc.text("_________________________", 120, 150);
      doc.text("Property Manager Signature", 120, 160);

      doc.save("Lease_Agreement.pdf");
      toast.success("Lease PDF Downloaded!");
    } catch(err) {
      toast.error("Failed to generate PDF");
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setPaymentStatus('Paid');
    setIsPaymentModalOpen(false);
    toast.success("Payment Successful! ✓", {
      style: { borderRadius: '10px', background: '#333', color: '#fff' }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      {/* Metrics Section: Bento Grid Style */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm group hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
              <DollarSign size={24} />
            </div>
            {lease && <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">+2% vs last month</span>}
          </div>
          <div className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">Upcoming Rent</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{upcomingRent}</div>
          <div className="text-slate-400 dark:text-slate-500 text-xs mt-2">{lease ? "Due in 5 days" : "No pending rent"}</div>
        </Card>

        <Card className="p-6 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm group hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
              <FileText size={24} />
            </div>
          </div>
          <div className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">Active Lease</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{lease ? lease.duration : 0} <span className="text-sm text-slate-400 font-normal">Months</span></div>
          <div className="text-slate-400 dark:text-slate-500 text-xs mt-2">Expires {lease ? new Date(lease.endDate).toLocaleDateString() : 'N/A'}</div>
        </Card>

        <Card className="p-6 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm group hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg">
              <Star size={24} />
            </div>
          </div>
          <div className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">Reward Points</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{rewardPoints}</div>
          <Link to="/rewards" className="text-primary hover:text-blue-700 text-xs mt-2 block font-bold transition-colors">
            {lease ? "Redeem for ₹3,500 discount" : "Earn points by paying rent on time"}
          </Link>
        </Card>
      </section>

      {/* Lease Renewal Banner (Conditional) */}
      {lease && (new Date(lease.endDate) - new Date()) / (1000 * 60 * 60 * 24) < 60 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-4 text-yellow-800 dark:text-yellow-500">
             <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-full animate-pulse"><AlertTriangle size={20} /></div>
             <div>
               <h4 className="font-bold text-sm">Lease Expiring Soon</h4>
               <p className="text-xs mt-0.5">Your current lease expires in {Math.round((new Date(lease.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days. Renew now to lock in your rate.</p>
             </div>
           </div>
           <Button onClick={() => setIsRenewalModalOpen(true)} className="bg-yellow-500 text-white border-0 px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-yellow-600 transition-colors">Renew Now</Button>
        </div>
      )}

      {/* Main Layout Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Primary Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Rentals Section */}
          <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Active Rentals</h2>
            {lease ? (
              <Card className="bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 rounded-2xl">
                <div className="flex flex-col md:flex-row p-6 gap-6">
                  <div className="md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                      src={lease.property?.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&auto=format&fit=crop&q=60"} 
                      alt="Property" 
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-xl text-slate-900 dark:text-white">{lease.property?.title}</h3>
                          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 flex items-center gap-1">
                            <MapPin size={12} /> {lease.property?.address}
                          </p>
                        </div>
                        <div className={`${paymentStatus === 'Paid' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors`}>
                          {paymentStatus}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-6 mt-4">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Bed size={16} />
                          <span className="text-xs font-bold">{lease.property?.bedrooms || 0} Beds</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Bath size={16} />
                          <span className="text-xs font-bold">{lease.property?.bathrooms || 0} Baths</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Calendar size={16} />
                          <span className="text-xs font-bold">Ends {new Date(lease.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      <img 
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" 
                        src={`https://i.pravatar.cc/100?u=current`} 
                        alt="Tenant" 
                      />
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Primary Resident</span>
                  </div>
                  <Button onClick={handleDownloadLeasePDF} variant="outline" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs font-bold flex items-center gap-2">
                    <Download size={14} />
                    Lease PDF
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                <Building className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="text-slate-500 font-bold">No active rentals found.</p>
                <Button onClick={() => navigate('/properties')} className="mt-4 bg-primary text-white border-0">Browse Properties</Button>
              </div>
            )}
          </section>

          {/* Maintenance Requests Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Maintenance Requests</h2>
              <Button 
                onClick={() => setIsNewRequestOpen(true)} 
                className="bg-primary text-white border-0 font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-blue-700 transition-colors px-4 py-2 rounded-xl"
              >
                <Plus size={16} /> New Request
              </Button>
            </div>
            <div className="space-y-4">
              {tickets.length > 0 ? (
                tickets.map(ticket => (
                  <Card 
                    key={ticket._id || ticket.id}
                    className="p-4 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
                    onClick={() => {
                      setSelectedTicket({
                        id: ticket._id.toString().slice(-6).toUpperCase(),
                        title: ticket.title,
                        status: ticket.status === 'OPEN' ? 'Pending' : ticket.status === 'IN_PROGRESS' ? 'In Progress' : 'Resolved', 
                        date: new Date(ticket.createdAt).toLocaleDateString(),
                        desc: ticket.description,
                        tech: ticket.assignedTo?.name || 'Assigned Technician',
                        expected: 'Scheduled'
                      });
                      setIsTicketDrawerOpen(true);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                        <Droplets size={24} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{ticket.title}</div>
                        <div className="text-slate-400 dark:text-slate-500 text-xs mt-1">Ticket #{ticket._id.toString().slice(-6).toUpperCase()} • Reported {new Date(ticket.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${ticket.status === 'OPEN' ? 'bg-amber-400' : ticket.status === 'IN_PROGRESS' ? 'bg-blue-400 animate-pulse' : 'bg-emerald-500'}`}></span>
                        <span className={`text-xs font-bold ${ticket.status === 'OPEN' ? 'text-amber-600' : ticket.status === 'IN_PROGRESS' ? 'text-blue-600' : 'text-emerald-600'}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <ChevronRight size={20} className="text-slate-300 group-hover:text-primary transition-colors cursor-pointer" />
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-slate-500 text-sm font-medium italic">No recent maintenance requests.</p>
              )}
            </div>
          </section>

          {/* Tour Requests / Assignments Flow */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Property Tour Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tourRequests.length > 0 ? tourRequests.map(req => (
                <Card key={req._id} className="p-5 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{req.property?.title}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{req.status}</p>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                      req.status === 'DETAILS_SENT' ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {req.status === 'DETAILS_SENT' ? 'Action Required' : 'Processing'}
                    </span>
                  </div>
                  
                  {req.status === 'DETAILS_SENT' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                        <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Admin Note / Location</p>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {req.notes || "The property details have been sent. Please review the location and confirm if you'd like to proceed with the booking."}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleConfirmTour(req._id)}
                          className="flex-1 bg-primary text-white border-0 text-xs py-2 rounded-lg font-black"
                        >
                          Confirm Interest
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {req.status === 'CONFIRMED' && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
                      <p className="text-xs text-amber-700 dark:text-amber-400 font-bold">Waiting for Admin to finalize your lease assignment.</p>
                    </div>
                  )}
                  
                  {req.status === 'ASSIGNED' && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800 flex items-center gap-2">
                      <CheckCircle size={14} className="text-green-500" />
                      <p className="text-xs text-green-700 dark:text-green-400 font-bold">Property Assigned! Check Active Rentals.</p>
                    </div>
                  )}
                </Card>
              )) : (
                <p className="text-slate-500 text-sm font-medium italic col-span-2">No active tour requests.</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Sidebar: Quick Actions & Perks */}
        <div className="space-y-8">
          {/* Quick Pay Card */}
          <Card className="premium-gradient p-6 rounded-2xl shadow-xl shadow-primary/20 relative overflow-hidden text-white group">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Quick Pay</h3>
              <p className="text-blue-100 text-xs mb-6">Clear your balance with a single click using your saved payment method.</p>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/20">
                <div className="flex justify-between text-[10px] uppercase font-bold mb-1 opacity-70 tracking-widest">Next Due Date</div>
                <div className="font-bold text-sm">
                  {lease ? new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                </div>
              </div>
              <Button 
                onClick={() => setIsPaymentModalOpen(true)}
                disabled={paymentStatus === 'Paid' || !lease}
                className="w-full bg-white text-primary hover:bg-slate-50 py-3 rounded-xl font-bold shadow-lg border-0 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paymentStatus === 'Paid' ? 'Paid ✓' : `Pay ₹${lease?.rentAmount?.toLocaleString() || '0'}`}
              </Button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
          </Card>

          {/* Suggested Properties */}
          <Card className="bg-white dark:bg-slate-900 p-6 rounded-xl border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Suggested Properties</h3>
            <div className="space-y-6">
              {suggestedProperties.map(prop => (
                <div key={prop._id} className="group">
                  <div className="w-full h-32 rounded-lg overflow-hidden mb-3 shadow-sm relative">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      src={prop.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&auto=format&fit=crop&q=60"} 
                      alt={prop.title} 
                    />
                    <div className="absolute top-2 right-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold px-2 py-1 rounded shadow-sm">₹{prop.rent?.toLocaleString()}</div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{prop.title}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{prop.address?.split(',').pop()}</div>
                      <div className="flex gap-3 text-slate-400 text-[10px] font-bold uppercase mt-1.5">
                        <span>{prop.bedrooms} Beds</span> • <span>{prop.bathrooms} Baths</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setSelectedProperty(prop); setIsPropertyModalOpen(true); }}
                      className="text-xs font-bold text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={() => navigate('/properties')} variant="outline" className="w-full mt-6 text-primary border-blue-100 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs font-bold uppercase tracking-widest">
              Explore All Properties
            </Button>
          </Card>

          {/* Neighborhood Map Teaser */}
          <Card className="bg-white dark:bg-slate-900 p-6 rounded-xl border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Around You</h3>
            <div className="w-full h-32 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden relative">
              <img 
                className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&auto=format&fit=crop&q=60" 
                alt="Map" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button onClick={() => setIsMapModalOpen(true)} className="bg-white text-primary hover:bg-slate-100 px-4 py-2 rounded-full shadow-lg text-[10px] font-bold flex items-center gap-2 border-0">
                  <MapPin size={12} /> Open Map
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => setIsNewRequestOpen(true)}
          className="w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-primary/40 group"
        >
          <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>
      {/* Modals and Drawers */}
      {/* 0. New Request Modal */}
      <NewRequestModal 
        isOpen={isNewRequestOpen} 
        onClose={() => setIsNewRequestOpen(false)} 
        allowedProperties={lease?.property ? [lease.property] : []}
        onSubmit={(localRecord, saved) => {
          setTickets(prev => [saved || localRecord, ...prev]);
        }} 
      />

      {/* 1. Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={() => setIsPaymentModalOpen(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><DollarSign /> Make Payment</h2>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1.5 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Amount Due</label>
                <input type="text" value="$2,450.00" disabled className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white font-bold opacity-70" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Payment Method</label>
                <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                  <option>Credit Card</option>
                  <option>Bank Transfer</option>
                  <option>UPI</option>
                </select>
              </div>
              {paymentMethod === 'Credit Card' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <input type="text" placeholder="Card Number (0000 0000 0000 0000)" required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" />
                  <div className="flex gap-4">
                    <input type="text" placeholder="MM/YY" required className="w-1/2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" />
                    <input type="text" placeholder="CVV" required className="w-1/2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                </div>
              )}
              <Button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl mt-4 border-0 shadow-lg shadow-primary/20 hover:bg-blue-700">Confirm Payment</Button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Maintenance Ticket Drawer */}
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
                    <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center ring-4 ring-white dark:ring-slate-900"><CheckCircle size={10} /></div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Assigned</p>
                    <p className="text-xs text-slate-500">Technician dispatched.</p>
                  </div>
                  <div className="relative pl-6">
                    <div className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full ${selectedTicket.status === 'Resolved' ? 'bg-primary' : 'bg-orange-400 animate-pulse'} ring-4 ring-white dark:ring-slate-900 flex items-center justify-center`}></div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">In Progress</p>
                    <p className="text-xs text-slate-500">Work is ongoing.</p>
                  </div>
                  <div className="relative pl-6">
                    <div className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full ${selectedTicket.status === 'Resolved' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700'} ring-4 ring-white dark:ring-slate-900 flex items-center justify-center`}>{selectedTicket.status === 'Resolved' && <CheckCircle size={10} />}</div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Resolved</p>
                    <p className="text-xs text-slate-500">Issue fixed.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Property Detail Modal */}
      {isPropertyModalOpen && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={() => setIsPropertyModalOpen(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="relative h-48">
              <img src={selectedProperty.image} className="w-full h-full object-cover" alt="Property" />
              <button onClick={() => setIsPropertyModalOpen(false)} className="absolute top-4 right-4 bg-black/40 text-white p-1.5 rounded-full hover:bg-black/60"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">{selectedProperty.name}</h2>
                  <p className="text-sm text-slate-500">{selectedProperty.location}</p>
                </div>
                <div className="text-xl font-bold text-primary">{selectedProperty.rent}</div>
              </div>
              <div className="flex gap-4 mb-6 text-sm font-bold text-slate-700 dark:text-slate-300">
                <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">{selectedProperty.beds}</span>
                <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">{selectedProperty.baths}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                Beautiful modern living space conveniently located. Features updated appliances, spacious floorplans, and excellent community amenities.
              </p>
              <Button 
                onClick={() => {
                  toast.success('Tour request sent to leasing agent!');
                  setIsPropertyModalOpen(false);
                }} 
                className="w-full bg-primary text-white border-0 shadow-lg shadow-primary/20 py-3 rounded-xl font-bold hover:bg-blue-700"
              >
                Request Tour
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Map Modal */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4" onClick={() => setIsMapModalOpen(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-5xl h-[80vh] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><MapPin /> Area Map</h2>
              <button onClick={() => setIsMapModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="flex-1 relative bg-slate-200">
              <iframe 
                src={mapSrc}
                className="w-full h-full border-0" 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              ></iframe>
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {['Property', 'Grocery Store', 'Transit', 'Hospital', 'School'].map(filter => {
                  const colors = {
                    'Property': 'bg-primary',
                    'Grocery Store': 'bg-emerald-500',
                    'Transit': 'bg-amber-500',
                    'Hospital': 'bg-rose-500',
                    'School': 'bg-purple-500'
                  };
                  return (
                    <button 
                      key={filter}
                      onClick={() => setMapFilter(filter)}
                      className={`shadow-lg px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${mapFilter === filter ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 scale-105' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:scale-105 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${colors[filter]} shadow-sm`}></span> {filter}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Lease Renewal Wizard */}
      {isRenewalModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4" onClick={() => setIsRenewalModalOpen(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2"><FileText /> Lease Renewal</h2>
              <button onClick={() => setIsRenewalModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            
            <div className="p-8">
              {/* Progress Bar */}
              <div className="flex gap-2 mb-8">
                {[1,2,3,4,5].map(s => (
                  <div key={s} className={`h-2 flex-1 rounded-full ${s <= renewalStep ? 'bg-primary' : 'bg-slate-100 dark:bg-slate-800'}`}></div>
                ))}
              </div>

              {renewalStep === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  <h3 className="text-xl font-black">Review Current Terms</h3>
                  <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl space-y-4">
                    <div className="flex justify-between text-sm"><span className="text-slate-500 font-bold">Property</span> <span className="font-black">The Skyline Loft, Unit 402</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500 font-bold">Current Rent</span> <span className="font-black">$2,450.00 / mo</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500 font-bold">Expiry Date</span> <span className="font-black text-red-500">October 31, 2024</span></div>
                  </div>
                  <Button onClick={() => setRenewalStep(2)} className="w-full bg-primary text-white border-0 py-4 rounded-xl font-black mt-4">Continue <ArrowRight size={16} className="ml-2"/></Button>
                </div>
              )}

              {renewalStep === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  <h3 className="text-xl font-black">Select New Duration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[6, 12, 24].map(months => (
                      <div key={months} onClick={() => setRenewalDuration(months)} className={`p-6 border-2 rounded-2xl cursor-pointer text-center transition-all ${renewalDuration === months ? 'border-primary bg-blue-50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-slate-800 hover:border-blue-200'}`}>
                        <div className="text-3xl font-black mb-1">{months}</div>
                        <div className="text-sm font-bold text-slate-400 uppercase">Months</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={() => setRenewalStep(1)} variant="outline" className="w-1/3 py-4 rounded-xl font-black border-slate-200">Back</Button>
                    <Button onClick={() => setRenewalStep(3)} className="w-2/3 bg-primary text-white border-0 py-4 rounded-xl font-black">Continue <ArrowRight size={16} className="ml-2"/></Button>
                  </div>
                </div>
              )}

              {renewalStep === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  <h3 className="text-xl font-black">Review Updated Rent</h3>
                  <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl space-y-4">
                    <div className="flex justify-between text-sm"><span className="text-slate-500 font-bold">New Duration</span> <span className="font-black">{renewalDuration} Months</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500 font-bold">Market Adjustment</span> <span className="font-black text-orange-500">+$75.00</span></div>
                    <div className="flex justify-between text-lg pt-4 border-t border-slate-200 dark:border-slate-700"><span className="font-black text-slate-900 dark:text-white">New Rent</span> <span className="font-black text-primary">$2,525.00 / mo</span></div>
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={() => setRenewalStep(2)} variant="outline" className="w-1/3 py-4 rounded-xl font-black border-slate-200">Back</Button>
                    <Button onClick={() => setRenewalStep(4)} className="w-2/3 bg-primary text-white border-0 py-4 rounded-xl font-black">Agree & Sign <ArrowRight size={16} className="ml-2"/></Button>
                  </div>
                </div>
              )}

              {renewalStep === 4 && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  <h3 className="text-xl font-black">E-Signature</h3>
                  <p className="text-sm text-slate-500 font-medium">Please sign below to authorize the lease extension.</p>
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 overflow-hidden relative">
                    <SignatureCanvas 
                      ref={signatureRef} 
                      penColor="black"
                      canvasProps={{className: 'w-full h-48 cursor-crosshair'}} 
                    />
                    <button onClick={() => signatureRef.current?.clear()} className="absolute top-2 right-2 text-[10px] font-bold text-slate-400 uppercase hover:text-slate-900 dark:hover:text-white">Clear</button>
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={() => setRenewalStep(3)} variant="outline" className="w-1/3 py-4 rounded-xl font-black border-slate-200">Back</Button>
                    <Button onClick={() => {
                      if(signatureRef.current?.isEmpty()) {
                        toast.error("Please provide a signature.");
                      } else {
                        setRenewalStep(5);
                        setTimeout(() => handleDownloadLeasePDF(), 1000);
                      }
                    }} className="w-2/3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-0 py-4 rounded-xl font-black">Sign & Complete</Button>
                  </div>
                </div>
              )}

              {renewalStep === 5 && (
                <div className="text-center space-y-6 animate-in zoom-in-95 py-8">
                  <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="text-2xl font-black">Lease Renewed!</h3>
                  <p className="text-slate-500 font-medium">Your lease has been successfully extended for {renewalDuration} months. A copy of the signed agreement is downloading automatically.</p>
                  <Button onClick={() => setIsRenewalModalOpen(false)} className="bg-primary text-white border-0 py-4 px-8 rounded-xl font-black shadow-xl mt-4">Return to Dashboard</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Floating Chat Button and Window */}
      <SupportChat initialMessages={data?.messages || []} userId={data?.userId} />
    </div>
  );
};

export default RenterDashboard;
