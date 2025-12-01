package src;

import javax.swing.*;
import javax.swing.Timer;
import java.awt.*;
import java.awt.event.*;
import java.text.SimpleDateFormat;
import java.util.*;
import src.*;
import src.AudioPlayer;
import src.QuoteGenerator;

public class SmartAlarmClock extends JFrame {
    private AlarmManager alarmManager;
    private AudioPlayer audioPlayer;
    private QuoteGenerator quoteGenerator;
    
    // GUI Components
    private JLabel currentTimeLabel;
    private JList<Alarm> alarmList;
    private DefaultListModel<Alarm> alarmListModel;
    private JButton setAlarmBtn, removeAlarmBtn;
    private JSpinner hourSpinner, minuteSpinner;
    private JComboBox<String> amPmComboBox;
    
    // Alarm Ringing Dialog
    private JDialog alarmDialog;
    private Puzzle currentPuzzle;
    private JLabel puzzleLabel;
    private JTextField answerField;
    
    public SmartAlarmClock() {
        initializeComponents();
        setupLayout();
        setupEventListeners();
        startClock();
        
        alarmManager = new AlarmManager();
        audioPlayer = new AudioPlayer();
        quoteGenerator = new QuoteGenerator();
        
        loadAlarms();
    }
    
    private void initializeComponents() {
        setTitle("Smart Alarm Clock ⏰");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(500, 600);
        setLocationRelativeTo(null);
        setResizable(false);
        
        // Current time label
        currentTimeLabel = new JLabel("", SwingConstants.CENTER);
        currentTimeLabel.setFont(new Font("Arial", Font.BOLD, 24));
        currentTimeLabel.setForeground(Color.BLUE);
        
        // Alarm list
        alarmListModel = new DefaultListModel<>();
        alarmList = new JList<>(alarmListModel);
        alarmList.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        alarmList.setFont(new Font("Arial", Font.PLAIN, 14));
        
        // Time spinners
        SpinnerNumberModel hourModel = new SpinnerNumberModel(7, 1, 12, 1);
        SpinnerNumberModel minuteModel = new SpinnerNumberModel(0, 0, 59, 1);
        hourSpinner = new JSpinner(hourModel);
        minuteSpinner = new JSpinner(minuteModel);
        
        // AM/PM combo box
        amPmComboBox = new JComboBox<>(new String[]{"AM", "PM"});
        
        // Buttons
        setAlarmBtn = new JButton("Set Alarm");
        removeAlarmBtn = new JButton("Remove Alarm");
        
        // Style buttons
        setAlarmBtn.setBackground(new Color(70, 130, 180));
        setAlarmBtn.setForeground(Color.WHITE);
        setAlarmBtn.setFont(new Font("Arial", Font.BOLD, 14));
        
        removeAlarmBtn.setBackground(new Color(220, 20, 60));
        removeAlarmBtn.setForeground(Color.WHITE);
        removeAlarmBtn.setFont(new Font("Arial", Font.BOLD, 14));
    }
    
    private void setupLayout() {
        setLayout(new BorderLayout(10, 10));
        
        // Main panel with padding
        JPanel mainPanel = new JPanel(new BorderLayout(10, 10));
        mainPanel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));
        
        // Current time panel
        JPanel timePanel = new JPanel(new BorderLayout());
        timePanel.setBorder(BorderFactory.createTitledBorder("Current Time"));
        timePanel.add(currentTimeLabel, BorderLayout.CENTER);
        
        // Alarm setting panel
        JPanel alarmSetPanel = new JPanel(new GridLayout(2, 1, 5, 5));
        alarmSetPanel.setBorder(BorderFactory.createTitledBorder("Set New Alarm"));
        
        JPanel timeInputPanel = new JPanel(new FlowLayout());
        timeInputPanel.add(new JLabel("Time:"));
        timeInputPanel.add(hourSpinner);
        timeInputPanel.add(new JLabel(":"));
        timeInputPanel.add(minuteSpinner);
        timeInputPanel.add(amPmComboBox);
        
        JPanel buttonPanel = new JPanel(new FlowLayout());
        buttonPanel.add(setAlarmBtn);
        buttonPanel.add(removeAlarmBtn);
        
        alarmSetPanel.add(timeInputPanel);
        alarmSetPanel.add(buttonPanel);
        
        // Alarm list panel
        JPanel alarmListPanel = new JPanel(new BorderLayout());
        alarmListPanel.setBorder(BorderFactory.createTitledBorder("Active Alarms"));
        alarmListPanel.add(new JScrollPane(alarmList), BorderLayout.CENTER);
        
        // Add all panels to main panel
        mainPanel.add(timePanel, BorderLayout.NORTH);
        mainPanel.add(alarmSetPanel, BorderLayout.CENTER);
        mainPanel.add(alarmListPanel, BorderLayout.SOUTH);
        
        add(mainPanel, BorderLayout.CENTER);
    }
    
    private void setupEventListeners() {
        setAlarmBtn.addActionListener(e -> setAlarm());
        removeAlarmBtn.addActionListener(e -> removeAlarm());
        
        // Check alarms every second
        Timer alarmCheckTimer = new Timer(1000, e -> checkAlarms());
        alarmCheckTimer.start();
    }
    
    private void startClock() {
        Timer clockTimer = new Timer(1000, e -> updateTime());
        clockTimer.start();
        updateTime();
    }
    
    private void updateTime() {
        SimpleDateFormat sdf = new SimpleDateFormat("hh:mm:ss a");
        String currentTime = sdf.format(new Date());
        currentTimeLabel.setText(currentTime);
    }
    
    private void setAlarm() {
        int hour = (int) hourSpinner.getValue();
        int minute = (int) minuteSpinner.getValue();
        String amPm = (String) amPmComboBox.getSelectedItem();
        
        // Convert to 24-hour format
        if (amPm.equals("PM") && hour != 12) {
            hour += 12;
        } else if (amPm.equals("AM") && hour == 12) {
            hour = 0;
        }
        
        Alarm alarm = new Alarm(hour, minute);
        alarmManager.addAlarm(alarm);
        updateAlarmList();
        
        JOptionPane.showMessageDialog(this, 
            "Alarm set for " + alarm.getFormattedTime(), 
            "Alarm Set", 
            JOptionPane.INFORMATION_MESSAGE);
    }
    
    private void removeAlarm() {
        int selectedIndex = alarmList.getSelectedIndex();
        if (selectedIndex != -1) {
            Alarm alarm = alarmListModel.get(selectedIndex);
            alarmManager.removeAlarm(alarm);
            updateAlarmList();
        } else {
            JOptionPane.showMessageDialog(this, 
                "Please select an alarm to remove", 
                "No Alarm Selected", 
                JOptionPane.WARNING_MESSAGE);
        }
    }
    
    private void updateAlarmList() {
        alarmListModel.clear();
        for (Alarm alarm : alarmManager.getAlarms()) {
            alarmListModel.addElement(alarm);
        }
    }
    
    private void loadAlarms() {
        updateAlarmList();
    }
    
    private void checkAlarms() {
        Calendar now = Calendar.getInstance();
        int currentHour = now.get(Calendar.HOUR_OF_DAY);
        int currentMinute = now.get(Calendar.MINUTE);
        
        for (Alarm alarm : alarmManager.getAlarms()) {
            if (alarm.isActive() && alarm.getHour() == currentHour && 
                alarm.getMinute() == currentMinute && now.get(Calendar.SECOND) == 0) {
                triggerAlarm(alarm);
            }
        }
    }
    
    private void triggerAlarm(Alarm alarm) {
        new Thread(() -> audioPlayer.playAlarmSound()).start();
        showAlarmDialog(alarm);
    }
    
    private void showAlarmDialog(Alarm alarm) {
        alarmDialog = new JDialog(this, "ALARM! WAKE UP! ⏰", true);
        alarmDialog.setSize(400, 300);
        alarmDialog.setLocationRelativeTo(this);
        alarmDialog.setDefaultCloseOperation(JDialog.DO_NOTHING_ON_CLOSE);
        
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));
        
        // Alarm header
        JLabel alarmLabel = new JLabel("⏰ ALARM RINGING! ⏰", SwingConstants.CENTER);
        alarmLabel.setFont(new Font("Arial", Font.BOLD, 18));
        alarmLabel.setForeground(Color.RED);
        
        // Generate puzzle
        currentPuzzle = generateRandomPuzzle();
        puzzleLabel = new JLabel("<html><div style='text-align: center;'>" + 
                               currentPuzzle.getQuestion() + "</div></html>", SwingConstants.CENTER);
        puzzleLabel.setFont(new Font("Arial", Font.PLAIN, 14));
        
        answerField = new JTextField();
        JButton submitBtn = new JButton("Submit Answer");
        submitBtn.setBackground(new Color(34, 139, 34));
        submitBtn.setForeground(Color.WHITE);
        
        submitBtn.addActionListener(e -> checkAnswer());
        answerField.addActionListener(e -> checkAnswer());
        
        panel.add(alarmLabel, BorderLayout.NORTH);
        panel.add(puzzleLabel, BorderLayout.CENTER);
        
        JPanel inputPanel = new JPanel(new BorderLayout(5, 5));
        inputPanel.add(new JLabel("Answer:"), BorderLayout.WEST);
        inputPanel.add(answerField, BorderLayout.CENTER);
        inputPanel.add(submitBtn, BorderLayout.EAST);
        
        panel.add(inputPanel, BorderLayout.SOUTH);
        
        alarmDialog.add(panel);
        alarmDialog.setVisible(true);
    }
    
    private Puzzle generateRandomPuzzle() {
        Random rand = new Random();
        int puzzleType = rand.nextInt(3);
        
        switch (puzzleType) {
            case 0:
                return new MathPuzzle();
            case 1:
                return new RiddlePuzzle();
            case 2:
                return new MatchPuzzle();
            default:
                return new MathPuzzle();
        }
    }
    
    private void checkAnswer() {
        String userAnswer = answerField.getText().trim();
        
        if (currentPuzzle.checkAnswer(userAnswer)) {
            audioPlayer.stopAlarmSound();
            alarmDialog.dispose();
            showMotivationQuote();
            
            // Remove the triggered alarm
            alarmManager.getAlarms().removeIf(alarm -> 
                alarm.getHour() == Calendar.getInstance().get(Calendar.HOUR_OF_DAY) &&
                alarm.getMinute() == Calendar.getInstance().get(Calendar.MINUTE));
            updateAlarmList();
            
        } else {
            JOptionPane.showMessageDialog(alarmDialog, 
                "Incorrect answer! Try again!", 
                "Wrong Answer", 
                JOptionPane.ERROR_MESSAGE);
            answerField.setText("");
            answerField.requestFocus();
        }
    }
    
    private void showMotivationQuote() {
        String quote = quoteGenerator.getRandomQuote();
        
        JDialog quoteDialog = new JDialog(this, "Good Morning! 🌞", true);
        quoteDialog.setSize(400, 200);
        quoteDialog.setLocationRelativeTo(this);
        
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));
        
        JLabel quoteLabel = new JLabel("<html><div style='text-align: center; font-style: italic;'>" + 
                                     quote + "</div></html>", SwingConstants.CENTER);
        quoteLabel.setFont(new Font("Arial", Font.PLAIN, 14));
        
        JButton closeBtn = new JButton("Start My Day! 🌟");
        closeBtn.setBackground(new Color(255, 165, 0));
        closeBtn.setForeground(Color.WHITE);
        closeBtn.addActionListener(e -> quoteDialog.dispose());
        
        panel.add(quoteLabel, BorderLayout.CENTER);
        panel.add(closeBtn, BorderLayout.SOUTH);
        
        quoteDialog.add(panel);
        quoteDialog.setVisible(true);
    }
}