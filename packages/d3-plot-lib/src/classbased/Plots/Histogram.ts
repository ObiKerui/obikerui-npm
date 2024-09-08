/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import * as d3Array from 'd3-array';
import { tContainerAttrs, tScaling } from '../sharedTypes';
import { PlotBase } from './PlotBase';
import { PlotHistGenerator } from './PlotHistGenerator';

class CHistogram extends PlotBase {
  // histGenerator: PlotHistGenerator;

  histAttrs = {
    bins: [] as d3Array.Bin<number, number>[],
    // normalise: false as boolean,
    // useDensity: false as boolean,
    colour: 'blue' as string,
    opacity: 1 as number,
  };

  // constructor() {
  //   super();
  //   this.histGenerator = new PlotHistGenerator();
  // }

  draw(container: tContainerAttrs, { xScale, yScale }: tScaling) {
    const { attrs, histAttrs } = this;
    const { bins, colour, opacity } = histAttrs;
    const { svg, chartHeight } = container;

    if (!svg) {
      return;
    }

    // const bins = histGenerator
    //   .setDomain(d3.extent(ys) as [number, number])
    //   .setThresholds(100)
    //   .generateBins(ys);

    // const yDomain = histGenerator.getYDomain(bins, normalise);
    // const yBinScale = d3
    //   .scaleLinear<number, number>()
    //   .domain(yDomain)
    //   .range(yScale.range() as number[]);

    // console.log(
    //   'what are the ydomain / norm / range ',
    //   yDomain,
    //   normalise,
    //   yScale.range()
    // );

    const chartGroup = svg.select(`.${attrs.plotID}`);

    // select all rect in svg.chart-group with the class bar
    let bars = chartGroup.selectAll<SVGRectElement, number>('.bar').data(bins);

    bars.exit().style('opacity', 0).remove();

    const enterGroup = bars.enter().append('rect').classed('bar', true);

    bars = bars.merge(enterGroup);

    // now position and colour what exists on the dom
    bars
      .attr('x', (x) => xScale(x.x0))
      .attr('y', (x) => {
        // const x1 = x.x1 ?? 0;
        // const x0 = x.x0 ?? 0;
        // const divisor = x1 - x0 !== 0 ? x1 - x0 : 1;

        const yPos = x.length;
        // if (useDensity) {
        //   yPos = x.length / (ys.length * divisor);
        // }
        const yValue = yScale(yPos) ?? 0;
        return yValue;
      })
      .attr('width', (x) => {
        const width = xScale(x.x1) - xScale(x.x0);
        return width;
      })
      .attr('height', (x) => {
        // to compute density so that area under curve integrates to 1
        // density = x.length / total-no-counts * bin-width
        // const x1 = x.x1 ?? 0;
        // const x0 = x.x0 ?? 0;
        // const divisor = x1 - x0 !== 0 ? x1 - x0 : 1;

        let height = x.length;
        // if (useDensity) {
        //   height = x.length / (ys.length * divisor);
        // }

        // let height = histscale(x)
        // height = chartHeight - yScale(height);
        height = chartHeight - (yScale(height) ?? 0);
        return height;
      })
      .attr('fill', () => colour)
      .style('opacity', opacity);
  }
}

export { CHistogram };
