import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Sparkles, ArrowRight, BookOpen, Wrench, Calendar, CornerDownLeft } from 'lucide-react';

interface SearchItem {
  title: string;
  description: string;
  path: string;
  category: "Services" | "Guides & Blog" | "Booking & Contact";
  tags: string[];
}

const SEARCH_INDEX: SearchItem[] = [
  {
    title: "Zoho CRM Implementation",
    description: "Complete setup, custom modules, and workflow architecture tailored for your business.",
    path: "/services/crm-implementation",
    category: "Services",
    tags: ["zoho", "crm", "implementation", "sales", "setup", "leads", "pipeline"]
  },
  {
    title: "Workflow Automation & AI Agents",
    description: "Connect your apps and leverage intelligent bots to automate manual admin tasks.",
    path: "/services/workflow-automation",
    category: "Services",
    tags: ["automation", "ai", "zapier", "make", "workflow", "leads", "chatgpt", "gemini"]
  },
  {
    title: "High-Fidelity CRM Data Migration",
    description: "Migrate safely from Salesforce, HubSpot, or legacy systems without losing records.",
    path: "/services/crm-migration",
    category: "Services",
    tags: ["migration", "data", "salesforce", "hubspot", "import", "leads", "transfer"]
  },
  {
    title: "CRM Data Engineering & Hygiene",
    description: "De-duplicate, format, and enrich dirty lead lists to ensure clean sales pipelines.",
    path: "/services/data-cleaning",
    category: "Services",
    tags: ["data", "cleaning", "hygiene", "deduplicate", "leads", "enrichment", "dirty list"]
  },
  {
    title: "Zoho One Ecosystem Setup",
    description: "Unlock the full power of 45+ integrated commercial business apps in Zoho One.",
    path: "/services/zoho-one",
    category: "Services",
    tags: ["zoho", "zoho one", "ecosystem", "books", "projects", "people", "custom integration"]
  },
  {
    title: "High-Performance Web Engineering",
    description: "Custom Web & MVP engineering optimized for ultra-high speed and conversion optimization.",
    path: "/services/web-development",
    category: "Services",
    tags: ["web", "development", "mvp", "react", "speed", "traffic", "seo", "landing page"]
  },
  {
    title: "Rapid MVP & Product Development",
    description: "Turn your ideas into a high-fidelity functional web app prototype in weeks.",
    path: "/services/mvp-creation",
    category: "Services",
    tags: ["mvp", "product", "development", "startup", "prototype", "build", "software"]
  },
  {
    title: "Advanced Data Intelligence & Dashboards",
    description: "Integrate analytics, data warehouses, and custom interactive real-time BI dashboards.",
    path: "/services/data-intelligence",
    category: "Services",
    tags: ["data", "intelligence", "analytics", "dashboards", "bi", "metrics", "looker", "tableau"]
  },
  {
    title: "Expert Zoho CRM Consulting & Strategy",
    description: "1-on-1 advisory with certified senior consultants to align CRM to business goals.",
    path: "/services/zoho-crm-consultant",
    category: "Services",
    tags: ["zoho", "crm", "consulting", "advisor", "expert", "consultant", "small business"]
  },
  {
    title: "CRM Follow-Up Guide: Automating Zoho CRM Lead Outreach",
    description: "Our blueprint for eliminating manual delays, increasing touchpoints, and boosting close rates.",
    path: "/blog/automate-lead-follow-ups-zoho-crm",
    category: "Guides & Blog",
    tags: ["blog", "guide", "leads", "follow-up", "zoho", "crm", "outreach", "automation"]
  },
  {
    title: "ChatGPT vs Gemini for SEO Automation",
    description: "In-depth breakdown of search-grounded content scaling and keyword clustering workflows.",
    path: "/blog/chatgpt-vs-gemini-for-seo-automation",
    category: "Guides & Blog",
    tags: ["blog", "seo", "chatgpt", "gemini", "automation", "content", "traffic", "search engine"]
  },
  {
    title: "Book a Free 30-Minute Automation Strategy Call",
    description: "Get a custom workflow audit and technical roadmap drafted live by our principal architects.",
    path: "/#booking",
    category: "Booking & Contact",
    tags: ["booking", "consultation", "audit", "call", "free", "schedule", "contact"]
  }
];

export const SearchSuggestions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Handle Ctrl+K / Cmd+K keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when palette opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
      setSelectedIndex(0);
    } else {
      document.body.style.overflow = 'unset';
      setQuery("");
    }
  }, [isOpen]);

  // Filter searches based on query text
  const filteredItems = query.trim() === "" 
    ? SEARCH_INDEX.slice(0, 5) // Show popular/default searches when empty
    : SEARCH_INDEX.filter(item => {
        const searchText = `${item.title} ${item.description} ${item.category} ${item.tags.join(" ")}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      });

  // Handle keyboard navigation through results
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex].path);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (path: string) => {
    setIsOpen(false);
    if (path.startsWith('/#')) {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(path.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      navigate(path);
    }
  };

  const getCategoryIcon = (category: SearchItem["category"]) => {
    switch (category) {
      case "Services":
        return <Wrench className="w-4 h-4 text-brand-blue" />;
      case "Guides & Blog":
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case "Booking & Contact":
        return <Calendar className="w-4 h-4 text-brand-purple" />;
    }
  };

  return (
    <>
      {/* Search Trigger Button in Navbar */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 text-slate-400 hover:text-slate-800 bg-slate-100/60 hover:bg-slate-100 border border-slate-200/60 hover:border-slate-300/80 rounded-full transition-all text-xs md:text-sm font-medium mr-2 group shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
        title="Search our services, guides and audits (Cmd+K)"
        id="nav-search-button"
      >
        <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        <span className="hidden sm:inline text-slate-500">Search guides & services...</span>
        <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded-md shadow-2xs pointer-events-none">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Spotlight Overlay Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 md:pt-32 px-4">
            {/* Backdrop with elegant blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Spotlight Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
              onKeyDown={handleKeyDown}
            >
              {/* Header Input Area */}
              <div className="flex items-center gap-3 px-4 border-b border-slate-100 py-4 bg-white">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="What service, guide, or topic are you looking for?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full text-base text-slate-900 placeholder-slate-400 outline-none border-none bg-transparent focus:ring-0"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Suggestions Panel */}
              <div 
                ref={resultsContainerRef}
                className="max-h-[380px] overflow-y-auto p-2 space-y-1 bg-slate-50/50"
              >
                {/* Search Mode Label */}
                <div className="px-3 py-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <span>{query.trim() === "" ? "Popular Suggestions" : `Search Results (${filteredItems.length})`}</span>
                  {query.trim() === "" && (
                    <span className="flex items-center gap-1 normal-case text-slate-400 font-normal">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Try typing "leads", "zoho crm", or "seo"
                    </span>
                  )}
                </div>

                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <div
                        key={item.title}
                        onClick={() => handleSelect(item.path)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`group flex items-start gap-4 p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                          isSelected 
                            ? "bg-slate-900 text-white shadow-md" 
                            : "hover:bg-slate-100 text-slate-800"
                        }`}
                      >
                        {/* Custom visual indicator icon depending on category */}
                        <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                          isSelected 
                            ? "bg-white/15 text-white" 
                            : "bg-slate-100 text-slate-600 group-hover:bg-white"
                        }`}>
                          {getCategoryIcon(item.category)}
                        </div>

                        {/* Text details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-sm md:text-base tracking-tight block truncate">
                              {item.title}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isSelected 
                                ? "bg-white/10 text-white border border-white/15" 
                                : "bg-slate-200/60 text-slate-500"
                            }`}>
                              {item.category}
                            </span>
                          </div>
                          <p className={`text-xs ${
                            isSelected ? "text-slate-300" : "text-slate-500"
                          } line-clamp-1`}>
                            {item.description}
                          </p>
                        </div>

                        {/* Action suggestion visual helper */}
                        <div className="shrink-0 self-center">
                          {isSelected ? (
                            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-white/10 px-2 py-1 rounded-md border border-white/15">
                              <span>Go</span>
                              <CornerDownLeft className="w-3 h-3" />
                            </div>
                          ) : (
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10 px-4">
                    <p className="text-slate-500 text-sm font-semibold mb-1">
                      No results found for "{query}"
                    </p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Try searching for broader keywords like <strong>"crm"</strong>, <strong>"leads"</strong>, <strong>"data"</strong>, or <strong>"audit"</strong>.
                    </p>
                  </div>
                )}
              </div>

              {/* Elegant footer details with tip / hotkey reminders */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-white border-t border-slate-100 text-[11px] text-slate-400">
                <div className="flex items-center gap-3">
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded">↑↓</kbd> to navigate
                  </span>
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded">Enter</kbd> to select
                  </span>
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded">Esc</kbd> to close
                  </span>
                </div>
                <div className="hidden sm:inline font-mono text-brand-blue">
                  AutoScale Suggestion Engine
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
