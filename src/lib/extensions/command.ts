import {
  ArgumentGenerator,
  ArgumentOptions,
  ArgumentType,
  ArgumentTypeCaster,
  Command as BaseCommand,
  CommandOptions as BaseOptions,
} from "@kingsworld/akairo";
import type { Deck, ResolverTypes } from "@lib";
import { Logger } from "@dimensional-fun/logger";
import { array, removeDupes } from "@lib";
import type { PermissionResolvable } from "discord.js";

export interface ArgOptions extends ArgumentOptions {
  type?: ArgumentType | ResolverTypes | ArgumentTypeCaster;
}

export interface CommandOptions extends BaseOptions {
  description?: string;
  args?: ArgOptions[] | ArgumentGenerator;
  usage?: string;
}

export class Command extends BaseCommand {
  readonly logger = new Logger(this.id);
  client!: Deck;
  usage: string;

  constructor(id: string, options: CommandOptions = {}) {
    super(id, options);
    this.usage = options.usage ?? "";

    // default client permissions
    if (typeof options.clientPermissions !== "function") {
      this.clientPermissions = removeDupes<PermissionResolvable>([
        "SEND_MESSAGES",
        "VIEW_CHANNEL",
        ...array(options.clientPermissions ?? []),
      ]);
    }

    // default user permissions
    if (typeof options.userPermissions !== "function") {
      this.userPermissions = removeDupes<PermissionResolvable>([
        "SEND_MESSAGES",
        "VIEW_CHANNEL",
        ...array(options.userPermissions ?? []),
      ]);
    }
  }
}
