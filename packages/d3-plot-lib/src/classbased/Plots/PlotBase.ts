/* eslint-disable @typescript-eslint/no-explicit-any */
import rfdc from 'rfdc';
import PlotAttrs, { tPlotAttrs } from './PlotAttrs';
import { PlotSVGGenerator } from './PlotSVGGenerator';
import { tContainerAttrs, tScaling } from '../sharedTypes';
import { PlotScalesGenerator } from './PlotScalesGenerator';
// import { PlotClipPathGenerator } from './PlotClipPathGenerator';

// const defaultColours = ['black', 'green', 'blue', 'gray', 'black'];

abstract class PlotBase {
  attrs: tPlotAttrs;

  plotSVGGenerator: PlotSVGGenerator;

  plotScalesGenerator: PlotScalesGenerator;

  // plotClipPathGenerator: PlotClipPathGenerator;

  constructor() {
    this.attrs = rfdc()(PlotAttrs);
    this.plotSVGGenerator = new PlotSVGGenerator();
    this.plotScalesGenerator = new PlotScalesGenerator();
    // this.plotClipPathGenerator = new PlotClipPathGenerator();
  }

  buildContainerGroups(container: tContainerAttrs) {
    this.plotSVGGenerator.updateSVG(this, container);
  }

  // buildClipPath(container: tContainerAttrs) {
  //   this.plotClipPathGenerator.updateSVG(this, container);
  // }

  getScales(container: tContainerAttrs) {
    return this.plotScalesGenerator.updateScales(this, container);
  }

  abstract draw(container: tContainerAttrs, scales: tScaling): void;

  update(container: tContainerAttrs) {
    this.buildContainerGroups(container);
    // this.buildClipPath(container);

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
