/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
// import * as d3 from 'd3';
import rfdc from 'rfdc';
import { tContainerAttrs } from '../attributes/container';
import plotAttributes from '../attributes/plot';
import plotSvgGenerator from '../generators/plotSvgGenerator';
import AttrsGenerator from '../generators/attributeGenerator';

const colorScheme = ['red', 'green', 'blue', 'grey'];
// type tPairType = { elem: unknown; i: number };

export default function () {
  const obj = rfdc()(plotAttributes);
  let container: tContainerAttrs | null = null;

  function buildContainerGroups() {
    if (!obj || !container) {
      return;
    }
    const psvg = plotSvgGenerator() as any;
    psvg.plot(obj).container(container)();
    obj.colours = colorScheme;
  }

  function drawData() {
    if (!container) {
      return;
    }

    const { xs, ys } = obj;
    const { xScale, yScale, svg } = container;
    const colours = obj.colours ?? ['red', 'green', 'blue', 'gray', 'black'];

    if (!xScale || !yScale || !svg) {
      return;
    }

    const chartGroup = svg.select(`.${obj.plotID}`);

    let plots = chartGroup.selectAll('circle').data(ys as any);

    const plotsEnter = plots.enter().append('circle');

    plots.exit().remove();

    plots = plots.merge(plotsEnter as any);

    // let plotsInner = plots.selectAll('circle').data((d: unknown, i: number) => {
    //   const pairs = d as tPairType[];
    //   const pairedData = pairs.map((elem) => ({ elem, i }));
    //   return pairedData;
    // });

    // const plotsInnerEnter = plotsInner
    //   .enter()
    //   .append('circle')
    //   .filter((d: unknown) => {
    //     const pair = d as tPairType;
    //     return Number.isNaN(pair.elem) === false;
    //   });

    // plotsInner.exit().remove();

    // plotsInner = plotsInner.merge(plotsInnerEnter as any);

    const xScaleBW = xScale.bandwidth;
    const cellWidth = xScaleBW ? xScaleBW() : 0;
    const yScaleBW = yScale.bandwidth;
    const cellHeight = yScaleBW ? yScaleBW() : 0;

    plots
      .attr('cx', (_d: unknown, ith: number): number => {
        const result = (xScale(xs[ith] as any) ?? 0) + cellWidth / 2.0;
        // console.log('x position: ', d, xScale(d as any));
        return result || 0;
      })
      .attr('cy', (d: unknown): number => {
        const result = (yScale(d as any) ?? 0) - cellHeight / 2.0;
        // console.log('y position: ', ys[ith], xScale(ys[ith] as any));
        return result || 0;
      })
      .attr('r', 5.5)
      .style('fill', () => 'black');
  }

  function toExport(_container: tContainerAttrs) {
    container = _container;
    buildContainerGroups();
    drawData();
  }

  const chart = toExport;

  const attrsGen = AttrsGenerator();
  attrsGen.attachTo(obj);
  attrsGen.setterReturnValue(toExport);

  toExport.xs = attrsGen('xs');
  toExport.ys = attrsGen('ys');
  toExport.labels = attrsGen('labels');
  toExport.colours = attrsGen('colours');

  return chart;
}
