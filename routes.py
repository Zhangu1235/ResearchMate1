"""
ResearchMate – Multi-Paper Analyzer
Backend Flask API Routes Definition

This file contains ONLY API routes as specified in the architecture.
It delegates all business logic to:
- pdf_service.py (for parsing, checking, validating and preparing PDFs)
- ai_service.py (for summarizing and comparing via Groq llama-3.3-70b-versatile)

Routes:
- GET  /api/            -> API Health check / metadata
- POST /api/upload      -> Receives, validates, and extracts text/metadata from a PDF
- POST /api/summarize   -> Summarizes an extracted PDF text
- POST /api/compare     -> Synthesizes and compares multiple research papers

Author: Senior Software Architecture Engineer
Date: July 2026
"""

from flask import Blueprint, request, jsonify
from services.pdf_service import pdf_service
from services.ai_service import ai_service

# Define Blueprint
api_blueprint = Blueprint('api', __name__)


@api_blueprint.route('/', methods=['GET'])
def index():
    """
    GET /api/
    Returns service metadata and health status.
    """
    return jsonify({
        "success": True,
        "message": "ResearchMate Backend API is active and healthy.",
        "version": "1.0.0",
        "supported_models": ["llama-3.3-70b-versatile"]
    }), 200


@api_blueprint.route('/upload', methods=['POST'])
def upload_paper():
    """
    POST /api/upload
    Receives base64-encoded PDF or file attachment.
    Validates the PDF structure and extracts the text and metadata.
    """
    try:
        # Check if file exists in the request or if raw data is in JSON payload
        file_data = None
        file_name = None
        file_size = 0

        if 'file' in request.files:
            file = request.files['file']
            file_name = file.filename
            file_data = file.read()
            file_size = len(file_data)
        elif request.is_json:
            json_data = request.get_json()
            # Support base64 upload matching the TS server capability
            base64_str = json_data.get('base64')
            file_name = json_data.get('name')
            file_size = json_data.get('size', 0)
            
            if base64_str and file_name:
                # Let pdf_service handle conversion and extraction
                file_data = pdf_service.decode_base64(base64_str)
                if not file_size:
                    file_size = len(file_data)

        if not file_data or not file_name:
            return jsonify({
                "success": False,
                "message": "Missing file payload or file name."
            }), 400

        # Validate file size (15MB) and type
        validation = pdf_service.validate_pdf(file_data, file_name, file_size)
        if not validation["is_valid"]:
            return jsonify({
                "success": False,
                "message": validation["error"]
            }), 400

        # Extract text using PyMuPDF
        extracted_text = pdf_service.extract_text(file_data)
        if not extracted_text.strip():
            return jsonify({
                "success": False,
                "message": "Could not extract any readable text from the uploaded PDF."
            }), 422

        # Clean extracted text for standard downstream optimization
        cleaned_text = pdf_service.clean_text(extracted_text)

        # Return structured metadata & text fragment for client
        return jsonify({
            "success": True,
            "message": "Research paper uploaded and text extracted successfully.",
            "file": {
                "name": file_name,
                "size": file_size,
                "word_count": len(cleaned_text.split()),
                "text_preview": cleaned_text[:500] + "..." if len(cleaned_text) > 500 else cleaned_text
            },
            "extracted_text": cleaned_text
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to upload or parse PDF: {str(e)}"
        }), 500


@api_blueprint.route('/summarize', methods=['POST'])
def summarize_paper():
    """
    POST /api/summarize
    Summarizes the provided research paper text using the AI service.
    """
    try:
        if not request.is_json:
            return jsonify({
                "success": False,
                "message": "Request payload must be JSON."
            }), 400

        data = request.get_json()
        paper_text = data.get('text')
        paper_name = data.get('name', 'Research Paper')

        if not paper_text:
            return jsonify({
                "success": False,
                "message": "Missing 'text' field containing extracted research paper content."
            }), 400

        # Call AI Service to produce structured abstract/summary
        summary = ai_service.summarize_paper(paper_text, paper_name)

        return jsonify({
            "success": True,
            "summary": summary
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Summarization failed: {str(e)}"
        }), 500


@api_blueprint.route('/compare', methods=['POST'])
def compare_papers():
    """
    POST /api/compare
    Synthesizes and compares multiple research papers using the AI service.
    """
    try:
        if not request.is_json:
            return jsonify({
                "success": False,
                "message": "Request payload must be JSON."
            }), 400

        data = request.get_json()
        papers = data.get('papers')  # Expect a list of {"name": "...", "text": "..."}

        if not papers or not isinstance(papers, list) or len(papers) < 2:
            return jsonify({
                "success": False,
                "message": "At least two papers (with 'name' and 'text') are required for comparison."
            }), 400

        # Validate that all elements contain both text and name
        for idx, paper in enumerate(papers):
            if not isinstance(paper, dict) or not paper.get('text') or not paper.get('name'):
                return jsonify({
                    "success": False,
                    "message": f"Paper at index {idx} is invalid. Must contain both 'name' and 'text'."
                }), 400

        # Call AI Service to compare methodologies, conclusions, similarities, differences, and construct a matrix
        comparison = ai_service.compare_papers(papers)

        return jsonify({
            "success": True,
            "comparison": comparison
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Comparison synthesis failed: {str(e)}"
        }), 500
