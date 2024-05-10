/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import { tContainerAttrs, tScaling } from '../sharedTypes';
import { PlotBase } from './PlotBase';

const colorScheme = ['red', 'green', 'blue', 'grey'];

type tD3BarScale = {
  domain: any;
  bandwidth: any;
};

// type tGroupedBarElem = {
//   outerGroup: () => string;
//   key: () => string;
//   value: () => string;
// };

// type tGroupedBarElems = tGroupedBarElem[];

class CGroupedBar extends PlotBase {
  draw(container: tContainerAttrs, { xScale, yScale }: tScaling) {
    const { attrs } = this;
    const { ys, subgroups } = attrs;
    const { svg, chartHeight } = container;
    const colours = attrs.colours.length > 0 ? attrs.colours : colorScheme;
    // const curveType = attrs.curve ?? d3.curveLinear;
    // const alpha = [1.0];

    if (!svg) {
      return;
    }

    // const data = ys as unknown as tGroupedBarElems;

    const xd3BarScale = xScale as unknown as tD3BarScale;

    const chartGroup = svg.select(`.${attrs.plotID}`);

    const xScaleSubgroup = d3
      .scaleBand<string>()
      .domain(subgroups)
      .range([0, xd3BarScale.bandwidth()])
      .padding(0.05);

    // color palette = one color per subgroup
    const colourScale = d3
      .scaleOrdinal<string, string>()
      .domain(subgroups)
      .range(colours);

    // Show the bars
    let outerBars = chartGroup.selectAll('g').data(ys as any);

    const enterOuterBars = outerBars.enter().append('g');

    outerBars.exit().remove();

    outerBars = outerBars.merge(enterOuterBars as any);

    outerBars.attr('transform', (d: any) => `translate(${xScale(d.group)},0)`);

    let innerBars = outerBars.selectAll('rect').data((d: any) => {
      const toRet = subgroups.map((key) => ({
        key,
        value: d[key],
      }));
      return toRet;
    });

    const innerBarsEnter = innerBars.enter().append('rect');

    innerBars = innerBars.merge(innerBarsEnter as any);

    innerBars
      .attr('x', (d: any) => xScaleSubgroup(d.key) ?? 0)
      .attr('y', (d: any) => yScale(d.value))
      .attr('width', xScaleSubgroup.bandwidth())
      .attr('height', (d: any) => chartHeight - yScale(d.value))
      .attr('fill', (d: any) => colourScale(d.key));
  }
}

export { CGroupedBar };
