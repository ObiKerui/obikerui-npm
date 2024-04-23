import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calculator } from '../PropertyCalculator/Calculator';
import { Dashboard as ChartDashboard } from '../Charts/Dashboard';

function Dashboard() {
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
        This will be a property details or map?
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

export { Dashboard };
