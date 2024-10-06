/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-len */
import { useEffect, useState } from 'react';

type tPercentInput = {
  value?: number;
  placeholder?: string;
  onUpdate?: (arg: number) => void;
};

function defaultOnUpdate(arg: number) {
  console.log('percent entered: ', arg);
}

function convertValue(arg: string) {
  return `${arg}%`;
}

function PercentInput({
  value = 0,
  placeholder = 'Enter percentage',
  onUpdate = defaultOnUpdate,
}: tPercentInput) {
  const [inputValue, setInputValue] = useState<number>(value);
  const [displayValue, setDisplayValue] = useState<string>('');

  useEffect(() => {
    setInputValue(value);
    setDisplayValue(convertValue(`${value}`));
  }, [value]);

  const handleBlur = () => {
    const pctVal = convertValue(`${inputValue}`);
    setDisplayValue(pctVal);
    onUpdate(inputValue);
  };

  const handleChange = (val: string) => {
    setInputValue(+val);
    setDisplayValue(val);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFocus = (event: any) => {
    setDisplayValue((prev) => `${prev}`);
    event.target.select();
  };

  return (
    <label className="flex h-4 items-center rounded-none pl-0 pr-0 focus:border-teal-50 focus:outline-dashed focus:ring-0">
      <input
        type="text"
        className="h-5 w-full max-w-xs pl-0  focus:border-teal-50 focus:outline-none"
        placeholder={placeholder}
        value={displayValue}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
    </label>
  );
}

export { PercentInput };
