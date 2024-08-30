/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import { tContainerAttrs, tScaling } from '../sharedTypes';
import { PlotBase } from './PlotBase';

export type tSelection = d3.Selection<d3.BaseType, any, null, undefined>;

class CGeneric extends PlotBase {
  genericAttrs = {
    onDraw: null as
      | ((
          selection: tSelection,
          scaling: tScaling,
          chartHeight: number,
          chartWidth: number
        ) => void)
      | null,
  };

  draw(container: tContainerAttrs, scaling: tScaling) {
    const { attrs } = this;
    // const { clipPathID } = attrs;
    const { svg, chartHeight, chartWidth } = container;

    if (!svg) {
      return;
    }

    const chartGroup = svg.select(`.${attrs.plotID}`);

    if (this.genericAttrs.onDraw) {
      this.genericAttrs.onDraw(chartGroup, scaling, chartHeight, chartWidth);
    }
  }
}

export { CGeneric };
