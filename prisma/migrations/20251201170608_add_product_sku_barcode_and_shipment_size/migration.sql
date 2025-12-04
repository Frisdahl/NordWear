-- AlterTable
ALTER TABLE `product` ADD COLUMN `barkode` VARCHAR(191) NULL,
    ADD COLUMN `varenummer` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `shipment_size` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `weight` DOUBLE NULL,
    `height` DOUBLE NULL,
    `width` DOUBLE NULL,
    `productId` INTEGER NOT NULL,

    UNIQUE INDEX `shipment_size_productId_key`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `shipment_size` ADD CONSTRAINT `shipment_size_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
