import z from "zod";

const fullResultSchema = z.object({
  ttfb: z.number(),
  totalRequestTime: z.number(),
  downloadTime: z.number(),
  downloadSpeedBps: z.number(),
  downloadSize: z.number(),
  url: z.string().url(),
  cacheStatus: z.string(),
  objectType: z.string(),
  uid: z.string().uuid(),
  referenceDownloadSpeedBps: z.number(),
  referenceLatency: z.number(),
});

const errorResultSchema = z.object({
  url: z.string().url(),
  error: z.string(),
  uid: z.string().uuid(),
  referenceDownloadSpeedBps: z.number(),
  referenceLatency: z.number(),
});

const unionSchema = z.union([fullResultSchema, errorResultSchema]);
export const bodySchema = z.array(unionSchema);
