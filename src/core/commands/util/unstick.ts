import { Command, command } from "@lib";
import type { Message } from "discord.js";

@command("unstick", {
  userPermissions: ["MANAGE_MESSAGES"],
  description: "Unstick a sticky message in the channel",
})
export default class Unstick extends Command {
  async exec(message: Message) {
    const { messageId } = this.client.sticky[message.channelId] ?? {};
    if (!messageId)
      return message.ctx.error(
        "This channel doesn't seem to have a sticky message"
      );

    await message.channel.messages.delete(messageId).catch(() => null);
    await prisma.sticky.delete({ where: { messageId } });
    delete this.client.sticky[message.channelId];

    return message.deletable ? message.delete() : message.react("✅");
  }
}
