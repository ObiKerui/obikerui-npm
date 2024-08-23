import * as d3 from 'd3';
import { CContainer } from './Container';

class GridGenerator {
  container: CContainer;

  constructor(container: CContainer) {
    this.container = container;
  }

  buildGrid() {
    const { container } = this;
    const { attrs } = container;

    attrs.xGrid = null;
    attrs.yGrid = null;

    if (attrs.xScale === null || attrs.yScale === null) {
      return;
    }

    attrs.xGrid = d3
      .axisBottom(attrs.xScale)
      .tickSize(-attrs.chartHeight)
      .tickFormat(null)
      .ticks(10);

    if (attrs.yAxisPosition === 'right') {
      attrs.yGrid = d3.axisRight(attrs.yScale);
    } else {
      attrs.yGrid = d3.axisLeft(attrs.yScale);
    }

    attrs.yGrid.tickSize(-attrs.chartWidth).tickFormat(null).ticks(10);
  }

  drawGrid() {
    const { container } = this;
    const { attrs } = container;

    if (!attrs.svg) {
      return;
    }

    let yAxisShift = 0;
    if (attrs.yAxisPosition === 'right') {
      yAxisShift = attrs.chartWidth + 4;
    }

    if (attrs.xGridShow && attrs.xGrid) {
      const xGrid = attrs.svg
        .select('.x-axis-group.grid')
        .attr('transform', `translate(0,${attrs.chartHeight})`)
        .call(attrs.xGrid);

      xGrid.style('opacity', 0.3);
    }

    if (attrs.yGridShow && attrs.yGrid) {
      const yGrid = attrs.svg
        .select('.y-axis-group.grid')
        .attr('transform', `translate(${yAxisShift})`)
        .call(attrs.yGrid);

      yGrid.style('opacity', 0.3);
      attrs.svg
        .select('.y-axis-group.grid')
        .selectAll('g.tick')
        .select('text')
        .style('display', 'none');
    }
  }

  update() {
    this.buildGrid();
    this.drawGrid();
  }
}

export { GridGenerator };
