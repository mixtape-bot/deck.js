import { Listener, listener } from "@lib";

@listener("warn")
export default class Warn extends Listener {
  exec(info: string) {
    this.logger.warn(info);
  }
}
