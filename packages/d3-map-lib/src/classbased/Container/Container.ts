/* eslint-disable max-classes-per-file */
import rfdc from 'rfdc';
import { ContainerAttrs } from './Attrs';
import { AxisGenerator } from './AxisGenerator';
import { LabelGenerator } from './LabelGenerator';
import { GridGenerator } from './GridGenerator';
import { tContainerAttrs, tMetadata, tPlot } from '../sharedTypes';
import { LeafletGenerator } from './LeafletGenerator';
import { SVGGenerator } from './SVGGenerator';

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

    // if (attrs.onGetXScale) {
    //   attrs.xScale = attrs.onGetXScale(
    //     attrs.chartWidth
    //   ) as d3.AxisScale<d3.AxisDomain>;
    // }
    // if (attrs.onGetYScale) {
    //   attrs.yScale = attrs.onGetYScale(
    //     attrs.chartHeight
    //   ) as d3.AxisScale<d3.AxisDomain>;
    // }

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

class LeafletContainer extends CContainer {
  leafletMapGenerator: LeafletGenerator;

  constructor() {
    super();
    this.leafletMapGenerator = new LeafletGenerator();
  }

  redraw() {
    const { plots, attrs } = this;

    plots.forEach((plot) => {
      plot.update(attrs);
    });
  }

  update() {
    const { attrs } = this;

    if (!attrs.html) {
      return;
    }

    this.leafletMapGenerator.updateSVG(attrs);
    if (attrs.map) {
      attrs.map.on('zoomend', () => this.redraw());
    }

    if (attrs.map) {
      attrs.map.invalidateSize();
    }
    super.update();
  }
}

class BaseContainer extends CContainer {
  svgGenerator: SVGGenerator;

  constructor() {
    super();
    this.svgGenerator = new SVGGenerator();
  }

  update() {
    const { attrs } = this;

    if (!attrs.html) {
      return;
    }

    this.svgGenerator.updateSVG(attrs);

    super.update();
  }
}

export { CContainer, BaseContainer, LeafletContainer };
