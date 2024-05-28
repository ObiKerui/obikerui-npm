import rfdc from 'rfdc';
import { tContainerAttrs, tScaling } from '../sharedTypes';
import { tPlotAttrs, PlotAttrs } from './Attrs';
import { PlotSVGGenerator } from './PlotSVGGenerator';

abstract class PlotBase {
  attrs: tPlotAttrs;

  plotSVGGenerator: PlotSVGGenerator;

  //   plotScalesGenerator: PlotScalesGenerator;

  constructor() {
    this.attrs = rfdc()(PlotAttrs);
    this.plotSVGGenerator = new PlotSVGGenerator();
    // this.plotScalesGenerator = new PlotScalesGenerator();
  }

  buildContainerGroups(container: tContainerAttrs) {
    this.plotSVGGenerator.updateSVG(this, container);
  }

  abstract draw(container: tContainerAttrs): void;

  update(container: tContainerAttrs) {
    this.buildContainerGroups(container);
    // const { xScale, yScale } = this.getScales(container);
    // if (!xScale || !yScale) {
    //   return;
    // }

    // this.draw(container, {
    //   xScale,
    //   yScale,
    // });
    this.draw(container);
  }
}

export { PlotBase };
