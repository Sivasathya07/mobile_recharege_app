package com.pharmacyinventory.service;

import com.pharmacyinventory.model.*;
import com.pharmacyinventory.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    private final String uploadDir = "uploads/";

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> getOrdersByStatus(Order.Status status) {
        return orderRepository.findByStatus(status);
    }

    @Transactional
    public Order placeOrder(Order order, List<OrderItem> items) throws IOException {
        // Save order
        Order savedOrder = orderRepository.save(order);

        // Save order items and update stock
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (OrderItem item : items) {
            item.setOrder(savedOrder);
            item.setUnitPrice(item.getMedicine().getPricePerUnit());
            OrderItem savedItem = orderItemRepository.save(item);
            totalAmount = totalAmount.add(savedItem.getTotalPrice());

            // Update stock
            Medicine medicine = item.getMedicine();
            medicine.setQuantityInStock(medicine.getQuantityInStock() - item.getQuantityOrdered());
            medicineRepository.save(medicine);
        }

        savedOrder.setTotalAmount(totalAmount);
        savedOrder = orderRepository.save(savedOrder);



        // Create delivery
        Delivery delivery = new Delivery();
        delivery.setOrder(savedOrder);
        delivery.setStatus(Delivery.Status.PENDING);
        deliveryRepository.save(delivery);

        return savedOrder;
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, Order.Status status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
