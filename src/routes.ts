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

/**
 * POST /api/chat - Ask AI questions about a research paper
 */
apiRouter.post("/chat", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { base64, name, message, history } = req.body;

    if (!base64 || !name || !message) {
      res.status(400).json({
        success: false,
        message: "Missing 'base64' content, 'name' of the paper, or 'message' to ask.",
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

    const answer = await aiService.chatWithPaper(cleanedText, name, message, history || []);

    res.json({
      success: true,
      answer,
    });
  } catch (error: any) {
    console.error("Error in /chat route:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "An unexpected error occurred during paper Q&A chat.",
    });
  }
});

/**
 * POST /api/github/contents - Query files in a repository
 */
apiRouter.post("/github/contents", async (req: Request, res: Response): Promise<void> => {
  try {
    const { repoUrl } = req.body;
    if (!repoUrl || typeof repoUrl !== "string") {
      res.status(400).json({ success: false, message: "Missing or invalid repository URL." });
      return;
    }

    // Clean URL: strip https://github.com/ or trailing slashes
    const cleanUrl = repoUrl.replace(/https?:\/\/github\.com\//i, "").replace(/\/$/, "");
    const parts = cleanUrl.split("/");
    if (parts.length < 2) {
      res.status(400).json({ 
        success: false, 
        message: "Invalid format. Please enter 'owner/repo' or a repository link." 
      });
      return;
    }

    const owner = parts[0];
    const repo = parts[1];

    // 1. Get default branch of the repository
    const repoInfoUrl = `https://api.github.com/repos/${owner}/${repo}`;
    let defaultBranch = "main";

    try {
      const repoInfoResponse = await fetch(repoInfoUrl, {
        headers: { "User-Agent": "ResearchMate-App/1.0.0" }
      });
      if (repoInfoResponse.ok) {
        const repoData = await repoInfoResponse.json();
        defaultBranch = repoData.default_branch || "main";
      }
    } catch (e) {
      console.warn("Failed to fetch repository default branch, falling back to 'main':", e);
    }

    // 2. Fetch git tree recursively
    const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`;
    const treeResponse = await fetch(treeUrl, {
      headers: { "User-Agent": "ResearchMate-App/1.0.0" }
    });

    if (!treeResponse.ok) {
      const errData = await treeResponse.json().catch(() => ({}));
      res.status(treeResponse.status).json({
        success: false,
        message: errData.message || `Failed to fetch repository tree: HTTP ${treeResponse.status}`,
      });
      return;
    }

    const treeData = await treeResponse.json();
    if (!treeData.tree || !Array.isArray(treeData.tree)) {
      res.status(500).json({ success: false, message: "Invalid Git Tree structure returned from GitHub." });
      return;
    }

    // Filter PDF files
    const pdfFiles = treeData.tree
      .filter((node: any) => node.type === "blob" && node.path.toLowerCase().endsWith(".pdf"))
      .map((node: any) => ({
        path: node.path,
        size: node.size || 0,
        downloadUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${node.path}`,
      }));

    res.json({
      success: true,
      owner,
      repo,
      branch: defaultBranch,
      files: pdfFiles,
    });

  } catch (error: any) {
    console.error("Error in /github/contents route:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "An unexpected error occurred while exploring the GitHub repository.",
    });
  }
});

/**
 * POST /api/github/download - Download a PDF from raw CDN
 */
apiRouter.post("/github/download", async (req: Request, res: Response): Promise<void> => {
  try {
    const { downloadUrl, name } = req.body;
    if (!downloadUrl || typeof downloadUrl !== "string") {
      res.status(400).json({ success: false, message: "Missing or invalid download URL." });
      return;
    }

    const response = await fetch(downloadUrl, {
      headers: { "User-Agent": "ResearchMate-App/1.0.0" }
    });

    if (!response.ok) {
      res.status(response.status).json({
        success: false,
        message: `Failed to download file from GitHub CDN: HTTP ${response.status}`,
      });
      return;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    if (buffer.length === 0) {
      throw new Error("Downloaded PDF content is empty.");
    }

    const base64 = buffer.toString("base64");
    const fileName = name || downloadUrl.split("/").pop() || "github_paper.pdf";

    res.json({
      success: true,
      base64,
      name: fileName,
      size: buffer.length,
    });

  } catch (error: any) {
    console.error("Error in /github/download route:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to download paper PDF from GitHub.",
    });
  }
});

/**
 * POST /api/feedback - Save and mock-email user feedback/upgrades
 */
apiRouter.post("/feedback", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, type, message } = req.body;
    if (!email || !type || !message) {
      res.status(400).json({ success: false, message: "Required fields missing (email, type, message)." });
      return;
    }

    // Dynamic imports to prevent issues
    const fs = await import("fs");
    const path = await import("path");

    const feedbackData = {
      id: `fb_${Date.now()}`,
      name: name || "Anonymous Researcher",
      email,
      type,
      message,
      submittedAt: new Date().toISOString(),
    };

    const feedbackDir = path.resolve(process.cwd(), "feedback");
    if (!fs.existsSync(feedbackDir)) {
      fs.mkdirSync(feedbackDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(feedbackDir, `${feedbackData.id}.json`),
      JSON.stringify(feedbackData, null, 2)
    );

    const smtpUser = process.env.SMTP_USER || "";
    const smtpPass = process.env.SMTP_PASS || "";

    if (smtpUser && smtpPass) {
      try {
        // Send real email via Gmail SMTP
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const mailOptions = {
          from: `"${name}" <${email}>`,
          to: "kezhanguukruse@gmail.com",
          subject: `[ResearchMate Upgrade/Feedback] - ${type}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
              <h2 style="color: #6366f1; border-bottom: 1px solid #eee; padding-bottom: 10px;">ResearchMate Upgrade & Feedback</h2>
              <p><strong>From:</strong> ${name} (&lt;${email}&gt;)</p>
              <p><strong>Category:</strong> ${type}</p>
              <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #eee; margin-top: 15px;">
                <p style="margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
              <p style="font-size: 11px; color: #999; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
                Submitted at: ${new Date().toLocaleString()}
              </p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✉️ [EMAIL NOTIFICATION] Real email dispatched successfully to kezhanguukruse@gmail.com via nodemailer.`);
      } catch (emailError: any) {
        console.error("⚠️ [EMAIL NOTIFICATION] Failed to dispatch email notification via SMTP:", emailError.message || emailError);
        console.log("Fallback: Feedback has been successfully saved to local disk, but email transmission failed (possibly blocked SMTP outbound ports on the host).");
      }
    } else {
      // Log mock warning
      console.log("====================================================");
      console.log(`✉️ [EMAIL NOTIFICATION] SMTP credentials missing in .env. Logging mock email:`);
      console.log(`To: kezhanguukruse@gmail.com`);
      console.log(`From: ${email} (${name})`);
      console.log(`Subject: [ResearchMate Upgrade/Feedback] - ${type}`);
      console.log(`Message Body:`);
      console.log(`----------------------------------------------------`);
      console.log(message);
      console.log("====================================================");
    }

    res.json({
      success: true,
      message: "Feedback submitted successfully! Upgrade notification sent to administrators.",
    });

  } catch (error: any) {
    console.error("Error in /feedback route:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to process feedback.",
    });
  }
});
