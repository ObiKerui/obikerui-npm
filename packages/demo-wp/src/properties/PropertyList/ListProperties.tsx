import { useEffect, useState } from 'react';
import { cn } from '../../Utils/CSS';
import { useBoundStore, usePropertySelect } from '../Model/NewModel';

/* eslint-disable jsx-a11y/label-has-associated-control */
type tInputProps = {
  id: string;
  placeholder?: string;
};

function Input({ id, placeholder }: tInputProps) {
  return (
    <input
      type="text"
      id={id}
      placeholder={placeholder}
      className="input input-sm w-full max-w-xs border-0 focus:outline-none focus:ring-0"
    />
  );
}

Input.defaultProps = {
  placeholder: 'Enter Value',
};

function ListControls() {
  const properties = useBoundStore((state) => state.properties);
  const selected = useBoundStore((state) => state.currentProperty);
  const setCurrentProperty = useBoundStore((state) => state.setCurrentProperty);
  const setProperties = useBoundStore((state) => state.setProperties);

  const [requestConfirm, setRequestConfirm] = useState<boolean>(false);

  const deleteProperty = () => {
    if (!selected) return;
    setRequestConfirm(false);
    properties.delete(selected);
    setProperties(properties);
    setCurrentProperty(null);
  };

  return (
    <div className="flex justify-end gap-2 py-1">
      <div
        className={cn('flex justify-end gap-2', {
          hidden: requestConfirm === true,
        })}
      >
        <button
          type="submit"
          className="btn btn-sm"
          onClick={() => setRequestConfirm(true)}
        >
          Delete
        </button>
      </div>
      <div
        className={cn('flex justify-end gap-2', {
          hidden: requestConfirm === false,
        })}
      >
        <span>Are you Sure?</span>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => deleteProperty()}
        >
          Yes
        </button>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => setRequestConfirm(false)}
        >
          No
        </button>
      </div>
    </div>
  );
}

type tGridRowProps = {
  children: React.ReactNode;
  className?: string | null;
};

function GridRow({ children, className }: tGridRowProps) {
  return (
    <div className="hover:cursor-pointer">
      <div className={cn('grid grid-cols-4 gap-y-1', className)}>
        {children}
      </div>
      <div className="divider m-0 h-1" />
    </div>
  );
}

GridRow.defaultProps = {
  className: null,
};

function Header() {
  return (
    <GridRow className="bg-base-200 font-semibold">
      <div className="col-span-2 flex h-full items-center py-1">
        <label htmlFor="address" className="items-center hover:cursor-pointer">
          Address
        </label>
      </div>
      <div className="flex h-full items-center">
        <label htmlFor="yield" className="items-center hover:cursor-pointer">
          Yield
        </label>
      </div>
      <div className="flex h-full items-center">
        <label
          htmlFor="dateAdded"
          className="items-center hover:cursor-pointer"
        >
          Date Added
        </label>
      </div>
    </GridRow>
  );
}

function PropertyList() {
  const properties = useBoundStore((state) => state.properties);
  const selected = useBoundStore((state) => state.currentProperty);
  const setSelected = useBoundStore((state) => state.setCurrentProperty);
  const propertySelected = usePropertySelect((state) => state.propertySelected);

  const onClickTableRow = (propertyKey: string) => {
    const currentlySelected = selected === propertyKey;
    const newKey = currentlySelected ? null : propertyKey;
    setSelected(newKey);
  };

  return (
    <div className="grid text-xs md:text-sm">
      <div className="divider m-0 h-1" />
      <Header />
      {Array.from(properties).map(([key, elem]) => (
        <button
          key={key}
          className={cn({
            'font-semibold': selected === key,
          })}
          type="button"
          onClick={() => onClickTableRow(key)}
        >
          <GridRow
            className={cn({
              'bg-base-300': key === propertySelected,
            })}
          >
            <div className="col-span-2 flex h-full items-center py-1">
              <label htmlFor="street" className="items-center">
                {elem.addressLine1} {elem.addressLine2}
              </label>
            </div>
            <div className="flex h-full items-center">
              <label htmlFor="street" className="items-center">
                {0}
              </label>
            </div>
            <div className="flex h-full items-center">
              <label htmlFor="street" className="items-center">
                {elem.dateAdded}
              </label>
            </div>
          </GridRow>
        </button>
      ))}
      <div
        className={cn('hidden', {
          block: selected !== null,
        })}
      >
        <ListControls />
      </div>
    </div>
  );
}

export { PropertyList };
