import { useSearchParams } from 'react-router-dom';
import { Dashboard as ChartDashboard } from '../Charts/Dashboard';
import { Calculator } from '../PropertyCalculator/Calculator';
import { PropertyMap } from './Roadmap';

function PropertyList() {
  return (
    <div className="flex flex-grow flex-col gap-1">
      <div className="">
        <span>Current Properties</span>
      </div>
      <div>
        <ul>
          <li>property 1</li>
          <li>property 2</li>
          <li>property 3</li>
        </ul>
      </div>
    </div>
  );
}

function PropertyOptions() {
  const [searchParams, setSearchParams] = useSearchParams({
    tab: 'calculator',
  });

  const currTab = searchParams.get('tab');

  return (
    <div role="tablist" className="tabs tabs-lifted">
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab"
        aria-label="Properties"
        onChange={() =>
          setSearchParams(
            (prev) => {
              prev.set('tab', 'property');
              return prev;
            },
            {
              replace: true,
            }
          )
        }
        checked={currTab === 'property'}
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        <PropertyMap checked={currTab === 'property'} />
      </div>

      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab"
        aria-label="Calculator"
        onChange={() =>
          setSearchParams(
            (prev) => {
              prev.set('tab', 'calculator');
              return prev;
            },
            {
              replace: true,
            }
          )
        }
        checked={currTab === 'calculator'}
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        <div>
          <Calculator />
        </div>
      </div>

      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab"
        aria-label="Charts"
        onChange={() =>
          setSearchParams(
            (prev) => {
              prev.set('tab', 'charts');
              return prev;
            },
            {
              replace: true,
            }
          )
        }
        checked={currTab === 'charts'}
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        <ChartDashboard />
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="flex min-w-full flex-row gap-1">
      <div className="flex flex-grow">
        <PropertyOptions />
      </div>
    </div>
  );
}

export { Dashboard };
