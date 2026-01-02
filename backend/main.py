from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

# Mock Legal Documents
LEGAL_DOCS = [
    {
        "id": 1,
        "title": "Contract Law Basics",
        "content": "A valid contract requires offer, acceptance, consideration, and mutual intent.",
        "image": "http://localhost:5173/law.png"


    },
    {
        "id": 2,
        "title": "Employment Law Overview",
        "content": "Employment law regulates wages, workplace safety, and employee rights.",
        "image": "http://localhost:5173/law.png"


    },
    {
        "id": 3,
        "title": "Intellectual Property Rights",
        "content": "Intellectual property law protects inventions, trademarks, and copyrights.",
        "image": "http://localhost:5173/law.png"


    }
]

@app.post("/generate")
def generate(req: QueryRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="No results found")

    matches = []

    for doc in LEGAL_DOCS:
        if req.query.lower() in doc["title"].lower() or req.query.lower() in doc["content"].lower():
            matches.append({
                "title": doc["title"],
                "summary": doc["content"]  
            })

    return {
        "results": matches,
        "total_docs_searched": len(LEGAL_DOCS)
    }



@app.get("/previews")
def get_previews(q: str = ""):
    if not q.strip():
        return []

    q_lower = q.lower()
    matches = [
        {
            "id": doc["id"],
            "title": doc["title"],
            "summary": doc["content"],
            "image": doc["image"]
        }
        for doc in LEGAL_DOCS
        if q_lower in doc["title"].lower() or q_lower in doc["content"].lower()
    ]
    return matches

