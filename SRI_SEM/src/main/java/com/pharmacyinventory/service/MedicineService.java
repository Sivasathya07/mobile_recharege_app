package com.pharmacyinventory.service;

import com.pharmacyinventory.model.Medicine;
import com.pharmacyinventory.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class MedicineService {

    @Autowired
    private MedicineRepository medicineRepository;

    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    public Optional<Medicine> getMedicineById(Long id) {
        return medicineRepository.findById(id);
    }

    public Medicine saveMedicine(Medicine medicine) {
        if (medicine.getExpiryDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Expiry date must be in the future");
        }
        if (medicine.getQuantityInStock() < 0) {
            throw new IllegalArgumentException("Quantity in stock cannot be negative");
        }
        return medicineRepository.save(medicine);
    }

    public void deleteMedicine(Long id) {
        medicineRepository.deleteById(id);
    }

    public List<Medicine> getMedicinesNearExpiry(int days) {
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(days);
        return medicineRepository.findMedicinesNearExpiry(startDate, endDate);
    }

    public List<Medicine> getLowStockMedicines(int threshold) {
        return medicineRepository.findByQuantityInStockLessThan(threshold);
    }
}
