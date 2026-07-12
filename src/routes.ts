import { Router, Request, Response } from "express";
import { pdfService } from "./services/pdfService.ts";
import { aiService } from "./services/aiService.ts";
import { arxivService } from "./services/arxivService.ts";
import { UploadedPaper } from "./types.ts";
import { requireAuth } from "./middleware/requireAuth";

export const apiRouter = Router();

/**
 * GET /api/health - Health check
 */
apiRouter.get("/health", (req: Request, res: Response) => {
  res.json({ success: true, status: "ok", message: "ResearchMate API is running smoothly." });
});

/**
 * POST /api/upload - Validates uploaded PDF and returns structure
 */
apiRouter.post("/upload", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { base64, name, size, type } = req.body;

    if (!base64 || !name) {
      res.status(400).json({
        success: false,
        message: "Missing 'base64' content or 'name' of the research paper.",
      });
      return;
    }

    const metadata = {
      fileName: name,
      fileSize: size || Math.round((base64.length * 3) / 4), // fallback estimate from base64
      mimeType: type || "application/pdf",
    };

    const validation = pdfService.validatePDF(base64, metadata);

    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: validation.error || "Invalid research paper file.",
      });
      return;
    }

    const uploadId = `paper_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    res.json({
      success: true,
      message: "Research paper uploaded and validated successfully.",
      file: {
        name: metadata.fileName,
        size: metadata.fileSize,
        type: metadata.mimeType,
        id: uploadId,
      },
    });
  } catch (error: any) {
    console.error("Error in /upload route:", error);
    res.status(500).json({
      success: false,
      message: `Failed to process upload: ${error?.message || error}`,
    });
  }
});

/**
 * POST /api/summarize - Summarize an individual paper
 */
apiRouter.post("/summarize", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { base64, name } = req.body;

    if (!base64 || !name) {
      res.status(400).json({
        success: false,
        message: "Missing 'base64' content or 'name' to summarize.",
      });
      return;
    }

    // Decode base64 to buffer and extract text
    const buffer = Buffer.from(base64, "base64");
    const rawText = await pdfService.extractText(buffer);
    const cleanedText = pdfService.cleanText(rawText);

    if (!cleanedText || cleanedText.trim().length === 0) {
      res.status(422).json({
        success: false,
        message: "Could not extract any readable text from the uploaded PDF.",
      });
      return;
    }

    // Call service layer for AI logic
    const summary = await aiService.summarizePaper(cleanedText, name);

    res.json({
      success: true,
      summary,
    });
  } catch (error: any) {
    console.error("Error in /summarize route:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "An unexpected error occurred during paper summarization.",
    });
  }
});

/**
 * POST /api/compare - Compare multiple research papers
 */
apiRouter.post("/compare", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { papers } = req.body;

    if (!papers || !Array.isArray(papers) || papers.length < 2) {
      res.status(400).json({
        success: false,
        message: "At least two papers are required in the 'papers' array for comparison.",
      });
      return;
    }

    const processedPapers = [];

    // Validate each paper's structure and extract its text
    for (const paper of papers) {
      if (!paper.base64 || !paper.name) {
        res.status(400).json({
          success: false,
          message: "Each paper in the comparison must include 'name' and 'base64' fields.",
        });
        return;
      }

      const buffer = Buffer.from(paper.base64, "base64");
      const rawText = await pdfService.extractText(buffer);
      const cleanedText = pdfService.cleanText(rawText);

      if (!cleanedText || cleanedText.trim().length === 0) {
        res.status(422).json({
          success: false,
          message: `Could not extract any readable text from the paper "${paper.name}".`,
        });
        return;
      }

      processedPapers.push({
        name: paper.name,
        text: cleanedText,
        summary: paper.summary,
      });
    }

    // Call service layer for AI comparison logic
    const comparison = await aiService.comparePapers(processedPapers);

    res.json({
      success: true,
      comparison,
    });
  } catch (error: any) {
    console.error("Error in /compare route:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "An unexpected error occurred during paper comparison.",
    });
  }
});

/**
 * GET /api/arxiv/search - Search arXiv papers
 */
apiRouter.get("/arxiv/search", async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, max_results } = req.query;
    if (!query || typeof query !== "string") {
      res.status(400).json({ success: false, message: "Missing or invalid search query." });
      return;
    }

    const limit = max_results ? parseInt(max_results as string, 10) : 5;
    const papers = await arxivService.searchPapers(query, limit);

    res.json({
      success: true,
      results: papers,
    });
  } catch (error: any) {
    console.error("Error in /arxiv/search route:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to search arXiv papers.",
    });
  }
});

/**
 * POST /api/arxiv/download - Download PDF from arXiv and return base64
 */
apiRouter.post("/arxiv/download", async (req: Request, res: Response): Promise<void> => {
  try {
    const { pdfUrl } = req.body;
    if (!pdfUrl || typeof pdfUrl !== "string") {
      res.status(400).json({ success: false, message: "Missing or invalid pdfUrl." });
      return;
    }

    const downloadResult = await arxivService.downloadPaperPdf(pdfUrl);

    res.json({
      success: true,
      ...downloadResult,
    });
  } catch (error: any) {
    console.error("Error in /arxiv/download route:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to download paper PDF from arXiv.",
    });
  }
});
