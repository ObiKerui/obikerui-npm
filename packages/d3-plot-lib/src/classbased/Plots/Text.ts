/* eslint-disable @typescript-eslint/no-explicit-any */
import { tContainerAttrs, tScaling } from '../sharedTypes';
import { PlotBase } from './PlotBase';

class CText extends PlotBase {
  draw(container: tContainerAttrs, { xScale, yScale }: tScaling) {
    const { attrs } = this;
    const { coordinates } = attrs;
    const { svg } = container;

    if (!svg) {
      return;
    }

    const chartGroup = svg.select(`.${attrs.plotID}`);
    let labels = chartGroup.selectAll('.label').data(coordinates);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    labels.exit().style('opacity', 0).remove();

    const enterGroup = labels.enter().append('g').classed('label', true);
    enterGroup.append('text');

    labels = labels.merge(enterGroup as any);

    const textElement = labels
      .attr('transform', (d: any) => {
        let coords = [0, 0];
        if (attrs.onGetCoordinates) {
          coords = attrs.onGetCoordinates(d);
        }
        const xPos = (xScale && xScale(coords[0])) ?? 0;
        const yPos = (yScale && yScale(coords[1])) ?? 0;
        return `translate(${xPos},${yPos})`;
      })
      .select('text');

    textElement
      .attr('text-anchor', 'middle')
      .style('alignment-baseline', 'middle')
      .style('font-size', '.8em')
      .text((d: any) => {
        if (attrs.onGetText) {
          return attrs.onGetText(d);
        }
        return '';
      });

    if (attrs.onSetAttrs) {
      const setAttrsFtn = attrs.onSetAttrs as (
        selection: d3.Selection<d3.BaseType, unknown, d3.BaseType, any>
      ) => void;

      setAttrsFtn(labels);
    }
  }
}

export { CText };
