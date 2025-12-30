/*
  Warnings:

  - You are about to drop the column `subtotal` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `price_each` on the `order_item` table. All the data in the column will be lost.
  - You are about to drop the column `total_price` on the `order_item` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerId,productId]` on the table `customer_likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentIntentId]` on the table `order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentIntentId` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `order_item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `order_item` DROP FOREIGN KEY `Order_Item_colorId_fkey`;

-- DropForeignKey
ALTER TABLE `order_item` DROP FOREIGN KEY `Order_Item_sizeId_fkey`;

-- AlterTable
ALTER TABLE `customer` ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `subtotal`,
    ADD COLUMN `amount` INTEGER NOT NULL,
    ADD COLUMN `currency` VARCHAR(191) NOT NULL,
    ADD COLUMN `customerDetails` JSON NULL,
    ADD COLUMN `paymentIntentId` VARCHAR(191) NOT NULL,
    ADD COLUMN `shippingDetails` JSON NULL,
    ADD COLUMN `status` ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `order_item` DROP COLUMN `price_each`,
    DROP COLUMN `total_price`,
    ADD COLUMN `price` INTEGER NOT NULL,
    MODIFY `sizeId` INTEGER NULL,
    MODIFY `colorId` INTEGER NULL;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `imageUrl`,
    ADD COLUMN `description` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `ProductImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `isThumbnail` BOOLEAN NOT NULL DEFAULT false,
    `productId` INTEGER NOT NULL,

    INDEX `ProductImage_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `customer_userId_key` ON `customer`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `customer_likes_customerId_productId_key` ON `customer_likes`(`customerId`, `productId`);

-- CreateIndex
CREATE UNIQUE INDEX `order_paymentIntentId_key` ON `order`(`paymentIntentId`);

-- AddForeignKey
ALTER TABLE `customer` ADD CONSTRAINT `customer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_item` ADD CONSTRAINT `Order_Item_colorId_fkey` FOREIGN KEY (`colorId`) REFERENCES `color`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_item` ADD CONSTRAINT `Order_Item_sizeId_fkey` FOREIGN KEY (`sizeId`) REFERENCES `size`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductImage` ADD CONSTRAINT `ProductImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
