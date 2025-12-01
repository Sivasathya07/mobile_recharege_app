package com.pharmacyinventory.controller;

import com.pharmacyinventory.model.*;
import com.pharmacyinventory.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Controller
public class WebController {

    @Autowired
    private MedicineService medicineService;

    @Autowired
    private SupplierService supplierService;

    @Autowired
    private SaleService saleService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private DeliveryService deliveryService;

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private UserService userService;

    @GetMapping("/")
    public String home(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            User user = userService.getUserByUsername(auth.getName()).orElse(null);
            model.addAttribute("user", user);
        }
        return "index";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/register")
    public String register() {
        return "register";
    }

    @GetMapping("/medicines")
    public String listMedicines(Model model) {
        List<Medicine> medicines = medicineService.getAllMedicines();
        List<Supplier> suppliers = supplierService.getAllSuppliers();
        model.addAttribute("medicines", medicines);
        model.addAttribute("suppliers", suppliers);
        model.addAttribute("newMedicine", new Medicine());
        return "medicines";
    }

    @PostMapping("/medicines")
    public String addMedicine(Medicine medicine) {
        medicineService.saveMedicine(medicine);
        return "redirect:/medicines";
    }

    @GetMapping("/suppliers")
    public String listSuppliers(Model model) {
        List<Supplier> suppliers = supplierService.getAllSuppliers();
        model.addAttribute("suppliers", suppliers);
        model.addAttribute("newSupplier", new Supplier());
        return "suppliers";
    }

    @PostMapping("/suppliers")
    public String addSupplier(Supplier supplier) {
        supplierService.saveSupplier(supplier);
        return "redirect:/suppliers";
    }

    @GetMapping("/sales")
    public String listSales(Model model) {
        List<Sale> sales = saleService.getAllSales();
        List<Medicine> medicines = medicineService.getAllMedicines();
        model.addAttribute("sales", sales);
        model.addAttribute("medicines", medicines);
        model.addAttribute("newSale", new Sale());
        return "sales";
    }

    @PostMapping("/sales")
    public String addSale(@RequestParam("medicine") Long medicineId, @RequestParam("quantitySold") Integer quantitySold, @RequestParam("saleDate") String saleDate) {
        Sale sale = new Sale();
        Medicine medicine = medicineService.getMedicineById(medicineId).orElseThrow(() -> new IllegalArgumentException("Invalid medicine ID"));
        sale.setMedicine(medicine);
        sale.setQuantitySold(quantitySold);
        sale.setSaleDate(java.time.LocalDateTime.parse(saleDate + "T00:00:00"));
        saleService.saveSale(sale);
        return "redirect:/sales";
    }

    @GetMapping("/orders")
    public String listOrders(Model model) {
        List<Order> orders = orderService.getAllOrders();
        model.addAttribute("orders", orders);
        model.addAttribute("newOrder", new Order());
        return "orders";
    }

    @PostMapping("/orders")
    public String placeOrder(@RequestParam("customerName") String customerName,
                           @RequestParam("customerPhone") String customerPhone,
                           @RequestParam("customerAddress") String customerAddress,
                           @RequestParam("medicineId") Long medicineId,
                           @RequestParam("quantity") Integer quantity) throws IOException {
        try {
            Order order = new Order();
            order.setCustomerName(customerName);
            order.setCustomerPhone(customerPhone);
            order.setCustomerAddress(customerAddress);
            order.setOrderDate(java.time.LocalDateTime.now());
            order.setStatus(Order.Status.PENDING);

            // Create order item
            OrderItem item = new OrderItem();
            Medicine medicine = medicineService.getMedicineById(medicineId).orElseThrow(() -> new IllegalArgumentException("Invalid medicine ID"));
            item.setMedicine(medicine);
            item.setQuantityOrdered(quantity);
            item.setUnitPrice(medicine.getPricePerUnit());

            List<OrderItem> items = List.of(item);

            orderService.placeOrder(order, items);
            return "redirect:/orders?success=true";
        } catch (Exception e) {
            return "redirect:/orders?error=" + e.getMessage();
        }
    }

    @GetMapping("/deliveries")
    public String listDeliveries(Model model) {
        List<Delivery> deliveries = deliveryService.getAllDeliveries();
        List<User> deliveryStaff = userService.getAllUsers().stream()
                .filter(u -> u.getRole() == User.Role.DELIVERY_STAFF)
                .toList();
        model.addAttribute("deliveries", deliveries);
        model.addAttribute("deliveryStaff", deliveryStaff);
        return "deliveries";
    }

    @GetMapping("/billing")
    public String listInvoices(Model model) {
        List<Invoice> invoices = invoiceService.getAllInvoices();
        model.addAttribute("invoices", invoices);
        return "billing";
    }

    @GetMapping("/reports")
    public String reports(Model model) {
        // Spring Security handles authentication, this method only called for authenticated users
        // Add report data to model
        return "reports";
    }

    @GetMapping("/users")
    public String listUsers(Model model) {
        // Spring Security handles authentication, this method only called for authenticated users
        List<User> users = userService.getAllUsers();
        model.addAttribute("users", users);
        model.addAttribute("newUser", new User());
        return "users";
    }
}
