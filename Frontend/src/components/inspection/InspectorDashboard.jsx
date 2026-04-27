import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckSquare, Verified, Clock, Grid, List, MapPin, Plus, Minus, 
  CheckCircle, XCircle, Camera, Cloud, Check, MoreVertical, 
  ChevronRight, Search, Bell, Mail, LayoutDashboard, Building, 
  BarChart3, Wrench, DollarSign, X
} from 'lucide-react';
import { Card } from '../common/Card';
import Button from '../common/Button';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import workflowService from '../../services/workflowService';
import inspectionService from '../../services/inspectionService';

let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const initialInspections = [
  { id: 1, property: '422 Oakwood Drive', type: 'Standard Move-Out Audit', time: '09:00 AM', status: 'Scheduled', image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&auto=format&fit=crop&q=60', price: '$3,200/mo', details: '3 Bed • 2 Bath', lat: 30.2872, lng: -97.7431 },
  { id: 2, property: 'Skyline Lofts #402', type: 'Maintenance Verification', time: '11:30 AM', status: 'In-Progress', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&auto=format&fit=crop&q=60', price: '$4,500/mo', details: '2 Bed • 2 Bath', lat: 30.2672, lng: -97.7631 },
  { id: 3, property: '15 Maple Avenue', type: 'Initial Inspection', time: '08:00 AM', status: 'Completed', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&auto=format&fit=crop&q=60', price: '$2,850/mo', details: '2 Bed • 1 Bath', lat: 30.2472, lng: -97.7531 },
  { id: 4, property: 'The Grandview', type: 'Routine Audit', time: '02:00 PM', status: 'Scheduled', image: 'https://picsum.photos/seed/grandview/400/250', price: '$2,800/mo', details: '2 Bed • 2 Bath', lat: 30.2772, lng: -97.7331 },
  { id: 5, property: 'Riverside Court', type: 'Move-In Audit', time: '04:00 PM', status: 'Scheduled', image: 'https://picsum.photos/seed/river/400/250', price: '$3,200/mo', details: '3 Bed • 2 Bath', lat: 30.2572, lng: -97.7231 }
];

const mockAuditData = {};

const InspectorDashboard = ({ data, onRefresh }) => {
  const [inspections, setInspections] = useState([]);
  const [history, setHistory] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [detailModalItem, setDetailModalItem] = useState(null);
  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [confirmSubmitModal, setConfirmSubmitModal] = useState(false);
  const [rescheduleModalId, setRescheduleModalId] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [auditStatus, setAuditStatus] = useState(null);
  const [quickNotes, setQuickNotes] = useState('');
  const [mediaUploads, setMediaUploads] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [autosaveFlash, setAutosaveFlash] = useState(false);
  
  const fileInputRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wRequests, inspHistory] = await Promise.all([
          workflowService.getAdminRequests(), 
          inspectionService.getInspections()
        ]);
        
        // Filter workflow requests assigned to this inspector (we'll assume userId is available or filter by name)
        // For now, showing all LEASE_APPROVAL that are ASSIGNED
        setInspections(wRequests.filter(r => r.type === 'LEASE_APPROVAL' && r.status === 'ASSIGNED'));
        setHistory(wRequests.filter(r => r.status === 'COMPLETED'));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [data]);

  useEffect(() => {
    const saved = localStorage.getItem('inspectorDraft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.property === selectedProperty) {
          setAuditStatus(parsed.status);
          setQuickNotes(parsed.notes);
          setMediaUploads(parsed.media || []);
        }
      } catch(e) {}
    }
  }, [selectedProperty]);

  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('inspectorDraft', JSON.stringify({
        property: selectedProperty, status: auditStatus, notes: quickNotes, media: mediaUploads
      }));
      setAutosaveFlash(true);
      setTimeout(() => setAutosaveFlash(false), 2000);
    }, 30000);
    return () => clearInterval(interval);
  }, [selectedProperty, auditStatus, quickNotes, mediaUploads]);

  if (!data) return null;

  const handlePropertyChange = (e) => {
    const prop = e.target.value;
    setSelectedProperty(prop);
    const data = mockAuditData[prop] || { status: null, notes: '', media: [] };
    setAuditStatus(data.status);
    setQuickNotes(data.notes);
    setMediaUploads(data.media || []);
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (mediaUploads.length >= 6) {
        toast.error('Maximum 6 images allowed.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => setMediaUploads([...mediaUploads, event.target.result]);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleInitiateSubmit = () => {
    const errors = {};
    if (!selectedProperty) errors.property = 'Property is required.';
    if (!auditStatus) errors.status = 'Pass or Fail must be selected.';
    if (!quickNotes.trim()) errors.notes = 'Notes cannot be empty.';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please complete all required fields.');
    } else {
      setFormErrors({});
      setConfirmSubmitModal(true);
    }
  };

  const handleFinalSubmit = () => {
    setConfirmSubmitModal(false);
    toast.success('Report submitted successfully ✓', { style: { background: '#333', color: '#fff', borderRadius: '10px' }});
    
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("Inspection Report", 20, 20);
      doc.setFontSize(12);
      doc.text(`Property: ${selectedProperty}`, 20, 30);
      doc.text(`Status: ${auditStatus.toUpperCase()}`, 20, 40);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
      doc.text(`Inspector: Rentify Inspector`, 20, 60);
      doc.text(`Notes:`, 20, 70);
      const splitNotes = doc.splitTextToSize(quickNotes, 170);
      doc.text(splitNotes, 20, 80);
      doc.save(`Inspection_${selectedProperty.replace(/[^a-z0-9]/gi, '_')}.pdf`);
    } catch(err) {}

    setSelectedProperty('Skyline Lofts #402');
    setAuditStatus(null);
    setQuickNotes('');
    setMediaUploads([]);
    localStorage.removeItem('inspectorDraft');
  };

  const handleAction = async (action, item) => {
    setMenuOpenId(null);
    if (action === 'start') setSelectedProperty(item.property?.title || item.property?.address);
    else if (action === 'complete') {
      try {
        await workflowService.updateRequest(item._id, { status: 'COMPLETED' });
        toast.success('Inspection marked as completed! ✓');
        if (onRefresh) onRefresh();
      } catch (err) {
        toast.error('Failed to update status');
      }
    } 
    else if (action === 'details') setDetailModalItem(item);
    else if (action === 'reschedule') setRescheduleModalId(item.id);
  };

  const pendingCount = inspections.filter(i => i.status !== 'Completed').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Inspector Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">You have {pendingCount} inspections scheduled for today, {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.</p>
      </div>

      {/* Bento Grid Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
              <CheckSquare size={24} />
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">+12%</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">0</div>
          <div className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">Audits Today</div>
        </Card>

        <Card className="p-6 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
              <Verified size={24} />
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">98.2%</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">0%</div>
          <div className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">Approval Rate</div>
        </Card>

        <Card className="p-6 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400">
              <Clock size={24} />
            </div>
            <span className="text-amber-600 dark:text-amber-400 font-bold text-xs bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full">3 urgent</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{pendingCount}</div>
          <div className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">Pending Reports</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Center Content Area */}
        <div className="lg:col-span-8 space-y-8">
          {/* Today's Schedule Section */}
          <Card className="bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden rounded-2xl">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-xl text-slate-900 dark:text-white">Today's Inspections</h3>
              <div className="flex gap-2">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'}`}><Grid size={18} /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'}`}><List size={18} /></button>
              </div>
            </div>
            <div className={`p-4 ${viewMode === 'list' ? 'divide-y divide-slate-100 dark:divide-slate-800 space-y-2' : 'grid grid-cols-1 md:grid-cols-2 gap-4'} transition-all`}>
              {inspections.map((item) => (
                <div key={item.id} className={`p-4 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors flex ${viewMode === 'list' ? 'items-center gap-6' : 'flex-col gap-4'} ${item.status === 'Completed' ? 'opacity-60' : ''} relative`}>
                  <div className={`${viewMode === 'list' ? 'w-16 h-16' : 'w-full h-32'} rounded-lg overflow-hidden flex-shrink-0 shadow-sm cursor-pointer`} onClick={() => setDetailModalItem(item)}>
                    <img className="w-full h-full object-cover hover:scale-105 transition-transform" src={item.property?.images?.[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&auto=format&fit=crop&q=60'} alt="Property" />
                  </div>
                  <div className="flex-1 cursor-pointer" onClick={() => setDetailModalItem(item)}>
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">{item.property?.title || item.property?.address}</h4>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        item.status === 'Scheduled' || item.status === 'OPEN' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                        item.status === 'In-Progress' || item.status === 'IN_PROGRESS' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' :
                        'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                      }`}>{item.status}</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mb-3">{item.title || item.type} • {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    {(item.status !== 'Completed' && item.status !== 'RESOLVED') && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(item.property?.address || '')}`, '_blank'); }}
                        className="flex items-center gap-1.5 text-primary text-[10px] font-black uppercase tracking-widest hover:underline group w-fit"
                      >
                        <MapPin size={12} className="group-hover:translate-y-[-1px] transition-transform" />
                        Get Directions
                      </button>
                    )}
                  </div>
                  <div className={`flex items-center gap-4 ${viewMode === 'list' ? '' : 'justify-between border-t border-slate-100 dark:border-slate-800 pt-3 mt-auto'}`}>
                    <div className={viewMode === 'list' ? 'text-right' : 'text-left'}>
                      <div className="text-slate-900 dark:text-white font-bold text-sm">₹{item.property?.rent || 'TBD'}</div>
                      <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">{item.property?.bedrooms || 0} Bed • {item.property?.bathrooms || 0} Bath</div>
                    </div>
                    <div className="relative">
                      <button onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === item._id ? null : item._id); }} className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                        {(item.status === 'Completed' || item.status === 'RESOLVED') ? <CheckCircle size={18} className="text-emerald-500" /> : <MoreVertical size={18} />}
                      </button>
                      {menuOpenId === item.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1 z-10">
                          <button onClick={() => handleAction('start', item)} className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">Start Inspection</button>
                          <button onClick={() => handleAction('reschedule', item)} className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">Reschedule</button>
                          {item.status !== 'Completed' && (
                            <button onClick={() => handleAction('complete', item)} className="w-full text-left px-4 py-2 text-sm font-bold text-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-700">Mark Complete</button>
                          )}
                          <button onClick={() => handleAction('details', item)} className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">View Details</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* History Section */}
          <Card className="bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden rounded-2xl">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-xl text-slate-900 dark:text-white">Inspection History</h3>
            </div>
            <div className="p-4 space-y-2">
              {history.length > 0 ? history.map((item) => (
                <div key={item._id || item.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex items-center gap-6 opacity-80 hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                    <img className="w-full h-full object-cover" src={item.property?.images?.[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&auto=format&fit=crop&q=60'} alt="Property" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">{item.property?.title || item.property?.address}</h4>
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">Completed</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">{item.title || item.type} • {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <Button variant="outline" size="sm" onClick={() => setDetailModalItem(item)} className="text-xs">View Report</Button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-slate-500 text-sm">No inspection history found.</div>
              )}
            </div>
          </Card>

          {/* Map Section */}
          <Card className="h-[400px] bg-white dark:bg-slate-900 rounded-xl border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden relative group z-0">
            <MapContainer center={[19.1136, 72.8697]} zoom={12} className="w-full h-full z-0" zoomControl={false} ref={mapRef}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
              {inspections.filter(i => i.status !== 'Completed' && i.status !== 'RESOLVED').map(item => (
                <Marker key={item._id} position={[item.property?.location?.coordinates?.[1] || 19.1136, item.property?.location?.coordinates?.[0] || 72.8697]}>
                  <Popup>
                    <div className="font-bold text-sm">{item.property?.title}</div>
                    <div className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleTimeString()}</div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold flex items-center gap-2 shadow-lg z-[1000]">
              <MapPin size={16} className="text-blue-600" />
              {inspections.filter(i => i.status !== 'Completed' && i.status !== 'RESOLVED').length} Pending Locations
            </div>
            <div className="absolute bottom-4 right-4 flex gap-2 z-[1000]">
              <button onClick={() => mapRef.current?.zoomIn()} className="bg-white dark:bg-slate-900 p-2 rounded-lg shadow-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"><Plus size={18} /></button>
              <button onClick={() => mapRef.current?.zoomOut()} className="bg-white dark:bg-slate-900 p-2 rounded-lg shadow-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"><Minus size={18} /></button>
            </div>
          </Card>
        </div>

        {/* Right Side Panel */}
        <div className="lg:col-span-4 space-y-8">
          {/* Travel Route Section */}
          <Card className="bg-white dark:bg-slate-900 p-8 border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl">
            <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Travel Route</h3>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl space-y-6 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-900/40"></div>
                  <div className="w-0.5 h-8 bg-slate-200 dark:bg-slate-700"></div>
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Position</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">Main Office HQ</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-400"></div>
                  <div className="w-0.5 h-8 bg-slate-200 dark:bg-slate-700"></div>
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stop 1 (4.2 mi)</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">422 Oakwood Drive</div>
                </div>
                <span className="text-blue-600 dark:text-blue-400 text-[10px] font-bold">ETA 08:45 AM</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-400"></div>
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stop 2 (2.8 mi)</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">Skyline Lofts</div>
                </div>
                <span className="text-slate-400 text-[10px] font-bold">ETA 11:15 AM</span>
              </div>
              <Button 
                onClick={() => setRouteModalOpen(true)}
                variant="outline" 
                className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-blue-600 dark:text-blue-400 font-bold py-3 rounded-xl hover:bg-blue-50 transition-all"
              >
                View Full Route
              </Button>
            </div>
          </Card>

          {/* Quick Report Draft */}
          <Card className="bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm p-8 rounded-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-slate-900 dark:text-white">Report Draft</h3>
              <span className={`text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1 uppercase tracking-widest transition-opacity duration-300 ${autosaveFlash ? 'opacity-100' : 'opacity-0'}`}>
                <Cloud size={14} /> Autosaved ✓
              </span>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block">Property Select</label>
                <select value={selectedProperty} onChange={handlePropertyChange} className={`w-full p-3 bg-slate-50 dark:bg-slate-800 border ${formErrors.property ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 dark:text-white`}>
                  <option value="">Select a property...</option>
                  {inspections.map(i => <option key={i._id} value={i.property?.title || i.property?.address}>{i.property?.title || i.property?.address}</option>)}
                </select>
                {formErrors.property && <p className="text-red-500 text-xs mt-1">{formErrors.property}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block">Audit Status</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setAuditStatus('pass')} className={`py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${auditStatus === 'pass' ? 'border border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'}`}>
                    <CheckCircle size={16} /> Pass
                  </button>
                  <button onClick={() => setAuditStatus('fail')} className={`py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${auditStatus === 'fail' ? 'border border-red-600 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'}`}>
                    <XCircle size={16} /> Fail
                  </button>
                </div>
                {formErrors.status && <p className="text-red-500 text-xs mt-1">{formErrors.status}</p>}
              </div>
              <div>
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block">Quick Notes</label>
                  <span className="text-xs text-slate-400">{quickNotes.length}/500</span>
                </div>
                <textarea 
                  value={quickNotes}
                  onChange={(e) => setQuickNotes(e.target.value.substring(0, 500))}
                  className={`w-full p-4 bg-slate-50 dark:bg-slate-800 border ${formErrors.notes ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px] dark:text-white`} 
                  placeholder="Enter findings here..."
                ></textarea>
                {formErrors.notes && <p className="text-red-500 text-xs mt-1">{formErrors.notes}</p>}
              </div>
              <div>
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block">Media Uploads</label>
                  <span className="text-xs text-slate-400">{mediaUploads.length}/6</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                  <div onClick={() => fileInputRef.current?.click()} className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-200 transition-colors">
                    <Camera size={20} />
                  </div>
                  {mediaUploads.map((src, idx) => (
                    <div key={idx} onClick={() => setLightboxImage(src)} className="aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 cursor-pointer group relative">
                      <img className="w-full h-full object-cover group-hover:scale-110 transition-transform" src={src} alt="Media" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={handleInitiateSubmit} className="w-full py-4 premium-gradient text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all border-0">
                Finalize & Submit Report
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {/* Property Details Modal */}
      {detailModalItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={() => setDetailModalItem(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="relative h-48">
              <img src={detailModalItem.image} className="w-full h-full object-cover" alt="Property" />
              <button onClick={() => setDetailModalItem(null)} className="absolute top-4 right-4 bg-black/40 text-white p-1.5 rounded-full hover:bg-black/60"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">{detailModalItem.property}</h2>
                  <p className="text-sm text-slate-500 mt-1">{detailModalItem.details} • {detailModalItem.price}</p>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${detailModalItem.status === 'Scheduled' ? 'bg-blue-50 text-blue-600' : detailModalItem.status === 'In-Progress' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>{detailModalItem.status}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between text-sm mb-2"><span className="text-slate-500 font-bold">Audit Type</span><span className="font-bold text-slate-900 dark:text-white">{detailModalItem.type}</span></div>
                <div className="flex justify-between text-sm mb-2"><span className="text-slate-500 font-bold">Time</span><span className="font-bold text-slate-900 dark:text-white">{detailModalItem.time}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500 font-bold">Inspector</span><span className="font-bold text-slate-900 dark:text-white">Assigned to you</span></div>
              </div>
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Status Tracker</h4>
                <div className="flex items-center justify-between relative before:absolute before:top-1/2 before:-translate-y-1/2 before:left-0 before:w-full before:h-0.5 before:bg-slate-200">
                  <div className="relative z-10 bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center shadow-[0_0_0_4px_white]"><Check size={12}/></div>
                  <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shadow-[0_0_0_4px_white] ${detailModalItem.status === 'In-Progress' || detailModalItem.status === 'Completed' ? 'bg-primary text-white' : 'bg-slate-200 text-slate-400'}`}>{detailModalItem.status === 'In-Progress' || detailModalItem.status === 'Completed' ? <Check size={12}/> : <div className="w-2 h-2 bg-current rounded-full"></div>}</div>
                  <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shadow-[0_0_0_4px_white] ${detailModalItem.status === 'Completed' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>{detailModalItem.status === 'Completed' ? <Check size={12}/> : <div className="w-2 h-2 bg-current rounded-full"></div>}</div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">
                  <span>Scheduled</span><span>In Progress</span><span>Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmSubmitModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-sm w-full shadow-2xl text-center">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Submit Report?</h3>
            <p className="text-slate-500 text-sm mb-6">Are you sure you want to finalize and submit the report for <strong>{selectedProperty}</strong>? This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button onClick={() => setConfirmSubmitModal(false)} variant="outline" className="flex-1">Cancel</Button>
              <Button onClick={handleFinalSubmit} className="flex-1 bg-primary text-white border-0">Confirm Submit</Button>
            </div>
          </div>
        </div>
      )}

      {/* Full Route Modal */}
      {routeModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={() => setRouteModalOpen(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold flex items-center gap-2"><MapPin/> Full Travel Route</h2>
              <button onClick={() => setRouteModalOpen(false)} className="text-slate-400"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4 relative before:absolute before:left-3 before:top-4 before:bottom-4 before:w-0.5 before:bg-blue-100">
                <div className="flex gap-4 relative z-10"><div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-[0_0_0_4px_white]">1</div><div><div className="font-bold">Main Office HQ</div><div className="text-xs text-slate-500">Departure: 08:30 AM</div></div></div>
                <div className="flex gap-4 relative z-10"><div className="w-6 h-6 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center text-xs font-bold">2</div><div><div className="font-bold">422 Oakwood Drive</div><div className="text-xs text-slate-500">Distance: 4.2 mi • ETA: 08:45 AM</div></div></div>
                <div className="flex gap-4 relative z-10"><div className="w-6 h-6 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center text-xs font-bold">3</div><div><div className="font-bold">Skyline Lofts</div><div className="text-xs text-slate-500">Distance: 2.8 mi • ETA: 11:15 AM</div></div></div>
                <div className="flex gap-4 relative z-10"><div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-[0_0_0_4px_white]">🏁</div><div><div className="font-bold">Main Office HQ</div><div className="text-xs text-slate-500">Return: 05:00 PM</div></div></div>
              </div>
              <Button onClick={() => window.open('https://www.google.com/maps/dir/Main+Office+HQ/422+Oakwood+Drive/Skyline+Lofts', '_blank')} className="w-full bg-primary text-white border-0 py-3">Open in Google Maps</Button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxImage(null)}>
          <button className="absolute top-4 right-4 text-white p-2 bg-white/10 rounded-full hover:bg-white/20"><X size={24}/></button>
          <img src={lightboxImage} alt="Fullscreen" className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
      )}
    </div>
  );
};

export default InspectorDashboard;
