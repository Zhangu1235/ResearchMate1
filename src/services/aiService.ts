import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini SDK with telemetry header as instructed
// Prefer Vite-managed env (`VITE_GEMINI_API_KEY`) for frontend builds, fallback to process.env for server-side contexts
const apiKey = (typeof window !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) || process.env.GEMINI_API_KEY;

export const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Using 'gemini-3.5-flash' for robust text & multi-modal processing
const MODEL_NAME = "gemini-3.5-flash";

export interface PaperSummary {
  title: string;
  authors: string;
  publicationYear: string;
  abstractSummary: string;
  keyFindings: string[];
  methodology: string;
  conclusions: string;
  limitations: string;
}

export interface ComparisonResult {
  similarities: string;
  differences: string;
  methodologyComparison: string;
  conclusionsComparison: string;
  matrix: Array<{
    category: string;
    [paperName: string]: string;
  }>;
}

/**
 * Clean text by stripping excess white space or characters
 */
export function cleanText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * AI Service responsible for Gemini generation tasks
 */
export const aiService = {
  /**
   * Summarize an individual paper using Gemini with extracted text
   */
  async summarizePaper(pdfText: string, fileName: string): Promise<PaperSummary> {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set.");
    }

    const systemPrompt = `You are an expert academic research assistant. 
Analyze the provided research paper text and extract a comprehensive, structured summary. 
Return the response in JSON format matching the schema provided. 
Be accurate, academic, and extract high-quality insights from the content.`;

    const prompt = `Please summarize the research paper titled or with filename: "${fileName}".`;

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: [
          {
            text: `Here is the extracted text of the research paper "${fileName}":\n\n${pdfText}`
          },
          prompt,
        ],
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "The actual title of the paper found in the text.",
              },
              authors: {
                type: Type.STRING,
                description: "The authors of the paper.",
              },
              publicationYear: {
                type: Type.STRING,
                description: "Year of publication or 'N/A' if not found.",
              },
              abstractSummary: {
                type: Type.STRING,
                description: "A high-quality 2-3 sentence overview of the paper's core topic.",
              },
              keyFindings: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of the most critical findings, results, or discoveries.",
              },
              methodology: {
                type: Type.STRING,
                description: "Detailed description of the research methodology, dataset, or approach used.",
              },
              conclusions: {
                type: Type.STRING,
                description: "Key conclusions and main takeaways from the authors.",
              },
              limitations: {
                type: Type.STRING,
                description: "Any limitations, constraints, or future work mentioned in the paper.",
              },
            },
            required: [
              "title",
              "authors",
              "publicationYear",
              "abstractSummary",
              "keyFindings",
              "methodology",
              "conclusions",
              "limitations",
            ],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Received empty response from Gemini API.");
      }

      return JSON.parse(responseText.trim()) as PaperSummary;
    } catch (error: any) {
      console.error(`Error summarizing paper ${fileName}:`, error);
      throw new Error(`AI Summarization failed: ${error?.message || error}`);
    }
  },

  /**
   * Compare multiple papers using Gemini with extracted text
   */
  async comparePapers(
    papers: Array<{ name: string; text: string; summary?: PaperSummary }>
  ): Promise<ComparisonResult> {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set.");
    }

    if (papers.length < 2) {
      throw new Error("At least two papers are required for comparison.");
    }

    // Build the contents array with all text inputs
    const contents: any[] = [];
    
    // Add text parts labeled with their index/name
    papers.forEach((paper, index) => {
      contents.push({
        text: `--- BEGIN PAPER ${index + 1}: ${paper.name} ---`,
      });
      contents.push({
        text: paper.text,
      });
      if (paper.summary) {
        contents.push({
          text: `Cached Summary for reference: ${JSON.stringify(paper.summary)}`,
        });
      }
      contents.push({
        text: `--- END PAPER ${index + 1}: ${paper.name} ---`,
      });
    });

    const comparisonPrompt = `Analyze the uploaded research papers and compare them.
You must generate a deep comparative analysis including similarities, differences, a comparison of methodologies, and a comparison of conclusions.
Additionally, you must build a comprehensive comparison matrix table consisting of 5-8 categories (e.g., 'Core Objective', 'Methodology Used', 'Key Datasets/Sample Size', 'Main Strengths', 'Primary Weakness', 'Key Findings', 'Main Conclusion').
For each category in the matrix, provide a precise 1-2 sentence cell text describing how each paper handles that category.

Return the result as a strict JSON object that strictly matches the required schema. Ensure the keys in each item of the 'matrix' match the categories, and have properties for each paper name.`;

    const systemInstruction = `You are an elite academic editor specializing in meta-analysis and literature review.
Produce a high-fidelity comparative synthesis of multiple research papers.
The returned JSON must have:
- similarities: descriptive string
- differences: descriptive string
- methodologyComparison: comparative synthesis of methodologies
- conclusionsComparison: comparative synthesis of conclusions
- matrix: array of objects, where each object has 'category' (string) and dynamic keys corresponding to the exact file names of the papers (e.g., {"category": "Sample Size", "Paper1.pdf": "100 participants", "Paper2.pdf": "500 subjects"})`;

    try {
      // Setup dynamic schema structure for matrix
      const matrixProperties: Record<string, any> = {
        category: {
          type: Type.STRING,
          description: "The comparison criterion (e.g., 'Methodology', 'Sample Size', 'Core Finding').",
        },
      };

      // Add each paper file name as a potential field in the comparison matrix items
      papers.forEach((paper) => {
        matrixProperties[paper.name] = {
          type: Type.STRING,
          description: `The cell content describing how paper "${paper.name}" addresses this category.`,
        };
      });

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: [...contents, { text: comparisonPrompt }],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              similarities: {
                type: Type.STRING,
                description: "Synthesized similarities between the papers in terms of goals, theories, or findings.",
              },
              differences: {
                type: Type.STRING,
                description: "Clear points of departure, contradictions, or distinct focus areas.",
              },
              methodologyComparison: {
                type: Type.STRING,
                description: "Synthesized comparison of methodologies (experimental, qualitative, meta-analysis, etc.).",
              },
              conclusionsComparison: {
                type: Type.STRING,
                description: "Synthesized comparison of conclusions and future research outlooks.",
              },
              matrix: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: matrixProperties,
                  required: ["category", ...papers.map((p) => p.name)],
                },
                description: "Comparison matrix list.",
              },
            },
            required: [
              "similarities",
              "differences",
              "methodologyComparison",
              "conclusionsComparison",
              "matrix",
            ],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Received empty comparison response from Gemini API.");
      }

      return JSON.parse(responseText.trim()) as ComparisonResult;
    } catch (error: any) {
      console.error("Error comparing papers:", error);
      throw new Error(`AI Comparison failed: ${error?.message || error}`);
    }
  },

  /**
   * Chat with an individual paper using Gemini
   */
  async chatWithPaper(
    pdfText: string,
    fileName: string,
    message: string,
    history: Array<{ role: "user" | "model"; text: string }>
  ): Promise<string> {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set.");
    }

    const systemInstruction = `You are a helpful academic research assistant. 
You are answering questions about the research paper titled "${fileName}". 
Answer using the provided text of the paper. Keep your answers concise, accurate, and scientifically sound.`;

    const contents: any[] = [];
    
    // Include history
    history.forEach((h) => {
      contents.push({
        role: h.role,
        parts: [{ text: h.text }],
      });
    });

    // Provide the paper text context along with the active message
    const paperContext = `[Extracted Text of Paper "${fileName}"]:
${pdfText.substring(0, 100000)}
[End of Extracted Text]`;

    contents.push({
      role: "user",
      parts: [{ text: `${paperContext}\n\nQuestion: ${message}` }],
    });

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: contents,
        config: {
          systemInstruction,
        },
      });

      return response.text || "I was unable to find an answer based on the paper context.";
    } catch (error: any) {
      console.error("Error in chatWithPaper:", error);
      throw new Error(`AI Chat failed: ${error?.message || error}`);
    }
  },
};
