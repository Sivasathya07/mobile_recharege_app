package com.pharmacyinventory.repository;

import com.pharmacyinventory.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    List<Invoice> findByStatus(Invoice.Status status);

    Invoice findByOrderOrderId(Long orderId);

    Invoice findBySaleSaleId(Long saleId);

    @Query("SELECT i FROM Invoice i WHERE i.issuedAt BETWEEN :startDate AND :endDate")
    List<Invoice> findInvoicesBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
}
