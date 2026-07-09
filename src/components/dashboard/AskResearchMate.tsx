import { Send } from "lucide-react";

export default function AskResearchMate() {
  return (
    <section
      style={{
        padding: "0 50px 60px",
      }}
    >
      <h2
        style={{
          marginBottom: "25px",
        }}
      >
        Ask ResearchMate
      </h2>

      <div
        style={{
          background: "white",
          borderRadius: "22px",
          padding: "35px",
          border: "1px solid #E5E7EB",
        }}
      >
        <textarea
          placeholder="Ask a question across all uploaded research papers..."
          style={{
            width: "100%",
            height: "120px",
            resize: "none",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            padding: "18px",
            fontSize: "16px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        <button
          disabled
          style={{
            marginTop: "20px",
            background: "#4F46E5",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "15px 25px",
            cursor: "not-allowed",
            opacity: .6,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Send size={18} />
          Ask ResearchMate
        </button>

        <p
          style={{
            marginTop: "15px",
            color: "#6B7280",
          }}
        >
          This feature will become available after backend integration.
        </p>
      </div>
    </section>
  );
}