import React from 'react';
import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { InlineWidget } from 'react-calendly';

const BookingSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="booking" className="py-32 px-6 relative overflow-hidden bg-white" ref={ref}>
      {/* Soft Ambient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.05),transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-[radial-gradient(circle_at_20%_80%,rgba(139,92,246,0.05),transparent_50%)]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative group mt-12"
        >
          {/* Decorative Glow */}
          <div className="absolute -inset-4 bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 rounded-[48px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
          
          <div className="bg-white rounded-[40px] p-8 md:p-12 text-center border border-slate-100 shadow-[0_32px_64px_-16px_rgba(15,23,42,0.08)] overflow-hidden">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-brand-blue text-[10px] font-bold mb-6 tracking-widest uppercase">
                Schedule Your Audit
              </div>
              <h2 className="text-4xl md:text-6xl font-semibold font-display mb-6 text-slate-900 tracking-[-0.04em]">
                Your Journey to <span className="font-serif italic text-brand-blue">Efficiency.</span>
              </h2>
              <p className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
                Experience the AutoScale concierge service. Pick a slot that fits your schedule for a dedicated 1-on-1 automation assessment.
              </p>
            </motion.div>
            
            <div className="w-full overflow-hidden rounded-2xl bg-white relative min-h-[750px]">
              {/* Overlay to mask iframe top edges if needed for a "native" feel */}
              <div className="absolute top-0 inset-x-0 h-4 bg-white z-10 pointer-events-none" />
              
              {inView ? (
                <InlineWidget 
                  url="https://calendly.com/victor-autoscale/30min"
                  styles={{
                    height: '750px',
                    width: '100%',
                  }}
                  pageSettings={{
                    backgroundColor: 'ffffff',
                    hideEventTypeDetails: false,
                    hideLandingPageDetails: false,
                    primaryColor: '3b82f6',
                    textColor: '0f172a'
                  }}
                />
              ) : (
                <div className="w-full h-[750px] flex items-center justify-center bg-slate-50 animate-pulse rounded-2xl">
                  <div className="text-slate-400 font-medium">Loading Calendar...</div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingSection;
