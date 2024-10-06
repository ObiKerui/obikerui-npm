import { useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faList,
  faMinus,
  faNoteSticky,
  faPenToSquare,
  faPlus,
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import { Dashboard as ChartDashboard } from '../Charts/Dashboard';
import { Collapsable } from '../Lib/Components/Collapsable';
import { PropertyList } from '../PropertyList/ListProperties';
import EditPropertyForm from '../PropertyList/EditPropertyForm';
import Calculator from '../Calculator/Calculator';

import {
  useBoundStore,
  usePropertySelect,
  defaultProperty,
} from '../Model/NewModel';
import { cn } from '../../Utils/CSS';
import SavePropertyForm from '../PropertyList/SavePropertyForm';

function PropertyCollectionControls() {
  const selectedKey = useBoundStore((state) => state.currentProperty);
  const setSelectedKey = useBoundStore((state) => state.setCurrentProperty);

  const properties = useBoundStore((state) => state.properties);
  console.log('show what the properties are now? ', properties);
  const currProp = selectedKey ? properties.get(selectedKey) ?? null : null;

  const changeMade = usePropertySelect((state) => state.changesMade);

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

  const showSavePropertyForm = usePropertySelect(
    (state) => state.showSavePropertyForm
  );

  const setShowSavePropertyForm = usePropertySelect(
    (state) => state.setShowSavePropertyForm
  );

  const setDefaultProperty = useBoundStore((state) => state.setDefaultProperty);

  const resetProperty = () => {
    if (changeMade) {
      // ask if save the current property
      console.log('ask do you want to save changes..');
    }
    setDefaultProperty({ ...defaultProperty });
    setSelectedKey(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-grow flex-row justify-between gap-2">
        <div className="flex flex-row justify-start gap-2">
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
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className={cn('btn btn-sm', {
              'btn-disabled': currProp === null,
            })}
            onClick={() => resetProperty()}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
            &nbsp; New
          </button>
          <button
            type="button"
            className={cn('btn btn-sm', {
              'btn-disabled': changeMade === false,
            })}
            onClick={() => setShowSavePropertyForm(!showSavePropertyForm)}
          >
            <FontAwesomeIcon icon={faSave} />
            &nbsp; Save
          </button>
        </div>
      </div>
      <Collapsable isOpen={showPropertyList}>
        <PropertyList />
      </Collapsable>

      <div>
        <Collapsable isOpen={showSavePropertyForm}>
          <SavePropertyForm />
        </Collapsable>
      </div>

      <div>
        <button
          type="button"
          className={cn('btn btn-sm', {
            'btn-active': showEditPropertyForm,
          })}
          onClick={() => setShowEditPropertyForm(!showEditPropertyForm)}
        >
          {selectedKey || 'Property Details'}
          {!showEditPropertyForm ? <FontAwesomeIcon icon={faPlus} /> : null}
        </button>
      </div>

      <div>
        <Collapsable isOpen={showEditPropertyForm}>
          <EditPropertyForm />
        </Collapsable>
      </div>
    </div>
  );
}

// function PropertyCollectionBody() {
//   const showPropertyList = usePropertySelect((state) => state.showPropertyList);
//   const showEditPropertyForm = usePropertySelect(
//     (state) => state.showEditPropertyForm
//   );

//   return (
//     <div>
//       <Collapsable isOpen={showEditPropertyForm}>
//         <div className="pb-4 font-semibold">Property Details</div>
//         <EditPropertyForm />
//       </Collapsable>
//       <Collapsable isOpen={showPropertyList}>
//         <PropertyList />
//       </Collapsable>
//     </div>
//   );
// }

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
          <PropertyCollectionControls />
          {/* <PropertyCollectionBody /> */}
          <Calculator />
        </div>
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
