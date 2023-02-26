import { FC, useEffect, useState } from "react";
import Image from "next/image";

import connectWallet from "@/components/utils/connectWallet";
import getDashboard from "@/components/utils/getDashboard";
import { useStore } from "@/libs/store";

const ConnectMetamaskButton: FC = () => {
  const {
    address,
    dashboardUrl,
    traderScoreDbUrl,
    diamondScoreDbUrl,
    diversityScoreDbUrl,
    statisticsDbUrl,
    allDbUrl,
    setAddress,
    setDashboardUrl,
    setTraderScoreDbUrl,
    setDiamondScoreDbUrl,
    setDiversityScoreDbUrl,
    setStatisticsDbUrl,
    setAllDbUrl,
  } = useStore((state) => state);

  const [usAddress, setUsAddress] = useState("");

  useEffect(() => {
    setUsAddress(address);
  }, [address]);
  useEffect(() => {
    // getDashboard(address, dashboardUrl, setDashboardUrl);
    getDashboard(address, traderScoreDbUrl, setTraderScoreDbUrl, "trader");
    getDashboard(address, diamondScoreDbUrl, setDiamondScoreDbUrl, "diamond");
    getDashboard(address, diversityScoreDbUrl, setDiversityScoreDbUrl, "diversity");
    getDashboard(address, statisticsDbUrl, setStatisticsDbUrl, "statistics");
    getDashboard(address, allDbUrl, setAllDbUrl, "all");
  }, [address]);

  console.log(`ConnectMetamask: ${address} ${dashboardUrl}`);

  return (
    <button
      type="button"
      onClick={() => connectWallet(setAddress)}
      className="ml-8 inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-base font-medium text-white shadow-sm h-12  bg-gradient-to-r from-[#C6279B] via-[#694CCE] to-[#02E3FF] rounded-lg"
    >
      <Image
        src="/images/metamask-logo.svg"
        width={24}
        height={24}
        alt="Metamask Logo"
        className="mr-4"
      />
      {usAddress === "" ? "Connect with MetaMask" : "Connected!"}
    </button>
  );
};
export default ConnectMetamaskButton;
