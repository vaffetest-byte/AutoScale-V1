import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
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
  Phone,
  Activity,
  Cpu,
  Layers,
  ShieldCheck,
  Search,
  LayoutGrid
} from 'lucide-react';
import { cn } from './lib/utils';
import { useInView } from 'react-intersection-observer';
import { InlineWidget } from 'react-calendly';

// --- Components ---

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const springConfig = { damping: 25, stiffness: 150 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

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

    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseOut);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseOut);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (typeof window === 'undefined') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden lg:block">
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-brand-blue/50"
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
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    if (isHome && target.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMobileMenuOpen(false);
      }
    } else if (!isHome && target.startsWith('#')) {
      e.preventDefault();
      navigate('/' + target);
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Systems', href: '#services' },
    { name: 'Consulting', href: '/services/zoho-crm-consultant', isExternal: true },
    { name: 'Process', href: '#how-it-works' },
    { name: 'Blog', href: '/blog/automate-lead-follow-ups-zoho-crm', isExternal: true },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-3 md:py-4",
      (isScrolled || isMobileMenuOpen) ? "bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm" : "bg-transparent"
    )} contentEditable={false}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 md:gap-3">
          <img 
            src="/logo-icon.svg" 
            alt="AutoScale Logo" 
            className="w-8 h-8 md:w-10 md:h-10"
            referrerPolicy="no-referrer"
            fetchPriority="high"
          />
          <div className="flex flex-col leading-none">
            <span className="text-lg md:text-xl font-bold tracking-tight font-display text-slate-900">AutoScale</span>
            <span className="text-[9px] md:text-[10px] font-medium tracking-[0.3em] text-slate-400 uppercase">WORKS</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            link.isExternal ? (
              <Link 
                key={link.name} 
                to={link.href} 
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ) : (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {link.name}
              </a>
            )
          ))}
          <a 
            href="#booking"
            onClick={(e) => handleNavClick(e, '#booking')}
            className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-brand-blue transition-all duration-300 shadow-sm"
          >
            Get in Touch
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-slate-900"
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
            className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 p-6 flex flex-col gap-4 md:hidden shadow-lg"
          >
            {navLinks.map((link) => (
              link.isExternal ? (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className="text-lg font-bold text-slate-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ) : (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-lg font-bold text-slate-900"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.name}
                </a>
              )
            ))}
            <a 
              href="#booking"
              onClick={(e) => handleNavClick(e, '#booking')}
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl mt-2 text-center"
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

const StaggeredText = ({ text, className, as: Component = "div" }: { text: string, className?: string, as?: any }) => {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <Component className={cn("flex flex-wrap gap-x-[0.3em]", className)}>
      {words.map((word, i) => {
        const isHighlighted = word.startsWith('*') && word.endsWith('*');
        const cleanWord = isHighlighted ? word.slice(1, -1) : word;
        
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={cn(
              "inline-block", 
              isHighlighted && "font-serif italic text-brand-blue"
            )}
          >
            {cleanWord}
          </motion.span>
        );
      })}
    </Component>
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
        setStatus('idle');
      }
    } catch (err) {
      console.error('Network error:', err);
      setStatus('idle');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="relative p-1 rounded-3xl bg-gradient-to-br from-slate-200/50 via-slate-100/30 to-white border border-slate-200/50 shadow-2xl overflow-hidden group"
    >
      <div className="absolute inset-0 bg-brand-blue/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 bg-white/90 backdrop-blur-xl rounded-[22px] p-8">
        <h3 className="text-2xl font-black mb-2 flex items-center gap-3 text-slate-900 leading-tight">
          Let’s build your <br />
          <span className="text-brand-blue">Efficiency Engine.</span>
        </h3>
        <p className="text-sm text-slate-500 mb-8 font-medium">Get a custom automation roadmap in <span className="text-slate-900">24 hours.</span></p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <input 
                type="text" 
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-slate-900 placeholder:text-slate-300 shadow-inner"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <input 
                type="email" 
                required
                placeholder="john@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-slate-900 placeholder:text-slate-300 shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
              <input 
                type="tel" 
                required
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-slate-900 placeholder:text-slate-300 shadow-inner"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Company Website</label>
              <input 
                type="url" 
                placeholder="https://yourbusiness.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-slate-900 placeholder:text-slate-300 shadow-inner"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Requirements</label>
            <textarea 
              required
              placeholder="Tell us about your business and what you'd like to automate..."
              value={formData.requirement}
              onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
              rows={3}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all resize-none text-slate-900 placeholder:text-slate-300 shadow-inner"
            />
          </div>

          <button 
            type="submit"
            disabled={status !== 'idle'}
            className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-brand-blue hover:shadow-[0_20px_40px_-10px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {status === 'idle' && (
              <>
                Generate My Roadmap
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
            {status === 'submitting' && (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {status === 'success' && (
              <>
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                Audit Successfully Sent
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 flex items-center justify-center gap-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
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
    document.title = "AutoScale Works | Expert Zoho CRM Consultant & Business Automation";
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
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-24 overflow-hidden px-6 bg-white">
      {/* Structural Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {/* Dynamic Background Glow */}
      <div 
        className="absolute inset-0 z-0 bg-glow transition-all duration-300 pointer-events-none"
        style={{ '--x': `${mousePos.x}%`, '--y': `${mousePos.y}%` } as any}
      />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
        <div className="text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-brand-blue text-[10px] font-bold mb-6 tracking-widest shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
            </span>
            NEXT-GEN AUTOMATION FOR MODERN TEAMS
          </motion.div>
          
          <StaggeredText 
            as="h1"
            text="Automated Systems. *Predictable* Growth." 
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold font-display leading-[1.1] md:leading-[1.05] mb-8 text-slate-900 tracking-[-0.04em]"
          />
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-6 mb-12 border-l-2 border-brand-blue/30 pl-6"
          >
            <p className="text-xl md:text-2xl text-slate-900 font-semibold leading-snug max-w-xl">
              We architect the digital infrastructure that turns manual friction into a scaling force.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              From bespoke Zoho CRM ecosystems to AI-driven workflow optimization, we build the systems that help modern teams scale without the overhead of additional headcount.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a 
              href="#booking"
              className="px-10 py-5 bg-slate-900 text-white font-bold rounded-full hover:bg-brand-blue hover:shadow-[0_20px_40px_-10px_rgba(59,130,246,0.5)] transition-all flex items-center justify-center gap-2 group shadow-xl"
            >
              Start Your Audit
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#how-it-works"
              className="px-8 py-4 bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-full hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              See How It Works
            </a>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="relative lg:mt-0 mt-12"
        >
          <HeroForm />
        </motion.div>
      </div>
    </section>
  );
};

const ImplementationServices = () => {
  const services = [
    {
      title: "Data Cleaning",
      desc: "Turn messy datasets into clear insights. We audit, scrub, and deduplicate your lead data to ensure every decision is based on absolute accuracy.",
      icon: <Database className="w-6 h-6" />,
      tags: ["Lead Hygiene", "Data Integrity", "Deduplication"],
      color: "from-blue-500/10 to-blue-500/20",
      iconColor: "text-blue-500",
      cta: "Learn More",
      href: "#booking"
    },
    {
      title: "CRM Customization",
      desc: "Tailored pipelines and field logic built around your specific sales process, ensuring your team spends more time closing and less time clicking.",
      icon: <LayoutGrid className="w-6 h-6" />,
      tags: ["Custom Pipelines", "User Adoption", "Field Logic"],
      color: "from-brand-blue/10 to-brand-blue/20",
      iconColor: "text-brand-blue",
      cta: "Get Started",
      href: "#booking"
    },
    {
      title: "Workflow Automation",
      desc: "Eliminate repetitive administrative work. We connect your tools and automate lead follow-ups so no potential customer ever smells a delay.",
      icon: <Zap className="w-6 h-6" />,
      tags: ["App Syncing", "Lead Capture", "Auto Follow-ups"],
      color: "from-brand-cyan/10 to-brand-cyan/20",
      iconColor: "text-brand-cyan",
      cta: "Get Started",
      href: "#booking"
    },
    {
      title: "Custom Solutions",
      desc: "Unique business logic requires unique tech. We develop flexible solutions based on your specific requirements to fuel your next growth phase.",
      icon: <Rocket className="w-6 h-6" />,
      tags: ["Bespoke Builds", "Scalable Tech", "Strategic ROI"],
      color: "from-brand-purple/10 to-brand-purple/20",
      iconColor: "text-brand-purple",
      cta: "Get Started",
      href: "#booking"
    }
  ];

  return (
    <section className="py-32 bg-white relative overflow-hidden px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-slate-500 uppercase">Core Offerings</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-semibold font-display mb-8 text-slate-900 tracking-[-0.04em]"
          >
            Scale with <span className="font-serif italic text-brand-blue">Strategic</span> Systems.
          </motion.h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            We don't just implement tools; we build the digital infrastructure that empowers your team and automates your success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_4px_25px_-5px_theme(colors.slate.200)] hover:shadow-[0_20px_50px_-15px_theme(colors.slate.300)] hover:border-brand-blue/30 transition-all duration-500 relative flex flex-col h-full"
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 bg-gradient-to-br",
                s.color,
                s.iconColor
              )}>
                {s.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 group-hover:text-brand-blue transition-colors leading-tight">{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                {s.desc}
              </p>
              
              <div className="space-y-4 pt-6 border-t border-slate-50">
                <div className="flex flex-wrap gap-2">
                  {s.tags.map((tag, j) => (
                    <span key={j} className="text-[9px] font-bold tracking-widest text-slate-400 uppercase px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 group-hover:bg-brand-blue/5 group-hover:text-brand-blue/70 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>

                <a 
                  href={s.href}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-blue group-hover:gap-4 transition-all"
                >
                  {s.cta}
                  <ArrowRight className="w-4 h-4" />
                </a>
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
            {[...row1, ...row1, ...row1, ...row1].map((logo, i) => (
              <div 
                key={i} 
                className="flex items-center gap-4 group/logo cursor-pointer"
              >
                <div className="relative w-8 h-8">
                  <img 
                    src={`https://cdn.simpleicons.org/${logo.slug}/64748b`} 
                    alt={logo.name} 
                    className="absolute inset-0 w-full h-full opacity-40 group-hover/logo:opacity-0 transition-opacity duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <img 
                    src={`https://cdn.simpleicons.org/${logo.slug}/${logo.color.replace('#', '')}`} 
                    alt={logo.name} 
                    className="absolute inset-0 w-full h-full opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500"
                    referrerPolicy="no-referrer"
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
            {[...row2, ...row2, ...row2, ...row2].map((logo, i) => (
              <div 
                key={i} 
                className="flex items-center gap-4 group/logo cursor-pointer"
              >
                <div className="relative w-8 h-8">
                  <img 
                    src={`https://cdn.simpleicons.org/${logo.slug}/64748b`} 
                    alt={logo.name} 
                    className="absolute inset-0 w-full h-full opacity-40 group-hover/logo:opacity-0 transition-opacity duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <img 
                    src={`https://cdn.simpleicons.org/${logo.slug}/${logo.color.replace('#', '')}`} 
                    alt={logo.name} 
                    className="absolute inset-0 w-full h-full opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500"
                    referrerPolicy="no-referrer"
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

const ProblemSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const problems = [
    { icon: <Users className="w-5 h-5" />, title: "Lead Leakage", desc: "60% of leads go cold because of slow manual follow-ups." },
    { icon: <Clock className="w-5 h-5" />, title: "Operational Drag", desc: "Repetitive tasks eat 40% of your team's productive hours." },
    { icon: <Database className="w-5 h-5" />, title: "Siloed Intelligence", desc: "Data scattered across tools creates a blind spot for growth." },
    { icon: <Rocket className="w-5 h-5" />, title: "Scale Ceiling", desc: "You can't grow because your processes break under pressure." },
  ];

  return (
    <section className="py-32 px-6 relative overflow-hidden bg-slate-900" ref={ref}>
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(239,68,68,0.1),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.05),transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold mb-6 tracking-widest"
            >
              <X className="w-3 h-3" />
              THE COST OF INACTION
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              className="text-4xl md:text-6xl font-semibold font-display mb-8 text-white leading-[1.1] tracking-[-0.04em]"
            >
              Is your business <br />
              <span className="text-red-500 font-serif italic">*leaking* revenue?</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-white/50 text-xl max-w-xl mb-12 leading-relaxed"
            >
              Most small businesses reach a plateau not because of their product, but because their internal engine is built on manual labor instead of automated logic.
            </motion.p>

            <div className="space-y-4">
               <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between group cursor-help">
                  <span className="text-sm font-medium text-white/70">Manual Data Entry Errors</span>
                  <span className="text-red-500 font-bold tracking-tighter">— High Risk</span>
               </div>
               <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between group cursor-help">
                  <span className="text-sm font-medium text-white/70">Follow-up Delay (&gt; 24h)</span>
                  <span className="text-red-500 font-bold tracking-tighter">— 80% Dropoff</span>
               </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {problems.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 hover:border-red-500/30 transition-all group backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
                  {p.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3 text-white tracking-tight">{p.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const steps = [
    { number: "01", title: "Understand Your Business", desc: "Identify gaps in your sales, CRM, and operations." },
    { number: "02", title: "Build Your CRM System", desc: "Implement Zoho CRM, automations, and integrations." },
    { number: "03", title: "Grow with Automation", desc: "Scale your revenue and reclaim your time with a high-performance digital engine." },
  ];

  return (
    <section id="how-it-works" className="py-32 px-6 bg-white relative" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-semibold font-display mb-6 text-slate-900 tracking-[-0.04em]"
          >
            The Path to <span className="font-serif italic text-brand-blue">Efficiency</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-500 max-w-xl mx-auto"
          >
            A proven 3-step process to transform your manual operations into a high-performance engine.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-200 hidden lg:block -translate-y-1/2" />
          
          <div className="grid lg:grid-cols-3 gap-12 relative z-10">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-full bg-white border border-slate-200 flex items-center justify-center text-3xl font-bold font-display text-brand-blue mb-8 relative group shadow-sm">
                  <div className="absolute inset-0 rounded-full bg-brand-blue/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  {s.number}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">{s.title}</h3>
                <p className="text-slate-500 leading-relaxed">{s.desc}</p>
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
    <section id="results" className="py-32 px-6 relative overflow-hidden bg-slate-50" ref={ref}>
      <div className="absolute inset-0 bg-glow opacity-30" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold font-display text-slate-900 tracking-[-0.04em]">The AutoScale Impact</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((m, i) => (
            <div key={i} className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-brand-blue mb-4 flex justify-center opacity-60">
                  <div className="w-8 h-8">
                    {m.icon}
                  </div>
                </div>
                <div className="text-5xl md:text-6xl font-semibold font-display mb-2 text-slate-900 tracking-[-0.04em]">
                  {inView ? (
                    <Counter value={parseFloat(m.value)} suffix={m.suffix} />
                  ) : "0"}
                </div>
                <div className="text-slate-500 text-sm font-medium tracking-widest uppercase">{m.label}</div>
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

  return <span className="text-slate-900">{count % 1 === 0 ? count : count.toFixed(1)}{suffix}</span>;
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
    <section id="testimonials" className="py-32 px-6 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-semibold font-display mb-6 text-slate-900 tracking-[-0.04em]">What our <span className="font-serif italic text-brand-blue">partners</span> say</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Real results from businesses that decided to stop doing manual work.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-3xl glass relative shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-1 text-yellow-500 mb-6">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-lg text-slate-700 italic mb-8 leading-relaxed">"{t.content}"</p>
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border border-slate-200" referrerPolicy="no-referrer" loading="lazy" />
                <div>
                  <div className="font-bold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}, {t.company}</div>
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
            
            <div className="w-full overflow-hidden rounded-2xl bg-white relative">
              {/* Overlay to mask iframe top edges if needed for a "native" feel */}
              <div className="absolute top-0 inset-x-0 h-4 bg-white z-10 pointer-events-none" />
              
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
            </div>
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
    <footer className="relative pt-32 pb-12 px-6 border-t border-slate-200 bg-white overflow-hidden">
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
                <span className="text-2xl font-bold tracking-tight font-display text-slate-900">AutoScale</span>
                <span className="text-xs font-medium tracking-[0.4em] text-slate-400 uppercase">WORKS</span>
              </div>
            </div>
            <p className="text-slate-500 max-w-sm mb-10 leading-relaxed text-sm">
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
                    className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-brand-blue hover:border-brand-blue hover:text-white group transition-all duration-300 shadow-sm"
                    aria-label={s.label}
                  >
                    <s.icon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-xs text-slate-400 hover:text-brand-blue transition-colors cursor-pointer group">
                  <Mail className="w-3.5 h-3.5 text-brand-blue group-hover:scale-110 transition-transform" />
                  <span>Victor@autoscale.works</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-brand-blue" />
                  <span>London • San Francisco • Remote</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Links Columns */}
          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">Solutions</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link to="/services/zoho-crm-consultant" className="hover:text-slate-900 hover:translate-x-1 inline-block transition-all font-medium">Zoho Consultant</Link></li>
              <li><a href="/#services" className="hover:text-slate-900 hover:translate-x-1 inline-block transition-all font-medium">CRM Systems</a></li>
              <li><a href="/#services" className="hover:text-slate-900 hover:translate-x-1 inline-block transition-all font-medium">Data Analytics</a></li>
              <li><a href="/#services" className="hover:text-slate-900 hover:translate-x-1 inline-block transition-all font-medium">Custom AI Agents</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">Resources</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link to="/blog/automate-lead-follow-ups-zoho-crm" className="hover:text-slate-900 hover:translate-x-1 inline-block transition-all font-medium">Automation Guide</Link></li>
              <li><a href="/#services" className="hover:text-slate-900 hover:translate-x-1 inline-block transition-all font-medium">AI Insights</a></li>
              <li><a href="/#services" className="hover:text-slate-900 hover:translate-x-1 inline-block transition-all font-medium">Documentation</a></li>
              <li><a href="/#services" className="hover:text-slate-900 hover:translate-x-1 inline-block transition-all font-medium">API Status</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-8">Company</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><a href="/" className="hover:text-white hover:translate-x-1 inline-block transition-all">About Us</a></li>
              <li><a href="/#how-it-works" className="hover:text-white hover:translate-x-1 inline-block transition-all">Our Process</a></li>
              <li><a href="/#testimonials" className="hover:text-white hover:translate-x-1 inline-block transition-all">Success Stories</a></li>
              <li><a href="/#booking" className="hover:text-white hover:translate-x-1 inline-block transition-all">Contact</a></li>
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

const ServicePage = () => {
  useEffect(() => {
    document.title = "Zoho CRM Consultant for Small Business | AutoScale Works";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Stop the data chaos. Hire an expert Zoho CRM consultant for small business growth. Automate workflows, sync data, and scale your revenue today.");
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-slate prose-blue max-w-none"
        >
          <h1 className="text-4xl md:text-6xl font-semibold font-display mb-8 text-slate-900 tracking-[-0.04em]">Expert Zoho CRM Consultant for <span className="font-serif italic text-brand-blue">Small Business Growth</span></h1>
          
          <p className="text-xl text-slate-700 leading-relaxed mb-6">
            Is your CRM working for you, or are you working for your CRM? For many growing companies, Zoho CRM starts as a promise of organization but quickly turns into a source of "data chaos." If your team is still manually entering leads, struggling to find customer history, or missing follow-ups because of a messy setup, you don't have a software problem—you have a process problem. At AutoScale Works, we specialize in bridging the gap between powerful software and efficient business operations.
          </p>

          <p className="text-lg text-slate-500 leading-relaxed mb-12">
            Most small businesses reach a breaking point between 5 and 50 employees. The spreadsheets that served you well in the early days become liabilities. The "memory-based" follow-up system starts to fail, and revenue begins to leak through the cracks of a disorganized pipeline. Our mission is to plug those leaks and build a digital engine that powers your next phase of growth without adding to your administrative burden.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-slate-900">Why Zoho CRM for Your Small Business?</h2>
          <p>
            Zoho CRM is one of the most powerful and flexible platforms on the market, but that flexibility is a double-edged sword. Without a professional architect, it’s easy to build a system that is too complex for your team to use or too rigid to adapt to your changing needs. As your Zoho CRM consultant, we focus on three pillars: <strong>scalability, usability, and automation.</strong>
          </p>
          <p>
            We don't just "install" Zoho; we architect a solution that mirrors your unique sales process. Whether you're in professional services, manufacturing, or tech, your Zoho environment should feel like a custom-built tool designed specifically for your team's workflow.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-slate-900">The Benefits of Professional Optimization</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12 not-prose">
            {[
              { title: "Single Source of Truth", desc: "No more hunting through emails or scattered docs. Centralize every interaction for a 360-degree view of your customer journey." },
              { title: "Automated Sales Pipelines", desc: "Let the software handle the heavy lifting with automated lead scoring, task assignments, and follow-up triggers." },
              { title: "Seamless App Integration", desc: "Eliminate double data entry. We connect Zoho with QuickBooks, Slack, Mailchimp, and your custom internal tools." },
              { title: "Actionable Intelligence", desc: "Stop guessing. Custom dashboards provide real-time visibility into your sales velocity, conversion rates, and team performance." }
            ].map((b, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-blue/30 transition-colors shadow-sm">
                <h3 className="text-lg font-bold mb-2 text-brand-blue">{b.title}</h3>
                <p className="text-sm text-slate-600 font-sans">{b.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-slate-900">Our 4-Step "Scale-Ready" Process</h2>
          <div className="space-y-12 my-12 not-prose">
            {[
              { 
                step: "01", 
                title: "The Deep-Dive Audit", 
                desc: "We don't start with code; we start with conversations. We spend time understanding your sales cycle, your team's pain points, and your long-term goals. This audit identifies immediate 'low-hanging fruit' for automation and uncovers the structural flaws causing your current data chaos." 
              },
              { 
                step: "02", 
                title: "Custom Architecture & Build", 
                desc: "Using the insights from our audit, we design a custom Zoho environment. This includes configuring modules, setting up Blueprint sales processes, and creating custom fields that actually matter. We focus on a 'clean' UI so your sales reps spend less time clicking and more time selling." 
              },
              { 
                step: "03", 
                title: "Integration & Data Migration", 
                desc: "Data is the lifeblood of your business. We handle the technical heavy lifting of migrating your legacy data into Zoho and setting up two-way syncs with your accounting, marketing, and communication tools. We ensure your data flow is unified and error-free." 
              },
              { 
                step: "04", 
                title: "Team Onboarding & Ongoing Support", 
                desc: "The best system in the world is useless if your team won't use it. We provide recorded training sessions tailored to your specific setup and documentation for your 'Standard Operating Procedures'. We also offer ongoing optimization as your business evolves." 
              }
            ].map((s, i) => (
              <div key={i} className="flex gap-8 group">
                <span className="text-5xl font-bold text-slate-100 font-display group-hover:text-brand-blue/10 transition-colors shrink-0">{s.step}</span>
                <div className="pt-2">
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{s.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-sans">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-slate-900">The ROI of Zoho Automation</h2>
          <p>
            When you automate your CRM, you aren't just saving time—you're increasing your capacity to generate revenue. Our clients typically see a 20-30% increase in lead conversion rates simply because no lead is ever 'forgotten.' Moreover, by automating administrative tasks, your sales team can handle a higher volume of prospects without needing to hire additional staff. 
          </p>
          <p>
            Think about the cost of a missed follow-up on a $5,000 contract. Now multiply that by the number of times it happens in a year. The investment in professional Zoho consulting pays for itself many times over by ensuring every opportunity is nurtured to its full potential.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-6 my-12 not-prose">
            {[
              { q: "Why hire a Zoho consultant instead of doing it myself?", a: "While Zoho is user-friendly, setting up complex automations and integrations requires technical expertise. A consultant avoids common pitfalls, prevents 'data debt', and ensures your system is built for long-term scalability." },
              { q: "How long does a typical implementation take?", a: "Depending on complexity, a standard optimization project takes between 4 to 8 weeks. This includes audit, build, migration, and training." },
              { q: "Can you integrate with my existing QuickBooks or Xero?", a: "Absolutely. One of our specialties is creating a seamless link between your sales and accounting teams to ensure accuracy and speed up invoicing." },
              { q: "Is Zoho too complex for a team of 5?", a: "It's all about how it's configured. We can strip back the interface to show only what your team needs, making it easier to use than a basic spreadsheet while providing much better data." },
              { q: "What kind of ongoing support do you provide?", a: "We offer various support tiers, from ad-hoc troubleshooting to monthly optimization retainers where we continuously refine your automations as you grow." }
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-purple/30 transition-colors">
                <h4 className="font-bold mb-2 text-slate-900 font-display">Q: {f.q}</h4>
                <p className="text-slate-500 text-sm font-sans leading-relaxed">A: {f.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-24 p-12 rounded-[40px] bg-gradient-to-br from-brand-blue/5 to-brand-purple/5 border border-slate-200/50 text-center not-prose overflow-hidden relative shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 blur-3xl -mr-32 -mt-32" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-semibold mb-6 font-display text-slate-900 tracking-[-0.04em]">Ready to Stop the Data Chaos?</h2>
              <p className="text-slate-500 mb-10 max-w-xl mx-auto">
                Join dozens of small businesses that have scaled their revenue by automating their workflows. Your free audit is just a click away.
              </p>
              <a href="/#booking" className="inline-block px-10 py-5 bg-brand-blue text-white font-bold rounded-full hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all transform hover:scale-105">
                Book a Free Automation Audit
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const BlogPage = () => {
  useEffect(() => {
    document.title = "How to Automate Lead Follow-Ups in Zoho CRM | AutoScale Works";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Learn how to automate lead follow-ups in Zoho CRM with our step-by-step guide. Stop losing leads and start scaling your small business today.");
    window.scrollTo(0, 0);
  }, []);

  const markdown = `
# How to Automate Lead Follow-Ups in Zoho CRM (Step-by-Step Guide)

You just spent $500 on a Google Ads campaign. A high-quality lead lands in your inbox at 2:00 PM on a Tuesday. You’re in a meeting. By the time you see the notification at 4:30 PM, you’re exhausted and decide to "handle it first thing tomorrow." 

Tomorrow comes. A fire breaks out in operations. You finally send that follow-up email at 11:00 AM on Wednesday. 

The result? Silence. Your prospect has already booked a call with a competitor who replied within five minutes. 

This is the reality of "lead leakage." In a world where the first responder wins the business 78% of the time, manual follow-ups are no longer a viable strategy for growth. If you want to scale, you must **automate lead follow-ups in Zoho CRM**.

## The Hidden Costs of Manual Lead Management

Many small business owners pride themselves on their "personal touch." They believe that manually typing every email shows they care. However, what feels like personal service is actually a bottleneck. When you're busy, the follow-up delays. When you're tired, the nuance is lost. When you're out of the office, the connection dies.

The cost of manual lead management isn't just the time spent—it's the lost opportunity value. For every lead that falls through the cracks, you aren't just losing a sale; you're increasing your customer acquisition cost (CAC) and letting your marketing budget go to waste. Automation ensures that your "personal touch" happens consistently, 24/7, without you ever having to lift a finger.

## Why Manual Follow-Ups Kill Your Sales

If you're still relying on memory or sticky notes to follow up with leads, you're essentially gambling with your commissions. Here’s why manual systems fail:

1.  **The "Speed to Lead" Gap:** Research from the Harvard Business Review shows that companies that try to contact potential customers within an hour of receiving a query are nearly 7 times as likely to have a meaningful conversation with a key decision-maker than those who wait even an extra hour—and more than 60 times as likely as those who waited 24 hours or longer.
2.  **Lack of Persistence:** Most sales are made on the 5th to 12th contact. Yet, 48% of sales people never even make a single follow-up attempt. Automation removes the psychological barrier of "bothering" people and ensures the follow-up happens until they are ready to buy or explicitly opt-out.
3.  **Inconsistency in Branding:** Your mood affects your writing. One day you're professional, the next you're hurried. Automation ensures that every prospect receives your "best" introductory message, carefully crafted to convert, regardless of how your day is going.
4.  **Scaling Friction:** You can't double your business if your processes require linear human effort. If you handle 10 leads a day manually, you can't handle 100 tomorrow. Automation creates a non-linear path to growth.

## What Zoho CRM Automation Can Do

Zoho CRM is more than a digital Rolodex; it is a powerful automation engine. When properly configured, it can handle:

*   **Instant Auto-Responders:** Send a personalized "Next Steps" email the second a form is submitted on your website.
*   **Intelligent Drip Sequences:** Nurture leads with educational content over 30 days based on their expressed interests and industry.
*   **Dynamic Task Assignment:** Automatically assign a lead to the best sales rep based on territory, product interest, or current rep workload.
*   **Slack/SMS Alerts:** Notify your team instantly on their mobile devices when a high-value lead interacts with your site or opens a high-value proposal.
*   **SalesSignals:** Real-time notifications when a prospect interacts with your brand across any channel—email, social media, or your website.

## Step-by-Step: Setting Up Automated Follow-Ups in Zoho

Here is the exact blueprint we use to set up lead automation for our small business clients.

### Step 1: Define Your Trigger
In Zoho CRM, navigate to **Setup > Automation > Workflow Rules**. Click **+ Create Rule**. Select the **Leads** module and choose **"On a Record Action"**. Set this to **"Create"**. This ensures that the moment a lead enters the system—whether via webform, manual entry, or API—the automation engine kicks in.

### Step 2: Set Your Conditions
Don't use a "one size fits all" approach. Set your condition to filter by **Lead Source** (e.g., "Web Form") or **Product Interest**. This allows you to send a different first email to someone interested in "Consulting" than you would to someone interested in "Software Training." Relevance is the key to conversion.

### Step 3: Create Immediate Actions
Under **Instant Actions**, select **Email Notification**. You should have a pre-created template that use "Merge Tags" to pull in the prospect's First Name. The goal of this first email is simple: *Acknowledge the request, provide immediate value (like a link to a guide), and set expectations for when they will hear from a human.*

### Step 4: Set Scheduled Actions (The Nurture Trail)
This is where you build the relationship. Click **Scheduled Actions**. We recommend the following cadence for small businesses:
*   **Day 1:** Educational content related to their interest (a case study or "How-To" guide).
*   **Day 4:** The "Social Proof" email (a video testimonial or a list of logos of companies you've helped).
*   **Day 10:** The "Low Friction" offer (e.g., "Do you have 5 minutes for a quick audit next week?").
*   **Day 20:** The "Helpful Resource" (something non-salesy that solves a minor problem for them).
These emails should feel helpful and consultative, shifting the perception of you from a "vendor" to a "partner."

### Step 5: Implement the Internal Safety Net
Under your Day 1 scheduled action, add a **Task** assigned to the record owner: "Phone Call Follow-Up." Automation handles the email persistence, but for high-ticket B2B sales, a human phone call is still vital. The Task ensures that your sales reps are alerted to take action at the most opportune moment.

## Advanced Strategies: Lead Scoring for Priority

Not all leads are created equal. Giving a 'cold' inquiry the same attention as a 'hot' prospect is a waste of resources. In Zoho, you can set up **Scoring Rules**. 
*   Give a lead **+10 points** if they open your 'Case Study' email.
*   Give a lead **+50 points** if they visit your 'Pricing' page more than twice.
*   Subtract **-20 points** if they haven't interacted with your emails in 14 days.
When a lead reaches a score of 100, trigger an immediate internal notification to your sales team to call them *now*. This ensures your reps spend their limited hours on the prospects most likely to close.

## Common Mistakes to Avoid

1.  **The "Robot" Tone:** If your emails sound like they were written by a machine, people will ignore them. Use plain text templates instead of heavy HTML designs. They look like a real email from a real person and have much higher open rates.
2.  **Ignoring the "Stop" Trigger:** There is nothing more annoying than receiving an automated "Why haven't you replied?" email *after* you've already had a great discovery call. Use "Conditions" in your workflow to stop the process if the Lead Status changes from "New" to "Contacted."
3.  **No Clear Call to Action (CTA):** Every automated email should have ONE clear call to action. Don't ask them to download a PDF, watch a video, AND book a call in one email. Give them one simple, low-friction next step.
4.  **Bad Data Entry:** If you don't use "Validation Rules" in Zoho, you'll end up with emails addressed to "Dear [First Name]". Professionalism starts with clean data.

## When to Hire a Zoho Consultant

While setting up a basic workflow is something most tech-savvy owners can do, building a scalable ecosystem is a different challenge. You should consider looking to **hire a Zoho consultant** when:
*   You need **"Deluge" Scripting** for complex logic, such as updating prices across different modules or syncing data with third-party ERPs.
*   You have **"Duplicate Record"** issues that are confusing your sales team.
*   You're spending more time troubleshooting Zoho glitches than you are selling or running your business.
*   You want to integrate Zoho with advanced AI agents for lead qualification.

## Conclusion: Stop the Leakage

Automation isn't about removing human connection; it’s about making sure that connection happens at the right time with the right information. By automating the repetitive "chase," you free up your team to do what they do best: solve customer problems and close deals.

**Ready to see how much time and revenue you could be saving?** We specialize in helping small businesses with 5-50 employees transition from "manual chaos" to "automated precision." 

[Book a Free 30-Minute Automation Audit at autoscale.works](/#booking)
  `;

  return (
    <div className="pt-32 pb-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-slate prose-blue max-w-none"
        >
          <Markdown>{markdown}</Markdown>
        </motion.div>
        
        <div className="mt-24 p-12 rounded-[40px] bg-slate-50 border border-slate-200 text-center relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-brand-purple/5 blur-3xl" />
          <div className="relative z-10">
            <h3 className="text-2xl md:text-4xl font-semibold mb-6 font-display text-slate-900 tracking-[-0.04em]">Want to implement this for your business?</h3>
            <p className="text-slate-500 mb-8 max-w-lg mx-auto italic">
              "We stopped losing leads overnight. The automated follow-up system AutoScale built for us became our highest-converting sales channel within two months." — Sarah C., CEO
            </p>
            <a href="/#booking" className="inline-block px-10 py-5 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold rounded-full hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all transform hover:scale-105">
              Book a Free Strategy Call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const MainContent = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [location]);

  return (
    <>
      <Hero />
      <ProblemSection />
      <ImplementationServices />
      <LogoMarquee />
      <HowItWorks />
      <BookingSection />
      <MetricsSection />
      <Testimonials />
    </>
  );
};

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <Router>
      <div className="relative selection:bg-brand-blue/20 selection:text-slate-900 lg:cursor-none">
        <CustomCursor />
        {/* Scroll Progress Bar */}
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-cyan z-[60] origin-left"
          style={{ scaleX }}
        />

        <Navbar />
        
        <main>
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/services/zoho-crm-consultant" element={<ServicePage />} />
            <Route path="/blog/automate-lead-follow-ups-zoho-crm" element={<BlogPage />} />
          </Routes>
        </main>

        <Footer />

        {/* Background Noise/Texture */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>
    </Router>
  );
}
