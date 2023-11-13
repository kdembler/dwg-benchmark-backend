import express from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import morgan from "morgan";
import { bodySchema } from "./schema.js";
import { getEsClient } from "./config.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));
app.set("trust proxy", true);

const esClient = await getEsClient();
if (!esClient) {
  process.exit(1);
}

const limiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 10,
  validate: { trustProxy: false },
});
app.use(limiter);

app.post("/", async (req, res) => {
  const validationResult = bodySchema.safeParse(req.body);

  if (!validationResult.success) {
    console.error(validationResult.error);
    res.status(400).json({ error: validationResult.error });
    return;
  }

  try {
    const body = validationResult.data.flatMap((result) => [
      { index: { _index: "distributors-benchmark" } },
      {
        ...result,
        urlOrigin: new URL(result.url).origin,
        sourceIp: req.ip,
        timestamp: new Date().toISOString(),
      },
    ]);
    await esClient!.bulk({ body });
    res.status(201).end();
  } catch (error) {
    res.status(500).end();
  }
});

app.listen(3000, async () => {
  console.log("Server running on http://localhost:3000/");
});
