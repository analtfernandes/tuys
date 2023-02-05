/*
  Warnings:

  - You are about to drop the column `typeId` on the `Notifications` table. All the data in the column will be lost.
  - The `status` column on the `Stories` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `NotificationsTypes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Notifications` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_STORY', 'NEW_DENUNCIATION', 'NEW_LIKE', 'NEW_COMMENT', 'NEW_FOLLOW');

-- CreateEnum
CREATE TYPE "StorieStatus" AS ENUM ('ACTIVE', 'BANNED');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BANNED');

-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_fk1";

-- AlterTable
ALTER TABLE "Channels" ADD COLUMN     "editable" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Likes" ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Notifications" DROP COLUMN "typeId",
ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" "NotificationType" NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Ranks" ADD COLUMN     "editable" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Stories" ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "status",
ADD COLUMN     "status" "StorieStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "about" SET DEFAULT '',
DROP COLUMN "status",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropTable
DROP TABLE "NotificationsTypes";
