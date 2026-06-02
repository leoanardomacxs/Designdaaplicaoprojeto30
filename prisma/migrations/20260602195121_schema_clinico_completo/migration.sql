-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Record" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "systolic" INTEGER,
    "diastolic" INTEGER,
    "glucose" INTEGER,
    "heart_rate" INTEGER,
    "oxygen" INTEGER,
    "temperature" REAL,
    "weight" REAL,
    "pain_level" INTEGER,
    "pain_location" TEXT,
    "fatigue" BOOLEAN NOT NULL DEFAULT false,
    "dizziness" BOOLEAN NOT NULL DEFAULT false,
    "edema" BOOLEAN NOT NULL DEFAULT false,
    "mobility" TEXT NOT NULL DEFAULT 'Independente',
    "recent_falls" BOOLEAN NOT NULL DEFAULT false,
    "difficulty_standing" BOOLEAN NOT NULL DEFAULT false,
    "support_equipment" TEXT,
    "oriented" BOOLEAN NOT NULL DEFAULT true,
    "mental_confusion" BOOLEAN NOT NULL DEFAULT false,
    "excessive_sleepiness" BOOLEAN NOT NULL DEFAULT false,
    "speech_alteration" BOOLEAN NOT NULL DEFAULT false,
    "appetite" TEXT NOT NULL DEFAULT 'Normal',
    "food_intake" TEXT NOT NULL DEFAULT 'Total',
    "water_intake" TEXT NOT NULL DEFAULT 'Adequada',
    "difficulty_swallowing" BOOLEAN NOT NULL DEFAULT false,
    "urine" TEXT NOT NULL DEFAULT 'Normal',
    "feces" TEXT NOT NULL DEFAULT 'Normal',
    "incontinence" TEXT NOT NULL DEFAULT 'Nenhuma',
    "mood" TEXT NOT NULL DEFAULT 'Estável',
    "activity_interest" BOOLEAN NOT NULL DEFAULT true,
    "sleep_quality" TEXT NOT NULL DEFAULT 'Normal',
    "notes" TEXT,
    CONSTRAINT "Record_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Record" ("createdAt", "diastolic", "glucose", "heart_rate", "id", "mood", "notes", "oxygen", "patientId", "systolic", "temperature") SELECT "createdAt", "diastolic", "glucose", "heart_rate", "id", "mood", "notes", "oxygen", "patientId", "systolic", "temperature" FROM "Record";
DROP TABLE "Record";
ALTER TABLE "new_Record" RENAME TO "Record";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "password", "role") SELECT "createdAt", "email", "id", "name", "password", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
