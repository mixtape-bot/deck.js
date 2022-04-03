import { Listener, listener } from "@lib";
import type { Message } from "discord.js";

@listener("message", {
  event: "messageCreate",
})
export default class MessageCreate extends Listener {
  async exec(message: Message) {
    /// limit to guilds only and prevent reply loop
    if (message.author.id === this.client.user!.id || !message.guild) return;
    const { messageId, data } = this.client.sticky[message.channelId] ?? {};

    // check for a valid sticky message
    if (!messageId) return;
    await message.channel.messages.delete(messageId).catch(() => null);
    const msg = await message.ctx.respond(true, <any>data);

    this.client.sticky[msg.channelId] = await prisma.sticky.update({
      where: { messageId },
      data: { messageId: msg.id },
    });
  }
}
