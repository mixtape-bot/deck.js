import { MessageEmbed } from "discord.js";
import { Color, resolveString } from "./util";

export type StringResolvable = string | string[];

export class Embed extends MessageEmbed {
  constructor(data: Embed | MessageEmbed | object = {}) {
    super(data);
    this.setColor(Color.PRIMARY);
  }

  setDescription(description: StringResolvable): this {
    return super.setDescription(resolveString(description));
  }

  addField(name: string, value: StringResolvable, inline?: boolean): this {
    return super.addField(name, resolveString(value), inline);
  }

  setPrompt(text: StringResolvable): this {
    return this.setColor(Color.PROMPT)
      .setDescription(text)
      .setFooter('Type "cancel" to cancel');
  }

  setError(text: StringResolvable): this {
    return this.setColor(Color.ERROR).setDescription(text);
  }
}
