import React from 'react';
// Official WhatsApp SVG Icon
const WhatsAppIcon = ({ size = 24, className = "" }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.012 2.25c-5.378 0-9.754 4.373-9.754 9.75 0 1.718.447 3.332 1.232 4.738L2.25 21.75l5.163-1.353a9.71 9.71 0 004.599 1.153c5.377 0 9.754-4.374 9.754-9.75s-4.377-9.75-9.754-9.75zm5.727 13.821c-.244.689-1.42 1.267-1.954 1.344-.534.077-1.077.106-3.155-.758-2.658-1.107-4.37-3.804-4.503-3.982-.133-.178-1.082-1.439-1.082-2.747 0-1.309.688-1.953.932-2.221.244-.268.533-.334.711-.334.178 0 .356.002.511.01.171.008.402-.065.629.479.227.545.777 1.89.844 2.023.067.133.111.289.022.467-.089.178-.133.289-.267.444-.133.156-.279.349-.399.468-.133.133-.273.279-.118.544.156.266.691 1.141 1.482 1.844.615.548 1.134.819 1.401.953.266.133.422.111.578-.067.156-.178.667-.777.844-1.044.178-.266.355-.222.6-.133.244.089 1.554.733 1.821.867.266.133.444.2.511.311.067.11.067.644-.177 1.332z" />
  </svg>
);

const FloatingWhatsApp = () => {
  const phoneNumber = '918847029740'; 
  const message = 'Hello Rentify! I need assistance with...';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[90] w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
      aria-label="Contact us on WhatsApp"
    >
      <div className="absolute -top-12 right-0 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-100 dark:border-slate-700 pointer-events-none">
        Chat with us!
        <div className="absolute bottom-[-6px] right-5 w-3 h-3 bg-white dark:bg-slate-800 rotate-45 border-r border-b border-slate-100 dark:border-slate-700"></div>
      </div>
      <WhatsAppIcon size={32} className="text-white" />
    </a>
  );
};

export default FloatingWhatsApp;
