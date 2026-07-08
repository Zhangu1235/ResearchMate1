import { Activity } from "lucide-react";

export default function RecentActivity() {
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
          color: "#111827",
          marginBottom: "24px",
        }}
      >
        Recent Activity
      </h2>

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderRadius: "20px",
          padding: "35px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "#EEF2FF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <Activity
            size={28}
            color="#4F46E5"
          />
        </div>

        <div>
          <h3
            style={{
              margin: 0,
              marginBottom: "8px",
              fontSize: "20px",
              color: "#111827",
            }}
          >
            No Recent Activity
          </h3>

          <p
            style={{
              margin: 0,
              color: "#6B7280",
              lineHeight: "1.8",
            }}
          >
            Upload your first research paper to begin using ResearchMate.
            Your uploads, AI summaries, paper comparisons and discovered
            research gaps will appear here as you work.
          </p>
        </div>
      </div>
    </section>
  );
}