import {
  FileText,
  GitCompare,
  BrainCircuit,
  Lightbulb,
} from "lucide-react";

export default function WorkspaceCard() {
  return (
    <aside className="workspaceCard">

      <h2>Today's Workspace</h2>

      <div className="workspaceStat">
        <FileText size={18}/>
        <span>Uploaded Papers</span>
        <strong>0</strong>
      </div>

      <div className="workspaceStat">
        <GitCompare size={18}/>
        <span>Comparisons</span>
        <strong>0</strong>
      </div>

      <div className="workspaceStat">
        <BrainCircuit size={18}/>
        <span>Research Gaps</span>
        <strong>0</strong>
      </div>

      <div className="workspaceTip">

        <Lightbulb size={20}/>

        <div>

          <h3>Tip of the Day</h3>

          <p>
            Upload at least two research papers to unlock AI comparison.
          </p>

        </div>

      </div>

    </aside>
  );
}