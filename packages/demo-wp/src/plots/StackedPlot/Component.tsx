/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { atom, useAtom, useAtomValue } from 'jotai';
import { Plot as StackedPlotObj, tModel } from './Plot';
import { DataGrouper, tData } from './DataGrouper';
import { cn } from '../../Utils/CSS';

const buttonStateAtom = atom<string>('years');
const dataAtom = atom<tData[]>([]);

function Options() {
  const [buttonState, setButtonState] = useAtom(buttonStateAtom);

  return (
    <div className="flex gap-1">
      <button
        type="button"
        className={cn('btn btn-sm', {
          'btn-active': buttonState === 'years',
        })}
        onClick={() => setButtonState('years')}
      >
        by Year
      </button>
      <button
        type="button"
        className={cn('btn btn-sm', {
          'btn-active': buttonState === 'weeks',
        })}
        onClick={() => setButtonState('weeks')}
      >
        by Week
      </button>
      <button
        type="button"
        className={cn('btn btn-sm', {
          'btn-active': buttonState === 'days',
        })}
        onClick={() => setButtonState('days')}
      >
        by Day
      </button>
      <button
        type="button"
        className={cn('btn btn-sm', {
          'btn-active': buttonState === 'hours',
        })}
        onClick={() => setButtonState('hours')}
      >
        by Hour
      </button>
    </div>
  );
}

const stackedPlotInst = new StackedPlotObj();
const grouper = new DataGrouper();

function StackedPlot() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useAtom(dataAtom);
  const timeFrame = useAtomValue(buttonStateAtom);

  useEffect(() => {
    let grouped = null;
    switch (timeFrame) {
      case 'years':
        grouped = grouper.groupByMonths(data);
        break;
      case 'weeks':
        grouped = grouper.groupByWeeks(data);
        break;
      case 'days':
        grouped = grouper.groupByDays(data);
        break;
      case 'hours':
        grouped = grouper.groupByHours(data);
        break;
      default:
        grouped = grouper.groupByMonths(data);
    }
    const { model } = stackedPlotInst;
    const newModel = {
      ...model,
      container: ref.current,
      plotData: grouped.data,
      labels: grouped.labels,
      colours: grouped.colours,
      minMax: grouped.minMax,
      categories: grouped.categories,
    } as tModel;

    stackedPlotInst.update(newModel);
  }, [data, timeFrame]);

  useEffect(() => {
    async function loadData() {
      const jsonData = (await d3.json(
        './assets/ConsumptionData/output.json'
      )) as unknown[];
      setData(jsonData as tData[]);
    }

    loadData().catch(console.error);
  }, []);

  return (
    <div>
      <span>Stacked Plot</span>
      <Options />
      <div ref={ref} />
    </div>
  );
}

export { StackedPlot };
