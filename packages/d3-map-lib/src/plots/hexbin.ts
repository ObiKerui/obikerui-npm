/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import * as d3Hexbin from 'd3-hexbin';
import rfdc from 'rfdc';
import { tContainerAttrs } from '../attributes/container';
import plotAttributes from '../attributes/plot';
import AttrsGenerator from '../generators/attributeGenerator';
import plotSvgGenerator from '../generators/plotSvgGenerator';

export default function () {
  const obj = rfdc()(plotAttributes);

  // Building Blocks
  function buildContainerGroups(container: tContainerAttrs) {
    if (!obj || !container) {
      return;
    }
    const psvg = plotSvgGenerator() as any;
    psvg.plot(obj).container(container)();
  }

  function getPointGrid(container: tContainerAttrs, cols: number) {
    const width = container.mapWidth;
    const height = container.mapHeight;

    const hexDistance = width / cols;
    const rows = Math.floor(height / hexDistance);
    // const hexRadius = hexDistance / 1.5
    // console.log('get point grid stuff: ', width, height, hexDistance, rows, hexRadius)

    const rangeOfValues = d3.range(rows * cols);
    const mapped = rangeOfValues.map((_elem: any, i: number) => {
      const x = Math.floor((i % cols) * hexDistance);
      const y = Math.floor(i / cols) * hexDistance;
      return {
        x,
        y,
        datapoint: 0,
      };
    });
    return mapped;
  }

  function transformDataPoints(rawData: any[], projection: any) {
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

  function rollupHexData(data: any[]) {
    let maxLength = 0;
    const rolledUpData: any[] = [];
    data.forEach((elem: any) => {
      const newElem: any[] = [];
      elem.forEach((innerElem: any) => {
        const isDataPoint = innerElem.datapoint === 1;
        if (isDataPoint) {
          newElem.push(innerElem);
        }
      });
      const newEntry = {
        x: elem.x,
        y: elem.y,
        data: newElem,
      };
      rolledUpData.push(newEntry);

      maxLength = newElem.length > maxLength ? newElem.length : maxLength;
    });
    // console.log('rolled up data: ', rolledUpData)
    return {
      rolledUpData,
      maxLength,
    };
  }

  function drawData(container: tContainerAttrs) {
    const { svg } = container;
    if (!svg) {
      return;
    }

    const { geojson, data } = obj;
    const pathCreator = container.projector;
    const projection = pathCreator.projection();
    // let zoomLevel: number = _container.getZoom()

    // const styling = {
    //   'stroke': 'Brown',
    //   'stroke-opacity': '.2',
    //   'stroke-width': '1px',
    //   'fill-opacity': '.1',
    //   'fill' : 'green'
    // }

    const mapGroup = svg.select(`.${obj.plotID}`);

    // convert lat/long to projected points in map
    const polygonCoords = (geojson as any).features[0].geometry.coordinates[0][0];
    const polygonPoints = polygonCoords.map((elem: any) => projection(elem));

    // filter out points outside of the point-grid
    const pointGrid = getPointGrid(container, 160);
    const pointsInPolygon = pointGrid.filter((elem: any) =>
      d3.polygonContains(polygonPoints, [elem.x, elem.y])
    );

    const dataPointsTransformed: any[] = transformDataPoints(data, projection);

    const allPoints = pointsInPolygon.concat(dataPointsTransformed);

    // temp for now
    const exponent = 10;

    const hexBin = d3Hexbin
      .hexbin<unknown>()
      // .radius(3.5)
      .radius(4)
      .x((d: any) => d.x)
      .y((d: any) => d.y);

    const hexPoints = hexBin(allPoints);
    const { rolledUpData, maxLength } = rollupHexData(hexPoints);

    const colorScale = d3
      .scaleSequential((t: any) => {
        const tNew = t ** exponent;
        return d3.interpolateViridis(tNew);
      })
      .domain([maxLength, 1]);

    // const radiusScale = d3.scaleSqrt().domain([0, maxLength]).range([3.5, 15])

    let hexGroup = mapGroup.selectAll('.hexes').data(rolledUpData);

    hexGroup.exit().style('opacity', 0).remove();

    const enterGroup = hexGroup.enter().append('path').classed('hexes', true);

    hexGroup = enterGroup.merge(hexGroup as any) as any;

    hexGroup
      .attr(
        'transform',
        (d: any) =>
          // console.log('what is d in the hex drawing grid: ', d)
          `translate(${d.x}, ${d.y})`
      )
      .attr('d', () =>
        // return hexBin.hexagon(radiusScale(d.data.length))
        hexBin.hexagon()
      )
      .style('fill', (d: { data: unknown[] }) => {
        const result = colorScale(d.data.length);
        return result || 0;
      })
      .style('opacity', '0.8');
  }

  function toExport(container: tContainerAttrs) {
    buildContainerGroups(container);
    drawData(container);
  }

  const generateAccessor = AttrsGenerator();
  generateAccessor.attachTo(obj);
  generateAccessor.setterReturnValue(toExport);

  toExport.plotID = generateAccessor('plotID');
  toExport.geojson = generateAccessor('geojson');
  toExport.styles = generateAccessor('styles');

  return toExport;
}
