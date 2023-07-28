/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
import rfdc from 'rfdc';
import { tContainerAttrs } from '../attributes/container';
import plotAttributes from '../attributes/plot';
import plotSvgGenerator from '../generators/plotSvgGenerator';
import AttrsGenerator from '../generators/attributeGenerator';

const colorScheme = ['red', 'green', 'blue', 'grey'];

export default function () {
  const obj = rfdc()(plotAttributes);

  function buildContainerGroups(_container: tContainerAttrs) {
    if (!obj) {
      return;
    }
    const psvg = plotSvgGenerator() as any;
    psvg.plot(obj).container(_container)();
    obj.colours = colorScheme;
  }

  function drawData(_container: tContainerAttrs) {
    // const { xs, ys } = obj;
    // const { xScale, yScale, svg } = _container;
    // const colours = obj.colours ?? ['red', 'green', 'blue', 'gray', 'black'];
    // const curveType = obj.curve ?? d3.curveLinear;
    // const alpha = [1.0];

    // if (!xScale || !yScale || !svg) {
    //   return;
    // }

    // const ysChecked = ys as d3.AxisDomain[];

    // const chartGroup = svg.select(`.${obj.plotID}`);

    // // select all rect in svg.chart-group with the class bar
    // let lines = chartGroup.selectAll('.lines').data(ysChecked);

    // // Exit - remove data points if current data.length < data.length last time this ftn was called
    // lines.exit().style('opacity', 0).remove();

    // // Enter - add the shapes to this data point
    // const enterGroup = lines
    //   .enter()
    //   .append('path')
    //   .classed('lines', true)
    //   .attr('fill', 'none')
    //   .attr('stroke', 'steelblue')
    //   .attr('stroke-width', 1.5);

    // // join the new data points with existing
    // lines = lines.merge(enterGroup as any);

    // const xFtn = (_d: any, i: number, _data: any) => {
    //   const result = xScale(xs[i]);
    //   if (!result) {
    //     return 0;
    //   }
    //   return result;
    // };

    // const yFtn = (d: any, _i: number, _data: any) => {
    //   const result = yScale(d);
    //   if (!result) {
    //     return 0;
    //   }
    //   return result;
    // };

    // lines
    //   .attr('d', d3.line().curve(curveType).x(xFtn).y(yFtn) as any)
    //   .attr('clip-path', `url(#${obj.clipPathID})`)
    //   .attr('stroke', (_d: any, i: number) => colours[i])
    //   .style(
    //     'opacity',
    //     (_d: any, i: number) =>
    //       // console.log('alpha / d / i ', alpha, d, i)
    //       alpha[i]
    //   );
    // //   .style(lineEffect, '3, 3')

    const { xs, alpha, lineStyles } = obj;
    // const strokeColour = obj.colour;
    const { xScale, yScale, svg } = _container;
    let lineEffect = '';

    // set the line style
    if (lineStyles && lineStyles[0] === '--') {
      lineEffect = 'stroke-dasharray';
    }

    if (!svg) {
      throw Error('svg is not defined in axLine!');
    }

    if (!xScale || !yScale) {
      throw Error('xScale or yScale is not defined in axLine!');
    }

    // get start / end y value
    const yStart = yScale.domain()[0];
    const yEnd = yScale.domain()[1];
    // const xPoints = xs;

    // console.log('show yStart / yEnd / xs / ys / xPoints / ypoints: ', yStart, yEnd, xs, ys, xPoints, yPoints)

    const chartGroup = svg.select(`.${obj.plotID}`);

    let lines = chartGroup.selectAll('.lines').data(xs);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    lines.exit().style('opacity', 0).remove();

    // Enter - add the shapes to this data point
    const enterGroup = lines
      .enter()
      .append('line')
      .classed('lines', true)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5);

    // join the new data points with existing
    lines = lines.merge(enterGroup as any);

    // now position and colour what exists on the dom
    lines
      .attr('x1', (d: any) => xScale(d) || 0)
      .attr('x2', (d: any) => xScale(d) || 0)
      .attr('y1', () => yScale(yStart) || 0)
      .attr('y2', () => yScale(yEnd) || 0)
      //   .attr('clip-path', `url(#${obj.clipPathId})`)
      //   .attr('stroke', strokeColour)
      .style('opacity', alpha)
      .style(lineEffect, '3, 3');
  }

  function toExport(_container: tContainerAttrs) {
    buildContainerGroups(_container);
    drawData(_container);
  }

  const chart = toExport;

  const attrsGen = AttrsGenerator();
  attrsGen.attachTo(obj);
  attrsGen.setterReturnValue(toExport);

  toExport.xs = attrsGen('xs');
  toExport.ys = attrsGen('ys');
  toExport.labels = attrsGen('labels');
  toExport.colours = attrsGen('colours');
  toExport.tag = attrsGen('tag');
  toExport.alpha = attrsGen('alpha');
  toExport.lineStyles = attrsGen('lineStyles');

  return chart;
}
