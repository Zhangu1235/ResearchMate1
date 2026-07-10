import {
  House,
  FileText,
  Upload,
  GitCompare,
  BrainCircuit,
  MessageSquare,
  User,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { icon: <House size={20} />, label: "Dashboard", path: "/dashboard" },
    { icon: <FileText size={20} />, label: "My Papers", path: "/papers" },
    { icon: <Upload size={20} />, label: "Upload", path: "/upload" },
    { icon: <GitCompare size={20} />, label: "Compare", path: "/compare" },
    { icon: <BrainCircuit size={20} />, label: "AI Summary", path: "/summary" },
    { icon: <MessageSquare size={20} />, label: "Ask AI", path: "/chat" },
    { icon: <User size={20} />, label: "Profile", path: "/profile" },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logoCircle">R</div>

        <div>
          <h2>ResearchMate</h2>
          <span>AI Workspace</span>
        </div>
      </div>

      <nav>
        {items.map((item) => (
          <button
            key={item.label}
            className={`sidebarItem ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}