import { array, Command, Embed, Listener, listener, titleCase } from "@lib";
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
      .map((x: string) => `**${this.stringify(x)}**`)
      .join(", ");

    return message.util?.reply({
      embeds: [
        new Embed().setError([
          `Sorry, ${choice} missing ${list.length.toLocaleString()} permission${
            list.length > 1 ? "s" : ""
          } in this channel!`,
          list,
        ]),
      ],
    });
  }

  stringify(permission: string) {
    if (permission === "USE_VAD") return "Use Voice Activity";
    return titleCase(permission.split("_"));
  }
}
