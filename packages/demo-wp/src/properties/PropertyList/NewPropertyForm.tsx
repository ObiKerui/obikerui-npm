import { ReactNode } from 'react';

type tInputProps = {
  render: () => ReactNode;
  id: string;
  placeholder?: string;
};

function Input({ render, id, placeholder }: tInputProps) {
  return (
    <div className="flex flex-row">
      <label
        htmlFor={id}
        className="form-control flex w-full max-w-xs justify-center"
      >
        {render()}
      </label>
      <input
        type="text"
        id={id}
        placeholder={placeholder}
        className="input input-sm w-full max-w-xs border-0 focus:outline-none focus:ring-0"
      />
    </div>
  );
}

Input.defaultProps = {
  placeholder: 'Enter Value',
};

function NewPropertyForm() {
  return (
    <div className="flex flex-col">
      <div className="divider m-1 h-1 p-0" />
      <Input
        id="property-name-number"
        render={() => <span> Name / Number</span>}
      />
      <div className="divider m-1 h-1 p-0" />
      <Input
        id="property-street"
        placeholder="Street"
        render={() => <span>Street</span>}
      />
      <div className="divider m-1 h-1 p-0" />
      <Input
        id="property-town"
        placeholder="Town"
        render={() => <span>Town</span>}
      />
      <div className="divider m-1 h-1 p-0" />
      <Input
        id="postcode"
        placeholder="postcode"
        render={() => <span>Postcode</span>}
      />
      <div className="divider m-1 h-1 p-0" />
    </div>
  );
}

export { NewPropertyForm };
