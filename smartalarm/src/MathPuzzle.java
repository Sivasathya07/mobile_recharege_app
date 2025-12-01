package src;

import java.util.Random;

public class MathPuzzle implements Puzzle {
    private String question;
    private int correctAnswer;
    private Random random;
    
    public MathPuzzle() {
        this.random = new Random();
        generatePuzzle();
    }
    
    private void generatePuzzle() {
        int a = random.nextInt(20) + 1;
        int b = random.nextInt(20) + 1;
        int operation = random.nextInt(3);
        
        switch(operation) {
            case 0: // Addition
                question = "Solve: " + a + " + " + b + " = ?";
                correctAnswer = a + b;
                break;
            case 1: // Subtraction
                question = "Solve: " + a + " - " + b + " = ?";
                correctAnswer = a - b;
                break;
            case 2: // Multiplication
                a = random.nextInt(10) + 1;
                b = random.nextInt(10) + 1;
                question = "Solve: " + a + " × " + b + " = ?";
                correctAnswer = a * b;
                break;
        }
    }
    
    @Override
    public String getQuestion() {
        return question;
    }
    
    @Override
    public boolean checkAnswer(String answer) {
        try {
            int userAnswer = Integer.parseInt(answer.trim());
            return userAnswer == correctAnswer;
        } catch (NumberFormatException e) {
            return false;
        }
    }
    
    @Override
    public String getCorrectAnswer() {
        return String.valueOf(correctAnswer);
    }
}