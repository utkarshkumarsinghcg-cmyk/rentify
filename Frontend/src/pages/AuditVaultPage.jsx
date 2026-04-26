import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Download, ChevronDown, ChevronRight, Activity, ShieldAlert } from 'lucide-react';
import { Card } from '../components/common/Card';
import Button from '../components/common/Button';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import toast from 'react-hot-toast';

const mockLogs = Array.from({ length: 50 }).map((_, i) => ({
  id: `log-${i}`,
  timestamp: new Date(Date.now() - i * 3600000).toLocaleString('en-IN'),
  user: `User_${i}`,
  action: ['LOGIN_SUCCESS', 'PAYMENT_INITIATED', 'PROFILE_UPDATE', 'SETTINGS_CHANGED', 'UNAUTHORIZED_ACCESS'][i % 5],
  resource: ['/api/auth', '/api/payments', '/api/users/me', '/api/config', '/api/admin'][i % 5],
  ip: `192.168.1.${i % 255}`,
  status: i % 5 === 4 ? 'FAILURE' : 'SUCCESS',
  severity: i % 5 === 4 ? 'HIGH' : 'LOW',
  payload: JSON.stringify({ headers: { "user-agent": "Mozilla/5.0" }, body: { id: i, action: 'test' } }, null, 2)
}));

const AuditVaultPage = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState(mockLogs);
  const [expandedRow, setExpandedRow] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        setLogs(prev => [
          {
            id: `log-new-${Date.now()}`,
            timestamp: new Date().toLocaleString('en-IN'),
            user: 'System_Cron',
            action: 'HEALTH_CHECK',
            resource: '/api/health',
            ip: '127.0.0.1',
            status: 'SUCCESS',
            severity: 'LOW',
            payload: JSON.stringify({ uptime: 99.9, cpu: '45%' }, null, 2)
          },
          ...prev.slice(0, 49)
        ]);
        toast('Audit log auto-refreshed', { icon: '🔄', position: 'bottom-right' });
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Audit Vault Report", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 14, 28);
    doc.autoTable({
      startY: 35,
      head: [['Timestamp', 'User', 'Action', 'Status']],
      body: logs.slice(0, 20).map(l => [l.timestamp, l.user, l.action, l.status])
    });
    doc.save("Audit_Vault_Report.pdf");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-100 dark:border-slate-800"><ArrowLeft size={20}/></button>
          <div>
            <h1 className="text-3xl font-black flex items-center gap-2"><ShieldAlert className="text-primary"/> Audit Vault</h1>
            <p className="text-slate-500 text-sm">Immutable global system event logs.</p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <label className="flex items-center gap-2 text-sm font-bold cursor-pointer bg-white dark:bg-slate-900 px-4 py-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} className="accent-primary" /> Auto-Refresh (30s)
          </label>
          <Button onClick={exportPDF} className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-0 rounded-xl px-4 py-2 text-sm"><Download size={14} className="mr-2"/> Export PDF</Button>
        </div>
      </div>

      <Card className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase font-black text-slate-500 tracking-widest font-sans">
              <tr>
                <th className="p-4 w-10"></th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">User</th>
                <th className="p-4">Action</th>
                <th className="p-4">Resource</th>
                <th className="p-4">IP Address</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {logs.map((log) => (
                <React.Fragment key={log.id}>
                  <tr onClick={() => setExpandedRow(expandedRow === log.id ? null : log.id)} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 cursor-pointer transition-colors">
                    <td className="p-4 text-slate-400">{expandedRow === log.id ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}</td>
                    <td className="p-4 text-xs text-slate-500">{log.timestamp}</td>
                    <td className="p-4 font-bold">{log.user}</td>
                    <td className="p-4 text-blue-600 dark:text-blue-400">{log.action}</td>
                    <td className="p-4 text-xs text-slate-400">{log.resource}</td>
                    <td className="p-4 text-xs">{log.ip}</td>
                    <td className="p-4 text-right">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase font-sans ${log.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{log.status}</span>
                    </td>
                  </tr>
                  {expandedRow === log.id && (
                    <tr>
                      <td colSpan="7" className="p-0 border-0 bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="p-6 overflow-x-auto">
                           <div className="text-[10px] uppercase font-black text-slate-400 mb-2 font-sans tracking-widest">JSON Payload Event Details</div>
                           <pre className="text-xs text-slate-300 bg-slate-900 p-4 rounded-xl shadow-inner border border-slate-800">
                             {log.payload}
                           </pre>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AuditVaultPage;
