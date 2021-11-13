import { Deck, Context } from "@lib";
import { Message } from "discord.js";

declare module "discord.js" {
  interface Message {
    client: Deck;
    ctx: Context;
  }
}

Reflect.defineProperty(Message.prototype, "ctx", {
  get(this: Message): Context {
    return new Context(this);
  },
});
