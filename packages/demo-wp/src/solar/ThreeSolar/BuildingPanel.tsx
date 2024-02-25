import { useAppProvider } from './Provider';

function BuildingPanel() {
  const { addBuilding } = useAppProvider();

  return (
    <div>
      <button
        type="button"
        className="bg-slate-400 p-2"
        onClick={() => addBuilding()}
      >
        Add
      </button>
    </div>
  );
}

export default BuildingPanel;
