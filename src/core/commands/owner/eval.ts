import { Command, command, isPromise } from "@lib";
import type { Message } from "discord.js";
import { inspect } from "util";

@command("eval", {
  aliases: ["evaluate"],
  ownerOnly: true,
  clientPermissions: ["EMBED_LINKS"],
  description: "Evaluate some code",
  usage: "<code> [--depth 0] [--silent] [--async]",
  args: [
    {
      id: "code",
      type: "string",
      match: "rest",
      prompt: {
        start: "Please provide some code to evaluate",
        retry: "Please provide some code to evaluate",
      },
    },
    {
      id: "depth",
      match: "option",
      flag: ["--depth", "-d"],
      default: 0,
    },
    {
      id: "silent",
      match: "flag",
      flag: ["--silent", "-s"],
    },
    {
      id: "async",
      match: "flag",
      flag: ["--async", "-a"],
    },
  ],
})
export default class Eval extends Command {
  async exec(message: Message, { code, depth, silent, async }: Args) {
    try {
      const hrStart = process.hrtime();
      let result: string | Promise<string> = await eval(
        async ? `(async () => {\n${code}\n})()` : code
      );
      result = isPromise(result) ? await result : result;
      const hr = process.hrtime(hrStart);
      const codeType = Eval.resolve(result);
      if (typeof result !== "string") {
        result = inspect(result, { depth });
      }

      if (silent) {
        return message.react("✅").catch(() => null);
      }

      const share = result
        .replace(process.env.TOKEN, "[protected]")
        .replace(process.env.DATABASE_URL, "[protected]");
      const lines = share.length.toLocaleString();

      return message.ctx.create((embed) =>
        embed
          .addField("Input", code.trunc(1000, true).toCodeBlock("js"))
          .addField("Output", share.trunc(1000, true).toCodeBlock("js"))
          .addField("\u200b", [
            `**Type:** ${codeType.toCodeBlock("ts")}`,
            `**Time:** ${hr[0] > 0 ? `${hr[0]}s` : `${hr[1] / 1000000}ms`}`,
            `**Lines:** ${lines}`,
          ])
      );
    } catch (e: any) {
      return message.ctx.error([
        "**Evaluation Error**:",
        e.toString().toCodeBlock("js"),
      ]);
    }
  }

  private static resolve(value: any): string {
    const type = typeof value;

    switch (type) {
      case "object":
        return value === null ? "null" : value.constructor?.name ?? "any";
      case "function":
        return `${value.constructor.name}(${value.length}-arity)`;
      case "undefined":
        return "void";
      default:
        return type;
    }
  }
}

type Args = {
  code: string;
  depth: number;
  silent: boolean;
  async: boolean;
};
