# routes/ehrRoutes.py

import shutil
import tempfile
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from services.ehrProcessor import extract_text
from services.ehrExtractionService import hybrid_extract

router = APIRouter()

@router.post("/ehr/upload")
async def upload_ehr_docx(file: UploadFile = File(...)):
    if not file.filename.endswith(".docx"):
        raise HTTPException(status_code=400, detail="Only .docx files are supported.")

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
            shutil.copyfileobj(file.file, tmp)
            text = extract_text(tmp.name)
            data = hybrid_extract(text)
        return JSONResponse(content=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
