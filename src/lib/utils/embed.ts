import { MessageEmbed } from "discord.js";
import { Color } from "./util";

export type StringResolvable = string | string[];

export class Embed extends MessageEmbed {
  constructor(data: Embed | MessageEmbed | object = {}) {
    super(data);
    this.setColor(Color.PRIMARY);
  }

  setDescription(description: StringResolvable): this {
    return super.setDescription(Embed.resolveString(description));
  }

  addField(name: string, value: StringResolvable, inline?: boolean): this {
    return super.addField(name, Embed.resolveString(value), inline);
  }

  setPrompt(text: StringResolvable): this {
    return this.setColor(Color.PROMPT)
      .setDescription(text)
      .setFooter('Type "cancel" to cancel');
  }

  setError(text: StringResolvable): this {
    return this.setColor(Color.ERROR).setDescription(text);
  }

  static resolveString(data: StringResolvable): string {
    if (typeof data === "string") return data;
    if (Array.isArray(data)) return data.join("\n");
    return String(data);
  }
}
