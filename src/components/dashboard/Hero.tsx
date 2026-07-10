import { Upload, Sparkles } from "lucide-react";

export default function Hero() {

  return (

    <section className="heroCard">

      <div className="heroBadge">

        AI Research Workspace

      </div>

      <h1>

        Welcome back,

      </h1>

      <h2>

        {localStorage.getItem("username") || "Researcher"} 👋

      </h2>

      <p>

        Upload papers, compare findings and discover research gaps using AI.

      </p>

      <div className="heroButtons">

        <button className="primaryBtn">

          <Upload size={18}/>

          Upload Paper

        </button>

        <button className="secondaryBtn">

          <Sparkles size={18}/>

          Ask AI

        </button>

      </div>

    </section>

  );

}