import { Command, command } from "@lib";
import type { Message, MessageOptions } from "discord.js";

@command("stick", {
  userPermissions: ["MANAGE_MESSAGES"],
  description: "Stick a message to the bottom of a channel",
  usage: "<message(id|url)>",
  args: [
    {
      id: "fetched",
      type: "messageLinkOrId",
      prompt: {
        start: "Provide a message ID in this channel or a message link",
        retry: "Provide a message ID in this channel or a message link",
      },
    },
  ],
})
export default class Unstick extends Command {
  async exec(message: Message, { fetched }: Args) {
    if (fetched.system)
      return message.ctx.error("I cannot send system messages");

    if (this.client.sticky[fetched.channelId])
      return message.ctx.error("This channel already has a sticky message");

    const data: MessageOptions = {
      content: fetched.content.length ? fetched.content : null,
      embeds: fetched.embeds,
      components: fetched.components,
      files: [...fetched.attachments.values()],
    };

    const msg = await message.ctx.respond(true, data);

    this.client.sticky[msg.channelId] = await prisma.sticky.create({
      data: {
        messageId: msg.id,
        channelId: msg.channelId,
        data: <any>data,
      },
    });

    return message.deletable ? message.delete() : message.react("✅");
  }
}

type Args = {
  fetched: Message;
};
