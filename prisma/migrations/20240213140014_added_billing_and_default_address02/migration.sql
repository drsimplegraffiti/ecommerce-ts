/*
  Warnings:

  - You are about to drop the column `defaultBillingAddressId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `defaultShippingAddressId` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `defaultBillingAddressId`,
    DROP COLUMN `defaultShippingAddressId`,
    ADD COLUMN `defaultBillingAddress` INTEGER NULL,
    ADD COLUMN `defaultShippingAddress` INTEGER NULL;
