import { Command as BaseCommand, CommandOptions } from "@kingsworld/akairo";
import type { Deck } from "@lib";
import { Logger } from "@dimensional-fun/logger";
import { array, removeDupes } from "@lib";
import type { PermissionResolvable } from "discord.js";

export class Command extends BaseCommand {
  client!: Deck;
  readonly logger = new Logger(this.id);

  constructor(id: string, options: CommandOptions = {}) {
    super(id, options);

    if (typeof options.clientPermissions !== "function") {
      this.clientPermissions = removeDupes<PermissionResolvable>([
        "SEND_MESSAGES",
        "VIEW_CHANNEL",
        ...array(options.clientPermissions ?? []),
      ]);
    }

    if (typeof options.userPermissions !== "function") {
      this.clientPermissions = removeDupes<PermissionResolvable>([
        "SEND_MESSAGES",
        "VIEW_CHANNEL",
        ...array(options.userPermissions ?? []),
      ]);
    }
  }
}
