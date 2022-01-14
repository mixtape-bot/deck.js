import { Listener, listener } from "@lib";
import type { GuildMember } from "discord.js";

@listener("updateMember", {
  event: "guildMemberUpdate",
})
export default class UpdateMember extends Listener {
  async exec(old: GuildMember, member: GuildMember) {
    // boost removed
    if (old.premiumSince && !member.premiumSince) {
      this.logger.info(`${member.user.tag} is no longer boosting the server`);
      await redis.del(`boosts:${member.id}`);
    }
  }
}
