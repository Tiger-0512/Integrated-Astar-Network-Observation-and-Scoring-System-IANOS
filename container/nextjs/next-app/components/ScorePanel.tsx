import { FC, useEffect, useState } from "react";
import IframeDashboard from "@/components/IframeDashboard";
import { useStore } from "@/libs/store";

type ScorePanelProps = {
  dashboardName: string;
  dashboardUrl: string;
  isLeft?: boolean;
};

const ScorePanel: FC<ScorePanelProps> = (props) => {
  // const { dashboardUrl } = useStore((state) => state);

  // useEffect(() => {
  //   setUsDashboardUrl(dashboardUrl);
  // }, [dashboardUrl]);

  // const [usDashboardUrl, setUsDashboardUrl] = useState("");

  return props.isLeft ? (
    <div className="rounded-md col-span1 bg-gradient-to-r from-[#C6279B] to-[#694CCE] w-full p-0.5">
      <InnerPanel dashboardName={props.dashboardName} dashboardUrl={props.dashboardUrl} />
    </div>
  ) : (
    <div className="rounded-md col-span1 bg-gradient-to-r from-[#694CCE] to-[#02E3FF] w-full p-0.5">
      <InnerPanel dashboardName={props.dashboardName} dashboardUrl={props.dashboardUrl} />
    </div>
  );
};

const InnerPanel: FC<ScorePanelProps> = (props) => {
  return (
    <div className="rounded-lg h-full w-full bg-grafana-black p-1">
      <div className="text-2xl p-4">{props.dashboardName}</div>
      <div className="justify-items-center w-full h-96">
        {props.dashboardUrl === "" ? (
          <div></div>
        ) : (
          <IframeDashboard dashboardUrl={props.dashboardUrl} />
        )}
      </div>
    </div>
  );
};

export default ScorePanel;
