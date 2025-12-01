package com.pharmacyinventory.repository;

import com.pharmacyinventory.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    @Query("SELECT m FROM Medicine m WHERE m.expiryDate BETWEEN :startDate AND :endDate")
    List<Medicine> findMedicinesNearExpiry(LocalDate startDate, LocalDate endDate);

    List<Medicine> findByQuantityInStockLessThan(Integer threshold);
}
