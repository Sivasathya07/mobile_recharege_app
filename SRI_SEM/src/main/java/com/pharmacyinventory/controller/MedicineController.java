package com.pharmacyinventory.controller;

import com.pharmacyinventory.model.Medicine;
import com.pharmacyinventory.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    @Autowired
    private MedicineService medicineService;

    @GetMapping
    public List<Medicine> getAllMedicines() {
        return medicineService.getAllMedicines();
    }

    @PostMapping
    public Medicine addMedicine(@RequestBody Medicine medicine) {
        return medicineService.saveMedicine(medicine);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getMedicineById(@PathVariable Long id) {
        return medicineService.getMedicineById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medicine> updateMedicine(@PathVariable Long id, @RequestBody Medicine medicine) {
        if (!medicineService.getMedicineById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        medicine.setMedicineId(id);
        return ResponseEntity.ok(medicineService.saveMedicine(medicine));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicine(@PathVariable Long id) {
        if (!medicineService.getMedicineById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        medicineService.deleteMedicine(id);
        return ResponseEntity.noContent().build();
    }
}
