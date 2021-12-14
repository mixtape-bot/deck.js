import { Listener, listener } from "@lib";
import type { Interaction } from "discord.js";

@listener("interaction", {
  event: "interactionCreate",
})
export default class InteractionCreate extends Listener {
  async exec(interaction: Interaction) {
    if (interaction.isButton()) {
      return this.client.buttons.modules
        .get(interaction.customId)
        ?.exec(interaction);
    }
  }
}
