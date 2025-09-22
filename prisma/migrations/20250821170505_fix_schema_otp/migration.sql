/*
  Warnings:

  - You are about to drop the column `attempts` on the `Otp` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Otp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phone" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL
);
INSERT INTO "new_Otp" ("codeHash", "createdAt", "expiresAt", "id", "phone", "purpose") SELECT "codeHash", "createdAt", "expiresAt", "id", "phone", "purpose" FROM "Otp";
DROP TABLE "Otp";
ALTER TABLE "new_Otp" RENAME TO "Otp";
CREATE INDEX "Otp_phone_purpose_createdAt_idx" ON "Otp"("phone", "purpose", "createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
