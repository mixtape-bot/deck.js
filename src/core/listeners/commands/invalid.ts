import { Embed, Listener, listener } from "@lib";
import type { Message } from "discord.js";

@listener("invalid", {
  emitter: "commands",
  event: "messageInvalid",
})
export default class MessageInvalid extends Listener {
  async exec(message: Message) {
    if (message.author.id === this.client.user!.id) return;
    const { messageId, data } = this.client.sticky[message.channelId] ?? {};

    if (messageId) {
      await message.channel.messages.delete(messageId).catch(() => null);
      const msg = await message.ctx.respond(true, <any>data);

      this.client.sticky[msg.channelId] = await prisma.sticky.update({
        where: { messageId },
        data: { messageId: msg.id },
      });
    }

    if (message.system && message.guild) {
      const tiers: Record<string, number | undefined> = {
        USER_PREMIUM_GUILD_SUBSCRIPTION: 0,
        USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1: 1,
        USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2: 2,
        USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3: 3,
      };

      const tier = tiers[message.type];
      if (typeof tier !== "number") return; // not a boost system message
      this.logger.info(`${message.author.tag} boosted ${message.guild.name}`);

      //create  embed description
      const str = [
        `${message.author} boosted the server`,
        message.content ? ` **${message.content}** times` : "",
        tier ? `, reaching us to tier ${tier}` : "",
      ].join("");

      // limit to mixtape guild
      if (message.guildId === "751571246189379610") {
        // increment the total boosts
        await redis.incrby(
          `boosts:${message.author.id}`,
          +(message.content || "1")
        );
      }

      // if there is a boost channel, send the embed
      const db = await message.guild.upsert();
      const channel = message.guild.channels.cache.get(db.boostChannel ?? "");
      if (channel?.isText()) {
        await channel.send({ embeds: [new Embed().setDescription(str)] });
      }
    }
  }
}
