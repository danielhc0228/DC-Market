/*
  Warnings:

  - Added the required column `productId` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- 1. Make productId TEMPORARILY nullable so existing data can go in
CREATE TABLE "new_ChatRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "ChatRoom_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 2. Insert existing rows and TEMPORARILY assign productId = 1 (or any valid product ID you have)
INSERT INTO "new_ChatRoom" ("id", "productId", "created_at", "updated_at")
SELECT "id", 1, "created_at", "updated_at" FROM "ChatRoom";

-- 3. Replace old table
DROP TABLE "ChatRoom";
ALTER TABLE "new_ChatRoom" RENAME TO "ChatRoom";

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;



