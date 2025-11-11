/*
  Warnings:

  - A unique constraint covering the columns `[slug,authorId]` on the table `Story` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Story_authorId_status_idx";

-- CreateIndex
CREATE INDEX "Story_authorId_status_slug_idx" ON "Story"("authorId", "status", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Story_slug_authorId_key" ON "Story"("slug", "authorId");
