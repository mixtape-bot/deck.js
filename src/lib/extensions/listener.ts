import { Listener as BaseListener } from "@kingsworld/akairo";
import type { Deck } from "@lib";
import { Logger } from "@dimensional-fun/logger";

export class Listener extends BaseListener {
  client!: Deck;
  readonly logger = new Logger(this.id);
}
