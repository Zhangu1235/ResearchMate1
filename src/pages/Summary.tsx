import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import "../styles/dashboard.css";

export default function Summary() {
  return (
    <div className="dashboardPage">
      <Sidebar />

      <main className="dashboardContent">
        <Topbar />

<section className="pageHeader">

<h1>AI Summary</h1>

<p>
Generate concise summaries of uploaded research papers.
</p>

</section>

<div className="summaryCard">

<h2>Select a Paper</h2>

<button className="primaryAction">
Choose Paper
</button>

</div>

<div className="summaryOutput">

<h2>Generated Summary</h2>

<p>

Your AI generated summary will appear here after selecting a paper.

</p>

</div></main>
    </div>
  );
}