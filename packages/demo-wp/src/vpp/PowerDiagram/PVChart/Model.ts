import { create } from 'zustand';
import { tPowerCategory, tSolaxData } from '../../Solax/Types';

type tPlotDataElem = {
  key: string;
  soc: number;
};

type tTimeFrame = '48hours' | 'week' | 'month' | 'quarter';

type tPVChart = {
  lineContainer: HTMLDivElement | null;
  setLineContainer: (newValue: HTMLDivElement | null) => void;
  sunChartContainer: HTMLDivElement | null;
  setSunChartContainer: (newValue: HTMLDivElement | null) => void;
  categories: tPowerCategory[];
  setCategories: (newValue: tPowerCategory[]) => void;
  rangedData: tSolaxData[];
  setRangedData: (newValue: tSolaxData[]) => void;
  timeFrame: tTimeFrame;
  setTimeFrame: (newValue: tTimeFrame) => void;
};

const usePVChart = create<tPVChart>((set) => ({
  sunChartContainer: null,
  setSunChartContainer: (newValue) => set({ sunChartContainer: newValue }),
  lineContainer: null,
  setLineContainer: (newValue) => set({ lineContainer: newValue }),
  categories: [],
  setCategories: (newValue) => set({ categories: newValue }),
  rangedData: [],
  setRangedData: (newValue) => set({ rangedData: newValue }),
  timeFrame: '48hours',
  setTimeFrame: (newValue) => set({ timeFrame: newValue }),
}));

export { usePVChart };
export type { tPVChart, tTimeFrame, tPlotDataElem };
