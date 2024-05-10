/* eslint-disable @typescript-eslint/no-explicit-any */
import rfdc from 'rfdc';
import PlotAttrs, { tPlotAttrs } from './PlotAttrs';
import { PlotSVGGenerator } from './PlotSVGGenerator';
import { tContainerAttrs, tScaling } from '../sharedTypes';
import { PlotScalesGenerator } from './PlotScalesGenerator';

const defaultColours = ['black', 'green', 'blue', 'gray', 'black'];

abstract class PlotBase {
  attrs: tPlotAttrs;

  plotSVGGenerator: PlotSVGGenerator;

  plotScalesGenerator: PlotScalesGenerator;

  constructor() {
    this.attrs = rfdc()(PlotAttrs);
    this.plotSVGGenerator = new PlotSVGGenerator();
    this.plotScalesGenerator = new PlotScalesGenerator();
  }

  buildContainerGroups(container: tContainerAttrs) {
    this.plotSVGGenerator.updateSVG(this, container);
  }

  getScales(container: tContainerAttrs) {
    return this.plotScalesGenerator.updateScales(this, container);
  }

  abstract draw(container: tContainerAttrs, scales: tScaling): void;

  update(container: tContainerAttrs) {
    this.buildContainerGroups(container);
    const { xScale, yScale } = this.getScales(container);
    if (!xScale || !yScale) {
      return;
    }

    this.draw(container, {
      xScale,
      yScale,
    });
  }
}

export { PlotBase };
