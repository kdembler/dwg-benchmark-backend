import { Client, Transport } from "@elastic/elasticsearch";
import dotenv from "dotenv";

dotenv.config();

const createTransport = (prefix: string) =>
  class MTransport extends Transport {
    // @ts-ignore
    async request(params: any, options: any) {
      params.path = prefix + params.path;
      return super.request(params, options);
    }
  };
export async function getEsClient() {
  const { ELASTICSEARCH_URL, ELASTICSEARCH_USERNAME, ELASTICSEARCH_PASSWORD } =
    process.env;
  if (!ELASTICSEARCH_URL) {
    console.error("ELASTICSEARCH_URL not set");
    return null;
  }
  if (!ELASTICSEARCH_USERNAME) {
    console.error("ELASTICSEARCH_USERNAME not set");
    return null;
  }
  if (!ELASTICSEARCH_PASSWORD) {
    console.error("ELASTICSEARCH_PASSWORD not set");
    return null;
  }
  const url = new URL(ELASTICSEARCH_URL);
  const esClient = new Client({
    node: url.origin,
    // @ts-ignore
    Transport: createTransport(url.pathname),
    auth: {
      username: ELASTICSEARCH_USERNAME,
      password: ELASTICSEARCH_PASSWORD,
    },
  });
  try {
    if (!(await esClient.ping())) {
      console.error("Elasticsearch ping failed");
      return null;
    }
  } catch (e) {
    console.error("Failed to connect to Elasticsearch");
    console.error(e);
    return null;
  }

  return esClient;
}
