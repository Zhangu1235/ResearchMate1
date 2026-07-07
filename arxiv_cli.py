#!/usr/bin/env python
import sys
import json
import os

# Ensure the root directory is in python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from services.arxiv_service import arxiv_service
except ImportError as err:
    print(json.dumps({"success": False, "error": f"Import error: {str(err)}"}))
    sys.exit(1)

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "Missing command argument"}))
        sys.exit(1)

    command = sys.argv[1]

    try:
        if command == "search":
            if len(sys.argv) < 3:
                print(json.dumps({"success": False, "error": "Missing query argument"}))
                sys.exit(1)
            query = sys.argv[2]
            max_results = 5
            if len(sys.argv) >= 4:
                try:
                    max_results = int(sys.argv[4])
                except ValueError:
                    pass
            
            results = arxiv_service.search_papers(query, max_results=max_results)
            print(json.dumps({"success": True, "results": results}))

        elif command == "download":
            if len(sys.argv) < 3:
                print(json.dumps({"success": False, "error": "Missing pdf_url argument"}))
                sys.exit(1)
            pdf_url = sys.argv[2]
            # Save into standard 'uploads' directory
            local_path = arxiv_service.download_pdf(pdf_url, save_directory="uploads")
            
            # Read the bytes of downloaded file and convert to base64 to send back to frontend
            with open(local_path, "rb") as f:
                file_bytes = f.read()
                import base64
                base64_str = base64.b64encode(file_bytes).decode("utf-8")
            
            filename = os.path.basename(local_path)
            filesize = os.path.getsize(local_path)
            
            print(json.dumps({
                "success": True, 
                "local_path": local_path,
                "filename": filename,
                "filesize": filesize,
                "base64": base64_str
            }))

        elif command == "metadata":
            if len(sys.argv) < 3:
                print(json.dumps({"success": False, "error": "Missing arxiv_id argument"}))
                sys.exit(1)
            arxiv_id = sys.argv[2]
            metadata = arxiv_service.get_paper_metadata(arxiv_id)
            print(json.dumps({"success": True, "metadata": metadata}))

        else:
            print(json.dumps({"success": False, "error": f"Unknown command: {command}"}))
            sys.exit(1)

    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
