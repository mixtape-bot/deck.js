import { Button, button, getTicketId } from "@lib";
import type { BaseGuildTextChannel, ButtonInteraction } from "discord.js";

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

@button("delete-ticket")
export default class DeleteTicket extends Button {
  async exec(interaction: ButtonInteraction) {
    await interaction.deferReply();

    // check if the user has manage channel perms
    if (!interaction.memberPermissions?.has("MANAGE_CHANNELS"))
      return interaction.editReply(
        "Sorry, you are missing the required permissions to delete the ticket!"
      );

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

    // reply to the user and wait 5 seconds
    await interaction.editReply("The ticket will be deleted in 5 seconds.");
    await wait(5000);

    // delete the channel then delete the record from the database
    await interaction.channel!.delete();
    return prisma.tickets.delete({ where: { id } });
  }
}
