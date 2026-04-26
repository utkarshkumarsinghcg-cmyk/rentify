import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { ShieldAlert } from 'lucide-react';
import Button from '../components/common/Button';

// Role-based dashboard components
import AdminDashboardView from '../components/admin/AdminDashboard';
import ServiceDashboardView from '../components/service/ServiceDashboard';
import InspectorDashboardView from '../components/inspection/InspectorDashboard';
import OwnerDashboardView from '../components/owner/OwnerDashboard';
import RenterDashboardView from '../components/renter/RenterDashboard';

// Services
import propertyService from '../services/propertyService';

const Dashboard = () => {
  const { user } = useAuth();
  // Prefer localStorage role (set at login) so the correct dashboard always renders
  const resolvedRole = localStorage.getItem('rentify_user_role') || user?.role?.toLowerCase();
  
  const [ownerData, setOwnerData] = React.useState(null);
  const [renterData, setRenterData] = React.useState(null);
  const [serviceData, setServiceData] = React.useState(null);
  const [inspectorData, setInspectorData] = React.useState(null);
  const [adminData, setAdminData] = React.useState(null);
  
  const [loading, setLoading] = React.useState(['owner', 'renter', 'service', 'inspector', 'admin'].includes(resolvedRole));

  const fetchData = async () => {
    try {
      if (resolvedRole === 'owner') {
        const result = await propertyService.getOwnerDashboard();
        setOwnerData(result);
      } else if (resolvedRole === 'renter') {
        const result = await propertyService.getRenterDashboard();
        setRenterData(result);
      } else if (resolvedRole === 'service' || resolvedRole === 'service_provider') {
        const result = await propertyService.getServiceDashboard();
        setServiceData(result);
      } else if (resolvedRole === 'inspector') {
        const result = await propertyService.getInspectorDashboard();
        setInspectorData(result);
      } else if (resolvedRole === 'admin') {
        const result = await propertyService.getAdminDashboard();
        setAdminData(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (resolvedRole) fetchData();
  }, [resolvedRole]);

  // Remove early return to maintain hook order consistency
  const showLoading = loading && resolvedRole === 'owner';

  const renderDashboard = () => {
    switch (resolvedRole) {
      case 'owner':
        return <OwnerDashboardView data={ownerData} onRefresh={fetchData} />;
      case 'renter':
      case 'tenant':
        return <RenterDashboardView data={renterData} onRefresh={fetchData} />;
      case 'inspector':
        return <InspectorDashboardView data={inspectorData} onRefresh={fetchData} />;
      case 'admin':
        return <AdminDashboardView data={adminData} onRefresh={fetchData} />;
      case 'service':
      case 'service_provider':
        return <ServiceDashboardView data={serviceData} onRefresh={fetchData} />;
      default:
        return (
          <div className="text-center py-40 animate-in fade-in duration-1000">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShieldAlert size={48} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Secure Access Required</h3>
            <p className="text-slate-500 mt-2 max-w-md mx-auto font-medium">Your role has not been detected by the system. Please re-authenticate or contact administration.</p>
            <Button variant="primary" className="mt-8 premium-gradient text-white border-0 px-8 py-3 rounded-2xl font-black shadow-xl" onClick={() => window.location.href = '/'}>Return to Homepage</Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#020617] selection:bg-primary selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-10 w-full">
        {showLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold animate-pulse">Synchronizing Portfolio...</p>
          </div>
        ) : (
          renderDashboard()
        )}
      </div>
    </div>
  );
};

export default Dashboard;
