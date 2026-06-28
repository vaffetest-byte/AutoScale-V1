import React from 'react';
import { motion } from 'motion/react';

const LogoMarquee = () => {
  const row1 = [
    { name: 'Make', slug: 'make', color: '#6A1B9A' },
    { name: 'Stripe', slug: 'stripe', color: '#635BFF' },
    { name: 'Airtable', slug: 'airtable', color: '#18BFFF' },
    { name: 'Zoho', slug: 'zoho', color: '#E31D23' }
  ];
  
  const row2 = [
    { name: 'HubSpot', slug: 'hubspot', color: '#FF7A59' },
    { name: 'Zapier', slug: 'zapier', color: '#FF4A00' },
    { name: 'Google', slug: 'google', color: '#4285F4' },
    { name: 'Microsoft', slug: 'microsoft', color: '#00A4EF' },
    { name: 'OpenAI', slug: 'openai', color: '#412991' },
    { name: 'Anthropic', slug: 'anthropic', color: '#D97757' }
  ];

  return (
    <div className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Editorial Grid Background */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #64748b 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 mb-6"
        >
          <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-slate-500 uppercase">Ecosystem Connectivity</span>
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-semibold font-display text-slate-900 tracking-[-0.04em]"
        >
          Integrated with your <br />
          <span className="font-serif italic text-brand-blue">entire tech stack.</span>
        </motion.h2>
      </div>
      
      <div className="relative space-y-12">
        {/* Gradient Masks */}
        <div className="absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent z-20 pointer-events-none" />
        
        {/* Row 1: Left to Right */}
        <div className="flex overflow-hidden">
          <motion.div 
            className="flex gap-16 items-center whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            {[...row1, ...row1, ...row1].map((logo, i) => (
              <div 
                key={i} 
                className="flex items-center gap-4 group/logo cursor-pointer"
              >
                <div className="relative w-8 h-8">
                  <img 
                    src={`https://cdn.simpleicons.org/${logo.slug}/64748b`} 
                    alt="" 
                    className="absolute inset-0 w-full h-full opacity-40 group-hover/logo:opacity-0 transition-opacity duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <img 
                    src={`https://cdn.simpleicons.org/${logo.slug}/${logo.color.replace('#', '')}`} 
                    alt="" 
                    className="absolute inset-0 w-full h-full opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-200 group-hover/logo:text-slate-400 transition-colors duration-500 uppercase">
                  {logo.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Row 2: Right to Left */}
        <div className="flex overflow-hidden">
          <motion.div 
            className="flex gap-16 items-center whitespace-nowrap"
            animate={{ x: ["-50%", "0%"] }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          >
            {[...row2, ...row2, ...row2].map((logo, i) => (
              <div 
                key={i} 
                className="flex items-center gap-4 group/logo cursor-pointer"
              >
                <div className="relative w-8 h-8">
                  <img 
                    src={`https://cdn.simpleicons.org/${logo.slug}/64748b`} 
                    alt="" 
                    className="absolute inset-0 w-full h-full opacity-40 group-hover/logo:opacity-0 transition-opacity duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <img 
                    src={`https://cdn.simpleicons.org/${logo.slug}/${logo.color.replace('#', '')}`} 
                    alt="" 
                    className="absolute inset-0 w-full h-full opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-200 group-hover/logo:text-slate-400 transition-colors duration-500 uppercase">
                  {logo.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LogoMarquee;
