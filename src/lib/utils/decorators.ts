import type { ListenerOptions } from "@kingsworld/akairo";
import { removeDupes, Command, Listener, CommandOptions, Button } from "@lib";

type Constructor<T> = new (...args: any[]) => T;

export const command = (id: string, options: CommandOptions = {}) => {
  options.aliases = removeDupes([id, ...(options.aliases ?? [])]);
  return <T extends Constructor<Command>>(target: T): T =>
    class extends target {
      constructor(..._: any[]) {
        super(id, options);
      }
    };
};

export const subcommand = (id: string, options: CommandOptions = {}) => {
  options.category = "flag";
  return <T extends Constructor<Command>>(target: T): T =>
    class extends target {
      constructor(..._: any[]) {
        super(id, options);
      }
    };
};

export const listener = (id: string, options?: Partial<ListenerOptions>) => {
  return <T extends Constructor<Listener>>(target: T): T =>
    class extends target {
      constructor(..._: any[]) {
        super(id, <ListenerOptions>{
          emitter: options?.emitter ?? "client",
          event: options?.event ?? id,
          ...options,
        });
      }
    };
};

export const button = (id: string) => {
  return <T extends Constructor<Button>>(target: T): T =>
    class extends target {
      constructor(..._: any) {
        super(id);
      }
    };
};
