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

export interface UploadedPaper {
  id: string;
  name: string;
  size: number;
  type: string;
  base64: string;
  summary?: PaperSummary;
  isSummarizing?: boolean;
  error?: string;
}
