package src;

import javax.sound.sampled.*;
import java.io.File;
import java.io.IOException;

public class AudioPlayer {
    private Clip alarmClip;
    private boolean isPlaying;
    
    public AudioPlayer() {
        isPlaying = false;
    }
    
    public void playAlarmSound() {
        try {
            File soundFile = new File("assets/alarm_sound.wav");
            if (soundFile.exists()) {
                AudioInputStream audioInputStream = AudioSystem.getAudioInputStream(soundFile);
                alarmClip = AudioSystem.getClip();
                alarmClip.open(audioInputStream);
                alarmClip.loop(Clip.LOOP_CONTINUOUSLY);
                alarmClip.start();
                isPlaying = true;
            } else {
                // Fallback to system beep
                playBeepSound();
            }
        } catch (Exception e) {
            System.err.println("Error playing alarm sound: " + e.getMessage());
            playBeepSound();
        }
    }
    
    private void playBeepSound() {
        isPlaying = true;
        Thread beepThread = new Thread(() -> {
            while (isPlaying) {
                java.awt.Toolkit.getDefaultToolkit().beep();
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    break;
                }
            }
        });
        beepThread.setDaemon(true);
        beepThread.start();
    }
    
    public void stopAlarmSound() {
        isPlaying = false;
        if (alarmClip != null && alarmClip.isRunning()) {
            alarmClip.stop();
            alarmClip.close();
        }
    }
}