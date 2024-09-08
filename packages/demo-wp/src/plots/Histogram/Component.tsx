import { useRef, useEffect } from 'react';
import { atom, useAtom, getDefaultStore } from 'jotai';
import { Histogram } from './Plot';
import * as np from '../NumpyClone/numpy';
import { tModel } from './Model';

const PlotAtom = atom<tModel>({
  chartRef: null,
  xs: [],
  logMassA: [],
  logMassB: [],
  pdfNorm: [],
  colours: ['red', 'green', 'blue', 'grey'],
});

const store = getDefaultStore();

const plotObj = new Histogram();

store.sub(PlotAtom, () => {
  const newState = store.get(PlotAtom);
  plotObj.update(newState);
});

// function Controls() {
//   const [plotData, setPlotData] = useAtom(PlotAtom);
//   const { species, metric } = plotData;

//   const updateSpecies = (value: tSpeciesKey) => {
//     setPlotData((prev) => {
//       const currFilter = prev.species;
//       const currValue = currFilter.get(value);
//       if (!currValue) throw new Error('Error updating species!');
//       currFilter.set(value, {
//         ...currValue,
//         active: !currValue.active,
//       });

//       return {
//         ...prev,
//         species: rfdc()(currFilter),
//       };
//     });
//   };

//   const updateMetric = (value: tMetricKey) => {
//     setPlotData((prev) => {
//       const currFilter = prev.metric;
//       const currValue = currFilter.get(value);
//       if (!currValue) throw new Error('Error updating metric!');

//       currFilter.set(value, {
//         ...currValue,
//         active: !currValue.active,
//       });

//       return {
//         ...prev,
//         metric: rfdc()(currFilter),
//       };
//     });
//   };

//   const isSpeciesEnabled = (value: tSpeciesKey) =>
//     plotData.species.get(value)?.active ?? false;

//   const isMetricEnabled = (value: tMetricKey) =>
//     plotData.metric.get(value)?.active ?? false;

//   return (
//     <div>
//       <div className="flex flex-row">
//         <details className="dropdown">
//           <summary className="btn m-1">Filter Species</summary>
//           <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
//             {Array.from(species.keys()).map((elem) => (
//               <li key={elem}>
//                 <button type="button" onClick={() => updateSpecies(elem)}>
//                   <span
//                     className={cn('font-extralight', {
//                       'font-semibold': isSpeciesEnabled(elem),
//                     })}
//                   >
//                     {species.get(elem)?.label}
//                   </span>
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </details>
//         <details className="dropdown">
//           <summary className="btn m-1">Filter Metric</summary>
//           <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
//             {Array.from(metric.keys()).map((elem) => (
//               <li key={elem}>
//                 <button type="button" onClick={() => updateMetric(elem)}>
//                   <span
//                     className={cn('font-extralight', {
//                       'font-semibold': isMetricEnabled(elem),
//                     })}
//                   >
//                     {metric.get(elem)?.label}
//                   </span>
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </details>
//       </div>
//     </div>
//   );
// }

function HistPlot() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [, setPlotData] = useAtom(PlotAtom);

  useEffect(() => {
    setPlotData((prev) => ({
      ...prev,
      chartRef: ref.current,
    }));
  }, [ref.current]);

  useEffect(() => {
    const logMassA = np.randomNormal(0, 1, 10000);
    const logMassB = np.randomNormal(8, 2, 10000);

    const ms = np.linspace(-5, 20, 100);
    const mean = np.mean(logMassA) ?? 0;
    const std = np.std(logMassA) ?? 0;
    const pdfNorm = np.pdf(ms, mean, std);

    setPlotData((prev) => ({
      ...prev,
      xs: ms,
      logMassA,
      logMassB,
      pdfNorm,
    }));
  }, []);

  return (
    <div>
      <span>Histogram Plot</span>
      {/* <Controls /> */}
      <div className="flex gap-4">
        <div className="w-[800px]" ref={ref} />
      </div>
    </div>
  );
}

export { HistPlot };
