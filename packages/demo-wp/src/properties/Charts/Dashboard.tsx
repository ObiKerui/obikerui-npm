import { Controls } from './Controls';
// import { ChartDataProvider } from './Provider/Provider';
// import { LinePlotContainer } from './ROI/Chart';
import ROIComponent from './ROIComponent';

function Dashboard() {
  return (
    <div className="flex flex-col gap-2">
      <ROIComponent />
      <Controls />
    </div>
  );
}

export { Dashboard };
