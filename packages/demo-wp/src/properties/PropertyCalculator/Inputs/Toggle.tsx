import { useState } from 'react';

type tToggle = {
  label?: string;
  onUpdate?: () => void;
};

function defaultOnUpdate() {
  console.log('updated');
}

function Toggle({ label = '', onUpdate = defaultOnUpdate }: tToggle) {
  const [checked, setChecked] = useState<boolean>(false);
  return (
    <span className="form-control">
      <label htmlFor="switch" className="label cursor-pointer pb-0 pt-0">
        <span className="label-text">{label}</span>
        <input
          type="checkbox"
          className="toggle toggle-xs"
          checked={checked}
          onClick={() => setChecked((curr) => !curr)}
          onChange={() => onUpdate()}
        />
      </label>
    </span>
  );
}

export { Toggle };
