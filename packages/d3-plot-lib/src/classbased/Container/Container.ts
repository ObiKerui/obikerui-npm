import rfdc from 'rfdc';
import * as d3 from 'd3';
import { ContainerAttrs } from './Attrs';
import { AxisGenerator } from './AxisGenerator';
import { LabelGenerator } from './LabelGenerator';
import { GridGenerator } from './GridGenerator';
import { tContainerAttrs, tMetadata, tPlot } from '../sharedTypes';

class CContainer {
  attrs: tContainerAttrs;

  axisGenerator: AxisGenerator;

  gridGenerator: GridGenerator;

  labelGenerator: LabelGenerator;

  plots: tPlot[];

  metadata: tMetadata[];

  constructor() {
    this.attrs = rfdc()(ContainerAttrs);
    this.plots = [];
    this.metadata = [];
    this.axisGenerator = new AxisGenerator(this);
    this.gridGenerator = new GridGenerator(this);
    this.labelGenerator = new LabelGenerator(this);
  }

  // Building Blocks
  buildContainerGroups(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
  ) {
    const { attrs } = this;
    const marginLeft = attrs.margins.left;
    const marginTop = attrs.margins.top;

    const container = svg
      .append('g')
      .classed('container-group', true)
      .attr('transform', `translate(${marginLeft},${marginTop})`);

    container.append('g').classed('x-axis-group grid', true);
    container.append('g').classed('y-axis-group grid', true);

    container.append('g').classed('chart-group', true);

    container.append('g').classed('x-axis-group axis', true);
    container.append('g').classed('x-axis-label', true);

    container.append('g').classed('y-axis-group axis', true);
    container.append('g').classed('y-axis-label', true);

    container.append('g').classed('metadata-group', true);
  }

  buildSVG(container: HTMLElement) {
    const { attrs } = this;
    if (!attrs.svg) {
      attrs.svg = d3
        .select(container)
        .append('svg')
        .classed('jschart-container', true);
      this.buildContainerGroups(attrs.svg);
    }
    attrs.svg.attr('width', attrs.width).attr('height', attrs.height);
  }

  update() {
    const { attrs, plots, metadata } = this;

    if (!attrs.html) {
      return;
    }

    attrs.chartWidth = +(
      attrs.width -
      attrs.margins.left -
      attrs.margins.right
    );
    attrs.chartHeight = +(
      attrs.height -
      attrs.margins.top -
      attrs.margins.bottom
    );

    // const node = htmlSelection.node();
    // if (!node) {
    //   return;
    // }

    this.buildSVG(attrs.html);

    if (attrs.onGetXScale) {
      attrs.xScale = attrs.onGetXScale(
        attrs.chartWidth
      ) as d3.AxisScale<d3.AxisDomain>;
    }
    if (attrs.onGetYScale) {
      attrs.yScale = attrs.onGetYScale(
        attrs.chartHeight
      ) as d3.AxisScale<d3.AxisDomain>;
    }

    plots.forEach((plot: tPlot) => {
      plot.update(attrs);
    });

    this.axisGenerator.update();
    this.labelGenerator.update();
    this.gridGenerator.update();

    // if (attrs.legend) attrs.legend(attrs, plots);
    metadata.forEach((meta: tMetadata) => {
      meta.update(attrs);
    });

    if (attrs.showMargins && attrs.svg) {
      attrs.svg.style('background-color', 'rgba(255, 0, 0, .2)');
    }
  }

  addPlot(plot: tPlot) {
    this.plots.push(plot);
  }

  getPlots() {
    return this.plots;
  }

  addMetadata(metadata: tMetadata) {
    this.metadata.push(metadata);
  }

  getMetadata() {
    return this.metadata;
  }
}

export { CContainer };