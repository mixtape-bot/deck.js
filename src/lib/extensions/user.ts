import { User } from "discord.js";

declare module "discord.js" {
  interface User {
    pfp: string;
    isOwner(): boolean;
  }
}

Reflect.defineProperty(User.prototype, "pfp", {
  get(this: User): string {
    return this.displayAvatarURL({ dynamic: true });
  },
});

User.prototype.isOwner = function () {
  return process.env.OWNERS.split(/,\s?/).includes(this.id);
};
