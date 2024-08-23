/* eslint-disable lines-between-class-members */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import { tContainerAttrs, tScaling } from '../sharedTypes';
import { PlotBase } from './PlotBase';

class CBrush extends PlotBase {
  isInsideBrush = false;
  isMouseDown = false;
  xDragOffset = 0;
  brushXValue = 0;

  draw(container: tContainerAttrs, { xScale }: tScaling) {
    const { attrs } = this;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const { onMove, timeFrame } = attrs;
    const { svg, chartHeight, chartWidth } = container;

    if (!svg) {
      return;
    }

    const chartGroup = svg.select(`.${attrs.plotID}`);

    // try adding a clip path to the svg
    // attrs.clipPathID = `attrs.plotID-${uuidv4()}`;
    // chartGroup
    //   .append('defs')
    //   .append('clipPath')
    //   .attr('id', `${attrs.clipPathID}`)
    //   .append('rect')
    //   .attr('x', 0)
    //   .attr('y', 0)
    //   .attr('width', chartWidth) // Adjust the width as needed
    //   .attr('height', chartHeight); // Adjust the height as needed

    const cScale = xScale as d3.ScaleContinuousNumeric<number, number>;

    // const timeFrame = [new Date('2023-01-01'), new Date('2023-01-15')];
    const startDate = timeFrame[0];
    const endDate = timeFrame[1];
    const xStartPos = cScale(startDate) ?? 0;
    const xEndPos = cScale(endDate) ?? 0;
    let width = xEndPos - xStartPos;

    width = width > chartWidth ? chartWidth : width;
    width = width === 0 ? 100 : width;

    // width and height need to be set better - should focus on an area of data
    let brush = chartGroup.select<SVGRectElement>('rect.brush');
    if (brush.empty()) {
      brush = chartGroup.append('rect').classed('brush', true);
    }

    brush
      .attr('x', self.brushXValue)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', chartHeight)
      .style('fill', 'white')
      .style('stroke', 'blue')
      .style('opacity', 0.45)
      .on('mousemove', (_d: unknown, i: number, node) => {
        // const rect = d3.select(node[i]);
        brush.style('cursor', 'grab');

        if (self.isMouseDown && self.isInsideBrush) {
          const mousePosition = d3.mouse(node[i]);
          const posOnChartX = cScale.invert(mousePosition[0]);

          const rectX = self.brushXValue;
          const rectWidth = +brush.attr('width');

          let newXvalue = (cScale(posOnChartX) as number) - self.xDragOffset;

          // get min/max domain bounds
          let minX = cScale.domain()[0];
          minX = minX ?? 0;
          let maxX = cScale.domain()[1];
          maxX = maxX ?? 0;

          // check for values outside bounds of domain
          const lessThanXLimit = newXvalue < (cScale(minX) as number);
          const greaterThanXLimit =
            +(newXvalue + rectWidth) > (cScale(maxX) as number);

          // correct if necessary
          newXvalue = lessThanXLimit ? rectX : newXvalue;
          newXvalue = greaterThanXLimit ? rectX : newXvalue;

          self.brushXValue = newXvalue;

          if (!lessThanXLimit && !greaterThanXLimit) {
            const minDomain = cScale.invert(newXvalue);
            const innerRectWidth = +brush.attr('width');
            const maxDomain = cScale.invert(newXvalue + innerRectWidth);
            const newDomain = [minDomain, maxDomain];
            const newScaleX = cScale.copy();
            newScaleX.domain(newDomain);
            if (onMove) {
              onMove(newScaleX);
            }
          }
        }
      })
      .on('mouseenter', () => {
        self.isInsideBrush = true;
      })
      .on('mouseleave', () => {
        self.isInsideBrush = false;
        self.isMouseDown = false;
      })
      .on('mousedown', (_d, i, node) => {
        self.isMouseDown = true;
        const rect = d3.select(node[i]);
        const xPos = +rect.attr('x');
        const mousePosition = d3.mouse(node[i]);
        const xPosOnChart = cScale.invert(mousePosition[0]);

        self.xDragOffset = Math.abs(xPos - (cScale(xPosOnChart) as number));
      })
      .on('mouseup', () => {
        self.isMouseDown = false;
      });
  }
}

export { CBrush };
