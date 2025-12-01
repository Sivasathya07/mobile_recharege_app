package com.loantracker.repository;

import com.loantracker.model.Loan;
import com.loantracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByUser_UserId(Long userId);
    List<Loan> findByUser(User user);
}
