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

  function drawData(_container: tContainerAttrs) {
    const { xs, ys, data, onClick, onEnter, onLeave, onMouseDown, onMouseUp, onMove } = obj;
    const { xScale, yScale, svg, chartHeight, chartWidth } = _container;
    const colours = obj.colours.length > 0 ? obj.colours : colorScheme;
    const curveType = obj.curve ?? d3.curveLinear;
    const alpha = [1.0];

    // console.log('in interactor what is the data passed? ', data);

    // console.log('in line ftn what is xs/ys? ', xs, ys);

    if (!xScale || !yScale || !svg) {
      return;
    }

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
    let lines = chartGroup.selectAll('.lines').data(data);

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

    // function definedFtn(d: any) {
    //   return d >= -0.2;
    // }

    lines
      .attr('d', (dth: any, _ith: number) => {
        // console.log('what is the data here in interactor: ', dth);
        const { xCoords, yCoords } = dth;

        const line = d3
          .line()
          //   .defined(definedFtn)
          .curve(curveType)
          .x((_d: any, i: number) => xScale(xCoords[i]) || 0)
          .y((d: any) => yScale(d) || 0);

        return line(yCoords);
      })
      .attr('clip-path', `url(#${obj.clipPathID})`)
      .attr('stroke', (_d: any, i: number) => colours[i] || 'black')
      .attr('fill', 'red')
      .style(
        'opacity',
        (_d: any, _i: number) =>
          // console.log('alpha / d / i ', alpha, d, i)
          //   alpha[i]
          0.5
      )
      .on('click', (_d: any, i: number, node: any) => {
        if (onClick) {
          onClick(_d, i, node);
        }
      })
      .on('mousemove', (_d: any, i: number, node: any) => {
        if (onMove) {
          onMove(_d, i, node);
        }
      })
      .on('mouseleave', (_d: any, i: number, node: any) => {
        if (onLeave) {
          onLeave(_d, i, node);
        }
      })
      .on('mouseenter', (_d: any, i: number, node: any) => {
        if (onEnter) {
          onEnter(_d, i, node);
        }
      })
      .on('mousedown', (_d: any, i: number, node: any) => {
        if (onMouseDown) {
          onMouseDown(_d, i, node);
        }
      })
      .on('mouseup', (_d: any, i: number, node: any) => {
        if (onMouseUp) {
          onMouseUp(_d, i, node);
        }
      });

    //   .style(lineEffect, '3, 3')
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
  toExport.lineStyles = attrsGen('lineStyles');
  toExport.data = attrsGen('data');
  toExport.onMouseDown = attrsGen('onMouseDown');
  toExport.onMouseUp = attrsGen('onMouseUp');
  toExport.onClick = attrsGen('onClick');
  toExport.onEnter = attrsGen('onEnter');
  toExport.onLeave = attrsGen('onLeave');
  toExport.onMove = attrsGen('onMove');

  return chart;
}
