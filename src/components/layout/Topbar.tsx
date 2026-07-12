import React, { useState, useEffect, useRef } from "react";
import { Bell, Search, Palette, FileText, CheckCircle2 } from "lucide-react";
import { usePapers } from "../../context/PaperContext";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const { papers } = usePapers();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "Kezhanguukruse");

  // Sync username changes (like from Profile saving)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedName = localStorage.getItem("username");
      if (savedName) setUsername(savedName);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Theme states
  const [theme, setTheme] = useState(() => localStorage.getItem("researchmate_theme") || "indigo");

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Notification states
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);

  // Refs for clicking outside to close dropdowns
  const searchRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  // Sync theme attribute
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("researchmate_theme", theme);
  }, [theme]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter papers for local search autocomplete
  const filteredPapers = searchQuery.trim()
    ? papers.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  // Generate dynamic notifications from active papers list
  const getNotifications = () => {
    const list: Array<{ id: string; title: string; desc: string; type: "upload" | "summary" }> = [];
    papers.forEach((p) => {
      // Add upload notification
      list.push({
        id: `up-${p.id}`,
        title: "Paper Loaded Successfully",
        desc: `"${p.name}" is now ready for analysis.`,
        type: "upload",
      });
      // Add summary notification if exists
      if (p.summary) {
        list.push({
          id: `sum-${p.id}`,
          title: "AI Summary Ready",
          desc: `Abstract synthesis complete for "${p.name}".`,
          type: "summary",
        });
      }
    });
    return list.slice(0, 5); // show last 5 events
  };

  const notifications = getNotifications();
  const hasUnread = notifications.length > 0 && !notificationsRead;

  const handlePaperClick = (paperId: string) => {
    setSearchQuery("");
    setShowSearchResults(false);
    navigate(`/summary?id=${paperId}`);
  };

  return (
    <header className="topbarSimple" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
      <div>
        <h2 style={{ fontSize: "28px", fontWeight: "700", margin: 0, color: "var(--text-main, #111827)" }}>
          {username}
        </h2>
        <p style={{ margin: "4px 0 0", color: "var(--text-muted, #6B7280)", fontSize: "14px" }}>
          ResearchMate AI Workspace
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        
        {/* Theme Picker Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--bg-card, #fff)", border: "1px solid var(--border-card, #E5E7EB)", borderRadius: "10px", padding: "4px 10px", boxShadow: "var(--shadow-card)" }}>
          <Palette size={16} style={{ color: "var(--color-primary, #6366f1)" }} />
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "13px",
              fontWeight: "600",
              color: "inherit",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="indigo" style={{ color: "#000" }}>🌌 Indigo Space</option>
            <option value="nordic" style={{ color: "#000" }}>🌌 Nordic Slate</option>
            <option value="emerald" style={{ color: "#000" }}>🌿 Emerald Mint</option>
            <option value="volcanic" style={{ color: "#000" }}>🌋 Volcanic Amber</option>
            <option value="midnight" style={{ color: "#000" }}>⚡ Midnight Neon</option>
            <option value="cyberpunk" style={{ color: "#000" }}>🤖 Cyberpunk Glow</option>
          </select>
        </div>

        {/* Dynamic Autocomplete Search Box */}
        <div className="searchBox" ref={searchRef} style={{ position: "relative", width: "300px" }}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search uploaded papers..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            style={{ width: "100%" }}
          />

          {/* Autocomplete Dropdown overlay */}
          {showSearchResults && searchQuery.trim() !== "" && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "var(--bg-card, #fff)",
                border: "1px solid var(--border-card, #E5E7EB)",
                borderRadius: "12px",
                marginTop: "8px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                zIndex: 1000,
                maxHeight: "250px",
                overflowY: "auto",
                padding: "8px 0",
              }}
            >
              {filteredPapers.length === 0 ? (
                <div style={{ padding: "12px 16px", fontSize: "13px", color: "var(--text-muted, #6B7280)", textAlign: "center" }}>
                  No papers found
                </div>
              ) : (
                filteredPapers.map((paper) => (
                  <div
                    key={paper.id}
                    onClick={() => handlePaperClick(paper.id)}
                    style={{
                      padding: "10px 16px",
                      cursor: "pointer",
                      fontSize: "13px",
                      borderBottom: "1px solid var(--border-card, rgba(0,0,0,0.05))",
                      transition: "background 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-primary-light, rgba(99,102,241,0.08))"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <FileText size={15} style={{ color: "var(--color-primary, #6366f1)" }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {paper.name}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Dynamic Notification Bell Dropdown */}
        <div ref={bellRef} style={{ position: "relative" }}>
          <button
            className="notification"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setNotificationsRead(true);
            }}
            style={{ position: "relative" }}
          >
            <Bell size={20} />
            {hasUnread && (
              <span
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  width: "8px",
                  height: "8px",
                  background: "#ef4444",
                  borderRadius: "50%",
                }}
              />
            )}
          </button>

          {showNotifications && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                background: "var(--bg-card, #fff)",
                border: "1px solid var(--border-card, #E5E7EB)",
                borderRadius: "16px",
                marginTop: "12px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                zIndex: 1000,
                width: "320px",
                maxHeight: "350px",
                overflowY: "auto",
                padding: "16px",
              }}
            >
              <h4 style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: "700" }}>Workspace Notifications</h4>
              
              {notifications.length === 0 ? (
                <div style={{ padding: "20px 0", textAlign: "center", color: "var(--text-muted, #6B7280)", fontSize: "13px" }}>
                  No recent activities recorded.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setShowNotifications(false);
                        navigate("/papers");
                      }}
                      style={{
                        display: "flex",
                        gap: "10px",
                        padding: "8px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "background 0.2s ease",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-primary-light, rgba(99,102,241,0.05))"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <CheckCircle2 size={16} style={{ color: n.type === "summary" ? "#22c55e" : "#3b82f6", flexShrink: 0, marginTop: "2px" }} />
                      <div>
                        <h5 style={{ margin: 0, fontSize: "12px", fontWeight: "600" }}>{n.title}</h5>
                        <p style={{ margin: "2px 0 0", fontSize: "11px", color: "var(--text-muted, #6B7280)" }}>
                          {n.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
}