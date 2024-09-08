import { create } from 'zustand';
import { tPowerCategory, tSolaxData, tProfitLoss } from '../../Solax/Types';

type tPlotDataElem = {
  key: string;
  soc: number;
};

type tTimeFrame = '48hours' | 'week' | 'month' | 'quarter';

type tGridChart = {
  barContainer: HTMLDivElement | null;
  setBarContainer: (newValue: HTMLDivElement | null) => void;
  profitLossContainer: HTMLDivElement | null;
  setProfitLossContainer: (newValue: HTMLDivElement | null) => void;
  categories: tPowerCategory[];
  setCategories: (newValue: tPowerCategory[]) => void;
  rangedData: tSolaxData[];
  setRangedData: (newValue: tSolaxData[]) => void;
  timeFrame: tTimeFrame;
  setTimeFrame: (newValue: tTimeFrame) => void;
  producedConsumed: tProfitLoss | null;
  setProducedConsumed: (newValue: tProfitLoss) => void;
  profitLoss: tProfitLoss | null;
  setProfitLoss: (newValue: tProfitLoss | null) => void;
};

const useGridChart = create<tGridChart>((set) => ({
  barContainer: null,
  setBarContainer: (newValue) => set({ barContainer: newValue }),
  profitLossContainer: null,
  setProfitLossContainer: (newValue) => set({ profitLossContainer: newValue }),
  categories: [],
  setCategories: (newValue) => set({ categories: newValue }),
  rangedData: [],
  setRangedData: (newValue) => set({ rangedData: newValue }),
  timeFrame: '48hours',
  setTimeFrame: (newValue) => set({ timeFrame: newValue }),
  producedConsumed: null,
  setProducedConsumed: (newValue) => set({ producedConsumed: newValue }),
  profitLoss: null,
  setProfitLoss: (newValue) => set({ profitLoss: newValue }),
}));

export { useGridChart };
export type { tGridChart, tTimeFrame, tPlotDataElem };
