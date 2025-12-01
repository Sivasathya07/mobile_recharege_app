package com.pharmacyinventory.service;

import com.pharmacyinventory.model.Invoice;
import com.pharmacyinventory.model.Order;
import com.pharmacyinventory.model.Sale;
import com.pharmacyinventory.repository.InvoiceRepository;
import com.pharmacyinventory.repository.OrderRepository;
import com.pharmacyinventory.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private SaleRepository saleRepository;

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Optional<Invoice> getInvoiceById(Long id) {
        return invoiceRepository.findById(id);
    }

    public Invoice generateInvoiceForOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        Invoice invoice = new Invoice();
        invoice.setOrder(order);
        invoice.setInvoiceNumber("INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        invoice.setTotalAmount(order.getTotalAmount());
        invoice.setTaxAmount(order.getTotalAmount().multiply(BigDecimal.valueOf(0.1))); // 10% tax
        invoice.setDiscountAmount(BigDecimal.ZERO);
        invoice.setNetAmount(invoice.getTotalAmount().add(invoice.getTaxAmount()).subtract(invoice.getDiscountAmount()));

        return invoiceRepository.save(invoice);
    }

    public Invoice generateInvoiceForSale(Long saleId) {
        Sale sale = saleRepository.findById(saleId)
                .orElseThrow(() -> new IllegalArgumentException("Sale not found"));

        Invoice invoice = new Invoice();
        invoice.setSale(sale);
        invoice.setInvoiceNumber("INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        invoice.setTotalAmount(sale.getTotalPrice());
        invoice.setTaxAmount(sale.getTotalPrice().multiply(BigDecimal.valueOf(0.1))); // 10% tax
        invoice.setDiscountAmount(BigDecimal.ZERO);
        invoice.setNetAmount(invoice.getTotalAmount().add(invoice.getTaxAmount()).subtract(invoice.getDiscountAmount()));

        return invoiceRepository.save(invoice);
    }

    public Invoice updateInvoiceStatus(Long invoiceId, Invoice.Status status) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        invoice.setStatus(status);
        return invoiceRepository.save(invoice);
    }

    public List<Invoice> getInvoicesByStatus(Invoice.Status status) {
        return invoiceRepository.findByStatus(status);
    }

    public Invoice saveInvoice(Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }
}
