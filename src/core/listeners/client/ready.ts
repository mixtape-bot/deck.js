import { Listener, listener } from "@lib";

@listener("ready", {
  type: "once",
})
export default class Ready extends Listener {
  exec() {
    const tag = this.client.user!.tag;
    const commands = this.client.commands.modules.size;
    const events = this.client.events.modules.size;

    this.logger.info(
      `${tag} is now online with ${commands} commands and ${events} events`
    );
  }
}
