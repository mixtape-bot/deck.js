import { Listener, listener } from "@lib";
import type { Message } from "discord.js";

@listener("invalid", {
  emitter: "commands",
  event: "messageInvalid",
})
export default class MessageCreate extends Listener {
  async exec(message: Message) {
    if (message.author.id === this.client.user!.id) return;
    const { messageId, data } = this.client.sticky[message.channelId] ?? {};

    if (messageId) {
      await message.channel.messages.delete(messageId).catch(() => null);
      const msg = await message.ctx._respond(true, <any>data);

      this.client.sticky[msg.channelId] = await prisma.sticky.update({
        where: { messageId },
        data: { messageId: msg.id },
      });
    }
  }
}
