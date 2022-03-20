/*
  Warnings:

  - Added the required column `guildId` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "guildId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "guilds" (
    "id" TEXT NOT NULL,
    "autorole" TEXT[],
    "open_category" TEXT,
    "close_category" TEXT,
    "support_role" TEXT,
    "start_message" TEXT NOT NULL DEFAULT E'{{user.mention}}',
    "boost_channel" TEXT,
    "welcome_channel" TEXT,

    CONSTRAINT "guilds_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "guilds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
