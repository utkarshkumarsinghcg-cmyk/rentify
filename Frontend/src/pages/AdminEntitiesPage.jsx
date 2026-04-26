import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Download, MoreVertical, ShieldAlert, CheckCircle } from 'lucide-react';
import { Card } from '../components/common/Card';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const mockEntities = Array.from({ length: 35 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: ['Resident', 'Asset Owner', 'Field Tech', 'Admin'][i % 4],
  status: ['Online', 'Away', 'Offline'][i % 3],
  date: `${24 - (i % 10)}/10/2025`,
  avatar: `${(i % 50) + 1}`,
  pulse: i % 7 !== 0
}));

const AdminEntitiesPage = () => {
  const navigate = useNavigate();
  const [entities, setEntities] = useState(mockEntities);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const filtered = entities.filter(e => 
    (e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase())) &&
    (roleFilter === 'All' || e.role === roleFilter)
  );

  const paginated = filtered.slice((page - 1) * 10, page * 10);
  const totalPages = Math.ceil(filtered.length / 10);

  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBulkSuspend = () => {
    if (selectedIds.size === 0) return;
    setEntities(entities.map(e => selectedIds.has(e.id) ? { ...e, pulse: false, status: 'Suspended' } : e));
    setSelectedIds(new Set());
    toast.success('Selected entities suspended.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm hover:bg-slate-50 border border-slate-100 dark:border-slate-800"><ArrowLeft size={20}/></button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Global Entities</h1>
          <p className="text-slate-500 text-sm">Manage all platform users, owners, and services.</p>
        </div>
      </div>

      <Card className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border-slate-100 dark:border-slate-800 p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="relative flex-1 w-full">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search identities..." className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none text-sm font-bold" />
           </div>
           <div className="flex gap-3 w-full md:w-auto">
             <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none text-sm font-bold">
               <option>All</option><option>Resident</option><option>Asset Owner</option><option>Field Tech</option><option>Admin</option>
             </select>
             <Button onClick={handleBulkSuspend} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 text-xs px-4 rounded-xl"><ShieldAlert size={14} className="mr-2"/> Bulk Suspend</Button>
             <Button className="bg-primary text-white border-0 px-4 rounded-xl text-xs"><Download size={14} className="mr-2"/> Export CSV</Button>
           </div>
        </div>
      </Card>

      <Card className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-black text-slate-400">
              <tr>
                <th className="p-4 w-12"><input type="checkbox" onChange={e => setSelectedIds(e.target.checked ? new Set(paginated.map(p=>p.id)) : new Set())} /></th>
                <th className="p-4">Identity</th>
                <th className="p-4">Authority</th>
                <th className="p-4">Pulse</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {paginated.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                  <td className="p-4"><input type="checkbox" checked={selectedIds.has(user.id)} onChange={() => toggleSelect(user.id)} /></td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={`https://i.pravatar.cc/100?u=${user.avatar}`} className={`w-8 h-8 rounded-full ${!user.pulse ? 'grayscale' : ''}`} alt="" />
                      <div>
                        <div className="font-bold text-sm">{user.name}</div>
                        <div className="text-xs text-slate-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4"><span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-1 rounded">{user.role}</span></td>
                  <td className="p-4"><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${user.pulse ? 'bg-green-500' : 'bg-red-500'}`}></div><span className="text-xs font-bold">{user.status}</span></div></td>
                  <td className="p-4 text-xs font-bold text-slate-400">{user.date}</td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <Button variant="outline" className="h-8 text-[10px] px-3 rounded-lg border-slate-200">Audit</Button>
                    <button className="p-2 text-slate-400 hover:text-slate-900"><MoreVertical size={14}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 flex justify-between items-center border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
           <span className="text-xs font-bold text-slate-400">Page {page} of {totalPages}</span>
           <div className="flex gap-2">
             <Button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} variant="outline" className="h-8 text-xs px-3 rounded-lg border-slate-200">Prev</Button>
             <Button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} variant="outline" className="h-8 text-xs px-3 rounded-lg border-slate-200">Next</Button>
           </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminEntitiesPage;
