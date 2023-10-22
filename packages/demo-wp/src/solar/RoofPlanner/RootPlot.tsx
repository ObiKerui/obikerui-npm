/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3PlotLib from '@obikerui/d3-plot-lib';
import * as d3SolarLib from '@obikerui/d3-solar-lib';
import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import { debounce, throttle } from 'throttle-debounce';

type tGeometryCallbacks = {
  onClickCallback: CallableFunction;
  onFillCallback: CallableFunction;
  onSetShowPlacerCallback: CallableFunction;
  onMovePlacerCallback: CallableFunction;
  //   onEnterCallback: CallableFunction;
  //   onLeaveCallback: CallableFunction;
};

type tSurface = {
  id: string;
  angle: number;
  orientation: number;
  coordinates: number[][];
};

type tBoundary = {
  id: string;
  coordinates: number[][];
};

type tPanel = {
  id: string;
  coordinates: number[][];
};

type tObstruction = {
  id: string;
  coordinates: number[][];
};

type tGeometry = {
  property: string;
  surfaces: tSurface[];
  boundaries: tBoundary[];
  newPanel: tPanel[];
  obstructions: tObstruction[];
};

type tTransformCoordsParams = {
  transform: [number, number];
  prevPolyPos: tPanel[];
};

const getTransformedCoords = ({
  transform,
  prevPolyPos,
}: tTransformCoordsParams) => {
  const newPolyPos = prevPolyPos.map((elem) => {
    const coords = elem.coordinates;
    const transformedcoords = coords.map((cds) => {
      const tx = cds[0] + transform[0];
      const ty = cds[1] + transform[1];
      return [tx, ty];
    });
    return { ...elem, coordinates: transformedcoords };
  });
  return newPolyPos;
};

const createPlot = (
  ref: HTMLDivElement,
  data: tGeometry,
  width: number,
  callbacks: tGeometryCallbacks
) => {
  const roofCoords = d3PlotLib.Polygon() as any;
  roofCoords
    .coordinates(data.surfaces)
    .onMouseDown((d: any) => {
      callbacks.onClickCallback(d);
    })
    .onSetAttrs((lines: any) => {
      callbacks.onFillCallback(lines);
    });

  const boundaries = d3PlotLib.Polygon() as any;
  boundaries.coordinates(data.boundaries);

  const obstructions = d3PlotLib.Polygon() as any;
  obstructions.coordinates(data.obstructions);

  const tracking = d3PlotLib.TrackingPolygon() as any;
  tracking.coordinates(data.newPanel).hidden(false);

  const container = d3PlotLib
    .Container()
    .width(width)
    .margins({
      top: 8,
      left: 8,
      right: 8,
      bottom: 8,
    })
    // .xAxisShow(false)
    // .xGridShow(false)
    // .yAxisShow(false)
    // .yGridShow(false)
    .showMargins(true)
    .plot(roofCoords)
    .plot(boundaries)
    .plot(tracking)
    .plot(obstructions)
    .onGetXScale((chartWidth: number) =>
      d3.scaleLinear().domain([0, 100]).range([0, chartWidth])
    )
    .onGetYScale((chartHeight: number) =>
      d3.scaleLinear().domain([0, 100]).range([0, chartHeight])
    )
    .html(ref);

  container();

  const intersectDetect = d3PlotLib.IntersectDetector() as any;
  intersectDetect
    .currentCoordinates([...data.boundaries, ...data.obstructions])
    .extractCoordinates((d: unknown[] | null) => {
      if (!d) {
        return [];
      }
      const coordObjs = d as { id: string; coordinates: [number, number][] }[];
      return coordObjs.map((elem) => elem.coordinates);
    });

  const newPanelLocation = container.plot(2);

  const bounds = container.plot(1);
  bounds.onMove(
    (_d: unknown, mousePos: [number, number], _chartPos: [number, number]) => {
      const dimensions = newPanelLocation.dimensions();
      newPanelLocation.setRenderPoint(
        (current: d3.Selection<d3.BaseType, any, null, undefined>) => {
          const newX = mousePos[0] - dimensions[0] / 2.0; // got this from the bbox width of the new panel loc
          const newY = mousePos[1] - dimensions[1] / 2.0; // got this from the bbox height of the new panel loc
          current.attr('transform', `translate(${newX},${newY})`);
        }
      );

      // get the position of the newPanelLocation
      const transform = newPanelLocation.transform() as [number, number] | null;
      if (!transform) {
        return;
      }

      const newPolyPos = getTransformedCoords({
        transform,
        prevPolyPos: data.newPanel,
      });

      intersectDetect.newCoordinates(newPolyPos);
      intersectDetect();

      const intersections = intersectDetect.intersections() as unknown[];

      newPanelLocation.onSetAttrs((lines: any) => {
        if (intersections.length > 0) {
          lines.attr('stroke', () => `rgba(0, 0, 0, 0.1)`);
        } else {
          lines.attr('stroke', () => `rgba(0, 0, 0, 1)`);
        }
      });

      container();
    }
  );
  bounds.onEnter(() => {
    newPanelLocation.hidden(false);
    container();
  });

  bounds.onLeave(() => {
    newPanelLocation.hidden(true);
    container();
  });

  return container;
};

type tUpdateParams = {
  showNewPanel: boolean;
  renderPosition: [number, number];
};

const updatePlot = (_container: any, _updateParams: tUpdateParams) => {
  //   const newPanelPlacer = container.plot(2);
  //   newPanelPlacer
  //     // .hidden(false)
  //     .setRenderPoint(
  //       (current: d3.Selection<d3.BaseType, any, null, undefined>) => {
  //         const newX = updateParams.renderPosition[0];
  //         const newY = updateParams.renderPosition[1];
  //         current.attr('transform', `translate(${newX},${newY})`);
  //       }
  //     );
  //   container();
};

function RoofPlanner() {
  const ref = useRef<HTMLDivElement | null>(null);
  const container = useRef<unknown>(null);
  const [geometry, setGeometry] = useState<tGeometry | null>(null);
  const [placeArray, setPlaceArray] = useState<boolean>(false);

  const onClickCallback = () => {};

  const onFillCallback = (_lines: any) => {};

  const onSetShowPlacerCallback = (_showIt: boolean) => {};

  const onMovePlacerCallback = (_pos: [number, number]) => {};

  useEffect(() => {
    const loadGeometry = async () => {
      const geometryJson = (await d3.json('assets/testRoof.json')) as tGeometry;
      setGeometry(geometryJson);
    };
    if (!geometry) {
      loadGeometry().catch(console.error);
    }
  }, [geometry]);

  useEffect(() => {
    if (!container.current && ref.current && geometry) {
      const width = 800;
      container.current = createPlot(ref.current, geometry, width, {
        onClickCallback,
        onFillCallback,
        onSetShowPlacerCallback,
        onMovePlacerCallback,
      });
    } else if (container.current && geometry) {
      //   updatePlot(container.current, updateParams);
    }
  }, [geometry]);

  if (!geometry) {
    return (
      <div className="flex h-[500px] w-[700px] items-center justify-center bg-gray-300 align-middle">
        <span className="loading loading-ring loading-lg" />
      </div>
    );
  }

  const placeArrayClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setPlaceArray((curr) => !curr);
  };

  //   return <div className="flex flex-grow" ref={ref} />;
  return (
    <div>
      <div className="flex flex-row gap-2">
        <div ref={ref} />
        <div>
          <button
            type="button"
            className="btn rounded-sm bg-slate-200 p-2"
            onClick={(event) => placeArrayClick(event)}
          >
            place array
          </button>
          {JSON.stringify(placeArray)}
          {/* {JSON.stringify(showPlacer)} */}
        </div>
      </div>
    </div>
  );
}

export default RoofPlanner;
