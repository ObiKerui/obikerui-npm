/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
import * as d3 from 'd3';
import rfdc from 'rfdc';
import { v4 as uuidv4 } from 'uuid';
import { tContainerAttrs } from '../attributes/container';
import plotAttributes from '../attributes/plot';
import AttrsGenerator from '../generators/attributeGenerator';
import plotSvgGenerator from '../generators/plotSvgGenerator';

import { DataFormatter } from '../dataFormatter';

const colorScheme = ['red', 'green', 'blue', 'grey'];

export default function () {
  const obj = rfdc()(plotAttributes);

  function buildContainerGroups(_container: tContainerAttrs) {
    if (!obj) {
      return;
    }
    const psvg = plotSvgGenerator() as any;
    psvg.plot(obj).container(_container)();
    // obj.colours = colorScheme;
  }

  function oldDrawData(_container: tContainerAttrs) {
    const { values } = obj;
    const { xScale, yScale, svg } = _container;

    if (!svg || !xScale || !yScale) {
      return;
    }

    const colourScale = d3
      .scaleSequential()
      .domain([1, 20])
      .interpolator(d3.interpolatePuRd);

    const chartGroup = svg.select(`.${obj.plotID}`);

    // console.log('what is data for heatmap: ', ys.length)

    let cells = chartGroup.selectAll('g').data(values as any);

    const enterCells = cells.enter().append('g').append('rect');

    cells.exit().remove();

    cells = cells.merge(enterCells as any);

    const xScaleBW = xScale.bandwidth;
    const cellWidth = xScaleBW ? xScaleBW() : 0;
    const yScaleBW = yScale.bandwidth;
    const cellHeight = yScaleBW ? yScaleBW() : 0;

    cells
      .attr('class', 'cell')
      .attr('width', cellWidth)
      .attr('height', cellHeight)
      .attr(
        'y',
        (d: any) =>
          // console.log('what is y data for hm: ', d)
          yScale(d.y) || 0
      )
      .attr(
        'x',
        (d: any) =>
          // console.log('what is x data for hm: ', d)
          xScale(d.x) || 0
      )
      .attr('fill', (d: any) => colourScale(d.v) || 0);
  }

  function drawData(_container: tContainerAttrs) {
    const { xs, ys } = obj;
    const { xScale, yScale, svg, chartHeight, chartWidth } = _container;
    const colours = obj.colours.length > 0 ? obj.colours : colorScheme;
    const curveType = obj.curve ?? d3.curveLinear;
    const alpha = [1.0];

    // console.log('in line ftn what is xs/ys? ', xs, ys);

    if (!xScale || !yScale || !svg) {
      return;
    }

    const dataFormatter = DataFormatter().xs(xs).ys(ys);
    dataFormatter();
    const xsFormatted = dataFormatter.xsFormatted();
    const ysFormatted = dataFormatter.ysFormatted();

    const chartGroup = svg.select(`.${obj.plotID}`);

    // try adding a clip path to the svg
    obj.clipPathID = `obj.plotID-${uuidv4()}`;
    chartGroup
      .append('defs')
      .append('clipPath')
      .attr('id', `${obj.clipPathID}`)
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', chartWidth) // Adjust the width as needed
      .attr('height', chartHeight); // Adjust the height as needed

    // select all rect in svg.chart-group with the class bar
    let lines = chartGroup.selectAll('.lines').data(ysFormatted);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    lines.exit().style('opacity', 0).remove();

    // Enter - add the shapes to this data point
    const enterGroup = lines
      .enter()
      .append('path')
      .classed('lines', true)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5);

    // join the new data points with existing
    lines = lines.merge(enterGroup as any);

    function definedFtn(d: any) {
      return d >= -0.2;
    }

    function getXValue(_d: any, i: number, _dth: any, ith: number) {
      const ithIndex = ith < xsFormatted.length ? ith : 0;
      const ithX = xsFormatted[ithIndex];
      return ithX[i];
    }

    lines
      .attr('d', (dth: any, ith: number) => {
        const line = d3
          .line()
          .defined(definedFtn)
          .curve(curveType)
          .x((d: any, i: number) => xScale(getXValue(d, i, dth, ith)) || 0)
          .y((d: any) => yScale(d) || 0);

        return line(dth);
      })
      .attr('clip-path', `url(#${obj.clipPathID})`)
      .attr('stroke', (_d: any, i: number) => colours[i] || 'black')
      .style(
        'opacity',
        (_d: any, i: number) =>
          // console.log('alpha / d / i ', alpha, d, i)
          alpha[i] ?? 1
      );

    //   .style(lineEffect, '3, 3')
  }

  function toExport(_container: tContainerAttrs) {
    buildContainerGroups(_container);
    oldDrawData(_container);
  }

  const chart = toExport;

  const attrsGen = AttrsGenerator();
  attrsGen.attachTo(obj);
  attrsGen.setterReturnValue(toExport);

  toExport.xs = attrsGen('xs');
  toExport.ys = attrsGen('ys');
  toExport.values = attrsGen('values');
  toExport.labels = attrsGen('labels');
  toExport.colours = attrsGen('colours');
  toExport.tag = attrsGen('tag');
  toExport.lineStyles = attrsGen('lineStyles');

  return chart;
}
