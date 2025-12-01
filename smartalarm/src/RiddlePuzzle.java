package src;

import java.util.Random;

public class RiddlePuzzle implements Puzzle {
    private String question;
    private String correctAnswer;
    private Random random;
    
    public RiddlePuzzle() {
        this.random = new Random();
        generatePuzzle();
    }
    
    private void generatePuzzle() {
        String[][] riddles = {
            {"I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", "echo"},
            {"The more of this there is, the less you see. What is it?", "darkness"},
            {"What has keys but can't open locks?", "piano"},
            {"What has to be broken before you can use it?", "egg"},
            {"I'm tall when I'm young, and I'm short when I'm old. What am I?", "candle"}
        };
        
        int index = random.nextInt(riddles.length);
        question = riddles[index][0];
        correctAnswer = riddles[index][1];
    }
    
    @Override
    public String getQuestion() {
        return question;
    }
    
    @Override
    public boolean checkAnswer(String answer) {
        return answer.trim().equalsIgnoreCase(correctAnswer);
    }
    
    @Override
    public String getCorrectAnswer() {
        return correctAnswer;
    }
}