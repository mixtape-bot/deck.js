import { Button, button, padTicketId } from "@lib";
import { ButtonInteraction, MessageActionRow, MessageButton } from "discord.js";

@button("create-ticket")
export default class CreateTicket extends Button {
  async exec(interaction: ButtonInteraction) {
    await interaction.deferReply({ ephemeral: true });

    // check if the user has an open ticket
    const hasOpenTicket = await prisma.tickets.findFirst({
      where: { userId: interaction.user.id, closed: false },
    });
    if (hasOpenTicket)
      return interaction.editReply(
        "Sorry, you seem to already have an open ticket!"
      );

    // create the ticket and it's channel
    const ticket = await prisma.tickets.create({
      data: { userId: interaction.user.id },
    });
    const channel = await interaction.guild!.channels.create(
      `ticket-${padTicketId(ticket.id)}`,
      { type: "GUILD_TEXT", parent: process.env.OPEN_CATEGORY }
    );
    await channel.permissionOverwrites.create(interaction.user, {
      SEND_MESSAGES: true,
      VIEW_CHANNEL: true,
      READ_MESSAGE_HISTORY: true,
    });

    // update the db with the channel id
    await prisma.tickets.update({
      where: { id: ticket.id },
      data: { channelId: channel.id },
    });

    await channel.send({
      content: `Welcome to your ticket, ${interaction.user}! <@&${process.env.SUPPORT_ROLE}> will be with you shortly.`,
      components: [this.createActionRow()],
    });
    return interaction.editReply(
      `A ticket has been opened successfully: ${channel}`
    );
  }

  createActionRow() {
    return new MessageActionRow().addComponents([
      new MessageButton()
        .setCustomId("close-ticket")
        .setLabel("Close Ticket")
        .setStyle("SECONDARY"),
      new MessageButton()
        .setCustomId("delete-ticket")
        .setLabel("Delete Ticket")
        .setStyle("SECONDARY"),
    ]);
  }
}
