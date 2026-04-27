import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getSocket, joinUserRoom } from '../../services/socket';
import toast from 'react-hot-toast';
import { Bell, MapPin, Building, AlertCircle, Wrench } from 'lucide-react';

const NotificationListener = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const socket = getSocket();
    joinUserRoom(user.id);

    // --- Admin Listeners ---
    if (user.role === 'ADMIN') {
      socket.on('admin_notification', (data) => {
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-slate-900 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-primary/30`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <Building size={20} />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-black text-white">{data.title}</p>
                  <p className="mt-1 text-xs font-bold text-slate-400">{data.message}</p>
                  {data.property && (
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-300 bg-white/5 p-1.5 rounded-lg border border-white/5">
                      <MapPin size={10} className="text-primary" />
                      <span className="truncate">{data.property} | {data.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex border-l border-white/10">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-xs font-black text-primary hover:text-primary-light focus:outline-none"
              >
                VIEW
              </button>
            </div>
          </div>
        ), { duration: 6000 });
      });
    }

    // --- Inspector / Service Provider Listeners ---
    if (['INSPECTOR', 'SERVICE', 'SERVICE_PROVIDER'].includes(user.role)) {
      socket.on('new_task', (data) => {
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-indigo-600 shadow-2xl rounded-2xl pointer-events-auto flex text-white`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                    {data.type === 'INSPECTION' ? <Building size={20} /> : <Wrench size={20} />}
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-black">New Task Assigned</p>
                  <p className="mt-1 text-xs font-bold text-indigo-100">{data.property}</p>
                  <p className="mt-2 text-[10px] bg-black/20 p-1.5 rounded-lg">Check dashboard for location and details.</p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-white/10">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-xs font-black hover:bg-white/10"
              >
                OPEN
              </button>
            </div>
          </div>
        ), { duration: 8000 });
      });
    }

    // --- Renter / Owner Listeners ---
    socket.on('request_update', (data) => {
      toast.success(data.message, {
        icon: '🔔',
        style: {
          borderRadius: '1rem',
          background: '#0f172a',
          color: '#fff',
          fontWeight: '900',
          fontSize: '0.8rem'
        }
      });
    });

    return () => {
      socket.off('admin_notification');
      socket.off('new_task');
      socket.off('request_update');
    };
  }, [isAuthenticated, user]);

  return null;
};

export default NotificationListener;
