import * as d3PlotLib from '@obikerui/d3-plot-lib';
import * as d3 from 'd3';
import { create } from 'zustand';
import { tGroupedData } from '../../Solax/Grouper';
import { tPowerCategory } from '../../Solax/Types';

type tPlotDataElem = {
  key: string;
  soc: number;
};

type tTimeFrame = 'hours' | 'days' | 'weeks' | 'months';

type tBatteryChart = {
  container: HTMLDivElement | null;
  setContainer: (newValue: HTMLDivElement | null) => void;
  categories: tPowerCategory[];
  setCategories: (newValue: tPowerCategory[]) => void;
  groupedData: tGroupedData | null;
  setGroupedData: (newValue: tGroupedData | null) => void;
  timeFrame: tTimeFrame;
  setTimeFrame: (newValue: tTimeFrame) => void;
};

const useBatteryChart = create<tBatteryChart>((set) => ({
  container: null,
  setContainer: (newValue) => set({ container: newValue }),
  categories: [],
  setCategories: (newValue) => set({ categories: newValue }),
  groupedData: null,
  setGroupedData: (newValue) => set({ groupedData: newValue }),
  timeFrame: 'weeks',
  setTimeFrame: (newValue) => set({ timeFrame: newValue }),
}));

class Chart {
  container;
  constructor() {
    this.container = new d3PlotLib.CContainer();
    this.container.addPlot(new d3PlotLib.CStackedArea());
  }

  // filterCategories(categories: string[], toKeep: string) {
  //   return categories.filter((elem) => elem === toKeep);
  // }

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
    const { container, categories, groupedData } = newModel;

    if (!groupedData) {
      return;
    }

    const { data, colours } = groupedData;

    const dataGen = d3.stack().keys(categories).order(d3.stackOrderAscending);
    const stackedData = dataGen(data as unknown as { [key: string]: number }[]);

    const labels = data.map((elem) => elem.key);
    const minMax = this.getMinMax(categories[0] ?? 'unknown');

    console.log('stacked data? ', stackedData, data, categories);

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
        d3
          .scaleBand()
          .domain(labels)
          .paddingInner(0.2)
          .rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3.scaleLinear().domain(minMax).rangeRound([chartHeight, 0]),
    } as d3PlotLib.tContainerAttrs;

    const plot = this.container.getPlots()[0];
    plot.attrs = {
      ...plot.attrs,
      colours,
      opacity: [0.5],
      stackedDataset: stackedData,
    } as d3PlotLib.tPlotAttrs;

    this.container.update();
  }
}

const chart = new Chart();

useBatteryChart.subscribe((newModel) => {
  chart.update(newModel);
});

export { useBatteryChart };
export type { tPlotDataElem, tBatteryChart };
