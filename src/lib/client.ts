import {
  AkairoClient,
  CommandHandler,
  ListenerHandler,
} from "@kingsworld/akairo";
import { Logger } from "@dimensional-fun/logger";
import type { Message } from "discord.js";
import { join } from "path";
import { database, resolverTypes } from "@lib";
import type { Sticky } from "@prisma/client";

import "./extensions/user";
import "./extensions/message";

export class Deck extends AkairoClient {
  readonly logger = new Logger("Deck");
  sticky: Record<string, Sticky> = {};

  readonly events = new ListenerHandler(this, {
    directory: join(__dirname, "..", "core", "listeners"),
    automateCategories: true,
  });

  readonly commands = new CommandHandler(this, {
    directory: join(__dirname, "..", "core", "commands"),
    prefix: ["deck ", "d!"],
    blockBots: true,
    blockClient: true,
    allowMention: true,
    handleEdits: true,
    commandUtil: true,
    defaultCooldown: 5e3,
    commandUtilLifetime: 6e5,
    ignorePermissions: this.ownerID,
    ignoreCooldown: this.ownerID,
    automateCategories: true,
    argumentDefaults: {
      otherwise: "",
      prompt: {
        time: 6e4,
        retries: 3,
        modifyStart: ({ ctx }: Message, str: string) => ({
          embeds: [ctx.embed.setPrompt(str)],
        }),
        modifyRetry: ({ ctx }: Message, str: string) => ({
          embeds: [ctx.embed.setPrompt(str)],
        }),
        cancel: ({ ctx }: Message) => ({
          embeds: [ctx.embed.setDescription("The command has been cancelled")],
        }),
        ended: ({ ctx }: Message) => ({
          embeds: [ctx.embed.setError("You've had too many attempts")],
        }),
        timeout: ({ ctx }: Message) => ({
          embeds: [ctx.embed.setError("You failed to respond in time")],
        }),
      },
    },
  });

  constructor() {
    super({
      ownerID: process.env.OWNERS.split(/,\s?/),
      allowedMentions: { repliedUser: false, parse: ["users", "roles"] },
      presence: { activities: [{ name: "mixtape.systems", type: 3 }] },
      intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"],
    });
  }

  async start() {
    await database.init();
    this.commands.resolver.addTypes(resolverTypes);
    this.commands.useListenerHandler(this.events);
    this.events.setEmitters({
      client: this,
      commands: this.commands,
      events: this.events,
      process,
    });

    this.commands.loadAll();
    this.events.loadAll();
    return this.login(process.env.TOKEN);
  }
}
