import { Upload, FileUp } from "lucide-react";

export default function UploadSection() {
  return (
    <section
      style={{
        padding: "0 50px 50px",
      }}
    >
      <div
        style={{
          background: "white",
          border: "2px dashed #C7D2FE",
          borderRadius: "24px",
          padding: "60px",
          textAlign: "center",
          boxShadow: "0 8px 25px rgba(0,0,0,.05)",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "#EEF2FF",
            margin: "0 auto 25px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Upload size={34} color="#4F46E5" />
        </div>

        <h2
          style={{
            marginBottom: "10px",
            color: "#111827",
          }}
        >
          Upload Research Papers
        </h2>

        <p
          style={{
            color: "#6B7280",
            marginBottom: "30px",
            fontSize: "16px",
          }}
        >
          Drag and drop one or more PDF research papers or browse
          your device.
        </p>

        <button
          style={{
            background: "#4F46E5",
            color: "white",
            border: "none",
            padding: "15px 28px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FileUp size={18} />
          Browse Files
        </button>
      </div>
    </section>
  );
}