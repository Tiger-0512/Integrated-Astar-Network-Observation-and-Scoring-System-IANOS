import { NextApiRequest, NextApiResponse } from "next";
import clone from "clone";
import axios from "axios";

import sampleDashboardBody from "./api-body/sampleDashboardBody";
import sampleSnapshotBody from "./api-body/sampleSnapshotBody";
import traderScoreSnapshotBody from "./api-body/traderScoreSnapshotBody";
import lastBlockNumberScoreSnapshotBody from "./api-body/lastBlockNumberScoreSnapshotBody";
import statisticsSnapshotBody from "./api-body/statisticsSnapshot";
import allInOneSnapshotBody from "./api-body/allInOneSnapshotBody"; 
import getTraderScoreBodyByAddress from "@/components/utils/getTraderScoreByAddress";
import getStatisticsBySymbol from "@/components/utils/getStatisticsBySymbol";

// 今回は動作確認のため既に多くのトランザクションを行っているアドレスを指定します。
const address = "0x649be1c4dface544857e54d5c3fbdb8152b84b4e";
const traderScoreBody = getTraderScoreBodyByAddress(address);

const symbol = "WASTR";
const statisticsBody = getStatisticsBySymbol(symbol);

const grafanaEndpointUrl = `http://${process.env.GRAFANA_ENDPOINT}:${process.env.GRAFANA_PORT}`;

const grafanaHttpHeaders: object = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.GRAFANA_API_KEY}`,
  },
};

// let UserAddressDashboardUIDMap = new Map<string, string>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("********** Starting to get dashboard URL ************");
  const userAddress = req.headers.user_address;
  const dashboardUrl = req.headers.dashboard_url;
  const dashboardType = req.headers.dashboard_type;

  let body;
  if (dashboardType === "trader") {
    body = traderScoreBody;
  } else if (dashboardType === "diamond") {
    body = lastBlockNumberScoreSnapshotBody;
  } else if (dashboardType === "statistics") {
    body = statisticsBody;
  } else {
    body = allInOneSnapshotBody;
  }

  if (dashboardUrl) {
    console.log("Dashboard URL already exists");
    console.log("Dashboard URL: ", dashboardUrl);

    res.status(200).json({ dashboardUrl: dashboardUrl });
  } else {
    // ************ Create new folder ************
    // see also API reference: https://grafana.com/docs/grafana/v8.4/http_api/folder/
    const createFolderResponse = await axios.post(
      `${grafanaEndpointUrl}/api/folders/`,
      { title: `${userAddress}-${dashboardType}-folder` },
      grafanaHttpHeaders
    );
    const folderUid = createFolderResponse.data["uid"];
    // UserAddressDashboardUIDMap.set(`${userAddress}-dashboard`, createFolderResponse.data["uid"]);

    // ************ Create new dashboard ************
    // let newDashboardBody: any = clone(dashboardBody);
    let newDashboardBody: any = clone(sampleDashboardBody);
    newDashboardBody["folderUid"] = folderUid;
    const createDashboardResponse = await axios.post(
      `${grafanaEndpointUrl}/api/dashboards/db/`,
      newDashboardBody,
      grafanaHttpHeaders
    );

    // ************ Create new snapshot ************
    const createSnapshotResponse = await axios.post(
      `${grafanaEndpointUrl}/api/snapshots/`,
      // snapshotBody,
      body,
      grafanaHttpHeaders
    );
    console.log(`key: ${createSnapshotResponse.data["key"]}`);
    console.log(`url: ${createSnapshotResponse.data["url"]}`); // "myurl/dashboard/snapshot/YYYYYYY"
    const snapshotKey = createSnapshotResponse.data["key"];
    const snapshotUrl = `${grafanaEndpointUrl}/dashboard/snapshot/${snapshotKey}?kiosk`;
    // UserAddressDashboardUIDMap.set(userAddressSnapshotNameKey, createSnapshotResponse.data["url"]);

    console.log(`********** Finished to get dashboard URL ************: ${snapshotUrl}`);

    res.status(200).json({ dashboardUrl: snapshotUrl });
  }
}
