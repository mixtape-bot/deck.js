-- CreateTable
CREATE TABLE "sticky_messages" (
    "message_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "data" JSONB NOT NULL DEFAULT E'{}',

    CONSTRAINT "sticky_messages_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL DEFAULT E'',
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);
