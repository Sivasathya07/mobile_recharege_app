package com.pharmacyinventory.repository;

import com.pharmacyinventory.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByStatus(Order.Status status);

    List<Order> findByCustomerPhone(String customerPhone);

    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate")
    List<Order> findOrdersBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
}
