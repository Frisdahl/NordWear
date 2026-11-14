import { describe, it, expect } from "vitest";
import { sortSizes, areShoeSizes, isShoeSize } from "./sizes";

const s = (...names: string[]) => names.map((name, id) => ({ id, name }));

describe("sortSizes", () => {
  it("sorts shoe sizes numerically, not alphabetically", () => {
    expect(sortSizes(s("42", "40", "9", "44")).map((x) => x.name)).toEqual(["9", "40", "42", "44"]);
  });

  it("sorts clothing sizes in garment order", () => {
    expect(sortSizes(s("XL", "S", "M", "L")).map((x) => x.name)).toEqual(["S", "M", "L", "XL"]);
  });

  it("does not mutate its input", () => {
    const input = s("44", "40");
    sortSizes(input);
    expect(input.map((x) => x.name)).toEqual(["44", "40"]);
  });
});

describe("shoe size detection", () => {
  it("recognises numeric sizes only", () => {
    expect(isShoeSize("42")).toBe(true);
    expect(isShoeSize("42.5")).toBe(true);
    expect(isShoeSize("M")).toBe(false);
    expect(areShoeSizes(s("40", "41"))).toBe(true);
    expect(areShoeSizes(s("S", "40"))).toBe(false);
    expect(areShoeSizes([])).toBe(false);
  });
});
