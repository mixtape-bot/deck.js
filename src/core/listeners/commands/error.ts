import { Command, Embed, Listener, listener } from "@lib";
import type { Message } from "discord.js";

@listener("error", {
  emitter: "commands",
})
export default class CommandError extends Listener {
  exec(error: Error, message: Message, _: Command) {
    this.logger.error(error);

    return message.util?.reply({
      embeds: [
        new Embed().setError([
          "Oh no, I received an error while running the command!",
          error.toString().toCodeBlock("js"),
        ]),
      ],
    });
  }
}
