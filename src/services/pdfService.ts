import { PDFParse } from "pdf-parse";

/**
 * PDF Service responsible for server-side PDF validation, metadata cleaning, 
 * and preparing PDFs for AI analysis.
 */

export interface PDFMetadata {
  fileName: string;
  fileSize: number; // in bytes
  mimeType: string;
}

export const pdfService = {
  /**
   * Validate uploaded PDF parameters
   */
  validatePDF(base64Data: string, metadata: PDFMetadata): { isValid: boolean; error?: string } {
    // Check mime type
    if (metadata.mimeType !== "application/pdf" && !metadata.fileName.toLowerCase().endsWith(".pdf")) {
      return { isValid: false, error: "Only PDF files are supported." };
    }

    // Limit size to 15MB to prevent memory bloat on server/client
    const sizeLimit = 15 * 1024 * 1024; // 15MB
    if (metadata.fileSize > sizeLimit) {
      return { isValid: false, error: "File size exceeds the 15MB limit." };
    }

    // Check if base64 exists
    if (!base64Data || base64Data.trim().length === 0) {
      return { isValid: false, error: "Empty file content received." };
    }

    return { isValid: true };
  },

  /**
   * Process multiple files and validate them
   */
  validateMultiplePDFs(
    files: Array<{ base64: string; metadata: PDFMetadata }>
  ): Array<{ isValid: boolean; error?: string }> {
    return files.map((file) => this.validatePDF(file.base64, file.metadata));
  },

  /**
   * Extract text from PDF buffer using PDFParse
   */
  async extractText(pdfBuffer: Buffer): Promise<string> {
    let parser: any = null;
    try {
      parser = new PDFParse({ data: pdfBuffer });
      const result = await parser.getText();
      return result.text || "";
    } catch (error: any) {
      console.error("Error extracting text from PDF buffer:", error);
      throw new Error(`Failed to extract text from PDF: ${error?.message || error}`);
    } finally {
      if (parser) {
        try {
          await parser.destroy();
        } catch (e) {
          // Ignore destroy errors
        }
      }
    }
  },

  /**
   * Utility to clean up text strings extracted or generated
   */
  cleanText(text: string): string {
    if (!text) return "";
    return text
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      // Strip multi-column hyphen split breaks (e.g., "repre-\nsentative" -> "representative")
      .replace(/(\w+)-\n+(\w+)/g, "$1$2")
      // Replace excessive spaces or tabs with a single space
      .replace(/[ \t]+/g, " ")
      // Restrict consecutive newline breaks to at most 2
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  },
};

