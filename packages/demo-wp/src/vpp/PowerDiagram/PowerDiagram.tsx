// import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useSearchParams } from 'react-router-dom';
import { usePowerRouter } from '../Solax/Store';
import { tSolaxData } from '../Solax/Types';
import { PowerRouter } from './PowerRouter';
import { ChartContainer as BatteryChart } from './BatteryChart/ChartContainer';
import TimeControls from './Controls/Time';
import { ChartContainer as GridChart } from './GridChart/ChartContainer';
import { ChartContainer as MergeChart } from './MergedChart/ChartContainer';
import { ChartContainer as SunChart } from './SunChart/ChartContainer';
import VisibilityControls from './Controls/Visibility';
import { DataTest } from './DataTest/DataTest';
import { Inverter } from './InverterData/Inverter';
import WeatherInfo from './WeatherInfo';
import GridSummary from './GridChart/GridSummary';

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

const detailToVisMap = new Map<string | null, string>([
  ['inverter', 'pv,grid,load,battery'],
  ['pv', 'pv'],
  ['grid', 'grid'],
  ['load', 'load'],
  ['battery', 'battery'],
  [null, 'pv,grid,load,battery'],
]);

async function loadData() {
  const response = await d3.json<tJsonObject[]>(
    'assets/PowerRouter/solaxTestOutput.json'
  );
  const mapped = response?.map((elem) => elem.result as tSolaxData);
  return mapped ?? [];
}

function PowerDiagram() {
  const diagramRef = useRef<HTMLDivElement | null>(null);
  const { setData, setContainer, setProfile, focus } = usePowerRouter();
  const [searchParams, setSearchParams] = useSearchParams();

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
    setProfile(currTheme as 'light' | 'dark' | null);
  }, [currTheme]);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        prev.set('detail', `${focus}`);
        prev.set('visible', `${detailToVisMap.get(focus)}`);
        return prev;
      },
      {
        replace: true,
      }
    );
  }, [focus]);

  return (
    <div className="flex flex-row gap-2">
      <div className="flex flex-col">
        <WeatherInfo />
        <div ref={diagramRef} />
        <div className="flex flex-col gap-2">
          <DataTest />
          <SunChart />
        </div>
      </div>
      {/* <div className="flex flex-col gap-2">
        <div>
          <TimeControls />
        </div>
        <div className="flex flex-row gap-2">
          <MergeChart />
          <VisibilityControls />
        </div>
        {focus === 'battery' && (
          <div>
            <BatteryChart />
          </div>
        )}
        {focus === 'grid' && (
          <div>
            <GridChart />
            <GridSummary />
          </div>
        )}
        {focus === 'inverter' && (
          <div>
            <Inverter />
          </div>
        )}
      </div> */}
    </div>
  );
}

export { PowerDiagram };
