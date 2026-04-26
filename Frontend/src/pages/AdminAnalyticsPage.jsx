import React, { useState, useRef } from 'react';
import { Card } from '../components/common/Card';
import Button from '../components/common/Button';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, FileText, Image as ImageIcon, Calendar } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import toast from 'react-hot-toast';

const revenueData = [
  { name: 'Jan', value: 450000 }, { name: 'Feb', value: 380000 }, { name: 'Mar', value: 520000 },
  { name: 'Apr', value: 480000 }, { name: 'May', value: 650000 }, { name: 'Jun', value: 590000 },
];

const usersData = [
  { name: 'Jan', value: 120 }, { name: 'Feb', value: 150 }, { name: 'Mar', value: 180 },
  { name: 'Apr', value: 220 }, { name: 'May', value: 270 }, { name: 'Jun', value: 310 },
];

const propertiesData = [
  { name: 'Residential', value: 400 },
  { name: 'Commercial', value: 150 },
  { name: 'Industrial', value: 50 }
];
const COLORS = ['#3b82f6', '#8b5cf6', '#10b981'];

const AdminAnalyticsPage = () => {
  const [tab, setTab] = useState('Revenue');
  const chartRef = useRef(null);

  const exportPNG = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tab}_Chart.png`;
    a.click();
    toast.success('Chart exported as PNG');
  };

  const exportCSV = () => {
    const data = tab === 'Revenue' ? revenueData : tab === 'Users' ? usersData : propertiesData;
    const csv = [
      ['Label', 'Value'],
      ...data.map(d => [d.name, d.value])
    ].map(e => e.join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tab}_Data.csv`;
    a.click();
    toast.success('Data exported to CSV');
  };

  const exportPDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(`Rentify Analytics: ${tab}`, 20, 20);
    
    // Add Chart Image
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 20, 30, 170, 80);
    }

    // Add Table
    const data = tab === 'Revenue' ? revenueData : tab === 'Users' ? usersData : propertiesData;
    doc.autoTable({
      startY: 120,
      head: [['Metric', tab === 'Revenue' ? 'Value (\u20B9)' : 'Value']],
      body: data.map(d => [d.name, tab === 'Revenue' ? d.value.toLocaleString('en-IN') : d.value.toString()])
    });

    doc.save(`${tab}_Report.pdf`);
    toast.success('PDF Report Generated');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-in fade-in duration-700 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Analytics Center</h1>
          <p className="text-slate-500 mt-1 font-medium">Export high-level ecosystem reports.</p>
        </div>
        <div className="flex gap-2 bg-slate-50 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
          {['Revenue', 'Users', 'Properties'].map(t => (
            <button 
              key={t} onClick={() => setTab(t)} 
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab === t ? 'bg-white dark:bg-slate-800 shadow-sm text-primary' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <div className="lg:col-span-3">
           <Card className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border-0 shadow-2xl relative">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-black">{tab} Overview</h3>
                 <div className="flex items-center gap-2 text-sm font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                   <Calendar size={14} /> Year to Date
                 </div>
              </div>
              <div ref={chartRef} className="h-[400px] w-full bg-white dark:bg-slate-900 p-4 rounded-xl">
                 <ResponsiveContainer width="100%" height="100%">
                   {tab === 'Revenue' ? (
                     <BarChart data={revenueData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} />
                       <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                       <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px' }} />
                       <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                     </BarChart>
                   ) : tab === 'Users' ? (
                     <LineChart data={usersData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} />
                       <YAxis axisLine={false} tickLine={false} />
                       <Tooltip cursor={{ stroke: '#94a3b8' }} contentStyle={{ borderRadius: '12px' }} />
                       <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 6 }} />
                     </LineChart>
                   ) : (
                     <PieChart>
                       <Tooltip contentStyle={{ borderRadius: '12px' }} />
                       <Pie data={propertiesData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                         {propertiesData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                       </Pie>
                     </PieChart>
                   )}
                 </ResponsiveContainer>
              </div>
           </Card>
         </div>

         <div className="space-y-4">
           <Card className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border-0 shadow-xl">
             <h4 className="font-black text-sm uppercase tracking-widest text-slate-400 mb-4">Export Options</h4>
             <div className="space-y-3">
               <Button onClick={exportPNG} className="w-full justify-start bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-white hover:text-primary hover:bg-blue-50 dark:hover:bg-slate-700 border-0 rounded-xl"><ImageIcon size={18} className="mr-3" /> Export as PNG</Button>
               <Button onClick={exportCSV} className="w-full justify-start bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-white hover:text-primary hover:bg-blue-50 dark:hover:bg-slate-700 border-0 rounded-xl"><Download size={18} className="mr-3" /> Download CSV</Button>
               <Button onClick={exportPDF} className="w-full justify-start bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-0 rounded-xl font-black shadow-lg"><FileText size={18} className="mr-3" /> Generate PDF Report</Button>
             </div>
           </Card>
           
           <Card className="bg-primary/10 border-0 p-6 rounded-[2rem] shadow-none">
             <h4 className="font-black text-primary mb-2">AI Insights</h4>
             <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Based on the current trajectory, {tab.toLowerCase()} is expected to grow by 12% in the next quarter.</p>
           </Card>
         </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
