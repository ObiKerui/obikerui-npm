import { create } from 'zustand';
import { tPercentages, tPowerCategory, tSolaxData } from '../../Solax/Types';

type tPlotDataElem = {
  key: string;
  soc: number;
};

type tTimeFrame = '48hours' | 'week' | 'month' | 'quarter';

type tBatteryChart = {
  lineContainer: HTMLDivElement | null;
  setLineContainer: (newValue: HTMLDivElement | null) => void;
  barContainer: HTMLDivElement | null;
  setBarContainer: (newValue: HTMLDivElement | null) => void;
  categories: tPowerCategory[];
  setCategories: (newValue: tPowerCategory[]) => void;
  rangedData: tSolaxData[];
  setRangedData: (newValue: tSolaxData[]) => void;
  timeFrame: tTimeFrame;
  setTimeFrame: (newValue: tTimeFrame) => void;
  percentages: tPercentages | null;
  setPercentages: (newValue: tPercentages | null) => void;
};

const useBatteryChart = create<tBatteryChart>((set) => ({
  lineContainer: null,
  setLineContainer: (newValue) => set({ lineContainer: newValue }),
  barContainer: null,
  setBarContainer: (newValue) => set({ barContainer: newValue }),
  categories: [],
  setCategories: (newValue) => set({ categories: newValue }),
  rangedData: [],
  setRangedData: (newValue) => set({ rangedData: newValue }),
  timeFrame: '48hours',
  setTimeFrame: (newValue) => set({ timeFrame: newValue }),
  percentages: null,
  setPercentages: (newValue) => set({ percentages: newValue }),
}));

export { useBatteryChart };
export type { tBatteryChart, tTimeFrame, tPlotDataElem };
