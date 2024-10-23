/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import * as d3PlotLib from '@obikerui/d3-plot-lib';
import dayjs from 'dayjs';
import { tAveraged, tChartData, useChartData } from './DataGrouper';

function updateDetailDomain(newDetailDomain: [Date, Date]) {
  useChartData.setState({
    detailDomain: newDetailDomain,
  });
}

class Plot {
  containerDetail: d3PlotLib.CContainer;
  containerOverview: d3PlotLib.CContainer;
  constructor() {
    this.containerDetail = new d3PlotLib.CContainer();
    this.containerDetail.addPlot(new d3PlotLib.CLines());

    this.containerOverview = new d3PlotLib.CContainer();
    this.containerOverview.addPlot(new d3PlotLib.CLines());
    this.containerOverview.addPlot(new d3PlotLib.CBrush());
  }

  update(model: tChartData) {
    const { containerOverview, containerDetail } = this;
    const { overviewRef, detailRef, detailDomain, groupedData } = model;

    if (!groupedData) {
      return;
    }
    const { data } = groupedData;

    const dates = data.map((elem) => dayjs(elem.key).toDate());
    const dateExtent = d3.extent(dates);
    const validExtent = [dateExtent[0] ?? 0, dateExtent[1] ?? 0];

    const keys = Object.keys(data[0] ?? []) as (keyof tAveraged)[];
    const values = keys.map((key) => data.map((d) => d[key]));
    const filtered = [values[1], values[2]];

    containerOverview.attrs = {
      ...containerOverview.attrs,
      height: 200,
      html: overviewRef,
      xAxisText: {
        rotation: 45,
        onRender: (d) => dayjs(d as number).format('YY-MM'),
      },
      yAxisProperties:
        containerOverview.axisLayout.middleYAxisLabel('y values'),
      onGetXScale: (chartWidth: number) =>
        d3.scaleTime().domain(validExtent).rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3.scaleLinear().domain([0, 20]).rangeRound([chartHeight, 0]),
    } as d3PlotLib.tContainerAttrs;

    const overviewLines = containerOverview.getPlots()[0];
    overviewLines.attrs = {
      ...overviewLines.attrs,
      xs: dates,
      ys: filtered,
      colours: ['red', 'green'],
    } as d3PlotLib.tPlotAttrs;

    containerDetail.attrs = {
      ...containerDetail.attrs,
      html: detailRef,
      height: 400,
      xAxisText: {
        rotation: 45,
        onRender: (d) => dayjs(d as number).format('YY-MM-DD'),
      },
      yAxisProperties: containerDetail.axisLayout.middleYAxisLabel('y values'),
      onGetXScale: (chartWidth: number) =>
        d3.scaleTime().domain(detailDomain).rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3.scaleLinear().domain([0, 20]).rangeRound([chartHeight, 0]),
    } as d3PlotLib.tContainerAttrs;

    const detailLines = containerDetail.getPlots()[0];
    detailLines.attrs = {
      ...detailLines.attrs,
      xs: dates,
      ys: filtered,
      colours: ['red', 'green'],
    } as d3PlotLib.tPlotAttrs;

    const brush = containerOverview.getPlots()[1];
    brush.attrs = {
      ...brush.attrs,
      timeFrame: detailDomain,
      onMove: (dataRange: unknown) => {
        const newXScale = dataRange as d3.ScaleTime<Date, Date>;
        const newDomain = newXScale.domain() as [Date, Date];
        updateDetailDomain(newDomain);
      },
    } as d3PlotLib.tPlotAttrs;

    containerOverview.update();
    containerDetail.update();
  }
}

export { Plot };
