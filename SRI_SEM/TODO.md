# TODO: Remove Prescription from Order Management

- [x] Remove prescriptionPath field from Order.java model
- [x] Update OrderService.java to remove prescription handling in placeOrder method
- [x] Update OrderController.java to remove prescription parameter from placeOrder endpoint
- [x] Update WebController.java to remove prescription parameter from placeOrder method
- [x] Update orders.html to remove prescription input from the form
- [x] Test order placement to ensure orders are now saving to database
