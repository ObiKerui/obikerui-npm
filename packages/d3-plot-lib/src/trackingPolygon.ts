/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
import * as d3 from 'd3';
import rfdc from 'rfdc';
import { v4 as uuidv4 } from 'uuid';
import { tContainerAttrs } from './attributes/container';
import polygonAttributes from './attributes/polygon';
import AttrsGenerator from './generators/attributeGenerator';
import plotSvgGenerator from './generators/plotSvgGenerator';

import { DataFormatter } from './dataFormatter';

const colorScheme = ['black', 'black', 'black', 'black'];

const trackingPolygonAttrs = {
  ...polygonAttributes,
  transform: null as null | [number, number],
  setRenderPoint: null as
    | ((
        currRenderPoint: d3.Selection<d3.BaseType, any, null, undefined>
      ) => void)
    | null,
  dimensions: null as [number, number] | null,
};

export default function () {
  const obj = rfdc()(trackingPolygonAttrs);
  const regex = /translate\((-?\d+\.\d+),(-?\d+\.\d+)\)/;

  function setDimensions(
    lines: d3.Selection<d3.BaseType, unknown, d3.BaseType, any>
  ) {
    const nod = lines.node() as SVGGraphicsElement | null;
    if (nod) {
      const bbox = nod.getBBox();
      obj.dimensions = [bbox.width, bbox.height];
    }
  }

  function getTranslationValue(translateStr: string | null) {
    if (!translateStr) {
      return null;
    }

    const matches = translateStr.match(regex);

    if (matches && matches.length > 1) {
      const x = parseFloat(matches[1]);
      const y = parseFloat(matches[2]);
      return [x, y] as [number, number];
    }
    return null;
  }

  function convertToDomain(
    translate: [number, number] | null,
    container: tContainerAttrs
  ) {
    const { xScale, yScale } = container;
    if (!translate || !xScale || !yScale) {
      return null;
    }

    const cXScale = xScale as d3.ScaleContinuousNumeric<number, number>;
    const xDom = cXScale.invert(translate[0]);

    const cYScale = yScale as d3.ScaleContinuousNumeric<number, number>;
    const yDom = cYScale.invert(translate[1]);

    return [xDom, yDom] as [number, number];
  }

  function buildContainerGroups(_container: tContainerAttrs) {
    if (!obj) {
      return;
    }
    const psvg = plotSvgGenerator() as any;
    psvg.plot(obj).container(_container)();
    // obj.colours = colorScheme;
  }

  function drawData(_container: tContainerAttrs) {
    const { coordinates, setRenderPoint, hidden } = obj;
    const { xScale, yScale, svg } = _container;
    const colours = obj.colours.length > 0 ? obj.colours : colorScheme;
    // const curveType = obj.curve ?? d3.curveLinear;
    const alpha = [1.0];

    // console.log('what are coords: ', coordinates);

    if (!svg) {
      return;
    }

    const chartGroup = svg.select(`.${obj.plotID}`);
    if (setRenderPoint) {
      setRenderPoint(chartGroup);
    }

    // get the offset of the transform
    const transform = chartGroup.attr('transform');

    const transformRange = getTranslationValue(transform);
    obj.transform = convertToDomain(transformRange, _container);

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

    // const images = chartGroup
    //   .append('image')
    //   // .attr('transform', 'rotate(90)')
    //   .attr('xlink:href', 'assets/solar-panel-256.png')
    //   .attr('x', 0)
    //   .attr('y', 0)
    //   .attr('width', 100)
    //   .attr('height', 100);

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
      .attr('pointer-events', obj.pointerEvents)
      .attr('fill', () => 'rgba(255, 255, 255, 0.5)')
      .attr('stroke-width', 1.5)
      .attr('clip-path', `url(#${obj.clipPathID})`)
      .attr('stroke', (_d: any, i: number) => colours[i] || 'black')
      .style('opacity', (_d: any, i: number) => {
        const colourAlpha = alpha[i] ?? 1;
        return hidden ? 0 : colourAlpha;
      })
      .on('mouseenter', (d: any, i: number, node: any) => {
        const lineEntered = d3.select(node[i]);
        lineEntered.style('cursor', 'pointer');
        if (obj.onEnter) {
          const mouseEnterFtn = obj.onEnter as (data: unknown) => void;
          mouseEnterFtn(d);
        }
      })
      .on('mouseleave', (d: any) => {
        if (obj.onLeave) {
          const mouseLeaveFtn = obj.onLeave as (data: unknown) => void;
          mouseLeaveFtn(d);
        }
      })
      .on('mousedown', (d: any) => {
        if (obj.onMouseDown) {
          const mouseDownFtn = obj.onMouseDown as (data: unknown) => void;
          mouseDownFtn(d);
        }
      })
      .on('mousemove', (d: any, i: number, node: any) => {
        d3.event.preventDefault();

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

    setDimensions(lines);

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

  toExport.setRenderPoint = attrsGen('setRenderPoint');
  toExport.transform = attrsGen('transform');
  toExport.dimensions = attrsGen('dimensions');

  toExport.coordinates = attrsGen('coordinates');
  //   toExport.labels = attrsGen('labels');
  toExport.colours = attrsGen('colours');
  toExport.tag = attrsGen('tag');
  toExport.lineStyles = attrsGen('lineStyles');
  toExport.hidden = attrsGen('hidden');
  toExport.pointerEvents = attrsGen('pointerEvents');
  toExport.onClick = attrsGen('onClick');
  toExport.onMouseDown = attrsGen('onMouseDown');
  toExport.onMove = attrsGen('onMove');
  toExport.onEnter = attrsGen('onEnter');
  toExport.onLeave = attrsGen('onLeave');
  toExport.onSetAttrs = attrsGen('onSetAttrs');
  return chart;
}
