import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { usePapers } from "../context/PaperContext";
import { FileText, Cpu, AlertCircle, Calendar, User } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import "../styles/dashboard.css";

export default function Summary() {
  const { papers, summarizePaper } = usePapers();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryId = searchParams.get("id") || "";
  const [selectedPaperId, setSelectedPaperId] = useState<string>(queryId);

  React.useEffect(() => {
    if (queryId) {
      setSelectedPaperId(queryId);
    }
  }, [queryId]);

  const selectedPaper = papers.find((p) => p.id === selectedPaperId);

  const handleGenerateSummary = async () => {
    if (selectedPaperId) {
      await summarizePaper(selectedPaperId);
    }
  };

  return (
    <div className="dashboardPage">
      <Sidebar />

      <main className="dashboardContent">
        <Topbar />

        <section className="pageHeader">
          <h1>AI Summary</h1>
          <p>Generate and view comprehensive, structured summaries of your research papers using Gemini AI.</p>
        </section>

        <div className="summaryCard" style={{ padding: "24px", marginBottom: "24px" }}>
          <h2 style={{ marginBottom: "15px", fontSize: "18px", color: "var(--color-text, #1e293b)" }}>
            Select a Research Paper
          </h2>

          <div style={{ display: "flex", gap: "12px", width: "100%", maxWidth: "600px" }}>
            <select
              value={selectedPaperId}
              onChange={(e) => setSelectedPaperId(e.target.value)}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--border-color, rgba(255, 255, 255, 0.1))",
                background: "var(--bg-select, rgba(255, 255, 255, 0.05))",
                color: "inherit",
                fontSize: "14px",
                outline: "none",
              }}
            >
              <option value="" style={{ color: "#000" }}>-- Choose an Uploaded Paper --</option>
              {papers.map((p) => (
                <option key={p.id} value={p.id} style={{ color: "#000" }}>
                  {p.name}
                </option>
              ))}
            </select>

            {selectedPaper && !selectedPaper.summary && !selectedPaper.isSummarizing && (
              <button
                className="primaryAction"
                onClick={handleGenerateSummary}
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 24px" }}
              >
                <Cpu size={16} /> Generate Summary
              </button>
            )}
          </div>
        </div>

        <div className="summaryOutput" style={{ padding: "30px" }}>
          {!selectedPaper ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--color-text-muted, #64748b)" }}>
              <FileText size={48} style={{ margin: "0 auto 15px", opacity: 0.4 }} />
              <h3>No Paper Selected</h3>
              <p>Choose a paper from the list above to view its AI summary.</p>
            </div>
          ) : selectedPaper.isSummarizing ? (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
              <div
                className="spinner"
                style={{
                  width: "40px",
                  height: "40px",
                  border: "4px solid rgba(99, 102, 241, 0.1)",
                  borderTopColor: "var(--color-primary, #6366f1)",
                  borderRadius: "50%",
                  margin: "0 auto 20px",
                  animation: "spin 1s linear infinite",
                }}
              />
              <h3>Generating Summary...</h3>
              <p style={{ color: "var(--color-text-muted, #64748b)", marginTop: "8px" }}>
                AI is reading paper text and synthesizing core insights. This may take 5-10 seconds.
              </p>
            </div>
          ) : selectedPaper.error ? (
            <div style={{ color: "#ef4444", display: "flex", gap: "10px", alignItems: "center", padding: "20px 0" }}>
              <AlertCircle size={24} />
              <div>
                <h4 style={{ margin: 0 }}>Failed to Generate Summary</h4>
                <p style={{ margin: "4px 0 0", fontSize: "14px" }}>
                  {selectedPaper.error === "This paper's content is not loaded in memory. Please upload it again to summarize."
                    ? "This paper was loaded from a previous session. Please delete and re-upload the PDF to allow text extraction."
                    : selectedPaper.error}
                </p>
                <button
                  className="primaryAction"
                  onClick={handleGenerateSummary}
                  style={{ marginTop: "12px", padding: "6px 12px", fontSize: "13px" }}
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : selectedPaper.summary ? (
            <div className="aiSummaryResult">
              <h1 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "10px", lineHeight: "1.3" }}>
                {selectedPaper.summary.title}
              </h1>

              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  marginBottom: "25px",
                  color: "var(--color-text-muted, #64748b)",
                  fontSize: "14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <User size={16} />
                  <span>{selectedPaper.summary.authors}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Calendar size={16} />
                  <span>{selectedPaper.summary.publicationYear}</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-primary, #6366f1)", marginBottom: "8px" }}>
                    Abstract Overview
                  </h3>
                  <p style={{ lineHeight: "1.7", fontSize: "15px" }}>{selectedPaper.summary.abstractSummary}</p>
                </div>

                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-primary, #6366f1)", marginBottom: "10px" }}>
                    Key Findings & Discoveries
                  </h3>
                  <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", lineHeight: "1.6" }}>
                    {selectedPaper.summary.keyFindings.map((finding, idx) => (
                      <li key={idx} style={{ fontSize: "15px" }}>{finding}</li>
                    ))}
                  </ul>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "25px",
                    borderTop: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
                    paddingTop: "25px",
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-primary, #6366f1)", marginBottom: "8px" }}>
                      Methodology & Approach
                    </h3>
                    <p style={{ lineHeight: "1.7", fontSize: "14px" }}>{selectedPaper.summary.methodology}</p>
                  </div>

                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-primary, #6366f1)", marginBottom: "8px" }}>
                      Conclusions & Takeaways
                    </h3>
                    <p style={{ lineHeight: "1.7", fontSize: "14px" }}>{selectedPaper.summary.conclusions}</p>
                  </div>
                </div>

                <div
                  style={{
                    borderTop: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
                    paddingTop: "25px",
                  }}
                >
                  <h3 style={{ fontSize: "16px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-primary, #6366f1)", marginBottom: "8px" }}>
                    Limitations & Future Scope
                  </h3>
                  <p style={{ lineHeight: "1.7", fontSize: "14px" }}>{selectedPaper.summary.limitations}</p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--color-text-muted, #64748b)" }}>
              <h3>Summary Not Generated Yet</h3>
              <p>Click "Generate Summary" at the top to process this paper with Gemini AI.</p>
              <button
                className="primaryAction"
                onClick={handleGenerateSummary}
                style={{ marginTop: "15px", display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <Cpu size={16} /> Generate Summary
              </button>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}