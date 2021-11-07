import { Command, Listener, listener } from "@lib";
import type { Message } from "discord.js";

@listener("started", {
  emitter: "commands",
  event: "commandStarted",
})
export default class Started extends Listener {
  exec(message: Message, command: Command) {
    this.logger.info(`${message.author.tag} ran the ${command.id} command`);
  }
}
