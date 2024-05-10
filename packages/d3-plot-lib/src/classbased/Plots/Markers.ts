/* eslint-disable @typescript-eslint/no-explicit-any */
import { tContainerAttrs, tScaling } from '../sharedTypes';
import { PlotBase } from './PlotBase';

const defaultColours = ['black', 'green', 'blue', 'gray', 'black'];

class CMarkers extends PlotBase {
  draw(container: tContainerAttrs, { xScale, yScale }: tScaling) {
    const { attrs } = this;

    const { xs, ys } = attrs;

    const { svg } = container;
    const colours = attrs.colours ?? defaultColours;

    if (!svg) {
      return;
    }

    const chartGroup = svg.select(`.${attrs.plotID}`);

    let plots = chartGroup.selectAll('circle').data(ys as any);

    const plotsEnter = plots.enter().append('circle');

    plots.exit().remove();

    plots = plots.merge(plotsEnter as any);

    // let plotsInner = plots.selectAll('circle').data((d: unknown, i: number) => {
    //   const pairs = d as tPairType[];
    //   const pairedData = pairs.map((elem) => ({ elem, i }));
    //   return pairedData;
    // });

    // const plotsInnerEnter = plotsInner
    //   .enter()
    //   .append('circle')
    //   .filter((d: unknown) => {
    //     const pair = d as tPairType;
    //     return Number.isNaN(pair.elem) === false;
    //   });

    // plotsInner.exit().remove();

    // plotsInner = plotsInner.merge(plotsInnerEnter as any);

    // const xScaleBW = xScale.bandwidth;
    // const cellWidth = xScaleBW ? xScaleBW() : 0;
    // const yScaleBW = yScale.bandwidth;
    // const cellHeight = yScaleBW ? yScaleBW() : 0;

    plots
      .attr('cx', (_d: unknown, ith: number): number => {
        const result = xScale(xs[ith] as any) ?? 0;
        return result || 0;
      })
      .attr('cy', (d: unknown): number => {
        const result = yScale(d as any) ?? 0;
        return result || 0;
      })
      .attr('r', 5.5)
      .style('fill', (_d: any, ith: number) => colours[ith] ?? 'black');
  }
}

// class CMarkers {
//   attrs: tPlotAttrs;

//   plotSVGGenerator: PlotSVGGenerator;

//   plotScalesGenerator: PlotScalesGenerator;

//   constructor() {
//     this.attrs = rfdc()(PlotAttrs);
//     this.plotSVGGenerator = new PlotSVGGenerator();
//     this.plotScalesGenerator = new PlotScalesGenerator();
//   }

//   buildContainerGroups(container: tContainerAttrs) {
//     this.plotSVGGenerator.updateSVG(this, container);
//   }

//   getScales(container: tContainerAttrs) {
//     return this.plotScalesGenerator.updateScales(this, container);
//   }

//   draw(container: tContainerAttrs) {
//     const { attrs } = this;

//     const { xs, ys } = attrs;

//     const { svg } = container;
//     const colours = attrs.colours ?? defaultColours;

//     const { xScale, yScale } = this.getScales(container);

//     if (!xScale || !yScale || !svg) {
//       return;
//     }

//     const chartGroup = svg.select(`.${attrs.plotID}`);

//     let plots = chartGroup.selectAll('circle').data(ys as any);

//     const plotsEnter = plots.enter().append('circle');

//     plots.exit().remove();

//     plots = plots.merge(plotsEnter as any);

//     // let plotsInner = plots.selectAll('circle').data((d: unknown, i: number) => {
//     //   const pairs = d as tPairType[];
//     //   const pairedData = pairs.map((elem) => ({ elem, i }));
//     //   return pairedData;
//     // });

//     // const plotsInnerEnter = plotsInner
//     //   .enter()
//     //   .append('circle')
//     //   .filter((d: unknown) => {
//     //     const pair = d as tPairType;
//     //     return Number.isNaN(pair.elem) === false;
//     //   });

//     // plotsInner.exit().remove();

//     // plotsInner = plotsInner.merge(plotsInnerEnter as any);

//     // const xScaleBW = xScale.bandwidth;
//     // const cellWidth = xScaleBW ? xScaleBW() : 0;
//     // const yScaleBW = yScale.bandwidth;
//     // const cellHeight = yScaleBW ? yScaleBW() : 0;

//     plots
//       .attr('cx', (_d: unknown, ith: number): number => {
//         const result = xScale(xs[ith] as any) ?? 0;
//         return result || 0;
//       })
//       .attr('cy', (d: unknown): number => {
//         const result = yScale(d as any) ?? 0;
//         return result || 0;
//       })
//       .attr('r', 5.5)
//       .style('fill', (_d: any, ith: number) => colours[ith] ?? 'black');
//   }

//   update(container: tContainerAttrs) {
//     this.buildContainerGroups(container);
//     this.draw(container);
//   }
// }

export { CMarkers };
