import { messageUrlRegex } from "@lib";
import type { Message, TextBasedChannel } from "discord.js";

// custom command arg types
export const resolverTypes = {
  ["messageLinkOrId"]: async (message: Message, phrase?: string) => {
    if (!phrase) return null;

    const messageUrl = phrase.match(messageUrlRegex);
    if (messageUrl) {
      const [, guildId, channelId, messageId] = messageUrl;
      const guild = message.client.guilds.cache.get(guildId);
      const channel = guild?.channels.cache.get(channelId);
      if (!channel) return null;

      return (<TextBasedChannel>channel).messages
        .fetch(messageId)
        .catch(() => null);
    }

    return message.channel.messages.fetch(phrase).catch(() => null);
  },
};

export type ResolverTypes = keyof typeof resolverTypes;
