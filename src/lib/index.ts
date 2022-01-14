import type { PrismaClient } from "@prisma/client";
import type { Redis } from "ioredis";

export * from "./client";
export * from "./classes";
export * from "./utils";
export * from "./extensions";

String.prototype.toCodeBlock = function (this: string, lang: string) {
  return `\`\`\`${lang}\n${this}\n\`\`\``;
};

String.prototype.trunc = function (
  this: string,
  num: number,
  useWordBoundary: boolean
): string {
  if (this.length <= num) return this;
  const subString = this.substr(0, num - 1);

  return (
    (useWordBoundary
      ? subString.substr(0, subString.lastIndexOf(" "))
      : subString) + "..."
  );
};

declare global {
  const prisma: PrismaClient;
  const redis: Redis;

  interface String {
    toCodeBlock(lang: string): string;
    trunc(num: number, useWordBoundary: boolean): string;
  }

  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      REDIS_URL: string;
      TOKEN: string;
      OWNERS: string;
      DEBUG: string;
      OPEN_CATEGORY: string;
      CLOSE_CATEGORY: string;
      SUPPORT_ROLE: string;
    }
  }
}
