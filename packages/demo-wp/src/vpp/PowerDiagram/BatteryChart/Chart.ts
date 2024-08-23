import * as d3PlotLib from '@obikerui/d3-plot-lib';
import * as d3 from 'd3';
import { create } from 'zustand';
import dayjs from 'dayjs';
import { tPowerCategory, tSolaxData } from '../../Solax/Types';

type tPlotDataElem = {
  key: string;
  soc: number;
};

type tTimeFrame = '48hours' | 'week' | 'month' | 'quarter';

type tBatteryChart = {
  container: HTMLDivElement | null;
  setContainer: (newValue: HTMLDivElement | null) => void;
  categories: tPowerCategory[];
  setCategories: (newValue: tPowerCategory[]) => void;
  rangedData: tSolaxData[];
  setRangedData: (newValue: tSolaxData[]) => void;
  timeFrame: tTimeFrame;
  setTimeFrame: (newValue: tTimeFrame) => void;
};

const useBatteryChart = create<tBatteryChart>((set) => ({
  container: null,
  setContainer: (newValue) => set({ container: newValue }),
  categories: [],
  setCategories: (newValue) => set({ categories: newValue }),
  rangedData: [],
  setRangedData: (newValue) => set({ rangedData: newValue }),
  timeFrame: '48hours',
  setTimeFrame: (newValue) => set({ timeFrame: newValue }),
}));

class Chart {
  container;
  constructor() {
    this.container = new d3PlotLib.CContainer();
    this.container.addPlot(new d3PlotLib.CLines());
  }

  getMinMax(category: tPowerCategory) {
    switch (category) {
      case 'consumption':
        return [0, 5000];
      case 'dailyYield':
        return [0, 400];
      case 'feedInEnergy':
        return [0, 5000];
      case 'soc':
        return [0, 100];
      default:
        return [0, 0];
    }
  }

  update(newModel: tBatteryChart) {
    const { container, categories, rangedData } = newModel;

    if (!rangedData) {
      return;
    }

    const extent = d3.extent(
      rangedData,
      (elem) => dayjs(elem.uploadTime).toDate() as Date
    );

    const validExtent = [extent[0] ?? new Date(), extent[1] ?? new Date()] as [
      Date,
      Date
    ];

    const ys = rangedData.map((elem) => elem.soc);
    const xs = rangedData.map((elem) => dayjs(elem.uploadTime).toDate());

    // push extra values on to arrays to create bottom right and bottom left points for fill
    const bottomRightX = xs[xs.length - 1] ?? null;
    const bottomLeftX = xs[0] ?? null;

    if (bottomLeftX && bottomRightX) {
      xs.push(bottomRightX, bottomLeftX);
      ys.push(0, 0);
    }

    this.container.attrs = {
      ...this.container.attrs,
      html: container,
      width: 500,
      height: 400,
      yAxisLabel: categories[0] ?? '',
      xAxisText: {
        rotation: 45,
        onRender: () => '',
      },
      onGetXScale: (chartWidth: number) =>
        d3.scaleTime().domain(validExtent).rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3.scaleLinear().domain([0, 100]).rangeRound([chartHeight, 0]),
    } as d3PlotLib.tContainerAttrs;

    const plot = this.container.getPlots()[0];
    plot.attrs = {
      ...plot.attrs,
      opacity: [0.5],
      fill: [
        {
          colour: 'red',
          opacity: 0.5,
        } as d3PlotLib.tFill,
      ],
      xs,
      ys: [ys],
    } as d3PlotLib.tPlotAttrs;

    this.container.update();
  }
}

const chart = new Chart();

useBatteryChart.subscribe((newModel) => {
  chart.update(newModel);
});

export { useBatteryChart };
export type { tPlotDataElem, tBatteryChart, tTimeFrame };
