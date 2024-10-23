import * as d3PlotLib from '@obikerui/d3-plot-lib';
import * as d3 from 'd3';
import dayjs from 'dayjs';
import { tChart } from './Model';
import { powerNodeMap } from '../../Solax/Model';

class Chart {
  container;
  constructor() {
    this.container = new d3PlotLib.CContainer();
    this.container.addPlot(new d3PlotLib.CLines());
  }

  update(newModel: tChart) {
    const { pvContainer, rangedData, visibility } = newModel;

    const extent = d3.extent(
      rangedData,
      (elem) => dayjs(elem.uploadTime).toDate() as Date
    );

    const validExtent = [extent[0] ?? new Date(), extent[1] ?? new Date()] as [
      Date,
      Date
    ];

    const max = 8000;
    const ys = rangedData.map((elem) => {
      const percentage = (elem.yieldtoday / max) * 100;
      return percentage;
    });
    const xs = rangedData.map((elem) => dayjs(elem.uploadTime).toDate());

    // push extra values on to arrays to create bottom right and bottom left points for fill
    const bottomRightX = xs[xs.length - 1] ?? null;
    const bottomLeftX = xs[0] ?? null;

    if (bottomLeftX && bottomRightX) {
      xs.push(bottomRightX, bottomLeftX);
      ys.push(0, 0);
    }

    // colour
    const colour = powerNodeMap.get('pv')?.colour ?? 'default';
    const showChart = visibility.includes('pv') ?? false;

    const display = showChart ? 'block' : 'none';

    this.container.attrs = {
      ...this.container.attrs,
      html: pvContainer,
      display,
      width: 450,
      height: 200,
      margins: {
        ...this.container.attrs.margins,
        left: 30,
        top: 40,
      },
      yAxisProperties: this.container.axisLayout.topYAxisLabel('PV Efficiency'),
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
// // const chart = new Chart();

// // useBatteryChart.subscribe((newModel) => {
// //   chart.update(newModel);
// // });
