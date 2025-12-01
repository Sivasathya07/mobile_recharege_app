@echo off
echo Starting AI Medical Prescription Verification App...
echo.

REM Start Backend
start cmd /k "cd backend && uvicorn main:app --port 8000"

REM Start Frontend
start cmd /k "cd frontend && streamlit run app.py"

echo Both backend and frontend are starting in separate terminals...
pause


