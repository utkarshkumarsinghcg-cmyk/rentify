import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Send, User, Mail, MessageSquare, Phone } from 'lucide-react';
import { toast } from 'react-toastify';
import Input from './Input';
import Button from './Button';

const ContactForm = ({ propertyTitle = "" }) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      message: propertyTitle ? `I'm interested in ${propertyTitle}. Please provide more details.` : '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phone: Yup.string().matches(/^[0-9]{10}$/, 'Must be 10 digits').required('Phone is required'),
      message: Yup.string().min(10, 'Message too short').required('Message is required'),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        // Simulate API call
        await new Promise(r => setTimeout(r, 1500));
        console.log('Contact Form Submitted:', values);
        toast.success('Message sent successfully! We will contact you soon.');
        resetForm();
      } catch (error) {
        toast.error('Failed to send message. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          placeholder="John Doe"
          {...formik.getFieldProps('name')}
          error={formik.touched.name && formik.errors.name}
          icon={<User size={16} />}
        />
        <Input
          label="Email Address"
          placeholder="john@example.com"
          {...formik.getFieldProps('email')}
          error={formik.touched.email && formik.errors.email}
          icon={<Mail size={16} />}
        />
      </div>
      <Input
        label="Phone Number"
        placeholder="8847029740"
        {...formik.getFieldProps('phone')}
        error={formik.touched.phone && formik.errors.phone}
        icon={<Phone size={16} />}
      />
      <div className="space-y-1">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Message
        </label>
        <div className="relative">
          <textarea
            {...formik.getFieldProps('message')}
            className={`w-full pl-4 pr-4 py-3 bg-white dark:bg-slate-800 border ${
              formik.touched.message && formik.errors.message ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
            } rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none h-32`}
            placeholder="How can we help you?"
          />
        </div>
        {formik.touched.message && formik.errors.message && (
          <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-tight">{formik.errors.message}</p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full premium-gradient text-white border-0 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        isLoading={formik.isSubmitting}
      >
        {!formik.isSubmitting && <Send size={18} />}
        Send Message
      </Button>
    </form>
  );
};

export default ContactForm;
