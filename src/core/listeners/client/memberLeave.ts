import { Listener, listener } from "@lib";
import type { GuildMember } from "discord.js";

@listener("memberLeave", {
  event: "guildMemberRemove",
})
export default class MemberLeave extends Listener {
  async exec(member: GuildMember) {
    // limit to mixtape guild
    if (member.guild.id !== "751571246189379610") return;
    // only run if the user that left was boosting the guild
    if (!member.premiumSince) return;

    this.logger.info(`${member.user.tag} left whilst boosting the server`);
    await redis.del(`boosts:${member.id}`);
  }
}
