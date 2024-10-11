ALTER TABLE "Album" ADD COLUMN "duration" VARCHAR(255);
UPDATE "Album" SET "duration" = '0:00' WHERE "duration" IS NULL;
