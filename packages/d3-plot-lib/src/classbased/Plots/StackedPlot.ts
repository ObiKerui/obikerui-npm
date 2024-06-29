/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ScaleBand, ScaleLinear } from 'd3';
import { tContainerAttrs, tScaling } from '../sharedTypes';
import { PlotBase } from './PlotBase';

type tD3Scale = {
  domain: any;
};

class CStacked extends PlotBase {
  draw(container: tContainerAttrs, { xScale, yScale }: tScaling) {
    const { attrs } = this;
    const { xs, stackedDataset, colours } = attrs;
    const { svg } = container;

    if (!svg) {
      return;
    }

    const chartGroup = svg.select(`.${attrs.plotID}`);

    // calculate the bin objects and yscale domain
    // const d3xScale = xScale as unknown as tD3Scale;
    const d3xScale = xScale as unknown as ScaleBand<string>;

    // select all rect in svg.chart-group with the class bar
    let bars = chartGroup.selectAll('.bar').data(stackedDataset);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    bars.exit().style('opacity', 0).remove();

    // Enter - add the shapes to this data point
    const enterGroup = bars.enter().append('g').classed('bar', true);

    // join the new data points with existing
    bars = bars.merge(enterGroup as any);
    bars.style('fill', (_d, i) => colours[i]);

    let inner = bars.selectAll('rect').data((d: unknown[]) => d);
    const enterInner = inner.enter().append('rect').classed('category', true);

    inner.exit().style('opacity', 0).remove();

    inner = inner.merge(enterInner as any);

    inner
      .attr('x', (_d: any, i: number) => xScale(xs[i]))
      .attr('y', (d: any) => yScale(d[1]))
      .attr('height', (d: any) => {
        const height = yScale(d[0]) - yScale(d[1]);
        return height;
      })
      .attr('width', d3xScale.bandwidth());
  }
}

export { CStacked };
