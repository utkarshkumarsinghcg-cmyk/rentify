import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import Button from '../components/common/Button';
import { Download, Search, Filter, CreditCard } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import toast from 'react-hot-toast';

// Removing predefined mock data so new users don't see fake payments.
// In the future, this should be fetched from an API endpoint:
// e.g. const response = await fetch('/api/payments');
const mockPayments = [];

const PaymentsPage = () => {
  const [payments] = useState(mockPayments);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('All');

  const filtered = payments.filter(p => filter === 'All' || p.status === filter);
  const paginated = filtered.slice((page - 1) * 10, page * 10);
  const totalPages = Math.ceil(filtered.length / 10);

  const downloadReceipt = (txn) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Rentify — Payment Receipt", 20, 20);
    doc.setFontSize(12);
    doc.text(`Transaction ID: ${txn.id}`, 20, 35);
    doc.text(`Date: ${txn.date}`, 20, 45);
    doc.text(`Description: ${txn.desc}`, 20, 55);
    doc.text(`Amount: \u20B9${txn.amount.toLocaleString('en-IN')}`, 20, 65);
    doc.text(`Payment Method: ${txn.method}`, 20, 75);
    doc.text(`Status: ${txn.status}`, 20, 85);
    doc.setFontSize(9);
    doc.text('Rentify Property Management | CIN: U70200MH2024PTC000000', 20, 110);
    doc.text('GSTIN: 27AABCS1234A1Z5 | Support: 1800-209-9876 (Toll-Free)', 20, 118);
    doc.save(`Rentify_Receipt_${txn.id}.pdf`);
    toast.success('Receipt downloaded');
  };

  const exportAll = () => {
    const csv = [
      ['Transaction ID', 'Date', 'Description', 'Amount', 'Status'],
      ...filtered.map(p => [p.id, p.date, p.desc, p.amount, p.status])
    ].map(e => e.join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payment_history.csv';
    a.click();
    toast.success('Exported to CSV');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-700 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-2"><CreditCard className="text-primary"/> Payment History</h1>
          <p className="text-slate-500 mt-1 font-medium">View and download your transaction receipts.</p>
        </div>
        <div className="flex gap-3">
          <select value={filter} onChange={e => {setFilter(e.target.value); setPage(1);}} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm font-bold outline-none">
            <option>All</option><option>Paid</option><option>Pending</option><option>Failed</option>
          </select>
          <Button onClick={exportAll} variant="outline" className="rounded-xl px-4 py-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"><Download size={16} className="mr-2"/> Export CSV</Button>
        </div>
      </div>

      <Card className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase font-black tracking-widest text-slate-400">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {paginated.length > 0 ? (
                paginated.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-sm text-slate-900 dark:text-white">{txn.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">{txn.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{txn.desc}</td>
                    <td className="px-6 py-4 font-black text-slate-900 dark:text-white">₹{txn.amount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-[10px] uppercase tracking-wider font-black rounded-full ${txn.status === 'Paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : txn.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => downloadReceipt(txn)} className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500 font-medium">
                    No payment history available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
           <span className="text-xs font-bold text-slate-400">Page {page} of {totalPages || 1}</span>
           <div className="flex gap-2">
             <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} variant="outline" className="h-8 px-4 text-xs rounded-lg">Prev</Button>
             <Button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0} variant="outline" className="h-8 px-4 text-xs rounded-lg">Next</Button>
           </div>
        </div>
      </Card>
    </div>
  );
};

export default PaymentsPage;
