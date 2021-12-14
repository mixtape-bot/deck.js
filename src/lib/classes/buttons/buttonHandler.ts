import { AkairoHandler, AkairoHandlerOptions } from "@kingsworld/akairo";
import type { Collection } from "discord.js";
import type { Deck } from "@lib";
import { Button } from "./button";

export class ButtonHandler extends AkairoHandler {
  client!: Deck;
  modules!: Collection<string, Button>;

  constructor(client: Deck, options: AkairoHandlerOptions) {
    super(client, {
      classToHandle: Button,
      ...options,
    });
  }

  register(button: Button) {
    button.handler = this;
    button.client = this.client;
    this.modules.set(button.id, button);
  }
}
