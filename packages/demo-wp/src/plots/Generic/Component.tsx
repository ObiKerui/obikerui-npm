import * as d3 from 'd3';
import { atom, getDefaultStore, useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { Codesandbox as CSBIcon } from '../../Utils/CodeSandboxLink';
import { DateGrouper } from './DateGrouper';
import { Metric, TimePeriods } from './Model';
import { Plot as BarPlotObj, tData, tModel } from './Plot';

const BarPlotAtom = atom<tModel>({
  chartRef: null,
  dataSeries: [],
  sorting: 'months',
  groupedData: [],
  metric: 'Avg Consumption',
});

const store = getDefaultStore();

const barPlotObj = new BarPlotObj();
const dayGrouper = new DateGrouper();

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

function Plot() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [barPlot, setBarPlot] = useAtom(BarPlotAtom);
  const { sorting, dataSeries } = barPlot;

  useEffect(() => {
    let grouped = null;
    const lastElem = dataSeries[dataSeries.length - 1] ?? null;
    if (!lastElem) return;
    const dayjsDate = dayjs(lastElem.date);

    switch (sorting) {
      case 'months':
        grouped = dayGrouper.truncate(
          dataSeries,
          dayjsDate.subtract(12, 'months'),
          dayjsDate
        );
        grouped = dayGrouper.group('months', grouped);
        break;
      case 'weeks':
        grouped = dayGrouper.truncate(
          dataSeries,
          dayjsDate.subtract(12, 'weeks'),
          dayjsDate
        );
        grouped = dayGrouper.group('weeks', grouped);
        break;
      case 'days':
        grouped = dayGrouper.truncate(
          dataSeries,
          dayjsDate.subtract(30, 'days'),
          dayjsDate
        );
        grouped = dayGrouper.group('days', grouped);
        break;
      case 'hours':
        grouped = dayGrouper.truncate(
          dataSeries,
          dayjsDate.subtract(48, 'hours'),
          dayjsDate
        );
        grouped = dayGrouper.group('hours', grouped);
        break;
      default:
        grouped = dayGrouper.group('months', dataSeries);
    }

    setBarPlot({
      ...barPlot,
      groupedData: grouped,
    });
  }, [sorting, dataSeries]);

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

export { Plot };
