import React, { useState, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, Upload, Check, Home } from 'lucide-react';
import toast from 'react-hot-toast';

const AMENITIES = ['WiFi', 'Parking', 'Gym', 'Pool', 'Security', 'Power Backup', 'Lift', 'AC', 'Garden'];
const TYPES = ['Apartment', 'House', 'Studio', 'Villa'];

const emptyForm = {
  title: '', description: '', type: 'Apartment', city: '', address: '',
  rent: '', bedrooms: '', bathrooms: '', amenities: [], images: [], available: true,
  pincode: '', addressDetails: ''
};

export default function AddPropertyModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialData || emptyForm);
  const [errors, setErrors] = useState({});
  const [previews, setPreviews] = useState(initialData?.images || []);
  const fileRef = useRef();

  if (!isOpen) return null;

  const validate = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.title.trim()) e.title = 'Title is required';
      if (!form.description.trim()) e.description = 'Description is required';
      if (!form.city.trim()) e.city = 'City is required';
      if (!form.address.trim()) e.address = 'Address is required';
    }
    if (s === 2) {
      if (!form.rent || isNaN(form.rent) || +form.rent <= 0) e.rent = 'Valid rent is required';
      if (!form.bedrooms || isNaN(form.bedrooms)) e.bedrooms = 'Bedrooms required';
      if (!form.bathrooms || isNaN(form.bathrooms)) e.bathrooms = 'Bathrooms required';
    }
    return e;
  };

  const next = () => {
    const e = validate(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(s => s + 1);
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 6 - previews.length);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setPreviews(p => [...p, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (i) => setPreviews(p => p.filter((_, idx) => idx !== i));

  const toggleAmenity = (a) => setForm(f => ({
    ...f, amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a]
  }));

  const handleSubmit = () => {
    onSubmit({ ...form, images: previews, rent: +form.rent, bedrooms: +form.bedrooms, bathrooms: +form.bathrooms });
    toast.success(initialData ? 'Property updated ✓' : 'Property added successfully ✓');
    setStep(1); setForm(emptyForm); setPreviews([]);
    onClose();
  };

  const progress = (step / 3) * 100;
  const stepLabels = ['Basic Info', 'Details', 'Media'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{initialData ? 'Edit Property' : 'Add New Property'}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Step {step} of 3 — {stepLabels[step - 1]}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><X size={18} /></button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-slate-100 dark:bg-slate-800">
          <div className="h-1 bg-blue-500 transition-all duration-500 rounded-full" style={{ width: `${progress}%` }} />
        </div>

        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* Step 1 */}
          {step === 1 && (
            <>
              {[['title', 'Property Title', 'text', 'Skyline Lofts #402'],
                ['city', 'City', 'text', 'Mumbai'],
                ['pincode', 'Pincode', 'text', '400001'],
                ['address', 'Neighborhood/Area', 'text', '123 Main Street'],
                ['addressDetails', 'House/Flat No. & Details', 'text', 'Flat 402, B-Wing']].map(([field, label, type, ph]) => (
                <div key={field}>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>
                  <input type={type} placeholder={ph} value={form[field]}
                    onChange={e => { setForm(f => ({ ...f, [field]: e.target.value })); setErrors(er => ({ ...er, [field]: null })); }}
                    className={`w-full bg-slate-50 dark:bg-slate-800 border ${errors[field] ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors[field] && <p className="text-rose-500 text-xs mt-1">{errors[field]}</p>}
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Property Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {TYPES.map(t => (
                    <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${form.type === t ? 'bg-blue-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Description</label>
                <textarea rows={3} placeholder="Describe the property..." value={form.description}
                  onChange={e => { setForm(f => ({ ...f, description: e.target.value })); setErrors(er => ({ ...er, description: null })); }}
                  className={`w-full bg-slate-50 dark:bg-slate-800 border ${errors.description ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                />
                {errors.description && <p className="text-rose-500 text-xs mt-1">{errors.description}</p>}
              </div>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <div className="grid grid-cols-3 gap-4">
                {[['rent', 'Monthly Rent (₹)', '28000'], ['bedrooms', 'Bedrooms', '3'], ['bathrooms', 'Bathrooms', '2']].map(([field, label, ph]) => (
                  <div key={field}>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>
                    <input type="number" placeholder={ph} value={form[field]}
                      onChange={e => { setForm(f => ({ ...f, [field]: e.target.value })); setErrors(er => ({ ...er, [field]: null })); }}
                      className={`w-full bg-slate-50 dark:bg-slate-800 border ${errors[field] ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors[field] && <p className="text-rose-500 text-xs mt-1">{errors[field]}</p>}
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wider">Amenities</label>
                <div className="grid grid-cols-3 gap-2">
                  {AMENITIES.map(a => {
                    const active = form.amenities.includes(a);
                    return (
                      <button key={a} type="button" onClick={() => toggleAmenity(a)}
                        className={`flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all border ${active ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-300'}`}>
                        {active && <Check size={12} />}{a}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wider">Images (up to 6)</label>
                {previews.length < 6 && (
                  <button type="button" onClick={() => fileRef.current.click()}
                    className="w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all">
                    <Upload size={24} />
                    <span className="text-xs font-bold">Click to upload images</span>
                  </button>
                )}
                <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImages} />
                {previews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {previews.map((src, i) => (
                      <div key={i} className="relative group aspect-video rounded-xl overflow-hidden">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <Home size={18} className="text-slate-500" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Mark as Available</p>
                    <p className="text-xs text-slate-500">Visible to renters</p>
                  </div>
                </div>
                <button type="button" onClick={() => setForm(f => ({ ...f, available: !f.available }))}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${form.available ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${form.available ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex gap-3">
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              <ChevronLeft size={16} /> Back
            </button>
          )}
          <div className="flex-1" />
          {step < 3 ? (
            <button onClick={next}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all">
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all">
              <Check size={16} /> Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
