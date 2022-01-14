import { PrismaClient } from "@prisma/client";
import { Logger } from "@dimensional-fun/logger";
import Redis from "ioredis";

const initPrisma = async () => {
  const logger = new Logger("database");
  logger.info("Attempting a connection to the database...");

  try {
    const prisma = new PrismaClient({
      log: [
        { emit: "event", level: "info" },
        { emit: "event", level: "error" },
        { emit: "event", level: "warn" },
        { emit: "event", level: "query" },
      ],
    });

    (global as any).prisma = prisma;
    prisma.$on("info", ({ message }) => logger.info(message));
    prisma.$on("error", ({ message }) => logger.error(message));
    prisma.$on("warn", ({ message }) => logger.warn(message));
    prisma.$on("query", ({ query, duration }) => {
      if (process.env.DEBUG !== "true") return;
      logger.debug(`Query +${duration}ms ${query}`);
    });

    await prisma.$connect();
  } catch (error: any) {
    logger.error(error);
  }
};

const initRedis = () => {
  const logger = new Logger("redis");
  logger.info("Attempting a connection to redis...");

  const redis = new Redis(process.env.REDIS_URL);

  (global as any).redis = redis;
  redis.on("ready", () =>
    logger.info("A Redis connection has been established")
  );
  redis.on("error", (error) => logger.error(error));
};

export const connect = async () => {
  await initPrisma();
  initRedis();
};
