import React, { useRef, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { usePapers } from "../context/PaperContext";
import { FileText, Search, Trash2, Cpu, Calendar, User, Check, Download, Github } from "lucide-react";
import "../styles/dashboard.css";

interface ArxivPaper {
  arxiv_id: string;
  title: string;
  authors: string[];
  abstract: string;
  published_date: string;
  categories: string[];
  pdf_url: string;
  article_url: string;
}

export default function Upload() {
  const { 
    papers, 
    uploadPaper, 
    isUploading, 
    deletePaper, 
    importPaperFromArxiv, 
    importPaperFromGithub 
  } = usePapers();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab state: 'arxiv' | 'github'
  const [activeTab, setActiveTab] = useState<"arxiv" | "github">("arxiv");

  // arXiv search states
  const [searchQuery, setSearchQuery] = useState("");
  const [arxivResults, setArxivResults] = useState<ArxivPaper[]>([]);
  const [isSearchingArxiv, setIsSearchingArxiv] = useState(false);
  const [importingPaperUrl, setImportingPaperUrl] = useState<string | null>(null);

  // GitHub states
  const [githubRepoUrl, setGithubRepoUrl] = useState("");
  const [githubFiles, setGithubFiles] = useState<Array<{ path: string; size: number; downloadUrl: string }>>([]);
  const [isSearchingGithub, setIsSearchingGithub] = useState(false);
  const [importingGithubUrl, setImportingGithubUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        alert("Please upload a PDF file.");
        return;
      }
      uploadPaper(file);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        alert("Please upload a PDF file.");
        return;
      }
      uploadPaper(file);
    }
  };

  const triggerBrowse = () => {
    fileInputRef.current?.click();
  };

  // Search arXiv API on backend
  const handleArxivSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || isSearchingArxiv) return;

    setIsSearchingArxiv(true);
    setArxivResults([]);

    try {
      const response = await fetch(`/api/arxiv/search?query=${encodeURIComponent(searchQuery)}&max_results=6`);
      const data = await response.json();
      if (data.success) {
        setArxivResults(data.results);

        // Supabase integration to store searched query memories
        try {
          const { supabase } = await import("../services/supabaseClient");
          const url = ((import.meta as any).env?.VITE_SUPABASE_URL as string) || "";
          const key = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || "";
          if (url && key) {
            await supabase
              .from("search_memories")
              .insert([{
                query: searchQuery,
                results_count: data.results?.length || 0,
                created_at: new Date().toISOString()
              }]);
            console.log("Search query stored inside Supabase search_memories successfully.");
          }
        } catch (supabaseErr) {
          console.warn("Supabase memory sync skipped/configured later:", supabaseErr);
        }

      } else {
        alert(data.message || "Failed to search arXiv");
      }
    } catch (error) {
      console.error("arXiv search error:", error);
      alert("An error occurred while searching arXiv.");
    } finally {
      setIsSearchingArxiv(false);
    }
  };

  // Import paper using context download handler
  const handleImportArxiv = async (paper: ArxivPaper) => {
    if (isUploading || importingPaperUrl) return;

    setImportingPaperUrl(paper.pdf_url);
    try {
      await importPaperFromArxiv(paper.pdf_url);
    } finally {
      setImportingPaperUrl(null);
    }
  };

  // Query files in GitHub repository
  const handleGithubSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubRepoUrl.trim() || isSearchingGithub) return;

    setIsSearchingGithub(true);
    setGithubFiles([]);

    try {
      const response = await fetch("/api/github/contents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: githubRepoUrl }),
      });
      const data = await response.json();
      if (data.success) {
        setGithubFiles(data.files);
      } else {
        alert(data.message || "Failed to query repository contents.");
      }
    } catch (error) {
      console.error("GitHub search error:", error);
      alert("An error occurred while exploring the GitHub repository.");
    } finally {
      setIsSearchingGithub(false);
    }
  };

  // Import paper from GitHub raw URL CDN
  const handleImportGithub = async (file: { path: string; downloadUrl: string }) => {
    if (isUploading || importingGithubUrl) return;

    setImportingGithubUrl(file.downloadUrl);
    try {
      const filename = file.path.split("/").pop() || "github_paper.pdf";
      await importPaperFromGithub(file.downloadUrl, filename);
    } finally {
      setImportingGithubUrl(null);
    }
  };

  return (
    <div className="dashboardPage">
      <Sidebar />

      <main className="dashboardContent">
        <Topbar />

        <section className="pageHeader">
          <h1>Import Research Papers</h1>
          <p>
            Upload local PDFs or search official databases like arXiv.org and GitHub repositories to load papers into your workspace.
          </p>
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", padding: "0 50px 30px" }}>
          
          {/* Left Panel: Local File Upload & Recently Uploaded List */}
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "15px" }}>Local File Upload</h2>
            
            <div
              className={`uploadDrop ${isUploading ? "uploading" : ""}`}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onClick={!isUploading ? triggerBrowse : undefined}
              style={{
                cursor: isUploading ? "not-allowed" : "pointer",
                padding: "40px",
                border: "2px dashed var(--border-color, rgba(255, 255, 255, 0.1))",
                borderRadius: "16px",
                textAlign: "center",
                background: "var(--bg-card, rgba(255, 255, 255, 0.02))",
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,application/pdf"
                style={{ display: "none" }}
              />
              <div className="uploadIcon" style={{ fontSize: "28px", marginBottom: "10px" }}>
                {isUploading ? "⏳" : "📁"}
              </div>
              <h3 style={{ fontSize: "15px", margin: "0 0 5px" }}>
                {isUploading ? "Uploading & Processing..." : "Drag & Drop PDF here"}
              </h3>
              <p style={{ fontSize: "12px", color: "var(--color-text-muted, #94a3b8)", margin: "0 0 15px" }}>
                Supports research papers up to 15MB
              </p>
              {!isUploading && <button className="primaryAction" type="button" style={{ padding: "8px 16px", fontSize: "13px" }}>Browse Files</button>}
            </div>

            <h2 style={{ fontSize: "18px", fontWeight: "600", marginTop: "30px", marginBottom: "15px" }}>Recently Uploaded</h2>
            {papers.length === 0 ? (
              <div className="emptyState" style={{ padding: "30px" }}>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--color-text-muted, #94a3b8)" }}>No papers loaded yet.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "350px", overflowY: "auto", paddingRight: "5px" }}>
                {papers.map((paper) => (
                  <div
                    key={paper.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      background: "var(--bg-card, rgba(255, 255, 255, 0.03))",
                      border: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
                      borderRadius: "8px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
                      <FileText size={18} style={{ color: "var(--color-primary, #6366f1)", flexShrink: 0 }} />
                      <div style={{ overflow: "hidden" }}>
                        <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "600", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                          {paper.name}
                        </h4>
                        <span style={{ fontSize: "11px", color: "var(--color-text-muted, #94a3b8)" }}>
                          {(paper.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deletePaper(paper.id)}
                      style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "5px" }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel: Dynamic Tabs Switcher (arXiv vs GitHub) */}
          <div style={{ borderLeft: "1px solid rgba(255, 255, 255, 0.08)", paddingLeft: "30px" }}>
            
            {/* Tab switch panel */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "25px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "10px" }}>
              <button 
                onClick={() => setActiveTab("arxiv")}
                style={{
                  background: activeTab === "arxiv" ? "var(--color-primary-light)" : "transparent",
                  border: "none",
                  color: activeTab === "arxiv" ? "var(--color-primary)" : "var(--text-muted)",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.25s ease"
                }}
              >
                arXiv.org Database
              </button>
              <button 
                onClick={() => setActiveTab("github")}
                style={{
                  background: activeTab === "github" ? "var(--color-primary-light)" : "transparent",
                  border: "none",
                  color: activeTab === "github" ? "var(--color-primary)" : "var(--text-muted)",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.25s ease"
                }}
              >
                GitHub Repositories
              </button>
            </div>

            {activeTab === "arxiv" ? (
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "15px" }}>Search arXiv.org</h2>
                
                <form onSubmit={handleArxivSearch} style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                  <div style={{ flex: 1, position: "relative" }}>
                    <Search size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--color-text-muted, #94a3b8)" }} />
                    <input
                      type="text"
                      placeholder="e.g. Attention mechanism, GAN, BERT..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 10px 10px 36px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-color, rgba(255, 255, 255, 0.1))",
                        background: "var(--bg-select, rgba(255, 255, 255, 0.05))",
                        color: "inherit",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                  <button className="primaryAction" type="submit" disabled={isSearchingArxiv} style={{ padding: "0 20px" }}>
                    {isSearchingArxiv ? "Searching..." : "Search"}
                  </button>
                </form>

                <div style={{ maxHeight: "500px", overflowY: "auto", paddingRight: "5px", display: "flex", flexDirection: "column", gap: "15px" }}>
                  {isSearchingArxiv ? (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <div
                        className="spinner"
                        style={{
                          width: "30px",
                          height: "30px",
                          border: "3px solid rgba(99, 102, 241, 0.1)",
                          borderTopColor: "var(--color-primary, #6366f1)",
                          borderRadius: "50%",
                          margin: "0 auto 15px",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                      <p style={{ fontSize: "13px", color: "var(--color-text-muted, #64748b)" }}>Querying arXiv.org API...</p>
                    </div>
                  ) : arxivResults.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0", color: "var(--color-text-muted, #64748b)", background: "rgba(255, 255, 255, 0.01)", borderRadius: "8px", border: "1px dashed rgba(255, 255, 255, 0.05)" }}>
                      <p style={{ margin: 0, fontSize: "13px" }}>Search arXiv to discover and import research papers instantly.</p>
                    </div>
                  ) : (
                    arxivResults.map((result) => {
                      const isAlreadyAdded = papers.some((p) => p.name.includes(result.arxiv_id));
                      const isImporting = importingPaperUrl === result.pdf_url;
                      return (
                        <div
                          key={result.arxiv_id}
                          style={{
                            padding: "16px",
                            background: "var(--bg-card, rgba(255, 255, 255, 0.02))",
                            border: "1px solid var(--border-color, rgba(255, 255, 255, 0.06))",
                            borderRadius: "10px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          <div>
                            <h4 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: "600", lineHeight: "1.4" }}>
                              {result.title}
                            </h4>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", fontSize: "11px", color: "var(--color-text-muted, #94a3b8)" }}>
                              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                <User size={12} /> {result.authors.slice(0, 2).join(", ")} {result.authors.length > 2 && "et al."}
                              </span>
                              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                <Calendar size={12} /> {result.published_date}
                              </span>
                            </div>
                          </div>

                          <p style={{ margin: 0, fontSize: "12px", color: "var(--color-text-muted, #94a3b8)", lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {result.abstract}
                          </p>

                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px" }}>
                            <span style={{ fontSize: "11px", background: "rgba(99, 102, 241, 0.1)", color: "#6366f1", padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase" }}>
                              {result.arxiv_id}
                            </span>

                            {isAlreadyAdded ? (
                              <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#22c55e", fontWeight: "600" }}>
                                <Check size={14} /> Imported
                              </span>
                            ) : (
                              <button
                                onClick={() => handleImportArxiv(result)}
                                disabled={isUploading || !!importingPaperUrl}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  background: "var(--color-primary, #6366f1)",
                                  color: "#fff",
                                  border: "none",
                                  padding: "6px 12px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  cursor: (isUploading || !!importingPaperUrl) ? "not-allowed" : "pointer",
                                  opacity: (isUploading || !!importingPaperUrl) ? 0.6 : 1,
                                }}
                              >
                                <Download size={12} />
                                {isImporting ? "Importing..." : "Import"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "15px" }}>Import from GitHub</h2>
                
                <form onSubmit={handleGithubSearch} style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                  <div style={{ flex: 1, position: "relative" }}>
                    <Github size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--color-text-muted, #94a3b8)" }} />
                    <input
                      type="text"
                      placeholder="e.g. owner/repository-name or link"
                      value={githubRepoUrl}
                      onChange={(e) => setGithubRepoUrl(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 10px 10px 36px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-color, rgba(255, 255, 255, 0.1))",
                        background: "var(--bg-select, rgba(255, 255, 255, 0.05))",
                        color: "inherit",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                  <button className="primaryAction" type="submit" disabled={isSearchingGithub} style={{ padding: "0 20px" }}>
                    {isSearchingGithub ? "Exploring..." : "Explore"}
                  </button>
                </form>

                <div style={{ maxHeight: "500px", overflowY: "auto", paddingRight: "5px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {isSearchingGithub ? (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <div
                        className="spinner"
                        style={{
                          width: "30px",
                          height: "30px",
                          border: "3px solid rgba(99, 102, 241, 0.1)",
                          borderTopColor: "var(--color-primary, #6366f1)",
                          borderRadius: "50%",
                          margin: "0 auto 15px",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                      <p style={{ fontSize: "13px", color: "var(--color-text-muted, #64748b)" }}>Querying GitHub trees API...</p>
                    </div>
                  ) : githubFiles.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0", color: "var(--color-text-muted, #64748b)", background: "rgba(255, 255, 255, 0.01)", borderRadius: "8px", border: "1px dashed rgba(255, 255, 255, 0.05)" }}>
                      <p style={{ margin: 0, fontSize: "13px" }}>Enter a public repository (e.g. facebook/react) to explore and import PDF contents.</p>
                    </div>
                  ) : (
                    githubFiles.map((file) => {
                      const isAlreadyAdded = papers.some((p) => p.name.includes(file.path.split("/").pop() || ""));
                      const isImporting = importingGithubUrl === file.downloadUrl;
                      return (
                        <div
                          key={file.path}
                          style={{
                            padding: "14px 16px",
                            background: "var(--bg-card, rgba(255, 255, 255, 0.02))",
                            border: "1px solid var(--border-color, rgba(255, 255, 255, 0.06))",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "15px",
                          }}
                        >
                          <div style={{ overflow: "hidden" }}>
                            <h4 
                              title={file.path}
                              style={{ 
                                margin: "0 0 3px", 
                                fontSize: "13px", 
                                fontWeight: "600", 
                                textOverflow: "ellipsis", 
                                overflow: "hidden", 
                                whiteSpace: "nowrap" 
                              }}
                            >
                              {file.path}
                            </h4>
                            <span style={{ fontSize: "11px", color: "var(--color-text-muted, #94a3b8)" }}>
                              Size: {(file.size / 1024).toFixed(1)} KB
                            </span>
                          </div>

                          {isAlreadyAdded ? (
                            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#22c55e", fontWeight: "600", flexShrink: 0 }}>
                              <Check size={14} /> Imported
                            </span>
                          ) : (
                            <button
                              onClick={() => handleImportGithub(file)}
                              disabled={isUploading || !!importingGithubUrl}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                background: "var(--color-primary, #6366f1)",
                                color: "#fff",
                                border: "none",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: "600",
                                cursor: (isUploading || !!importingGithubUrl) ? "not-allowed" : "pointer",
                                opacity: (isUploading || !!importingGithubUrl) ? 0.6 : 1,
                                flexShrink: 0,
                              }}
                            >
                              <Download size={12} />
                              {isImporting ? "Importing..." : "Import"}
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}