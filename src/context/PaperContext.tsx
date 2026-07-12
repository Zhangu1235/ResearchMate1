import React, { createContext, useContext, useState, useEffect } from "react";
import { UploadedPaper, PaperSummary, ComparisonResult } from "../types";

interface PaperContextType {
  papers: UploadedPaper[];
  selectedPaperIds: string[];
  comparisonResult: ComparisonResult | null;
  isComparing: boolean;
  isUploading: boolean;
  uploadPaper: (file: File) => Promise<void>;
  summarizePaper: (id: string) => Promise<void>;
  comparePapers: (ids: string[]) => Promise<void>;
  deletePaper: (id: string) => void;
  toggleSelectPaper: (id: string) => void;
  clearSelection: () => void;
  chatWithPaper: (
    id: string,
    message: string,
    history: Array<{ role: "user" | "model"; text: string }>
  ) => Promise<string>;
  importPaperFromArxiv: (pdfUrl: string) => Promise<void>;
  importPaperFromGithub: (downloadUrl: string, name: string) => Promise<void>;
}

const PaperContext = createContext<PaperContextType | undefined>(undefined);

// Native IndexedDB Helper Functions for Persistent base64 Cache
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ResearchMateDB", 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("papers")) {
        db.createObjectStore("papers", { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const savePaperToDB = async (paper: UploadedPaper) => {
  try {
    const db = await openDB();
    const transaction = db.transaction("papers", "readwrite");
    const store = transaction.objectStore("papers");
    store.put(paper);
  } catch (e) {
    console.error("IndexedDB write error:", e);
  }
};

const getPapersFromDB = async (): Promise<UploadedPaper[]> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("papers", "readonly");
      const store = transaction.objectStore("papers");
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("IndexedDB read error:", e);
    return [];
  }
};

const deletePaperFromDB = async (id: string) => {
  try {
    const db = await openDB();
    const transaction = db.transaction("papers", "readwrite");
    const store = transaction.objectStore("papers");
    store.delete(id);
  } catch (e) {
    console.error("IndexedDB delete error:", e);
  }
};

export function PaperProvider({ children }: { children: React.ReactNode }) {
  const [papers, setPapers] = useState<UploadedPaper[]>([]);
  const [base64Cache, setBase64Cache] = useState<Record<string, string>>({});
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>([]);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Load papers from IndexedDB on mount (including base64 content)
  useEffect(() => {
    const loadData = async () => {
      const savedPapers = await getPapersFromDB();
      if (savedPapers && savedPapers.length > 0) {
        setPapers(savedPapers);
        
        // Populate base64 cache in memory
        const cache: Record<string, string> = {};
        savedPapers.forEach((p) => {
          if (p.base64) {
            cache[p.id] = p.base64;
          }
        });
        setBase64Cache(cache);
      }
    };
    loadData();
  }, []);

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Upload Paper
  const uploadPaper = async (file: File) => {
    setIsUploading(true);
    try {
      const base64 = await fileToBase64(file);
      
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer mock-token",
        },
        body: JSON.stringify({
          base64,
          name: file.name,
          size: file.size,
          type: file.type,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Upload failed");
      }

      const newPaper: UploadedPaper = {
        id: data.file.id,
        name: data.file.name,
        size: data.file.size,
        type: data.file.type,
        base64: base64, // Keep base64 inside IndexedDB object
      };

      // Save to state
      setPapers((prev) => [newPaper, ...prev]);

      // Save to IndexedDB (persists base64 and metadata)
      await savePaperToDB(newPaper);

      // Cache the base64 content in memory
      setBase64Cache((prev) => ({
        ...prev,
        [data.file.id]: base64,
      }));

    } catch (e: any) {
      console.error("Upload error:", e);
      alert(e.message || "Failed to upload paper.");
    } finally {
      setIsUploading(false);
    }
  };

  // Summarize Paper
  const summarizePaper = async (id: string) => {
    const paper = papers.find((p) => p.id === id);
    if (!paper) return;

    // Check if base64 is in cache
    const base64 = base64Cache[id] || paper.base64;
    if (!base64) {
      alert("This paper's content is not loaded in memory. Please upload it again to summarize.");
      return;
    }

    // Set summarizing state
    setPapers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isSummarizing: true, error: undefined } : p))
    );

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer mock-token",
        },
        body: JSON.stringify({
          base64,
          name: paper.name,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Summarization failed");
      }

      const updatedPaper = { ...paper, summary: data.summary, isSummarizing: false };

      // Update state
      setPapers((prev) => prev.map((p) => (p.id === id ? updatedPaper : p)));

      // Update IndexedDB
      await savePaperToDB(updatedPaper);

    } catch (e: any) {
      console.error("Summarize error:", e);
      setPapers((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, isSummarizing: false, error: e.message || "Failed to summarize" } : p
        )
      );
    }
  };

  // Compare Papers
  const comparePapers = async (ids: string[]) => {
    if (ids.length < 2) {
      alert("Please select at least 2 papers to compare.");
      return;
    }

    setIsComparing(true);
    setComparisonResult(null);

    try {
      const comparePayload = ids.map((id) => {
        const paper = papers.find((p) => p.id === id);
        const base64 = base64Cache[id] || paper?.base64;
        if (!paper || !base64) {
          throw new Error(`Paper content not found for: ${paper?.name || id}. Please re-upload.`);
        }
        return {
          name: paper.name,
          base64: base64,
          summary: paper.summary,
        };
      });

      const response = await fetch("/api/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer mock-token",
        },
        body: JSON.stringify({
          papers: comparePayload,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Comparison failed");
      }

      setComparisonResult(data.comparison);
    } catch (e: any) {
      console.error("Compare error:", e);
      alert(e.message || "Failed to compare papers.");
    } finally {
      setIsComparing(false);
    }
  };

  // Chat with Paper
  const chatWithPaper = async (
    id: string,
    message: string,
    history: Array<{ role: "user" | "model"; text: string }>
  ): Promise<string> => {
    const paper = papers.find((p) => p.id === id);
    const base64 = base64Cache[id] || paper?.base64;
    if (!paper || !base64) {
      throw new Error("This paper's content is not loaded. Please upload it again to chat.");
    }

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer mock-token",
      },
      body: JSON.stringify({
        base64,
        name: paper.name,
        message,
        history,
      }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Chat request failed");
    }

    return data.answer;
  };

  // Delete Paper
  const deletePaper = async (id: string) => {
    setPapers((prev) => prev.filter((p) => p.id !== id));
    await deletePaperFromDB(id);

    setSelectedPaperIds((prev) => prev.filter((pId) => pId !== id));

    setBase64Cache((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const toggleSelectPaper = (id: string) => {
    setSelectedPaperIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedPaperIds([]);
  };

  // Import Paper from arXiv
  const importPaperFromArxiv = async (pdfUrl: string) => {
    setIsUploading(true);
    try {
      const response = await fetch("/api/arxiv/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer mock-token",
        },
        body: JSON.stringify({ pdfUrl }),
      });

      const dlData = await response.json();
      if (!dlData.success) {
        throw new Error(dlData.message || "Failed to download paper from arXiv");
      }

      // Now call /api/upload
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer mock-token",
        },
        body: JSON.stringify({
          base64: dlData.base64,
          name: dlData.name,
          size: dlData.size,
          type: "application/pdf",
        }),
      });

      const uploadData = await uploadResponse.json();
      if (!uploadData.success) {
        throw new Error(uploadData.message || "Failed to import paper into workspace");
      }

      const newPaper: UploadedPaper = {
        id: uploadData.file.id,
        name: uploadData.file.name,
        size: uploadData.file.size,
        type: uploadData.file.type,
        base64: dlData.base64, // Keep base64 inside IndexedDB object
      };

      // Save to state
      setPapers((prev) => [newPaper, ...prev]);

      // Save to IndexedDB
      await savePaperToDB(newPaper);

      // Cache the base64 content
      setBase64Cache((prev) => ({
        ...prev,
        [uploadData.file.id]: dlData.base64,
      }));
    } catch (e: any) {
      console.error("arXiv import error:", e);
      alert(e.message || "Failed to import paper from arXiv.");
    } finally {
      setIsUploading(false);
    }
  };

  // Import Paper from GitHub
  const importPaperFromGithub = async (downloadUrl: string, name: string) => {
    setIsUploading(true);
    try {
      const response = await fetch("/api/github/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer mock-token",
        },
        body: JSON.stringify({ downloadUrl, name }),
      });

      const dlData = await response.json();
      if (!dlData.success) {
        throw new Error(dlData.message || "Failed to download paper from GitHub");
      }

      // Now call /api/upload
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer mock-token",
        },
        body: JSON.stringify({
          base64: dlData.base64,
          name: dlData.name,
          size: dlData.size,
          type: "application/pdf",
        }),
      });

      const uploadData = await uploadResponse.json();
      if (!uploadData.success) {
        throw new Error(uploadData.message || "Failed to import paper into workspace");
      }

      const newPaper: UploadedPaper = {
        id: uploadData.file.id,
        name: uploadData.file.name,
        size: uploadData.file.size,
        type: uploadData.file.type,
        base64: dlData.base64,
      };

      setPapers((prev) => [newPaper, ...prev]);
      await savePaperToDB(newPaper);

      setBase64Cache((prev) => ({
        ...prev,
        [uploadData.file.id]: dlData.base64,
      }));
    } catch (e: any) {
      console.error("GitHub import error:", e);
      alert(e.message || "Failed to import paper from GitHub.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <PaperContext.Provider
      value={{
        papers,
        selectedPaperIds,
        comparisonResult,
        isComparing,
        isUploading,
        uploadPaper,
        summarizePaper,
        comparePapers,
        deletePaper,
        toggleSelectPaper,
        clearSelection,
        chatWithPaper,
        importPaperFromArxiv,
        importPaperFromGithub,
      }}
    >
      {children}
    </PaperContext.Provider>
  );
}

export function usePapers() {
  const context = useContext(PaperContext);
  if (context === undefined) {
    throw new Error("usePapers must be used within a PaperProvider");
  }
  return context;
}
