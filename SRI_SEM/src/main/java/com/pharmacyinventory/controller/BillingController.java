package com.pharmacyinventory.controller;

import com.pharmacyinventory.model.Invoice;
import com.pharmacyinventory.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    @Autowired
    private InvoiceService invoiceService;

    @GetMapping("/invoices")
    public List<Invoice> getAllInvoices() {
        return invoiceService.getAllInvoices();
    }

    @PostMapping("/invoices/order/{orderId}")
    public Invoice generateInvoiceForOrder(@PathVariable Long orderId) {
        return invoiceService.generateInvoiceForOrder(orderId);
    }

    @PostMapping("/invoices/sale/{saleId}")
    public Invoice generateInvoiceForSale(@PathVariable Long saleId) {
        return invoiceService.generateInvoiceForSale(saleId);
    }

    @GetMapping("/invoices/{id}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable Long id) {
        return invoiceService.getInvoiceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/invoices/{id}/status")
    public Invoice updateInvoiceStatus(@PathVariable Long id, @RequestParam Invoice.Status status) {
        return invoiceService.updateInvoiceStatus(id, status);
    }

    @GetMapping("/invoices/status/{status}")
    public List<Invoice> getInvoicesByStatus(@PathVariable Invoice.Status status) {
        return invoiceService.getInvoicesByStatus(status);
    }

    @DeleteMapping("/invoices/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        if (!invoiceService.getInvoiceById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        invoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }
}
