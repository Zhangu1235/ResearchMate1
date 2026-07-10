import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import "../styles/dashboard.css";

export default function Compare() {
  return (
    <div className="dashboardPage">
      <Sidebar />

      <main className="dashboardContent">
        <Topbar />

<section className="pageHeader">
  <h1>Compare Research Papers</h1>
  <p>
    Select two or more uploaded papers and let ResearchMate identify
    similarities, differences and key findings.
  </p>
</section>

<section className="compareContainer">

  <div className="compareCard">

    <h2>Paper 1</h2>

    <button className="primaryAction">
      Select Paper
    </button>

  </div>

  <div className="compareCard">

    <h2>Paper 2</h2>

    <button className="primaryAction">
      Select Paper
    </button>

  </div>

</section>

<div className="compareButtonWrapper">

  <button className="primaryAction">
    Compare Papers
  </button>

</div>

<section className="compareResult">

  <h2>Comparison Result</h2>

  <p>
    Select papers to generate an AI comparison.
  </p>

</section>
</main>
    </div>
  );
}