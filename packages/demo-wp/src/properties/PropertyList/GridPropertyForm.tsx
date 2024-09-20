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

function GridPropertyForm() {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="border-base-300 border">cell</div>
      <div className="border-base-300 col-span-2 border">cell</div>
      <div className="border-base-300 border">cell</div>
      <div className="border-base-300 col-span-2 border">cell</div>
    </div>
  );
}

export { GridPropertyForm };
