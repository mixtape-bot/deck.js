import { Listener, listener } from "@lib";

@listener("ready", {
  type: "once",
})
export default class Ready extends Listener {
  async exec() {
    const tag = this.client.user!.tag;
    const commands = this.client.commands.modules.size;
    const events = this.client.events.modules.size;

    const sticky = await prisma.sticky.findMany();
    this.client.sticky = sticky.reduce(
      (prev, curr) => ({ ...prev, [curr.channelId]: curr }),
      this.client.sticky
    );

    this.logger.info(
      `${tag} is now online with ${commands} commands and ${events} events`
    );
  }
}
