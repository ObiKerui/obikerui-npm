import * as d3PlotLib from '@obikerui/d3-plot-lib';
import * as d3 from 'd3';
import dayjs from 'dayjs';
import { tChart } from './Model';

class Chart {
  container;
  constructor() {
    this.container = new d3PlotLib.CContainer();
    this.container.addPlot(new d3PlotLib.CLines());
  }

  update(newModel: tChart) {
    const { lineContainer, processedData } = newModel;

    // if (!rangedData) {
    //   return;
    // }

    const extent = d3.extent(
      processedData,
      (elem) => dayjs(elem.validFrom).toDate() as Date
    );

    const validXDomain = [extent[0] ?? new Date(), extent[1] ?? new Date()] as [
      Date,
      Date
    ];

    const xs = processedData.map((elem) => dayjs(elem.validFrom).toDate());
    const priceData = processedData.map((elem) => elem.valueIncVat);

    const validYDomain = d3.extent(priceData) as [number, number];
    validYDomain[1] += 20;

    // push extra values on to arrays to create bottom right and bottom left points for fill
    const bottomRightX = xs[xs.length - 1] ?? null;
    const bottomLeftX = xs[0] ?? null;

    if (bottomLeftX && bottomRightX) {
      xs.push(bottomRightX, bottomLeftX);
      priceData.push(0, 0);
    }

    // const validYDomain = [-3000, 8000];
    // const yData = [yieldData, loadData, gridData];

    this.container.attrs = {
      ...this.container.attrs,
      html: lineContainer,
      width: 500,
      height: 400,
      yAxisLabel: 'P per Kwh',
      xAxisText: {
        rotation: 0,
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
          stroke: 'red',
          fillColour: 'red',
          opacity: 0.5,
        } as d3PlotLib.tLineAttrs,
      ],
      xs,
      ys: [priceData],
    } as d3PlotLib.tPlotAttrs;

    this.container.update();
  }
}

export { Chart };
