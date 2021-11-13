import { Listener, listener } from "@lib";
import type { Message } from "discord.js";

@listener("invalid", {
  emitter: "commands",
  event: "messageInvalid",
})
export default class MessageCreate extends Listener {
  async exec(message: Message) {
    if (message.author.bot) return;
    let { messageId, count } = this.client.sticky[message.channelId] ?? {};
    count ??= 0;

    if (messageId) {
      this.client.sticky[message.channelId] = { messageId, count: count + 1 };
      if (count < 4) return;

      const sticky = await prisma.sticky.findUnique({ where: { messageId } });
      if (!sticky) {
        delete this.client.sticky[message.channelId];
        return this.logger.warn(`Found message "${messageId}" but not in DB`);
      }

      await message.channel.messages.delete(messageId).catch(() => null);
      console.log(messageId);
      const msg = await message.ctx._respond(true, <any>sticky.data);

      await prisma.sticky.update({
        where: { messageId },
        data: { messageId: msg.id },
      });
      this.client.sticky[msg.channelId] = { messageId: msg.id };
    }
  }
}
