import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openAuthModal } from '../store/slices/uiSlice';
import Button from '../components/common/Button';
import { ShieldCheck, TrendingUp, Users, Wrench, ShieldAlert, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import OwnerLanding from './OwnerLanding';
import RenterLanding from './RenterLanding';
import InspectorLanding from './InspectorLanding';
import ServiceLanding from './ServiceLanding';

const PersonaLanding = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // If invalid role, redirect to home
    const validRoles = ['renter', 'owner', 'inspector', 'service', 'admin'];
    if (!validRoles.includes(role)) {
      navigate('/');
    } else {
      // Store role for Signup auto-detection
      localStorage.setItem('rentify_user_role', role === 'renter' ? 'tenant' : role);
    }
  }, [role, navigate]);

  if (role === 'owner') return <OwnerLanding />;
  if (role === 'renter') return <RenterLanding />;
  if (role === 'inspector') return <InspectorLanding />;
  if (role === 'service') return <ServiceLanding />;

  // Admin and default fallback
  const content = useMemo(() => {
    switch (role) {
      case 'admin':
        return {
          title: 'System Governance Dashboard',
          subtitle: 'Oversee the entire Rentify ecosystem. Manage users, resolve disputes, and monitor system health.',
          features: [
            { icon: ShieldAlert, title: 'Global Oversight', desc: 'Monitor system-wide metrics and user reports.' },
            { icon: Users, title: 'User Management', desc: 'Approve service providers and handle escalations.' },
          ],
          cta: 'Admin Access',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60'
        };
      default:
        return null;
    }
  }, [role]);

  if (!content) return null;

  return (
    <>
      <Helmet>
        <title>Rentify | For {role.charAt(0).toUpperCase() + role.slice(1)}s</title>
      </Helmet>
      
      <section className="relative pt-24 md:pt-32 pb-20 overflow-hidden flex-1 bg-surface dark:bg-slate-950 min-h-[80vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="z-10 animate-in slide-in-from-left duration-700">
            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6">
              For {role.charAt(0).toUpperCase() + role.slice(1)}s
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
              {content.title}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-lg font-medium">
              {content.subtitle}
            </p>
            
            <div className="space-y-6 mb-10">
              {content.features.map((feature, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="mt-1 w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                    <feature.icon size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto font-bold" 
                onClick={() => {
                  if (role === 'renter') navigate('/listings');
                  else {
                    dispatch(openAuthModal('signup'));
                  }
                }}
              >
                {content.cta}
              </Button>
            </div>
          </div>
          
          <div className="relative animate-in slide-in-from-right duration-700">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 blur-3xl rounded-full"></div>
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
              <img 
                className="w-full h-[600px] object-cover" 
                alt={`${role} landing`} 
                src={content.image} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PersonaLanding;
