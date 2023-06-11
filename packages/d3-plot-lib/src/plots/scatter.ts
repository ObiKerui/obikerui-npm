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
type tPairType = { elem: unknown; i: number };

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

    let plots = chartGroup.selectAll('g').data(ys as any);

    const plotsEnter = plots.enter().append('g');

    plots.exit().remove();

    plots = plots.merge(plotsEnter as any);

    let plotsInner = plots.selectAll('circle').data((d: unknown, i: number) => {
      const pairs = d as tPairType[];
      const pairedData = pairs.map((elem) => ({ elem, i }));
      return pairedData;
    });

    const plotsInnerEnter = plotsInner
      .enter()
      .append('circle')
      .filter((d: unknown) => {
        const pair = d as tPairType;
        return Number.isNaN(pair.elem) === false;
      });

    plotsInner.exit().remove();

    plotsInner = plotsInner.merge(plotsInnerEnter as any);

    plotsInner
      .attr('cx', (_d: unknown, idx: number): number => {
        const result = xScale(xs[idx] as any);
        return result || 0;
      })
      .attr('cy', (d: unknown): number => {
        const dPair = d as tPairType;
        const result = yScale(dPair.elem as any);
        return result || 0;
      })
      .attr('r', 1.5)
      .style('fill', (d: unknown) => {
        const elem = d as tPairType;
        return colours[elem.i];
      });
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
