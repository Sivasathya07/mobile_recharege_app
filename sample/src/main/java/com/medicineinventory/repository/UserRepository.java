package com.medicineinventory.repository;

import com.medicineinventory.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // This automatically gives you save(), findAll(), findById(), deleteById() etc.
    User findByEmail(String email);
    User findByUsername(String username);
}