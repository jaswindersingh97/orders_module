import { z } from "zod";

export type HealthResponse = {
  ok: true;
  service: string;
  timestamp: string;
};

export const healthResponseSchema = z.object({
  ok: z.literal(true),
  service: z.string(),
  timestamp: z.iso.datetime(),
});

export * from "./order-management";
