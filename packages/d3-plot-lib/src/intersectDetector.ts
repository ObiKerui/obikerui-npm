/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
import * as d3 from 'd3';
import rfdc from 'rfdc';
import { v4 as uuidv4 } from 'uuid';
import { tContainerAttrs } from './attributes/container';
import polygonAttributes from './attributes/polygon';
import AttrsGenerator from './generators/attributeGenerator';

type tCoordinate = [number, number];
type tPath = tCoordinate[];
type tLine = [tCoordinate, tCoordinate];
enum eResult {
  COLINEAR,
  PARALLEL,
  NONE,
  INTERSECTING,
}

type tResult = {
  type: eResult;
  point: null | { x: number; y: number };
};

const intersectDetectorAttrs = {
  currentCoordinates: null as unknown[] | null,
  newCoordinates: null as unknown[] | null,
  extractCoordinates: null as null | ((d: unknown[] | null) => tPath[]),
  currentLines: null as null | tLine[][],
  currentNewLines: null as null | tLine[][],
  intersections: [] as tResult[],
  freezeCurrentCoordinates: false as boolean,
  stopEarly: true as boolean,
};

function checkIntersection(lineA: tLine, lineB: tLine) {
  const toRet = {
    type: eResult.NONE as eResult,
    point: null as null | { x: number; y: number },
  };

  const [[x1, y1], [x2, y2]] = lineA;
  const [[x3, y3], [x4, y4]] = lineB;

  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  const numeA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
  const numeB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);

  //   console.log('denom / num a num b: ', denom, numeA, numeB);

  if (denom === 0) {
    if (numeA === 0 && numeB === 0) {
      toRet.type = eResult.COLINEAR;
      return toRet;
    }
    toRet.type = eResult.PARALLEL;
    return toRet;
  }

  const uA = numeA / denom;
  const uB = numeB / denom;

  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    toRet.type = eResult.INTERSECTING;
    toRet.point = {
      x: x1 + uA * (x2 - x1),
      y: y1 + uA * (y2 - y1),
    };
  }

  return toRet;
}

export default function () {
  const obj = rfdc()(intersectDetectorAttrs);

  function getLines(path: tPath) {
    const toRet = [] as tLine[];
    const iterations = path.length > 1 ? path.length - 1 : 0;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < iterations; i++) {
      const coordA = path[i];
      const coordB = path[i + 1];
      toRet.push([coordA, coordB]);
    }

    return toRet;
  }

  function updateLineData() {
    const {
      currentCoordinates,
      extractCoordinates,
      newCoordinates,
      freezeCurrentCoordinates,
    } = obj;
    let extracted = [] as tPath[];
    let extractedNew = [] as tPath[];

    if (extractCoordinates) {
      extracted = extractCoordinates(currentCoordinates);
      obj.currentLines = extracted.map((polygon) => getLines(polygon));

      extractedNew = extractCoordinates(newCoordinates);
      obj.currentNewLines = extractedNew.map((polygon) => getLines(polygon));
    }
  }

  function calculateIntersection() {
    const { currentLines, currentNewLines, stopEarly } = obj;
    const toRet = [] as tResult[];

    if (!currentNewLines || !currentLines) {
      return [];
    }

    for (let i = 0; i < currentNewLines.length; ++i) {
      const currentNewLine = currentNewLines[i];

      for (let j = 0; j < currentNewLine.length; ++j) {
        const currentNewLineElem = currentNewLine[j];

        for (let k = 0; k < currentLines.length; ++k) {
          const currentLine = currentLines[k];

          for (let l = 0; l < currentLine.length; l++) {
            const currentLineElem = currentLine[l];
            const result = checkIntersection(
              currentNewLineElem,
              currentLineElem
            );
            if (result.type === eResult.INTERSECTING) {
              toRet.push(result);
            }
            if (stopEarly && result.type === eResult.INTERSECTING) {
              return toRet;
            }
          }
        }
      }
    }

    return toRet;
  }

  function toExport() {
    updateLineData();
    obj.intersections = calculateIntersection();
  }

  const chart = toExport;

  const attrsGen = AttrsGenerator();
  attrsGen.attachTo(obj);
  attrsGen.setterReturnValue(toExport);

  toExport.coordinates = function (coords: any, extractor: any) {
    if (coords) obj.currentCoordinates = coords;
    if (extractor) obj.extractCoordinates = extractor;

    if (arguments.length) {
      return toExport;
    }
    return coords;
  };

  toExport.newCoordinates = attrsGen('newCoordinates');
  toExport.intersections = attrsGen('intersections');
  toExport.freezeCurrentCoordinates = attrsGen('freezeCurrentCoordinates');
  toExport.stopEarly = attrsGen('stopEarly');

  return chart;
}
