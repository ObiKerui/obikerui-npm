/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import * as d3Geo from 'd3-geo';
import L from 'leaflet';
import { tContainerAttrs } from '../sharedTypes';
import { PlotBase } from './PlotBase';

class CMapLayer extends PlotBase {
  getPathCreator(states: any, container: tContainerAttrs) {
    // how it's done in the book example...
    const projection = d3Geo.geoMercator();
    const pathCreator = d3Geo.geoPath().projection(projection);
    const width = container.chartWidth;
    const height = container.chartHeight;

    // Setup the scale and translate
    // const translatePos = [39.0997, 94.5786] as [number, number];
    const translatePos = [0, 0] as [number, number];
    projection.scale(1).translate(translatePos);
    const geographicBounds = pathCreator.bounds(states);

    console.log('geo bounds: ', geographicBounds);

    const leftBottom = geographicBounds[0];
    const minLongitude = leftBottom[0];
    const minLatitude = leftBottom[1];

    const rightTop = geographicBounds[1];
    const maxLongitude = rightTop[0];
    const maxLatitude = rightTop[1];

    const scaledWidth = (maxLongitude - minLongitude) / width;
    const scaledHeight = (maxLatitude - minLatitude) / height;
    const scaler = 1.0 / Math.max(scaledWidth, scaledHeight);

    let widthScale = scaler * (maxLongitude + minLongitude);
    widthScale = (width - widthScale) / 2.0;

    let heightScale = scaler * (maxLatitude + minLatitude);
    heightScale = (height - heightScale) / 2.0;

    // TODO Need to understand why this doesn't work but above does work!
    // const halfWidth = (maxLongitude - minLongitude) / 2
    // const halfHeight = (maxLatitude - minLatitude) / 2
    // const scaledHalfWidth = scaler * halfWidth
    // const scaledHalfHeight = scaler * halfHeight
    // const subWidth = width - scaledHalfWidth
    // const subHeight = height - scaledHalfHeight

    // console.log('scaled hw versus width scale: ', scaledHalfWidth, widthScale)
    // console.log('translate width a b ', widthScale, subWidth)
    // console.log('add and sub bounds long + - ', (maxLongitude + minLongitude), (maxLongitude - minLongitude))
    // console.log('translate height a b ', heightScale, subHeight)

    // const translator = [widthScale, heightScale]
    // const translator = [subWidth, subHeight]
    // var translator = [(width - scaler * (geographicBounds[1][0] + geographicBounds[0][0])) / 2, (height - scaler * (geographicBounds[1][1] + geographicBounds[0][1])) / 2];

    projection.scale(scaler).translate([widthScale, heightScale]);

    console.log(
      'width/height scale: ',
      widthScale,
      heightScale,
      maxLatitude,
      minLatitude
    );

    return pathCreator;
  }

  draw(container: tContainerAttrs) {
    const { attrs } = this;
    const { svg } = container;

    if (!svg) {
      return;
    }

    const { geojson } = attrs;
    if (!geojson) {
      return;
    }
    // let zoomLevel: number = _container.getZoom()

    const pathCreator = this.getPathCreator(geojson, container);
    // const pathCreator = container.projector;

    const styling = `
      stroke: Brown;
      stroke-opacity: .2;
      stroke-width: 1px;
      fill-opacity: .1;
      fill: green
    `;

    const mapGroup = svg.select(`.${attrs.plotID}`);

    // function handleZoom(a: any, b: any, e: any) {
    //   mapGroup.attr('transform', d3.event.transform)
    // }

    // let zoom = d3.zoom().on('zoom', handleZoom)
    // console.log('what is map group here: ', mapGroup)
    // mapGroup.call(zoom)

    // console.log('draw data called: ', svg, mapGroup, geojson)

    // select all rect in svg.chart-group with the class bar

    console.log('what is geojson to may layer: ', geojson);

    let boundaries = mapGroup
      .selectAll('.boundary')
      .data((geojson as any).features);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    boundaries.exit().style('opacity', 0).remove();

    // Enter - add the shapes to this data point
    const enterGroup = boundaries
      .enter()
      .append('path')
      .classed('boundary', true);

    // join the new data points with existing
    boundaries = boundaries.merge(enterGroup as any);

    boundaries
      .attr('d', (features: any) => {
        const param = features;
        const result = pathCreator(param);
        return result;
      })
      .attr(
        'style',
        (_elem: any) =>
          // if (attrs.onStyle) {
          //   return obj.onStyle({ elem });
          // }
          styling
      );
  }
}

export { CMapLayer };
