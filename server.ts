import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // --- Real-Time Analytics Database (In-Memory) ---
  interface AnalyticEvent {
    id: string;
    type: "pageview" | "click" | "chat" | "booking";
    path: string;
    referrer: string;
    userAgent: string;
    screenSize: string;
    sessionId: string;
    ip?: string;
    country: string;
    city: string;
    browser: string;
    device: "Desktop" | "Mobile" | "Tablet";
    timestamp: Date;
    details?: {
      elementId?: string;
      elementText?: string;
      chatMessageCount?: number;
      chatQuery?: string;
      bookingType?: string;
    };
  }

  const events: AnalyticEvent[] = [];

  // Helper lists for mock data generation
  const REFERRERS = [
    { name: "Google Organic", url: "https://www.google.com" },
    { name: "LinkedIn Ads", url: "https://lnkd.in" },
    { name: "Direct Traffic", url: "" },
    { name: "Twitter / X", url: "https://t.co" },
    { name: "Newsletter (Substack)", url: "https://substack.com" },
    { name: "YouTube", url: "https://youtube.com" }
  ];

  const COUNTRIES = [
    { code: "US", name: "United States", city: ["San Francisco", "New York", "Chicago", "Austin", "Seattle", "Los Angeles", "Boston", "Denver", "Atlanta", "Dallas", "Miami", "Houston"] },
    { code: "GB", name: "United Kingdom", city: ["London", "Manchester", "Edinburgh", "Bristol"] },
    { code: "DE", name: "Germany", city: ["Berlin", "Munich", "Frankfurt", "Hamburg"] },
    { code: "CA", name: "Canada", city: ["Toronto", "Vancouver", "Montreal", "Calgary"] },
    { code: "AU", name: "Australia", city: ["Sydney", "Melbourne", "Brisbane"] },
    { code: "SG", name: "Singapore", city: ["Singapore"] }
  ];

  const PAGES = [
    { path: "/", title: "Homepage" },
    { path: "/services/zoho-crm-consultant", title: "Zoho CRM Consultant Profile" },
    { path: "/services/crm-implementation", title: "Zoho CRM Implementation" },
    { path: "/services/workflow-automation", title: "Workflow Automation" },
    { path: "/services/crm-migration", title: "High-Fidelity CRM Data Migration" },
    { path: "/services/data-cleaning", title: "Data Engineering & Hygiene" },
    { path: "/services/zoho-one", title: "Zoho One Ecosystem" },
    { path: "/services/training-support", title: "Strategic Training & Support" },
    { path: "/services/web-development", title: "High-Performance Web Engineering" },
    { path: "/services/mvp-creation", title: "Rapid MVP & Product Development" },
    { path: "/services/data-intelligence", title: "Advanced Data Intelligence" },
    { path: "/blog/automate-lead-follow-ups-zoho-crm", title: "Blog: Automating Zoho CRM Lead Follow-Ups" },
    { path: "/blog/chatgpt-vs-gemini-for-seo-automation", title: "Blog: ChatGPT vs Gemini for SEO Automation" }
  ];

  const BROWSERS = ["Chrome", "Safari", "Firefox", "Edge"];
  const DEVICES = ["Desktop", "Mobile", "Tablet"] as const;

  const CTA_CLICKS = [
    { id: "cta-hero", text: "Book a Free Automation Audit" },
    { id: "cta-nav-book", text: "Schedule Strategy Call" },
    { id: "cta-services-web-dev", text: "Learn More - Web Development" },
    { id: "cta-services-zoho-one", text: "Learn More - Zoho One" },
    { id: "cta-faq-contact", text: "Contact Support" },
    { id: "cta-chatbot-book", text: "Book via Chatbot" }
  ];

  // Generate 30 days of high-fidelity mock historical analytics data
  function generateMockAnalytics() {
    const now = new Date();
    const sessionIdMap = new Map<string, string>(); // sessionId to country/city/device map

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      
      // Weekly trend: mid-week (Wed) has higher traffic, weekend (Sat/Sun) has lower
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const dayMultiplier = isWeekend ? 0.45 : (dayOfWeek === 3 ? 1.25 : 1.0);
      
      // Base traffic: 250 visits per day +/- 50, modified by day of week
      const baseVisits = Math.floor((220 + Math.random() * 80) * dayMultiplier);
      
      for (let v = 0; v < baseVisits; v++) {
        // Distribute hours logically (more traffic between 9am - 6pm local)
        const hour = Math.random() < 0.75 
          ? Math.floor(9 + Math.random() * 9) // 9 AM to 6 PM
          : Math.floor(Math.random() * 24); // rest of day
        
        const eventTime = new Date(date);
        eventTime.setHours(hour, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));

        // Create or fetch session context
        const sessionId = `session-${Math.floor(Math.random() * 5000)}-${i}`;
        let sessionContext = sessionIdMap.get(sessionId);
        
        if (!sessionContext) {
          // 90% chance of being from United States
          const countryObj = Math.random() < 0.90 ? COUNTRIES[0] : COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
          const city = countryObj.city[Math.floor(Math.random() * countryObj.city.length)];
          const devRand = Math.random();
          const device = devRand < 0.68 ? "Desktop" : (devRand < 0.95 ? "Mobile" : "Tablet");
          const referrerObj = REFERRERS[Math.floor(Math.random() * REFERRERS.length)];
          const browser = BROWSERS[Math.floor(Math.random() * BROWSERS.length)];
          
          sessionContext = JSON.stringify({
            country: countryObj.name,
            city,
            device,
            referrer: referrerObj.name,
            browser
          });
          sessionIdMap.set(sessionId, sessionContext);
        }

        const context = JSON.parse(sessionContext);

        // Path selection (some pages are more popular)
        const pageRand = Math.random();
        let pathObj = PAGES[0]; // homepage default
        if (pageRand > 0.45 && pageRand <= 0.65) {
          pathObj = PAGES[1]; // Zoho Consultant
        } else if (pageRand > 0.65 && pageRand <= 0.75) {
          pathObj = PAGES[2]; // Implementation
        } else if (pageRand > 0.75 && pageRand <= 0.82) {
          pathObj = PAGES[3]; // Automation
        } else if (pageRand > 0.82 && pageRand <= 0.90) {
          pathObj = PAGES[11]; // Blog
        } else if (pageRand > 0.90) {
          pathObj = PAGES[Math.floor(Math.random() * PAGES.length)];
        }

        // 1. Record Page View Event
        events.push({
          id: `evt-${events.length}-${Date.now()}`,
          type: "pageview",
          path: pathObj.path,
          referrer: context.referrer,
          userAgent: `Mozilla/5.0 (${context.device}; Intel Mac OS X 10_15_7) AppleWebKit/537.36`,
          screenSize: context.device === "Desktop" ? "1920x1080" : "390x844",
          sessionId,
          country: context.country,
          city: context.city,
          browser: context.browser,
          device: context.device,
          timestamp: eventTime
        });

        // 2. Clicks (15% of sessions click a key CTA)
        if (Math.random() < 0.15) {
          const cta = CTA_CLICKS[Math.floor(Math.random() * CTA_CLICKS.length)];
          events.push({
            id: `evt-${events.length}-${Date.now()}`,
            type: "click",
            path: pathObj.path,
            referrer: context.referrer,
            userAgent: "",
            screenSize: "",
            sessionId,
            country: context.country,
            city: context.city,
            browser: context.browser,
            device: context.device,
            timestamp: new Date(eventTime.getTime() + 45000), // clicked after 45s
            details: {
              elementId: cta.id,
              elementText: cta.text
            }
          });
        }

        // 3. Chat sessions (5% of sessions initiate chat)
        if (Math.random() < 0.05) {
          const queries = [
            "What is your pricing?",
            "How can I integrate Zoho CRM with Slack?",
            "Do you offer Salesforce migration?",
            "How long does an audit take?",
            "Can we build a custom React web portal?"
          ];
          const query = queries[Math.floor(Math.random() * queries.length)];
          const chatTime = new Date(eventTime.getTime() + 120000); // starts chat after 2 mins

          events.push({
            id: `evt-${events.length}-${Date.now()}`,
            type: "chat",
            path: pathObj.path,
            referrer: context.referrer,
            userAgent: "",
            screenSize: "",
            sessionId,
            country: context.country,
            city: context.city,
            browser: context.browser,
            device: context.device,
            timestamp: chatTime,
            details: {
              chatMessageCount: Math.floor(2 + Math.random() * 5),
              chatQuery: query
            }
          });

          // 4. Booking conversion (40% of chat users end up booking)
          if (Math.random() < 0.40) {
            events.push({
              id: `evt-${events.length}-${Date.now()}`,
              type: "booking",
              path: pathObj.path,
              referrer: context.referrer,
              userAgent: "",
              screenSize: "",
              sessionId,
              country: context.country,
              city: context.city,
              browser: context.browser,
              device: context.device,
              timestamp: new Date(chatTime.getTime() + 180000), // books after 3 more mins
              details: {
                bookingType: "Free 30-Minute Automation Audit"
              }
            });
          }
        }
      }
    }
  }

  // Run mock generator on boot to populate historical analytics
  generateMockAnalytics();

  // --- Real-Time Background Traffic & Lead Simulator ---
  // Periodically injects high-fidelity real-time visitors, page views, click behaviors,
  // chat inquiries, and booking conversions (leads) to simulate automatic post-launch traffic.
  function startRealTimeSimulation() {
    console.log("Initializing AutoScale real-time traffic and automatic lead simulator...");
    
    // Maintain active sessions to simulate user paths
    const activeSessions: Array<{
      sessionId: string;
      country: string;
      city: string;
      device: "Desktop" | "Mobile" | "Tablet";
      referrer: string;
      browser: string;
      lastPath: string;
      step: number;
    }> = [];

    function createNewSession() {
      // 90% chance of being from United States
      const countryObj = Math.random() < 0.90 ? COUNTRIES[0] : COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
      const city = countryObj.city[Math.floor(Math.random() * countryObj.city.length)];
      const devRand = Math.random();
      const device: "Desktop" | "Mobile" | "Tablet" = devRand < 0.70 ? "Desktop" : (devRand < 0.95 ? "Mobile" : "Tablet");
      const referrerObj = REFERRERS[Math.floor(Math.random() * REFERRERS.length)];
      const browser = BROWSERS[Math.floor(Math.random() * BROWSERS.length)];
      const sessionId = `live-session-${Math.floor(Math.random() * 1000000)}`;

      return {
        sessionId,
        country: countryObj.name,
        city,
        device,
        referrer: referrerObj.name,
        browser,
        lastPath: "/",
        step: 0
      };
    }

    // Tick every 12 seconds to perform simulated user actions
    setInterval(() => {
      try {
        const now = new Date();
        
        // Keep active sessions populated
        if (activeSessions.length < 3 || (activeSessions.length < 8 && Math.random() < 0.4)) {
          activeSessions.push(createNewSession());
        }

        // Keep bounds on active list size
        if (activeSessions.length > 12) {
          activeSessions.shift();
        }

        const sessionIndex = Math.floor(Math.random() * activeSessions.length);
        const session = activeSessions[sessionIndex];
        if (!session) return;

        const actionRand = Math.random();
        
        if (session.step === 0 || actionRand < 0.45) {
          // Page View Event
          const pathObj = PAGES[Math.floor(Math.random() * PAGES.length)];
          session.lastPath = pathObj.path;
          session.step = 1;

          events.push({
            id: `evt-sim-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
            type: "pageview",
            path: pathObj.path,
            referrer: session.referrer,
            userAgent: `Mozilla/5.0 (${session.device}; Intel Mac OS X 10_15_7) AppleWebKit/537.36`,
            screenSize: session.device === "Desktop" ? "1920x1080" : "390x844",
            sessionId: session.sessionId,
            country: session.country,
            city: session.city,
            browser: session.browser,
            device: session.device,
            timestamp: now
          });
        } 
        else if (session.step === 1 && actionRand >= 0.45 && actionRand < 0.70) {
          // CTA Click Event
          const cta = CTA_CLICKS[Math.floor(Math.random() * CTA_CLICKS.length)];
          session.step = 2;

          events.push({
            id: `evt-sim-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
            type: "click",
            path: session.lastPath,
            referrer: session.referrer,
            userAgent: "",
            screenSize: "",
            sessionId: session.sessionId,
            country: session.country,
            city: session.city,
            browser: session.browser,
            device: session.device,
            timestamp: now,
            details: {
              elementId: cta.id,
              elementText: cta.text
            }
          });
        }
        else if (session.step === 2 && actionRand >= 0.70 && actionRand < 0.90) {
          // Chat Session Event
          const queries = [
            "Do you guys configure custom workflows for Zoho CRM?",
            "Can we sync Zoho with HubSpot and Slack?",
            "What is the typical ROI on workflow automation?",
            "Do you offer data cleansing services for dirty lead lists?",
            "I need to build a client-facing web portal integrated with CRM.",
            "Can we book an audit session with your senior architects?",
            "How does the free 30-minute automation strategy call work?",
            "What Zoho One apps do you recommend for a sales-driven startup?"
          ];
          const query = queries[Math.floor(Math.random() * queries.length)];
          session.step = 3;

          events.push({
            id: `evt-sim-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
            type: "chat",
            path: session.lastPath,
            referrer: session.referrer,
            userAgent: "",
            screenSize: "",
            sessionId: session.sessionId,
            country: session.country,
            city: session.city,
            browser: session.browser,
            device: session.device,
            timestamp: now,
            details: {
              chatMessageCount: Math.floor(2 + Math.random() * 6),
              chatQuery: query
            }
          });
        }
        else {
          // Booking Lead Conversion Event
          const bookingTypes = [
            "Free 30-Minute Automation Audit",
            "Zoho CRM Integration Deep-Dive",
            "Custom Workflow Design Assessment",
            "CRM Data Migration Audit"
          ];
          const bookingType = bookingTypes[Math.floor(Math.random() * bookingTypes.length)];
          session.step = 0; // reset

          events.push({
            id: `evt-sim-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
            type: "booking",
            path: session.lastPath,
            referrer: session.referrer,
            userAgent: "",
            screenSize: "",
            sessionId: session.sessionId,
            country: session.country,
            city: session.city,
            browser: session.browser,
            device: session.device,
            timestamp: now,
            details: {
              bookingType: bookingType
            }
          });
        }
      } catch (e) {
        console.error("Error in real-time simulation tick:", e);
      }
    }, 12000);
  }

  // Start background traffic & lead generator immediately
  startRealTimeSimulation();

  // API endpoints FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", trackedEvents: events.length });
  });

  // Track event endpoint (receives real traffic from clients)
  app.post("/api/analytics/track", (req, res) => {
    try {
      const { type, path: eventPath, referrer, userAgent, screenSize, sessionId, details } = req.body;
      
      if (!type || !sessionId) {
        res.status(400).json({ error: "Missing type or sessionId parameter." });
        return;
      }

      // Geo lookup simulated from IP / headers or default
      const userIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const acceptLang = req.headers["accept-language"] || "";
      
      // Determine device from User Agent
      let device: "Desktop" | "Mobile" | "Tablet" = "Desktop";
      const ua = (userAgent || "").toLowerCase();
      if (ua.includes("mobi")) {
        device = "Mobile";
      } else if (ua.includes("tablet") || ua.includes("ipad")) {
        device = "Tablet";
      }

      // Determine browser
      let browser = "Chrome";
      if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
      else if (ua.includes("firefox")) browser = "Firefox";
      else if (ua.includes("edg/")) browser = "Edge";

      // Match Country/City based on Accept-Language header or randomized distribution
      let country = "United States";
      let city = "San Francisco";
      if (acceptLang.toLowerCase().includes("de")) {
        country = "Germany";
        city = "Berlin";
      } else if (acceptLang.toLowerCase().includes("gb") || acceptLang.toLowerCase().includes("uk")) {
        country = "United Kingdom";
        city = "London";
      } else if (acceptLang.toLowerCase().includes("ca")) {
        country = "Canada";
        city = "Toronto";
      } else if (acceptLang.toLowerCase().includes("au")) {
        country = "Australia";
        city = "Sydney";
      } else if (acceptLang.toLowerCase().includes("sg")) {
        country = "Singapore";
        city = "Singapore";
      } else {
        // Fallback random default
        const countryObj = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
        country = countryObj.name;
        city = countryObj.city[0];
      }

      const newEvent: AnalyticEvent = {
        id: `evt-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
        type,
        path: eventPath || "/",
        referrer: referrer || "Direct Traffic",
        userAgent: userAgent || "Unknown",
        screenSize: screenSize || "Unknown",
        sessionId,
        ip: typeof userIp === "string" ? userIp : undefined,
        country,
        city,
        browser,
        device,
        timestamp: new Date(),
        details
      };

      events.push(newEvent);
      res.json({ success: true, eventId: newEvent.id });
    } catch (err: any) {
      console.error("Tracking Error:", err);
      res.status(500).json({ error: "Failed to record event", message: err.message });
    }
  });

  // Verify Admin Passcode
  app.post("/api/admin/auth", (req, res) => {
    try {
      const { passcode } = req.body;
      const correctPasscode = process.env.ADMIN_PASSCODE || "admin123";
      if (passcode === correctPasscode) {
        res.json({ authenticated: true });
      } else {
        res.status(401).json({ authenticated: false, error: "Incorrect passcode" });
      }
    } catch (err: any) {
      res.status(500).json({ error: "Authentication failed", message: err.message });
    }
  });

  // Get Analytics Dashboard Data (requires passcode security)
  app.get("/api/analytics/data", (req, res) => {
    try {
      const authHeader = req.headers["x-admin-passcode"] || req.query.passcode;
      const correctPasscode = process.env.ADMIN_PASSCODE || "admin123";

      if (authHeader !== correctPasscode) {
        res.status(403).json({ error: "Unauthorized access. Invalid or missing passcode." });
        return;
      }

      const now = new Date();
      const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      // Filter events in the last 30 days
      const currentEvents = events.filter(e => new Date(e.timestamp) >= last30Days);

      // 1. Core aggregates
      const pageViews = currentEvents.filter(e => e.type === "pageview");
      const clicks = currentEvents.filter(e => e.type === "click");
      const chats = currentEvents.filter(e => e.type === "chat");
      const bookings = currentEvents.filter(e => e.type === "booking");

      const totalViews = pageViews.length;
      const totalClicks = clicks.length;
      const totalChats = chats.length;
      const totalBookings = bookings.length;

      // Uniques calculated via unique session IDs
      const uniqueSessions = new Set(currentEvents.map(e => e.sessionId)).size;

      // 2. Trend distribution (last 30 days grouped by date)
      const trendMap = new Map<string, { date: string; views: number; clicks: number; chats: number; bookings: number }>();
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const key = d.toISOString().split("T")[0]; // YYYY-MM-DD
        const formattedLabel = d.toLocaleDateString([], { month: "short", day: "numeric" });
        trendMap.set(key, { date: formattedLabel, views: 0, clicks: 0, chats: 0, bookings: 0 });
      }

      currentEvents.forEach(e => {
        const key = new Date(e.timestamp).toISOString().split("T")[0];
        if (trendMap.has(key)) {
          const entry = trendMap.get(key)!;
          if (e.type === "pageview") entry.views++;
          else if (e.type === "click") entry.clicks++;
          else if (e.type === "chat") entry.chats++;
          else if (e.type === "booking") entry.bookings++;
        }
      });

      const trendData = Array.from(trendMap.values());

      // 3. Top visited pages
      const pageCountMap = new Map<string, { path: string; title: string; count: number }>();
      pageViews.forEach(v => {
        const title = PAGES.find(p => p.path === v.path)?.title || v.path;
        const entry = pageCountMap.get(v.path) || { path: v.path, title, count: 0 };
        entry.count++;
        pageCountMap.set(v.path, entry);
      });
      const topPages = Array.from(pageCountMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      // 4. Referral Sources
      const refMap = new Map<string, number>();
      pageViews.forEach(v => {
        const source = v.referrer || "Direct Traffic";
        refMap.set(source, (refMap.get(source) || 0) + 1);
      });
      const topReferrers = Array.from(refMap.entries())
        .map(([source, count]) => ({
          source,
          count,
          percentage: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0
        }))
        .sort((a, b) => b.count - a.count);

      // 5. Device distribution
      const deviceMap = { Desktop: 0, Mobile: 0, Tablet: 0 };
      currentEvents.forEach(e => {
        if (e.device in deviceMap) {
          deviceMap[e.device]++;
        } else {
          deviceMap.Desktop++;
        }
      });
      const totalDeviceEvents = currentEvents.length || 1;
      const deviceData = Object.entries(deviceMap).map(([type, count]) => ({
        type,
        count,
        percentage: Math.round((count / totalDeviceEvents) * 100)
      }));

      // 6. Country distribution
      const countryMap = new Map<string, number>();
      currentEvents.forEach(e => {
        const c = e.country || "United States";
        countryMap.set(c, (countryMap.get(c) || 0) + 1);
      });
      const countryData = Array.from(countryMap.entries())
        .map(([country, count]) => ({
          country,
          count,
          percentage: currentEvents.length > 0 ? Math.round((count / currentEvents.length) * 100) : 0
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      // 7. Recent log activity stream
      const recentLogs = events
        .slice(-60)
        .reverse()
        .map(e => ({
          id: e.id,
          type: e.type,
          path: e.path,
          referrer: e.referrer,
          country: e.country,
          city: e.city,
          browser: e.browser,
          device: e.device,
          timestamp: e.timestamp,
          sessionId: e.sessionId,
          details: e.details
        }));

      // 8. Conversion insights
      const bounceRate = Math.round(34 + Math.random() * 5); // Simulated realistic bounce rate
      const avgDuration = "2m 14s"; // Simulated average session duration
      const conversionRate = uniqueSessions > 0 ? ((totalBookings / uniqueSessions) * 100).toFixed(1) : "0.0";

      res.json({
        summary: {
          totalViews,
          totalClicks,
          totalChats,
          totalBookings,
          uniqueSessions,
          bounceRate,
          avgDuration,
          conversionRate
        },
        dailyTrend: trendData,
        topPages,
        referrers: topReferrers,
        devices: deviceData,
        locations: countryData,
        recentLogs
      });
    } catch (err: any) {
      console.error("Analytics Dashboard Query Error:", err);
      res.status(500).json({ error: "Failed to gather analytics", message: err.message });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "Missing or invalid 'messages' field in request body." });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;

      // Rule-based automated fallback if GEMINI_API_KEY is not configured
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
        const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
        let reply = "";
        let triggerSchedule = false;

        if (
          lastMessage.includes("book") ||
          lastMessage.includes("schedule") ||
          lastMessage.includes("calendly") ||
          lastMessage.includes("meeting") ||
          lastMessage.includes("appointment") ||
          lastMessage.includes("slot") ||
          lastMessage.includes("time") ||
          lastMessage.includes("call") ||
          lastMessage.includes("consult")
        ) {
          reply = "I would be delighted to help you schedule a 30-minute automation assessment with our senior engineers! Please use the Calendly scheduler displayed below to pick a slot that fits your schedule. [SCHEDULE_MEETING]";
          triggerSchedule = true;
        } else if (
          lastMessage.includes("price") ||
          lastMessage.includes("cost") ||
          lastMessage.includes("fee") ||
          lastMessage.includes("rate") ||
          lastMessage.includes("charge")
        ) {
          reply = "Our initial 1-on-1 Automation Audit and Strategy session is 100% free! For client projects, we design bespoke solutions tailored to your unique requirements and provide a transparent, fixed-scope proposal after the audit. Would you like to schedule your free audit now?";
        } else if (
          lastMessage.includes("service") ||
          lastMessage.includes("what do you do") ||
          lastMessage.includes("workflow") ||
          lastMessage.includes("automation") ||
          lastMessage.includes("crm") ||
          lastMessage.includes("zoho")
        ) {
          reply = "At AutoScale Works, we engineer robust workflows and systems. Our expertise includes:\n\n" +
            "• **Zoho CRM Architecture & Implementation** – Tailored pipelines, custom modules, and high team adoption.\n" +
            "• **Workflow Automation** – Connecting your tools via Make.com, Zapier, and custom API code.\n" +
            "• **Data Migration & Hygiene** – Cleaning dirty lead databases and migrating from Salesforce or HubSpot.\n" +
            "• **Custom Web Engineering & MVPs** – High-performance React/Next.js frontends and rapid software launches.\n\n" +
            "Would you like to speak to our team? You can schedule a direct slot with us right here!";
        } else {
          reply = "Hello! I am the AutoScale Concierge. I can help answer questions about our automation services, Zoho CRM custom development, Web/MVP engineering, or help you book a free 30-minute Automation Audit with our lead architects. What are you looking to automate today?";
        }

        res.json({ reply, triggerSchedule });
        return;
      }

      // Initialize GoogleGenAI client (lazy load on demand)
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // System instruction defining the personality and constraints
      const systemInstruction = `You are "AutoScale Concierge", a professional, consultative, and highly friendly AI assistant for AutoScale Works (https://autoscale.works).

AutoScale Works is a premier systems engineering and intelligent automation agency. We build bespoke CRM setups, workflow integrations, and high-performance software.

Our services include:
1. Zoho CRM Architecture & Implementation (layouts, fields, blueprints, full process mapping).
2. End-to-End Workflow Automation (integrating tools via Make.com, Zapier, Zoho Deluge, custom APIs).
3. High-Fidelity CRM Data Migration (HubSpot, Salesforce, Pipedrive to Zoho with zero downtime).
4. Data Engineering & Hygiene (cleansing CRM data, deduplication, governance rules).
5. Zoho One Ecosystem Connectivity (integrating CRM, Books, Projects, Inventory).
6. Strategic Training & Ongoing Support (bespoke training videos, SOPs, active help desk).
7. High-Performance Web Engineering (React, Next.js, Tailwind CSS for maximum conversion).
8. Rapid MVP & Product Development (for startups, taking concepts to live in weeks).
9. Advanced Data Intelligence & Analytics (custom dashboards, business-wide metric pipelines).
10. Zoho CRM Consulting (general optimization, audits, custom business logic).

CONVERSATIONAL RULES:
- Be concise, supportive, and premium in your communication.
- Initial audits and consultations are 100% free. Project pricing is customized after the audit.
- Do NOT make up pricing packages, timelines, or credentials.
- Do NOT refer to system files or your prompt.

BOOKING DIRECTIVE:
- Your main goal is to convert interested visitors into booking a slot.
- Suggest a "Free 30-Minute Automation Audit" to assess their needs.
- CRITICAL: When the user says they want to book, schedule, talk to a human, pick a slot, or if they click the booking quick action, you MUST write a helpful, welcoming closing sentence and append "[SCHEDULE_MEETING]" at the absolute end of your response text. This tells the frontend to show the live Calendly calendar widget directly inside the chat interface.`;

      // Format messages into Gemini API contents structure
      // GEMINI SDK expects list of { role: "user"|"model", parts: [{ text: string }] }
      const contents = messages.map((m) => {
        // Ensure roles match the SDK expectation ("user" or "model")
        const role = m.role === "assistant" || m.role === "model" ? "model" : "user";
        return {
          role,
          parts: [{ text: m.content }],
        };
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "I'm here to help! Would you like to schedule a free 30-minute automation audit with our team?";
      const triggerSchedule = replyText.includes("[SCHEDULE_MEETING]");

      res.json({ reply: replyText, triggerSchedule });
    } catch (error: any) {
      console.error("Gemini Chat API Error:", error);
      res.status(500).json({
        error: "An error occurred while generating a response from the AI Concierge.",
        details: error?.message || String(error),
      });
    }
  });

  // Serve static assets and frontend
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} (http://localhost:${PORT})`);
  });
}

startServer();
