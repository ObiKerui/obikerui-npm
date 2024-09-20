import { useSearchParams } from 'react-router-dom';
import { Dashboard as ChartDashboard } from '../Charts/Dashboard';
import { Calculator } from '../PropertyCalculator/Calculator';
import { PropertyMap } from './Roadmap';
import { MapBoxMap } from './Mapbox/Component';
import { SavePropertyButton } from '../PropertyList/SavePropertyButton';
import { NewPropertyForm } from '../PropertyList/NewPropertyForm';
import { GridPropertyForm } from '../PropertyList/GridPropertyForm';

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
        className="tab-content bg-base-100 border-base-300 rounded-box p-1 md:p-6"
      >
        <div className="flex flex-col p-4">
          <div>
            <PropertyMap checked={currTab === 'property'} />
          </div>
          <div>
            <span>Map Box Map</span>
            <MapBoxMap />
          </div>
        </div>
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
        className="tab-content bg-base-100 border-base-300 rounded-box p-0 md:p-6"
      >
        <div className="flex flex-col gap-2">
          <SavePropertyButton />
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

function PropertySidePanel() {
  return (
    <div className="w-full">
      <div role="tablist" className="tabs tabs-lifted">
        <input
          type="radio"
          name="right_tabs_2"
          role="tab"
          className="tab"
          aria-label="Create"
          checked
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        >
          <div className="h-[900px] w-full">
            <NewPropertyForm />
            <GridPropertyForm />
          </div>
        </div>
        {/* <input
        type="radio"
        name="right_tabs_3"
        role="tab"
        className="tab"
        aria-label="New"
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        <div className="bg-base-300 w-full">content</div>
      </div> */}
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="flex w-full min-w-full flex-row gap-1">
      <div className="flex w-full flex-row gap-2">
        <PropertyOptions />
        <PropertySidePanel />
      </div>
    </div>
  );
}

export { Dashboard };
