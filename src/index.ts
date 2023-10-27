import express from "express";
import rateLimit from "express-rate-limit";
import { bodySchema } from "./schema.js";
import { getEsClient } from "./config.js";

const app = express();
app.use(express.json());

const esClient = await getEsClient();
if (!esClient) {
  process.exit(1);
}

const limiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 10,
});
app.use(limiter);

app.post("/data", async (req, res) => {
  const validationResult = bodySchema.safeParse(req.body);

  if (!validationResult.success) {
    res.status(400).json({ error: validationResult.error });
    return;
  }

  try {
    const body = validationResult.data.flatMap((result) => [
      { index: { _index: "distributors-benchmark" } },
      result,
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
