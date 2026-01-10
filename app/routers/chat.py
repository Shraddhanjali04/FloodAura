from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from app.config import settings

router = APIRouter()

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint powered by Gemini API
    """
    try:
        if not request.message or not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        # Initialize Gemini model
        model = genai.GenerativeModel('gemini-pro')
        
        # Add context about FloodAura to make responses more relevant
        context = """You are a helpful assistant for FloodAura, a flood monitoring and alert system. 
        FloodAura helps users track flood risks, get route verdicts for safe travel, view live flood maps, 
        and receive timely alerts about flood conditions. Answer questions helpfully and provide information 
        about flood safety, the app's features, and general assistance."""
        
        full_prompt = f"{context}\n\nUser question: {request.message}"
        
        # Generate response
        response = model.generate_content(full_prompt)
        
        if not response or not response.text:
            raise HTTPException(status_code=500, detail="Failed to generate response")
        
        return ChatResponse(response=response.text)
    
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
