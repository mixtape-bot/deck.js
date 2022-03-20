import { Listener, listener } from "@lib";
import type { GuildMember } from "discord.js";

@listener("addMember", {
  event: "guildMemberAdd",
})
export default class AddMember extends Listener {
  async exec(member: GuildMember) {
    const data = await member.guild.upsert();

    if (data.autorole.length) {
      await member.roles.add(data.autorole, "Autorole");
    }

    const channel = member.guild.channels.cache.get(data.welcomeChannel ?? "");
    if (channel?.isText()) {
      await channel.send(`Welcome to the server, ${member}!`);
    }
  }
}
