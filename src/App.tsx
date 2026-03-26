import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { 
  Zap, 
  Bot, 
  Database, 
  Layout, 
  Rocket, 
  Globe, 
  CheckCircle2, 
  ArrowRight, 
  Menu, 
  X, 
  Star, 
  BarChart3, 
  Users, 
  Clock, 
  MessageSquare,
  ChevronRight,
  Play,
  Calendar,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  MapPin,
  Phone
} from 'lucide-react';
import { cn } from './lib/utils';
import { useInView } from 'react-intersection-observer';
import { InlineWidget } from 'react-calendly';
import { useMotionValue, useSpring as useFramerSpring } from 'motion/react';

// --- Components ---

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const springConfig = { damping: 25, stiffness: 150 };
  const cursorXSpring = useFramerSpring(cursorX, springConfig);
  const cursorYSpring = useFramerSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = target.closest('button, a, input, textarea, [role="button"]');
      setIsHovering(!!isClickable);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    const handleMouseOut = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseOut);
    document.addEventListener('mouseenter', () => setIsVisible(true));

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseOut);
      document.removeEventListener('mouseenter', () => setIsVisible(true));
    };
  }, [isVisible]);

  if (typeof window === 'undefined') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden lg:block">
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-brand-blue/50 mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
          scale: isClicked ? 0.8 : (isHovering ? 2 : 1),
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ scale: { type: 'spring', stiffness: 300, damping: 20 } }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-brand-blue"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          scale: isClicked ? 1.5 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ scale: { type: 'spring', stiffness: 300, damping: 20 } }}
      />
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Results', href: '#results' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "bg-black/60 backdrop-blur-md border-b border-white/10" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/logo-icon.svg" 
            alt="AutoScale Logo" 
            className="w-10 h-10"
            referrerPolicy="no-referrer"
            fetchpriority="high"
          />
          <div className="flex flex-col leading-none">
            <span className="text-xl font-bold tracking-tight font-display text-white">AutoScale</span>
            <span className="text-[10px] font-medium tracking-[0.3em] text-white/50 uppercase">WORKS</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a 
            href="#booking"
            className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-brand-blue hover:text-white transition-all duration-300"
          >
            Get in Touch
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-lg font-medium text-white/70"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#booking"
              className="w-full py-4 bg-white text-black font-bold rounded-xl mt-2 text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get in Touch
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    setRotate({ x: rotateX, y: rotateY });
  };

  const onMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ transformStyle: "preserve-3d" }}
      className={cn("perspective-1000", className)}
    >
      {children}
    </motion.div>
  );
};

const StaggeredText = ({ text, className }: { text: string, className?: string }) => {
  const words = text.split(" ");
  return (
    <div className={cn("flex flex-wrap gap-x-[0.3em]", className)}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

const HeroForm = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', website: '', phone: '', requirement: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const response = await fetch('https://formsubmit.co/ajax/Victor@Autoscale.works', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          _subject: `New AI Audit Request from ${formData.name}`,
          _template: 'table',
          _captcha: 'false'
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', website: '', phone: '', requirement: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        const errorData = await response.json();
        console.error('Submission error:', errorData);
        alert('Something went wrong. Please try again or contact us directly.');
        setStatus('idle');
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('Network error. Please check your connection and try again.');
      setStatus('idle');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="relative p-1 rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 shadow-2xl overflow-hidden group"
    >
      <div className="absolute inset-0 bg-brand-blue/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 bg-[#080808]/80 backdrop-blur-xl rounded-[22px] p-8">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Zap className="w-5 h-5 text-brand-cyan" />
          Let's get in touch
        </h3>
        <p className="text-sm text-white/40 mb-8">Fill out the form below and we'll get back to you within 24 hours.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Full Name</label>
              <input 
                type="text" 
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-blue transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Email Address</label>
              <input 
                type="email" 
                required
                placeholder="john@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-blue transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Phone Number</label>
              <input 
                type="tel" 
                required
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-blue transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Website URL (Optional)</label>
              <input 
                type="url" 
                placeholder="https://yourbusiness.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-blue transition-colors"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Your Requirements</label>
            <textarea 
              required
              placeholder="Tell us about your business and what you'd like to automate..."
              value={formData.requirement}
              onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-blue transition-colors resize-none"
            />
          </div>

          <button 
            type="submit"
            disabled={status !== 'idle'}
            className="w-full py-4 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {status === 'idle' && (
              <>
                Get in Touch
                <ArrowRight className="w-5 h-5" />
              </>
            )}
            {status === 'submitting' && (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {status === 'success' && (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Audit Request Sent!
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 flex items-center justify-center gap-6 text-[10px] font-bold text-white/20 uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-brand-cyan" />
            No Credit Card
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-brand-cyan" />
            24h Response
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden px-6">
      {/* Dynamic Background Glow */}
      <div 
        className="absolute inset-0 z-0 bg-glow transition-all duration-300 pointer-events-none"
        style={{ '--x': `${mousePos.x}%`, '--y': `${mousePos.y}%` } as any}
      />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-brand-cyan text-[10px] font-bold mb-6 tracking-widest"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
            </span>
            NEXT-GEN AUTOMATION FOR MODERN TEAMS
          </motion.div>
          
          <StaggeredText 
            text="Automate Your Business with AI + CRM" 
            className="text-5xl md:text-7xl font-bold font-display leading-[1.1] mb-6"
          />
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-lg md:text-xl text-white/60 mb-10 max-w-xl leading-relaxed"
          >
            Scale your operations, sales, and customer support without increasing team size. We build the systems that do the work for you.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a 
              href="#booking"
              className="px-8 py-4 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold rounded-full hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all flex items-center justify-center gap-2 group"
            >
              Get in Touch
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#how-it-works"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              See How It Works
            </a>
          </motion.div>
        </div>

        <div className="relative lg:mt-0 mt-12">
          <HeroForm />
        </div>
      </div>
    </section>
  );
};

const ImplementationServices = () => {
  const services = [
    {
      title: "Strategy & Architecture",
      desc: "We design the blueprint for your AI ecosystem, ensuring scalability and security from day one.",
      icon: "🏗️",
      tags: ["System Design", "Tech Selection", "ROI Mapping"]
    },
    {
      title: "Bespoke Development",
      desc: "Our engineers build custom AI agents and automation workflows tailored to your specific business logic.",
      icon: "💻",
      tags: ["Custom Agents", "API Hooks", "Logic Flow"]
    },
    {
      title: "Seamless Integration",
      desc: "We connect your new AI capabilities with the tools you already use, creating a unified data flow.",
      icon: "🔗",
      tags: ["Tool Sync", "Data Pipeline", "Legacy Support"]
    },
    {
      title: "Training & Support",
      desc: "We don't just hand over the keys; we train your team and provide ongoing optimization support.",
      icon: "🎓",
      tags: ["Team Onboarding", "Performance Tuning", "24/7 Support"]
    }
  ];

  return (
    <section className="py-32 bg-[#030303] relative overflow-hidden px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-white/60 uppercase">Beyond Integration</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold font-display mb-6"
          >
            Full-Cycle <span className="text-gradient">Implementation.</span>
          </motion.h2>
          <p className="text-white/40 max-w-2xl mx-auto text-lg">
            We provide the technical expertise and strategic guidance needed to successfully deploy AI across your entire organization.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity text-6xl pointer-events-none">
                {s.icon}
              </div>
              <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-500">
                {s.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-brand-blue transition-colors">{s.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed mb-8">{s.desc}</p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map((tag, j) => (
                  <span key={j} className="text-[9px] font-bold tracking-widest text-white/20 uppercase px-2 py-1 rounded-md border border-white/5">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

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
    <div className="py-24 bg-[#030303] relative overflow-hidden">
      {/* Editorial Grid Background */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
        >
          <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-white/60 uppercase">Ecosystem Connectivity</span>
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold font-display"
        >
          Integrated with your <span className="text-gradient italic">entire stack.</span>
        </motion.h2>
      </div>
      
      <div className="relative space-y-12">
        {/* Gradient Masks */}
        <div className="absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-[#030303] via-[#030303]/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-[#030303] via-[#030303]/80 to-transparent z-20 pointer-events-none" />
        
        {/* Row 1: Left to Right */}
        <div className="flex overflow-hidden">
          <motion.div 
            className="flex gap-16 items-center whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            {[...row1, ...row1].map((logo, i) => (
              <div 
                key={i} 
                className="flex items-center gap-4 group/logo cursor-pointer"
              >
                <div className="relative w-8 h-8">
                  <img 
                    src={`https://cdn.simpleicons.org/${logo.slug}/white`} 
                    alt={logo.name} 
                    className="absolute inset-0 w-full h-full opacity-20 group-hover/logo:opacity-0 transition-opacity duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <img 
                    src={`https://cdn.simpleicons.org/${logo.slug}/${logo.color.replace('#', '')}`} 
                    alt={logo.name} 
                    className="absolute inset-0 w-full h-full opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-lg font-bold tracking-tight text-white/10 group-hover/logo:text-white/60 transition-colors duration-500 uppercase">
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
            {[...row2, ...row2].map((logo, i) => (
              <div 
                key={i} 
                className="flex items-center gap-4 group/logo cursor-pointer"
              >
                <div className="relative w-8 h-8">
                  <img 
                    src={`https://cdn.simpleicons.org/${logo.slug}/white`} 
                    alt={logo.name} 
                    className="absolute inset-0 w-full h-full opacity-20 group-hover/logo:opacity-0 transition-opacity duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <img 
                    src={`https://cdn.simpleicons.org/${logo.slug}/${logo.color.replace('#', '')}`} 
                    alt={logo.name} 
                    className="absolute inset-0 w-full h-full opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-lg font-bold tracking-tight text-white/10 group-hover/logo:text-white/60 transition-colors duration-500 uppercase">
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

const ResultsPreviewSection = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  return (
    <section className="py-12 px-6 relative z-10 -mt-20 lg:block hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div style={{ scale, opacity }}>
          <TiltCard>
            <div className="relative z-10 glass rounded-3xl p-6 border-white/20 shadow-[0_0_50px_rgba(59,130,246,0.15)]">
              <div className="bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5">
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                  </div>
                  <div className="text-[10px] text-white/30 font-mono tracking-widest uppercase">autoscale-dashboard.v1</div>
                  <div className="w-12" />
                </div>
                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-[10px] text-white/40 mb-1 uppercase tracking-widest font-bold">Lead Conversion</div>
                      <div className="text-2xl font-bold text-brand-cyan">+42%</div>
                      <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '75%' }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="h-full bg-brand-cyan shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
                        />
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-[10px] text-white/40 mb-1 uppercase tracking-widest font-bold">Time Saved</div>
                      <div className="text-2xl font-bold text-brand-purple">120h/mo</div>
                      <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '90%' }}
                          transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
                          className="h-full bg-brand-purple shadow-[0_0_10px_rgba(139,92,246,0.5)]" 
                        />
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-[10px] text-white/40 mb-1 uppercase tracking-widest font-bold">ROI Increase</div>
                      <div className="text-2xl font-bold text-brand-blue">3.5x</div>
                      <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '85%' }}
                          transition={{ duration: 2, delay: 1, repeat: Infinity }}
                          className="h-full bg-brand-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="h-4 w-full rounded bg-white/5" />
                      <div className="h-4 w-5/6 rounded bg-white/5" />
                      <div className="h-4 w-4/6 rounded bg-white/5" />
                      <div className="h-4 w-full rounded bg-white/5" />
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                      <Bot className="w-12 h-12 text-brand-blue mb-4 animate-float" />
                      <div className="text-xs font-bold text-white/60 uppercase tracking-widest">AI Agent Active</div>
                      <div className="text-[10px] text-white/30 mt-1">Processing 42 leads/min</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
};

const ProblemSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const problems = [
    { icon: <Users className="w-6 h-6" />, title: "Losing Leads", desc: "Potential customers slip through the cracks due to slow response times." },
    { icon: <Clock className="w-6 h-6" />, title: "Manual Follow-ups", desc: "Your team spends hours on repetitive emails instead of closing deals." },
    { icon: <Database className="w-6 h-6" />, title: "Disorganized Data", desc: "Customer info is scattered across sheets, emails, and sticky notes." },
    { icon: <Rocket className="w-6 h-6" />, title: "Wasted Potential", desc: "Your business can't scale because your processes are manual and brittle." },
  ];

  return (
    <section className="py-24 px-6 bg-[#050505]" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="text-3xl md:text-5xl font-bold font-display mb-6"
          >
            Is your business <span className="text-red-500">leaking revenue?</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            Most businesses fail to scale not because of a bad product, but because of inefficient, manual operations.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-red-500/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
                {p.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{p.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ServicesSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const services = [
    {
      title: "AI Agent as a Service",
      desc: "Deploy intelligent AI agents for customer support, lead qualification, and 24/7 automation.",
      icon: <Bot className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-400",
      benefits: ["24/7 Availability", "Instant Responses", "Cost Reduction"]
    },
    {
      title: "CRM Implementation",
      desc: "Custom CRM setup (Zoho, HubSpot, etc.) with optimized sales pipelines and data flow.",
      icon: <Database className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500",
      benefits: ["Centralized Data", "Sales Tracking", "Automated Reporting"]
    },
    {
      title: "Workflow Automation",
      desc: "Automate lead capture, email follow-ups, and repetitive processes using Zapier and Make.",
      icon: <Zap className="w-8 h-8" />,
      color: "from-orange-500 to-yellow-500",
      benefits: ["Zero Manual Entry", "Error Reduction", "Faster Execution"]
    },
    {
      title: "Data & Analytics",
      desc: "Centralize your data, build custom dashboards, and provide real-time business insights.",
      icon: <BarChart3 className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500",
      benefits: ["Visual Dashboards", "KPI Tracking", "Data-Driven Decisions"]
    },
    {
      title: "MVP App Creation",
      desc: "Build rapid MVPs and internal tools to test ideas and automate complex operations.",
      icon: <Rocket className="w-8 h-8" />,
      color: "from-brand-blue to-brand-purple",
      benefits: ["Rapid Prototyping", "Scalable Tech Stack", "Internal Efficiency"]
    },
    {
      title: "Website Creation",
      desc: "High-converting websites with deep CRM integrations and built-in automation.",
      icon: <Globe className="w-8 h-8" />,
      color: "from-brand-cyan to-blue-600",
      benefits: ["Conversion Focused", "SEO Optimized", "CRM Integrated"]
    }
  ];

  return (
    <section id="services" className="py-32 px-6 relative overflow-hidden" ref={ref}>
      {/* Parallax Background Elements */}
      <motion.div 
        style={{ y: useTransform(useScroll().scrollYProgress, [0, 1], [0, -100]) }}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20"
      >
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl" />
      </motion.div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              className="text-brand-blue font-bold text-[10px] tracking-[0.2em] uppercase mb-4"
            >
              Our Expertise
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              className="text-4xl md:text-6xl font-bold font-display"
            >
              Solutions designed to <span className="text-gradient">scale.</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-white/40 max-w-sm"
          >
            We don't just give you tools; we build the infrastructure for your next phase of growth.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
            >
              <TiltCard className="h-full">
                <motion.div 
                  whileHover={{ 
                    y: -12,
                    boxShadow: "0 20px 40px -20px rgba(59, 130, 246, 0.5)",
                  }}
                  className="group relative h-full p-8 rounded-3xl bg-white/[0.03] border border-white/5 overflow-hidden transition-all hover:bg-white/[0.05]"
                >
                  {/* Hover Gradient */}
                  <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br",
                    s.color
                  )} />
                  
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-gradient-to-br text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500",
                    s.color
                  )}>
                    {s.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-cyan transition-colors font-display">{s.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-8">{s.desc}</p>
                  
                  <div className="space-y-3">
                    {s.benefits.map((b, j) => (
                      <motion.div 
                        key={j} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.5 + (i * 0.1) + (j * 0.05) }}
                        className="flex items-center gap-2 text-xs font-medium text-white/70"
                      >
                        <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                        {b}
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-white/30">Learn More</span>
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const steps = [
    { number: "01", title: "Audit Your Business", desc: "We dive deep into your current workflows to identify bottlenecks and automation opportunities." },
    { number: "02", title: "Build Systems", desc: "Our team develops custom AI agents, CRM integrations, and automated workflows tailored to your needs." },
    { number: "03", title: "Scale with AI", desc: "Launch your new systems and watch your business scale faster without increasing overhead." },
  ];

  return (
    <section id="how-it-works" className="py-32 px-6 bg-[#030303] relative" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold font-display mb-6"
          >
            The Path to <span className="text-gradient">Efficiency</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/50 max-w-xl mx-auto"
          >
            A proven 3-step process to transform your manual operations into a high-performance engine.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5 hidden lg:block -translate-y-1/2" />
          
          <div className="grid lg:grid-cols-3 gap-12 relative z-10">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-full bg-black border border-white/10 flex items-center justify-center text-3xl font-bold font-display text-brand-blue mb-8 relative group">
                  <div className="absolute inset-0 rounded-full bg-brand-blue/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  {s.number}
                </div>
                <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
                <p className="text-white/40 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const MetricsSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const metrics = [
    { label: "Lead Conversion", value: "42", suffix: "%", icon: <BarChart3 /> },
    { label: "Hours Saved / Mo", value: "120", suffix: "+", icon: <Clock /> },
    { label: "Revenue Growth", value: "3.5", suffix: "x", icon: <Rocket /> },
    { label: "Client Satisfaction", value: "99", suffix: "%", icon: <Star /> },
  ];

  return (
    <section id="results" className="py-24 px-6 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-glow opacity-50" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((m, i) => (
            <div key={i} className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-brand-cyan mb-4 flex justify-center opacity-50">
                  {React.cloneElement(m.icon as React.ReactElement, { className: "w-8 h-8" })}
                </div>
                <div className="text-5xl md:text-6xl font-bold font-display mb-2">
                  {inView ? (
                    <Counter value={parseFloat(m.value)} suffix={m.suffix} />
                  ) : "0"}
                </div>
                <div className="text-white/40 text-sm font-medium tracking-widest uppercase">{m.label}</div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Counter = ({ value, suffix }: { value: number, suffix: string }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value]);

  return <span>{count % 1 === 0 ? count : count.toFixed(1)}{suffix}</span>;
};

const Testimonials = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO",
      company: "GrowthLabs",
      content: "Autoscale.works transformed our sales process. We went from manual follow-ups to a fully automated AI pipeline that qualifies leads while we sleep.",
      avatar: "https://picsum.photos/seed/sarah/100/100"
    },
    {
      name: "Marcus Thorne",
      role: "Operations Director",
      company: "SwiftLogistics",
      content: "The CRM implementation was flawless. We finally have a single source of truth and our team efficiency has increased by 60%.",
      avatar: "https://picsum.photos/seed/marcus/100/100"
    },
    {
      name: "Elena Rodriguez",
      role: "Founder",
      company: "VibeSocial",
      content: "The AI customer support agent handles 80% of our tickets now. Our response time dropped from 4 hours to 4 seconds.",
      avatar: "https://picsum.photos/seed/elena/100/100"
    }
  ];

  return (
    <section id="testimonials" className="py-32 px-6 bg-[#050505]" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold font-display mb-6">What our <span className="text-gradient">partners</span> say</h2>
          <p className="text-white/50 max-w-xl mx-auto">Real results from businesses that decided to stop doing manual work.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-3xl glass-dark relative"
            >
              <div className="flex items-center gap-1 text-yellow-500 mb-6">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-lg text-white/80 italic mb-8 leading-relaxed">"{t.content}"</p>
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border border-white/10" referrerPolicy="no-referrer" loading="lazy" />
                <div>
                  <div className="font-bold">{t.name}</div>
                  <div className="text-xs text-white/40">{t.role}, {t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BookingSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="booking" className="py-32 px-6 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/5 to-brand-purple/5" />
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          className="glass rounded-[40px] p-8 md:p-12 text-center border-white/20 shadow-[0_0_100px_rgba(59,130,246,0.1)]"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold mb-8">
            READY TO SCALE?
          </div>
          <h2 className="text-4xl md:text-6xl font-bold font-display mb-8">Let's <span className="text-gradient">get in touch</span></h2>
          <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Select a time below to speak with our experts. We'll analyze your business and provide a custom automation roadmap.
          </p>
          
          <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40">
            <InlineWidget 
              url="https://calendly.com/victor-autoscale/30min"
              styles={{
                height: '700px',
                minWidth: '320px'
              }}
              pageSettings={{
                backgroundColor: '030303',
                hideEventTypeDetails: false,
                hideLandingPageDetails: false,
                primaryColor: 'ec1919',
                textColor: 'ffffff'
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative pt-32 pb-12 px-6 border-t border-white/5 bg-[#030303] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-brand-blue/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-4 mb-8">
              <img 
                src="/logo-icon.svg" 
                alt="AutoScale Logo" 
                className="w-12 h-12"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-bold tracking-tight font-display text-white">AutoScale</span>
                <span className="text-xs font-medium tracking-[0.4em] text-white/50 uppercase">WORKS</span>
              </div>
            </div>
            <p className="text-white/50 max-w-sm mb-10 leading-relaxed text-sm">
              Pioneering the future of business operations through intelligent automation and bespoke AI ecosystems. We don't just build tools; we build competitive advantages.
            </p>
            <div className="flex flex-col gap-6">
              <div className="flex gap-3">
                {[
                  { icon: Twitter, label: 'Twitter' },
                  { icon: Linkedin, label: 'LinkedIn' },
                  { icon: Instagram, label: 'Instagram' }
                ].map((s, i) => (
                  <a 
                    key={i} 
                    href="#" 
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-blue hover:border-brand-blue hover:text-white group transition-all duration-300"
                    aria-label={s.label}
                  >
                    <s.icon className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-xs text-white/40 hover:text-brand-blue transition-colors cursor-pointer group">
                  <Mail className="w-3.5 h-3.5 text-brand-blue group-hover:scale-110 transition-transform" />
                  <span>hello@autoscale.works</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/40">
                  <MapPin className="w-3.5 h-3.5 text-brand-blue" />
                  <span>London • San Francisco • Remote</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Links Columns */}
          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-8">Solutions</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><a href="#services" className="hover:text-white hover:translate-x-1 inline-block transition-all">AI Automation</a></li>
              <li><a href="#services" className="hover:text-white hover:translate-x-1 inline-block transition-all">CRM Systems</a></li>
              <li><a href="#services" className="hover:text-white hover:translate-x-1 inline-block transition-all">Data Analytics</a></li>
              <li><a href="#services" className="hover:text-white hover:translate-x-1 inline-block transition-all">Custom AI Agents</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-8">Resources</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all">Case Studies</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all">AI Insights</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all">Documentation</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all">API Status</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-8">Company</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all">About Us</a></li>
              <li><a href="#how-it-works" className="hover:text-white hover:translate-x-1 inline-block transition-all">Our Process</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all">Careers</a></li>
              <li><a href="#booking" className="hover:text-white hover:translate-x-1 inline-block transition-all">Contact</a></li>
            </ul>
          </div>

          {/* Status Column */}
          <div className="lg:col-span-2 flex flex-col items-start lg:items-end">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-8">System Status</h4>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold mb-8">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              SYSTEMS OPERATIONAL
            </div>
            <button 
              onClick={scrollToTop}
              className="mt-auto p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all group"
            >
              <ArrowRight className="w-5 h-5 -rotate-90 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-bold">
            © 2026 AUTOSCALE.WORKS SOLUTIONS. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-bold hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-bold hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-bold hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative selection:bg-brand-blue/30 selection:text-white lg:cursor-none">
      <CustomCursor />
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-cyan z-[60] origin-left"
        style={{ scaleX }}
      />

      <Navbar />
      
      <main>
        <Hero />
        <ResultsPreviewSection />
        <LogoMarquee />
        <ImplementationServices />
        <ProblemSection />
        <ServicesSection />
        <HowItWorks />
        <MetricsSection />
        <Testimonials />
        <BookingSection />
      </main>

      <Footer />

      {/* Background Noise/Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
