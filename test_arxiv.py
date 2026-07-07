#!/usr/bin/env python
"""
ResearchMate – Standalone arXiv Service Test Script

This script tests the search capabilities of arxiv_service.py by searching 
for "Large Language Models", listing the top 5 papers, their authors, 
publication dates, and direct PDF download links.

Usage:
    python test_arxiv.py
"""

import sys
import os

# Add current directory to path to ensure services can be imported correctly
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    # Import the instantiated arxiv_service singleton
    from services.arxiv_service import arxiv_service
except ImportError as err:
    print(f"Error: Could not import arxiv_service. Ensure you are running this from the project root. Details: {err}")
    sys.exit(1)


def test_arxiv_search():
    """
    Executes search on arXiv for 'Large Language Models' and displays metadata of the top 5 papers.
    """
    search_query = "Large Language Models"
    max_results = 5

    print("=" * 70)
    print(f"ResearchMate: Querying arXiv for: '{search_query}'")
    print("=" * 70)

    try:
        # Call search_papers function from the service
        results = arxiv_service.search_papers(query=search_query, max_results=max_results)

        if not results:
            print("No papers found matching the search query.")
            return

        for index, paper in enumerate(results, start=1):
            print(f"\n[{index}] Title: {paper.get('title')}")
            print(f"    Authors:          {', '.join(paper.get('authors', []))}")
            print(f"    Published Date:   {paper.get('published_date')}")
            print(f"    arXiv Identifier: {paper.get('arxiv_id')}")
            print(f"    PDF URL:          {paper.get('pdf_url')}")
            print("-" * 70)

        print(f"\nSuccess: Retrieved and displayed {len(results)} papers from arXiv.")

    except ValueError as ve:
        print(f"Validation Error: {ve}")
    except RuntimeError as re:
        print(f"Execution Error: {re}")
    except Exception as e:
        print(f"An unexpected error occurred during testing: {e}")


if __name__ == "__main__":
    test_arxiv_search()
