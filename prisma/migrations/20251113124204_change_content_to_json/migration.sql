/*
  Warnings:

  - Made the column `content` on table `Story` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Story" ALTER COLUMN "content" SET NOT NULL;
