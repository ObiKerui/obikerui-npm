/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
import * as d3 from 'd3';
import { tContainerAttrs } from '../attributes/container';

function GridGenerator() {
  function buildGrid(container: tContainerAttrs) {
    container.xGrid = null;
    container.yGrid = null;

    if (container.xScale === null || container.yScale === null) {
      return;
    }

    container.xGrid = d3
      .axisBottom(container.xScale)
      .tickSize(-container.chartHeight)
      .tickFormat(null)
      .ticks(10);

    if (container.yAxisPosition === 'right') {
      container.yGrid = d3.axisRight(container.yScale);
    } else {
      container.yGrid = d3.axisLeft(container.yScale);
    }

    container.yGrid.tickSize(-container.chartWidth).tickFormat(null).ticks(10);
  }

  function drawGrid(container: tContainerAttrs) {
    if (!container.svg) {
      return;
    }

    let yAxisShift = 0;
    if (container.yAxisPosition === 'right') {
      yAxisShift = container.chartWidth + 4;
    }

    if (container.xGridShow && container.xGrid) {
      const xGrid = container.svg
        .select('.x-axis-group.grid')
        .attr('transform', `translate(0,${container.chartHeight})`)
        .call(container.xGrid);

      xGrid.style('opacity', 0.3);
    }

    if (container.yGridShow && container.yGrid) {
      const yGrid = container.svg
        .select('.y-axis-group.grid')
        .attr('transform', `translate(${yAxisShift})`)
        .call(container.yGrid);

      yGrid.style('opacity', 0.3);
    }
  }

  function toExport(container: tContainerAttrs) {
    buildGrid(container);
    drawGrid(container);
  }
  return toExport;
}

export default GridGenerator;
