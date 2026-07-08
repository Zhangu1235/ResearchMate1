import { ArrowRight } from "lucide-react";

interface LandingProps {
  next: () => void;
}

export default function Landing({ next }: LandingProps) {
  return (
    <div
      style={{
        height: "100vh",
        background: "#FAFBFF",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "88px",
          fontWeight: 800,
          margin: 0,
          color: "#101828",
        }}
      >
        Research
        <span
          style={{
            background:
              "linear-gradient(135deg,#4F46E5,#8B5CF6)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Mate
        </span>
      </h1>

      <p
        style={{
          marginTop: "18px",
          fontSize: "22px",
          color: "#667085",
        }}
      >
        Analyze. Compare. Discover.
      </p>

      <button
        onClick={next}
        style={{
          marginTop: "70px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
          color: "#4F46E5",
          fontWeight: 600,
        }}
      >
        Explore

        <div
          style={{
            width: "55px",
            height: "55px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg,#4F46E5,#8B5CF6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            boxShadow: "0 15px 35px rgba(79,70,229,.25)",
          }}
        >
          <ArrowRight size={24} />
        </div>
      </button>
    </div>
  );
}