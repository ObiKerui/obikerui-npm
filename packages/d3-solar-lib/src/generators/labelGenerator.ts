/* eslint-disable no-param-reassign */
import { tContainerAttrs } from '../attributes/container';

function LabelGenerator() {
  /**
   * Draws the x and y axis custom labels respective groups
   * @private
   */
  function drawAxisLabels(container: tContainerAttrs) {
    if (!container.svg) {
      return;
    }
    // .append("text")
    // .attr("y", 6)
    // .attr("dy", "2.0em")
    // .attr("x", 100)
    // .style("fill", "black")
    // .text("hello")

    let yAxisShift = 0;
    if (container.yAxisPosition === 'right') {
      yAxisShift = container.chartWidth + 80;
    }

    if (container.yAxisLabel) {
      if (container.yAxisLabelEl) {
        container.yAxisLabelEl.remove();
      }

      container.yAxisLabelEl = container.svg
        .select('.y-axis-label')
        .attr('transform', `translate(${yAxisShift}, 0)`)
        .append('text')
        .classed('y-axis-label-text', true)
        .attr('x', -container.chartHeight / 2)
        .attr('y', container.yAxisLabelOffset)
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(270 0 0)')
        .text(container.yAxisLabel);
    }

    if (container.xAxisLabel) {
      if (container.xAxisLabelEl) {
        container.xAxisLabelEl.remove();
      }

      container.xAxisLabelEl = container.svg
        .select('.x-axis-label')
        .attr('transform', `translate(0,${container.chartHeight})`)
        .append('text')
        .attr('y', container.xAxisLabelOffset)
        .attr('text-anchor', 'middle')
        .classed('x-axis-label-text', true)
        .attr('x', container.chartWidth / 2)
        .text(container.xAxisLabel);
    }
  }

  function toExport(container: tContainerAttrs) {
    drawAxisLabels(container);
  }
  return toExport;
}

export default LabelGenerator;
