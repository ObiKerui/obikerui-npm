/* eslint-disable class-methods-use-this */
import { tContainerAttrs, tMetadata } from '../sharedTypes';

class MetadataSVGGenerator {
  updateSVG(metadata: tMetadata, contAttrs: tContainerAttrs) {
    const { attrs: metadataAttrs } = metadata;

    const { svg } = contAttrs;
    if (!svg) {
      return;
    }

    const group = svg.select('g.metadata-group');
    const children = group.selectAll('*');
    const existingElements = children.filter(`g.${metadataAttrs.metadataID}`);

    if (existingElements.size() > 0) {
      return;
    }

    metadataAttrs.index = children.size();
    metadataAttrs.metadataID = `metadata-${metadataAttrs.index}`;
    metadataAttrs.clipPathID = metadataAttrs.metadataID;
    const anchor = group
      .append('g')
      .classed(`${metadataAttrs.metadataID}`, true)
      .append('g')
      .classed('anchor', true);

    anchor.append('rect').classed('background', true);
    anchor.append('g').classed('innermargin', true);
  }
}

export { MetadataSVGGenerator };
