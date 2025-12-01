package com.loantracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LoanTrackerApplication {
    public static void main(String[] args) {
        SpringApplication.run(LoanTrackerApplication.class, args);
    }
}
