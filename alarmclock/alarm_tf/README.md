# TensorFlow-backed Smart Alarm (Python)

This folder contains two components:

- A small Flask service (`service.py`) that hosts a tiny TensorFlow model to recommend puzzle difficulty and accept training samples.
- A standalone alarm app (`alarm.py`) that plays a looping tone, shows math puzzles, and reports interaction stats to the service.

Requirements
- Python 3.8+
- See `requirements.txt` for pip packages.

Quick start (PowerShell)

```powershell
cd "C:\Users\SIVASATHYA S\OneDrive\Desktop\alarmclock\alarm_tf"
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# In one terminal, start the service:
python service.py
# In another terminal, run the alarm app (use +0 for immediate):
python alarm.py
```

Behavior
- The alarm app plays a continuous synthesized tone (no external audio files).
- While sound plays, it asks the user math puzzles. Type `snooze` to snooze (1 minute) or answer numerically.
- Correct answer stops the alarm and prints a motivational quote.
- The Flask service receives stats and adapts difficulty over time using a tiny Keras model.

Notes
- The model is intentionally tiny and trains on-the-fly from user interactions; it's more of a demo than production-ready ML.
- If you prefer a GUI (Tkinter) instead of console prompts, I can convert `alarm.py` into a simple GUI app.
