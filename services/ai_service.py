"""
ResearchMate – Multi-Paper Analyzer
Groq AI Integration Service

This file is responsible ONLY for AI interaction with Groq API.
Configured Model: llama-3.3-70b-versatile
Required Environment Variable: GROQ_API_KEY

Functions:
- summarize_paper: Produces a high-quality structured summary of individual text.
- compare_papers: Performs meta-analysis across multiple papers.
- extract_key_findings: Pulls high-level academic results.
- generate_comparison_table: Structures custom comparison criteria.

No Flask dependencies exist here.

Author: Senior Software Architecture Engineer
Date: July 2026
"""

import os
import json
import urllib.request
import urllib.error
from typing import Dict, Any, List


class AIService:
    """
    Service class handling direct HTTP REST requests to Groq's API endpoints.
    Uses standard library urllib to avoid mandatory external dependencies.
    """

    def __init__(self):
        self.model_name = "llama-3.3-70b-versatile"
        self.endpoint = "https://api.groq.com/openai/v1/chat/completions"

    def _get_api_key(self) -> str:
        """
        Retrieves the GROQ_API_KEY from environment variables.
        """
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError(
                "GROQ_API_KEY environment variable is not configured. "
                "Please add it to your .env file or configuration."
            )
        return api_key

    def _call_groq(self, messages: List[Dict[str, str]], json_mode: bool = True) -> str:
        """
        Helper method to call Groq API chat/completions endpoint using standard library urllib.
        """
        api_key = self._get_api_key()

        payload = {
            "model": self.model_name,
            "messages": messages,
            "temperature": 0.2,
            "max_tokens": 4096
        }

        if json_mode:
            payload["response_format"] = {"type": "json_object"}

        data = json.dumps(payload).encode("utf-8")

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }

        req = urllib.request.Request(self.endpoint, data=data, headers=headers, method="POST")

        try:
            with urllib.request.urlopen(req, timeout=45) as response:
                res_data = response.read().decode("utf-8")
                res_json = json.loads(res_data)
                return res_json["choices"][0]["message"]["content"]
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8") if e.fp else ""
            print(f"Groq API HTTP Error: {e.code} - {e.reason}\nResponse: {err_body}")
            raise RuntimeError(f"Groq API Error: {e.reason}. Detail: {err_body}")
        except Exception as e:
            print(f"Connection to Groq API failed: {str(e)}")
            raise RuntimeError(f"Failed to connect to Groq AI Service: {str(e)}")

    def summarize_paper(self, paper_text: str, paper_name: str) -> Dict[str, Any]:
        """
        Summarizes an individual research paper text.
        Returns a structured dictionary with keys:
        - title
        - authors
        - publicationYear
        - abstractSummary
        - keyFindings (List[str])
        - methodology
        - conclusions
        - limitations
        """
        # Limit paper text to around 12,000 words to avoid token limit errors on standard context limits
        words = paper_text.split()
        if len(words) > 12000:
            paper_text = " ".join(words[:12000]) + "\n[TEXT TRUNCATED DUE TO SIZE LIMITS]"

        system_prompt = (
            "You are an elite academic research assistant. Analyze the provided research paper "
            "text and return a high-fidelity summary in strict JSON format.\n"
            "The JSON output MUST contain exactly these keys:\n"
            '{\n'
            '  "title": "Actual title of the paper",\n'
            '  "authors": "Authors list",\n'
            '  "publicationYear": "Year of publication or \'N/A\' if unknown",\n'
            '  "abstractSummary": "A concise 2-3 sentence overview of the paper\'s core focus",\n'
            '  "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],\n'
            '  "methodology": "Details about methodology/data used",\n'
            '  "conclusions": "Authors\' main takeaways/conclusions",\n'
            '  "limitations": "Limitations or future work mentions"\n'
            '}'
        )

        user_content = f"Research paper filename: {paper_name}\n\nContent:\n{paper_text}"

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content}
        ]

        response_text = self._call_groq(messages, json_mode=True)
        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            raise ValueError("Groq returned an invalid JSON response during summarization.")

    def compare_papers(self, papers: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Compares multiple research papers.
        Each element in 'papers' must be a dict with: 'name' and 'text'.
        Returns a structured comparison dictionary with keys:
        - similarities
        - differences
        - methodologyComparison
        - conclusionsComparison
        - matrix (List[Dict[str, str]])
        """
        # Build context for multiple papers
        context_parts = []
        paper_names = []

        for idx, paper in enumerate(papers):
            name = paper.get("name", f"Paper {idx + 1}")
            text = paper.get("text", "")
            paper_names.append(name)

            # Limit word count per paper for the context limit safety
            words = text.split()
            if len(words) > 6000:
                text = " ".join(words[:6000]) + "\n[TRUNCATED]"

            context_parts.append(f"--- PAPER {idx + 1}: {name} ---\n{text}\n--- END OF PAPER {idx + 1} ---")

        all_papers_text = "\n\n".join(context_parts)

        system_prompt = (
            "You are an elite research editor specialized in meta-analysis.\n"
            "Analyze the provided multiple research papers and contrast them. "
            "You must return your comparative synthesis in a strict JSON format with exactly these keys:\n"
            '{\n'
            '  "similarities": "Deep paragraphs highlighting similarity in goals or core findings.",\n'
            '  "differences": "Points of departures, distinct goals or different variables.",\n'
            '  "methodologyComparison": "Deep analysis of differing methodologies, datasets, or theoretical frameworks.",\n'
            '  "conclusionsComparison": "Comparison of findings, takeaways, future outlooks.",\n'
            '  "matrix": [\n'
            '    {\n'
            '      "category": "Criterion Category (e.g., Core Objective, Architecture, Key Innovation, Datasets)",\n'
            f'      # For each paper name, provide a value cell string:\n'
            '      # "PaperName1.pdf": "Value for paper 1",\n'
            '      # "PaperName2.pdf": "Value for paper 2"\n'
            '    }\n'
            '  ]\n'
            '}\n'
            "Create a highly precise, scientific matrix containing 5 to 7 rows representing different "
            "comparative criteria (e.g., 'Core Objective', 'Architecture/Model Type', 'Primary Dataset', "
            "'Primary Focus', 'Limitations'). Ensure you list every uploaded paper as a key in each matrix item."
        )

        user_content = (
            f"Please compare these {len(papers)} research papers: {', '.join(paper_names)}\n\n"
            f"Content data:\n{all_papers_text}"
        )

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content}
        ]

        response_text = self._call_groq(messages, json_mode=True)
        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            raise ValueError("Groq returned an invalid JSON response during meta-analysis.")

    def extract_key_findings(self, paper_text: str) -> List[str]:
        """
        Extracts key findings from the paper text as a clean list of strings.
        """
        summary = self.summarize_paper(paper_text, "Temporary Paper")
        return summary.get("keyFindings", [])

    def generate_comparison_table(self, papers: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Generates just the dynamic matrix comparison table for the papers.
        """
        comparison = self.compare_papers(papers)
        return comparison.get("matrix", [])


# Instantiate single active instance of the service
ai_service = AIService()
