import { create } from 'zustand';
import { tPowerCategory, tSolaxData } from '../../Solax/Types';
import { tShowing } from './SharedTypes';

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
  accumulatedYield: number;
  setAccumulatedYield: (newValue: number) => void;
  accumulatedExport: number;
  setAccumulatedExport: (newValue: number) => void;
  showingOption: tShowing;
  setShowingOption: (newValue: tShowing) => void;
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
  accumulatedYield: 0,
  setAccumulatedYield: (newValue) => set({ accumulatedYield: newValue }),
  accumulatedExport: 0,
  setAccumulatedExport: (newValue) => set({ accumulatedYield: newValue }),
  showingOption: 'preview',
  setShowingOption: (newValue: tShowing) => set({ showingOption: newValue }),
}));

export { useChart };
export type { tChart, tTimeFrame, tPlotDataElem };
