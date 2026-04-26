import React from 'react';
import { Shield, FileText, Download, Printer } from 'lucide-react';
import Button from '../common/Button';

const LeaseAgreement = () => {
  return (
    <div className="max-w-4xl mx-auto my-12 p-12 bg-white dark:bg-slate-900 shadow-2xl rounded-sm border border-slate-200 dark:border-slate-800 font-serif text-slate-800 dark:text-slate-300 leading-relaxed print:m-0 print:p-8 print:shadow-none print:border-none">
      
      {/* Header */}
      <div className="text-center mb-12 border-b-4 border-double border-slate-900 dark:border-white pb-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-2">LEASE DEED</h1>
        <p className="text-xs font-sans text-slate-500 uppercase tracking-widest font-bold">Registration No: SR-LD-2026/0894 • State of Registry: Maharashtra</p>
      </div>

      {/* Action Bar (Print/Download) */}
      <div className="flex justify-end gap-4 mb-8 font-sans print:hidden">
        <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => window.print()}>
          <Printer size={16} /> Print
        </Button>
        <Button variant="primary" size="sm" className="flex items-center gap-2">
          <Download size={16} /> Download PDF
        </Button>
      </div>

      <div className="space-y-6 text-sm">
        <p className="text-justify italic mb-8">
          THIS DEED OF LEASE made on this <span className="font-bold underline">12th day of April, 2026</span> at <span className="font-bold">Mumbai Corporate Office</span> between <span className="font-bold underline">RENTIFY ASSETS LTD</span>, hereinafter referred to as the **Lessor** (which term shall mean and include wherever the context so requires or admits his/their heirs, successors, administrators, executors, attorneys and assigns) of the One part and <span className="font-bold underline">GLOBAL INNOVATIONS BANK</span> a body corporate, hereinafter referred to as the **Lessees** of the Other Part.
        </p>

        <section>
          <p className="mb-4">WHEREAS, the Lessor/s is/are the owners of the building bearing No. <span className="font-bold underline">742-H</span> situated at <span className="font-bold underline">Bandra Kurla Complex, Mumbai</span> which is declared to be value of Rs. <span className="font-bold underline">1,50,00,000</span> by him / them.</p>
          <p className="mb-4">WHEREAS, the Ground floor measuring about <span className="font-bold underline">2,400 sq.ft. (Carpet area)</span> in the said building more fully described in the schedule hereto and hereinafter called the **"Said Premises"** was ready for occupation.</p>
        </section>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
          <p><span className="font-bold">1. COMMENCEMENT:</span> This lease for purposes of payment of rent and period of lease shall be deemed to have commenced from <span className="font-bold underline">May 01, 2026</span>.</p>
          
          <p><span className="font-bold">2. TERM:</span> This lease shall be in force for a period of <span className="font-bold underline">3 years</span> certain from the date of commencement. The Lessee shall, however, have the option to continue the lease thereafter for a further period upto <span className="font-bold underline">2 years</span>.</p>
          
          <p><span className="font-bold">3. RENTAL:</span> The Lessee shall pay to the Lessor/s in respect of the ‘said premises’ a monthly rental of <span className="font-bold underline">Rs. 85,000/- (Rupees Eighty Five Thousand only)</span> for the certain period of lease, payable within the fifth working day of each succeeding calendar month.</p>
          
          <p><span className="font-bold">4. DEPOSIT:</span> The Lessee has paid to the Lessor/s a sum of <span className="font-bold underline">Rs. 255,000/- (Rupees Two Lakhs Fifty Five Thousand only)</span> being <span className="font-bold underline">3 months rent</span> as deposit to be adjusted towards the rent for the last months of the tenancy.</p>
          
          <p><span className="font-bold">5. REPAIRS & PAINTING:</span> The Lessor shall, at his/their own cost, carry out all repairs including periodical painting. The periodicity of such painting will be once in <span className="font-bold underline">3 years</span>. If the Lessor fails to carry out such repairs, the Lessee shall be at liberty to get it done and adjust the amount from the rent.</p>
          
          <p><span className="font-bold">6. SUB-LEASE:</span> The Lessee shall be at liberty to under-lease / sub-lease the ‘said premises’ or part thereof to any of its subsidiaries or to any other party without additional consent requirement.</p>

          <p><span className="font-bold">7. SPECIAL INSTALLATIONS:</span> The Lessor has no objection to the Lessee installing:</p>
          <ul className="list-disc pl-8 space-y-2">
            <li>Exclusive generator sets free of cost for installation space.</li>
            <li>ATM machine in the said premises at any time without additional rent.</li>
            <li>V-SAT antenna on the rooftop (free of cost).</li>
            <li>Company signboards / advertisements on the frontages and side walls without additional charges.</li>
          </ul>

          <p><span className="font-bold">8. STRUCTURAL ALTERATIONS:</span> The Lessee is at liberty and no permission of Lessor is required for fixing wooden partitions, cabins, counters, false ceiling, and other office furniture or fixtures.</p>
        </div>

        {/* Schedule */}
        <section className="bg-slate-50 dark:bg-slate-800/30 p-6 border border-slate-200 dark:border-slate-700 mt-12">
          <h3 className="text-center font-bold mb-4 uppercase underline underline-offset-4">Schedule of the Property</h3>
          <p className="text-xs">All that piece and parcel of the Ground Floor premises at Building No. 742-H, BKC, Mumbai, measuring 2,400 sq.ft., bounded as follows:</p>
          <div className="grid grid-cols-2 gap-4 mt-4 text-[10px] uppercase font-bold text-slate-500">
            <div>North: Main Road / Entry</div>
            <div>South: Residential Complex</div>
            <div>East: Plot 741-G</div>
            <div>West: Public Garden</div>
          </div>
        </section>

        {/* Signatures */}
        <div className="pt-16">
          <p className="mb-12">In witness whereof the parties hereto have set their hands hereunto in full agreement of the terms and conditions set-forth herein above.</p>
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="border-b-2 border-slate-300 h-12 flex items-end font-serif italic text-xl">Rentify Assets Ltd.</div>
              <p className="text-[10px] uppercase font-black">LESSOR / S</p>
            </div>
            <div className="space-y-8">
              <div className="border-b-2 border-slate-300 h-12 flex items-end font-serif italic text-xl text-primary/40">Digital Signature Verified</div>
              <p className="text-[10px] uppercase font-black">LESSEE</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-12 pt-16">
          <div className="text-center space-y-2">
            <div className="w-32 border-b border-slate-300 h-8"></div>
            <p className="text-[9px] uppercase font-bold text-slate-400">Witness 1</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-32 border-b border-slate-300 h-8"></div>
            <p className="text-[9px] uppercase font-bold text-slate-400">Witness 2</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaseAgreement;
