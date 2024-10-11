import { create } from 'zustand';
import { tYield } from '../Lib/Controllers/YieldCalculator';

type tModel = {
  roiContainer: HTMLDivElement | null;
  setROIContainer: (newValue: HTMLDivElement | null) => void;
  yieldValues: tYield[];
  setYieldValues: (newValue: tYield[]) => void;
  properties: tYield[];
  setProperties: (newValue: tYield[]) => void;
  testRentalIncome: number;
  setTestRentalIncome: (newValue: number) => void;
  testRentalCost: number;
  setTestRentalCost: (newValue: number) => void;
  testInvestment: number;
  setTestInvestment: (newValue: number) => void;
};

const useROIModel = create<tModel>((set) => ({
  roiContainer: null,
  setROIContainer: (newValue) => set({ roiContainer: newValue }),
  yieldValues: [],
  setYieldValues: (newValue) => set({ yieldValues: newValue }),
  properties: [],
  setProperties: (newValue) => set({ properties: newValue }),
  testRentalIncome: 0,
  setTestRentalIncome: (newValue) => set({ testRentalIncome: newValue }),
  testRentalCost: 0,
  setTestRentalCost: (newValue) => set({ testRentalCost: newValue }),
  testInvestment: 0,
  setTestInvestment: (newValue) => set({ testInvestment: newValue }),
}));

export type { tModel };
export { useROIModel };

// type tPageElements = {
//     roiPlotDiv: HTMLDivElement | null;
//     linePlotDiv: HTMLDivElement | null;
//   };

//   type tROIPlotAttrs = {
//     xAxisTitle: string;
//     yAxisTitle: string;
//   };

//   type tEntry = {
//     x: number;
//     y: number;
//     v: number;
//   };

//   type tYieldMarkers = { x: number; y: number; value: number }[];

//   type tYieldData = {
//     entries: tEntry[];
//     markers: tYieldMarkers;
//   };

//   class PlotModel {
//     pageElements: tPageElements;
//     rentalIncome: number;
//     rentalCost: number;
//     investment: number;
//     yieldData: tYieldData;
//     roiPlot: tROIPlotAttrs;

//     constructor() {
//       this.pageElements = {
//         roiPlotDiv: null,
//         linePlotDiv: null,
//       };
//       this.rentalIncome = 0;
//       this.rentalCost = 0;
//       this.investment = 0;
//       this.yieldData = {
//         entries: [],
//         markers: [],
//       };
//       this.roiPlot = {
//         xAxisTitle: 'Cashflow (£ / Month)',
//         yAxisTitle: 'Investment (£)',
//       };
//     }
//   }
