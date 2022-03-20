import { Command, command } from "@lib";
import { Flag } from "@kingsworld/akairo";

@command("config", {
  userPermissions: ["MANAGE_GUILD"],
  description: "Manage the guild config",
  // usage: "",
  channel: "guild",
})
export default class Config extends Command {
  *args(): object {
    const method = yield {
      type: [
        ["config-info", "info"],
        // TODO: allow updating the config
      ],
      default: "config-info",
    };

    return Flag.continue(method);
  }
}
