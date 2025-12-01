package com.pharmacyinventory.controller;

import com.pharmacyinventory.model.Supplier;
import com.pharmacyinventory.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierService.getAllSuppliers();
    }

    @PostMapping
    public Supplier addSupplier(@RequestBody Supplier supplier) {
        return supplierService.saveSupplier(supplier);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable Long id) {
        return supplierService.getSupplierById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable Long id, @RequestBody Supplier supplier) {
        if (!supplierService.getSupplierById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        supplier.setSupplierId(id);
        return ResponseEntity.ok(supplierService.saveSupplier(supplier));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        if (!supplierService.getSupplierById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        supplierService.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }
}
