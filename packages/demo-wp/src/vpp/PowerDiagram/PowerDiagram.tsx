// import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useSearchParams } from 'react-router-dom';
import { usePowerRouter } from '../Solax/Store';
import { tNode, tPowerNodeID, tSolaxData } from '../Solax/Types';
import { PowerRouter } from './PowerRouter';
import { ChartContainer as BatteryChart } from './BatteryChart/ChartContainer';
import { Controls } from './BatteryChart/Controls';
import { ChartContainer as PVChart } from './PVChart/ChartContainer';
import { Controls as PVControls } from './PVChart/Controls';
import { ChartContainer as GridChart } from './GridChart/ChartContainer';
import { Controls as GridControls } from './GridChart/Controls';
import { ChartContainer as LoadChart } from './LoadChart/ChartContainer';
import { Controls as LoadControls } from './LoadChart/Controls';
import { ChartContainer as MergeChart } from './MergedChart/ChartContainer';
import { VisibilityControls } from './MergedChart/Controls';

const powerRouterObj = new PowerRouter();

usePowerRouter.subscribe((newModel) => {
  powerRouterObj.update(newModel);
});

type tJsonResultObject = {
  [key: string]: unknown;
};

type tJsonObject = {
  result: tJsonResultObject;
};

async function loadData() {
  const response = await d3.json<tJsonObject[]>(
    'assets/PowerRouter/solaxTestOutput.json'
  );
  const mapped = response?.map((elem) => elem.result as tSolaxData);
  return mapped ?? [];
}

function updateNodes(nodes: Map<tPowerNodeID, tNode>, data: tSolaxData[]) {
  if (data.length === 0) return nodes;
  const lastElem = data[data.length - 1];

  const battery = nodes.get('battery');
  if (battery) {
    // battery.powerLevel = lastElem.soc;
    battery.labels[1].text = `${lastElem.soc.toFixed(0)}%`;
  }

  const pv = nodes.get('pv');
  if (pv) {
    // pv.powerLevel = lastElem.yieldtoday;
    pv.labels[1].text = `${lastElem.yieldtoday.toFixed(2)}kwH`;
  }

  const grid = nodes.get('grid');
  if (grid) {
    // grid.powerLevel = lastElem.feedinenergy;
    grid.labels[1].text = `${lastElem.feedinenergy.toFixed(2)}kwH`;
  }

  const load = nodes.get('load');
  if (load) {
    // load.powerLevel = lastElem.consumeenergy;
    load.labels[1].text = `${lastElem.consumeenergy.toFixed(2)}kwH`;
  }

  return nodes;
}

function PowerDiagram() {
  const diagramRef = useRef<HTMLDivElement | null>(null);
  const { setData, setContainer, nodes, setNodes, data, setProfile, focus } =
    usePowerRouter();
  const [searchParams, setSearchParams] = useSearchParams({
    detail: 'battery',
    timeFrame: 'days',
  });

  const currTheme = searchParams.get('theme');

  useEffect(() => {
    loadData()
      .then((loadedData) => setData(loadedData))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setContainer(diagramRef.current);
  }, []);

  useEffect(() => {
    const updatedNodes = updateNodes(nodes, data);
    setNodes(updatedNodes);
  }, [data]);

  useEffect(() => {
    setProfile(currTheme as 'light' | 'dark' | null);
  }, [currTheme]);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        prev.set('detail', `${focus}`);
        return prev;
      },
      {
        replace: true,
      }
    );
  }, [focus]);

  return (
    <div className="flex flex-col gap-2">
      <div ref={diagramRef} />
      <div className="flex flex-row gap-2">
        <MergeChart />
        <VisibilityControls />
      </div>

      <div className="flex flex-col">
        {focus === 'battery' && (
          <div>
            <Controls />
            <BatteryChart />
          </div>
        )}
        {focus === 'pv' && (
          <div>
            <PVControls />
            <PVChart />
          </div>
        )}
        {focus === 'grid' && (
          <div>
            <GridControls />
            <GridChart />
          </div>
        )}
        {focus === 'load' && (
          <div>
            <LoadControls />
            <LoadChart />
          </div>
        )}
      </div>
    </div>
  );
}

export { PowerDiagram };
