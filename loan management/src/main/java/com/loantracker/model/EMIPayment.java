package com.loantracker.model;

import lombok.Data;
import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "emi_payments")
public class EMIPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long paymentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_id", nullable = false)
    private Loan loan;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "amount_paid", nullable = false, precision = 15, scale = 2)
    private BigDecimal amountPaid;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentStatus status = PaymentStatus.PENDING;

    public enum PaymentStatus {
        PENDING, PAID, OVERDUE
    }
}
