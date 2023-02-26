import { create, StateCreator } from "zustand";
import { devtools, persist, PersistOptions } from "zustand/middleware";

type MyState = {
  address: string;
  dashboardUrl: string;
  traderScoreDbUrl: string;
  diamondScoreDbUrl: string;
  diversityScoreDbUrl: string;
  statisticsDbUrl: string;
  allDbUrl: string;
  setAddress: (_address: string) => void;
  setDashboardUrl: (_dashboardUrl: string) => void;
  setTraderScoreDbUrl: (_traderScoreDbUrl: string) => void;
  setDiamondScoreDbUrl: (_diamondScoreDbUrl: string) => void;
  setDiversityScoreDbUrl: (_diversityScoreDbUrl: string) => void;
  setStatisticsDbUrl: (_statisticsDbUrl: string) => void;
  setAllDbUrl: (_allDbUrl: string) => void;
};
type MyPersist = (
  config: StateCreator<MyState>,
  options: PersistOptions<MyState>
) => StateCreator<MyState>;

export const useStore = create<MyState>(
  (persist as MyPersist)(
    (set) => ({
      address: "",
      dashboardUrl: "",
      traderScoreDbUrl: "",
      diamondScoreDbUrl: "",
      diversityScoreDbUrl: "",
      statisticsDbUrl: "",
      allDbUrl: "",
      setAddress: (_address: string) => set({ address: _address }),
      setDashboardUrl: (_dashboardUrl: string) => set({ dashboardUrl: _dashboardUrl }),
      setTraderScoreDbUrl: (_traderScoreDbUrl: string) =>
        set({ traderScoreDbUrl: _traderScoreDbUrl }),
      setDiamondScoreDbUrl: (_diamondScoreDbUrl: string) =>
        set({ diamondScoreDbUrl: _diamondScoreDbUrl }),
      setDiversityScoreDbUrl: (_diversityScoreDbUrl: string) =>
        set({ diversityScoreDbUrl: _diversityScoreDbUrl }),
      setStatisticsDbUrl: (_statisticsDbUrl: string) => set({ statisticsDbUrl: _statisticsDbUrl }),
      setAllDbUrl: (_allDbUrl: string) => set({ allDbUrl: _allDbUrl }),
    }),
    {
      name: "local-storage",
    }
  )
);
