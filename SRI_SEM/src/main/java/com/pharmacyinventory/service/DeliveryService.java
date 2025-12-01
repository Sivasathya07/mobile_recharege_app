package com.pharmacyinventory.service;

import com.pharmacyinventory.model.Delivery;
import com.pharmacyinventory.model.Order;
import com.pharmacyinventory.model.User;
import com.pharmacyinventory.repository.DeliveryRepository;
import com.pharmacyinventory.repository.OrderRepository;
import com.pharmacyinventory.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DeliveryService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    public Optional<Delivery> getDeliveryById(Long id) {
        return deliveryRepository.findById(id);
    }

    public Delivery getDeliveryByOrderId(Long orderId) {
        return deliveryRepository.findByOrderOrderId(orderId);
    }

    public List<Delivery> getDeliveriesByStatus(Delivery.Status status) {
        return deliveryRepository.findByStatus(status);
    }

    public List<Delivery> getDeliveriesByStaff(Long staffId) {
        return deliveryRepository.findByAssignedStaffUserId(staffId);
    }

    public Delivery assignDeliveryStaff(Long deliveryId, Long staffId) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found"));
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new IllegalArgumentException("Staff not found"));
        delivery.setAssignedStaff(staff);
        return deliveryRepository.save(delivery);
    }

    public Delivery updateDeliveryStatus(Long deliveryId, Delivery.Status status) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found"));

        delivery.setStatus(status);

        if (status == Delivery.Status.DISPATCHED && delivery.getDispatchedAt() == null) {
            delivery.setDispatchedAt(LocalDateTime.now());
        } else if (status == Delivery.Status.DELIVERED && delivery.getDeliveredAt() == null) {
            delivery.setDeliveredAt(LocalDateTime.now());
            // Update order status
            Order order = delivery.getOrder();
            order.setStatus(Order.Status.DELIVERED);
            orderRepository.save(order);
        }

        return deliveryRepository.save(delivery);
    }

    public Delivery saveDelivery(Delivery delivery) {
        return deliveryRepository.save(delivery);
    }

    public void deleteDelivery(Long id) {
        deliveryRepository.deleteById(id);
    }
}
