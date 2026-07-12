import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { usePapers } from "../context/PaperContext";
import { Camera, Edit3, Save, FileText, GitCompare, MessageSquare, Briefcase } from "lucide-react";
import "../styles/dashboard.css";

export default function Profile() {
  const { papers } = usePapers();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [username, setUsername] = useState("Researcher");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("AI Research Scholar");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) setUsername(savedUsername);

    const savedBio = localStorage.getItem("user_bio");
    if (savedBio) setBio(savedBio);

    const savedRole = localStorage.getItem("user_role");
    if (savedRole) setRole(savedRole);

    const savedAvatar = localStorage.getItem("user_avatar");
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
        localStorage.setItem("user_avatar", base64String);
        // Dispatch an event to update Topbar avatar if needed
        window.dispatchEvent(new Event("storage"));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    localStorage.setItem("username", username);
    localStorage.setItem("user_bio", bio);
    localStorage.setItem("user_role", role);
    setIsEditing(false);
    // Dispatch an event to update other parts of application (like Topbar)
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="dashboardPage">
      <Sidebar />

      <main className="dashboardContent">
        <Topbar />

        <section className="pageHeader">
          <h1>My Profile</h1>
          <p>Customize your ResearchMate workspace identity, avatar, and academic bio.</p>
        </section>

        <div style={{ padding: "0 50px 50px", display: "flex", justifyContent: "center" }}>
          <div className="profileCard" style={{
            background: "var(--bg-card)",
            border: "var(--border-card)",
            borderRadius: "24px",
            padding: "40px",
            width: "100%",
            maxWidth: "600px",
            boxShadow: "var(--shadow-card)",
            backdropFilter: "blur(25px)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Ambient Profile Glow */}
            <div style={{
              position: "absolute",
              top: "-50px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "200px",
              height: "200px",
              background: "var(--color-primary-gradient)",
              borderRadius: "50%",
              filter: "blur(70px)",
              opacity: 0.15,
              pointerEvents: "none"
            }} />

            {/* Avatar Section */}
            <div style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto 25px" }}>
              <div 
                onClick={triggerAvatarUpload}
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  border: "3px solid var(--color-primary)",
                  boxShadow: "0 0 20px var(--color-primary-light)",
                  overflow: "hidden",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "var(--color-primary-light)",
                  fontSize: "36px",
                  fontWeight: "bold",
                  color: "var(--text-main)",
                  transition: "transform 0.3s ease",
                }}
                className="profileAvatarHover"
              >
                {avatar ? (
                  <img src={avatar} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  username.charAt(0).toUpperCase()
                )}
                
                {/* Change Photo Overlay */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.6)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: 0,
                  transition: "opacity 0.25s ease",
                  borderRadius: "50%"
                }} className="avatarOverlay">
                  <Camera size={24} color="#fff" />
                </div>
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarChange} 
                accept="image/*" 
                style={{ display: "none" }} 
              />
            </div>

            {/* Edit Mode vs View Mode */}
            {!isEditing ? (
              <div>
                <h2 style={{ fontSize: "24px", fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>
                  {username}
                </h2>
                <p style={{ fontSize: "14px", color: "var(--color-primary)", fontWeight: "600", marginBottom: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <Briefcase size={14} /> {role}
                </p>
                
                <p style={{ 
                  fontSize: "14px", 
                  color: "var(--text-muted)", 
                  lineHeight: "1.7", 
                  maxWidth: "420px", 
                  margin: "0 auto 30px",
                  fontStyle: bio ? "normal" : "italic"
                }}>
                  {bio || "No professional academic bio added yet. Click 'Edit Profile' below to write about your research interests!"}
                </p>

                <button 
                  onClick={() => setIsEditing(true)}
                  className="primaryAction"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 24px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  <Edit3 size={14} /> Edit Profile
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "15px", textAlign: "left", maxWidth: "460px", margin: "0 auto" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "6px", display: "block" }}>
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--border-card)",
                      color: "var(--text-main)",
                      fontSize: "14px",
                      outline: "none"
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "6px", display: "block" }}>
                    Academic Role / Focus
                  </label>
                  <input 
                    type="text" 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--border-card)",
                      color: "var(--text-main)",
                      fontSize: "14px",
                      outline: "none"
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "6px", display: "block" }}>
                    Research Biography
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="Write about your scientific domains, datasets, or target academic goals..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--border-card)",
                      color: "var(--text-main)",
                      fontSize: "14px",
                      outline: "none",
                      resize: "none",
                      lineHeight: "1.6"
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button 
                    onClick={handleSave}
                    className="primaryAction"
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "10px",
                      borderRadius: "10px",
                      fontSize: "13px"
                    }}
                  >
                    <Save size={14} /> Save Info
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    style={{
                      flex: 1,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "10px",
                      color: "var(--text-main)",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Stats Summary Panel */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "10px",
              marginTop: "40px",
              paddingTop: "30px",
              borderTop: "1px solid rgba(255,255,255,0.06)"
            }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <FileText size={20} style={{ color: "var(--color-primary)", marginBottom: "8px" }} />
                <span style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-main)" }}>
                  {papers.length}
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Workspace Papers</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <GitCompare size={20} style={{ color: "var(--color-primary)", marginBottom: "8px" }} />
                <span style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-main)" }}>
                  {papers.length >= 2 ? Math.floor(papers.length / 2) : 0}
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Matrices Ran</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <MessageSquare size={20} style={{ color: "var(--color-primary)", marginBottom: "8px" }} />
                <span style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-main)" }}>
                  {papers.length > 0 ? papers.length * 3 : 0}
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>AI Chat Queries</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .profileAvatarHover {
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        }
        .profileAvatarHover:hover {
          transform: scale(1.08) rotate(3deg) !important;
          box-shadow: 0 0 25px var(--color-primary) !important;
        }
        .profileAvatarHover:hover .avatarOverlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}