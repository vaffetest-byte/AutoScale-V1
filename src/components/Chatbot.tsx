import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { InlineWidget } from "react-calendly";
import { MessageSquare, X, Send, Bot, Calendar, Sparkles, AlertCircle, Clock, Trash2 } from "lucide-react";
import { trackEvent } from "./AnalyticsTracker";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  triggerSchedule?: boolean;
}

const QUICK_REPLIES = [
  { text: "📅 Book a Free Audit", value: "I'd like to book a free 30-minute automation audit!" },
  { text: "💡 Zoho CRM Setup", value: "What do you offer for Zoho CRM implementation?" },
  { text: "🛠️ Custom Workflows", value: "How do you build custom automations with Make and Zapier?" },
  { text: "💰 Pricing & Cost", value: "What are your pricing options and is the audit free?" }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasNewMessageAlert, setHasNewMessageAlert] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const tooltipTimer = useRef<NodeJS.Timeout | null>(null);

  // Initialize with welcome message or load from sessionStorage
  useEffect(() => {
    const savedMessages = sessionStorage.getItem("autoscale_chat_history");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages).map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
        setMessages(parsed);
      } catch (e) {
        initializeWelcomeMessage();
      }
    } else {
      initializeWelcomeMessage();
    }

    // Show persistent welcome tooltip after 4 seconds
    tooltipTimer.current = setTimeout(() => {
      setShowTooltip(true);
    }, 4000);

    return () => {
      if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    };
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  // Persist chat messages to sessionStorage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("autoscale_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  const initializeWelcomeMessage = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hello! 👋 I'm your AutoScale AI Concierge. I can answer questions about our systems engineering, Zoho CRM setups, automated workflows, custom web builds, or help you instantly book a **Free 30-Minute Automation Audit** with our senior architects.\n\nWhat are you looking to optimize or scale today?",
        timestamp: new Date()
      }
    ]);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setHasNewMessageAlert(false);
    setShowTooltip(false);
  };

  const clearChat = () => {
    if (window.confirm("Would you like to clear your conversation history?")) {
      sessionStorage.removeItem("autoscale_chat_history");
      initializeWelcomeMessage();
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    if (!textToSend) {
      setInput("");
    }

    const userMsg: Message = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Track user message event
    trackEvent("chat", { chatQuery: text });

    try {
      const payloadMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: payloadMessages })
      });

      if (!res.ok) {
        throw new Error("Failed to communicate with chat server.");
      }

      const data = await res.json();
      
      let replyContent = data.reply;
      // Strip out [SCHEDULE_MEETING] tag for cleaner reading in text,
      // but keep the triggerSchedule status flag.
      const cleanedReply = replyContent.replace("[SCHEDULE_MEETING]", "").trim();
      const isBookingTriggered = !!data.triggerSchedule || replyContent.includes("[SCHEDULE_MEETING]");

      const assistantMsg: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: cleanedReply,
        timestamp: new Date(),
        triggerSchedule: isBookingTriggered
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Track booking conversion if triggered
      if (isBookingTriggered) {
        trackEvent("booking", { bookingType: "Chatbot Calendly Opened" });
      }

      if (!isOpen) {
        setHasNewMessageAlert(true);
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errMsg: Message = {
        id: `msg-${Date.now()}-error`,
        role: "assistant",
        content: "⚠️ I'm having trouble connecting to the server. But don't worry, you can easily schedule your free audit directly with our calendar below!",
        timestamp: new Date(),
        triggerSchedule: true // Provide calendar directly as a supportive fallback
      };
      setMessages((prev) => [...prev, errMsg]);
      
      // Track fallback booking event
      trackEvent("booking", { bookingType: "Chatbot Fallback Calendar Opened" });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {/* Floating Tooltip */}
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-20 right-0 w-72 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-800 pointer-events-auto z-40 hidden sm:block"
          >
            <div className="absolute right-6 -bottom-2 w-4 h-4 bg-slate-900 rotate-45 border-r border-b border-slate-800" />
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-brand-blue/20 text-brand-blue shrink-0">
                <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-100">AI Concierge & Booking</p>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Have questions about our CRM or workflow services? Ask me anything or book an audit slot!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* Chat Window */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-white w-[92vw] sm:w-[400px] h-[600px] max-h-[82vh] rounded-[32px] shadow-[0_32px_64px_-12px_rgba(15,23,42,0.18)] border border-slate-100 flex flex-col overflow-hidden relative z-50 mb-4"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-950 to-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800 relative">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-brand-blue/10 border border-slate-800 flex items-center justify-center text-brand-blue">
                    <Bot className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-sm tracking-tight text-white">AutoScale Concierge</h3>
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" /> Typically replies instantly
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  title="Clear history"
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleToggle}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-5 bg-slate-50 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-start gap-2.5 max-w-[85%]">
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 border border-slate-100 shrink-0 mt-0.5">
                        <Bot className="w-4 h-4 text-slate-500" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-brand-blue text-white rounded-tr-none shadow-[0_4px_12px_rgba(37,99,235,0.15)]"
                          : "bg-white text-slate-700 border border-slate-200/60 rounded-tl-none shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.content}</p>
                    </div>
                  </div>

                  {/* Inline Calendly Rendering */}
                  {msg.triggerSchedule && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="w-full mt-3 bg-white rounded-2xl border border-slate-200/80 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.06)] overflow-hidden"
                    >
                      <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-brand-blue" /> Choose a Booking Slot
                        </span>
                        <span className="text-[10px] text-brand-blue font-medium bg-brand-blue/10 px-2 py-0.5 rounded-full">
                          1-on-1 Strategy
                        </span>
                      </div>
                      <div className="p-1 max-h-[360px] overflow-y-auto">
                        <InlineWidget
                          url="https://calendly.com/victor-autoscale/30min"
                          styles={{ height: "340px", width: "100%" }}
                          pageSettings={{
                            backgroundColor: "ffffff",
                            hideEventTypeDetails: true,
                            hideLandingPageDetails: true,
                            primaryColor: "2563eb",
                            textColor: "0f172a"
                          }}
                        />
                      </div>
                    </motion.div>
                  )}

                  <span className="text-[9px] text-slate-400 mt-1 mx-9 font-medium">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 border border-slate-100 shrink-0 mt-0.5 animate-pulse">
                    <Bot className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 text-sm shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length < 6 && !isLoading && (
              <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
                {QUICK_REPLIES.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(reply.value)}
                    className="text-xs font-semibold whitespace-nowrap bg-white text-slate-600 border border-slate-200/80 px-3 py-1.5 rounded-full hover:border-brand-blue hover:text-brand-blue hover:bg-brand-blue/5 transition-all shrink-0 active:scale-95"
                  >
                    {reply.text}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-4 bg-white border-t border-slate-100 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about automations, pricing, or say book..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-slate-200/80 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue bg-slate-50/50 disabled:bg-slate-100 disabled:cursor-not-allowed text-slate-800 transition-all"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-3 bg-brand-blue hover:bg-blue-600 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-2xl shadow-lg shadow-brand-blue/15 hover:shadow-brand-blue/20 disabled:shadow-none transition-all duration-200 shrink-0 flex items-center justify-center active:scale-95 disabled:active:scale-100"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-slate-950 text-white flex items-center justify-center shadow-[0_16px_36px_-6px_rgba(15,23,42,0.3)] hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.4)] border border-slate-800 relative overflow-hidden group cursor-pointer transition-shadow"
      >
        {/* Glow Ring */}
        <span className="absolute inset-0 bg-gradient-to-tr from-brand-blue to-brand-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <MessageSquare className="w-6 h-6 text-blue-400" />
              {hasNewMessageAlert && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-rose-500 border-2 border-slate-950 rounded-full animate-bounce" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
