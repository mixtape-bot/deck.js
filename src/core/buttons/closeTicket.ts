import { Button, button, getTicketId, padTicketId } from "@lib";
import type { ButtonInteraction, BaseGuildTextChannel } from "discord.js";

@button("close-ticket")
export default class CloseTicket extends Button {
  async exec(interaction: ButtonInteraction) {
    await interaction.deferReply();

    const id = getTicketId((<BaseGuildTextChannel>interaction.channel).name);
    if (!id)
      return interaction.editReply(
        "Sorry, I was unable to match an ID in the channel name!"
      );

    const ticket = await prisma.tickets.findUnique({ where: { id } });
    if (!ticket)
      return interaction.editReply(
        "Sorry, I was unable to find a record in the database!"
      );

    await prisma.tickets.update({
      where: { id: ticket.id },
      data: { closed: true },
    });
    await (<BaseGuildTextChannel>interaction.channel).edit({
      name: `closed-${padTicketId(ticket.id)}`,
      parent: process.env.CLOSE_CATEGORY,
      lockPermissions: true,
    });

    return interaction.editReply("The ticket has been closed successfully.");
  }
}