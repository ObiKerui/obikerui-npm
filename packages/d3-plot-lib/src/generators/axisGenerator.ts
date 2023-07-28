/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import { tContainerAttrs } from '../attributes/container';

function AxisGenerator() {
  function buildAxes(container: tContainerAttrs) {
    container.xAxis = null;
    container.yAxis = null;

    if (container.xScale === null || container.yScale === null) {
      return;
    }

    container.xAxis = d3.axisBottom(container.xScale);

    if (container.yAxisPosition === 'right') {
      container.yAxis = d3.axisRight(container.yScale);
    } else {
      container.yAxis = d3.axisLeft(container.yScale);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    container.yAxis.ticks(10, '%').tickFormat((d: any) => {
      let toRet = d;
      if (toRet / 1000 >= 1) {
        toRet = `${d / 1000}K`;
      }
      return toRet;
    });
  }

  function drawAxes(container: tContainerAttrs) {
    if (!container.svg) {
      return;
    }
    const xAxisTextRotation = container.xAxisText.rotation ?? 0;
    let xAxisTextAnchor = 'middle';
    let xAxisTextDX = '0em';
    let xAxisTextDY = '1em';

    if (xAxisTextRotation !== 0) {
      xAxisTextAnchor = 'start';
      xAxisTextDX = '.8em';
      xAxisTextDY = '.15em';
    }

    const yAxisTextRotation = container.yAxisText.rotation ?? 0;
    // const yAxisTextAnchor = 'end'
    // const yAxisTextDX = '0em'
    // let yAxisTextDY = '0em'

    if (yAxisTextRotation !== 0) {
      // yAxisTextAnchor = "start"
      // yAxisTextDX = ".8em"
      // yAxisTextDY = '.15em'
    }

    let yAxisShift = 0;
    if (container.yAxisPosition === 'right') {
      yAxisShift = container.chartWidth + 4;
    }

    if (container.xAxisShow && container.xAxis) {
      container.svg
        .select('.x-axis-group.axis')
        .attr('transform', `translate(0,${container.chartHeight})`)
        .call(container.xAxis as any);

      container.svg
        .select('.x-axis-group.axis')
        .selectAll('text')
        .style('font', '10px Arial, sans-serif')
        .style('text-anchor', xAxisTextAnchor)
        .attr('dx', xAxisTextDX)
        .attr('dy', xAxisTextDY)
        .attr('transform', `rotate(${xAxisTextRotation})`);
    }

    if (container.yAxisShow && container.yAxis) {
      container.svg
        .select('.y-axis-group.axis')
        .attr('transform', `translate(${yAxisShift}, 0)`)
        .call(container.yAxis as any);

      container.svg
        .select('.y-axis-group.axis')
        .selectAll('text')
        .style('font', '10px Arial, sans-serif')
        // .style("text-anchor", yAxisTextAnchor)
        // .attr("dx", yAxisTextDX)
        // .attr("dy", yAxisTextDY)
        .attr('transform', `rotate(${yAxisTextRotation})`);
    }
  }

  function toExport(container: tContainerAttrs) {
    buildAxes(container);
    drawAxes(container);
  }

  return toExport;
}

export default AxisGenerator;
