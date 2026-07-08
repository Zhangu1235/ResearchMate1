import { FileText, Trash2, ArrowRight } from "lucide-react";

interface PaperCardProps {
  title: string;
  uploaded: string;
}

export default function PaperCard({
  title,
  uploaded,
}: PaperCardProps) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "18px",
        padding: "24px",
        border: "1px solid #E5E7EB",
        boxShadow: "0 8px 20px rgba(0,0,0,.05)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: ".25s",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "18px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            background: "#EEF2FF",
            borderRadius: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FileText color="#4F46E5" size={28} />
        </div>

        <div>
          <h3
            style={{
              margin: 0,
              color: "#111827",
            }}
          >
            {title}
          </h3>

          <p
            style={{
              marginTop: "8px",
              color: "#6B7280",
              fontSize: "14px",
            }}
          >
            Uploaded {uploaded}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "15px",
        }}
      >
        <button style={buttonStyle}>
          Summary
          <ArrowRight size={16} />
        </button>

        <button style={deleteStyle}>
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  border: "none",
  padding: "12px 18px",
  borderRadius: "12px",
  background: "#EEF2FF",
  color: "#4F46E5",
  cursor: "pointer",
  fontWeight: 600,
};

const deleteStyle = {
  border: "none",
  background: "#FEF2F2",
  color: "#DC2626",
  width: "48px",
  borderRadius: "12px",
  cursor: "pointer",
};