import { Listener, listener } from "@lib";

@listener("debug")
export default class Debug extends Listener {
  exec(info: string) {
    if (process.env.DEBUG !== "true") return this.remove();
    this.logger.debug(info);
  }
}
