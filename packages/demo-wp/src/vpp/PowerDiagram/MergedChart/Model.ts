import { create } from 'zustand';
import { tPowerCategory, tSolaxData } from '../../Solax/Types';

type tPlotDataElem = {
  key: string;
  soc: number;
};

type tTimeFrame = '48hours' | 'week' | 'month' | 'quarter';

type tChart = {
  lineContainer: HTMLDivElement | null;
  setLineContainer: (newValue: HTMLDivElement | null) => void;
  batContainer: HTMLDivElement | null;
  setBatContainer: (newValue: HTMLDivElement | null) => void;
  pvContainer: HTMLDivElement | null;
  setPVContainer: (newValue: HTMLDivElement | null) => void;
  categories: tPowerCategory[];
  setCategories: (newValue: tPowerCategory[]) => void;
  rangedData: tSolaxData[];
  setRangedData: (newValue: tSolaxData[]) => void;
  timeFrame: tTimeFrame;
  setTimeFrame: (newValue: tTimeFrame) => void;
  visibility: string[];
  setVisibility: (newValue: string[]) => void;
};

const useChart = create<tChart>((set) => ({
  lineContainer: null,
  setLineContainer: (newValue) => set({ lineContainer: newValue }),
  batContainer: null,
  setBatContainer: (newValue) => set({ batContainer: newValue }),
  pvContainer: null,
  setPVContainer: (newValue) => set({ pvContainer: newValue }),
  categories: [],
  setCategories: (newValue) => set({ categories: newValue }),
  rangedData: [],
  setRangedData: (newValue) => set({ rangedData: newValue }),
  timeFrame: '48hours',
  setTimeFrame: (newValue) => set({ timeFrame: newValue }),
  visibility: [],
  setVisibility: (newValue) => set({ visibility: newValue }),
}));

export { useChart };
export type { tChart, tTimeFrame, tPlotDataElem };
