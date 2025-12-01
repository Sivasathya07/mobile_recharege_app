package com.loantracker.repository;

import com.loantracker.model.EMIPayment;
import com.loantracker.model.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EMIPaymentRepository extends JpaRepository<EMIPayment, Long> {
    List<EMIPayment> findByLoan_LoanId(Long loanId);
    List<EMIPayment> findByLoan(Loan loan);
    List<EMIPayment> findByStatusAndDueDateBefore(EMIPayment.PaymentStatus status, LocalDate date);
}
