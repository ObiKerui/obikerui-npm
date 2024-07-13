import { CContainer } from './Container';

class ClipPathGenerator {
  container: CContainer;

  constructor(container: CContainer) {
    this.container = container;
  }

  updateClipPath() {
    const { container } = this;
    const { attrs } = container;

    if (!attrs.svg) {
      return;
    }

    const { chartHeight, chartWidth } = attrs;

    const clipPath = attrs.svg
      .select('g.container-group')
      .select('defs')
      .select('clippath');

    if (clipPath.empty()) {
      const clipPathParent = attrs.svg.select('g.container-group');

      clipPathParent
        .append('defs')
        .append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', chartWidth)
        .attr('height', chartHeight);

      const mapGroup = clipPathParent.select('g.map-group');
      mapGroup.attr('clip-path', 'url(#clip)');
    } else {
      clipPath.attr('width', chartWidth);
      clipPath.attr('height', chartHeight);
    }
  }

  update() {
    this.updateClipPath();
  }
}

export { ClipPathGenerator };
