import { FC, useEffect, useState } from "react";
import Head from "next/head";

import Header from "@/components/Header";
import connectWallet from "@/components/utils/connectWallet";
import ScorePanel from "@/components/ScorePanel";
import DiversityScorePanel from "@/components/DiversityScorePanel";
import StatisticsPanel from "@/components/StatisticsPanel";
import { useStore } from "@/libs/store";

const Home: FC = () => {
  const { address } = useStore((state) => state);
  const { setAddress } = useStore((state) => state);
  const {
    dashboardUrl,
    traderScoreDbUrl,
    diamondScoreDbUrl,
    diversityScoreDbUrl,
    statisticsDbUrl,
  } = useStore((state) => state);

  const [usAddress, setUsAddress] = useState("");
  const [usTraderScoreDbUrl, setUsTraderScoreDbUrl] = useState("");
  const [usDiamondScoreDbUrl, setUsDiamondScoreDbUrl] = useState("");
  const [usDiversityScoreDbUrl, setUsDiversityScoreDbUrl] = useState("");
  const [usStatisticsDbUrl, setUsStatisticsDbUrl] = useState("");

  useEffect(() => {
    setUsAddress(address);
    setUsTraderScoreDbUrl(traderScoreDbUrl);
    setUsDiamondScoreDbUrl(diamondScoreDbUrl);
    setUsDiversityScoreDbUrl(diversityScoreDbUrl);
    setUsStatisticsDbUrl(statisticsDbUrl);
  }, [address, traderScoreDbUrl, diamondScoreDbUrl, diversityScoreDbUrl, statisticsDbUrl]);

  useEffect(() => {
    if (!usAddress) {
      connectWallet(setAddress);
    }
  }, [address]);

  return (
    <>
      <Head>
        <title>IANOS</title>
        <meta name="description" content="Integrated Astar Network Observation and Scoring System (IANOS)" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="text-white bg-black">
        <div className="flex flex-col items-center p-4 min-h-screen mx-auto max-w-7xl">
          <div className="flex flex-col w-full">
            <div className="grid grid-cols-2 gap-4 justify-items-center w-full">
              <ScorePanel
                dashboardName="Trader Score"
                dashboardUrl={usTraderScoreDbUrl}
                isLeft={true}
              />
              <ScorePanel
                dashboardName="Last Block Number"
                dashboardUrl={usDiamondScoreDbUrl}
                isLeft={false}
              />
              <DiversityScorePanel
                dashboardName="Trading Diversity Score"
                dashboardUrl={usDiversityScoreDbUrl}
              />
              <StatisticsPanel dashboardName="Statistics" dashboardUrl={usStatisticsDbUrl} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
