-- AddColumn
ALTER TABLE "users"
ADD COLUMN "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;

-- Backfill email verification from previous flag
UPDATE "users"
SET "isEmailVerified" = "isVerified"
WHERE "isVerified" = true;

-- Reset badge verification so it can be owner-controlled only
UPDATE "users"
SET "isVerified" = false
WHERE "isVerified" = true;
