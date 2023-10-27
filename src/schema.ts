import z from "zod";

const fullResultSchema = z.object({
  ttfb: z.number(),
  totalRequestTime: z.number(),
  downloadTime: z.number(),
  downloadSpeedBps: z.number(),
  downloadSize: z.number(),
  dnsLookupTime: z.number().optional(),
  sslTime: z.number().optional(),
  processingTime: z.number().optional(),
  url: z.string().url(),
  cacheStatus: z.string(),
  objectType: z.string(),
  uid: z.string().uuid(),
  referenceDownloadSpeedBps: z.number(),
  referenceLatency: z.number(),
  version: z.string(),
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
