package com.loantracker.model;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email")
})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "contact_no", length = 20)
    private String contactNo;

    @Column(name = "join_date", nullable = false, updatable = false)
    private LocalDateTime joinDate = LocalDateTime.now();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Loan> loans = new ArrayList<>();

    // Helper method to add a loan
    public void addLoan(Loan loan) {
        loans.add(loan);
        loan.setUser(this);
    }

    // Helper method to remove a loan
    public void removeLoan(Loan loan) {
        loans.remove(loan);
        loan.setUser(null);
    }
}
