-- NordWear Test Data Seed File

-- Clear tables before seeding to ensure a clean state (optional, but good practice)
-- Use with caution: TRUNCATE cannot be easily undone.
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `category`;
TRUNCATE TABLE `color`;
TRUNCATE TABLE `size`;
TRUNCATE TABLE `product`;
TRUNCATE TABLE `product_quantity`;
TRUNCATE TABLE `customer`;
TRUNCATE TABLE `order`;
TRUNCATE TABLE `order_item`;
TRUNCATE TABLE `cart_item`;
TRUNCATE TABLE `customer_likes`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Insert Categories
INSERT INTO `category` (`id`, `name`) VALUES
(1, 'T-Shirts'),
(2, 'Hoodies'),
(3, 'Jackets'),
(4, 'Pants');

-- 2. Insert Colors
INSERT INTO `color` (`id`, `name`) VALUES
(1, 'Black'),
(2, 'White'),
(3, 'Heather Grey'),
(4, 'Navy Blue');

-- 3. Insert Sizes
INSERT INTO `size` (`id`, `name`) VALUES
(1, 'S'),
(2, 'M'),
(3, 'L'),
(4, 'XL');

-- 4. Insert Products
-- Note: `deleted_at` is set to NULL for all active products.
INSERT INTO `product` (`id`, `name`, `price`, `offer_price`, `category_Id`, `status`, `deleted_at`) VALUES
(1, 'Nordic Rune Tee', 29.99, 24.99, 1, 'ONLINE', NULL),
(2, 'Viking Spirit Hoodie', 69.99, NULL, 2, 'OFFLINE', NULL),
(3, 'Fjörd Explorer Jacket', 149.99, 129.99, 3, 'DRAFT', NULL),
(4, 'Urban Cargo Pants', 79.99, NULL, 4, 'ONLINE', NULL),
(5, 'Arctic Patrol Parka', 199.99, NULL, 3, 'ONLINE', NULL),
(6, 'Longship Crewneck', 59.99, 54.99, 2, 'DRAFT', NULL),
(7, 'Asgardian Denim Jeans', 89.99, NULL, 4, 'ONLINE', NULL),
(8, 'Basic Logo Tee', 24.99, NULL, 1, 'DRAFT', NULL);

-- 5. Insert Product Quantities (Inventory/Stock)
INSERT INTO `product_quantity` (`productId`, `sizeId`, `colorId`, `quantity`) VALUES
-- Nordic Rune Tee (Product 1)
(1, 1, 1, 50), (1, 2, 1, 50), (1, 3, 1, 30), (1, 4, 1, 10), -- Black
(1, 1, 2, 40), (1, 2, 2, 40), (1, 3, 2, 25), (1, 4, 2, 5),  -- White
-- Viking Spirit Hoodie (Product 2)
(2, 2, 3, 30), (2, 3, 3, 30), (2, 4, 3, 20), -- Heather Grey
(2, 2, 4, 25), (2, 3, 4, 25), (2, 4, 4, 15), -- Navy Blue
-- Fjörd Explorer Jacket (Product 3)
(3, 1, 4, 15), (3, 2, 4, 20), (3, 3, 4, 15), (3, 4, 4, 10), -- Navy Blue
-- Urban Cargo Pants (Product 4)
(4, 2, 1, 40), (4, 3, 1, 40), -- Black
(4, 2, 4, 30), (4, 3, 4, 30), -- Navy Blue
-- Arctic Patrol Parka (Product 5)
(5, 3, 4, 20), (5, 4, 4, 15), -- Navy Blue
-- Longship Crewneck (Product 6)
(6, 1, 3, 35), (6, 2, 3, 35), (6, 3, 3, 25), -- Heather Grey
-- Asgardian Denim Jeans (Product 7)
(7, 2, 1, 45), (7, 3, 1, 45), -- Black
-- Basic Logo Tee (Product 8)
(8, 1, 2, 60), (8, 2, 2, 60), (8, 3, 2, 50), (8, 4, 2, 20); -- White

-- 6. Insert Customers
INSERT INTO `customer` (`id`, `created_at`, `deleted_at`) VALUES
(1, NOW(), NULL),
(2, NOW(), NULL);

-- 7. Insert Orders
-- Using hardcoded dates for consistency in testing
INSERT INTO `order` (`id`, `customerId`, `subtotal`, `created_at`, `deleted_at`) VALUES
(1, 1, 54.98, '2025-11-15 10:30:00', NULL),
(2, 2, 229.98, '2025-11-20 14:00:00', NULL),
(3, 1, 69.99, '2025-11-28 18:45:00', NULL);

-- 8. Insert Order Items
INSERT INTO `order_item` (`orderId`, `productId`, `sizeId`, `colorId`, `quantity`, `price_each`, `total_price`) VALUES
-- Order 1 (Customer 1)
(1, 1, 2, 1, 2, 24.99, 49.98), -- 2x Nordic Rune Tee (M, Black)
-- Order 2 (Customer 2)
(2, 3, 3, 4, 1, 129.99, 129.99), -- 1x Fjörd Explorer Jacket (L, Navy Blue)
(2, 4, 3, 1, 1, 79.99, 79.99), -- 1x Urban Cargo Pants (L, Black)
-- Order 3 (Customer 1)
(3, 2, 4, 3, 1, 69.99, 69.99); -- 1x Viking Spirit Hoodie (XL, Heather Grey)

-- 9. (Optional) Insert items into cart
INSERT INTO `cart_item` (`customerId`, `productId`, `sizeId`, `colorId`, `quantity`) VALUES
(1, 4, 2, 4, 1); -- Customer 1 has 1x Urban Cargo Pants (M, Navy Blue) in their cart.

-- 10. (Optional) Insert customer likes
INSERT INTO `customer_likes` (`customerId`, `productId`) VALUES
(1, 2), -- Customer 1 likes the Viking Spirit Hoodie
(2, 1); -- Customer 2 likes the Nordic Rune Tee
