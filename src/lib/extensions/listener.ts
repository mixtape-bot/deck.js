import { Listener as BaseListener } from "@kingsworld/akairo";
import type { Deck } from "@lib";
import { Logger } from "@dimensional-fun/logger";

export class Listener extends BaseListener {
  readonly logger = new Logger(this.id);
  client!: Deck;
}
