import * as d3 from 'd3';
import dayjs, { ManipulateType } from 'dayjs';
import { atom, getDefaultStore, useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { Codesandbox as CSBIcon } from '../../Utils/CodeSandboxLink';
import { DayjsGrouper } from './DateGrouper';
import { Metric, TimePeriods, tData, tModel, tPeriod } from './Model';
import { BarPlot as BarPlotObj } from './Plot';

const dayJSGrouper = new DayjsGrouper<tData>();

type tValue = {
  period: number;
  unit: ManipulateType;
};

const map = new Map<tPeriod, tValue>([
  ['months', { period: 12, unit: 'month' }],
  ['weeks', { period: 3, unit: 'months' }],
  ['days', { period: 1, unit: 'months' }],
  ['hours', { period: 24, unit: 'hours' }],
]);

const BarPlotAtom = atom<tModel>({
  chartRef: null,
  dataSeries: [],
  sorting: 'months',
  groupedData: [],
  metric: 'Avg Consumption',
});

const store = getDefaultStore();

const barPlotObj = new BarPlotObj();

store.sub(BarPlotAtom, () => {
  const newState = store.get(BarPlotAtom);
  barPlotObj.update(newState);
});

function Controls() {
  const [barPlotData, setBarPlotData] = useAtom(BarPlotAtom);

  const setTime = (value: string) => {
    setBarPlotData(
      (prev) =>
        ({
          ...prev,
          sorting: value,
        } as tModel)
    );
  };

  const setMetric = (value: string) => {
    setBarPlotData(
      (prev) =>
        ({
          ...prev,
          metric: value,
        } as tModel)
    );
  };

  return (
    <div>
      <div className="flex flex-row">
        <details className="dropdown">
          <summary className="btn m-1">{barPlotData.sorting}</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {TimePeriods.map((value, id) => (
              <li key={id}>
                <button type="button" onClick={() => setTime(value)}>
                  {value}
                </button>
              </li>
            ))}
          </ul>
        </details>
        <details className="dropdown">
          <summary className="btn m-1">{barPlotData.metric}</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {Metric.map((value, id) => (
              <li key={id}>
                <button type="button" onClick={() => setMetric(value)}>
                  {value}
                </button>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
}

function BarPlot() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [barPlot, setBarPlot] = useAtom(BarPlotAtom);
  const { sorting, dataSeries } = barPlot;

  useEffect(() => {
    let grouped = null;
    const lastElem = dataSeries[dataSeries.length - 1] ?? null;
    if (!lastElem) return;

    const dayjsDate = dayjs(lastElem.date);
    const value = map.get(sorting);
    if (!value) return;

    grouped = dayJSGrouper
      .setData(dataSeries)
      .truncate(dayjsDate.subtract(value.period, value.unit), dayjsDate)
      .group(sorting)
      .average()
      .getData();

    setBarPlot({
      ...barPlot,
      groupedData: grouped,
    });
  }, [dataSeries, sorting]);

  useEffect(() => {
    setBarPlot((prev) => ({
      ...prev,
      chartRef: ref.current,
    }));
  }, [ref.current]);

  useEffect(() => {
    async function loadData() {
      const data = (await d3.json(
        './assets/ConsumptionData/output.json'
      )) as tData[];
      setBarPlot((prev) => ({
        ...prev,
        dataSeries: data,
      }));
    }
    loadData().catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-lg font-bold">Bar Plot</h1>
      <Controls />
      <div className="flex gap-4">
        <div className="w-[800px]" ref={ref} />
      </div>
      <div>
        <a
          className="link"
          href="https://codesandbox.io/p/sandbox/angry-frog-rk34ym"
        >
          <span className="flex flex-row text-center align-middle">
            <CSBIcon />
            <span className="text-xl">Edit in Codesandbox</span>
          </span>
        </a>
      </div>
    </div>
  );
}

export { BarPlot };
