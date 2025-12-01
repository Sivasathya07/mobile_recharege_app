package src;

import java.util.Random;

public class MatchPuzzle implements Puzzle {
    private String question;
    private String correctAnswer;
    private Random random;
    
    public MatchPuzzle() {
        this.random = new Random();
        generatePuzzle();
    }
    
    private void generatePuzzle() {
        String[][] pairs = {
            {"Capital of France", "Paris"},
            {"Largest planet", "Jupiter"},
            {"Author of Hamlet", "Shakespeare"},
            {"Chemical symbol for Gold", "Au"}
        };
        
        String[] leftItems = new String[pairs.length];
        String[] rightItems = new String[pairs.length];
        
        for (int i = 0; i < pairs.length; i++) {
            leftItems[i] = pairs[i][0];
            rightItems[i] = pairs[i][1];
        }
        
        // Shuffle right items
        for (int i = rightItems.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            String temp = rightItems[i];
            rightItems[i] = rightItems[j];
            rightItems[j] = temp;
        }
        
        // Build question
        StringBuilder sb = new StringBuilder();
        sb.append("<html>Match the items:<br><br>");
        
        for (int i = 0; i < leftItems.length; i++) {
            sb.append((i + 1)).append(". ").append(leftItems[i]).append("<br>");
        }
        
        sb.append("<br>Options:<br>");
        for (int i = 0; i < rightItems.length; i++) {
            char letter = (char) ('A' + i);
            sb.append(letter).append(". ").append(rightItems[i]).append("<br>");
        }
        
        sb.append("<br>Format: 1A,2B,3C,4D</html>");
        question = sb.toString();
        
        // Build correct answer
        StringBuilder answerBuilder = new StringBuilder();
        for (int i = 0; i < pairs.length; i++) {
            String correctRight = pairs[i][1];
            for (int j = 0; j < rightItems.length; j++) {
                if (rightItems[j].equals(correctRight)) {
                    char letter = (char) ('A' + j);
                    answerBuilder.append(i + 1).append(letter);
                    if (i < pairs.length - 1) answerBuilder.append(",");
                    break;
                }
            }
        }
        correctAnswer = answerBuilder.toString().toLowerCase();
    }
    
    @Override
    public String getQuestion() {
        return question;
    }
    
    @Override
    public boolean checkAnswer(String answer) {
        return answer.trim().toLowerCase().equals(correctAnswer);
    }
    
    @Override
    public String getCorrectAnswer() {
        return correctAnswer;
    }
}