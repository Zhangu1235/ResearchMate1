import { useRef } from "react";
import { Upload, FileUp } from "lucide-react";
import { usePapers } from "../../context/PaperContext";
import { useNavigate } from "react-router-dom";

export default function UploadSection() {
  const { uploadPaper, isUploading } = usePapers();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        alert("Please upload a PDF file.");
        return;
      }
      await uploadPaper(file);
      navigate("/papers");
    }
  };

  const triggerBrowse = () => {
    fileInputRef.current?.click();
  };

  return (
    <section
      style={{
        padding: "0 50px 50px",
      }}
    >
      <div
        onClick={!isUploading ? triggerBrowse : undefined}
        style={{
          background: "var(--bg-card)",
          border: "2px dashed var(--color-primary-light)",
          borderRadius: "24px",
          padding: "60px",
          textAlign: "center",
          boxShadow: "var(--shadow-card)",
          cursor: isUploading ? "not-allowed" : "pointer",
          backdropFilter: "blur(20px)",
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,application/pdf"
          style={{ display: "none" }}
        />
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "var(--color-primary-light)",
            margin: "0 auto 25px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "var(--color-primary)",
          }}
        >
          <Upload size={34} />
        </div>

        <h2
          style={{
            marginBottom: "10px",
            color: "var(--text-main)",
          }}
        >
          {isUploading ? "Uploading & Processing..." : "Upload Research Papers"}
        </h2>

        <p
          style={{
            color: "var(--text-muted)",
            marginBottom: "30px",
            fontSize: "16px",
          }}
        >
          {isUploading
            ? "Please wait while we extract the paper structure..."
            : "Click here to browse your device or drop a PDF research paper."}
        </p>

        {!isUploading && (
          <button
            type="button"
            className="primaryAction"
            style={{
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
        )}
      </div>
    </section>
  );
}