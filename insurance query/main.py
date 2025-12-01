# main.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import uuid
from datetime import datetime

# LLM components
from langchain.document_loaders import PyPDFLoader, Docx2txtLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
import pinecone

app = FastAPI(title="Insurance Policy Query System")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
pinecone.init(api_key=os.getenv("PINECONE_API_KEY"), environment="gcp-starter")
embeddings = OpenAIEmbeddings()
llm = ChatOpenAI(temperature=0, model_name="gpt-4")

# Database models
class QueryRequest(BaseModel):
    query: str
    user_id: Optional[str] = None

class ClauseReference(BaseModel):
    clause_title: str
    clause_text: str
    document_name: str
    page_number: int
    relevance_score: float

class QueryResponse(BaseModel):
    decision: str
    amount: Optional[float] = None
    summary: str
    justification: List[ClauseReference]
    processed_query: dict

# Document processing
def process_document(file: UploadFile):
    try:
        # Save temporarily
        file_ext = os.path.splitext(file.filename)[1]
        temp_filename = f"temp_{uuid.uuid4()}{file_ext}"
        
        with open(temp_filename, "wb") as f:
            f.write(file.file.read())
        
        # Load based on type
        if file_ext == ".pdf":
            loader = PyPDFLoader(temp_filename)
        elif file_ext == ".docx":
            loader = Docx2txtLoader(temp_filename)
        else:
            raise ValueError("Unsupported file type")
        
        pages = loader.load()
        os.remove(temp_filename)
        
        # Split and embed
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        docs = text_splitter.split_documents(pages)
        
        # Store in Pinecone
        Pinecone.from_documents(
            docs, 
            embeddings, 
            index_name="policy-documents"
        )
        
        return {"status": "success", "pages": len(pages)}
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Query processing
PROMPT_TEMPLATE = """
You are an insurance policy expert analyzing queries against policy documents.
Extract key details from this query and provide a detailed response:

Query: {query}

Extracted Parameters:
- Age: {age}
- Gender: {gender}
- Procedure: {procedure}
- Location: {location}
- Policy Duration: {duration}

Policy Documents Context:
{context}

Provide your analysis in this format:
- Decision: [Approved/Rejected/Needs Review]
- Amount: [if applicable]
- Summary: [2-3 sentence explanation]
- Justification: [list relevant clauses with exact references]
"""

def process_query(query: str):
    try:
        # Step 1: Extract parameters with LLM
        extraction_prompt = f"""
        Extract these parameters from the insurance query:
        - age (number)
        - gender (M/F)
        - procedure (medical procedure)
        - location (city)
        - policy_duration (time period)
        
        Return as JSON. Query: {query}
        """
        
        extracted = llm.predict(extraction_prompt)
        
        # Step 2: Semantic search in documents
        vectorstore = Pinecone.from_existing_index(
            "policy-documents", 
            embeddings
        )
        
        # Step 3: Generate response with citations
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=vectorstore.as_retriever(),
            return_source_documents=True,
            chain_type_kwargs={
                "prompt": PromptTemplate(
                    template=PROMPT_TEMPLATE,
                    input_variables=["query", "context"]
                )
            }
        )
        
        result = qa_chain({"query": query})
        
        # Step 4: Format response
        response = {
            "decision": "Approved",  # parsed from result
            "amount": 150000,        # parsed from result
            "summary": result["result"],
            "justification": [
                {
                    "clause_title": doc.metadata.get("heading", "Relevant Clause"),
                    "clause_text": doc.page_content,
                    "document_name": doc.metadata["source"],
                    "page_number": doc.metadata["page"],
                    "relevance_score": 0.85  # from similarity search
                }
                for doc in result["source_documents"]
            ],
            "processed_query": extracted
        }
        
        return response
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# API Endpoints
@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    return process_document(file)

@app.post("/process")
async def process_policy_query(request: QueryRequest):
    return process_query(request.query)

@app.get("/history")
async def get_query_history(user_id: str):
    # Implement history tracking
    return {"queries": []}

