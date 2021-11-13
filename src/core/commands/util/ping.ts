import { Command, command } from "@lib";
import type { Message } from "discord.js";

@command("ping", {
  ratelimit: 1,
  description: "Check the latency of the bot",
  clientPermissions: ["EMBED_LINKS"],
})
export default class Ping extends Command {
  exec(message: Message) {
    return message.ctx.sendEmbed(
      `Pong! My ping is **${this.client.ws.ping}**ms`
    );
  }
}
