import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createHashRouter, Outlet } from 'react-router-dom';
import { BarPlotContainer } from './BarPlot/BarPlot';
import { MapPlotContainer } from './MapPlot/MapPlot';
import { ShadePlotContainer } from './ShadePlot/ShadePlot';
import ErrorPage from './ErrorPage';
import { ScatterPlotContainer } from './ScatterPlot/ScatterPlot';
import Sidebar from './Sidebar';
import './index.css';

function Root() {
  return (
    <div>
      <aside>
        <Sidebar />
      </aside>
      <main>
        <Outlet />
      </main>
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
