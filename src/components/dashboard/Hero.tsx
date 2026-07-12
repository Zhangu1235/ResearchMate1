import React from "react";
import { Upload, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="sellixHero">
      {/* Dynamic Starry Sky Background */}
      <div className="starsContainer">
        <div className="stars-small"></div>
        <div className="stars-medium"></div>
        <div className="stars-large"></div>
      </div>

      {/* Massive Glowing Sellix-style Sphere */}
      <div className="sellixSphereContainer">
        <div className="sellixSphere"></div>
        <div className="sellixSphereGlow"></div>
      </div>

      {/* Hero Content Panel */}
      <div className="heroContent">
        <div className="heroBadge">
          <Sparkles size={12} style={{ marginRight: "6px" }} />
          Gemini AI Core v2.0
        </div>
        <h1>
          Cross-Paper <span>Synthesis</span>
        </h1>
        <p>
          Analyze, compare, and identify research gaps across multiple scientific publications instantly.
        </p>
        <div className="heroButtons">
          <button className="sellixPrimaryBtn" onClick={() => navigate("/upload")}>
            <Upload size={16} />
            Upload Papers
          </button>
          <button className="sellixSecondaryBtn" onClick={() => navigate("/chat")}>
            <Sparkles size={16} />
            Ask AI Assistant
          </button>
        </div>
      </div>
    </section>
  );
}