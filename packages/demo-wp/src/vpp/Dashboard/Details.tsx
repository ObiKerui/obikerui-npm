import { useSearchParams } from 'react-router-dom';
import TimeControls from '../PowerDiagram/Controls/Time';
import VisibilityControls from '../PowerDiagram/Controls/Visibility';
import GridSummary from '../PowerDiagram/GridChart/GridSummary';
import { Inverter } from '../PowerDiagram/InverterData/Inverter';
import { ChartContainer as MergeChart } from '../PowerDiagram/MergedChart/ChartContainer';
import { ChartContainer as BatteryChart } from '../PowerDiagram/BatteryChart/ChartContainer';
import { ChartContainer as GridChart } from '../PowerDiagram/GridChart/ChartContainer';

function Details() {
  const [searchParams] = useSearchParams();

  const focus = searchParams.get('focus');

  return (
    <div className="flex flex-col gap-2">
      <div>
        <TimeControls />
      </div>
      <div className="flex flex-row gap-2">
        <MergeChart />
        <VisibilityControls />
      </div>
      {focus === 'battery' && (
        <div>
          <BatteryChart />
        </div>
      )}
      {focus === 'grid' && (
        <div>
          <GridChart />
          <GridSummary />
        </div>
      )}
      {focus === 'inverter' && (
        <div>
          <Inverter />
        </div>
      )}
    </div>
  );
}

export { Details };
