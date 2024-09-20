import { useBoundStore } from '../../Model/Store';

function PropertyList() {
  const { properties } = useBoundStore();

  return (
    <div className="flex flex-col gap-2">
      {Array.from(properties).map(([key, _value]) => (
        <div key={key}>
          <button className="btn" type="button">
            {key}
          </button>
        </div>
      ))}
    </div>
  );
}

export { PropertyList };
