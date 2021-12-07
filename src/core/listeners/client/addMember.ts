import { Listener, listener } from "@lib";
import type { GuildMember } from "discord.js";

@listener("addMember", {
  event: "guildMemberAdd",
})
export default class AddMember extends Listener {
  exec(member: GuildMember) {
    this.logger.info(`${member.user.tag} joined the guild`);

    // currently a basic autorole system
    // will end up involving the db for adding/removing roles via cmds
    return member.roles.add([
      "810327056252010536", // member
    ]);
  }
}
