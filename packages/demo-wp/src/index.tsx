import ReactDOM from 'react-dom/client';
import {
  Outlet,
  RouterProvider,
  createHashRouter,
  useSearchParams,
} from 'react-router-dom';
import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import ErrorPage from './ErrorPage';
import Sidebar from './Sidebar';
import './index.css';

import { BarPlot } from './plots/BarPlot/Component';

import { AnalemmaPlotContainer } from './solar/AnalemmaPlot2/AnalemmaPlot';
import { ShadePlotContainer } from './solar/ShadePlot/ShadePlot';

import { Dashboard as PropertyDashboard } from './properties/Dashboard/Dashboard';
import { AppProvider as PropertyProvider } from './properties/Provider/Provider';

import ThreeSolar from './solar/ThreeSolar';
import { AppProvider as ThreeSolarAppProvider } from './solar/ThreeSolar/Provider';

import { AppProvider as VPPAppProvider } from './vpp/Provider/Provider';

import './style.css';
import { HistPlot } from './plots/Histogram/Component';
import { GroupedBar } from './plots/GroupedBar/Component';
import { StackedPlot } from './plots/StackedBar/Component';
import { StackedArea } from './plots/StackedArea/Component';
import { ScatterPlot } from './plots/ScatterPlot/Component';
import { ZoomPlot } from './plots/ZoomPlot/Component';
import { Plot as GenericPlot } from './plots/Generic/Component';

import { LeafletMap } from './maps/LeafletMap/Component';
import { BasicMap } from './maps/BasicMap/Component';
import { DensityMap } from './maps/DensityMap/Component';

import { Dashboard as VPPDashboard } from './vpp/Dashboard/Dashboard';
import { HexbinMap } from './maps/HexbinMap/Component';

function Root() {
  const [searchParams, setSearchParams] = useSearchParams({
    theme: 'light',
  });

  const currTheme = searchParams.get('theme');

  const setTheme = () => {
    setSearchParams(
      (prev) => {
        prev.set('theme', currTheme === 'light' ? 'dark' : 'light');
        return prev;
      },
      {
        replace: true,
      }
    );
  };

  useEffect(() => {
    setSearchParams(
      (prev) => {
        prev.set('theme', 'light');
        return prev;
      },
      {
        replace: true,
      }
    );
  }, []);

  return (
    <div data-theme={currTheme} className="bg-base-200 mx-auto min-h-screen">
      <div className="flex flex-row flex-wrap py-4">
        <aside className="w-full px-2 sm:w-1/3 md:w-1/6">
          <div className="sticky top-0 w-full p-4">
            <div className="pb-4">
              <button
                type="button"
                className="btn btn-sm border-gray-600"
                onClick={() => setTheme()}
              >
                {currTheme === 'light' && <FontAwesomeIcon icon={faSun} />}
                {currTheme === 'dark' && <FontAwesomeIcon icon={faMoon} />}
              </button>
            </div>

            <Sidebar />
          </div>
        </aside>
        <main role="main" className="flex w-full px-2 pt-1 sm:w-2/3 md:w-5/6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Plots() {
  return (
    <div className="bg-base-100 p-4">
      <BarPlot />
      <ScatterPlot />
      <ZoomPlot />
      <HistPlot />
      <GroupedBar />
      <StackedPlot />
      <StackedArea />
      <GenericPlot />
    </div>
  );
}

function Maps() {
  return (
    <div>
      <LeafletMap />
      <BasicMap />
      <DensityMap />
      <HexbinMap />
    </div>
  );
}

function Solar() {
  return (
    <div>
      <ShadePlotContainer />
      <AnalemmaPlotContainer />
      {/* <RoofPlot /> */}
    </div>
  );
}

function ThreeSolarHolder() {
  return (
    <ThreeSolarAppProvider>
      <div>
        <ThreeSolar />
      </div>
    </ThreeSolarAppProvider>
  );
}

function Properties() {
  return (
    <PropertyProvider>
      <div>
        <PropertyDashboard />
      </div>
    </PropertyProvider>
  );
}

function VPP() {
  return (
    <VPPAppProvider>
      <div>
        <VPPDashboard />
      </div>
    </VPPAppProvider>
  );
}

const router = createHashRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/plots',
        element: <Plots />,
      },
      {
        path: '/maps',
        element: <Maps />,
      },
      {
        path: '/solar',
        element: <Solar />,
      },
      {
        path: '/three-solar',
        element: <ThreeSolarHolder />,
      },
      {
        path: '/properties',
        element: <Properties />,
      },
      {
        path: '/virtual-power-plant',
        element: <VPP />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
