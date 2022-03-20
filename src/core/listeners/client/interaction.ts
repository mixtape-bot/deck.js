import { Listener, listener } from "@lib";
import type { Interaction } from "discord.js";

@listener("interaction", {
  event: "interactionCreate",
})
export default class InteractionCreate extends Listener {
  async exec(interaction: Interaction) {
    if (interaction.isButton()) {
      try {
        return await this.client.buttons.modules
          .get(interaction.customId)
          ?.exec(interaction);
      } catch (e) {
        this.logger.error(e);
        const func =
          interaction.replied || interaction.deferred ? "editReply" : "reply";
        return interaction[func](`Oops, an error occurred. **${e}**`);
      }
    }
  }
}
