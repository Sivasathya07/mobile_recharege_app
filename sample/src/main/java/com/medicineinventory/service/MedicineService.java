package com.medicineinventory.service;

import com.medicineinventory.model.Medicine;
import com.medicineinventory.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicineService {
    
    private final MedicineRepository medicineRepository;
    
    public Medicine createMedicine(Medicine medicine) {
        return medicineRepository.save(medicine);
    }
    
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }
    
    public List<Medicine> getLowStockMedicines() {
        return medicineRepository.findByQuantityInStockLessThan(10);
    }
    
    public Medicine getMedicineById(Long id) {
        return medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
    }
    
    public List<Medicine> searchMedicines(String query) {
        return medicineRepository.searchByNameOrBrand(query);
    }
}