// import React, { useState } from "react";
// import { 
//   Upload, 
//   FileText, 
//   Sparkles, 
//   Trash2, 
//   TrendingUp, 
//   BookOpen, 
//   Columns, 
//   CheckCircle2, 
//   AlertCircle, 
//   ChevronRight, 
//   Layers, 
//   HelpCircle,
//   FileCheck,
//   RefreshCw,
//   Award,
//   ArrowRightLeft,
//   Search,
//   History,
//   Play,
//   Download,
//   Plus
// } from "lucide-react";
// import { motion, AnimatePresence } from "motion/react";
// import { UploadedPaper, PaperSummary, ComparisonResult } from "./types.ts";
// import { DEMO_PAPERS, DEMO_COMPARISON } from "./demoData.ts";

// export default function App() {
//   const [papers, setPapers] = useState<UploadedPaper[]>([]);
//   const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>([]);
//   const [activeSummaryPaperId, setActiveSummaryPaperId] = useState<string | null>(null);
  
//   // Recent Searches and arXiv search states
//   const [recentSearches, setRecentSearches] = useState<string[]>(() => {
//     try {
//       const saved = localStorage.getItem("recent_searches");
//       return saved ? JSON.parse(saved) : ["Large Language Models", "Quantum Computing", "Deep Learning"];
//     } catch (e) {
//       return ["Large Language Models", "Quantum Computing", "Deep Learning"];
//     }
//   });
//   const [searchQuery, setSearchQuery] = useState("");
//   const [arxivResults, setArxivResults] = useState<any[]>([]);
//   const [isSearchingArxiv, setIsSearchingArxiv] = useState(false);
//   const [activeTab, setActiveTab] = useState<"uploaded" | "arxiv">("uploaded");
//   const [downloadingPaperId, setDownloadingPaperId] = useState<string | null>(null);

//   // Comparative analysis state
//   const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
//   const [isComparing, setIsComparing] = useState(false);
//   const [comparisonError, setComparisonError] = useState<string | null>(null);
  
//   // Loader step messages for the AI processing animation
//   const [loaderMessage, setLoaderMessage] = useState("");
//   const [dragOver, setDragOver] = useState(false);

//   // Global app notification
//   const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

//   const triggerNotification = (text: string, type: "success" | "error" = "success") => {
//     setNotification({ text, type });
//     setTimeout(() => setNotification(null), 4000);
//   };

//   // Convert File to Base64
//   const fileToBase64 = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => {
//         const result = reader.result as string;
//         const base64 = result.split(",")[1];
//         resolve(base64);
//       };
//       reader.onerror = (error) => reject(error);
//     });
//   };

//   // Handle PDF drop / selection
//   const handleFiles = async (fileList: FileList) => {
//     const newPapers: UploadedPaper[] = [];
    
//     for (let i = 0; i < fileList.length; i++) {
//       const file = fileList[i];
//       if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
//         triggerNotification(`"${file.name}" is not a PDF file. Only PDFs are supported.`, "error");
//         continue;
//       }

//       // 15MB limit check
//       if (file.size > 15 * 1024 * 1024) {
//         triggerNotification(`"${file.name}" exceeds the 15MB file size limit.`, "error");
//         continue;
//       }

//       // Avoid duplicates
//       if (papers.some(p => p.name === file.name)) {
//         triggerNotification(`A paper named "${file.name}" is already added.`, "error");
//         continue;
//       }

//       try {
//         const base64 = await fileToBase64(file);
        
//         // Register upload with backend
//         const response = await fetch("/api/upload", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             base64,
//             name: file.name,
//             size: file.size,
//             type: file.type
//           })
//         });

//         const data = await response.json();
        
//         if (data.success) {
//           newPapers.push({
//             id: data.file.id,
//             name: data.file.name,
//             size: data.file.size,
//             type: data.file.type,
//             base64: base64
//           });
//         } else {
//           triggerNotification(`Failed to validate "${file.name}": ${data.message}`, "error");
//         }
//       } catch (err: any) {
//         triggerNotification(`Error uploading "${file.name}": ${err?.message || err}`, "error");
//       }
//     }

//     if (newPapers.length > 0) {
//       setPapers(prev => [...prev, ...newPapers]);
//       triggerNotification(`Added ${newPapers.length} paper(s) successfully!`);
//     }
//   };

//   // Drag and drop handlers
//   const onDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     setDragOver(true);
//   };

//   const onDragLeave = () => {
//     setDragOver(false);
//   };

//   const onDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setDragOver(false);
//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       handleFiles(e.dataTransfer.files);
//     }
//   };

//   // Summarize an individual paper
//   const runSummarize = async (id: string) => {
//     const paper = papers.find(p => p.id === id);
//     if (!paper) return;

//     // Set summarizing state
//     setPapers(prev => prev.map(p => p.id === id ? { ...p, isSummarizing: true, error: undefined } : p));
    
//     // Cycle custom loader messages for extra polish
//     const messages = [
//       "Extracting publication details...",
//       "Synthesizing key findings...",
//       "Analyzing research methodology...",
//       "Drafting final structured abstract..."
//     ];
//     let msgIdx = 0;
//     const interval = setInterval(() => {
//       if (papers.find(p => p.id === id)?.isSummarizing) {
//         setLoaderMessage(messages[msgIdx % messages.length]);
//         msgIdx++;
//       }
//     }, 2500);

//     setLoaderMessage(messages[0]);

//     try {
//       const response = await fetch("/api/summarize", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           base64: paper.base64,
//           name: paper.name
//         })
//       });

//       const data = await response.json();
//       clearInterval(interval);

//       if (data.success) {
//         setPapers(prev => prev.map(p => p.id === id ? { ...p, summary: data.summary, isSummarizing: false } : p));
//         setActiveSummaryPaperId(id);
//         triggerNotification(`Successfully summarized "${paper.name}"!`);
//       } else {
//         throw new Error(data.message || "Summarization failed.");
//       }
//     } catch (err: any) {
//       clearInterval(interval);
//       setPapers(prev => prev.map(p => p.id === id ? { ...p, isSummarizing: false, error: err.message || "An error occurred" } : p));
//       triggerNotification(`Failed to summarize "${paper.name}": ${err.message}`, "error");
//     }
//   };

//   // Compare selected papers
//   const runCompare = async () => {
//     if (selectedPaperIds.length < 2) {
//       triggerNotification("Please select at least 2 papers to compare.", "error");
//       return;
//     }

//     setIsComparing(true);
//     setComparisonError(null);

//     const comparePapers = papers.filter(p => selectedPaperIds.includes(p.id));
    
//     // Polished cyclical loader messages
//     const messages = [
//       "Reading research methodology details...",
//       "Synthesizing similarities and contrasts...",
//       "Evaluating differences in conclusions...",
//       "Structuring cross-comparison matrix table..."
//     ];
//     let msgIdx = 0;
//     setLoaderMessage(messages[0]);
//     const interval = setInterval(() => {
//       setLoaderMessage(messages[msgIdx % messages.length]);
//       msgIdx++;
//     }, 3000);

//     try {
//       const response = await fetch("/api/compare", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           papers: comparePapers.map(p => ({
//             name: p.name,
//             base64: p.base64,
//             summary: p.summary
//           }))
//         })
//       });

//       const data = await response.json();
//       clearInterval(interval);

//       if (data.success) {
//         setComparisonResult(data.comparison);
//         triggerNotification("Comparative synthesis generated successfully!");
//         // Scroll to comparison section
//         setTimeout(() => {
//           document.getElementById("comparison-results")?.scrollIntoView({ behavior: "smooth" });
//         }, 300);
//       } else {
//         throw new Error(data.message || "Comparison failed.");
//       }
//     } catch (err: any) {
//       clearInterval(interval);
//       setComparisonError(err.message || "An error occurred during comparison.");
//       triggerNotification(`Comparison failed: ${err.message}`, "error");
//     } finally {
//       setIsComparing(false);
//     }
//   };

//   // Delete uploaded paper
//   const deletePaper = (id: string) => {
//     setPapers(prev => prev.filter(p => p.id !== id));
//     setSelectedPaperIds(prev => prev.filter(item => item !== id));
//     if (activeSummaryPaperId === id) {
//       setActiveSummaryPaperId(null);
//     }
//     triggerNotification("Paper removed.");
//   };

//   // Toggle selection for comparison
//   const toggleSelectPaper = (id: string) => {
//     setSelectedPaperIds(prev => 
//       prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
//     );
//   };

//   // Load standard pre-analyzed academic demo dataset
//   const loadDemoDataset = () => {
//     setPapers(DEMO_PAPERS);
//     setSelectedPaperIds(DEMO_PAPERS.map(p => p.id));
//     setComparisonResult(DEMO_COMPARISON);
//     setActiveSummaryPaperId(DEMO_PAPERS[0].id);
//     triggerNotification("Demo research papers and meta-analysis loaded!");
//   };

//   // Helper to save recent searches
//   const saveSearchTopic = (topic: string) => {
//     if (!topic || !topic.trim()) return;
//     const t = topic.trim();
//     setRecentSearches(prev => {
//       const filtered = prev.filter(x => x.toLowerCase() !== t.toLowerCase());
//       const updated = [t, ...filtered].slice(0, 5);
//       localStorage.setItem("recent_searches", JSON.stringify(updated));
//       return updated;
//     });
//   };

//   // Search arXiv papers
//   const handleArxivSearch = async (queryToSearch?: string) => {
//     const q = queryToSearch || searchQuery;
//     if (!q || !q.trim()) {
//       triggerNotification("Please enter a research topic to search.", "error");
//       return;
//     }

//     setIsSearchingArxiv(true);
//     saveSearchTopic(q);
//     if (!queryToSearch) {
//       setSearchQuery(q);
//     }

//     try {
//       const response = await fetch(`/api/arxiv/search?query=${encodeURIComponent(q)}&max_results=6`);
//       const data = await response.json();
//       if (data.success) {
//         setArxivResults(data.results);
//         setActiveTab("arxiv");
//         triggerNotification(`Found ${data.results.length} papers on arXiv!`);
//       } else {
//         throw new Error(data.message || "Failed to search papers.");
//       }
//     } catch (err: any) {
//       triggerNotification(`Search failed: ${err.message}`, "error");
//     } finally {
//       setIsSearchingArxiv(false);
//     }
//   };

//   // Download an individual paper from search results and add to workspace
//   const handleDownloadPaper = async (paper: any) => {
//     if (papers.some(p => p.name.includes(paper.arxiv_id))) {
//       triggerNotification("This paper has already been added to your workspace.", "error");
//       return;
//     }

//     setDownloadingPaperId(paper.arxiv_id);
//     triggerNotification(`Downloading "${paper.title.substring(0, 30)}..." from arXiv`);

//     try {
//       const dlResponse = await fetch("/api/arxiv/download", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ pdfUrl: paper.pdf_url })
//       });
//       const dlData = await dlResponse.json();

//       if (!dlResponse.ok || !dlData.success) {
//         throw new Error(dlData.message || "Failed to download PDF.");
//       }

//       // Upload and validate with standard file validation endpoint
//       const uploadResponse = await fetch("/api/upload", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           base64: dlData.base64,
//           name: dlData.name,
//           size: dlData.size,
//           type: "application/pdf"
//         })
//       });
//       const uploadData = await uploadResponse.json();

//       if (uploadData.success) {
//         const newPaper: UploadedPaper = {
//           id: uploadData.file.id,
//           name: uploadData.file.name,
//           size: uploadData.file.size,
//           type: uploadData.file.type,
//           base64: dlData.base64
//         };

//         setPapers(prev => [...prev, newPaper]);
//         setSelectedPaperIds(prev => [...prev, newPaper.id]);
//         triggerNotification(`Added "${newPaper.name}" to workspace!`);
//       } else {
//         throw new Error(uploadData.message || "Registration with backend failed.");
//       }
//     } catch (err: any) {
//       triggerNotification(`Download failed: ${err.message}`, "error");
//     } finally {
//       setDownloadingPaperId(null);
//     }
//   };

//   // Auto-compare a topic by downloading, summarizing and comparing
//   const handleAutoCompareTopic = async (topic: string) => {
//     setActiveTab("arxiv");
//     setSearchQuery(topic);
//     setIsComparing(true);
//     setLoaderMessage(`Searching arXiv for top papers on "${topic}"...`);
//     triggerNotification(`Running auto-comparison analysis for: "${topic}"`);

//     try {
//       // 1. Search top 3 papers
//       const searchRes = await fetch(`/api/arxiv/search?query=${encodeURIComponent(topic)}&max_results=3`);
//       const searchData = await searchRes.json();
//       if (!searchData.success || !searchData.results || searchData.results.length === 0) {
//         throw new Error("No results found for this topic on arXiv.");
//       }
//       setArxivResults(searchData.results);
//       saveSearchTopic(topic);

//       // 2. Download and register them
//       const downloadedPapers: UploadedPaper[] = [];
//       for (let i = 0; i < searchData.results.length; i++) {
//         const paper = searchData.results[i];
//         setLoaderMessage(`Downloading paper ${i + 1} of ${searchData.results.length}: ${paper.title.substring(0, 30)}...`);

//         const dlRes = await fetch("/api/arxiv/download", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ pdfUrl: paper.pdf_url })
//         });
//         const dlData = await dlRes.json();
//         if (dlData.success) {
//           const uploadRes = await fetch("/api/upload", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               base64: dlData.base64,
//               name: dlData.name,
//               size: dlData.size,
//               type: "application/pdf"
//             })
//           });
//           const uploadData = await uploadRes.json();
//           if (uploadData.success) {
//             downloadedPapers.push({
//               id: uploadData.file.id,
//               name: uploadData.file.name,
//               size: uploadData.file.size,
//               type: uploadData.file.type,
//               base64: dlData.base64
//             });
//           }
//         }
//       }

//       if (downloadedPapers.length < 2) {
//         throw new Error("Could not download at least 2 papers successfully from arXiv.");
//       }

//       // Add downloaded papers to current list
//       setPapers(prev => {
//         const nonDup = downloadedPapers.filter(dp => !prev.some(p => p.name === dp.name));
//         return [...prev, ...nonDup];
//       });
//       setSelectedPaperIds(downloadedPapers.map(dp => dp.id));

//       // 3. Summarize them in parallel
//       setLoaderMessage("Synthesizing and extracting key findings...");
//       const summarizePromises = downloadedPapers.map(async (dp) => {
//         setPapers(prev => prev.map(p => p.id === dp.id ? { ...p, isSummarizing: true } : p));
//         try {
//           const sumRes = await fetch("/api/summarize", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ base64: dp.base64, name: dp.name })
//           });
//           const sumData = await sumRes.json();
//           if (sumData.success) {
//             setPapers(prev => prev.map(p => p.id === dp.id ? { ...p, summary: sumData.summary, isSummarizing: false } : p));
//             return { id: dp.id, success: true, summary: sumData.summary };
//           }
//         } catch (e) {
//           console.error(e);
//         }
//         setPapers(prev => prev.map(p => p.id === dp.id ? { ...p, isSummarizing: false } : p));
//         return { id: dp.id, success: false };
//       });

//       const summaries = await Promise.all(summarizePromises);
//       const papersWithSummary = downloadedPapers.map(dp => {
//         const sumInfo = summaries.find(s => s.id === dp.id);
//         return {
//           name: dp.name,
//           base64: dp.base64,
//           summary: sumInfo && sumInfo.success ? sumInfo.summary : undefined
//         };
//       }).filter(p => p.summary !== undefined);

//       if (papersWithSummary.length < 2) {
//         throw new Error("Could not extract metadata from at least 2 papers.");
//       }

//       // 4. Compare
//       setLoaderMessage("Structuring cross-comparison matrix...");
//       const compRes = await fetch("/api/compare", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ papers: papersWithSummary })
//       });
//       const compData = await compRes.json();

//       if (compData.success) {
//         setComparisonResult(compData.comparison);
//         triggerNotification("Meta-analysis generated and loaded!", "success");
//         setTimeout(() => {
//           document.getElementById("comparison-results")?.scrollIntoView({ behavior: "smooth" });
//         }, 400);
//       } else {
//         throw new Error(compData.message || "Comparison service failed.");
//       }

//     } catch (err: any) {
//       triggerNotification(`Auto-analysis failed: ${err.message}`, "error");
//     } finally {
//       setIsComparing(false);
//     }
//   };

//   // Format file size
//   const formatSize = (bytes: number): string => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
//   };

//   React.useEffect(() => {
//     const socket = new WebSocket(`${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/ws`);

//     socket.addEventListener("open", () => {
//       socket.send(JSON.stringify({ type: "ping" }));
//     });

//     socket.addEventListener("close", () => {
//       console.info("Websocket connection closed.");
//     });

//     socket.addEventListener("error", (event) => {
//       console.error("Websocket error:", event);
//     });

//     return () => {
//       socket.close();
//     };
//   }, []);

//   const activeSummaryPaper = papers.find(p => p.id === activeSummaryPaperId);

//   return (
//     <div className="min-h-screen bg-neutral-50 text-neutral-800 font-sans selection:bg-indigo-100 antialiased">
//       {/* Toast Notification */}
//       <AnimatePresence>
//         {notification && (
//           <motion.div 
//             id="toast-notification"
//             initial={{ opacity: 0, y: -20, scale: 0.95 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: -20, scale: 0.95 }}
//             className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
//               notification.type === "error" 
//                 ? "bg-rose-50 border-rose-200 text-rose-800" 
//                 : "bg-emerald-50 border-emerald-200 text-emerald-800"
//             }`}
//           >
//             {notification.type === "error" ? <AlertCircle className="h-4 w-4 shrink-0" /> : <CheckCircle2 className="h-4 w-4 shrink-0" />}
//             <span>{notification.text}</span>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Primary Header Hero */}
//       <header className="border-b border-neutral-200 bg-white shadow-xs">
//         <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <div className="bg-neutral-900 text-white p-2.5 rounded-xl flex items-center justify-center shadow-md shadow-neutral-900/15">
//               <BookOpen className="h-6 w-6" />
//             </div>
//             <div>
//               <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 font-sans">
//                 ResearchMate <span className="font-light text-neutral-500">| Multi-Paper Analyzer</span>
//               </h1>
//               <p className="text-xs text-neutral-500 mt-0.5">
//                 Powered by Gemini 3.5 &amp; Advanced Document Semantics
//               </p>
//             </div>
//           </div>
//           <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
//             <button
//               id="btn-demo-load"
//               onClick={loadDemoDataset}
//               className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all flex items-center gap-2 border border-neutral-200"
//             >
//               <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
//               Load AI Demo Papers
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
//         {/* Intro Info Banner */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 bg-gradient-to-r from-neutral-900 to-neutral-800 text-neutral-100 rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
//             <div className="absolute top-0 right-0 p-8 opacity-10">
//               <Layers className="h-40 w-40" />
//             </div>
//             <div className="space-y-3 z-10">
//               <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[11px] font-semibold text-indigo-300">
//                 <Award className="h-3.5 w-3.5" /> College Meta-Analysis Tool
//               </div>
//               <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
//                 Synthesize literature like a seasoned academic researcher.
//               </h2>
//               <p className="text-neutral-300 text-sm max-w-xl leading-relaxed">
//                 Upload your research paper PDFs, let AI automatically extract methodologies, findings, and limits, and generate a dynamic cross-comparison matrix in seconds.
//               </p>
//             </div>
//             <div className="z-10 mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-2 text-xs text-neutral-400">
//               <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Fully Native PDF Extraction</span>
//               <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Multi-Paper Coherence Matrix</span>
//             </div>
//           </div>

//           {/* Quick Stats / Guide */}
//           <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
//             <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">How it works</h3>
//             <div className="space-y-4 mt-4">
//               <div className="flex gap-3">
//                 <div className="h-6 w-6 shrink-0 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">1</div>
//                 <div>
//                   <p className="text-xs font-semibold text-neutral-800">Add PDF Files</p>
//                   <p className="text-[11px] text-neutral-500 leading-normal">Drag and drop up to 5 papers (max 15MB each) into the target box.</p>
//                 </div>
//               </div>
//               <div className="flex gap-3">
//                 <div className="h-6 w-6 shrink-0 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">2</div>
//                 <div>
//                   <p className="text-xs font-semibold text-neutral-800">Extract Individual Summaries</p>
//                   <p className="text-[11px] text-neutral-500 leading-normal">Extract highly structured abstracts, methodology details, and limitations.</p>
//                 </div>
//               </div>
//               <div className="flex gap-3">
//                 <div className="h-6 w-6 shrink-0 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">3</div>
//                 <div>
//                   <p className="text-xs font-semibold text-neutral-800">Cross-Compare &amp; Generate Matrix</p>
//                   <p className="text-[11px] text-neutral-500 leading-normal">Select the papers and click 'Compare' to get similarities, differences, and a structured table.</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Paper Management Block */}
//         <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//           {/* File Upload & Recent Searches Side Column */}
//           <div className="lg:col-span-1 space-y-6">
//             {/* Recent Searches Side Panel */}
//             <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs space-y-4">
//               <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-100 pb-2">
//                 <History className="h-4 w-4 text-indigo-600" />
//                 Recent Search Topics
//               </h3>
//               {recentSearches.length === 0 ? (
//                 <p className="text-[11px] text-neutral-400">No recent searches yet. Search arXiv to save your topics.</p>
//               ) : (
//                 <div className="space-y-2">
//                   {recentSearches.map((topic, index) => (
//                     <div 
//                       key={index}
//                       className="group flex items-center justify-between p-2.5 rounded-xl border border-neutral-100 hover:border-indigo-100 hover:bg-indigo-50/20 transition-all text-left"
//                     >
//                       <div className="truncate pr-2">
//                         <p className="text-xs font-semibold text-neutral-800 truncate" title={topic}>
//                           {topic}
//                         </p>
//                         <p className="text-[9px] text-neutral-400">arXiv topic query</p>
//                       </div>
                      
//                       <div className="flex gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
//                         <button
//                           onClick={() => handleArxivSearch(topic)}
//                           className="p-1 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors"
//                           title="Search arXiv"
//                         >
//                           <Search className="h-3 w-3" />
//                         </button>
//                         <button
//                           onClick={() => handleAutoCompareTopic(topic)}
//                           className="p-1.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors flex items-center gap-0.5 text-[9px] font-bold"
//                           title="Auto-compare top 3 papers"
//                         >
//                           <Play className="h-2.5 w-2.5 fill-indigo-600 text-indigo-600" />
//                           Compare
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="space-y-6">
//               <h3 className="text-md font-bold tracking-tight text-neutral-900 flex items-center gap-2">
//                 <Upload className="h-5 w-5 text-indigo-600" />
//                 1. Add Research Papers
//               </h3>
              
//               <div
//                 id="drop-zone"
//                 onDragOver={onDragOver}
//                 onDragLeave={onDragLeave}
//                 onDrop={onDrop}
//                 className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
//                   dragOver 
//                     ? "border-indigo-500 bg-indigo-50/50 scale-[0.99]" 
//                     : "border-neutral-300 bg-white hover:border-neutral-400 hover:bg-neutral-50/30"
//                 }`}
//               >
//                 <input
//                   id="file-input-raw"
//                   type="file"
//                   multiple
//                   accept=".pdf"
//                   onChange={(e) => e.target.files && handleFiles(e.target.files)}
//                   className="hidden"
//                 />
//                 <label htmlFor="file-input-raw" className="cursor-pointer flex flex-col items-center">
//                   <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 mb-4 shadow-xs">
//                     <Upload className="h-5 w-5 text-neutral-600" />
//                   </div>
//                   <p className="text-xs font-bold text-neutral-900">Drag &amp; drop PDF files</p>
//                   <p className="text-[11px] text-neutral-500 mt-1">or click to browse local storage</p>
//                   <div className="mt-4 px-3 py-1 rounded-full bg-neutral-100 text-[10px] font-medium text-neutral-500 border border-neutral-200">
//                     Maximum 15MB per file
//                   </div>
//                 </label>
//               </div>

//               {/* Quick Demo Help Panel */}
//               <div className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-5 space-y-3">
//                 <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
//                   <HelpCircle className="h-4 w-4 shrink-0 text-indigo-600" />
//                   No research paper PDF handy?
//                 </h4>
//                 <p className="text-[11px] text-indigo-800 leading-relaxed">
//                   Click the <strong>"Load AI Demo Papers"</strong> button in the header to pre-populate classical deep learning papers and immediately inspect both the individual summaries and comparison matrix tables.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Files List & arXiv Search Panel */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Tab selection */}
//             <div className="flex border-b border-neutral-200">
//               <button
//                 onClick={() => setActiveTab("uploaded")}
//                 className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
//                   activeTab === "uploaded"
//                     ? "border-indigo-600 text-indigo-600"
//                     : "border-transparent text-neutral-500 hover:text-neutral-800"
//                 }`}
//               >
//                 <FileText className="h-4 w-4" />
//                 Workspace Library ({papers.length})
//               </button>
//               <button
//                 onClick={() => setActiveTab("arxiv")}
//                 className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
//                   activeTab === "arxiv"
//                     ? "border-indigo-600 text-indigo-600"
//                     : "border-transparent text-neutral-500 hover:text-neutral-800"
//                 }`}
//               >
//                 <Search className="h-4 w-4" />
//                 arXiv Search Engine
//               </button>
//             </div>

//             {activeTab === "uploaded" ? (
//               <div className="space-y-6">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-md font-bold tracking-tight text-neutral-900 flex items-center gap-2">
//                     <FileText className="h-5 w-5 text-indigo-600" />
//                     Uploaded Papers ({papers.length})
//                   </h3>
//                   {papers.length > 0 && (
//                     <button 
//                       onClick={() => {
//                         setPapers([]);
//                         setSelectedPaperIds([]);
//                         setComparisonResult(null);
//                         setActiveSummaryPaperId(null);
//                         triggerNotification("All files cleared.");
//                       }}
//                       className="text-xs font-medium text-neutral-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
//                     >
//                       <Trash2 className="h-3.5 w-3.5" /> Clear All
//                     </button>
//                   )}
//                 </div>

//                 <div className="space-y-3">
//                   {papers.length === 0 ? (
//                     <div className="border border-neutral-200 rounded-3xl p-10 text-center bg-white">
//                       <div className="h-10 w-10 mx-auto rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mb-3">
//                         <FileText className="h-5 w-5" />
//                       </div>
//                       <p className="text-xs font-semibold text-neutral-700">No papers added yet</p>
//                       <p className="text-[11px] text-neutral-500 mt-1 max-w-xs mx-auto">Upload scientific PDF files or load the demo dataset to begin your comparative research workflow.</p>
//                     </div>
//                   ) : (
//                     <AnimatePresence>
//                   {papers.map((paper) => {
//                     const isSelected = selectedPaperIds.includes(paper.id);
//                     return (
//                       <motion.div
//                         key={paper.id}
//                         layoutId={`paper-card-${paper.id}`}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, scale: 0.95 }}
//                         className={`border rounded-2xl p-4 transition-all bg-white relative overflow-hidden ${
//                           isSelected 
//                             ? "border-indigo-500 shadow-sm shadow-indigo-100/30 ring-1 ring-indigo-500/10" 
//                             : "border-neutral-200 hover:border-neutral-300 shadow-xs"
//                         }`}
//                       >
//                         {/* Summary generation background progress bar */}
//                         {paper.isSummarizing && (
//                           <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-100 overflow-hidden">
//                             <motion.div 
//                               className="h-full bg-indigo-600"
//                               initial={{ width: "0%" }}
//                               animate={{ width: "100%" }}
//                               transition={{ duration: 15, ease: "easeInOut" }}
//                             />
//                           </div>
//                         )}

//                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                           <div className="flex items-start gap-3">
//                             {/* Checkbox to select for meta comparison */}
//                             <div className="pt-1 select-none">
//                               <input
//                                 type="checkbox"
//                                 id={`select-${paper.id}`}
//                                 checked={isSelected}
//                                 onChange={() => toggleSelectPaper(paper.id)}
//                                 className="h-4 w-4 text-indigo-600 border-neutral-300 rounded-sm focus:ring-indigo-500"
//                               />
//                             </div>
//                             <div className="space-y-1">
//                               <div className="flex items-center gap-2 flex-wrap">
//                                 <span className="text-xs font-bold text-neutral-900 truncate max-w-md" title={paper.name}>
//                                   {paper.name}
//                                 </span>
//                                 <span className="text-[10px] text-neutral-400 font-mono">
//                                   ({formatSize(paper.size)})
//                                 </span>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 {paper.summary ? (
//                                   <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
//                                     <FileCheck className="h-3 w-3" /> Summarized
//                                   </span>
//                                 ) : paper.isSummarizing ? (
//                                   <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
//                                     <RefreshCw className="h-3 w-3 animate-spin" /> {loaderMessage || "Summarizing..."}
//                                   </span>
//                                 ) : (
//                                   <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200">
//                                     Ready to Analyze
//                                   </span>
//                                 )}

//                                 {paper.error && (
//                                   <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
//                                     Error: {paper.error}
//                                   </span>
//                                 )}
//                               </div>
//                             </div>
//                           </div>

//                           {/* Quick action buttons */}
//                           <div className="flex items-center gap-2 self-end sm:self-center">
//                             {paper.summary ? (
//                               <button
//                                 id={`btn-view-${paper.id}`}
//                                 onClick={() => setActiveSummaryPaperId(paper.id)}
//                                 className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg border transition-all ${
//                                   activeSummaryPaperId === paper.id
//                                     ? "bg-indigo-600 text-white border-indigo-600"
//                                     : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50"
//                                 }`}
//                               >
//                                 View Summary
//                               </button>
//                             ) : (
//                               <button
//                                 id={`btn-sum-${paper.id}`}
//                                 onClick={() => runSummarize(paper.id)}
//                                 disabled={paper.isSummarizing}
//                                 className="px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 transition-all flex items-center gap-1"
//                               >
//                                 {paper.isSummarizing ? "Processing..." : "Summarize"}
//                               </button>
//                             )}

//                             <button
//                               id={`btn-del-${paper.id}`}
//                               onClick={() => deletePaper(paper.id)}
//                               className="p-1.5 rounded-lg border border-neutral-200 text-neutral-400 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50/50 transition-all"
//                               title="Delete file"
//                             >
//                               <Trash2 className="h-3.5 w-3.5" />
//                             </button>
//                           </div>
//                         </div>
//                       </motion.div>
//                     );
//                   })}
//                 </AnimatePresence>
//               )}
//             </div>

//             {/* Selection controls for comparison trigger */}
//             {papers.length >= 2 && (
//               <div className="bg-neutral-900 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-neutral-800">
//                 <div className="space-y-1">
//                   <h4 className="text-sm font-bold flex items-center gap-2">
//                     <ArrowRightLeft className="h-4 w-4 text-indigo-400 animate-pulse" />
//                     2. Cross-Paper Meta-Analysis
//                   </h4>
//                   <p className="text-[11px] text-neutral-400">
//                     Selected {selectedPaperIds.length} of {papers.length} papers for deep AI comparative analysis.
//                   </p>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <button
//                     id="btn-trigger-compare"
//                     onClick={runCompare}
//                     disabled={isComparing || selectedPaperIds.length < 2}
//                     className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/15 flex items-center gap-2 transition-all"
//                   >
//                     {isComparing ? (
//                       <>
//                         <RefreshCw className="h-3.5 w-3.5 animate-spin" />
//                         Generating Analysis...
//                       </>
//                     ) : (
//                       <>
//                         <Sparkles className="h-3.5 w-3.5" />
//                         Generate Comparison
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>) : (
//             <div className="space-y-6">
//               <div className="flex flex-col md:flex-row gap-3">
//                 <div className="relative flex-grow">
//                   <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
//                   <input
//                     type="text"
//                     placeholder="Search arXiv by title, author, or keyword (e.g. Attention mechanism)..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && handleArxivSearch()}
//                     className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
//                 <button
//                   onClick={() => handleArxivSearch()}
//                   disabled={isSearchingArxiv}
//                   className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shrink-0"
//                 >
//                   {isSearchingArxiv ? (
//                     <RefreshCw className="h-3.5 w-3.5 animate-spin" />
//                   ) : (
//                     <Search className="h-3.5 w-3.5" />
//                   )}
//                   Search arXiv
//                 </button>
//               </div>

//               {isSearchingArxiv ? (
//                 <div className="border border-neutral-200 rounded-3xl p-10 text-center bg-white space-y-4">
//                   <div className="flex justify-center">
//                     <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
//                   </div>
//                   <p className="text-xs font-semibold text-neutral-700">Searching official arXiv database...</p>
//                 </div>
//               ) : arxivResults.length === 0 ? (
//                 <div className="border border-neutral-200 rounded-3xl p-10 text-center bg-white space-y-2">
//                   <div className="h-10 w-10 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
//                     <Search className="h-5 w-5" />
//                   </div>
//                   <p className="text-xs font-semibold text-neutral-700">Search arXiv to populate literature</p>
//                   <p className="text-[11px] text-neutral-500 max-w-xs mx-auto">
//                     Directly search and retrieve research papers from the official arXiv database. Download them instantly into your analytical workspace.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {arxivResults.map((result, idx) => {
//                     const isAdded = papers.some(p => p.name.includes(result.arxiv_id));
//                     const isDownloading = downloadingPaperId === result.arxiv_id;
//                     return (
//                       <div key={idx} className="border border-neutral-200 rounded-2xl p-4 bg-white hover:border-neutral-300 transition-all space-y-2 text-left">
//                         <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
//                           <div className="space-y-1">
//                             <span className="inline-block px-2 py-0.5 rounded bg-neutral-100 text-[9px] font-bold text-neutral-600 uppercase">
//                               {result.arxiv_id}
//                             </span>
//                             <h4 className="text-xs font-bold text-neutral-900 leading-snug">{result.title}</h4>
//                             <p className="text-[10px] text-neutral-500 font-medium">
//                               Authors: {result.authors.join(", ")} • Published: {result.published_date}
//                             </p>
//                           </div>
//                           <button
//                             onClick={() => handleDownloadPaper(result)}
//                             disabled={isAdded || isDownloading}
//                             className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all flex items-center justify-center gap-1 shrink-0 ${
//                               isAdded
//                                 ? "bg-emerald-50 text-emerald-700 border-emerald-100 cursor-not-allowed"
//                                 : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50"
//                             }`}
//                           >
//                             {isDownloading ? (
//                               <>
//                                 <RefreshCw className="h-3 w-3 animate-spin" />
//                                 Downloading...
//                               </>
//                             ) : isAdded ? (
//                               <>
//                                 <FileCheck className="h-3 w-3 text-emerald-600" />
//                                 In Workspace
//                               </>
//                             ) : (
//                               <>
//                                 <Download className="h-3 w-3" />
//                                 Import Paper
//                               </>
//                             )}
//                           </button>
//                         </div>
//                         <p className="text-[11px] text-neutral-600 leading-relaxed">
//                           {result.abstract}
//                         </p>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </section>

//         {/* Global Loading / Status Drawer */}
//         <AnimatePresence>
//           {(isComparing) && (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.98 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0 }}
//               className="border border-indigo-100 rounded-3xl p-8 bg-indigo-50/30 text-center space-y-4 max-w-xl mx-auto"
//             >
//               <div className="flex justify-center">
//                 <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 relative">
//                   <Sparkles className="h-5 w-5 animate-pulse" />
//                   <div className="absolute inset-0 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
//                 </div>
//               </div>
//               <div className="space-y-1">
//                 <p className="text-xs font-bold text-indigo-900 uppercase tracking-widest">ResearchMate Synthesis Engine</p>
//                 <p className="text-sm font-semibold text-indigo-950">{loaderMessage}</p>
//                 <p className="text-[11px] text-indigo-700 max-w-sm mx-auto mt-2">
//                   Gemini is parsing the files natively, checking methodologies, analyzing data correlations, and organizing similarity tables. Please don't close this tab.
//                 </p>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* SECTION: INDIVIDUAL SUMMARY VIEWER */}
//         <AnimatePresence>
//           {activeSummaryPaper && activeSummaryPaper.summary && (
//             <motion.section
//               initial={{ opacity: 0, y: 15 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -15 }}
//               className="bg-white border border-neutral-200 rounded-3xl shadow-xs overflow-hidden"
//             >
//               <div className="bg-neutral-900 text-white p-6 flex items-center justify-between border-b border-neutral-800">
//                 <div className="flex items-center gap-2.5">
//                   <div className="p-1.5 bg-neutral-800 rounded-lg text-indigo-400">
//                     <FileText className="h-4 w-4" />
//                   </div>
//                   <div>
//                     <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">Individual Paper Analysis</span>
//                     <h3 className="text-sm md:text-md font-bold tracking-tight">
//                       {activeSummaryPaper.summary.title || activeSummaryPaper.name}
//                     </h3>
//                   </div>
//                 </div>
//                 <button
//                   id="btn-close-summary"
//                   onClick={() => setActiveSummaryPaperId(null)}
//                   className="text-xs text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg transition-colors"
//                 >
//                   Close Summary
//                 </button>
//               </div>

//               <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 {/* Meta details column */}
//                 <div className="lg:col-span-1 space-y-6 lg:border-r lg:border-neutral-200 lg:pr-8">
//                   <div className="space-y-4">
//                     <div>
//                       <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Title found in text</h4>
//                       <p className="text-xs font-bold text-neutral-900 mt-1">
//                         {activeSummaryPaper.summary.title}
//                       </p>
//                     </div>

//                     <div>
//                       <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Authors</h4>
//                       <p className="text-xs font-medium text-neutral-700 mt-1">
//                         {activeSummaryPaper.summary.authors}
//                       </p>
//                     </div>

//                     <div className="flex gap-6">
//                       <div>
//                         <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Publication Year</h4>
//                         <p className="text-xs font-semibold text-neutral-800 mt-1 bg-neutral-100 px-2 py-0.5 rounded-md inline-block">
//                           {activeSummaryPaper.summary.publicationYear}
//                         </p>
//                       </div>
//                       <div>
//                         <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">File Origin</h4>
//                         <p className="text-xs font-medium text-neutral-500 mt-1 truncate max-w-[150px]" title={activeSummaryPaper.name}>
//                           {activeSummaryPaper.name}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="pt-6 border-t border-neutral-100 space-y-3">
//                     <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Abstract Synthesis</h4>
//                     <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50 p-4 rounded-2xl border border-neutral-200/50">
//                       {activeSummaryPaper.summary.abstractSummary}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Substantive summary details column */}
//                 <div className="lg:col-span-2 space-y-6">
//                   {/* Key Findings */}
//                   <div className="space-y-3">
//                     <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5 border-b border-neutral-100 pb-1.5">
//                       <Sparkles className="h-4 w-4 text-indigo-600" /> Key Findings &amp; Discoveries
//                     </h4>
//                     <ul className="space-y-2">
//                       {activeSummaryPaper.summary.keyFindings.map((finding, idx) => (
//                         <li key={idx} className="flex gap-2.5 text-xs text-neutral-700 leading-relaxed">
//                           <span className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-semibold shrink-0 text-[10px] mt-0.5 border border-emerald-100">
//                             {idx + 1}
//                           </span>
//                           <span>{finding}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   {/* Methodology & Conclusions */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
//                     <div className="space-y-3 bg-neutral-50/50 border border-neutral-200/60 p-5 rounded-2xl">
//                       <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
//                         <TrendingUp className="h-4 w-4 text-indigo-600" /> Methodology &amp; Dataset
//                       </h4>
//                       <p className="text-xs text-neutral-600 leading-relaxed">
//                         {activeSummaryPaper.summary.methodology}
//                       </p>
//                     </div>

//                     <div className="space-y-3 bg-neutral-50/50 border border-neutral-200/60 p-5 rounded-2xl">
//                       <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
//                         <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Author Conclusions
//                       </h4>
//                       <p className="text-xs text-neutral-600 leading-relaxed">
//                         {activeSummaryPaper.summary.conclusions}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Limitations & Future outlook */}
//                   {activeSummaryPaper.summary.limitations && (
//                     <div className="bg-rose-50/20 border border-rose-100/60 p-5 rounded-2xl space-y-2">
//                       <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
//                         <AlertCircle className="h-4 w-4 text-rose-600" /> Mentioned Limitations &amp; Future Scope
//                       </h4>
//                       <p className="text-xs text-rose-800 leading-relaxed">
//                         {activeSummaryPaper.summary.limitations}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </motion.section>
//           )}
//         </AnimatePresence>

//         {/* SECTION: RECURRING CROSS-PAPER COMPARATIVE RESULTS */}
//         <AnimatePresence>
//           {comparisonResult && (
//             <motion.section 
//               id="comparison-results"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="space-y-6"
//             >
//               <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-neutral-200 pb-4">
//                 <div>
//                   <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-700 uppercase tracking-widest mb-1.5">
//                     Comparative Literature Synthesis
//                   </div>
//                   <h3 className="text-lg md:text-xl font-bold tracking-tight text-neutral-900">
//                     Scientific Meta-Analysis Dashboard
//                   </h3>
//                 </div>
//                 <p className="text-xs text-neutral-500">
//                   Synthesized across {selectedPaperIds.length} scientific documents
//                 </p>
//               </div>

//               {/* Dynamic comparative narratives */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Similarities & Differences Box */}
//                 <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs space-y-4">
//                   <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
//                     <ChevronRight className="h-4 w-4 text-indigo-600" />
//                     Macro Synthesis
//                   </h4>
//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 uppercase">Similarities</span>
//                       <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50/50 p-4 rounded-2xl border border-neutral-200/50">
//                         {comparisonResult.similarities}
//                       </p>
//                     </div>

//                     <div className="space-y-2">
//                       <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-100 uppercase">Differences</span>
//                       <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50/50 p-4 rounded-2xl border border-neutral-200/50">
//                         {comparisonResult.differences}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Methodology & Conclusions synthesis box */}
//                 <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs space-y-4">
//                   <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
//                     <ChevronRight className="h-4 w-4 text-indigo-600" />
//                     Contrast of Approaches
//                   </h4>
//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200 uppercase">Methodologies Contrast</span>
//                       <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50/50 p-4 rounded-2xl border border-neutral-200/50">
//                         {comparisonResult.methodologyComparison}
//                       </p>
//                     </div>

//                     <div className="space-y-2">
//                       <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200 uppercase">Conclusions Contrast</span>
//                       <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50/50 p-4 rounded-2xl border border-neutral-200/50">
//                         {comparisonResult.conclusionsComparison}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* MATRIX TABLE BLOCK */}
//               <div className="bg-white border border-neutral-200 rounded-3xl shadow-xs overflow-hidden">
//                 <div className="bg-neutral-50 border-b border-neutral-200 px-6 py-5 flex items-center justify-between">
//                   <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
//                     <Columns className="h-4 w-4 text-indigo-600" />
//                     Structured Comparison Matrix
//                   </h4>
//                   <span className="text-[10px] text-neutral-500 font-medium">Dynamically generated meta-table</span>
//                 </div>
                
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-left border-collapse">
//                     <thead>
//                       <tr className="bg-neutral-100/50 border-b border-neutral-200">
//                         <th className="px-6 py-4 text-xs font-bold text-neutral-800 uppercase tracking-wider min-w-[150px] w-1/4">
//                           Comparison Criteria
//                         </th>
//                         {/* Dynamic headers for files */}
//                         {Object.keys(comparisonResult.matrix[0] || {})
//                           .filter(key => key !== "category")
//                           .map((paperName, index) => (
//                             <th key={index} className="px-6 py-4 text-xs font-bold text-indigo-950 uppercase tracking-wider border-l border-neutral-200/80 min-w-[250px]">
//                               {paperName}
//                             </th>
//                           ))
//                         }
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-neutral-200">
//                       {comparisonResult.matrix.map((row, rowIndex) => (
//                         <tr key={rowIndex} className="hover:bg-neutral-50/50 transition-colors">
//                           <td className="px-6 py-4 text-xs font-bold text-neutral-900 bg-neutral-50/20">
//                             {row.category}
//                           </td>
//                           {Object.entries(row)
//                             .filter(([key]) => key !== "category")
//                             .map(([paperName, cellValue], colIndex) => (
//                               <td key={colIndex} className="px-6 py-4 text-xs text-neutral-600 leading-relaxed border-l border-neutral-200/80">
//                                 {cellValue}
//                               </td>
//                             ))
//                           }
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </motion.section>
//           )}
//         </AnimatePresence>
//       </main>

//       <footer className="bg-white border-t border-neutral-200 mt-20">
//         <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 text-neutral-500 text-xs">
//           <div>
//             <p className="font-bold text-neutral-700">ResearchMate – Academic literature reviews simplified.</p>
//             <p className="mt-1 text-neutral-400">Constructed in full-stack Node.js &amp; powered by Google Gemini generative AI technology.</p>
//           </div>
//           <p className="text-neutral-400">© 2026 ResearchMate. Designed for optimal scholar workflows.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }
