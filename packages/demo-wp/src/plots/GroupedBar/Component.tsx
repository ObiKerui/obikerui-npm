/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLayoutEffect, useRef, useState } from 'react';
import * as d3PlotLib from '@obikerui/d3-plot-lib';
import * as d3 from 'd3';

function createChart() {
  const container = new d3PlotLib.CContainer();
  container.addPlot(new d3PlotLib.CGroupedBar());
  container.addMetadata(new d3PlotLib.CLegend());

  container.attrs = {
    ...container.attrs,
    xAxisLabel: 'category',
    yAxisLabel: 'quantity',
    onGetXScale(chartWidth) {
      const xScale = d3.scaleBand().domain([]).rangeRound([0, chartWidth]);
      return xScale;
    },
    onGetYScale(chartHeight) {
      const yScale = d3
        .scaleLinear()
        .domain([0, 1])
        .nice()
        .rangeRound([chartHeight, 0]);
      return yScale;
    },
  };
  container.update();

  return container;
}

function updateChart(
  chart: d3PlotLib.CContainer,
  html: HTMLDivElement,
  data: d3.DSVRowArray<string>
) {
  console.log('this was retrieved via d3.csv: ', data);

  const colours = ['blue', 'green', 'red'];
  const groupsHera = d3.map(data, (d: any) => d.group);

  const mainGroups = groupsHera.keys();

  let subgroups = data.columns;
  subgroups = subgroups.slice(1, subgroups.length);
  const plot = chart.getPlots()[0];
  plot.attrs = {
    ...plot.attrs,
    values: data,
    ys: data,
    labels: mainGroups,
    colours,
    subgroups,
  } as d3PlotLib.tPlotAttrs;

  const legend = chart.getMetadata()[0];
  legend.attrs = {
    ...legend.attrs,
    labels: subgroups,
    colours,
  } as d3PlotLib.tMetadataAttrs;

  const updatedAttrs = {
    ...chart.attrs,
    html,
    onGetXScale(chartWidth) {
      return d3
        .scaleBand()
        .domain(mainGroups)
        .padding(0.2)
        .rangeRound([0, chartWidth]);
    },
    onGetYScale(chartHeight) {
      return d3.scaleLinear().domain([0, 40]).rangeRound([chartHeight, 0]);
    },
  } as d3PlotLib.tContainerAttrs;
  // eslint-disable-next-line no-param-reassign
  chart.attrs = updatedAttrs;
  chart.update();

  return chart;
}

async function loadData() {
  const data = d3.csv('assets/data_stacked.csv');
  // const data = d3.csv<'group' | 'Nitrogen' | 'normal' | 'stressed'>(
  //   'assets/data_stacked.csv'
  // );
  return data;
}

function GroupedBar() {
  const ref = useRef<HTMLDivElement | null>(null);
  const chart = useRef<d3PlotLib.CContainer>(createChart());
  const [chartAttrs, setChartAttrs] =
    useState<d3PlotLib.tContainerAttrs | null>(null);

  useLayoutEffect(() => {
    if (ref.current === null) {
      return;
    }

    loadData()
      .then((data) => {
        if (!ref.current) {
          return;
        }
        const updated = updateChart(chart.current, ref.current, data);
        setChartAttrs(updated.attrs);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <span>Grouped Bar</span>
      <div ref={ref} />
    </div>
  );
}

export { GroupedBar };
