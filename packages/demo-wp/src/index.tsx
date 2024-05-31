import React from 'react';
import ReactDOM from 'react-dom/client';
import { Outlet, RouterProvider, createHashRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ErrorPage from './ErrorPage';
import Sidebar from './Sidebar';
import './index.css';
import { MapPlotContainer } from './maps/MapPlot/MapPlot';
import { BarPlotContainer } from './plots/BarPlot/BarPlot';
import DynamicPlotContainer from './plots/LinePlot/DynamicPlot';
import { LinePlotContainer } from './plots/LinePlot/LinePlot';
import { LinePlotContainerB } from './plots/LinePlot/LinePlotB';
import { ScatterPlotContainer } from './plots/ScatterPlot/ScatterPlot';
// import { AnalemmaPlotContainer } from './solar/AnalemmaPlot/AnalemmaPlot';
import { AnalemmaPlotContainer } from './solar/AnalemmaPlot2/AnalemmaPlot';
import { ShadePlotContainer } from './solar/ShadePlot/ShadePlot';
import RoofPlot from './solar/RoofPlanner/RootPlot';

import { Dashboard as PropertyDashboard } from './properties/Dashboard/Dashboard';
import { AppProvider as PropertyProvider } from './properties/Provider/Provider';

import ThreeSolar from './solar/ThreeSolar';
import { AppProvider } from './solar/ThreeSolar/Provider';

import { AppProvider as VPPAppProvider } from './vpp/Provider/Provider';

import './style.css';
import { Histogram } from './plots/Histogram/Component';
import { GroupedBar } from './plots/GroupedBar/Component';
import { LeafletMap } from './maps/LeafletMap/Component';
import { DensityMap } from './maps/DensityMap/Component';
import { Dashboard as VPPDashboard } from './vpp/Dashboard/Dashboard';

function Root() {
  return (
    <div className="bg-base-200 mx-auto min-h-screen">
      <div className="flex flex-row flex-wrap py-4">
        <aside className="w-full px-2 sm:w-1/3 md:w-1/6">
          <div className="sticky top-0 w-full p-4">
            <Sidebar />
          </div>
        </aside>
        <main role="main" className="w-full px-2 pt-1 sm:w-2/3 md:w-5/6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Plots() {
  return (
    <div className="bg-base-100 p-4">
      <BarPlotContainer />
      <ScatterPlotContainer />
      <LinePlotContainer />
      <LinePlotContainerB />
      <DynamicPlotContainer />
      <Histogram />
      <GroupedBar />
    </div>
  );
}

function Maps() {
  return (
    <div>
      {/* <MapPlotContainer /> */}
      <LeafletMap />
      <DensityMap />
    </div>
  );
}

function Solar() {
  return (
    <div>
      <ShadePlotContainer />
      <AnalemmaPlotContainer />
      <RoofPlot />
    </div>
  );
}

function ThreeSolarHolder() {
  return (
    <AppProvider>
      <div>
        <ThreeSolar />
      </div>
    </AppProvider>
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

const clientId =
  '506002570270-6cqvj29r485c5b38f10fbutnnmviohs5.apps.googleusercontent.com';

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
