import { FC, useEffect, useState } from "react";
import IframeDashboard from "@/components/IframeDashboard";
import { useStore } from "@/libs/store";

type ScorePanelProps = {
  dashboardName: string;
  dashboardUrl: string;
};

const StatisticsPanel: FC<ScorePanelProps> = (props) => {
  // const { dashboardUrl } = useStore((state) => state);

  // useEffect(() => {
  //   setUsDashboardUrl(dashboardUrl);
  // }, [dashboardUrl]);

  // const [usDashboardUrl, setUsDashboardUrl] = useState("");

  return (
    <div className="col-span-2 rounded-md col-span1 bg-gradient-to-r from-[#C6279B] via-[#694CCE] to-[#02E3FF] w-full p-0.5">
      <div className="rounded-lg h-full w-full bg-grafana-black p-1">
        <div className="text-2xl p-4">{props.dashboardName}</div>
        <div className="justify-items-center w-full h-[50rem]">
          {props.dashboardUrl === "" ? (
            <div></div>
          ) : (
            <IframeDashboard dashboardUrl={props.dashboardUrl} />
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;
