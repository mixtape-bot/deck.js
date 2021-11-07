import {
  AkairoClient,
  CommandHandler,
  ListenerHandler,
} from "@kingsworld/akairo";
import { Logger } from "@dimensional-fun/logger";
import type { Message } from "discord.js";
import { join } from "path";
import { Embed } from "@lib";

export class Deck extends AkairoClient {
  readonly logger = new Logger("Deck");

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
        modifyStart: (_: Message, str: string) => ({
          embeds: [new Embed().setPrompt(str)],
        }),
        modifyRetry: (_: Message, str: string) => ({
          embeds: [new Embed().setPrompt(str)],
        }),
        cancel: (_: Message) => ({
          embeds: [
            new Embed().setDescription("The command has been cancelled"),
          ],
        }),
        ended: (_: Message) => ({
          embeds: [new Embed().setError("You've had too many attempts")],
        }),
        timeout: (_: Message) => ({
          embeds: [new Embed().setError("You failed to respond in time")],
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
