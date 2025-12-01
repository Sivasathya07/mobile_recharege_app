# document_processor.py
from langchain.document_loaders import UnstructuredFileLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
import hashlib
import datetime

class DocumentProcessor:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-mpnet-base-v2"
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
    
    def process_file(self, file_path: str):
        loader = UnstructuredFileLoader(file_path)
        documents = loader.load()
        
        # Add metadata
        for doc in documents:
            doc.metadata["doc_hash"] = self._generate_hash(doc.page_content)
            doc.metadata["processed_at"] = datetime.now().isoformat()
        
        # Split and embed
        splits = self.text_splitter.split_documents(documents)
        
        # Create vector store
        db = FAISS.from_documents(splits, self.embeddings)
        
        return db
    
    def _generate_hash(self, text: str):
        return hashlib.md5(text.encode()).hexdigest()
        