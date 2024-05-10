import { ChartDataProvider } from './Provider/Provider';
import { LinePlotContainer } from './ROI/Chart';

function Dashboard() {
  return (
    <ChartDataProvider>
      <LinePlotContainer />
    </ChartDataProvider>
  );
}

export { Dashboard };
