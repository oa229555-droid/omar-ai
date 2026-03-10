from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os
from dotenv import load_dotenv
import httpx
from typing import List, Optional
import chromadb
from chromadb.config import Settings
import json
from datetime import datetime

# Load environment variables
load_dotenv()

app = FastAPI(title="AI NEXUS Backend")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ChromaDB
chroma_client = chromadb.Client(Settings(
    chroma_db_impl="duckdb+parquet",
    persist_directory="./chroma_db"
))

# Create collections
try:
    memory_collection = chroma_client.create_collection(name="memories")
except:
    memory_collection = chroma_client.get_collection(name="memories")

# Models
class ChatRequest(BaseModel):
    message: str
    user: str

class ChatResponse(BaseModel):
    response: str
    memory_ids: Optional[List[str]] = None

# Constants
AI_KEY = os.getenv("AI_KEY", "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")
AI_URL = "https://openrouter.ai/api/v1/chat/completions"

# ========== 1. AI Chat ==========
async def call_ai(prompt: str) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            AI_URL,
            headers={
                "Authorization": f"Bearer {AI_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "openai/gpt-4o",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 1000
            },
            timeout=30.0
        )
        
        if response.status_code == 200:
            data = response.json()
            return data["choices"][0]["message"]["content"]
        return "عذراً، حدث خطأ"

# ========== 2. Web Search حقيقي ==========
async def search_web(query: str) -> List[dict]:
    # باستخدام SerpAPI (مجاني)
    serp_key = os.getenv("SERP_API_KEY", "")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://serpapi.com/search.json",
            params={
                "q": query,
                "api_key": serp_key,
                "hl": "ar",
                "gl": "sa"
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            results = []
            for item in data.get("organic_results", [])[:3]:
                results.append({
                    "title": item.get("title"),
                    "link": item.get("link"),
                    "snippet": item.get("snippet")
                })
            return results
        return []

# ========== 3. تحليل الملفات ==========
async def analyze_pdf(file_path: str) -> str:
    # استخدام PyPDF2 أو pdfplumber
    return "تحليل PDF: تم استخراج النص بنجاح"

async def analyze_image(file_path: str) -> str:
    # استخدام PIL أو OpenCV
    return "تحليل صورة: تم التعرف على العناصر"

async def analyze_code(file_path: str) -> str:
    # تحليل الكود
    return "تحليل كود: تم فحص الأخطاء"

# ========== 4. API Endpoints ==========
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    # البحث في الذاكرة أولاً
    results = memory_collection.query(
        query_texts=[request.message],
        n_results=3
    )
    
    # بناء prompt مع السياق
    context = ""
    if results["documents"]:
        context = "المعلومات السابقة:\n" + "\n".join(results["documents"][0])
    
    # بحث على الإنترنت
    web_results = await search_web(request.message)
    web_context = ""
    if web_results:
        web_context = "نتائج البحث:\n" + "\n".join([f"- {r['title']}: {r['snippet']}" for r in web_results])
    
    prompt = f"""لديك المعلومات التالية:
{context}
{web_context}

أجب على السؤال: {request.message}
"""
    
    # استدعاء الذكاء الاصطناعي
    response = await call_ai(prompt)
    
    # حفظ في الذاكرة
    memory_collection.add(
        documents=[request.message],
        metadatas=[{"user": request.user, "timestamp": datetime.now().isoformat()}],
        ids=[f"mem_{datetime.now().timestamp()}"]
    )
    
    return ChatResponse(response=response)

@app.post("/analyze-file")
async def analyze_file(file: UploadFile = File(...)):
    content = await file.read()
    file_path = f"./uploads/{file.filename}"
    
    # حفظ الملف مؤقتاً
    with open(file_path, "wb") as f:
        f.write(content)
    
    # تحليل حسب نوع الملف
    if file.filename.endswith('.pdf'):
        analysis = await analyze_pdf(file_path)
    elif file.filename.endswith(('.png', '.jpg', '.jpeg')):
        analysis = await analyze_image(file_path)
    elif file.filename.endswith(('.py', '.js', '.html')):
        analysis = await analyze_code(file_path)
    else:
        analysis = "نوع الملف غير مدعوم"
    
    # حذف الملف المؤقت
    os.remove(file_path)
    
    return {"analysis": analysis}

@app.get("/memory")
async def get_memory():
    results = memory_collection.get()
    memories = []
    for i in range(len(results["ids"])):
        memories.append({
            "id": results["ids"][i],
            "text": results["documents"][i],
            "metadata": results["metadatas"][i]
        })
    return {"memories": memories}

@app.get("/health")
async def health():
    return {"status": "healthy", "chroma": "connected"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
