import * as d3 from 'd3';

type tSelection = d3.Selection<SVGGElement, unknown, SVGGElement, unknown>;

async function importSVG(filepath: string) {
  const xml = await d3.xml(filepath);
  const importedNode = document.importNode(xml.documentElement, true);
  return importedNode;
  // Load the external SVG file
  // d3.xml(filepath).then(function(xml) {
  //     // Get the root element of the loaded SVG
  //     const importedNode = document.importNode(xml.documentElement, true);

  //     // Append the imported SVG to the main SVG
  //     // mainSvg.node().appendChild(importedNode);
  //     return importedNode;
  // }
}

function appendToElement<T>(
  parent: d3.Selection<SVGGElement, T, SVGGElement, unknown>,
  svg: HTMLElement
) {
  const parentNode = parent.node();
  if (!parentNode) {
    throw new Error('cannot append to null element: ');
  }
  return parentNode.appendChild(svg);
}

export { importSVG, appendToElement };
