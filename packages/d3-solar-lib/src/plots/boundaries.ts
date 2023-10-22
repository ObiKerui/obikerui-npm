import * as d3PlotLib from '@obikerui/d3-plot-lib';

export default function Boundaries() {
  const polygons = d3PlotLib.Polygon();

  function toExport(_container: d3PlotLib.tContainerAttrs) {
    polygons(_container);
  }

  const chart = toExport;

  // const attrsGen = d3PlotLib.AttrsGenerator();
  // attrsGen.attachTo(obj);
  // attrsGen.setterReturnValue(toExport);

  toExport.coordinates = polygons.coordinates;
  //   toExport.onEnter = polygons.onEnter;
  //   toExport.onLeave = polygons.onLeave;
  //   toExport.onSetAttrs = polygons.onSetAttrs;
  //   toExport.onMouseDown = polygons.onMouseDown;
  //   toExport.onMove = polygons.onMove;

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
