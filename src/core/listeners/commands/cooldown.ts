import { Command, Listener, listener } from "@lib";
import type { Message } from "discord.js";
import { parseMS } from "human-ms";

@listener("cooldown", {
  emitter: "commands",
})
export default class Cooldown extends Listener {
  exec(message: Message, _: Command, remaining: number) {
    const time = parseMS(remaining, { joinWith: " " });

    return message.ctx.error(
      `To use this command again, please wait **${time}**!`
    );
  }
}
