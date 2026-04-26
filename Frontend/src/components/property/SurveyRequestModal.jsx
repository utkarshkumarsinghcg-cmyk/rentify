import { useFormik } from 'formik';
import * as Yup from 'yup';
import { X, MapPin, Home, Calendar, FileText, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Button from '../common/Button';
import Input from '../common/Input';

const SurveyRequestModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      propertyName: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      propertyType: 'apartment',
      bedrooms: '',
      bathrooms: '',
      areaSqft: '',
      preferredDate: '',
      additionalNotes: '',
    },
    validationSchema: Yup.object({
      propertyName: Yup.string().required('Property name is required'),
      address: Yup.string().required('Address is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      pincode: Yup.string()
        .matches(/^\d{6}$/, 'Must be a valid 6-digit pincode')
        .required('Pincode is required'),
      propertyType: Yup.string().required('Property type is required'),
      bedrooms: Yup.number()
        .min(1, 'At least 1 bedroom')
        .required('Required'),
      bathrooms: Yup.number()
        .min(1, 'At least 1 bathroom')
        .required('Required'),
      areaSqft: Yup.number()
        .min(100, 'Minimum area is 100 sqft')
        .required('Area is required'),
      preferredDate: Yup.date()
        .min(new Date(), 'Date must be in the future')
        .required('Preferred date is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      // Simulate API call
      await new Promise(r => setTimeout(r, 1200));
      console.log('Survey Request Submitted:', values);
      setSubmitting(false);
      setSubmitted(true);
    },
  });

  if (!isOpen) return null;

  const handleClose = () => {
    setSubmitted(false);
    formik.resetForm();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      {/* Modal */}
      <div 
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Home size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Request Property Survey</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Fill in the details to schedule an inspection</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success State */}
        {submitted ? (
          <div className="flex flex-col items-center justify-center p-16 text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Request Submitted!</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">
              Your survey request has been received. Our inspection team will contact you within 24–48 hours to confirm the schedule.
            </p>
            <Button variant="primary" className="mt-4" onClick={handleClose}>
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="p-6 space-y-8">
            {/* Property Info */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Home size={14} /> Property Details
              </h3>
              <Input
                label="Property Name / Title"
                id="propertyName"
                name="propertyName"
                placeholder="e.g. Lodha Belmondo"
                value={formik.values.propertyName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.propertyName && formik.errors.propertyName}
              />
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Property Type
                  </label>
                  <select
                    name="propertyType"
                    value={formik.values.propertyType}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="studio">Studio</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                <Input
                  label="No. of Bedrooms"
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  placeholder="e.g. 3"
                  value={formik.values.bedrooms}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.bedrooms && formik.errors.bedrooms}
                />
                <Input
                  label="No. of Bathrooms"
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  placeholder="e.g. 2"
                  value={formik.values.bathrooms}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.bathrooms && formik.errors.bathrooms}
                />
              </div>
              <Input
                label="Total Built-up Area (sq ft)"
                id="areaSqft"
                name="areaSqft"
                type="number"
                placeholder="e.g. 1200"
                value={formik.values.areaSqft}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.areaSqft && formik.errors.areaSqft}
              />
            </section>

            {/* Address */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <MapPin size={14} /> Location
              </h3>
              <Input
                label="Street Address"
                id="address"
                name="address"
                placeholder="e.g. Sector 12, Hiranandani Estate"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address && formik.errors.address}
              />
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="City"
                  id="city"
                  name="city"
                  placeholder="Mumbai"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.city && formik.errors.city}
                />
                <Input
                  label="State"
                  id="state"
                  name="state"
                  placeholder="Maharashtra"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.state && formik.errors.state}
                />
                <Input
                  label="Pincode"
                  id="pincode"
                  name="pincode"
                  placeholder="400001"
                  value={formik.values.pincode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.pincode && formik.errors.pincode}
                />
              </div>
            </section>

            {/* Scheduling */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Calendar size={14} /> Scheduling
              </h3>
              <Input
                label="Preferred Inspection Date"
                id="preferredDate"
                name="preferredDate"
                type="date"
                value={formik.values.preferredDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.preferredDate && formik.errors.preferredDate}
              />
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <span className="flex items-center gap-2"><FileText size={14} /> Additional Notes (Optional)</span>
                </label>
                <textarea
                  name="additionalNotes"
                  rows={3}
                  placeholder="Any special instructions or access requirements for the inspector..."
                  value={formik.values.additionalNotes}
                  onChange={formik.handleChange}
                  className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                />
              </div>
            </section>

            {/* Footer */}
            <div className="flex flex-col gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : 'Submit Survey Request'}
                </Button>
              </div>
              <p className="text-center text-xs text-slate-500">
                Already a partner?{' '}
                <button 
                  type="button" 
                  onClick={() => {
                    handleClose();
                    navigate('/login');
                  }} 
                  className="text-primary font-bold hover:underline"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SurveyRequestModal;
