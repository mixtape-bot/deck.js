import { array, Command, Embed, Listener, listener, permify } from "@lib";
import type { Message } from "discord.js";

@listener("missing", {
  emitter: "commands",
  event: "missingPermissions",
})
export default class Missing extends Listener {
  exec(
    message: Message,
    _: Command,
    user: "client" | "user",
    missing: string | string[]
  ) {
    const choice = user === "client" ? "I'm" : "your";
    const list = array<string>(missing)
      .map((x: string) => permify(x))
      .join(", ");

    return message.util?.reply({
      embeds: [
        new Embed().setError([
          `Sorry, ${choice} missing the following permissions in this channel:\n`,
          list,
        ]),
      ],
    });
  }
}
