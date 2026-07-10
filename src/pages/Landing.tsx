import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="landingGradient" aria-hidden="true" />
      <div className="landingGlow landingGlowTop" aria-hidden="true" />
      <div className="landingGlow landingGlowBottom" aria-hidden="true" />
      <div className="auroraField" aria-hidden="true" />

      <div className="sparkleLayer" aria-hidden="true">
        <span className="spark sparkleOne" />
        <span className="spark sparkleTwo" />
        <span className="spark sparkleThree" />
        <span className="spark sparkleFour" />
        <span className="spark sparkleFive" />
      </div>

      <div className="researchGraph" aria-hidden="true">
        <span className="graphLine lineOne" />
        <span className="graphLine lineTwo" />
        <span className="graphLine lineThree" />
        <span className="graphLine lineFour" />
        <span className="graphLine lineFive" />
        <span className="graphLine lineSix" />
        <span className="graphLine lineSeven" />
        <span className="graphLine lineEight" />

        <span className="graphNode nodeOne" />
        <span className="graphNode nodeTwo" />
        <span className="graphNode nodeThree" />
        <span className="graphNode nodeFour" />
        <span className="graphNode nodeFive" />
        <span className="graphNode nodeSix" />
        <span className="graphNode nodeSeven" />
        <span className="graphNode nodeEight" />
      </div>

      <div className="glassCard">
        <div className="badge">AI Research Workspace</div>

        <h1>
          Research<span>Mate</span>
        </h1>

        <p>
          Compare research papers, generate intelligent summaries,
          discover research gaps and chat with your papers,
          all inside one beautifully designed workspace.
        </p>

        <button
          className="enterButton"
          onClick={() => navigate("/login")}
          type="button"
          aria-label="Enter ResearchMate"
        >
          <ArrowRight size={30} />
        </button>
      </div>
    </div>
  );
}