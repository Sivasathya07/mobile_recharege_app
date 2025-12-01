package com.loantracker.model;

import lombok.Data;
import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "loans")
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "loan_id")
    private Long loanId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "loan_type", nullable = false, length = 50)
    private String loanType;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal principal;

    @Column(name = "interest_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal interestRate;

    @Column(name = "tenure_months", nullable = false)
    private Integer tenureMonths;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "emi_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal emiAmount;

    @Column(name = "total_payable", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalPayable;

    @Column(name = "remaining_balance", nullable = false, precision = 15, scale = 2)
    private BigDecimal remainingBalance;

    @OneToMany(mappedBy = "loan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EMIPayment> emiPayments = new ArrayList<>();

    // Helper method to add an EMI payment
    public void addEmiPayment(EMIPayment emiPayment) {
        emiPayments.add(emiPayment);
        emiPayment.setLoan(this);
    }

    // Helper method to remove an EMI payment
    public void removeEmiPayment(EMIPayment emiPayment) {
        emiPayments.remove(emiPayment);
        emiPayment.setLoan(null);
    }
}
