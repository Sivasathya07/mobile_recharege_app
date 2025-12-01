import java.util.*;
import java.util.concurrent.*;
import java.awt.Toolkit;
import java.net.*;
import java.io.*;

/**
 * Smart Alarm Clock (console)
 *
 * Features:
 * - Schedule an alarm by absolute time (HH:mm) or relative minutes (+N).
 * - Rings with audible/system beep and console notifications.
 * - To stop the alarm the user must solve generated math puzzles.
 * - Supports snooze (increases difficulty when used repeatedly).
 * - Adjustable difficulty levels and adaptive escalation on snooze/failures.
 *
 * Usage:
 *  - Compile: javac AlarmClock.java
 *  - Run:     java AlarmClock
 *
 * Notes:
 *  - Uses Toolkit.beep() where available; falls back to console bell character.
 */
public class AlarmClock {
    private static final Scanner IN = new Scanner(System.in);
    private static volatile boolean stopBeeping = false;

    public static void main(String[] args) {
        System.out.println("Smart Alarm Clock — Console Edition");
        System.out.println("Enter alarm time in HH:mm (24h) or +N for N minutes from now:");
        String input = IN.nextLine().trim();

        long triggerMillis;
        try {
            triggerMillis = parseTimeToMillis(input);
        } catch (Exception e) {
            System.out.println("Couldn't parse time: " + e.getMessage());
            return;
        }

        Date triggerDate = new Date(triggerMillis);
        System.out.println("Alarm scheduled for: " + triggerDate);

        long delay = triggerMillis - System.currentTimeMillis();
        if (delay < 0) delay = 0;

        ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
        scheduler.schedule(() -> triggerAlarm(), delay, TimeUnit.MILLISECONDS);
        System.out.println("Waiting for alarm. Press Ctrl+C to exit.");
    }

    private static long parseTimeToMillis(String s) {
        s = s.trim();
        if (s.startsWith("+")) {
            int minutes = Integer.parseInt(s.substring(1));
            return System.currentTimeMillis() + minutes * 60_000L;
        }
        // expect HH:mm or H:mm
        String[] parts = s.split(":");
        if (parts.length != 2) throw new IllegalArgumentException("expected HH:mm or +N");
        int hh = Integer.parseInt(parts[0]);
        int mm = Integer.parseInt(parts[1]);
        Calendar c = Calendar.getInstance();
        c.set(Calendar.SECOND, 0);
        c.set(Calendar.MILLISECOND, 0);
        c.set(Calendar.HOUR_OF_DAY, hh);
        c.set(Calendar.MINUTE, mm);
        long t = c.getTimeInMillis();
        // if time already passed today, schedule for tomorrow
        if (t < System.currentTimeMillis()) t += 24L * 60 * 60 * 1000;
        return t;
    }

    private static void triggerAlarm() {
        System.out.println("\n--- ALARM TRIGGERED ---");
        System.out.println("You must solve math puzzles to stop the alarm.");
        System.out.println("Type 'snooze' to snooze (adds a small delay but increases difficulty).\n");

        SoundPlayer player = new SoundPlayer();
        player.start();

        // Puzzle loop
        PuzzleGenerator gen = new PuzzleGenerator();
        int difficulty = 1; // start easy
        int consecutiveFails = 0;
        int totalAttempts = 0;
        int totalCorrect = 0;
        double totalResponseSeconds = 0.0;
        int snoozeCount = 0;

        while (true) {
            Puzzle p = gen.generate(difficulty);
            System.out.println("\nSolve to stop the alarm (difficulty=" + difficulty + "): ");
            System.out.println(p.prompt());
            System.out.print("Your answer (or type snooze): ");
            long start = System.currentTimeMillis();
            String ans = IN.nextLine().trim();
            long now = System.currentTimeMillis();
            double elapsedSec = (now - start) / 1000.0;
            totalAttempts++;
            totalResponseSeconds += elapsedSec;

            if (ans.equalsIgnoreCase("snooze")) {
                snoozeCount++;
                int snoozeMinutes = Math.min(10, difficulty * 2 + 1);
                System.out.println("Snoozing for " + snoozeMinutes + " minute(s). Difficulty will increase.");
                // stop audio while snoozed
                player.stopPlaying();
                try { Thread.sleep(snoozeMinutes * 60_000L); } catch (InterruptedException e) {}
                // resume audio
                player = new SoundPlayer();
                player.start();
                difficulty = Math.min(5, difficulty + 1); // escalate difficulty
                consecutiveFails = 0;
                // send training sample asynchronously
                final double avgRt = totalResponseSeconds / totalAttempts;
                final double accuracy = totalAttempts==0?0.0:((double)totalCorrect/totalAttempts);
                final int snoozes = snoozeCount;
                final int curDiff = difficulty;
                new Thread(() -> sendTrainSample(avgRt, accuracy, snoozes, curDiff)).start();
                continue;
            }
            try {
                double user = Double.parseDouble(ans);
                if (p.check(user)) {
                    totalCorrect++;
                    player.stopPlaying();
                    System.out.println("Correct! Alarm stopped. Have a great day.");
                    // show motivational quote (simple list)
                    showMotivation();
                    // send training sample
                    final double avgRt = totalResponseSeconds / totalAttempts;
                    final double accuracy = totalAttempts==0?0.0:((double)totalCorrect/totalAttempts);
                    final int snoozes = snoozeCount;
                    final int curDiff2 = difficulty;
                    new Thread(() -> sendTrainSample(avgRt, accuracy, snoozes, curDiff2)).start();
                    break;
                } else {
                    System.out.println("Incorrect. Try again or type 'snooze'.");
                    consecutiveFails++;
                    // ask service for recommended difficulty
                    final double avgRt = totalResponseSeconds / totalAttempts;
                    final double accuracy = totalAttempts==0?0.0:((double)totalCorrect/totalAttempts);
                    final int snoozes = snoozeCount;
                    Integer rec = getRecommendation(avgRt, accuracy, snoozes);
                    if (rec != null) difficulty = rec.intValue();
                    if (consecutiveFails >= 3) {
                        System.out.println("Too many failed attempts — increasing difficulty and continuing to ring.");
                        difficulty = Math.min(5, difficulty + 1);
                        consecutiveFails = 0;
                    }
                }
            } catch (NumberFormatException nfe) {
                System.out.println("Couldn't parse your answer. Please enter a numeric answer or 'snooze'.");
            }
        }
    }

    private static void showMotivation() {
        String[] quotes = new String[]{
            "Believe you can and you're halfway there. — Theodore Roosevelt",
            "The secret of getting ahead is getting started. — Mark Twain",
            "Don’t watch the clock; do what it does. Keep going. — Sam Levenson",
            "Push yourself, because no one else is going to do it for you.",
            "Great things never come from comfort zones.",
        };
        System.out.println("Motivation: " + quotes[new Random().nextInt(quotes.length)]);
    }

    private static Integer getRecommendation(double avgResponseTime, double accuracy, int snoozeCount) {
        try {
            URL url = new URL("http://127.0.0.1:5000/recommend");
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json; utf-8");
            con.setDoOutput(true);
            String json = String.format(Locale.ROOT, "{\"avg_response_time\": %.3f, \"accuracy\": %.3f, \"snooze_count\": %d}", avgResponseTime, accuracy, snoozeCount);
            try (OutputStream os = con.getOutputStream()) {
                byte[] input = json.getBytes("utf-8");
                os.write(input, 0, input.length);
            }
            int code = con.getResponseCode();
            if (code != 200) return null;
            try (BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), "utf-8"))) {
                StringBuilder resp = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) resp.append(line.trim());
                String r = resp.toString();
                // naive parse: look for "difficulty":number
                int idx = r.indexOf("difficulty");
                if (idx >= 0) {
                    int colon = r.indexOf(':', idx);
                    if (colon >= 0) {
                        String num = r.substring(colon+1).replaceAll("[^0-9]", "");
                        if (!num.isEmpty()) return Integer.parseInt(num);
                    }
                }
            }
        } catch (Exception e) {
            // service not available; ignore
        }
        return null;
    }

    private static void sendTrainSample(double avgResponseTime, double accuracy, int snoozeCount, int targetDifficulty) {
        try {
            URL url = new URL("http://127.0.0.1:5000/train");
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json; utf-8");
            con.setDoOutput(true);
            String json = String.format(Locale.ROOT, "{\"avg_response_time\": %.3f, \"accuracy\": %.3f, \"snooze_count\": %d, \"target_difficulty\": %d}", avgResponseTime, accuracy, snoozeCount, targetDifficulty);
            try (OutputStream os = con.getOutputStream()) {
                byte[] input = json.getBytes("utf-8");
                os.write(input, 0, input.length);
            }
            con.getResponseCode();
        } catch (Exception e) {
            // ignore failures silently
        }
    }

    // Simple math puzzle generator
    static class PuzzleGenerator {
        private final Random rnd = new Random();

        Puzzle generate(int difficulty) {
            // difficulty: 1..5
            switch (difficulty) {
                case 1: return generateArithmetic(2, 1, 10);
                case 2: return generateArithmetic(2, 5, 20);
                case 3: return generateArithmetic(3, 10, 50);
                case 4: return generateMixed(3, 10, 100);
                default: return generateMixed(4, 20, 200);
            }
        }

        private Puzzle generateArithmetic(int terms, int min, int max) {
            // generate simple expression with + and - and * maybe
            StringBuilder sb = new StringBuilder();
            double result = 0;
            for (int i = 0; i < terms; i++) {
                int num = rnd.nextInt(max - min + 1) + min;
                if (i == 0) {
                    sb.append(num);
                    result = num;
                } else {
                    int op = rnd.nextInt(3); // 0:+,1:-,2:*
                    if (op == 0) { sb.append(" + ").append(num); result += num; }
                    else if (op == 1) { sb.append(" - ").append(num); result -= num; }
                    else { sb.append(" * ").append(num); result *= num; }
                }
            }
            return new Puzzle(sb.toString(), result, false);
        }

        private Puzzle generateMixed(int terms, int min, int max) {
            // include division with rounding tolerance
            StringBuilder sb = new StringBuilder();
            double result = 0;
            for (int i = 0; i < terms; i++) {
                int num = rnd.nextInt(max - min + 1) + min;
                if (i == 0) { sb.append(num); result = num; }
                else {
                    int op = rnd.nextInt(4); // + - * /
                    if (op == 0) { sb.append(" + ").append(num); result += num; }
                    else if (op == 1) { sb.append(" - ").append(num); result -= num; }
                    else if (op == 2) { sb.append(" * ").append(num); result *= num; }
                    else {
                        // avoid division by zero; do integer-ish division but allow decimals
                        sb.append(" / ").append(num);
                        result /= num;
                    }
                }
            }
            return new Puzzle(sb.toString(), result, true);
        }
    }

    static class Puzzle {
        private final String expression;
        private final double answer;
        private final boolean allowTolerance;

        Puzzle(String expression, double answer, boolean allowTolerance) {
            this.expression = expression;
            this.answer = answer;
            this.allowTolerance = allowTolerance;
        }

        String prompt() {
            return "Compute: " + expression;
        }

        boolean check(double user) {
            if (allowTolerance) {
                return Math.abs(user - answer) < 0.01; // small tolerance for divisions
            } else {
                return Math.abs(user - answer) < 1e-9;
            }
        }
    }

    // Simple audio tone player that runs in its own thread. Uses javax.sound.sampled to synthesize a tone.
    // This avoids relying on the terminal bell and will play a looping tone until stopped.
    static class SoundPlayer {
        private volatile boolean playing = false;
        private Thread thread;

        void start() {
            if (playing) return;
            playing = true;
            thread = new Thread(() -> playLoop(), "AlarmSound");
            thread.setDaemon(true);
            thread.start();
        }

        void stopPlaying() {
            playing = false;
            if (thread != null) thread.interrupt();
        }

        private void playLoop() {
            // Create a 16-bit PCM, mono, 44100 Hz buffer and stream
            final float SAMPLE_RATE = 44100f;
            final int SAMPLE_SIZE = 2; // bytes
            final int BUFFER_SECONDS = 1;
            final int bufferSize = (int)(SAMPLE_RATE * BUFFER_SECONDS) * SAMPLE_SIZE;

            javax.sound.sampled.AudioFormat format = new javax.sound.sampled.AudioFormat(
                    SAMPLE_RATE, 16, 1, true, false);

            try (javax.sound.sampled.SourceDataLine line = javax.sound.sampled.AudioSystem.getSourceDataLine(format)) {
                line.open(format, bufferSize);
                line.start();

                // generate a tone that modulates slightly to become less annoying
                double baseFreq = 880.0; // A5
                double modFreq = 2.0; // Hz
                int bufferLen = 1024;
                byte[] buffer = new byte[bufferLen];

                double phase = 0.0;
                while (playing) {
                    for (int i = 0; i < bufferLen / 2; i++) {
                        double t = (phase + i) / SAMPLE_RATE;
                        double freq = baseFreq + 40 * Math.sin(2 * Math.PI * modFreq * t);
                        short sample = (short)(Math.sin(2 * Math.PI * freq * t) * 32767 * 0.4);
                        int idx = i * 2;
                        buffer[idx] = (byte)(sample & 0xFF);
                        buffer[idx+1] = (byte)((sample >> 8) & 0xFF);
                    }
                    phase += bufferLen / 2;
                    line.write(buffer, 0, buffer.length);
                }
                line.drain();
                line.stop();
            } catch (Throwable t) {
                // fallback attempt: system beep in case audio system unavailable
                while (playing) {
                    try { Toolkit.getDefaultToolkit().beep(); Thread.sleep(900); } catch (InterruptedException ie) { break; }
                    catch (Throwable ignore) { break; }
                }
            }
        }
    }
}
