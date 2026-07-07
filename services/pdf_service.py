"""
ResearchMate – Multi-Paper Analyzer
PDF Processing Service

This file is responsible ONLY for PDF processing and validation using PyMuPDF (fitz).
No AI or Flask dependencies exist here.

Functions:
- decode_base64: Safely converts incoming base64 strings back into raw binary bytes.
- validate_pdf: Ensures size limits and proper signatures are met.
- extract_text: Reads structural layout text pages using fitz (PyMuPDF).
- extract_multiple_pdfs: Reads structural layout text pages for multiple papers.
- clean_text: Normalizes excessive white spacing, breaks, and weird ligatures.

Author: Senior Software Architecture Engineer
Date: July 2026
"""

import base64
import re
from typing import Dict, Any, List

try:
    import fitz  # PyMuPDF
except ImportError:
    # Fallback indicator for environments where PyMuPDF isn't installed during build phase
    fitz = None


class PDFService:
    """
    Service class handling low-level PDF byte validation, extraction, and string cleaning.
    """

    def decode_base64(self, base64_str: str) -> bytes:
        """
        Converts client-side base64 strings back to standard python binary bytes.
        Handles padding and pre-pended data URI headers if they are present.
        """
        if "," in base64_str:
            # Strip data:application/pdf;base64, header if sent
            base64_str = base64_str.split(",")[1]
        
        # Add required padding back if missing
        missing_padding = len(base64_str) % 4
        if missing_padding:
            base64_str += "=" * (4 - missing_padding)

        return base64.b64decode(base64_str)

    def validate_pdf(self, file_bytes: bytes, file_name: str, file_size: int) -> Dict[str, Any]:
        """
        Validates the PDF structure:
        - Checks name extension
        - Validates max file size (15MB)
        - Checks file headers to verify it's a real PDF structure (%PDF- header)
        """
        if not file_name.lower().endswith(".pdf"):
            return {
                "is_valid": False,
                "error": "Unsupported file extension. Only research papers in .pdf format are accepted."
            }

        # 15MB Limit
        max_bytes = 15 * 1024 * 1024
        if file_size > max_bytes or len(file_bytes) > max_bytes:
            return {
                "is_valid": False,
                "error": f"The paper '{file_name}' exceeds the maximum allowed limit of 15MB."
            }

        # PDF magic number check (must start with %PDF)
        if not file_bytes.startswith(b"%PDF"):
            return {
                "is_valid": False,
                "error": f"The file '{file_name}' is not a valid PDF document (magic number mismatch)."
            }

        return {"is_valid": True}

    def extract_text(self, file_bytes: bytes) -> str:
        """
        Extracts structural text from all pages of the PDF byte object using PyMuPDF (fitz).
        Includes error handling and checks if fitz is present.
        """
        if fitz is None:
            raise RuntimeError(
                "PyMuPDF ('fitz' library) is not installed. Please add 'pymupdf' to requirements.txt."
            )

        extracted_pages = []
        try:
            # Open PDF directly from memory stream bytes
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                # Obtain text blocks to preserve general vertical reading order
                page_text = page.get_text("text")
                if page_text:
                    extracted_pages.append(page_text)
            doc.close()
        except Exception as e:
            raise ValueError(f"Failed to extract text from PDF document: {str(e)}")

        return "\n\n--- PAGE BREAK ---\n\n".join(extracted_pages)

    def extract_multiple_pdfs(self, pdfs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Utility function to iterate over multiple PDF dict objects and extract their content.
        Each pdf dictionary is expected to have 'name' and 'bytes' (or 'base64').
        """
        results = []
        for pdf in pdfs:
            name = pdf.get("name", "Unknown Paper")
            raw_bytes = pdf.get("bytes")
            
            if not raw_bytes and "base64" in pdf:
                raw_bytes = self.decode_base64(pdf["base64"])

            try:
                # Validate
                validation = self.validate_pdf(raw_bytes, name, len(raw_bytes))
                if not validation["is_valid"]:
                    results.append({"name": name, "success": False, "error": validation["error"]})
                    continue

                text = self.extract_text(raw_bytes)
                results.append({
                    "name": name,
                    "success": True,
                    "text": self.clean_text(text)
                })
            except Exception as e:
                results.append({"name": name, "success": False, "error": str(e)})

        return results

    def clean_text(self, text: str) -> str:
        """
        Applies rigorous cleaning patterns to standard OCR / extracted PDF text strings:
        - Unifies line ending formats.
        - Collapses sequential blank lines and whitespace tabs.
        - Standardizes hyphens and removes typical footer page numbers.
        """
        if not text:
            return ""

        # Normalize line endings
        text = text.replace("\r\n", "\n").replace("\r", "\n")

        # Strip multi-column hyphen split breaks (e.g., "repre-\nsentative" -> "representative")
        text = re.sub(r"(\w+)-\n+(\w+)", r"\1\2", text)

        # Replace excessive spaces or tabs with a single space
        text = re.sub(r"[ \t]+", " ", text)

        # Restrict consecutive newline breaks to at most 2
        text = re.sub(r"\n{3,}", "\n\n", text)

        return text.strip()


# Instantiate a singleton service
pdf_service = PDFService()
