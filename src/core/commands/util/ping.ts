import { Command, command, Embed } from "@lib";
import type { Message } from "discord.js";

@command("ping", {
  ratelimit: 1,
  description: "Check the latency of the bot",
  clientPermissions: ["EMBED_LINKS"],
})
export default class Ping extends Command {
  exec(message: Message) {
    return message.util?.reply({
      embeds: [
        new Embed().setDescription(
          `Pong! My ping is **${this.client.ws.ping}**ms`
        ),
      ],
    });
  }
}
