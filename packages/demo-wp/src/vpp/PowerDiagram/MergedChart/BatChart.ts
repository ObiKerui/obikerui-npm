import * as d3PlotLib from '@obikerui/d3-plot-lib';
import * as d3 from 'd3';
import dayjs from 'dayjs';
import { tPowerCategory } from '../../Solax/Types';
import { tChart } from './Model';
import { powerNodeMap } from '../../Solax/Model';

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
    const { batContainer, rangedData, visibility } = newModel;

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

    // colour
    const colour = powerNodeMap.get('battery')?.colour ?? 'default';
    const showChart = visibility.includes('battery') ?? false;

    const display = showChart ? 'block' : 'none';
    const showBothCharts =
      visibility.includes('pv') ||
      visibility.includes('load') ||
      visibility.includes('grid');

    this.container.attrs = {
      ...this.container.attrs,
      html: batContainer,
      display,
      width: 500,
      height: showBothCharts ? 200 : 400,
      yAxisLabel: 'Battery % (soc)',
      xAxisText: {
        rotation: 45,
        onRender: (d: string) => dayjs(d).format('HH:MM'),
      },
      xAxisLabel: '',
      onGetXScale: (chartWidth: number) =>
        d3.scaleTime().domain(validExtent).rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3.scaleLinear().domain([0, 100]).rangeRound([chartHeight, 0]),
    } as d3PlotLib.tContainerAttrs;

    const plot = this.container.getPlots()[0];
    plot.attrs = {
      ...plot.attrs,
      opacity: [0.5],
      lineAttrs: [
        {
          fillColour: colour,
          opacity: 0.5,
        } as d3PlotLib.tLineAttrs,
      ],
      xs,
      ys: [ys],
    } as d3PlotLib.tPlotAttrs;

    this.container.update();
  }
}

export { Chart };