import { useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faSave } from '@fortawesome/free-solid-svg-icons';
import { Dashboard as ChartDashboard } from '../Charts/Dashboard';
import { Calculator } from '../PropertyCalculator/Calculator';
import { SavePropertyButton } from '../PropertyList/SavePropertyButton';
import NewPropertyForm from '../PropertyList/NewPropertyForm';
import { Collapsable } from '../Lib/Components/Collapsable';
import { ListPropertyButton } from '../PropertyList/ListPropertyButton';
import { PropertyList } from '../PropertyList/ListProperties';
import EditPropertyForm from '../PropertyList/EditPropertyForm';

import { useBoundStore, usePropertySelect } from '../Model/NewModel';
import { cn } from '../../Utils/CSS';

function PropertyOptions() {
  const [searchParams, setSearchParams] = useSearchParams({
    tab: 'calculator',
  });

  const selectedKey = useBoundStore((state) => state.currentProperty);
  const properties = useBoundStore((state) => state.properties);
  const currProp = selectedKey ? properties.get(selectedKey) ?? null : null;

  const showNewPropertyForm = usePropertySelect(
    (state) => state.showNewPropertyForm
  );

  const setShowNewPropertyForm = usePropertySelect(
    (state) => state.setShowNewPropertyForm
  );

  const showPropertyList = usePropertySelect((state) => state.showPropertyList);

  const setShowPropertyList = usePropertySelect(
    (state) => state.setShowPropertyList
  );

  const showEditPropertyForm = usePropertySelect(
    (state) => state.showEditPropertyForm
  );

  const setShowEditPropertyForm = usePropertySelect(
    (state) => state.setShowEditPropertyForm
  );

  const currTab = searchParams.get('tab');

  return (
    <div role="tablist" className="tabs tabs-lifted">
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
        className="tab-content border-base-300 bg-base-100 rounded-box p-2 md:p-6"
      >
        <div className="flex min-h-[900px] min-w-[350px] max-w-[500px] flex-col gap-2">
          <div className="flex flex-row justify-between gap-1">
            <div className="flex items-center justify-start gap-2">
              {currProp && (
                <button
                  type="button"
                  className={cn('btn btn-sm', {
                    'btn-active': showEditPropertyForm,
                  })}
                  onClick={() => setShowEditPropertyForm(!showEditPropertyForm)}
                >
                  {currProp.addressLine1} {currProp.addressLine2}
                </button>
              )}
              <button
                type="button"
                className={cn('btn btn-sm', {
                  'btn-active': showPropertyList,
                })}
                onClick={() => setShowPropertyList(!showPropertyList)}
              >
                <FontAwesomeIcon icon={faList} />
              </button>
            </div>
            <button
              type="button"
              className={cn('btn btn-sm', {
                'btn-active': showNewPropertyForm,
              })}
              onClick={() => setShowNewPropertyForm(!showNewPropertyForm)}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
          <Collapsable isOpen={showNewPropertyForm}>
            <div className="pb-4 font-semibold">Property Details</div>
            <NewPropertyForm />
          </Collapsable>
          <Collapsable isOpen={showPropertyList}>
            <PropertyList />
          </Collapsable>
          <Collapsable isOpen={showEditPropertyForm}>
            <EditPropertyForm />
          </Collapsable>
          <Calculator />
        </div>
      </div>

      {/* <input
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
      </div> */}
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
          aria-label="ROI Chart"
          checked
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        >
          <div className="flex min-h-[900px] min-w-[350px] max-w-[500px]">
            <ChartDashboard />
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
        <div className="hidden md:block">
          <PropertySidePanel />
        </div>
      </div>
    </div>
  );
}

export { Dashboard };
