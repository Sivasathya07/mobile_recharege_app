package src;

public interface Puzzle {
    String getQuestion();
    boolean checkAnswer(String answer);
    String getCorrectAnswer();
}