import { Button, button, padTicketId } from "@lib";
import { ButtonInteraction, MessageActionRow, MessageButton } from "discord.js";
import Mustache from "mustache";

// disable html escaping behaviour
Mustache.escape = (text: string) => text;

@button("create-ticket")
export default class CreateTicket extends Button {
  async exec(interaction: ButtonInteraction) {
    await interaction.deferReply({ ephemeral: true });

    // return if there's no guild
    if (!interaction.guild) {
      return interaction.editReply("Sorry, I can only be ran in a guild!");
    }

    const db = await interaction.guild.upsert();
    if (
      !interaction.guild.me
        ?.permissionsIn(db.openCategory ?? "")
        .has(["MANAGE_CHANNELS", "MANAGE_ROLES"])
    ) {
      return interaction.editReply(
        "Sorry, I'm missing permission to create channels!"
      );
    }

    // check if the user has an open ticket
    const hasOpenTicket = await prisma.tickets.findFirst({
      where: {
        userId: interaction.user.id,
        guildId: interaction.guild.id,
        closed: false,
      },
    });
    if (hasOpenTicket)
      return interaction.editReply(
        "Sorry, you seem to already have an open ticket!"
      );

    // create the ticket and it's channel
    const ticket = await prisma.tickets.create({
      data: { userId: interaction.user.id, guildId: interaction.guild.id },
    });

    // create the channel for the ticket
    const channel = await interaction.guild.channels.create(
      `ticket-${padTicketId(ticket.id)}`,
      { type: "GUILD_TEXT", parent: db.openCategory ?? undefined }
    );

    // allow the user the see the channel
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

    const data = {
      role: {
        name: interaction.guild.roles.cache.get(db.supportRole ?? "")?.name,
        mention: `<@&${db.supportRole}>`,
      },
      user: {
        name: interaction.user.username,
        mention: interaction.user.toString(),
      },
    };

    console.log("??", Mustache.render(db.startMessage, data, {}));

    await channel.send({
      // content: `Welcome to your ticket, ${interaction.user}! ${
      //   db.supportRole ?? "Someone"
      // } will be with you shortly.`,
      content: Mustache.render(db.startMessage, data),
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
