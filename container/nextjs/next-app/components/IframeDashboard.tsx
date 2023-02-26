import type { FC } from "react";
import { useStore } from "@/libs/store";

type IframeProps = {
  dashboardUrl: string;
};

const IframeDashboard: FC<IframeProps> = (props) => {
  console.log(`IFframeDashboard: ${props.dashboardUrl}`);

  return <iframe src={props.dashboardUrl} className="w-full h-full"></iframe>;
};

export default IframeDashboard;
