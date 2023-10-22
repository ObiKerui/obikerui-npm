import * as d3PlotLib from '@obikerui/d3-plot-lib';

export default function SolarArray() {
  const polygons = d3PlotLib.Polygon();

  function toExport(_container: d3PlotLib.tContainerAttrs) {
    polygons(_container);
  }

  const chart = toExport;

  // const attrsGen = d3PlotLib.AttrsGenerator();
  // attrsGen.attachTo(obj);
  // attrsGen.setterReturnValue(toExport);

  toExport.coordinates = polygons.coordinates;
  // toExport.labels = attrsGen('labels');
  // toExport.colours = attrsGen('colours');
  // toExport.tag = attrsGen('tag');
  // toExport.lineStyles = attrsGen('lineStyles');
  // toExport.onClick = attrsGen('onClick');
  // toExport.onMouseDown = attrsGen('onMouseDown');
  // toExport.onEnter = attrsGen('onEnter');
  // toExport.onLeave = attrsGen('onLeave');
  // toExport.onSetAttrs = attrsGen('onSetAttrs');

  return chart;
}
