import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const grafanaEndpointUrl = `http://${process.env.GRAFANA_ENDPOINT}:${process.env.GRAFANA_PORT}`;

const grafanaHttpHeaders: object = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.GRAFANA_API_KEY}`,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("********** Staring to get datasource UID ************");
  const datasourceUid = req.headers.datasource_uid;

  if (datasourceUid) {
    console.log("Datasource UID already exists")
    console.log("Datasource UID: ", datasourceUid);

    res.status(200).json({ datasourceUid: datasourceUid });
  } else {
    const datasourceResponse = await axios.get(
      `${grafanaEndpointUrl}/api/datasources/name/OpenSearch`,
      grafanaHttpHeaders
    );
    console.log(datasourceResponse);
    console.log(datasourceResponse.data["uid"]);
    const datasourceUidRes = datasourceResponse.data["uid"];

    console.log(`********** Finished to get datasource UID ************: ${datasourceUidRes}`);
    res.status(200).json({ datasourceUid: datasourceUidRes });
  }
}

