/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLayoutEffect, useRef, useState } from 'react';
import * as d3PlotLib from '@obikerui/d3-plot-lib';
import * as d3 from 'd3';
import * as np from '../NumpyClone/numpy';

function createChart() {
  const logmassA = np.randomNormal(0, 1, 10000);
  const logmassB = np.randomNormal(8, 2, 10000);

  const ms = np.linspace(-5, 20, 100);
  const mean = np.mean(logmassA) ?? 0;
  const std = np.std(logmassA) ?? 0;
  const pdfNorm = np.pdf(ms, mean, std);

  // let plot = d3PlotLib.Plot().xs(ms).ys(pdf_norm).curve(d3.curveCardinal)

  const fill = new d3PlotLib.CFillArea();
  fill.attrs = {
    ...fill.attrs,
    xs: ms,
    ys: pdfNorm,
    alpha: 0.2,
    where: (x: any) => x > 0.9 && x < 2,
    colours: ['blue'],
    labels: ['filled in'],
  } as d3PlotLib.tPlotAttrs;

  const histA = new d3PlotLib.CHistogram();
  histA.attrs = {
    ...histA.attrs,
    xs: ms,
    ys: logmassA,
    bins: 100,
    density: true,
    alpha: 0.4,
  } as d3PlotLib.tPlotAttrs;

  const histB = new d3PlotLib.CHistogram();
  histB.attrs = {
    ...histB.attrs,
    xs: ms,
    ys: logmassB,
    bins: 100,
    density: true,
    alpha: 0.6,
  } as d3PlotLib.tPlotAttrs;

  const plotC = new d3PlotLib.CLines();
  plotC.attrs = {
    ...plotC.attrs,
    xs: ms,
    ys: pdfNorm,
  } as d3PlotLib.tPlotAttrs;

  const container = new d3PlotLib.CContainer();
  container.addPlot(histA);
  container.addPlot(histB);
  container.addPlot(plotC);
  container.addPlot(fill);

  container.attrs = {
    ...container.attrs,
    onGetXScale(chartWidth) {
      const xScale = d3
        .scaleLinear()
        .domain(d3.extent(ms) as [number, number])
        .nice()
        .rangeRound([0, chartWidth]);
      return xScale;
    },
    onGetYScale(chartHeight) {
      const yScale = d3
        .scaleLinear()
        .domain(d3.extent(pdfNorm) as [number, number])
        .nice()
        .rangeRound([chartHeight, 0]);
      return yScale;
    },
  };
  container.update();

  return container;
}

function Histogram() {
  const ref = useRef<HTMLDivElement | null>(null);
  const chart = useRef<d3PlotLib.CContainer>(createChart());
  const [chartAttrs, setChartAttrs] =
    useState<d3PlotLib.tContainerAttrs | null>(null);

  useLayoutEffect(() => {
    if (ref.current === null) {
      return;
    }
    const updatedAttrs = {
      ...chart.current.attrs,
      html: ref.current,
    };
    chart.current.attrs = updatedAttrs;
    chart.current.update();
    setChartAttrs(updatedAttrs);
  }, []);

  return (
    <div>
      <span>histogram</span>
      <div ref={ref} />
    </div>
  );
}

export { Histogram };
