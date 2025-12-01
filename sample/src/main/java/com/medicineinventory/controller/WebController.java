package com.medicineinventory.controller;

import com.medicineinventory.service.MedicineService;
import com.medicineinventory.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class WebController {
    
    private final UserService userService;
    private final MedicineService medicineService;
    
    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("message", "Welcome to Medicine Inventory System");
        return "index";
    }
    
    @GetMapping("/users")
    public String usersPage(Model model) {
        model.addAttribute("users", userService.getAllUsers());
        return "users";
    }
    
    @GetMapping("/medicines")
    public String medicinesPage(Model model) {
        model.addAttribute("medicines", medicineService.getAllMedicines());
        return "medicines";

    
    }
}