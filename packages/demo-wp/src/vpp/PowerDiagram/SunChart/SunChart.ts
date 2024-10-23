/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3PlotLib from '@obikerui/d3-plot-lib';
import * as d3SolarLib from '@obikerui/d3-solar-lib';
import * as d3 from 'd3';
import dayjs from 'dayjs';
import { tPowerRouter } from '../../Solax/Store';

class Chart {
  container;
  analemmaXs: number[][] = [];
  analemmaYs: number[][] = [];
  sunPathsXs: number[][] = [];
  sunPathsYs: number[][] = [];

  constructor() {
    const { analemmaXs, analemmaYs, sunPathsXs, sunPathsYs } = this;
    const location = [1, 51.49];

    const yearDataGen = d3SolarLib
      .YearDataGenerator()
      .location(location)
      .positionGenerator(d3SolarLib.SunPos900);

    yearDataGen();

    const analemma = d3SolarLib
      .AnalemmaGenerator()
      .yearData(yearDataGen.data())
      .hour(4);
    analemma();
    analemmaXs.push(analemma.xsMerged());
    analemmaYs.push(analemma.ysMerged());

    analemma.hour(5);
    analemma();
    analemmaXs.push(analemma.xsMerged());
    analemmaYs.push(analemma.ysMerged());

    analemma.hour(6);
    analemma();
    analemmaXs.push(analemma.xsMerged());
    analemmaYs.push(analemma.ysMerged());

    analemma.hour(7);
    analemma();
    analemmaXs.push(analemma.xsMerged());
    analemmaYs.push(analemma.ysMerged());

    analemma.hour(8);
    analemma();
    analemmaXs.push(analemma.xsMerged());
    analemmaYs.push(analemma.ysMerged());

    analemma.hour(9);
    analemma();
    analemmaXs.push(analemma.xsMerged());
    analemmaYs.push(analemma.ysMerged());

    analemma.hour(10);
    analemma();
    analemmaXs.push(analemma.xsMerged());
    analemmaYs.push(analemma.ysMerged());

    analemma.hour(11);
    analemma();
    analemmaXs.push(analemma.xsMerged());
    analemmaYs.push(analemma.ysMerged());

    analemma.hour(12);
    analemma();
    analemmaXs.push(analemma.xsMerged());
    analemmaYs.push(analemma.ysMerged());

    analemma.hour(13);
    analemma();
    analemmaXs.push(analemma.xsMerged());
    analemmaYs.push(analemma.ysMerged());

    analemma.hour(14);
    analemma();
    analemmaXs.push(analemma.xsMerged());
    analemmaYs.push(analemma.ysMerged());

    analemma.hour(15);
    analemma();
    analemmaXs.push(analemma.xsMerged());
    analemmaYs.push(analemma.ysMerged());

    analemma.hour(16);
    analemma();
    analemmaXs.push(analemma.xsMerged());
    analemmaYs.push(analemma.ysMerged());

    analemma.hour(17);
    analemma();
    analemmaXs.push(analemma.xsMerged());
    analemmaYs.push(analemma.ysMerged());

    analemma.hour(18);
    analemma();
    analemmaXs.push(analemma.xsMerged());
    analemmaYs.push(analemma.ysMerged());

    analemma.hour(19);
    analemma();
    analemmaXs.push(analemma.xsMerged());
    analemmaYs.push(analemma.ysMerged());

    analemma.hour(20);
    analemma();
    analemmaXs.push(analemma.xsMerged());
    analemmaYs.push(analemma.ysMerged());

    const sunPath = d3SolarLib
      .SunPathGenerator()
      .yearData(yearDataGen.data())
      .period(d3SolarLib.AllPeriods.Dec);

    sunPath();
    sunPathsXs.push(sunPath.xs());
    sunPathsYs.push(sunPath.ys());

    sunPath.period(d3SolarLib.AllPeriods.JanNov);
    sunPath();
    sunPathsXs.push(sunPath.xs());
    sunPathsYs.push(sunPath.ys());

    sunPath.period(d3SolarLib.AllPeriods.FebOct);
    sunPath();
    sunPathsXs.push(sunPath.xs());
    sunPathsYs.push(sunPath.ys());

    sunPath.period(d3SolarLib.AllPeriods.MarSept);
    sunPath();
    sunPathsXs.push(sunPath.xs());
    sunPathsYs.push(sunPath.ys());

    sunPath.period(d3SolarLib.AllPeriods.AprAug);
    sunPath();
    sunPathsXs.push(sunPath.xs());
    sunPathsYs.push(sunPath.ys());

    sunPath.period(d3SolarLib.AllPeriods.MayJul);
    sunPath();
    sunPathsXs.push(sunPath.xs());
    sunPathsYs.push(sunPath.ys());

    sunPath.period(d3SolarLib.AllPeriods.Jun);
    sunPath();
    sunPathsXs.push(sunPath.xs());
    sunPathsYs.push(sunPath.ys());

    const shadeRegionGenerator = d3SolarLib
      .ShadeRegionGenerator()
      .sunpathXs(sunPathsXs)
      .sunpathYs(sunPathsYs);

    shadeRegionGenerator();

    this.container = new d3PlotLib.CContainer();
    this.container.addPlot(new d3PlotLib.CLines());
    this.container.addPlot(new d3PlotLib.CLines());
    this.container.addPlot(new d3PlotLib.CCircles());
  }

  update(newModel: tPowerRouter) {
    const location = [54.9783, 1.6174];
    const { analemmaXs, analemmaYs, sunPathsXs, sunPathsYs } = this;
    const { sunPathContainer, data, currentDataIdx } = newModel;

    const solaxDataElem = data[currentDataIdx];
    if (!solaxDataElem) {
      return;
    }

    const result = d3SolarLib.getSunAltitudeAzimuth(
      new Date(solaxDataElem.uploadTime),
      location[0],
      location[1]
    );

    const { azimuth, altitude } = result;
    const azimuthDegs = d3SolarLib.radiansToDegrees(azimuth);

    console.log('azimuth degs / altitude: ', azimuthDegs, altitude);

    // const { altitude, azimuth } = d3SolarLib.getSunLocation(
    //   location,
    //   solaxDataElem.uploadTime
    // );
    // set the shape to be this...

    // type tLineAttrs = {
    //   stroke?: string;
    //   strokeOpacity?: number;
    //   fillColour?: string;
    //   fillOpacity?: number;
    //   opacity?: number;
    // };

    const analemmaYsAttrs = analemmaYs.map(
      () =>
        ({
          stroke: 'currentColor',
          fillColour: 'none',
          opacity: 0.5,
        } as d3PlotLib.tLineAttrs)
    );

    const sunPathYsAttrs = sunPathsYs.map(
      () =>
        ({
          stroke: 'red',
          fillColour: 'none',
          opacity: 0.5,
        } as d3PlotLib.tLineAttrs)
    );
    // console.log('analemma ys: ', analemmaYs, sunPathsYs);

    // if (!rangedData) {
    //   return;
    // }

    // const extent = d3.extent(
    //   rangedData,
    //   (elem) => dayjs(elem.uploadTime).toDate() as Date
    // );

    // const validExtent = [extent[0] ?? new Date(), extent[1] ?? new Date()] as [
    //   Date,
    //   Date
    // ];

    // const ys = rangedData.map((elem) => elem.yieldtoday);
    // const xs = rangedData.map((elem) => dayjs(elem.uploadTime).toDate());

    // push extra values on to arrays to create bottom right and bottom left points for fill
    // const bottomRightX = xs[xs.length - 1] ?? null;
    // const bottomLeftX = xs[0] ?? null;

    // if (bottomLeftX && bottomRightX) {
    //   xs.push(bottomRightX, bottomLeftX);
    //   ys.push(0, 0);
    // }

    this.container.attrs = {
      ...this.container.attrs,
      html: sunPathContainer,
      margins: {
        ...this.container.attrs.margins,
        top: 40,
        left: 30,
      },
      width: 400,
      height: 350,
      // yAxisLabel: 'Altitude (Radians)',
      yAxisProperties:
        this.container.axisLayout.topYAxisLabel('Altitude (Radians)'),
      xAxisLabel: 'Azimuth (Degrees)',
      onGetXScale: (chartWidth: number) =>
        d3.scaleLinear().domain([0, 350]).rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3.scaleLinear().domain([-0.1, 1.2]).rangeRound([chartHeight, 0]),
    } as d3PlotLib.tContainerAttrs;

    const analemma = this.container.getPlots()[0];
    analemma.attrs = {
      ...analemma.attrs,
      opacity: [0.5],
      lineAttrs: analemmaYsAttrs,
      xs: analemmaXs,
      ys: analemmaYs,
    } as d3PlotLib.tPlotAttrs;

    const sunpath = this.container.getPlots()[1];
    sunpath.attrs = {
      ...sunpath.attrs,
      opacity: [0.5],
      lineAttrs: sunPathYsAttrs,
      xs: sunPathsXs,
      ys: sunPathsYs,
    } as d3PlotLib.tPlotAttrs;

    const sun = this.container.getPlots()[2];
    sun.attrs = {
      ...sun.attrs,
      opacity: [0.5],
      radius: [5],
      lineAttrs: [
        {
          fillColour: 'currentColor',
        },
      ],
      xs: [[azimuthDegs]],
      ys: [[altitude]],
    } as d3PlotLib.tPlotAttrs;

    this.container.update();
  }
}

export { Chart };
