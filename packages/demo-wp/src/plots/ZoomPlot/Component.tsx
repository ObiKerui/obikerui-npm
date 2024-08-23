/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Plot } from './Plot';
import { DataGrouper, LineData, tData, useChartData } from './DataGrouper';
import { cn } from '../../Utils/CSS';

const plot = new Plot();
const grouper = new DataGrouper();

useChartData.subscribe((newState) => {
  plot.update(newState);
});

function Options() {
  const { quarter, setQuarter } = useChartData();

  return (
    <div className="flex gap-1">
      <button
        type="button"
        className={cn('btn btn-sm', {
          'btn-active': quarter === 'JanMar',
        })}
        onClick={() => setQuarter('JanMar')}
      >
        Jan to March
      </button>
      <button
        type="button"
        className={cn('btn btn-sm', {
          'btn-active': quarter === 'AprJune',
        })}
        onClick={() => setQuarter('AprJune')}
      >
        April to June
      </button>
      <button
        type="button"
        className={cn('btn btn-sm', {
          'btn-active': quarter === 'JulSept',
        })}
        onClick={() => setQuarter('JulSept')}
      >
        July to Sept
      </button>
      <button
        type="button"
        className={cn('btn btn-sm', {
          'btn-active': quarter === 'OctDec',
        })}
        onClick={() => setQuarter('OctDec')}
      >
        Oct to December
      </button>
    </div>
  );
}

// const stackedPlotInst = new StackedPlotObj();
// const grouper = new DataGrouper();
// const lineData = new LineData();

// useChartData.subscribe((newState) => {
//   stackedPlotInst.update(newState);
// });

function ZoomPlot() {
  const overviewRef = useRef<HTMLDivElement | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);
  const {
    dataSeries,
    setDataSeries,
    quarter,
    setGroupedData,
    setOverviewRef,
    setDetailRef,
  } = useChartData();

  useEffect(() => {
    let grouped = null;

    switch (quarter) {
      case 'JanMar':
        grouped = grouper.groupByJanMarch(dataSeries);
        break;
      case 'AprJune':
        grouped = grouper.groupByAprJune(dataSeries);
        break;
      case 'JulSept':
        grouped = grouper.groupByJulSept(dataSeries);
        break;
      case 'OctDec':
        grouped = grouper.groupByOctDec(dataSeries);
        break;
      default:
        break;
    }

    if (!grouped) return;
    setGroupedData(grouped);
  }, [quarter, dataSeries]);

  useEffect(() => {
    async function loadData() {
      const jsonData = (await d3.json(
        './assets/ConsumptionData/output.json'
      )) as unknown[];
      // const cutoff = Math.floor(
      //   jsonData.length > 90 ? 90 : jsonData.length - 1
      // );

      // const firstMonth = jsonData.slice(0, cutoff);
      setDataSeries(jsonData as tData[]);
    }

    loadData().catch(console.error);
  }, []);

  useEffect(() => {
    setOverviewRef(overviewRef.current);
  }, [overviewRef.current]);

  useEffect(() => {
    setDetailRef(detailRef.current);
  }, [detailRef.current]);

  return (
    <div>
      <span>Zoomable Plot</span>
      <Options />
      <div ref={detailRef} />
      <div ref={overviewRef} />
    </div>
  );
}

export { ZoomPlot };
