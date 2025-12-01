# Smart Alarm Clock (Java Console)

This is a small console-based smart alarm clock implemented in Java. It rings at a scheduled time and forces the user to solve math puzzles to stop the alarm. Snoozing increases difficulty.

Features
- Schedule by absolute time (HH:mm, 24-hour) or relative time (+N minutes).
- Audible beeps (system beep) while the alarm is active.
- Math puzzles of escalating difficulty; must be solved to stop the alarm.
- Snooze option (type "snooze") which pauses the alarm briefly but increases difficulty.

How to compile and run (Windows / PowerShell)

1. Open PowerShell and change to the project directory:

```powershell
cd "C:\Users\SIVASATHYA S\OneDrive\Desktop\alarmclock"
```

2. Compile:

```powershell
javac AlarmClock.java
```

3. Run:

```powershell
java AlarmClock
```

4. Follow prompts to schedule your alarm (e.g., `07:30` or `+1`). When it rings, solve the math puzzle or type `snooze`.

Notes and limitations
- This is a console app and uses Toolkit.beep(); depending on your system, you may hear the default system beep or just the console bell.
- The puzzle generator is intentionally small and can be extended with more puzzle types (memory, pattern, CAPTCHA, etc.).

If you want, I can:
- Add a GUI (Swing/JavaFX) with a nicer interface.
- Add persistence for recurring alarms.
- Add sound playback using wav/mp3 files instead of system beep.
