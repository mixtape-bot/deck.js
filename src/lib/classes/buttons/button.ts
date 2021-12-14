import { AkairoModule } from "@kingsworld/akairo";
import { Logger } from "@dimensional-fun/logger";
import type { ButtonInteraction } from "discord.js";
import type { Deck } from "@lib";

export class Button extends AkairoModule {
  readonly logger = new Logger(this.id);
  client!: Deck;

  constructor(id: string) {
    super(id);
  }

  exec(interaction: ButtonInteraction) {
    void interaction;
  }
}
