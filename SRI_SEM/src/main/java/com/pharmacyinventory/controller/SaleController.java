package com.pharmacyinventory.controller;

import com.pharmacyinventory.model.Sale;
import com.pharmacyinventory.service.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    @Autowired
    private SaleService saleService;

    @GetMapping
    public List<Sale> getAllSales() {
        return saleService.getAllSales();
    }

    @PostMapping
    public Sale recordSale(@RequestBody Sale sale) {
        return saleService.recordSale(sale);
    }

    @GetMapping("/medicine/{id}")
    public List<Sale> getSalesByMedicine(@PathVariable Long id) {
        return saleService.getSalesByMedicine(id);
    }
}
