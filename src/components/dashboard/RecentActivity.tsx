import { Activity, FileText } from "lucide-react";
import { usePapers } from "../../context/PaperContext";
import { useNavigate } from "react-router-dom";

export default function RecentActivity() {
  const { papers } = usePapers();
  const navigate = useNavigate();

  return (
    <section
      style={{
        padding: "0 50px 60px",
      }}
    >
      <h2
        style={{
          fontSize: "28px",
          fontWeight: 700,
          color: "var(--text-main)",
          marginBottom: "24px",
        }}
      >
        Recent Activity
      </h2>

      {papers.length === 0 ? (
        <div
          style={{
            background: "var(--bg-card)",
            border: "var(--border-card)",
            borderRadius: "20px",
            padding: "35px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            boxShadow: "var(--shadow-card)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "var(--color-primary-light)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0,
              color: "var(--color-primary)",
            }}
          >
            <Activity size={28} />
          </div>

          <div>
            <h3
              style={{
                margin: 0,
                marginBottom: "8px",
                fontSize: "20px",
                color: "var(--text-main)",
              }}
            >
              No Recent Activity
            </h3>

            <p
              style={{
                margin: 0,
                color: "var(--text-muted)",
                lineHeight: "1.8",
              }}
            >
              Upload your first research paper to begin using ResearchMate. Your uploads, AI summaries, paper comparisons and discovered research gaps will appear here as you work.
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {papers.slice(0, 3).map((paper) => (
            <div
              key={paper.id}
              onClick={() => navigate("/papers")}
              style={{
                background: "var(--bg-card)",
                border: "var(--border-card)",
                borderRadius: "16px",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "var(--shadow-card)",
                cursor: "pointer",
                backdropFilter: "blur(20px)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "10px",
                    background: "var(--color-primary-light)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "var(--color-primary)",
                  }}
                >
                  <FileText size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "16px", color: "var(--text-main)", fontWeight: "600" }}>
                    Uploaded "{paper.name}"
                  </h4>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--text-muted)" }}>
                    Size: {(paper.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  opacity: 0.8,
                }}
              >
                Just now
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}