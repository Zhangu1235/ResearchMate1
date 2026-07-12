import React, { useState, useEffect } from "react";
import {
  House,
  FileText,
  Upload,
  GitCompare,
  BrainCircuit,
  MessageSquare,
  User,
  HelpCircle,
  X,
  Send,
  CheckCircle2
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar width state (constrains between 180px and 400px)
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem("sidebar_width");
    return saved ? parseInt(saved, 10) : 260;
  });

  // Feedback states
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("Upgrade Request");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const items = [
    { icon: <House size={20} />, label: "Dashboard", path: "/dashboard" },
    { icon: <FileText size={20} />, label: "My Papers", path: "/papers" },
    { icon: <Upload size={20} />, label: "Upload", path: "/upload" },
    { icon: <GitCompare size={20} />, label: "Compare", path: "/compare" },
    { icon: <BrainCircuit size={20} />, label: "AI Summary", path: "/summary" },
    { icon: <MessageSquare size={20} />, label: "Ask AI", path: "/chat" },
    { icon: <User size={20} />, label: "Profile", path: "/profile" },
  ];

  // Synthesize Web Audio API futuristic Pop Chime sound effect
  const playPopSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      // Chime pop frequency sweeps up quickly
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(920, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      console.warn("Failed to play synthesized pop sound:", e);
    }
  };

  // Drag resizer handler
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(180, Math.min(400, moveEvent.clientX));
      setSidebarWidth(newWidth);
      localStorage.setItem("sidebar_width", newWidth.toString());
    };
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) {
      alert("Please fill in email and message.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, type, message }),
      });
      const data = await response.json();
      if (data.success) {
        setSubmitSuccess(true);
        // Play Pop sound
        playPopSound();
        // Clear fields
        setName("");
        setEmail("");
        setMessage("");
      } else {
        alert(data.message || "Failed to submit feedback.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while sending feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside 
      className="sidebar"
      style={{
        width: `${sidebarWidth}px`,
        flexShrink: 0,
        position: "relative",
        transition: "none", // disable transitions during drag for lag-free response
      }}
    >
      {/* Draggable Resizer Bar */}
      <div 
        onMouseDown={startResizing}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "6px",
          cursor: "col-resize",
          background: "transparent",
          zIndex: 100,
          transition: "background 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-primary-light)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      />

      <div className="logo" style={{ overflow: "hidden" }}>
        <div className="logoCircle" style={{ 
          flexShrink: 0, 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          boxShadow: "0 0 15px var(--color-primary-light)"
        }}>
          <svg viewBox="0 0 24 24" style={{ width: "20px", height: "20px" }} fill="none" stroke="#fff">
            <circle cx="12" cy="12" r="3" fill="#fff" />
            <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(45 12 12)" strokeWidth="1.5" />
            <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-45 12 12)" strokeWidth="1.5" />
          </svg>
        </div>

        {sidebarWidth > 200 && (
          <div>
            <h2>ResearchMate</h2>
            <span>AI Workspace</span>
          </div>
        )}
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "4px", overflow: "hidden" }}>
        {items.map((item) => (
          <button
            key={item.label}
            className={`sidebarItem ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
            style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", textAlign: "left" }}
          >
            <div style={{ flexShrink: 0 }}>{item.icon}</div>
            {sidebarWidth > 200 && <span>{item.label}</span>}
          </button>
        ))}

        {/* Help & Feedback Button */}
        <button
          className="sidebarItem"
          onClick={() => {
            setShowModal(true);
            setSubmitSuccess(false);
          }}
          style={{ 
            marginTop: "12px", 
            borderTop: "1px dashed rgba(255,255,255,0.06)", 
            paddingTop: "12px",
            display: "flex", 
            alignItems: "center", 
            gap: "12px", 
            width: "100%", 
            textAlign: "left" 
          }}
        >
          <div style={{ flexShrink: 0 }}><HelpCircle size={20} /></div>
          {sidebarWidth > 200 && <span>Help & Feedback</span>}
        </button>
      </nav>

      {sidebarWidth > 200 && (
        <div style={{ marginTop: "auto", padding: "20px 10px 10px", fontSize: "11px", color: "var(--text-muted)", textAlign: "center", borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <p style={{ margin: 0, opacity: 0.8 }}>© 2026 ResearchMate</p>
          <p style={{ margin: "2px 0 0", fontWeight: "600", color: "var(--color-primary)" }}>Created by Jessica and Kezha</p>
        </div>
      )}

      {/* Help & Feedback Modal */}
      {showModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(8px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10000,
          padding: "20px"
        }}>
          <div className="glowBorder" style={{
            background: "var(--bg-card)",
            border: "var(--border-card)",
            borderRadius: "20px",
            padding: "30px",
            width: "100%",
            maxWidth: "480px",
            boxShadow: "var(--shadow-card)",
            position: "relative",
            backdropFilter: "blur(25px)"
          }}>
            {/* Close Button */}
            <button 
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "var(--text-main)",
                cursor: "pointer"
              }}
            >
              <X size={16} />
            </button>

            {!submitSuccess ? (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                  <HelpCircle size={20} className="glowIcon" /> Help & Feedback
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 10px" }}>
                  Let us know what upgrades or bug fixes you would like to see. Submissions will trigger direct admin email notifications.
                </p>

                <div>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>
                    Your Name
                  </label>
                  <input 
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--border-card)",
                      color: "var(--text-main)",
                      outline: "none",
                      fontSize: "13px"
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>
                    Your Email *
                  </label>
                  <input 
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--border-card)",
                      color: "var(--text-main)",
                      outline: "none",
                      fontSize: "13px"
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>
                    Feedback Category *
                  </label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--border-card)",
                      color: "var(--text-main)",
                      outline: "none",
                      fontSize: "13px",
                      cursor: "pointer"
                    }}
                  >
                    <option value="Upgrade Request" style={{ color: "#000" }}>System Upgrade Request</option>
                    <option value="Bug Report" style={{ color: "#000" }}>Bug Report</option>
                    <option value="Feature Suggestion" style={{ color: "#000" }}>Feature Suggestion</option>
                    <option value="Other" style={{ color: "#000" }}>Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>
                    Message *
                  </label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="Describe the upgrade or issue in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--border-card)",
                      color: "var(--text-main)",
                      outline: "none",
                      fontSize: "13px",
                      resize: "none",
                      lineHeight: "1.5"
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button 
                    type="submit" 
                    className="primaryAction"
                    disabled={isSubmitting}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "10px",
                      borderRadius: "8px",
                      fontSize: "13px"
                    }}
                  >
                    <Send size={14} />
                    {isSubmitting ? "Sending..." : "Submit Feedback"}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      flex: 1,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "var(--text-main)",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <CheckCircle2 size={48} style={{ color: "#22c55e", margin: "0 auto 15px" }} />
                <h3 style={{ fontSize: "18px", color: "var(--text-main)", marginBottom: "8px" }}>Feedback Received</h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>
                  Your upgrade request email notification has been dispatched to kezhanguukruse@gmail.com.
                </p>
                <button 
                  onClick={() => setShowModal(false)}
                  className="primaryAction"
                  style={{
                    padding: "8px 24px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "600"
                  }}
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}