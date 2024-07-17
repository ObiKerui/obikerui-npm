/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import * as d3Hexbin from 'd3-hexbin';
import { tContainerAttrs } from '../sharedTypes';
import { PlotBase } from './PlotBase';

// function getPointGrid(container: tContainerAttrs, cols: number) {
//     const width = container.mapWidth;
//     const height = container.mapHeight;

//     const hexDistance = width / cols;
//     const rows = Math.floor(height / hexDistance);
//     // const hexRadius = hexDistance / 1.5
//     // console.log('get point grid stuff: ', width, height, hexDistance, rows, hexRadius)

//     const rangeOfValues = d3.range(rows * cols);
//     const mapped = rangeOfValues.map((_elem: any, i: number) => {
//       const x = Math.floor((i % cols) * hexDistance);
//       const y = Math.floor(i / cols) * hexDistance;
//       return {
//         x,
//         y,
//         datapoint: 0,
//       };
//     });
//     return mapped;
//   }

//   function transformDataPoints(rawData: any[], projection: any) {
//     const mapped = rawData.map((el: any) => {
//       const coords = projection([+el.lng, +el.lat]);
//       const mappedElem = {
//         x: coords[0],
//         y: coords[1],
//         datapoint: 1,
//         name: el.MarketName,
//         state: el.State,
//         city: el.city,
//         url: el.Website,
//       };
//       return mappedElem;
//     });
//     return mapped;
//   }

//   function rollupHexData(data: any[]) {
//     let maxLength = 0;
//     const rolledUpData: any[] = [];
//     data.forEach((elem: any) => {
//       const newElem: any[] = [];
//       elem.forEach((innerElem: any) => {
//         const isDataPoint = innerElem.datapoint === 1;
//         if (isDataPoint) {
//           newElem.push(innerElem);
//         }
//       });
//       const newEntry = {
//         x: elem.x,
//         y: elem.y,
//         data: newElem,
//       };
//       rolledUpData.push(newEntry);

//       maxLength = newElem.length > maxLength ? newElem.length : maxLength;
//     });
//     // console.log('rolled up data: ', rolledUpData)
//     return {
//       rolledUpData,
//       maxLength,
//     };
//   }

//   function drawData(container: tContainerAttrs) {
//     const { svg } = container;
//     if (!svg) {
//       return;
//     }

//     const { geojson, data } = obj;
//     const pathCreator = container.projector;
//     const projection = pathCreator.projection();
//     // let zoomLevel: number = _container.getZoom()

//     // const styling = {
//     //   'stroke': 'Brown',
//     //   'stroke-opacity': '.2',
//     //   'stroke-width': '1px',
//     //   'fill-opacity': '.1',
//     //   'fill' : 'green'
//     // }

//     const mapGroup = svg.select(`.${obj.plotID}`);

//     // convert lat/long to projected points in map
//     const polygonCoords = (geojson as any).features[0].geometry.coordinates[0][0];
//     const polygonPoints = polygonCoords.map((elem: any) => projection(elem));

//     // filter out points outside of the point-grid
//     const pointGrid = getPointGrid(container, 160);
//     const pointsInPolygon = pointGrid.filter((elem: any) =>
//       d3.polygonContains(polygonPoints, [elem.x, elem.y])
//     );

//     const dataPointsTransformed: any[] = transformDataPoints(data, projection);

//     const allPoints = pointsInPolygon.concat(dataPointsTransformed);

//     // temp for now
//     const exponent = 10;

//     const hexBin = d3Hexbin
//       .hexbin<unknown>()
//       // .radius(3.5)
//       .radius(4)
//       .x((d: any) => d.x)
//       .y((d: any) => d.y);

//     const hexPoints = hexBin(allPoints);
//     const { rolledUpData, maxLength } = rollupHexData(hexPoints);

//     const colorScale = d3
//       .scaleSequential((t: any) => {
//         const tNew = t ** exponent;
//         return d3.interpolateViridis(tNew);
//       })
//       .domain([maxLength, 1]);

//     // const radiusScale = d3.scaleSqrt().domain([0, maxLength]).range([3.5, 15])

//     let hexGroup = mapGroup.selectAll('.hexes').data(rolledUpData);

//     hexGroup.exit().style('opacity', 0).remove();

//     const enterGroup = hexGroup.enter().append('path').classed('hexes', true);

//     hexGroup = enterGroup.merge(hexGroup as any) as any;

//     hexGroup
//       .attr(
//         'transform',
//         (d: any) =>
//           // console.log('what is d in the hex drawing grid: ', d)
//           `translate(${d.x}, ${d.y})`
//       )
//       .attr('d', () =>
//         // return hexBin.hexagon(radiusScale(d.data.length))
//         hexBin.hexagon()
//       )
//       .style('fill', (d: { data: unknown[] }) => {
//         const result = colorScale(d.data.length);
//         return result || 0;
//       })
//       .style('opacity', '0.8');
//   }

class CHexMask extends PlotBase {
  updatePointGrid(container: tContainerAttrs, nbrCols: number) {
    const width = container.chartWidth;
    const height = container.chartHeight;

    const hexDistance = width / (nbrCols ?? 1);
    const rows = Math.floor(height / hexDistance);

    const rangeOfValues = d3.range(rows * nbrCols);
    const mapped = rangeOfValues.map((_elem: number, i: number) => {
      const x = Math.floor((i % nbrCols) * hexDistance);
      const y = Math.floor(i / nbrCols) * hexDistance;
      return {
        x,
        y,
        datapoint: 0,
      };
    });
    return mapped;
  }

  getNewPathCreator() {
    const { zoom, position, centre, rotation, projectionType } = this.attrs;
    const projection = d3[`geo${projectionType}`]();
    const geoPath = d3.geoPath().projection(projection);

    projection
      .scale(zoom)
      // .translate([width / 2, height / 2])
      .translate(position)
      .center(centre)
      .rotate(rotation);

    return geoPath;
  }

  transformDataPoints(rawData: any[], projection: any) {
    const mapped = rawData.map((el: any) => {
      const coords = projection([+el.lng, +el.lat]);
      const mappedElem = {
        x: coords[0],
        y: coords[1],
        datapoint: 1,
        name: el.MarketName,
        state: el.State,
        city: el.city,
        url: el.Website,
      };
      return mappedElem;
    });
    return mapped;
  }

  // rollupHexData(data: any[]) {
  //   let maxLength = 0;
  //   const rolledUpData: any[] = [];
  //   data.forEach((elem: any) => {
  //     const newElem: any[] = [];
  //     elem.forEach((innerElem: any) => {
  //       const isDataPoint = innerElem.datapoint === 1;
  //       if (isDataPoint) {
  //         newElem.push(innerElem);
  //       }
  //     });
  //     const newEntry = {
  //       x: elem.x,
  //       y: elem.y,
  //       data: newElem,
  //     };
  //     rolledUpData.push(newEntry);

  //     maxLength = newElem.length > maxLength ? newElem.length : maxLength;
  //   });
  //   // console.log('rolled up data: ', rolledUpData)
  //   return {
  //     rolledUpData,
  //     maxLength,
  //   };
  // }

  draw(container: tContainerAttrs) {
    const { attrs } = this;
    const { svg } = container;

    if (!svg) {
      return;
    }

    const { geojson, radius, visible, onComputeColourScale } = attrs;

    if (!geojson || !geojson.features || geojson.features.length === 0) {
      return;
    }

    const pathCreator = this.getNewPathCreator();
    const pointGrid = this.updatePointGrid(container, 160);

    // TODO we need to generalise this part and pull out of the implmementation somehow!
    // this is a bit counter-intuitive given the topojson generated from the original shapefile from
    // the d3 maps book.
    // we converted that topojson using topojson-client, that gave us a structure where we have
    // a multi-polygon in the geometry of the first and only element of the geojson features array
    // the multipolygon is represented by an array of 431 coordinate pairs [number, number]

    const polygonCoords = (geojson as any).features[0].geometry
      .coordinates[0][0] as any;

    // now polyonCoords contains the 431 coordinate pairs that represent the US mainland.

    // convert those lat-long points to project them into the screen-space I guess?
    const polygonPoints = polygonCoords.map((elem: any) => {
      const geoPath = pathCreator.projection() as d3.GeoProjection;
      return geoPath(elem);
    });

    const pointsInPolygon = pointGrid.filter((elem: any) =>
      d3.polygonContains(polygonPoints, [elem.x, elem.y])
    );

    // const dataPointsTransformed: any[] = this.transformDataPoints(
    //   data,
    //   pathCreator.projection
    // );
    // const allPoints = pointsInPolygon.concat(dataPointsTransformed);
    const allPoints = pointsInPolygon.concat([]);

    const hexBin = d3Hexbin
      .hexbin<unknown>()
      .radius(radius)
      .x((d: any) => d.x)
      .y((d: any) => d.y);

    const hexPoints = hexBin(allPoints);
    const rolledUpData = hexPoints.map((elem) => ({
      x: elem.x,
      y: elem.y,
      value: 0,
    }));
    // const { rolledUpData } = this.rollupHexData(hexPoints);

    const dataExtent = d3.extent(rolledUpData, (d) => d.value) as [
      number,
      number
    ];

    let colourScale = d3
      .scaleSequential((t: any) => d3.interpolateViridis(t))
      .domain(dataExtent) as CallableFunction;

    if (onComputeColourScale) {
      colourScale = onComputeColourScale(dataExtent);
    }

    const mapGroup = svg.select<SVGGElement>(`.${attrs.plotID}`);

    let hexGroup = mapGroup.selectAll('.hexes').data(rolledUpData);

    hexGroup.exit().style('opacity', 0).remove();

    const enterGroup = hexGroup.enter().append('path').classed('hexes', true);

    hexGroup = enterGroup.merge(hexGroup as any) as any;

    hexGroup
      .attr('transform', (d: any) => `translate(${d.x}, ${d.y})`)
      .attr('d', () => hexBin.hexagon())
      .style('fill', (d) => {
        const result = colourScale(d.value);
        return result || 0;
      })
      .style('opacity', '0.8')
      .style('visibility', visible ? 'visible' : 'hidden');
  }
}

export { CHexMask };
