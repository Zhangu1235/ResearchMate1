import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { usePapers } from "../context/PaperContext";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Eye,
  Trash2,
  GitCompare,
  Plus,
  Brain,
} from "lucide-react";
import "../styles/dashboard.css";

export default function MyPapers() {
  const { papers, deletePaper, summarizePaper, toggleSelectPaper, selectedPaperIds } = usePapers();
  const navigate = useNavigate();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    const rx = -(y / (box.height / 2)) * 10; // Max 10 degrees rotation
    const ry = (x / (box.width / 2)) * 10;
    card.style.setProperty("--rx", `${rx}deg`);
    card.style.setProperty("--ry", `${ry}deg`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  };

  const handleSummarize = (id: string) => {
    summarizePaper(id);
    navigate("/summary");
  };

  const handleCompare = (id: string) => {
    toggleSelectPaper(id);
    navigate("/compare");
  };

  return (
    <div className="dashboardPage">
      <Sidebar />

      <main className="dashboardContent">
        <Topbar />

        <section className="pageHeader" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1>My Papers</h1>
            <p>View and manage all uploaded research papers.</p>
          </div>
          <button
            className="primaryAction"
            onClick={() => navigate("/upload")}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Plus size={18} /> Add Paper
          </button>
        </section>

        {papers.length === 0 ? (
          <div className="emptyState" style={{ marginTop: "40px" }}>
            <h3>No Papers Uploaded Yet</h3>
            <p>Go to the Upload page or click above to add your first research paper.</p>
            <button className="primaryAction" style={{ marginTop: "15px" }} onClick={() => navigate("/upload")}>
              Go to Upload
            </button>
          </div>
        ) : (
          <section className="paperGrid">
            {papers.map((paper) => (
              <div
                className="paperCard"
                key={paper.id}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <div className="paperIcon">
                  <FileText size={32} />
                </div>

                <h2 style={{ wordBreak: "break-all" }}>{paper.name}</h2>
                <p>{(paper.size / 1024 / 1024).toFixed(2)} MB</p>

                {paper.summary ? (
                  <span style={{ color: "#22c55e", background: "rgba(34, 197, 94, 0.1)", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "600", display: "inline-block", margin: "5px 0" }}>
                    ✓ Summarized
                  </span>
                ) : paper.isSummarizing ? (
                  <span style={{ color: "#eab308", background: "rgba(234, 179, 8, 0.1)", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "600", display: "inline-block", margin: "5px 0" }}>
                    ⏳ Summarizing...
                  </span>
                ) : (
                  <span style={{ color: "#94a3b8", background: "rgba(148, 163, 184, 0.1)", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "600", display: "inline-block", margin: "5px 0" }}>
                    No Summary Yet
                  </span>
                )}

                <div className="paperButtons">
                  <button onClick={() => navigate("/summary")}>
                    <Eye size={18} />
                    View Summary
                  </button>

                  <button
                    onClick={() => handleCompare(paper.id)}
                    style={{
                      borderColor: selectedPaperIds.includes(paper.id) ? "var(--color-primary, #6366f1)" : "",
                      background: selectedPaperIds.includes(paper.id) ? "rgba(99, 102, 241, 0.1)" : "",
                    }}
                  >
                    <GitCompare size={18} />
                    {selectedPaperIds.includes(paper.id) ? "Selected" : "Compare"}
                  </button>

                  <button className="deleteButton" onClick={() => deletePaper(paper.id)}>
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}