/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3Array from 'd3-array';
import { tContainerAttrs, tGenericD3Scale, tScaling } from '../sharedTypes';
import { PlotBase } from './PlotBase';

type tD3Scale = {
  domain: any;
};

class CHistogram extends PlotBase {
  draw(container: tContainerAttrs, { xScale, yScale }: tScaling) {
    const { attrs } = this;
    const { xs, ys, alpha, bins, normlise, useDensity } = attrs;
    const { svg, chartHeight } = container;

    if (!svg) {
      return;
    }

    const chartGroup = svg.select(`.${attrs.plotID}`);

    // calculate the bin objects and yscale domain
    const d3xScale = xScale as unknown as tD3Scale;
    const binFtn = d3Array.bin().domain(d3xScale.domain()).thresholds(bins);
    const binObjs = binFtn(ys as ArrayLike<number>);

    const maxLength = d3Array.reduce(
      binObjs,
      (p: any, v: []) => (v.length > p ? v.length : p),
      0
    );

    const normaliser = normlise ? 1.0 / maxLength : 1.0;
    let maxHeight = maxLength;

    if (useDensity) {
      let binWidth = 0;

      if (binObjs.length > 0) {
        const firstBin: any = binObjs[0];
        binWidth = firstBin.x1 - firstBin.x0;
      }

      maxHeight = maxLength / (ys.length * binWidth);
    }

    const d3YScale = yScale as unknown as tD3Scale;

    const currMaxHeight: number = d3YScale.domain()[1];
    if (currMaxHeight < maxHeight) {
      d3YScale.domain([0, maxHeight * normaliser]);
    }

    // select all rect in svg.chart-group with the class bar
    let bars = chartGroup.selectAll('.bar').data(binObjs);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    bars.exit().style('opacity', 0).remove();

    // Enter - add the shapes to this data point
    const enterGroup = bars.enter().append('rect').classed('bar', true);

    // join the new data points with existing
    bars = bars.merge(enterGroup as any);

    // now position and colour what exists on the dom
    bars
      .attr('x', (x: any) =>
        // console.log('what is x1 / domain / range / xscaled x: ', x.x0, xScale.domain(), xScale.range(), xScale(x.x0))
        xScale(x.x0)
      )
      .attr('y', (x: any) => {
        let yPos = x.length;
        if (useDensity) {
          yPos = x.length / (ys.length * (x.x1 - x.x0));
        }
        const yValue = yScale(yPos);
        return yValue;
      })
      .attr('width', (x: any) => {
        const width = xScale(x.x1) - xScale(x.x0);
        return width;
      })
      .attr('height', (x: any) => {
        // to compute density so that area under curve integrates to 1
        // density = x.length / total-no-counts * bin-width
        let height = x.length;
        if (useDensity) {
          height = x.length / (ys.length * (x.x1 - x.x0));
        }

        // let height = histscale(x)
        height = chartHeight - yScale(height);
        return height;
      })
      .attr('fill', () => 'red')
      .style('opacity', alpha);
  }
}

export { CHistogram };
