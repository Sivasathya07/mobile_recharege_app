package com.medicineinventory.service;

import com.medicineinventory.model.User;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    private List<User> users = new ArrayList<>();
    private Long nextId = 1L;
    
    public User save(User user) {
        if (user.getId() == null) {
            user.setId(nextId++);
        }
        users.add(user);
        return user;
    }
    
    public List<User> findAll() {
        return new ArrayList<>(users);
    }
    
    public Optional<User> findById(Long id) {
        return users.stream()
                   .filter(user -> user.getId().equals(id))
                   .findFirst();
    }
    
    public User findByEmail(String email) {
        return users.stream()
                   .filter(user -> email.equals(user.getEmail()))
                   .findFirst()
                   .orElse(null);
    }
    
    public User findByUsername(String username) {
        return users.stream()
                   .filter(user -> username.equals(user.getUsername()))
                   .findFirst()
                   .orElse(null);
    }
}