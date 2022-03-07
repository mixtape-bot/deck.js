import { Guild } from "discord.js";
import type { Prisma, Guilds } from "@prisma/client";

declare module "discord.js" {
  interface Guild {
    upsert(data?: Update): Prisma.Prisma__GuildsClient<Guilds>;
    find(data?: NotFound): Prisma.Prisma__GuildsClient<Guilds | null>;
  }
}

Guild.prototype.upsert = function (data?: Update) {
  return prisma.guilds.upsert({
    where: { id: this.id },
    create: { id: this.id },
    update: data?.update ?? {},
    ...data,
  });
};

Guild.prototype.find = function (data?: NotFound) {
  return prisma.guilds.findUnique({ where: { id: this.id }, ...data });
};

type Select = { select?: Prisma.GuildsSelect | null };
type Update = Select & { update?: Prisma.GuildsUpdateInput };
type NotFound = Select & { rejectOnNotFound?: Prisma.RejectOnNotFound };
