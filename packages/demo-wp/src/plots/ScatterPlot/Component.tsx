import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { atom, useAtom, getDefaultStore } from 'jotai';
import rfdc from 'rfdc';
import { ScatterPlot as ScatterPlotObj } from './Plot';
import { cn } from '../../Utils/CSS';
import {
  tCSVElement,
  tModel,
  tSpeciesKey,
  MetricMap,
  SpeciesMap,
  tMetricKey,
} from './Model';

const PlotAtom = atom<tModel>({
  chartRef: null,
  dataSeries: [],
  colours: ['red', 'green', 'blue', 'grey'],
  species: SpeciesMap,
  processedData: [],
  metric: MetricMap,
});

const store = getDefaultStore();

const plotObj = new ScatterPlotObj();

store.sub(PlotAtom, () => {
  const newState = store.get(PlotAtom);
  plotObj.update(newState);
});

function Controls() {
  const [plotData, setPlotData] = useAtom(PlotAtom);
  const { species, metric } = plotData;

  const updateSpecies = (value: tSpeciesKey) => {
    setPlotData((prev) => {
      const currFilter = prev.species;
      const currValue = currFilter.get(value);
      if (!currValue) throw new Error('Error updating species!');
      currFilter.set(value, {
        ...currValue,
        active: !currValue.active,
      });

      return {
        ...prev,
        species: rfdc()(currFilter),
      };
    });
  };

  const updateMetric = (value: tMetricKey) => {
    setPlotData((prev) => {
      const currFilter = prev.metric;
      const currValue = currFilter.get(value);
      if (!currValue) throw new Error('Error updating metric!');

      currFilter.set(value, {
        ...currValue,
        active: !currValue.active,
      });

      return {
        ...prev,
        metric: rfdc()(currFilter),
      };
    });
  };

  const isSpeciesEnabled = (value: tSpeciesKey) =>
    plotData.species.get(value)?.active ?? false;

  const isMetricEnabled = (value: tMetricKey) =>
    plotData.metric.get(value)?.active ?? false;

  return (
    <div>
      <div className="flex flex-row">
        <details className="dropdown">
          <summary className="btn m-1">Filter Species</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {Array.from(species.keys()).map((elem) => (
              <li key={elem}>
                <button type="button" onClick={() => updateSpecies(elem)}>
                  <span
                    className={cn('font-extralight', {
                      'font-semibold': isSpeciesEnabled(elem),
                    })}
                  >
                    {species.get(elem)?.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </details>
        <details className="dropdown">
          <summary className="btn m-1">Filter Metric</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {Array.from(metric.keys()).map((elem) => (
              <li key={elem}>
                <button type="button" onClick={() => updateMetric(elem)}>
                  <span
                    className={cn('font-extralight', {
                      'font-semibold': isMetricEnabled(elem),
                    })}
                  >
                    {metric.get(elem)?.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
}

function ScatterPlot() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [plotData, setPlotData] = useAtom(PlotAtom);
  const { dataSeries } = plotData;

  useEffect(() => {
    setPlotData({
      ...plotData,
      processedData: dataSeries,
    });
  }, [dataSeries]);

  useEffect(() => {
    setPlotData((prev) => ({
      ...prev,
      chartRef: ref.current,
    }));
  }, [ref.current]);

  useEffect(() => {
    async function loadData() {
      const csvresult: tCSVElement[] = await d3.csv(
        'assets/iris.csv',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (d: any) => ({
          sepalLength: +d.Sepal_Length,
          sepalWidth: +d.Sepal_Width,
          petalLength: +d.Petal_Length,
          petalWidth: +d.Petal_Width,
          species: d.Species as tSpeciesKey,
        })
      );

      setPlotData((prev) => ({
        ...prev,
        dataSeries: csvresult,
      }));
    }

    loadData().catch(console.error);
  }, []);

  return (
    <div>
      <span>Scatter Plot</span>
      <Controls />
      <div className="flex gap-4">
        <div className="w-[800px]" ref={ref} />
      </div>
    </div>
  );
}

export { ScatterPlot };
