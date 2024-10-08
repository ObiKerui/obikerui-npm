/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import { tContainerAttrs, tGenericBandScale, tScaling } from '../sharedTypes';
import { PlotBase } from './PlotBase';

const colorScheme = ['red', 'green', 'blue', 'grey'];

// WHAT SPECIFIC DATA DOES IT NEED?
// data -> the array of data - each element of the array is an object
// callback with each object? to get the cateogy of that object?
// subcategories -> for each category how it is divided up
//  - create a scaleband for the subcategories
//  - scaleband domain -> subcategories
//  - scaleband range -> xScale.bandwidth()

// outer-bars pass in the object data
// for each object in object data array
// transform x based on xScale(d.category)
// then do inner-bars
// rect x - xScaleSubCategory(d.key)
// rect y - ySCale(d.value)
// width - xScaleSubCategory.bandwidth
// height - chartheight - yScale(d.value)

// would need something like
// attrs = {
// objects: { key: value }[] some mapped type?
// xScale -> must have a bandwidth
// subcategories: unknown[] (get subcategory callback?)
// }

class CGroupedBar extends PlotBase {
  draw(container: tContainerAttrs, { xScale, yScale }: tScaling) {
    const { attrs } = this;
    const { ys, subgroups } = attrs;
    const { svg, chartHeight } = container;
    const colours = attrs.colours.length > 0 ? attrs.colours : colorScheme;

    if (!svg) {
      return;
    }

    const xd3BarScale = xScale as tGenericBandScale;

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
