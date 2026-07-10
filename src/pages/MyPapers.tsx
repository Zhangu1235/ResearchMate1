import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

import {
  FileText,
  Eye,
  Trash2,
  GitCompare,
} from "lucide-react";

import "../styles/dashboard.css";

const papers = [
  {
    title: "Attention Is All You Need.pdf",
    author: "Ashish Vaswani et al.",
    uploaded: "Uploaded Today",
  },
  {
    title: "BERT Research.pdf",
    author: "Jacob Devlin et al.",
    uploaded: "Uploaded Yesterday",
  },
];

export default function MyPapers() {
  return (
    <div className="dashboardPage">

      <Sidebar />

      <main className="dashboardContent">

        <Topbar />

        <section className="pageHeader">

          <h1>My Papers</h1>

          <p>
            View and manage all uploaded research papers.
          </p>

        </section>

        <section className="paperGrid">

          {papers.map((paper) => (

            <div
              className="paperCard"
              key={paper.title}
            >

              <div className="paperIcon">

                <FileText size={32} />

              </div>

              <h2>{paper.title}</h2>

              <p>{paper.author}</p>

              <span>{paper.uploaded}</span>

              <div className="paperButtons">

                <button>

                  <Eye size={18} />

                  View

                </button>

                <button>

                  <GitCompare size={18} />

                  Compare

                </button>

                <button className="deleteButton">

                  <Trash2 size={18} />

                  Delete

                </button>

              </div>

            </div>

          ))}

        </section>

      </main>

    </div>
  );
}