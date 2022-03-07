import { categoryPredicate, Command, command, titleCase } from "@lib";
import type { Message } from "discord.js";

@command("help", {
  aliases: ["commands", "cmds"],
  clientPermissions: ["EMBED_LINKS"],
  description: "Displays information about commands",
  usage: "[command]",
  args: [
    {
      id: "cmd",
      type: "commandAlias",
    },
  ],
})
export default class Help extends Command {
  exec(message: Message, { cmd }: Args) {
    if (!cmd) {
      const { categories, modules } = this.handler;
      const commands = modules.filter((m) => {
        const cats = ["flag"];
        if (!message.author.isOwner()) cats.push("owner");
        return !cats.includes(m.categoryID);
      });

      const embed = message.ctx.embed
        .setTitle("Deck™ - Commands")
        .setDescription(
          "Hello, I'm Deck! A utility bot made for the Mixtape Community."
        )
        .setThumbnail(this.client.user!.pfp)
        .setFooter({ text: `Deck™ — Total Commands: ${commands.size}` });

      categories.filter(categoryPredicate(message.author)).map((a, b) => {
        embed.addField(
          `• ${titleCase(b)} (${a.size})`,
          a.map((c) => `\`${c.aliases[0]}\``).join(", ")
        );
      });

      return message.ctx.create(() => embed);
    }

    if (cmd.ownerOnly && !message.author.isOwner())
      return message.ctx.error(
        "You're not allowed to view information about this command"
      );

    return message.ctx.create((embed) =>
      embed
        .setTitle("Deck — Commands")
        .setFooter("Syntax: <required> [optional]")
        .setDescription([
          `${cmd.description}`,
          "\u200b",
          `• **Aliases:** ${cmd.aliases.join(", ")}`,
          `• **Category:** ${titleCase(cmd.categoryID)}`,
          `• **Usage:** \`${`${cmd.aliases[0]} ${cmd.usage}`.trim()}\``,
        ])
    );
  }
}

type Args = {
  cmd?: Command;
};
