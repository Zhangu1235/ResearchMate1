"""
ResearchMate – Multi-Paper Analyzer
arXiv Integration Service

This file is responsible ONLY for interacting with the official arXiv API using the 'arxiv' and 'requests' libraries.
No Flask code, AI logic, Groq API calls, or PDF text extraction exist in this module.

Responsibilities:
- Search papers by query, sorted by relevance.
- Download selected papers as PDFs to a local folder, handling duplicates gracefully.
- Retrieve detailed metadata for a specific paper given its arXiv ID.

Author: Senior Software Architecture Engineer
Date: July 2026
"""

import os
import re
import logging
import requests
from typing import List, Dict, Any, Optional

# Configure robust module-level logging
logger = logging.getLogger("arxiv_service")
logger.setLevel(logging.INFO)
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter("[%(asctime)s] %(levelname)s in %(name)s: %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)

# Attempt to import the arxiv client library, raising clear errors if missing
try:
    import arxiv
except ImportError as err:
    logger.error("The 'arxiv' library is not installed. Please add it to requirements.txt.")
    raise RuntimeError(
        "Missing required dependency: 'arxiv'. Please run 'pip install arxiv'."
    ) from err


class ArxivService:
    """
    Service layer for querying arXiv API and downloading research documents.
    """

    def __init__(self):
        # Initialize client settings if needed (arxiv package uses global client or Client objects in modern versions)
        # We will use the modern arxiv.Client API which is recommended for production.
        try:
            self.client = arxiv.Client()
        except AttributeError:
            # Fallback for older versions of python-arxiv library
            self.client = None

    def search_papers(self, query: str, max_results: int = 10) -> List[Dict[str, Any]]:
        """
        Searches arXiv for papers matching the given query, sorted by relevance.

        Args:
            query (str): The search topic or term entered by the user.
            max_results (int): The maximum number of paper results to return.

        Returns:
            List[Dict[str, Any]]: A list of dictionaries containing:
                - arxiv_id (str)
                - title (str)
                - authors (List[str])
                - abstract (str)
                - published_date (str)
                - categories (List[str])
                - pdf_url (str)
                - article_url (str)

        Raises:
            ValueError: If the query is empty or invalid.
            RuntimeError: On connection errors or API failures.
        """
        if not query or not query.strip():
            logger.warning("Search attempted with an empty query.")
            raise ValueError("Search query cannot be empty.")

        query_str = query.strip()
        logger.info(f"Initiating search on arXiv for query: '{query_str}' (max_results={max_results})")

        try:
            # Build search with standard Relevance sorting
            search = arxiv.Search(
                query=query_str,
                max_results=max_results,
                sort_by=arxiv.SortCriterion.Relevance
            )

            results: List[Dict[str, Any]] = []
            
            # Execute search
            if self.client:
                search_results = self.client.results(search)
            else:
                # Legacy fallback compatibility
                search_results = search.results()

            for result in search_results:
                # Extract the pure ID from the full entry ID URL (e.g. http://arxiv.org/abs/1706.03762v7 -> 1706.03762v7)
                arxiv_id = result.entry_id.split("/abs/")[-1]
                
                # Format published date cleanly to string
                published_str = ""
                if result.published:
                    published_str = result.published.strftime("%Y-%m-%d")

                results.append({
                    "arxiv_id": arxiv_id,
                    "title": result.title,
                    "authors": [author.name for author in result.authors],
                    "abstract": result.summary,
                    "published_date": published_str,
                    "categories": result.categories,
                    "pdf_url": result.pdf_url,
                    "article_url": result.entry_id
                })

            logger.info(f"Found {len(results)} matching papers for query: '{query_str}'")
            return results

        except requests.exceptions.RequestException as e:
            logger.error(f"Network error communicating with arXiv API for query '{query_str}': {str(e)}")
            raise RuntimeError(f"Failed to connect to arXiv service due to a network error: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error in search_papers for query '{query_str}': {str(e)}")
            raise RuntimeError(f"An error occurred while processing the arXiv search results: {str(e)}")

    def download_pdf(self, pdf_url: str, save_directory: str = "uploads") -> str:
        """
        Downloads a research paper PDF from the provided URL and saves it using its arXiv ID as the filename.

        Args:
            pdf_url (str): The direct PDF link of the arXiv paper.
            save_directory (str): The folder location to save the downloaded file.

        Returns:
            str: The full path to the saved local PDF file.

        Raises:
            ValueError: If the pdf_url is empty or invalid.
            RuntimeError: On network failures or invalid response formats.
        """
        if not pdf_url or not pdf_url.strip():
            logger.warning("Download attempted with an empty PDF URL.")
            raise ValueError("PDF URL cannot be empty.")

        # Extract arXiv ID from the URL to create a predictable, unique filename
        # Format can be: http://arxiv.org/pdf/1706.03762v7.pdf or similar
        match = re.search(r"pdf/([^\s/]+?)(?:\.pdf)?$", pdf_url)
        if match:
            arxiv_id = match.group(1)
        else:
            # Fallback if the URL structure varies
            arxiv_id = pdf_url.split("/")[-1].replace(".pdf", "")
            if not arxiv_id:
                arxiv_id = "downloaded_paper"

        filename = f"{arxiv_id}.pdf"
        
        # Ensure target directory exists
        try:
            os.makedirs(save_directory, exist_ok=True)
        except Exception as e:
            logger.error(f"Failed to create directory '{save_directory}': {str(e)}")
            raise RuntimeError(f"Unable to access or create save directory '{save_directory}': {str(e)}")

        file_path = os.path.join(save_directory, filename)

        # Handle duplicate downloads gracefully
        if os.path.exists(file_path):
            logger.info(f"File already exists locally at '{file_path}'. Skipping redundant download.")
            return os.path.abspath(file_path)

        logger.info(f"Downloading PDF from {pdf_url} to '{file_path}'")

        try:
            # Configure headers to mimic a browser to prevent requests from being blocked
            headers = {
                "User-Agent": "ResearchMate (Academic Meta-Analyzer Client/1.0.0)"
            }
            
            # Execute request with timeout to avoid hanging connections
            response = requests.get(pdf_url, headers=headers, stream=True, timeout=30)
            
            # Validate response success
            if response.status_code != 200:
                logger.error(f"Received non-200 status code ({response.status_code}) downloading PDF from {pdf_url}")
                raise RuntimeError(f"arXiv download server returned error status code: {response.status_code}")

            # Verify response content type looks like a PDF
            content_type = response.headers.get("Content-Type", "")
            if "application/pdf" not in content_type.lower() and not pdf_url.lower().endswith(".pdf"):
                logger.warning(f"Response content-type is '{content_type}', which may not be a PDF.")

            # Write stream incrementally to avoid high memory footprint
            with open(file_path, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)

            # Validate file existence and file size
            if not os.path.exists(file_path) or os.path.getsize(file_path) == 0:
                if os.path.exists(file_path):
                    os.remove(file_path)
                logger.error(f"Downloaded file at '{file_path}' is empty or missing.")
                raise RuntimeError("The downloaded PDF file is empty or corrupted.")

            logger.info(f"Successfully downloaded paper to '{file_path}' ({os.path.getsize(file_path)} bytes)")
            return os.path.abspath(file_path)

        except requests.exceptions.RequestException as e:
            logger.error(f"Network error downloading PDF from {pdf_url}: {str(e)}")
            # Cleanup partially downloaded file if it exists
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except OSError:
                    pass
            raise RuntimeError(f"Failed to download PDF due to a network connection error: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error downloading PDF from {pdf_url}: {str(e)}")
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except OSError:
                    pass
            raise RuntimeError(f"An error occurred during paper download: {str(e)}")

    def get_paper_metadata(self, arxiv_id: str) -> Dict[str, Any]:
        """
        Retrieves detailed metadata for a single research paper using its arXiv ID.

        Args:
            arxiv_id (str): The unique arXiv identifier (e.g., '1706.03762v7' or '1706.03762').

        Returns:
            Dict[str, Any]: A dictionary containing:
                - title (str)
                - authors (List[str])
                - abstract (str)
                - categories (List[str])
                - published_date (str)
                - pdf_url (str)

        Raises:
            ValueError: If the arXiv ID is empty or invalid.
            RuntimeError: If the ID was not found or the API request failed.
        """
        if not arxiv_id or not arxiv_id.strip():
            logger.warning("Metadata retrieval attempted with an empty arXiv ID.")
            raise ValueError("arXiv ID cannot be empty.")

        clean_id = arxiv_id.strip()
        logger.info(f"Fetching metadata for arXiv ID: '{clean_id}'")

        try:
            # Query the ID using Search API
            search = arxiv.Search(id_list=[clean_id])
            
            if self.client:
                results = list(self.client.results(search))
            else:
                results = list(search.results())

            if not results:
                logger.warning(f"No research paper found with arXiv ID: '{clean_id}'")
                raise ValueError(f"No research paper found with arXiv ID '{clean_id}'.")

            result = results[0]
            
            published_str = ""
            if result.published:
                published_str = result.published.strftime("%Y-%m-%d")

            metadata = {
                "title": result.title,
                "authors": [author.name for author in result.authors],
                "abstract": result.summary,
                "categories": result.categories,
                "published_date": published_str,
                "pdf_url": result.pdf_url
            }

            logger.info(f"Metadata retrieved successfully for: '{result.title}'")
            return metadata

        except ValueError as ve:
            # Re-raise known value errors directly
            raise ve
        except requests.exceptions.RequestException as e:
            logger.error(f"Network error retrieving metadata for arXiv ID '{clean_id}': {str(e)}")
            raise RuntimeError(f"Failed to retrieve metadata due to a network connection error: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error retrieving metadata for arXiv ID '{clean_id}': {str(e)}")
            raise RuntimeError(f"An error occurred while retrieving paper metadata: {str(e)}")


# Instantiate a singleton service
arxiv_service = ArxivService()
