/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
import * as d3 from 'd3';
import rfdc from 'rfdc';
import { v4 as uuidv4 } from 'uuid';
import { tContainerAttrs } from '../attributes/container';
import textAttributes from '../attributes/text';
import AttrsGenerator from '../generators/attributeGenerator';
import plotSvgGenerator from '../generators/plotSvgGenerator';

import { DataFormatter } from '../dataFormatter';

// const colorScheme = ['red', 'green', 'blue', 'grey'];
const colorScheme = ['black', 'black', 'black', 'black'];

export default function () {
  const obj = rfdc()(textAttributes);

  function buildContainerGroups(_container: tContainerAttrs) {
    if (!obj) {
      return;
    }
    const psvg = plotSvgGenerator() as any;
    psvg.plot(obj).container(_container)();
    // obj.colours = colorScheme;
  }

  function drawData(_container: tContainerAttrs) {
    const { coordinates } = obj;
    const { xScale, yScale, svg } = _container;

    if (!svg) {
      return;
    }

    const chartGroup = svg.select(`.${obj.plotID}`);
    let labels = chartGroup.selectAll('.label').data(coordinates);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    labels.exit().style('opacity', 0).remove();

    const enterGroup = labels.enter().append('g').classed('label', true);
    enterGroup.append('text');

    labels = labels.merge(enterGroup as any);

    const textElement = labels
      .attr('transform', (d: any) => {
        let coords = [0, 0];
        if (obj.onGetCoordinates) {
          coords = obj.onGetCoordinates(d);
        }
        const xPos = (xScale && xScale(coords[0])) ?? 0;
        const yPos = (yScale && yScale(coords[1])) ?? 0;
        return `translate(${xPos},${yPos})`;
      })
      .select('text');

    textElement
      .attr('text-anchor', 'middle')
      .style('alignment-baseline', 'middle')
      .style('font-size', '.8em')
      .text((d: any) => {
        if (obj.onGetText) {
          return obj.onGetText(d);
        }
        return '';
      });

    if (obj.onSetAttrs) {
      const setAttrsFtn = obj.onSetAttrs as (
        selection: d3.Selection<d3.BaseType, unknown, d3.BaseType, any>
      ) => void;

      setAttrsFtn(labels);
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
  toExport.anchor = attrsGen('anchor');
  toExport.colours = attrsGen('colours');
  toExport.tag = attrsGen('tag');
  toExport.lineStyles = attrsGen('lineStyles');
  toExport.onClick = attrsGen('onClick');
  toExport.onMouseDown = attrsGen('onMouseDown');
  toExport.onEnter = attrsGen('onEnter');
  toExport.onLeave = attrsGen('onLeave');
  toExport.onGetCoordinates = attrsGen('onGetCoordinates');
  toExport.onGetText = attrsGen('onGetText');
  toExport.onSetAttrs = attrsGen('onSetAttrs');
  return chart;
}
