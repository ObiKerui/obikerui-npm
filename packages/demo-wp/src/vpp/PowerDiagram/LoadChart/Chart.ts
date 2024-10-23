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
    const { lineContainer, categories, rangedData } = newModel;

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

    const ys = rangedData.map((elem) => elem.consumeenergy);
    const xs = rangedData.map((elem) => dayjs(elem.uploadTime).toDate());

    // push extra values on to arrays to create bottom right and bottom left points for fill
    const bottomRightX = xs[xs.length - 1] ?? null;
    const bottomLeftX = xs[0] ?? null;

    // colour
    const colour = powerNodeMap.get('load')?.colour ?? 'default';

    if (bottomLeftX && bottomRightX) {
      xs.push(bottomRightX, bottomLeftX);
      ys.push(0, 0);
    }

    this.container.attrs = {
      ...this.container.attrs,
      html: lineContainer,
      width: 500,
      height: 400,
      // yAxisLabel: categories[0] ?? '',
      yAxisProperties: this.container.axisLayout.topYAxisLabel(
        categories[0] ?? ''
      ),
      xAxisText: {
        rotation: 45,
        onRender: () => '',
      },
      onGetXScale: (chartWidth: number) =>
        d3.scaleTime().domain(validExtent).rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3.scaleLinear().domain([0, 8000]).rangeRound([chartHeight, 0]),
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
