import type { PrismaClient } from "@prisma/client";

export * from "./client";
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

  interface String {
    toCodeBlock(lang: string): string;
    trunc(num: number, useWordBoundary: boolean): string;
  }

  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      TOKEN: string;
      OWNERS: string;
      DEBUG: string;
    }
  }
}
