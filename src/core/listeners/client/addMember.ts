import { Listener, listener } from "@lib";
import type { GuildMember } from "discord.js";

@listener("addMember", {
  event: "guildMemberAdd",
})
export default class AddMember extends Listener {
  async exec(member: GuildMember) {
    // currently, a basic autorole system
    // will end up involving the db for adding/removing roles via cmds
    await member.roles.add([
      "810327056252010536", // member
    ]);

    const channel = member.guild.channels.cache.get(
      process.env.WELCOME_CHANNEL_ID
    );
    if (channel?.isText()) {
      await channel.send(`Welcome to the server, ${member}!`);
    }
  }
}
