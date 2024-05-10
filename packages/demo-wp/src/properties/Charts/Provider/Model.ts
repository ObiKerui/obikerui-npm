/* eslint-disable max-classes-per-file */

type tPageElements = {
  roiPlotDiv: HTMLDivElement | null;
  linePlotDiv: HTMLDivElement | null;
};

type tROIPlotAttrs = {
  xAxisTitle: string;
  yAxisTitle: string;
};

type tEntry = {
  x: number;
  y: number;
  v: number;
};

type tYieldMarkers = { x: number; y: number; value: number }[];

type tYieldData = {
  entries: tEntry[];
  markers: tYieldMarkers;
};

class PlotModel {
  pageElements: tPageElements;
  rentalIncome: number;
  rentalCost: number;
  investment: number;
  yieldData: tYieldData;
  roiPlot: tROIPlotAttrs;

  constructor() {
    this.pageElements = {
      roiPlotDiv: null,
      linePlotDiv: null,
    };
    this.rentalIncome = 0;
    this.rentalCost = 0;
    this.investment = 0;
    this.yieldData = {
      entries: [],
      markers: [],
    };
    this.roiPlot = {
      xAxisTitle: 'Cashflow (£ / Month)',
      yAxisTitle: 'Investment (£)',
    };
  }
}

export { PlotModel };
export type { tPageElements, tEntry };
