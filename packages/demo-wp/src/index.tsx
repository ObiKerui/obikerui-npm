import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createHashRouter, Outlet } from 'react-router-dom';
import { BarPlotContainer } from './BarPlot/BarPlot';
import { MapPlotContainer } from './MapPlot/MapPlot';
import { ShadePlotContainer } from './ShadePlot/ShadePlot';
import { AnalemmaPlotContainer } from './AnalemmaPlot/AnalemmaPlot';
import ErrorPage from './ErrorPage';
import { ScatterPlotContainer } from './ScatterPlot/ScatterPlot';
import Sidebar from './Sidebar';
import './index.css';
import './style.css';

function Root() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-row flex-wrap py-4">
        <aside className="w-full px-2 sm:w-1/3 md:w-1/4">
          <div className="sticky top-0 w-full p-4">
            <Sidebar />
          </div>
        </aside>
        <main role="main" className="w-full px-2 pt-1 sm:w-2/3 md:w-3/4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Plots() {
  return (
    <div>
      <BarPlotContainer />
      <ScatterPlotContainer />
    </div>
  );
}

function Maps() {
  return (
    <div>
      <MapPlotContainer />
    </div>
  );
}

function Solar() {
  return (
    <div>
      <ShadePlotContainer />
      <AnalemmaPlotContainer />
    </div>
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
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
