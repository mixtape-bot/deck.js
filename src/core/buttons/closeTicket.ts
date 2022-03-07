import { Button, button, getTicketId, padTicketId } from "@lib";
import type { ButtonInteraction, BaseGuildTextChannel } from "discord.js";

@button("close-ticket")
export default class CloseTicket extends Button {
  async exec(interaction: ButtonInteraction) {
    await interaction.deferReply();

    // return if there's no guild
    if (!interaction.guild) {
      return interaction.editReply("Sorry, I can only be ran in a guild!");
    }

    // match the ticket id with the channel name
    const id = getTicketId((<BaseGuildTextChannel>interaction.channel).name);
    if (!id)
      return interaction.editReply(
        "Sorry, I was unable to match an ID in the channel name!"
      );

    // check if the id is in the database
    const ticket = await prisma.tickets.findUnique({ where: { id } });
    if (!ticket)
      return interaction.editReply(
        "Sorry, I was unable to find a record in the database!"
      );

    // set the channel to be closed
    await prisma.tickets.update({
      where: { id: ticket.id },
      data: { closed: true },
    });

    // get or create the guild in the db
    const db = await interaction.guild.upsert();

    // edit the channel
    await (<BaseGuildTextChannel>interaction.channel).edit({
      name: `closed-${padTicketId(ticket.id)}`,
      parent: db.closeCategory,
      lockPermissions: true,
    });

    return interaction.editReply("The ticket has been closed successfully.");
  }
}
