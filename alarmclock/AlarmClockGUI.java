import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.*;
import java.util.concurrent.*;
import javax.sound.sampled.*;
import java.io.*;
import java.net.*;

/**
 * AlarmClockGUI — opens in its own window (no terminal interaction).
 * - Schedule an alarm by HH:mm or +N minutes
 * - Plays a looping synthesized tone in a background thread
 * - Presents math puzzles in a dialog; alarm stops when user answers correctly
 * - Supports snooze (pauses sound for 1 minute and increases difficulty)
 * - Optionally calls local Flask service at 127.0.0.1:5000 for difficulty recommendations
 */
public class AlarmClockGUI {
    private JFrame frame;
    private JTextField timeField;
    private JButton scheduleButton;
    private JLabel statusLabel;
    private ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new AlarmClockGUI().createAndShow());
    }

    private void createAndShow() {
        frame = new JFrame("Smart Alarm Clock — GUI");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(420, 160);
        frame.setLayout(new BorderLayout(8,8));

        JPanel top = new JPanel(new FlowLayout(FlowLayout.LEFT, 8, 12));
        top.add(new JLabel("Enter alarm (HH:mm or +N minutes):"));
        timeField = new JTextField(10);
        timeField.setText("+0");
        top.add(timeField);
        scheduleButton = new JButton("Schedule");
        top.add(scheduleButton);
        frame.add(top, BorderLayout.NORTH);

        statusLabel = new JLabel("Ready.");
        frame.add(statusLabel, BorderLayout.CENTER);

        scheduleButton.addActionListener(e -> onSchedule());

        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }

    private void onSchedule() {
        String s = timeField.getText().trim();
        long triggerMillis;
        try {
            triggerMillis = parseTimeToMillis(s);
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(frame, "Invalid time format. Use HH:mm or +N", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }
        Date d = new Date(triggerMillis);
        statusLabel.setText("Alarm set for: " + d.toString());
        long delay = Math.max(0, triggerMillis - System.currentTimeMillis());
        scheduler.schedule(() -> SwingUtilities.invokeLater(() -> triggerAlarmUI()), delay, TimeUnit.MILLISECONDS);
    }

    private long parseTimeToMillis(String s) {
        s = s.trim();
        if (s.startsWith("+")) {
            int minutes = Integer.parseInt(s.substring(1));
            return System.currentTimeMillis() + minutes * 60_000L;
        }
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
        if (t < System.currentTimeMillis()) t += 24L*60*60*1000;
        return t;
    }

    private void triggerAlarmUI() {
        statusLabel.setText("Alarm ringing — solve puzzle to stop.");
        AlarmDialog dialog = new AlarmDialog(frame);
        dialog.startAndShow();
        if (dialog.wasSolved()) {
            statusLabel.setText("Alarm stopped — have a great day!");
        } else {
            statusLabel.setText("Alarm dismissed.");
        }
    }

    // Dialog that shows puzzle and manages sound
    static class AlarmDialog extends JDialog {
        private volatile boolean solved = false;
        private SoundPlayer player;
        private int difficulty = 1;
        private int consecutiveFails = 0;

        AlarmDialog(Frame owner) {
            super(owner, "Alarm — Solve to stop", true);
            setLayout(new BorderLayout(8,8));
            setSize(480, 220);
            setLocationRelativeTo(owner);
        }

        void startAndShow() {
            player = new SoundPlayer();
            player.start();
            showNextPuzzle();
            setVisible(true);
        }

        boolean wasSolved() { return solved; }

        private void showNextPuzzle() {
            Puzzle p = PuzzleGeneratorStatic.generate(difficulty);
            getContentPane().removeAll();
            JPanel center = new JPanel(new BorderLayout(6,6));
            JLabel prompt = new JLabel("Compute: " + p.prompt());
            prompt.setFont(prompt.getFont().deriveFont(Font.PLAIN, 16f));
            center.add(prompt, BorderLayout.CENTER);

            JPanel bottom = new JPanel(new FlowLayout(FlowLayout.CENTER, 8, 8));
            JTextField answerField = new JTextField(10);
            bottom.add(answerField);
            JButton submit = new JButton("Submit");
            JButton snooze = new JButton("Snooze 1m");
            bottom.add(submit);
            bottom.add(snooze);
            getContentPane().add(center, BorderLayout.CENTER);
            getContentPane().add(bottom, BorderLayout.SOUTH);
            revalidate(); repaint();

            submit.addActionListener(ev -> {
                String text = answerField.getText().trim();
                try {
                    double val = Double.parseDouble(text);
                    if (p.check(val)) {
                        solved = true;
                        player.stopPlaying();
                        showMotivationInDialog();
                        dispose();
                    } else {
                        consecutiveFails++;
                        JOptionPane.showMessageDialog(this, "Incorrect. Try again.", "Try again", JOptionPane.WARNING_MESSAGE);
                        if (consecutiveFails >= 3) {
                            difficulty = Math.min(5, difficulty + 1);
                            consecutiveFails = 0;
                        }
                        showNextPuzzle();
                    }
                } catch (NumberFormatException nfe) {
                    JOptionPane.showMessageDialog(this, "Please enter a numeric answer or press Snooze.", "Input error", JOptionPane.ERROR_MESSAGE);
                }
            });

            snooze.addActionListener(ev -> {
                player.stopPlaying();
                difficulty = Math.min(5, difficulty + 1);
                // snooze for 1 minute
                new Thread(() -> {
                    try { Thread.sleep(60_000L); } catch (InterruptedException e) {}
                    player = new SoundPlayer();
                    player.start();
                    SwingUtilities.invokeLater(() -> showNextPuzzle());
                }).start();
                JOptionPane.showMessageDialog(this, "Snoozed for 1 minute. Difficulty increased.", "Snoozed", JOptionPane.INFORMATION_MESSAGE);
            });
        }

        private void showMotivationInDialog() {
            String[] quotes = new String[]{
                "Believe you can and you're halfway there. — Theodore Roosevelt",
                "The secret of getting ahead is getting started. — Mark Twain",
                "Don’t watch the clock; do what it does. Keep going. — Sam Levenson",
                "Push yourself, because no one else is going to do it for you.",
                "Great things never come from comfort zones.",
            };
            String q = quotes[new Random().nextInt(quotes.length)];
            JOptionPane.showMessageDialog(this, q, "Motivation", JOptionPane.PLAIN_MESSAGE);
        }
    }

    // Static puzzle generator so GUI file is self-contained
    static class PuzzleGeneratorStatic {
        private static final Random rnd = new Random();

        static Puzzle generate(int difficulty) {
            if (difficulty <= 2) return genArith(2, 1, 10 * difficulty);
            if (difficulty == 3) return genArith(3, 5, 40);
            return genMixed(Math.max(3, difficulty), 10, 200);
        }

        private static Puzzle genArith(int terms, int lo, int hi) {
            StringBuilder sb = new StringBuilder();
            double res = 0;
            for (int i=0;i<terms;i++){
                int n = rnd.nextInt(hi-lo+1)+lo;
                if (i==0){ sb.append(n); res = n; }
                else { int op = rnd.nextInt(3); if (op==0){ sb.append(" + ").append(n); res+=n;} else if (op==1){ sb.append(" - ").append(n); res-=n;} else { sb.append(" * ").append(n); res*=n; } }
            }
            return new Puzzle(sb.toString(), res, false);
        }

        private static Puzzle genMixed(int terms, int lo, int hi){
            StringBuilder sb = new StringBuilder();
            double res = 0;
            for (int i=0;i<terms;i++){
                int n = rnd.nextInt(hi-lo+1)+lo;
                if (i==0){ sb.append(n); res = n; }
                else { int op = rnd.nextInt(4); if (op==0){ sb.append(" + ").append(n); res+=n;} else if (op==1){ sb.append(" - ").append(n); res-=n;} else if (op==2){ sb.append(" * ").append(n); res*=n;} else { sb.append(" / ").append(n); res/=n;} }
            }
            return new Puzzle(sb.toString(), res, true);
        }
    }

    static class Puzzle {
        final String expr; final double answer; final boolean tol;
        Puzzle(String e, double a, boolean t){ expr=e; answer=a; tol=t; }
        String prompt(){ return expr; }
        boolean check(double v){ if (tol) return Math.abs(v-answer)<0.01; return Math.abs(v-answer)<1e-9; }
    }

    // Simple SoundPlayer using javax.sound.sampled
    static class SoundPlayer {
        private volatile boolean playing = false;
        private Thread thread;

        void start() {
            if (playing) return;
            playing = true;
            thread = new Thread(this::playLoop, "GUIAlarmSound");
            thread.setDaemon(true);
            thread.start();
        }

        void stopPlaying() {
            playing = false;
            if (thread != null) thread.interrupt();
        }

        private void playLoop() {
            final float SAMPLE_RATE = 44100f;
            final int bufferLen = 2048;
            AudioFormat fmt = new AudioFormat(SAMPLE_RATE, 16, 1, true, false);
            try (SourceDataLine line = AudioSystem.getSourceDataLine(fmt)){
                line.open(fmt, bufferLen*2);
                line.start();
                double phase = 0.0;
                while (playing) {
                    byte[] buf = new byte[bufferLen];
                    for (int i=0;i<bufferLen/2;i++){
                        double t = (phase + i) / SAMPLE_RATE;
                        double freq = 880 + 40*Math.sin(2*Math.PI*2*t);
                        short sample = (short)(Math.sin(2*Math.PI*freq*t)*32767*0.4);
                        int idx = i*2; buf[idx] = (byte)(sample & 0xFF); buf[idx+1] = (byte)((sample>>8)&0xFF);
                    }
                    phase += bufferLen/2;
                    line.write(buf, 0, buf.length);
                }
                line.drain(); line.stop();
            } catch (Throwable t) {
                // fallback to system beep
                while (playing) {
                    try { Toolkit.getDefaultToolkit().beep(); Thread.sleep(900); } catch (InterruptedException ie) { break; } catch (Throwable ignore){ break; }
                }
            }
        }
    }
}
