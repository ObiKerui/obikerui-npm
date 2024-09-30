import { CContainer } from './Container';

class LabelGenerator {
  container: CContainer;

  constructor(container: CContainer) {
    this.container = container;
  }

  drawAxisLabels() {
    const { container } = this;
    const { attrs } = container;

    if (!attrs.svg) {
      return;
    }
    // .append("text")
    // .attr("y", 6)
    // .attr("dy", "2.0em")
    // .attr("x", 100)
    // .style("fill", "black")
    // .text("hello")

    let yAxisShift = 0;
    if (attrs.yAxisPosition === 'right') {
      yAxisShift = attrs.chartWidth + 80;
    }

    if (attrs.yAxisLabel && attrs.yAxisShow) {
      if (attrs.yAxisLabelEl) {
        attrs.yAxisLabelEl.remove();
      }

      attrs.yAxisLabelEl = attrs.svg
        .select('.y-axis-label')
        .attr('transform', `translate(${yAxisShift}, 0)`)
        .append('text')
        .classed('y-axis-label-text', true)
        .attr('x', -attrs.chartHeight / 2)
        .attr('y', attrs.yAxisLabelOffset)
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(270 0 0)')
        .style('fill', 'currentColor')
        .style('font', '10px Arial, sans-serif')
        .text(attrs.yAxisLabel);
    }

    if (attrs.xAxisLabel && attrs.xAxisShow) {
      if (attrs.xAxisLabelEl) {
        attrs.xAxisLabelEl.remove();
      }

      attrs.xAxisLabelEl = attrs.svg
        .select('.x-axis-label')
        .attr('transform', `translate(0,${attrs.chartHeight})`)
        .append('text')
        .attr('y', attrs.xAxisLabelOffset)
        .attr('text-anchor', 'middle')
        .classed('x-axis-label-text', true)
        .attr('x', attrs.chartWidth / 2)
        .style('fill', 'currentColor')
        .style('font', '10px Arial, sans-serif')
        .text(attrs.xAxisLabel);
    }
  }

  update() {
    this.drawAxisLabels();
  }
}

export { LabelGenerator };
