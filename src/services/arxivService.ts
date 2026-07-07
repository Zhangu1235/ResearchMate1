import fs from "fs";
import path from "path";

export interface ArxivPaper {
  arxiv_id: string;
  title: string;
  authors: string[];
  abstract: string;
  published_date: string;
  categories: string[];
  pdf_url: string;
  article_url: string;
}

class ArxivService {
  /**
   * Search arXiv papers by query using official Atom feed API
   */
  async searchPapers(query: string, maxResults: number = 10): Promise<ArxivPaper[]> {
    if (!query || !query.trim()) {
      throw new Error("Search query cannot be empty.");
    }

    const cleanQuery = query.trim();
    const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(cleanQuery)}&start=0&max_results=${maxResults}&sortBy=relevance`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`arXiv API returned error status: ${response.status}`);
      }

      const xmlText = await response.text();
      return this.parseArxivXml(xmlText);
    } catch (error: any) {
      console.error("Error in ArxivService.searchPapers:", error);
      throw new Error(`Failed to query arXiv: ${error?.message || error}`);
    }
  }

  /**
   * Download a PDF from arXiv and return base64 and metadata
   */
  async downloadPaperPdf(pdfUrl: string): Promise<{ base64: string; name: string; size: number }> {
    if (!pdfUrl) {
      throw new Error("PDF URL cannot be empty.");
    }

    // Direct conversion of http to https for reliability
    const secureUrl = pdfUrl.startsWith("http://") ? pdfUrl.replace("http://", "https://") : pdfUrl;

    try {
      const response = await fetch(secureUrl, {
        headers: {
          "User-Agent": "ResearchMate-Client/1.0.0 (Academic Meta-Analyzer)"
        }
      });

      if (!response.ok) {
        throw new Error(`arXiv download server returned status: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      if (buffer.length === 0) {
        throw new Error("Downloaded PDF is empty.");
      }

      const base64 = buffer.toString("base64");

      // Extract arXiv ID to construct filename
      const match = secureUrl.match(/pdf\/([^\s/]+?)(?:\.pdf)?$/i);
      const arxivId = match ? match[1] : secureUrl.split("/").pop()?.replace(".pdf", "") || "arxiv_paper";
      const name = `${arxivId}.pdf`;

      return {
        base64,
        name,
        size: buffer.length
      };
    } catch (error: any) {
      console.error("Error in ArxivService.downloadPaperPdf:", error);
      throw new Error(`Failed to download paper from arXiv: ${error?.message || error}`);
    }
  }

  /**
   * Lightweight robust parser to parse arXiv Atom XML feeds without bulky external libraries
   */
  private parseArxivXml(xml: string): ArxivPaper[] {
    const papers: ArxivPaper[] = [];
    // Extract entries
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;

    while ((match = entryRegex.exec(xml)) !== null) {
      const entryXml = match[1];

      // Extract Entry ID
      const idMatch = entryXml.match(/<id>([\s\S]*?)<\/id>/);
      const idUrl = idMatch ? idMatch[1].trim() : "";
      const arxiv_id = idUrl.split("/abs/").pop() || "";

      // Extract Title
      const titleMatch = entryXml.match(/<title>([\s\S]*?)<\/title>/);
      let title = titleMatch ? titleMatch[1].trim() : "Untitled";
      title = title.replace(/\s+/g, " ");

      // Extract Summary (Abstract)
      const summaryMatch = entryXml.match(/<summary>([\s\S]*?)<\/summary>/);
      let abstract = summaryMatch ? summaryMatch[1].trim() : "";
      abstract = abstract.replace(/\s+/g, " ");

      // Extract Published Date
      const publishedMatch = entryXml.match(/<published>([\s\S]*?)<\/published>/);
      const published_date = publishedMatch ? publishedMatch[1].trim().split("T")[0] : "";

      // Extract Authors
      const authorRegex = /<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/g;
      const authors: string[] = [];
      let authorMatch;
      while ((authorMatch = authorRegex.exec(entryXml)) !== null) {
        authors.push(authorMatch[1].trim());
      }

      // Extract Categories
      const categoryRegex = /<category\s+term="([^"]+)"/g;
      const categories: string[] = [];
      let catMatch;
      while ((catMatch = categoryRegex.exec(entryXml)) !== null) {
        categories.push(catMatch[1]);
      }

      // Extract PDF URL
      const pdfMatch = entryXml.match(/<link\s+[^>]*?href="([^"]*?pdf[^"]*?)"/i) || 
                       entryXml.match(/<link\s+[^>]*?type="application\/pdf"\s+[^>]*?href="([^"]+)"/) || 
                       entryXml.match(/href="([^"]+?\/pdf\/[^"]+?)"/);
      let pdf_url = pdfMatch ? pdfMatch[1] : "";
      if (!pdf_url && arxiv_id) {
        pdf_url = `https://arxiv.org/pdf/${arxiv_id}.pdf`;
      }
      if (pdf_url && pdf_url.startsWith("http://")) {
        pdf_url = pdf_url.replace("http://", "https://");
      }

      papers.push({
        arxiv_id,
        title,
        authors: authors.length > 0 ? authors : ["Unknown Author"],
        abstract,
        published_date,
        categories,
        pdf_url,
        article_url: idUrl
      });
    }

    return papers;
  }
}

export const arxivService = new ArxivService();
