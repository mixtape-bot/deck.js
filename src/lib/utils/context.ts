import type { Message, MessageOptions, MessagePayload } from "discord.js";
import { Embed, StringResolvable } from "./embed";
import { resolveString } from "./util";

export class Context {
  constructor(readonly message: Message) {}

  get embed() {
    return new Embed();
  }

  _respond(noEdit: boolean | undefined, data: MessagePayload | MessageOptions) {
    if (noEdit) return this.message.channel.send(data);
    return (this.message.util ?? this.message).reply(data);
  }

  create(func: (embed: Embed) => Embed, noEdit?: boolean) {
    return this._respond(noEdit, { embeds: [func(this.embed)] });
  }

  error(text: StringResolvable, noEdit?: boolean) {
    return this.create((e) => e.setError(text), noEdit);
  }

  sendMsg(text: StringResolvable, noEdit?: boolean) {
    return this._respond(noEdit, { content: resolveString(text) });
  }

  sendEmbed(text: StringResolvable, noEdit?: boolean) {
    return this.create((e) => e.setDescription(text), noEdit);
  }
}
