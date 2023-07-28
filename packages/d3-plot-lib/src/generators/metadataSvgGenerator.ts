/* eslint-disable @typescript-eslint/no-explicit-any */

import { tContainerAttrs } from '../attributes/container';
import { tMetadataAttrs } from '../attributes/metadata';

type tSelection = d3.Selection<SVGGElement, any, null, undefined>;

function metadataSvgGenerator() {
  let obj: tMetadataAttrs | null = null;
  let container: tContainerAttrs | null = null;
  let anchor: tSelection | null = null;

  function toExport() {
    if (!container || !obj) {
      return;
    }

    const { svg } = container;
    if (!svg) {
      return;
    }

    const chartGroup = svg.select('g.metadata-group');
    const children = chartGroup.selectAll('*');
    const existingElements = children.filter(`g.${obj.metadataID}`);

    if (existingElements.size() > 0) {
      return;
    }

    obj.index = children.size();
    obj.metadataID = `metadata-${obj.index}`;
    const group = chartGroup.append('g').classed(`${obj.metadataID}`, true);
    anchor = group;
  }

  toExport.metadata = function (_x: any) {
    if (arguments.length > 0) {
      obj = _x;
      return toExport;
    }
    return obj;
  };

  toExport.container = function (_x: any) {
    if (arguments.length > 0) {
      container = _x;
      return toExport;
    }
    return container;
  };

  toExport.anchor = function (_x: any) {
    if (arguments.length > 0) {
      anchor = _x;
      return toExport;
    }
    return anchor;
  };

  return toExport;
}

export default metadataSvgGenerator;
