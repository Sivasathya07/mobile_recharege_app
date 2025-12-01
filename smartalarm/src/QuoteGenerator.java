package src;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class QuoteGenerator {
    private List<String> quotes;
    private Random random;
    
    public QuoteGenerator() {
        this.random = new Random();
        this.quotes = new ArrayList<>();
        loadQuotesFromFile();
        
        if (quotes.isEmpty()) {
            initializeDefaultQuotes();
        }
    }
    
    private void loadQuotesFromFile() {
        try {
            File file = new File("assets/quotes.txt");
            if (file.exists()) {
                BufferedReader reader = new BufferedReader(new FileReader(file));
                String line;
                while ((line = reader.readLine()) != null) {
                    if (!line.trim().isEmpty()) {
                        quotes.add(line.trim());
                    }
                }
                reader.close();
                System.out.println("Loaded " + quotes.size() + " quotes from file.");
            }
        } catch (IOException e) {
            System.err.println("Could not load quotes.txt: " + e.getMessage());
        }
    }
    
    private void initializeDefaultQuotes() {
        quotes.add("The secret of getting ahead is getting started. - Mark Twain");
        quotes.add("Don't watch the clock; do what it does. Keep going. - Sam Levenson");
        quotes.add("Every morning we are born again. What we do today matters most. - Buddha");
        quotes.add("Your time is limited, so don't waste it living someone else's life. - Steve Jobs");
    }
    
    public String getRandomQuote() {
        if (quotes.isEmpty()) {
            return "Have a great day!";
        }
        return quotes.get(random.nextInt(quotes.size()));
    }
}
