/*
  Warnings:

  - You are about to drop the column `glicemia` on the `Record` table. All the data in the column will be lost.
  - You are about to drop the column `humor` on the `Record` table. All the data in the column will be lost.
  - You are about to drop the column `pressure` on the `Record` table. All the data in the column will be lost.
  - You are about to alter the column `temperature` on the `Record` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - Added the required column `ownerId` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `diastolic` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `glucose` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `heart_rate` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mood` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oxygen` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `systolic` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "ownerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Patient_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Patient" ("age", "createdAt", "id", "name", "status") SELECT "age", "createdAt", "id", "name", "status" FROM "Patient";
DROP TABLE "Patient";
ALTER TABLE "new_Patient" RENAME TO "Patient";
CREATE TABLE "new_Record" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "systolic" INTEGER NOT NULL,
    "diastolic" INTEGER NOT NULL,
    "glucose" INTEGER NOT NULL,
    "temperature" REAL NOT NULL,
    "heart_rate" INTEGER NOT NULL,
    "oxygen" INTEGER NOT NULL,
    "mood" TEXT NOT NULL,
    "notes" TEXT,
    "patientId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Record_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Record" ("createdAt", "id", "notes", "patientId", "temperature") SELECT "createdAt", "id", "notes", "patientId", "temperature" FROM "Record";
DROP TABLE "Record";
ALTER TABLE "new_Record" RENAME TO "Record";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
