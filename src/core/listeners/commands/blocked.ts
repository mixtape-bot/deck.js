import { Command, Listener, listener } from "@lib";
import type { Message } from "discord.js";

@listener("blocked", {
  emitter: "commands",
  event: "commandBlocked",
})
export default class Blocked extends Listener {
  exec(message: Message, command: Command, reason: string) {
    this.logger.info(
      `${message.author.tag} was blocked from ${command.id}: ${reason}`
    );

    const reasons: Record<string, string> = {
      guild: "Sorry, this command can only be used in a guild!",
      owner: "Sorry, this command can only be used by my owners!",
      dm: "Sorry, this command can only be used in a DM!",
    };

    return message.ctx.error(reasons[reason]);
  }
}
