package com.pharmacyinventory.controller;

import com.pharmacyinventory.model.*;
import com.pharmacyinventory.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private MedicineService medicineService;

    @Autowired
    private SaleService saleService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private DeliveryService deliveryService;

    @Autowired
    private InvoiceService invoiceService;

    @GetMapping("/stock")
    public List<Medicine> getStockReport() {
        return medicineService.getAllMedicines();
    }

    @GetMapping("/expiry")
    public List<Medicine> getExpiryReport(@RequestParam(defaultValue = "30") int days) {
        return medicineService.getMedicinesNearExpiry(days);
    }

    @GetMapping("/low-stock")
    public List<Medicine> getLowStockReport(@RequestParam(defaultValue = "10") int threshold) {
        return medicineService.getLowStockMedicines(threshold);
    }

    @GetMapping("/sales")
    public List<Sale> getSalesReport(@RequestParam(required = false) String startDate,
                                    @RequestParam(required = false) String endDate) {
        LocalDateTime start = startDate != null ? LocalDateTime.parse(startDate) : LocalDateTime.now().minusMonths(1);
        LocalDateTime end = endDate != null ? LocalDateTime.parse(endDate) : LocalDateTime.now();
        return saleService.getSalesBetweenDates(start, end);
    }

    @GetMapping("/orders")
    public List<Order> getOrderReport(@RequestParam(required = false) String startDate,
                                     @RequestParam(required = false) String endDate) {
        LocalDateTime start = startDate != null ? LocalDateTime.parse(startDate) : LocalDateTime.now().minusMonths(1);
        LocalDateTime end = endDate != null ? LocalDateTime.parse(endDate) : LocalDateTime.now();
        return orderService.getOrdersByStatus(Order.Status.DELIVERED); // Only delivered orders for report
    }

    @GetMapping("/deliveries")
    public List<Delivery> getDeliveryReport(@RequestParam(required = false) Delivery.Status status) {
        if (status != null) {
            return deliveryService.getDeliveriesByStatus(status);
        }
        return deliveryService.getAllDeliveries();
    }

    @GetMapping("/invoices")
    public List<Invoice> getInvoiceReport(@RequestParam(required = false) Invoice.Status status) {
        if (status != null) {
            return invoiceService.getInvoicesByStatus(status);
        }
        return invoiceService.getAllInvoices();
    }

    @GetMapping("/summary")
    public Map<String, Object> getSummaryReport() {
        Map<String, Object> summary = new HashMap<>();

        // Medicine stats
        List<Medicine> allMedicines = medicineService.getAllMedicines();
        List<Medicine> lowStock = medicineService.getLowStockMedicines(10);
        List<Medicine> nearExpiry = medicineService.getMedicinesNearExpiry(30);

        summary.put("totalMedicines", allMedicines.size());
        summary.put("lowStockMedicines", lowStock.size());
        summary.put("nearExpiryMedicines", nearExpiry.size());

        // Sales stats
        List<Sale> recentSales = saleService.getSalesBetweenDates(LocalDateTime.now().minusMonths(1), LocalDateTime.now());
        BigDecimal totalSales = recentSales.stream()
                .map(Sale::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        summary.put("recentSalesCount", recentSales.size());
        summary.put("recentSalesTotal", totalSales);

        // Order stats
        List<Order> allOrders = orderService.getAllOrders();
        long deliveredOrders = allOrders.stream().filter(o -> o.getStatus() == Order.Status.DELIVERED).count();
        summary.put("totalOrders", allOrders.size());
        summary.put("deliveredOrders", deliveredOrders);

        // Invoice stats
        List<Invoice> allInvoices = invoiceService.getAllInvoices();
        BigDecimal totalRevenue = allInvoices.stream()
                .filter(i -> i.getStatus() == Invoice.Status.PAID)
                .map(Invoice::getNetAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        summary.put("totalInvoices", allInvoices.size());
        summary.put("totalRevenue", totalRevenue);

        return summary;
    }
}
