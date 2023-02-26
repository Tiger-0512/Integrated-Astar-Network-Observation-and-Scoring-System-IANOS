import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ status: "ok" }));
  console.log(`Grafana endpoint: ${process.env.GRAFANA_ENDPOINT}`);
  console.log(`Grafana port: ${process.env.GRAFANA_PORT}`);
  console.log(`Grafana api key: ${process.env.GRAFANA_API_KEY}`);
}
