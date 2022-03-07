import { Listener, listener } from "@lib";
import type { Guild } from "discord.js";

@listener("joinGuild", {
  event: "guildCreate",
})
export default class JoinGuild extends Listener {
  exec(guild: Guild) {
    this.logger.info(`I've been invited to join ${guild.name}`);
    return guild.upsert();
  }
}
