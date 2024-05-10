/* eslint-disable @typescript-eslint/no-explicit-any */
import rfdc from 'rfdc';
import MetadataAttrs, { tMetadataAttrs } from './Attrs';
import { MetadataSVGGenerator } from './SVGGenerator';
import { tContainerAttrs } from '../sharedTypes';
// import { PlotScalesGenerator } from './PlotScalesGenerator';

const defaultColours = ['black', 'green', 'blue', 'gray', 'black'];

abstract class MetadataBase {
  attrs: tMetadataAttrs;

  metadataSVGGenerator: MetadataSVGGenerator;

  constructor() {
    this.attrs = rfdc()(MetadataAttrs);
    this.metadataSVGGenerator = new MetadataSVGGenerator();
  }

  buildContainerGroups(container: tContainerAttrs) {
    this.metadataSVGGenerator.updateSVG(this, container);
  }

  //   getScales(container: tContainerAttrs) {
  //     return this.plotScalesGenerator.updateScales(this, container);
  //   }

  //   abstract draw(container: tContainerAttrs, scales: tScaling): void;
  abstract draw(container: tContainerAttrs): void;

  update(container: tContainerAttrs) {
    this.buildContainerGroups(container);
    // const { xScale, yScale } = this.getScales(container);
    // if (!xScale || !yScale) {
    //   return;
    // }

    // this.draw(container, {
    //     xScale,
    //     yScale,
    //   });

    this.draw(container);
  }
}

export { MetadataBase };
