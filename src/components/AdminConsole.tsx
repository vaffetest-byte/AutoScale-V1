import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, 
  Users, 
  MousePointerClick, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Globe, 
  RefreshCw, 
  Play, 
  ArrowLeft, 
  Clock, 
  Sliders, 
  Search, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  Eye,
  Settings,
  Shield,
  Trash2,
  Lock
} from "lucide-react";

interface SummaryData {
  totalViews: number;
  totalClicks: number;
  totalChats: number;
  totalBookings: number;
  uniqueSessions: number;
  bounceRate: number;
  avgDuration: string;
  conversionRate: string;
}

interface DailyTrendItem {
  date: string;
  views: number;
  clicks: number;
  chats: number;
  bookings: number;
}

interface PageItem {
  path: string;
  title: string;
  count: number;
}

interface ReferrerItem {
  source: string;
  count: number;
  percentage: number;
}

interface DeviceItem {
  type: string;
  count: number;
  percentage: number;
}

interface LocationItem {
  country: string;
  count: number;
  percentage: number;
}

interface LogItem {
  id: string;
  type: "pageview" | "click" | "chat" | "booking";
  path: string;
  referrer: string;
  country: string;
  city: string;
  browser: string;
  device: "Desktop" | "Mobile" | "Tablet";
  timestamp: string;
  sessionId: string;
  details?: {
    elementId?: string;
    elementText?: string;
    chatMessageCount?: number;
    chatQuery?: string;
    bookingType?: string;
  };
}

export default function AdminConsole() {
  const [activeTab, setActiveTab] = useState<"overview" | "visitors" | "chats" | "settings">("overview");
  const [chartMetric, setChartMetric] = useState<"views" | "clicks" | "chats" | "bookings">("views");
  const [data, setData] = useState<{
    summary: SummaryData;
    dailyTrend: DailyTrendItem[];
    topPages: PageItem[];
    referrers: ReferrerItem[];
    devices: DeviceItem[];
    locations: LocationItem[];
    recentLogs: LogItem[];
  } | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [logFilter, setLogFilter] = useState<string>("all");

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("autoscale_admin_authenticated") === "true";
  });
  const [passcodeInput, setPasscodeInput] = useState<string>("");
  const [isSubmittingAuth, setIsSubmittingAuth] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  
  // Fetch Analytics Data
  const fetchAnalyticsData = async (silent = false) => {
    const storedPasscode = sessionStorage.getItem("autoscale_admin_passcode") || "";
    if (!storedPasscode) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    
    try {
      const res = await fetch("/api/analytics/data", {
        headers: {
          "x-admin-passcode": storedPasscode
        }
      });
      
      if (res.status === 403) {
        // Clear stale auth
        sessionStorage.removeItem("autoscale_admin_authenticated");
        sessionStorage.removeItem("autoscale_admin_passcode");
        setIsAuthenticated(false);
        return;
      }

      if (!res.ok) throw new Error("Failed to load analytics data");
      const result = await res.json();
      setData(result);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Error loading analytics:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalyticsData();
      // Auto-refresh every 15 seconds to simulate real-time live feed
      const interval = setInterval(() => {
        fetchAnalyticsData(true);
      }, 15000);
      return () => clearInterval(interval);
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcodeInput.trim()) return;

    setIsSubmittingAuth(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: passcodeInput.trim() })
      });

      if (res.ok) {
        sessionStorage.setItem("autoscale_admin_authenticated", "true");
        sessionStorage.setItem("autoscale_admin_passcode", passcodeInput.trim());
        setIsAuthenticated(true);
        setPasscodeInput("");
        setTimeout(() => {
          fetchAnalyticsData();
        }, 100);
      } else {
        const errData = await res.json();
        setAuthError(errData.error || "Incorrect admin passcode. Access denied.");
      }
    } catch (err) {
      setAuthError("Failed to connect to authentication server.");
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("autoscale_admin_authenticated");
    sessionStorage.removeItem("autoscale_admin_passcode");
    setIsAuthenticated(false);
    setData(null);
  };

  // Trigger Live Traffic Simulator
  const triggerSimulation = async () => {
    setIsSimulating(true);
    
    const types = ["pageview", "click", "chat", "booking"] as const;
    const selectedType = types[Math.floor(Math.random() * types.length)];
    
    const countries = [
      { country: "United States", city: "Los Angeles", browser: "Chrome", device: "Desktop" as const },
      { country: "Canada", city: "Toronto", browser: "Safari", device: "Mobile" as const },
      { country: "United Kingdom", city: "London", browser: "Safari", device: "Mobile" as const },
      { country: "Germany", city: "Berlin", browser: "Firefox", device: "Desktop" as const },
      { country: "Australia", city: "Sydney", browser: "Edge", device: "Desktop" as const },
      { country: "Singapore", city: "Singapore", browser: "Chrome", device: "Tablet" as const }
    ];
    const userMeta = countries[Math.floor(Math.random() * countries.length)];

    const paths = [
      { path: "/", query: "Homepage visit" },
      { path: "/services/zoho-crm-consultant", query: "Zoho CRM Consultant" },
      { path: "/services/workflow-automation", query: "Workflow Automation" },
      { path: "/services/crm-implementation", query: "CRM Implementation" },
      { path: "/blog/automate-lead-follow-ups-zoho-crm", query: "Automation Blog" },
      { path: "/blog/chatgpt-vs-gemini-for-seo-automation", query: "SEO Automation Blog" }
    ];
    const pathMeta = paths[Math.floor(Math.random() * paths.length)];

    const referrers = ["Google Organic", "LinkedIn Ads", "Direct Traffic", "Twitter / X", "Newsletter (Substack)"];
    const selectedReferrer = referrers[Math.floor(Math.random() * referrers.length)];

    const ctas = [
      { id: "cta-hero", text: "Book a Free Automation Audit" },
      { id: "cta-nav-book", text: "Schedule Strategy Call" },
      { id: "cta-chatbot-book", text: "Book via Chatbot" }
    ];
    const selectedCta = ctas[Math.floor(Math.random() * ctas.length)];

    const queries = [
      "Can Zoho integrate with our invoicing app?",
      "Is the 30-minute audit really free?",
      "How long does CRM implementation take?",
      "What is your standard project fee?",
      "Do you build MVPs on React?"
    ];
    const selectedQuery = queries[Math.floor(Math.random() * queries.length)];

    let details: any = undefined;
    if (selectedType === "click") {
      details = { elementId: selectedCta.id, elementText: selectedCta.text };
    } else if (selectedType === "chat") {
      details = { chatMessageCount: Math.floor(1 + Math.random() * 4), chatQuery: selectedQuery };
    } else if (selectedType === "booking") {
      details = { bookingType: "Free 30-Minute Automation Audit" };
    }

    try {
      // Send mock request to backend to append live event
      const fakeSessionId = `sim_session_${Math.floor(Math.random() * 1000000)}`;
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          path: pathMeta.path,
          referrer: selectedReferrer,
          userAgent: `Mozilla/5.0 (${userMeta.device}; Simulated UserAgent)`,
          screenSize: userMeta.device === "Desktop" ? "1920x1080" : "390x844",
          sessionId: fakeSessionId,
          details
        })
      });

      // Refetch with visual trigger
      await fetchAnalyticsData(true);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsSimulating(false), 800);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Ambient glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-8 rounded-2xl shadow-2xl relative z-10"
        >
          {/* Lock Icon Visual */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-brand-blue/20 rounded-2xl blur-lg animate-pulse" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center relative">
                <Lock className="w-6 h-6 text-brand-blue" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold tracking-tight text-white mb-2">
              Security Gate Required
            </h2>
            <p className="text-slate-400 text-sm max-w-sm">
              Enter your AutoScale systems engineering passcode to unlock the live analytics console.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Engineering Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  className={`w-full bg-slate-950/80 border ${authError ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-800 focus:border-brand-blue focus:ring-brand-blue/20'} rounded-xl py-3 px-4 text-center font-mono text-lg tracking-widest text-white placeholder-slate-700 focus:outline-none focus:ring-4 transition-all`}
                  disabled={isSubmittingAuth}
                  autoFocus
                />
              </div>
              
              {authError && (
                <p className="text-red-400 text-xs mt-2 text-center font-medium">
                  {authError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full bg-brand-blue hover:bg-brand-blue-hover text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmittingAuth ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying Credentials...
                </>
              ) : (
                "Grant Access"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col items-center gap-4 text-center">
            {/* Direct Hint to support fast, smooth self-testing */}
            <div className="bg-slate-950/40 border border-slate-800/50 rounded-lg p-3 w-full">
              <span className="text-[11px] font-mono text-slate-500 block">
                DEVELOPER HINT FOR TESTING
              </span>
              <span className="text-xs font-semibold text-brand-blue font-mono mt-1 block">
                Passcode: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-white font-normal">admin123</code>
              </span>
            </div>

            <Link 
              to="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Homepage
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full border-2 border-brand-blue/20 border-t-brand-blue animate-spin" />
          <Activity className="w-6 h-6 text-brand-blue absolute inset-0 m-auto animate-pulse" />
        </div>
        <p className="text-slate-400 font-medium text-sm tracking-wide animate-pulse">
          Establishing link with AutoScale Telemetry Engine...
        </p>
      </div>
    );
  }

  const { summary, dailyTrend, topPages, referrers, devices, locations, recentLogs } = data;

  // Filter logs
  const filteredLogs = recentLogs.filter((log) => {
    const matchesSearch =
      log.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details?.elementText || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details?.chatQuery || "").toLowerCase().includes(searchQuery.toLowerCase());
      
    if (logFilter === "all") return matchesSearch;
    return log.type === logFilter && matchesSearch;
  });

  // Calculate coordinates for dynamic SVG trendline
  const renderTrendSvg = () => {
    if (!dailyTrend || dailyTrend.length === 0) return null;
    
    const padding = 40;
    const width = 1000;
    const height = 300;
    const usableWidth = width - padding * 2;
    const usableHeight = height - padding * 2;
    
    // Find max value based on selected metric
    const maxVal = Math.max(...dailyTrend.map((d) => {
      if (chartMetric === "views") return d.views;
      if (chartMetric === "clicks") return d.clicks;
      if (chartMetric === "chats") return d.chats;
      return d.bookings;
    })) || 1;

    // Generate path points
    const points = dailyTrend.map((d, index) => {
      const val = chartMetric === "views" ? d.views : chartMetric === "clicks" ? d.clicks : chartMetric === "chats" ? d.chats : d.bookings;
      const x = padding + (index / (dailyTrend.length - 1)) * usableWidth;
      const y = height - padding - (val / maxVal) * usableHeight;
      return { x, y, val, date: d.date };
    });

    const dPath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    
    // Dynamic gradient area path
    const areaPath = `${dPath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    const metricColors = {
      views: { stroke: "#3b82f6", fill: "url(#blueGrad)" },
      clicks: { stroke: "#06b6d4", fill: "url(#cyanGrad)" },
      chats: { stroke: "#8b5cf6", fill: "url(#purpleGrad)" },
      bookings: { stroke: "#10b981", fill: "url(#greenGrad)" }
    };

    return (
      <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.00" />
          </linearGradient>
          <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.00" />
          </linearGradient>
          <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.00" />
          </linearGradient>
          <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding + usableHeight * ratio;
          const gridVal = Math.round(maxVal * (1 - ratio));
          return (
            <g key={i} className="opacity-[0.04]">
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="white" strokeDasharray="4 4" />
              <text x={padding - 10} y={y + 4} fill="white" fontSize="10" textAnchor="end" fontFamily="monospace">
                {gridVal}
              </text>
            </g>
          );
        })}

        {/* Shaded Area */}
        <path d={areaPath} fill={metricColors[chartMetric].fill} />

        {/* Main Line */}
        <path d={dPath} fill="none" stroke={metricColors[chartMetric].stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Grid X Axis Dates */}
        {points.map((p, i) => {
          if (i % 4 !== 0 && i !== points.length - 1) return null;
          return (
            <text
              key={i}
              x={p.x}
              y={height - 12}
              fill="white"
              fontSize="10"
              className="opacity-40 font-mono"
              textAnchor="middle"
            >
              {p.date}
            </text>
          );
        })}

        {/* Interactivity Dots */}
        {points.map((p, i) => (
          <g key={i} className="group cursor-pointer">
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill={metricColors[chartMetric].stroke}
              className="transition-all duration-150 group-hover:r-6"
            />
            {/* Minimal SVG Tooltip trigger on hover */}
            <title>{`${p.date}: ${p.val} ${chartMetric}`}</title>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-brand-blue/20 selection:text-white pt-24 pb-20">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-brand-blue/10 via-brand-purple/5 to-transparent pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Breadcrumb / Top Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          <div>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-3 transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              Back to Live Site
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-blue/15 border border-brand-blue/30 rounded-2xl text-brand-blue">
                <Shield className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                  AutoScale Console
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 rounded-full">
                    Admin
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Real-time telemetry, visitor profiling, conversion metrics, and chatbot diagnostics.
                </p>
              </div>
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            {/* Live simulation button */}
            <button
              onClick={triggerSimulation}
              disabled={isSimulating}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold border transition-all duration-200 active:scale-95 ${
                isSimulating 
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400" 
                  : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Play className={`w-3.5 h-3.5 ${isSimulating ? "animate-ping text-amber-400" : "text-brand-blue"}`} />
              {isSimulating ? "Simulating Visit..." : "Simulate Live Visit"}
            </button>

            {/* Refresh button */}
            <button
              onClick={() => fetchAnalyticsData(true)}
              disabled={isRefreshing}
              className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-2xl text-slate-300 transition-all duration-200 active:scale-90 relative shrink-0"
              title="Force telemetry refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-brand-blue" : ""}`} />
            </button>

            {/* Lock Console button */}
            <button
              onClick={handleLogout}
              className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-2xl text-red-400 transition-all duration-200 active:scale-90 relative shrink-0"
              title="Lock Admin Console"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* --- KPI Grid Section (Bento design) --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          
          {/* Card 1: Page Views */}
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-slate-900/40 backdrop-blur-md border border-slate-900 rounded-3xl p-5 sm:p-6 flex flex-col justify-between h-[150px] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Page Views</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight block">
                {summary.totalViews.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full mt-2 inline-block">
                +14.2% vs last wk
              </span>
            </div>
          </motion.div>

          {/* Card 2: Unique Sessions */}
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-slate-900/40 backdrop-blur-md border border-slate-900 rounded-3xl p-5 sm:p-6 flex flex-col justify-between h-[150px] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Unique Visitors</span>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight block">
                {summary.uniqueSessions.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full mt-2 inline-block">
                +18.7% vs last wk
              </span>
            </div>
          </motion.div>

          {/* Card 3: Chatbot Inquiries */}
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-slate-900/40 backdrop-blur-md border border-slate-900 rounded-3xl p-5 sm:p-6 flex flex-col justify-between h-[150px] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Chatbot Chats</span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight block">
                {summary.totalChats.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full mt-2 inline-block">
                +8.4% chat rate
              </span>
            </div>
          </motion.div>

          {/* Card 4: Meeting Bookings */}
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-slate-900/40 backdrop-blur-md border border-slate-900 rounded-3xl p-5 sm:p-6 flex flex-col justify-between h-[150px] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Calendly Bookings</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight block">
                {summary.totalBookings.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full mt-2 inline-block">
                {summary.conversionRate}% conversion
              </span>
            </div>
          </motion.div>
        </div>

        {/* --- Sub-KPI details row --- */}
        <div className="grid grid-cols-3 gap-4 mb-8 bg-slate-900/20 border border-slate-900/50 rounded-2xl p-4 sm:p-5">
          <div className="text-center border-r border-slate-900">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Avg Session Duration</span>
            <span className="text-sm sm:text-base font-extrabold text-slate-200">{summary.avgDuration}</span>
          </div>
          <div className="text-center border-r border-slate-900">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Bounce Rate</span>
            <span className="text-sm sm:text-base font-extrabold text-slate-200">{summary.bounceRate}%</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Active Now</span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-400 flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              {Math.floor(2 + Math.random() * 5)} visitors
            </span>
          </div>
        </div>

        {/* --- Navigation / Tabs --- */}
        <div className="flex border-b border-slate-900 gap-6 mb-8 overflow-x-auto scrollbar-none">
          {[
            { id: "overview", label: "Overview & Trends", icon: Activity },
            { id: "visitors", label: "Live Visitor Feed", icon: Sliders },
            { id: "chats", label: "Chatbot Logs", icon: MessageSquare }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all shrink-0 active:scale-95 ${
                activeTab === tab.id
                  ? "border-brand-blue text-white"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content 1: Overview & Trends */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            
            {/* Chart Widget */}
            <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                    Historical Traffic Analytics
                    <Sparkles className="w-4 h-4 text-brand-blue" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">30-day view of digital engagements across pages and actions.</p>
                </div>

                {/* Metric Selector Buttons */}
                <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-900 overflow-x-auto">
                  {[
                    { id: "views", label: "Views", color: "text-blue-400" },
                    { id: "clicks", label: "Clicks", color: "text-cyan-400" },
                    { id: "chats", label: "Chats", color: "text-purple-400" },
                    { id: "bookings", label: "Bookings", color: "text-emerald-400" }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setChartMetric(btn.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                        chartMetric === btn.id
                          ? "bg-slate-900 text-white shadow-md border border-slate-800"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Svg Trend Chart Container */}
              <div className="h-[280px] w-full relative">
                {renderTrendSvg()}
              </div>
            </div>

            {/* Grid 2: Breakdown lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Box 1: Popular Visited Pages */}
              <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" /> Page Popularity
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">Views</span>
                </div>
                <div className="space-y-4">
                  {topPages.map((page, idx) => {
                    const maxPageCount = topPages[0]?.count || 1;
                    const pct = Math.round((page.count / maxPageCount) * 100);
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                          <span className="truncate max-w-[200px]" title={page.path}>
                            {page.path}
                          </span>
                          <span className="font-mono text-slate-400">{page.count.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-blue rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Box 2: Top Referrers */}
              <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" /> Acquisition Channels
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">Share</span>
                </div>
                <div className="space-y-4">
                  {referrers.map((ref, idx) => {
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                          <span>{ref.source}</span>
                          <span className="font-mono text-slate-400">{ref.percentage}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-cyan rounded-full" style={{ width: `${ref.percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Box 3: Device & Geolocation Summary */}
              <div className="space-y-6">
                
                {/* Device Breakdown */}
                <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-purple-400" /> Device Type
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {devices.map((dev, idx) => {
                      const icons = { Desktop: Monitor, Mobile: Smartphone, Tablet: Tablet };
                      const Icon = icons[dev.type as "Desktop"|"Mobile"|"Tablet"] || Monitor;
                      return (
                        <div key={idx} className="bg-slate-950 border border-slate-900/50 p-3 rounded-2xl text-center">
                          <Icon className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                          <span className="text-[10px] text-slate-400 block font-semibold">{dev.type}</span>
                          <span className="text-sm font-extrabold text-slate-200 mt-0.5 block font-mono">{dev.percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Geo Summary */}
                <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400" /> Geolocation Share
                  </h4>
                  <div className="space-y-3">
                    {locations.map((loc, idx) => {
                      // Custom styled items
                      return (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-300 flex items-center gap-2">
                            <span className="text-base">
                              {loc.country === "United States" ? "🇺🇸" : 
                               loc.country === "United Kingdom" ? "🇬🇧" :
                               loc.country === "Germany" ? "🇩🇪" :
                               loc.country === "Canada" ? "🇨🇦" :
                               loc.country === "Australia" ? "🇦🇺" : "🇸🇬"}
                            </span>
                            {loc.country}
                          </span>
                          <span className="font-mono text-slate-400 font-bold">{loc.percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* Tab Content 2: Live Visitor Feed */}
        {activeTab === "visitors" && (
          <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Real-Time Visitor Log
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </h3>
                <p className="text-xs text-slate-400 mt-1">Audit log of clickstreams, page acquisitions, and chat states.</p>
              </div>

              {/* Log Filter Buttons */}
              <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-900 overflow-x-auto">
                {[
                  { id: "all", label: "All Logs" },
                  { id: "pageview", label: "Views" },
                  { id: "click", label: "Clicks" },
                  { id: "chat", label: "Chats" },
                  { id: "booking", label: "Bookings" }
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setLogFilter(btn.id)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all shrink-0 ${
                      logFilter === btn.id
                        ? "bg-slate-900 text-white border border-slate-800"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search visitor logs by city, country, path, query text..."
                className="w-full bg-slate-950 border border-slate-900 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
              />
            </div>

            {/* List of logs */}
            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-2">
              <AnimatePresence initial={false}>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => {
                    // Decide emoji/styles
                    const styles = {
                      pageview: { emoji: "👁️", bg: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
                      click: { emoji: "🎯", bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
                      chat: { emoji: "💬", bg: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
                      booking: { emoji: "📅", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" }
                    }[log.type];

                    const logTime = new Date(log.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit"
                    });

                    return (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-950 border border-slate-900 p-4 rounded-2xl flex items-start justify-between gap-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 text-sm ${styles.bg}`}>
                            {styles.emoji}
                          </div>
                          <div>
                            {/* Log Main Title */}
                            <p className="text-xs font-semibold text-slate-200">
                              {log.type === "pageview" && (
                                <>
                                  Visitor from <span className="text-slate-100">{log.city}, {log.country}</span> viewed{" "}
                                  <span className="text-brand-blue font-mono">{log.path}</span>
                                </>
                              )}
                              {log.type === "click" && (
                                <>
                                  Visitor from <span className="text-slate-100">{log.city}, {log.country}</span> clicked{" "}
                                  <span className="text-brand-cyan font-bold">"{log.details?.elementText}"</span>
                                </>
                              )}
                              {log.type === "chat" && (
                                <>
                                  Visitor from <span className="text-slate-100">{log.city}, {log.country}</span> asked Chatbot:{" "}
                                  <span className="text-purple-400 italic">"{log.details?.chatQuery}"</span>
                                </>
                              )}
                              {log.type === "booking" && (
                                <>
                                  Visitor from <span className="text-slate-100">{log.city}, {log.country}</span> triggered{" "}
                                  <span className="text-emerald-400 font-bold">"{log.details?.bookingType}"</span>
                                </>
                              )}
                            </p>

                            {/* Metadata */}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500 mt-2 font-mono">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-600" /> {logTime}
                              </span>
                              <span>•</span>
                              <span>Referrer: {log.referrer || "Direct"}</span>
                              <span>•</span>
                              <span>Device: {log.device} ({log.browser})</span>
                            </div>
                          </div>
                        </div>

                        {/* Status chip */}
                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900 border border-slate-800 px-2 py-1 rounded-full shrink-0">
                          {log.type}
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 bg-slate-950 rounded-2xl border border-slate-900/50">
                    <Sliders className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-400">No logs found matching search / filters</p>
                    <p className="text-xs text-slate-600 mt-1">Try simulating a visit or modifying your query!</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Tab Content 3: Chatbot Logs */}
        {activeTab === "chats" && (
          <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Chatbot Inquiries Stream
                  <MessageSquare className="w-4.5 h-4.5 text-purple-400 animate-pulse" />
                </h3>
                <p className="text-xs text-slate-400 mt-1">Review topics asked by real-time users and observe Calendly triggers.</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full">
                {recentLogs.filter(l => l.type === "chat").length} sessions
              </span>
            </div>

            {/* Chat list */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {recentLogs.filter(l => l.type === "chat").length > 0 ? (
                recentLogs.filter(l => l.type === "chat").map((log, idx) => {
                  const hasConverted = recentLogs.some(
                    (b) => b.type === "booking" && b.sessionId === log.sessionId
                  );
                  return (
                    <div key={idx} className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-900/50">
                        <div className="flex items-center gap-2">
                          <span className="text-base">
                            {log.country === "United States" ? "🇺🇸" : "🇬🇧"}
                          </span>
                          <span className="text-xs font-bold text-slate-200">
                            Visitor from {log.city}, {log.country}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {hasConverted ? (
                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Booked Audit
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                              Consulting
                            </span>
                          )}
                          <span className="text-[9px] font-mono text-slate-500">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>

                      {/* Conversation Bubbles */}
                      <div className="space-y-3 text-xs leading-relaxed">
                        <div className="flex items-start gap-2 max-w-[90%]">
                          <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-[10px] text-slate-400 border border-slate-800 shrink-0">
                            U
                          </div>
                          <div className="bg-slate-900 text-slate-200 px-3.5 py-2.5 rounded-2xl rounded-tl-none border border-slate-900">
                            {log.details?.chatQuery}
                          </div>
                        </div>

                        <div className="flex items-start gap-2 max-w-[90%] justify-start ml-8">
                          <div className="w-6 h-6 rounded-full bg-brand-blue/10 flex items-center justify-center text-[10px] text-brand-blue border border-brand-blue/20 shrink-0">
                            AI
                          </div>
                          <div className="bg-brand-blue/5 text-slate-300 px-3.5 py-2.5 rounded-2xl rounded-tl-none border border-brand-blue/10 italic">
                            "Hello! I am the AutoScale Concierge... {hasConverted ? "I see you clicked to book, showing calendar now!" : "Would you like to schedule our Free 30-Minute Automation Audit?"}"
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 bg-slate-950 rounded-2xl border border-slate-900/50">
                  <MessageSquare className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-400">No chatbot activity recorded yet</p>
                  <p className="text-xs text-slate-600 mt-1">Interactions with the floating chatbot will appear here in real time!</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
