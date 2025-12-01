package com.pharmacyinventory.repository;

import com.pharmacyinventory.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    List<Sale> findByMedicineMedicineId(Long medicineId);

    @Query("SELECT s FROM Sale s WHERE s.saleDate BETWEEN :startDate AND :endDate")
    List<Sale> findSalesBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
}
