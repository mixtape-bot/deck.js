-- CreateTable
CREATE TABLE "sticky_messages" (
    "message_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "data" JSONB NOT NULL DEFAULT E'{}',

    CONSTRAINT "sticky_messages_pkey" PRIMARY KEY ("message_id")
);
