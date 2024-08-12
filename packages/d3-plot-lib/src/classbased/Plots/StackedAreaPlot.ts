/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ScaleBand } from 'd3';
import * as d3 from 'd3';
import { tContainerAttrs, tScaling } from '../sharedTypes';
import { PlotBase } from './PlotBase';

type tD3Scale = {
  domain: any;
};

class CStackedArea extends PlotBase {
  draw(container: tContainerAttrs, { xScale, yScale }: tScaling) {
    const { attrs } = this;
    const {
      xs,
      stackedDataset,
      colours,
      opacity,
      onGetLabel,
      onGetY0,
      onGetY1,
    } = attrs;
    const { svg } = container;

    if (!svg) {
      return;
    }

    const chartGroup = svg.select(`.${attrs.plotID}`);

    // calculate the bin objects and yscale domain
    // const d3xScale = xScale as unknown as tD3Scale;
    const d3xScale = xScale as unknown as ScaleBand<string>;

    // console.log(
    //   'what is the stacked data set in stacked area? ',
    //   stackedDataset
    // );

    // begin stacked area
    const area = d3
      .area()
      .x((d: unknown, i: number) => {
        // console.log('x pos => d value / i value: ', d, i);
        const xValue = onGetLabel
          ? onGetLabel(d, i)
          : (d as { data: { key: number } }).data.key;
        const scaled = xScale(xValue);
        // console.log('what is scalled x value zen? ', xValue, scaled);
        return scaled;
      })
      .y0((d: unknown[]) =>
        // console.log('y0 pos => d value / i value: ', d, ith);
        // const y0 = onGetY0 ? onGetY0(d, ith) : 0;
        yScale(d[0])
      )
      .y1((d: unknown[]) =>
        // console.log('y1 pos => d value / i value: ', d, ith);
        // const y1 = onGetY1 ? onGetY1(d, ith) : 0;
        yScale(d[1])
      );

    // select all rect in svg.chart-group with the class bar
    let pathGroups = chartGroup
      .selectAll<SVGGElement, number>('.path-group')
      .data(stackedDataset);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    pathGroups.exit().style('opacity', 0).remove();

    // Enter - add the shapes to this data point
    const enterGroup = pathGroups
      .enter()
      .append('g')
      .classed('path-group', true);

    enterGroup.append('path').classed('path', true);

    pathGroups = pathGroups.merge(enterGroup);

    pathGroups.select('path').attr('d', (d) => area(d as any));

    pathGroups
      .select('path')
      .style('fill', (_d, i) => colours[i])
      .style('fill-opacity', (_d, i) => opacity[i]);
  }
}

export { CStackedArea };
