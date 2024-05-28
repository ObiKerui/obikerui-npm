/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { tContainerAttrs } from '../sharedTypes';
import { MetadataBase } from './Base';

const colorScheme = ['red', 'green', 'blue', 'grey'];

type tD3BarScale = {
  domain: any;
  bandwidth: any;
};

class CLegend extends MetadataBase {
  repositionAnchorPoint(
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

  draw(container: tContainerAttrs) {
    const { attrs } = this;

    // const { ys, subgroups } = attrs;
    const { svg } = container;
    const colours = attrs.colours.length > 0 ? attrs.colours : colorScheme;
    // const curveType = attrs.curve ?? d3.curveLinear;
    // const alpha = [1.0];

    if (!svg) {
      return;
    }

    const metadataGroup = svg.select(`.${attrs.metadataID}`);

    const anchorPoint = metadataGroup.select('g.anchor');
    const rectBackground = anchorPoint.select('rect.background');
    const innerMargin = anchorPoint.select('g.innermargin');
    const keys = attrs.labels;
    const size = 10;
    const position = attrs.position ?? 'topleft';
    const { chartWidth, chartHeight } = container;
    const margin = 5;

    let [xOffset, yOffset] = this.repositionAnchorPoint(
      position,
      chartWidth,
      chartHeight
    );
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
      .style('fill', (_d: any, ith: number) => colours[ith]);

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
      .style('fill', (_d: any) => 'black')
      .text((d: any) => d)
      .attr('text-anchor', 'left')
      .style('alignment-baseline', 'middle')
      .style('font-size', '.8em');
  }
}

export { CLegend };
