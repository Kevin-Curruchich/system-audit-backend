import crypto from "crypto";

export const hash = (string: string): string => {
  const hash = crypto.createHash("sha512").update(string).digest("hex");

  return hash;
};

export const hash_compare = (
  first_item: string,
  second_item: string
): boolean => {
  return Object.is(first_item, second_item);
};
