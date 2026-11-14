const CLOTHING_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];

/** Shoe sizes are plain numbers (EU), clothing sizes are letters. */
export const isShoeSize = (name: string): boolean => /^\d+(\.\d+)?$/.test(name.trim());

const rank = (name: string): number => {
  if (isShoeSize(name)) return 100 + Number(name);
  const i = CLOTHING_ORDER.indexOf(name.toUpperCase());
  return i === -1 ? 1000 : i;
};

/** Returns a sorted copy: XS to XXL first, then numeric sizes ascending, then anything else by name. */
export const sortSizes = <T extends { name: string }>(sizes: readonly T[]): T[] =>
  [...sizes].sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name));

/** True when every size in the list is a shoe size. */
export const areShoeSizes = (sizes: readonly { name: string }[]): boolean =>
  sizes.length > 0 && sizes.every((s) => isShoeSize(s.name));
