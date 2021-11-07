export function array<T>(v: T | T[], sort?: boolean): T[] {
  const arr = Array.isArray(v) ? v : [v];
  return sort ? arr.sort() : arr;
}

export function removeDupes<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

export function isPromise(value: any): boolean {
  return (
    value &&
    typeof value.then === "function" &&
    typeof value.catch === "function"
  );
}

export function capitalise(str: string, lowerRest: boolean = true): string {
  const [b, ...r] = str.split("");
  return `${b.toUpperCase()}${
    lowerRest ? r.join("").toLowerCase() : r.join("")
  }`;
}

export function titleCase(str: string | string[]): string {
  const arr = Array.isArray(str) ? str : str.split(" ");
  return arr.map((s: string) => capitalise(s)).join(" ");
}

export enum Color {
  PRIMARY = 0xb963a5,
  ERROR = 0xf54254,
  PROMPT = 0xf56e38,
}
