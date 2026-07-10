import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import "../styles/dashboard.css";

export default function Upload() {
  return (
    <div className="dashboardPage">
      <Sidebar />

      <main className="dashboardContent">
        <Topbar />

<section className="pageHeader">
  <h1>Upload Research Papers</h1>
  <p>
    Upload PDF research papers to summarize, compare and discover
    research gaps using AI.
  </p>
</section>

<section className="uploadArea">

  <div className="uploadDrop">

    <div className="uploadIcon">
      📄
    </div>

    <h2>Drag & Drop PDF Files</h2>

    <p>
      or click below to browse your computer
    </p>

    <button className="primaryAction">
      Browse Files
    </button>

  </div>

</section>

<section className="uploadedFiles">

  <h2>Recently Uploaded</h2>

  <div className="emptyState">

    <h3>No Papers Yet</h3>

    <p>
      Your uploaded research papers will appear here.
    </p>

  </div>

</section>
</main>
    </div>
  );
}