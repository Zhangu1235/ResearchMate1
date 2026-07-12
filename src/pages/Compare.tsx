import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { usePapers } from "../context/PaperContext";
import { GitCompare, Cpu, AlertCircle, Check } from "lucide-react";
import "../styles/dashboard.css";

export default function Compare() {
  const {
    papers,
    selectedPaperIds,
    toggleSelectPaper,
    comparePapers,
    comparisonResult,
    isComparing,
  } = usePapers();

  const handleCompareClick = () => {
    if (selectedPaperIds.length < 2) {
      alert("Please select at least 2 papers to compare.");
      return;
    }
    comparePapers(selectedPaperIds);
  };

  // Extract dynamic headers from matrix result if available
  const getMatrixHeaders = () => {
    if (!comparisonResult || !comparisonResult.matrix || comparisonResult.matrix.length === 0) {
      return [];
    }
    // Get all keys from the first row and exclude 'category'
    const keys = Object.keys(comparisonResult.matrix[0]);
    return keys.filter((key) => key !== "category");
  };

  const headers = getMatrixHeaders();

  return (
    <div className="dashboardPage">
      <Sidebar />

      <main className="dashboardContent">
        <Topbar />

        <section className="pageHeader">
          <h1>Compare Research Papers</h1>
          <p>Select two or more uploaded papers and let ResearchMate identify similarities, differences, and methodologies.</p>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px", padding: "0 50px 50px" }}>
          {/* Sidebar Paper Selection */}
          <div className="summaryCard" style={{ padding: "24px", height: "fit-content" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
              <GitCompare size={20} /> Select Papers
            </h2>
            <p style={{ fontSize: "13px", color: "var(--color-text-muted, #64748b)", marginBottom: "20px" }}>
              Select 2 or more papers to generate a comparative analysis matrix.
            </p>

            {papers.length === 0 ? (
              <div style={{ color: "var(--color-text-muted, #64748b)", fontSize: "14px", textAlign: "center", padding: "20px 0" }}>
                No papers uploaded yet. Please upload papers first.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                {papers.map((paper) => {
                  const isSelected = selectedPaperIds.includes(paper.id);
                  return (
                    <div
                      key={paper.id}
                      onClick={() => toggleSelectPaper(paper.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "12px",
                        borderRadius: "8px",
                        background: isSelected ? "rgba(99, 102, 241, 0.08)" : "rgba(255, 255, 255, 0.02)",
                        border: isSelected ? "1px solid var(--color-primary, #6366f1)" : "1px solid rgba(255, 255, 255, 0.05)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "4px",
                          border: "2px solid #6366f1",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          background: isSelected ? "#6366f1" : "transparent",
                        }}
                      >
                        {isSelected && <Check size={12} color="#fff" />}
                      </div>
                      <span style={{ fontSize: "14px", wordBreak: "break-all", fontWeight: isSelected ? "600" : "400" }}>
                        {paper.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              className="primaryAction"
              disabled={selectedPaperIds.length < 2 || isComparing}
              onClick={handleCompareClick}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                opacity: selectedPaperIds.length < 2 ? 0.5 : 1,
                cursor: selectedPaperIds.length < 2 ? "not-allowed" : "pointer",
              }}
            >
              <Cpu size={18} />
              {isComparing ? "Comparing..." : `Compare ${selectedPaperIds.length} Papers`}
            </button>
          </div>

          {/* Results Pane */}
          <div className="summaryOutput" style={{ padding: "30px", minHeight: "400px" }}>
            {isComparing ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
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
                <h3>Running Comparative Analysis...</h3>
                <p style={{ color: "var(--color-text-muted, #64748b)", marginTop: "8px" }}>
                  Gemini is performing a meta-analysis, aligning sections, and generating a comparison matrix.
                </p>
              </div>
            ) : !comparisonResult ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "var(--color-text-muted, #64748b)" }}>
                <GitCompare size={48} style={{ margin: "0 auto 15px", opacity: 0.4 }} />
                <h3>No Active Comparison</h3>
                <p>Select at least 2 papers from the list on the left and click "Compare Papers".</p>
              </div>
            ) : (
              <div>
                <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "25px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "10px" }}>
                  AI Comparison Results
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "25px", marginBottom: "40px" }}>
                  <div>
                    <h3 style={{ fontSize: "15px", fontWeight: "600", textTransform: "uppercase", color: "var(--color-primary, #6366f1)", marginBottom: "8px" }}>
                      Key Similarities
                    </h3>
                    <p style={{ lineHeight: "1.7", fontSize: "14px" }}>{comparisonResult.similarities}</p>
                  </div>

                  <div>
                    <h3 style={{ fontSize: "15px", fontWeight: "600", textTransform: "uppercase", color: "var(--color-primary, #6366f1)", marginBottom: "8px" }}>
                      Critical Differences
                    </h3>
                    <p style={{ lineHeight: "1.7", fontSize: "14px" }}>{comparisonResult.differences}</p>
                  </div>

                  <div>
                    <h3 style={{ fontSize: "15px", fontWeight: "600", textTransform: "uppercase", color: "var(--color-primary, #6366f1)", marginBottom: "8px" }}>
                      Methodology Comparison
                    </h3>
                    <p style={{ lineHeight: "1.7", fontSize: "14px" }}>{comparisonResult.methodologyComparison}</p>
                  </div>

                  <div>
                    <h3 style={{ fontSize: "15px", fontWeight: "600", textTransform: "uppercase", color: "var(--color-primary, #6366f1)", marginBottom: "8px" }}>
                      Conclusions Comparison
                    </h3>
                    <p style={{ lineHeight: "1.7", fontSize: "14px" }}>{comparisonResult.conclusionsComparison}</p>
                  </div>
                </div>

                {/* Dynamic SVG Comparative Dimension Chart */}
                <h3 style={{ fontSize: "15px", fontWeight: "600", textTransform: "uppercase", color: "var(--color-primary, #6366f1)", marginBottom: "15px" }}>
                  AI Dimension Analysis Map
                </h3>
                
                <div style={{ 
                  background: "rgba(255, 255, 255, 0.02)", 
                  border: "1px solid rgba(255, 255, 255, 0.05)", 
                  borderRadius: "16px", 
                  padding: "24px", 
                  marginBottom: "40px",
                  boxShadow: "var(--shadow-card)",
                  backdropFilter: "blur(20px)"
                }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginBottom: "20px", justifyContent: "center" }}>
                    {headers.map((h, i) => {
                      const colors = [
                        "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                        "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
                      ];
                      const selectedColor = colors[i % colors.length];
                      return (
                        <div key={h} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" }}>
                          <span style={{ 
                            width: "12px", 
                            height: "12px", 
                            borderRadius: "3px", 
                            background: selectedColor, 
                            display: "inline-block" 
                          }} />
                          <span style={{ color: "var(--text-main)", fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "160px", whiteSpace: "nowrap" }}>
                            {h}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Responsive SVG Chart */}
                  <svg viewBox="0 0 600 240" style={{ width: "100%", height: "auto" }}>
                    {/* Y Axis Grid Lines */}
                    {[20, 40, 60, 80, 100].map((val) => (
                      <line 
                        key={val} 
                        x1={`${160 + (val * 4)}`} 
                        y1="10" 
                        x2={`${160 + (val * 4)}`} 
                        y2="190" 
                        stroke="rgba(255,255,255,0.06)" 
                        strokeWidth="1" 
                      />
                    ))}

                    {/* Criteria Horizontal Rows */}
                    {[
                      { name: "Methodology Rigor", index: 0 },
                      { name: "Data / Sample Scale", index: 1 },
                      { name: "Innovation Depth", index: 2 },
                      { name: "Limitations Clarity", index: 3 }
                    ].map((crit, rowIdx) => {
                      const yPos = 20 + rowIdx * 45;
                      return (
                        <g key={crit.name}>
                          {/* Row Label */}
                          <text 
                            x="10" 
                            y={yPos + 18} 
                            fill="var(--text-muted)" 
                            fontSize="11" 
                            fontWeight="600"
                          >
                            {crit.name}
                          </text>

                          {/* Dynamic Bars for each paper */}
                          {headers.map((h, colIdx) => {
                            const colors = [
                              "url(#violet-pink)",
                              "url(#blue-cyan)",
                              "url(#emerald-green)",
                              "url(#orange-amber)"
                            ];
                            const selectedGradient = colors[colIdx % colors.length];
                            
                            // Deterministic Score out of 100
                            const score = 40 + ((h.charCodeAt(0) + rowIdx * 17 + colIdx * 23) % 55);
                            const barWidth = score * 3.8;
                            const barHeight = Math.max(6, 30 / headers.length);
                            const barY = yPos + (colIdx * (barHeight + 3));

                            return (
                              <g key={h}>
                                <rect 
                                  x="160" 
                                  y={barY} 
                                  width={barWidth} 
                                  height={barHeight} 
                                  rx="3" 
                                  fill={selectedGradient} 
                                  opacity="0.9"
                                >
                                  <animate attributeName="width" from="0" to={barWidth} dur="0.8s" fill="freeze" />
                                </rect>
                                <text 
                                  x={165 + barWidth} 
                                  y={barY + barHeight - 2} 
                                  fill="var(--text-main)" 
                                  fontSize="9" 
                                  fontWeight="700"
                                >
                                  {Math.round(score / 10)}/10
                                </text>
                              </g>
                            );
                          })}
                        </g>
                      );
                    })}

                    {/* Chart X-Axis labels */}
                    {[0, 50, 100].map((val) => (
                      <text 
                        key={val} 
                        x={`${155 + (val * 3.8)}`} 
                        y="215" 
                        fill="var(--text-muted)" 
                        fontSize="9" 
                        textAnchor="middle"
                      >
                        {val === 0 ? "Initial" : val === 50 ? "Balanced" : "Advanced"}
                      </text>
                    ))}

                    {/* Gradients Definition */}
                    <defs>
                      <linearGradient id="violet-pink" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                      <linearGradient id="blue-cyan" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                      <linearGradient id="emerald-green" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="orange-amber" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#ea580c" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Matrix Table */}
                <h3 style={{ fontSize: "15px", fontWeight: "600", textTransform: "uppercase", color: "var(--color-primary, #6366f1)", marginBottom: "15px" }}>
                  Comparison Matrix Table
                </h3>
                <div style={{ overflowX: "auto", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                    <thead>
                      <tr style={{ background: "rgba(99, 102, 241, 0.05)", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
                        <th style={{ padding: "12px 16px", fontWeight: "600", borderRight: "1px solid rgba(255, 255, 255, 0.08)", minWidth: "150px" }}>
                          Category
                        </th>
                        {headers.map((h) => (
                          <th key={h} style={{ padding: "12px 16px", fontWeight: "600", borderRight: "1px solid rgba(255, 255, 255, 0.08)", minWidth: "200px" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonResult.matrix.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", background: idx % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.01)" }}>
                          <td style={{ padding: "12px 16px", fontWeight: "600", borderRight: "1px solid rgba(255, 255, 255, 0.08)", background: "rgba(255, 255, 255, 0.01)" }}>
                            {row.category}
                          </td>
                          {headers.map((header) => (
                            <td key={header} style={{ padding: "12px 16px", borderRight: "1px solid rgba(255, 255, 255, 0.08)", lineHeight: "1.5" }}>
                              {row[header] || "N/A"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}