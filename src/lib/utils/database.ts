import { PrismaClient } from "@prisma/client";
import { Logger } from "@dimensional-fun/logger";

class Database {
  readonly logger = new Logger("database");

  async init(): Promise<void> {
    this.logger.info("Attempting to connect...");

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
      prisma.$on("info", ({ message }) => this.logger.info(message));
      prisma.$on("error", ({ message }) => this.logger.error(message));
      prisma.$on("warn", ({ message }) => this.logger.warn(message));
      prisma.$on("query", ({ query, duration }) => {
        if (process.env.DEBUG !== "true") return;
        this.logger.debug(`Query +${duration}ms ${query}`);
      });

      await prisma.$connect();
    } catch (error: any) {
      this.logger.error(error);
      process.exit(1);
    }
  }
}

export const database = new Database();
