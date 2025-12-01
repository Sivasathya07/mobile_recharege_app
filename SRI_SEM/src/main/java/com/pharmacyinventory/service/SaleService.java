package com.pharmacyinventory.service;

import com.pharmacyinventory.model.Medicine;
import com.pharmacyinventory.model.Sale;
import com.pharmacyinventory.repository.MedicineRepository;
import com.pharmacyinventory.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    public Optional<Sale> getSaleById(Long id) {
        return saleRepository.findById(id);
    }

    public Sale recordSale(Sale sale) {
        Medicine medicine = sale.getMedicine();
        if (medicine.getQuantityInStock() < sale.getQuantitySold()) {
            throw new IllegalArgumentException("Insufficient stock for sale");
        }
        medicine.setQuantityInStock(medicine.getQuantityInStock() - sale.getQuantitySold());
        medicineRepository.save(medicine);
        return saleRepository.save(sale);
    }

    public List<Sale> getSalesByMedicine(Long medicineId) {
        return saleRepository.findByMedicineMedicineId(medicineId);
    }

    public List<Sale> getSalesBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return saleRepository.findSalesBetweenDates(startDate, endDate);
    }

    public Sale saveSale(Sale sale) {
        Medicine medicine = sale.getMedicine();
        if (medicine.getQuantityInStock() < sale.getQuantitySold()) {
            throw new IllegalArgumentException("Insufficient stock for sale");
        }
        medicine.setQuantityInStock(medicine.getQuantityInStock() - sale.getQuantitySold());
        medicineRepository.save(medicine);
        return saleRepository.save(sale);
    }
}
