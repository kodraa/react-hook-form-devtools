import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export const cn = (...inputs: Array<ClassValue>) => {
  return twMerge(clsx(inputs));
};

export const isStringAKeyOfSchema = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  key: unknown
): key is keyof T => {
  if (typeof key !== "string") return false;
  return Object.prototype.hasOwnProperty.call(schema.shape, key);
};
