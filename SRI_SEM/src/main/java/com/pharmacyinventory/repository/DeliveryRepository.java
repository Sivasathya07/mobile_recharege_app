package com.pharmacyinventory.repository;

import com.pharmacyinventory.model.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

    List<Delivery> findByStatus(Delivery.Status status);

    List<Delivery> findByAssignedStaffUserId(Long staffId);

    Delivery findByOrderOrderId(Long orderId);
}
