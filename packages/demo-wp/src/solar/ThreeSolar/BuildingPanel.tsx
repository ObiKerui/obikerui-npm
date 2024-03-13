import { useAppProvider } from './Provider';

function BuildingPanel() {
  const { addBuilding, addDormer } = useAppProvider();

  return (
    <div className="flex flex-col space-y-1">
      <button
        type="button"
        className="bg-slate-400 p-2"
        onClick={() => addBuilding()}
      >
        Add
      </button>
      <button
        type="button"
        className="bg-slate-400 p-2"
        onClick={() => addDormer()}
      >
        Dorm
      </button>
    </div>
  );
}

export default BuildingPanel;
