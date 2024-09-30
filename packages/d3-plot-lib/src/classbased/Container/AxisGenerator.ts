/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import { CContainer } from './Container';

class AxisGenerator {
  container: CContainer;

  constructor(container: CContainer) {
    this.container = container;
  }

  buildAxis() {
    const { container } = this;
    const { attrs } = container;
    attrs.xAxis = null;
    attrs.yAxis = null;

    if (attrs.xScale === null || attrs.yScale === null) {
      return;
    }

    attrs.xAxis = d3.axisBottom(attrs.xScale);

    if (attrs.yAxisPosition === 'right') {
      attrs.yAxis = d3.axisRight(attrs.yScale);
    } else {
      attrs.yAxis = d3.axisLeft(attrs.yScale);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attrs.yAxis.ticks(10, '%').tickFormat((d: any) => {
      let toRet = d;
      if (toRet / 1000 >= 1) {
        toRet = `${d / 1000}K`;
      }
      return toRet;
    });
  }

  drawAxes() {
    const { container } = this;
    const { attrs } = container;

    if (!attrs.svg) {
      return;
    }
    const xAxisTextRotation = attrs.xAxisText.rotation ?? 0;
    let xAxisTextAnchor = 'middle';
    let xAxisTextDX = '0em';
    let xAxisTextDY = '1em';

    if (xAxisTextRotation !== 0) {
      xAxisTextAnchor = 'start';
      xAxisTextDX = '.8em';
      xAxisTextDY = '.15em';
    }

    const yAxisTextRotation = attrs.yAxisText.rotation ?? 0;
    // const yAxisTextAnchor = 'end'
    // const yAxisTextDX = '0em'
    // let yAxisTextDY = '0em'

    if (yAxisTextRotation !== 0) {
      // yAxisTextAnchor = "start"
      // yAxisTextDX = ".8em"
      // yAxisTextDY = '.15em'
    }

    let yAxisShift = 0;
    if (attrs.yAxisPosition === 'right') {
      yAxisShift = attrs.chartWidth + 4;
    }

    if (attrs.xAxisShow && attrs.xAxis) {
      attrs.svg
        .select('.x-axis-group.axis')
        .attr('transform', `translate(0,${attrs.chartHeight})`)
        .call(attrs.xAxis as any);

      const renderCBFtn = attrs.xAxisText.onRender;

      attrs.svg
        .select('.x-axis-group.axis')
        .selectAll('text')
        .text((d: any, ith: number) => (renderCBFtn ? renderCBFtn(d, ith) : d))
        .style('font', '10px Arial, sans-serif')
        .style('text-anchor', xAxisTextAnchor)
        .attr('dx', xAxisTextDX)
        .attr('dy', xAxisTextDY)
        .attr('transform', `rotate(${xAxisTextRotation})`);
    }

    if (attrs.yAxisShow && attrs.yAxis) {
      attrs.svg
        .select('.y-axis-group.axis')
        .attr('transform', `translate(${yAxisShift}, 0)`)
        .call(attrs.yAxis as any);

      attrs.svg
        .select('.y-axis-group.axis')
        .selectAll('text')
        .style('font', '10px Arial, sans-serif')
        // .style('font', '10px Arial, sans-serif')
        // .style("text-anchor", yAxisTextAnchor)
        // .attr("dx", yAxisTextDX)
        // .attr("dy", yAxisTextDY)
        .attr('transform', `rotate(${yAxisTextRotation})`);
    }
  }

  update() {
    this.buildAxis();
    this.drawAxes();
  }
}

export { AxisGenerator };
