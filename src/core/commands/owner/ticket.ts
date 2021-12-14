import { Command, command } from "@lib";
import type { Message } from "discord.js";
import { MessageActionRow, MessageButton } from "discord.js";

@command("ticket", {
  ownerOnly: true,
  channel: "guild",
  clientPermissions: ["EMBED_LINKS"],
  description: "Send the open ticket embed",
})
export default class Ticket extends Command {
  async exec(message: Message) {
    const embed = message.ctx.embed
      .setDescription("Click the button to open a ticket")
      .setFooter("Attempting to spam tickets will result in an hour mute")
      .setTitle(`${message.guild!.name} Tickets`);

    const button = new MessageButton()
      .setCustomId("create-ticket")
      .setLabel("Open Ticket")
      .setStyle("SECONDARY");

    await message.delete();
    return message.util?.send({
      embeds: [embed],
      components: [new MessageActionRow().addComponents(button)],
    });
  }
}
