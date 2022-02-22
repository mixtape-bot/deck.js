import { Listener, listener } from "@lib";
import type { GuildMember } from "discord.js";

@listener("memberLoss", {
  event: "guildMemberRemove",
})
export default class MemberLoss extends Listener {
  async exec(member: GuildMember) {
    const msgs = member.guild.systemChannel?.messages.cache?.filter(
      (m) => m.type === "GUILD_MEMBER_JOIN" && !m.member
    );

    if (!msgs) return;
    for (const msg of msgs.values()) {
      await msg.delete().catch(() => null);
    }
  }
}
