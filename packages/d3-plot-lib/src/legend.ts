/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-explicit-any */
import rfdc from 'rfdc';
import AttrsGenerator from './generators/attributeGenerator';

import { tContainerAttrs } from './container';

const legendAttributes = {
  legendData: null as any,
  legendID: null as string | null,
  position: 'topleft',
  index: 0,
  data: null as any,
};

function Legend() {
  const obj = rfdc()(legendAttributes);

  function buildContainerGroups(container: tContainerAttrs) {
    const { svg } = container;
    if (!svg) {
      return;
    }

    const metadataGroup = svg.select('g.metadata-group');
    const children = metadataGroup.selectAll('*');
    const existingElements = children.filter(`g.${obj.legendID}`);

    if (existingElements.size() > 0) {
      return;
    }

    obj.index = children.size();
    obj.legendID = `legend-${obj.index}`;

    const legendId = metadataGroup.append('g').classed(`${obj.legendID}`, true);
    const legendIdAp = legendId.append('g').classed('anchorpoint', true);
    legendIdAp.append('rect').classed('background', true);
    legendIdAp.append('g').classed('innermargin', true);
  }

  function buildLegendData(plottables: any) {
    const allEntries = plottables.map((_plot: any) => {
      const labels = _plot.labels() ? _plot.labels() : ['none'];
      const colours = _plot.colours() ? _plot.colours() : ['white'];

      const entries = labels.map((element: any, ith: number) => ({
        label: element,
        colour: colours[ith],
      }));
      return entries;
    });

    obj.legendData = [].concat([], ...allEntries);
  }

  function repositionAnchorPoint(
    position: string,
    chartWidth: number,
    chartHeight: number
  ): [number, number] {
    let xPos = 0;
    let yPos = 0;

    switch (position) {
      case 'topleft':
        xPos = 0;
        yPos = 0;
        break;
      case 'topright':
        xPos = chartWidth * 0.6;
        yPos = 0;
        break;
      case 'middleleft':
        xPos = 0;
        yPos = chartHeight * 0.5;
        break;
      case 'middleright':
        xPos = chartWidth * 0.6;
        yPos = chartHeight * 0.5;
        break;
      case 'bottomleft':
        xPos = 0;
        yPos = chartHeight * 0.6;
        break;
      case 'bottomright':
        xPos = chartWidth * 0.6;
        yPos = chartHeight * 0.6;
        break;
      default:
        break;
    }
    return [xPos, yPos];
  }

  function drawData(container: tContainerAttrs) {
    const { svg } = container;
    if (!svg) {
      return;
    }

    const metadataGroup = svg.select(`.${obj.legendID}`);
    const anchorPoint = metadataGroup.select('g.anchorpoint');
    const rectBackground = anchorPoint.select('rect.background');
    const innerMargin = anchorPoint.select('g.innermargin');
    const keys = obj.legendData;
    const size = 10;
    const position = obj.position ?? 'topleft';
    const { chartWidth, chartHeight } = container;
    const margin = 5;

    let [xOffset, yOffset] = repositionAnchorPoint(position, chartWidth, chartHeight);
    xOffset += chartWidth * 0.05;
    yOffset += chartHeight * 0.05;

    // position the anchor point
    anchorPoint.attr('transform', `translate(${xOffset},${yOffset})`);
    innerMargin.attr('transform', `translate(${margin},${margin})`);

    rectBackground
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 100)
      .attr('height', 100)
      .style('fill', 'white')
      .style('stroke', 'lightgrey')
      .style('opacity', 0.95);

    //-----------------------------------------------------
    // select all rect in svg.chart-group with the class bar
    let legendSymbols = innerMargin.selectAll('rect').data(keys);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    legendSymbols.exit().style('opacity', 0).remove();

    // Enter - add the shapes to this data point
    const enterGroupSymbols = legendSymbols.enter().append('rect');

    // join the new data points with existing
    legendSymbols = legendSymbols.merge(enterGroupSymbols as any);

    legendSymbols
      .attr('x', 0)
      .attr('y', (_d: any, i: number) => i * (size + 5)) // 100 is where the first dot appears. 25 is the distance between dots
      .attr('width', size)
      .attr('height', size)
      .style('fill', (d: any) => d.colour);

    let legendLabels = innerMargin.selectAll('text').data(keys);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    legendLabels.exit().style('opacity', 0).remove();

    // Enter - add the shapes to this data point
    const enterGroupLabels = legendLabels.enter().append('text');

    // join the new data points with existing
    legendLabels = legendLabels.merge(enterGroupLabels as any);

    legendLabels
      .attr('x', size * 1.2)
      .attr('y', (_d: any, i: number) => i * (size + 5) + size / 2) // 100 is where the first dot appears. 25 is the distance between dots
      .style('fill', (d: any) => d.colour)
      .text((d: any) => d.label)
      .attr('text-anchor', 'left')
      .style('alignment-baseline', 'middle')
      .style('font-size', '.8em');
  }

  function toExport(container: any, plottables: any) {
    buildContainerGroups(container);
    buildLegendData(plottables);
    drawData(container);
  }

  const generateAccessor = AttrsGenerator();
  generateAccessor.attachTo(obj);
  generateAccessor.setterReturnValue(toExport);

  toExport.legendID = generateAccessor('legendID');
  toExport.index = generateAccessor('index');
  toExport.data = generateAccessor('data');
  toExport.position = generateAccessor('position');

  return toExport;
}

export default Legend;
