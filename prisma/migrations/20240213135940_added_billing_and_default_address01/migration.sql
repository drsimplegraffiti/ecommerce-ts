/*
  Warnings:

  - You are about to drop the column `defaultBillingAddress` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `defaultShippingAddress` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `defaultBillingAddress`,
    DROP COLUMN `defaultShippingAddress`,
    ADD COLUMN `defaultBillingAddressId` INTEGER NULL,
    ADD COLUMN `defaultShippingAddressId` INTEGER NULL;
