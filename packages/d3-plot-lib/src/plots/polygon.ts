/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
import * as d3 from 'd3';
import rfdc from 'rfdc';
import { v4 as uuidv4 } from 'uuid';
import { tContainerAttrs } from '../attributes/container';
import polygonAttributes from '../attributes/polygon';
import AttrsGenerator from '../generators/attributeGenerator';
import plotSvgGenerator from '../generators/plotSvgGenerator';

import { DataFormatter } from '../dataFormatter';

const colorScheme = ['black', 'black', 'black', 'black'];

export default function () {
  const obj = rfdc()(polygonAttributes);

  function buildContainerGroups(_container: tContainerAttrs) {
    if (!obj) {
      return;
    }
    const psvg = plotSvgGenerator() as any;
    psvg.plot(obj).container(_container)();
    // obj.colours = colorScheme;
  }

  function drawData(_container: tContainerAttrs) {
    const { coordinates, hidden } = obj;
    const { xScale, yScale, svg } = _container;
    const colours = obj.colours.length > 0 ? obj.colours : colorScheme;
    // const curveType = obj.curve ?? d3.curveLinear;
    const alpha = [1.0];

    if (!svg) {
      return;
    }

    const chartGroup = svg.select(`.${obj.plotID}`);

    // try adding a clip path to the svg
    // obj.clipPathID = `obj.plotID-${uuidv4()}`;
    // chartGroup
    //   .append('defs')
    //   .append('clipPath')
    //   .attr('id', `${obj.clipPathID}`)
    //   .append('rect')
    //   .attr('x', 0)
    //   .attr('y', 0)
    //   .attr('width', chartWidth) // Adjust the width as needed
    //   .attr('height', chartHeight); // Adjust the height as needed

    // select all rect in svg.chart-group with the class bar
    let lines = chartGroup.selectAll('.lines').data(coordinates);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    lines.exit().style('opacity', 0).remove();

    // Enter - add the shapes to this data point
    const enterGroup = lines.enter().append('path').classed('lines', true);

    // join the new data points with existing
    lines = lines.merge(enterGroup as any);

    // generates the polygon
    const lineGenerator = d3
      .line()
      // .defined()
      // .curve()
      .x((d: any) => (xScale && xScale(d[0])) ?? 0)
      .y((d: any) => (yScale && yScale(d[1])) ?? 0);

    lines
      .attr('d', (dth: any) => {
        const polygon = lineGenerator(dth.coordinates);
        return polygon;
      })
      .attr('fill', () => 'rgba(255, 255, 255, 0.5)')
      .attr('stroke-width', 1.5)
      .attr('clip-path', `url(#${obj.clipPathID})`)
      .attr('stroke', (_d: any, i: number) => colours[i] || 'black')
      .style('opacity', (_d: any, i: number) => {
        const colourAlpha = alpha[i] ?? 1;
        return hidden ? 0 : colourAlpha;
      })
      .on('mouseenter', (d: any, i: number, node: any) => {
        d3.event.preventDefault();
        const lineEntered = d3.select(node[i]);
        lineEntered.style('cursor', 'pointer');
        if (obj.onEnter) {
          const mouseEnterFtn = obj.onEnter as (data: unknown) => void;
          mouseEnterFtn(d);
        }
      })
      .on('mouseleave', (d: any) => {
        d3.event.preventDefault();
        if (obj.onLeave) {
          const mouseLeaveFtn = obj.onLeave as (data: unknown) => void;
          mouseLeaveFtn(d);
        }
      })
      .on('mousedown', (d: any) => {
        d3.event.preventDefault();
        if (obj.onMouseDown) {
          const mouseDownFtn = obj.onMouseDown as (data: unknown) => void;
          mouseDownFtn(d);
        }
      })
      .on('mouseup', () => {
        d3.event.preventDefault();
        // console.log('mouse up');
        // isMouseDown = false;
      })
      .on('mousemove', (d: any, i: number, node: any) => {
        d3.event.preventDefault();

        // console.log('source event ? ', d3.event, node[i].sourceEvent);

        if (obj.onMove) {
          const mousePosition = d3.mouse(node[i]);
          let chartPosition = null;
          if (xScale && yScale) {
            const xScaleC = xScale as d3.ScaleContinuousNumeric<number, number>;
            const yScaleC = yScale as d3.ScaleContinuousNumeric<number, number>;
            chartPosition = [
              xScaleC.invert(mousePosition[0]),
              yScaleC.invert(mousePosition[1]),
            ] as [number, number];
          }
          const mouseMoveFtn = obj.onMove as (
            data: unknown,
            mousePosition: [number, number] | null,
            chartPosition: [number, number] | null
          ) => void;
          mouseMoveFtn(d, mousePosition, chartPosition);
        }
      });

    if (obj.onSetAttrs) {
      const setAttrsFtn = obj.onSetAttrs as (
        selection: d3.Selection<d3.BaseType, unknown, d3.BaseType, any>
      ) => void;

      setAttrsFtn(lines);
    }
  }

  function toExport(_container: tContainerAttrs) {
    buildContainerGroups(_container);
    drawData(_container);
  }

  const chart = toExport;

  const attrsGen = AttrsGenerator();
  attrsGen.attachTo(obj);
  attrsGen.setterReturnValue(toExport);

  toExport.coordinates = attrsGen('coordinates');
  toExport.labels = attrsGen('labels');
  toExport.colours = attrsGen('colours');
  toExport.tag = attrsGen('tag');
  toExport.lineStyles = attrsGen('lineStyles');
  toExport.hidden = attrsGen('hidden');
  toExport.onClick = attrsGen('onClick');
  toExport.onMouseDown = attrsGen('onMouseDown');
  toExport.onEnter = attrsGen('onEnter');
  toExport.onLeave = attrsGen('onLeave');
  toExport.onSetAttrs = attrsGen('onSetAttrs');
  toExport.onMove = attrsGen('onMove');

  return chart;
}
