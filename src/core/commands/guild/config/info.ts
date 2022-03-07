import { Command, subcommand } from "@lib";
import type { Message } from "discord.js";

@subcommand("config-info")
export default class ConfigInfo extends Command {
  async exec(message: Message) {
    if (!message.guild) return;
    const db = await message.guild.upsert();

    // keep the object short and make ts happy
    const name = message.guild.name;
    const icon = message.guild!.iconURL() ?? undefined;

    // TODO: improve the embed design
    return message.ctx.create((e) =>
      e
        .setAuthor({ name: `Config for ${name}`, iconURL: icon })
        .addField(
          "Autorole",
          db.autorole.map((id) => `<@&${id}>`).join(", ") || "Not found"
        )
        .addField("Tickets", [
          `Open Category: ${this.display(db.openCategory, "channel")}`,
          `Close Category: ${this.display(db.closeCategory, "channel")}`,
          `Support Role: ${this.display(db.supportRole, "role")}`,
          `Start Message: \`${db.startMessage}\``,
        ])
        .addField("Misc", [
          `Boost Channel: ${this.display(db.boostChannel, "channel")}`,
          `Welcome Channel: ${this.display(db.welcomeChannel, "channel")}`,
        ])
    );
  }

  display(value: string | null, parse: "channel" | "role") {
    const mention = parse === "channel" ? "#" : "@&";
    return value ? `<${mention}${value}>` : "Not found";
  }
}
