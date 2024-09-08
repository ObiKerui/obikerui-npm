import * as d3PlotLib from '@obikerui/d3-plot-lib';
import * as d3 from 'd3';
import dayjs from 'dayjs';
import { tPowerCategory } from '../../../Solax/Types';
import { powerNodeMap } from '../../../Solax/Model';
import { tChart } from '../Model';

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

  update(newModel: tChart) {
    const { lineContainer, rangedData, visibility } = newModel;

    if (!rangedData) {
      return;
    }

    const extent = d3.extent(
      rangedData,
      (elem) => dayjs(elem.uploadTime).toDate() as Date
    );

    const validXDomain = [extent[0] ?? new Date(), extent[1] ?? new Date()] as [
      Date,
      Date
    ];

    const yieldData = rangedData.map((elem) => elem.yieldtoday);
    const loadData = rangedData.map((elem) => elem.consumeenergy);
    const gridData = rangedData.map((elem) => elem.feedinpower);
    const batData = rangedData.map((elem) => elem.soc);

    const xs = rangedData.map((elem) => dayjs(elem.uploadTime).toDate());

    // push extra values on to arrays to create bottom right and bottom left points for fill
    const bottomRightX = xs[xs.length - 1] ?? null;
    const bottomLeftX = xs[0] ?? null;

    if (bottomLeftX && bottomRightX) {
      xs.push(bottomRightX, bottomLeftX);
      yieldData.push(0, 0);
      loadData.push(0, 0);
      gridData.push(0, 0);
      batData.push(0, 0);
    }

    const pvOpacity = visibility.includes('pv') ? 0.5 : 0;
    const pvColour = powerNodeMap.get('pv')?.colour ?? 'default';
    const loadOpacity = visibility.includes('load') ? 0.5 : 0;
    const loadColour = powerNodeMap.get('load')?.colour ?? 'default';
    const gridOpacity = visibility.includes('grid') ? 0.5 : 0;
    const gridColour = powerNodeMap.get('grid')?.colour ?? 'default';
    const batOpacity = visibility.includes('battery') ? 0.5 : 0;
    const batColour = powerNodeMap.get('battery')?.colour ?? 'default';

    const validYDomain = [-3000, 8000];
    const yData = [yieldData, loadData, gridData];

    const isShown =
      visibility.includes('pv') ||
      visibility.includes('load') ||
      visibility.includes('grid');

    this.container.attrs = {
      ...this.container.attrs,
      display: isShown ? 'block' : 'none',
      html: lineContainer,
      width: 500,
      height: 400,
      yAxisLabel: 'Power Watts',
      xAxisText: {
        rotation: 45,
        onRender: (d: string) => dayjs(d).format('HH:MM'),
      },
      xAxisLabel: '',
      onGetXScale: (chartWidth: number) =>
        d3.scaleTime().domain(validXDomain).rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3.scaleLinear().domain(validYDomain).rangeRound([chartHeight, 0]),
    } as d3PlotLib.tContainerAttrs;

    const plot = this.container.getPlots()[0];
    plot.attrs = {
      ...plot.attrs,
      opacity: [0.5],
      lineAttrs: [
        {
          stroke: pvColour,
          fillColour: pvColour,
          opacity: pvOpacity,
        } as d3PlotLib.tLineAttrs,
        {
          stroke: loadColour,
          fillColour: loadColour,
          opacity: loadOpacity,
        } as d3PlotLib.tLineAttrs,
        {
          stroke: gridColour,
          fillColour: gridColour,
          opacity: gridOpacity,
        } as d3PlotLib.tLineAttrs,
        {
          stroke: batColour,
          fillColour: batColour,
          opacity: batOpacity,
        } as d3PlotLib.tLineAttrs,
      ],
      xs,
      ys: yData,
    } as d3PlotLib.tPlotAttrs;

    this.container.update();
  }
}

export { Chart };
