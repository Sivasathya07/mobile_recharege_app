package com.medicineinventory.repository;

import com.medicineinventory.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    List<Medicine> findByCategory(String category);
    List<Medicine> findByQuantityInStockLessThan(Integer quantity);
    
    @Query("SELECT m FROM Medicine m WHERE m.name LIKE %:name% OR m.brand LIKE %:name%")
    List<Medicine> searchByNameOrBrand(String name);
}