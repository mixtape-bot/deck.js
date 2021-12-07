import type { Message, MessageOptions, MessagePayload } from "discord.js";
import { Embed, StringResolvable } from "./embed";
import { resolveString } from "./util";

type MessageData = MessagePayload | MessageOptions;

export class Context {
  constructor(readonly message: Message) {}

  get embed() {
    return new Embed();
  }

  respond(data: MessageData): Promise<Message>;
  respond(noEdit: boolean | undefined, data: MessageData): Promise<Message>;
  respond(noEdit: any, data?: any) {
    if (typeof noEdit === "object") {
      data = noEdit;
      noEdit = false;
    }

    if (noEdit) return this.message.channel.send(data);
    return (this.message.util ?? this.message).reply(data);
  }

  create(func: (embed: Embed) => Embed, noEdit?: boolean) {
    return this.respond(noEdit, { embeds: [func(this.embed)] });
  }

  error(text: StringResolvable, noEdit?: boolean) {
    return this.create((e) => e.setError(text), noEdit);
  }

  sendMsg(text: StringResolvable, noEdit?: boolean) {
    return this.respond(noEdit, { content: resolveString(text) });
  }

  sendEmbed(text: StringResolvable, noEdit?: boolean) {
    return this.create((e) => e.setDescription(text), noEdit);
  }
}
