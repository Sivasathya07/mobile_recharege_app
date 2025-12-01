package com.medicineinventory.controller;

import com.medicineinventory.model.Medicine;
import com.medicineinventory.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;



@RestController
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
public class MedicineController {
    
    private final MedicineService medicineService;
    
    @PostMapping
    public ResponseEntity<Medicine> createMedicine(@RequestBody Medicine medicine) {
        Medicine savedMedicine = medicineService.createMedicine(medicine);
        return ResponseEntity.ok(savedMedicine);
    }
    
    @GetMapping
    public ResponseEntity<List<Medicine>> getAllMedicines() {
        List<Medicine> medicines = medicineService.getAllMedicines();
        return ResponseEntity.ok(medicines);
    }
    
    @GetMapping("/low-stock")
    public ResponseEntity<List<Medicine>> getLowStockMedicines() {
        List<Medicine> medicines = medicineService.getLowStockMedicines();
        return ResponseEntity.ok(medicines);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Medicine>> searchMedicines(@RequestParam String query) {
        List<Medicine> medicines = medicineService.searchMedicines(query);
        return ResponseEntity.ok(medicines);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getMedicineById(@PathVariable Long id) {
        Medicine medicine = medicineService.getMedicineById(id);
        return ResponseEntity.ok(medicine);
    }
}