/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-len */
import { useState } from 'react';
import Pound from './Pound';
import Percent from './Percent';
import { cn } from '../../Utils/CSS';

type tInput = {
  value?: string | null;
  placeholder: string;
  onUpdate?: (arg: number) => void;
};

function defaultOnUpdate(value: number) {
  console.log('on update: ', value);
}

function Input({
  value = null,
  placeholder,
  onUpdate = defaultOnUpdate,
}: tInput) {
  const [inputValue, setInputValue] = useState<null | string>(value);

  const handleBlur = () => {
    if (inputValue) {
      onUpdate(+inputValue);
    }
  };

  const handleFocus = () => {
    console.log('handle focus...');
  };

  return (
    <label className="input flex items-center">
      <Pound />
      <input
        type="text"
        className="input w-full max-w-xs p-1"
        placeholder={placeholder}
        value={inputValue ?? ''}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      <Percent />
    </label>
  );
}

type tCustomInput = {
  value?: number | null;
  placeholder?: string;
  onUpdate?: (arg: number) => void;
};

function CustomInput({
  value = null,
  placeholder = 'Enter value',
  onUpdate = defaultOnUpdate,
}: tCustomInput) {
  const [inputValue, setInputValue] = useState<null | number>(value);
  const [showDenom, setShowDenom] = useState<boolean>(false);

  const handleBlur = () => {
    if (inputValue) {
      setShowDenom(true);
      onUpdate(+inputValue);
    } else {
      setShowDenom(false);
    }
  };

  const handleFocus = () => {
    setShowDenom(false);
  };

  return (
    <label className="flex h-4 items-center rounded-none pl-0 pr-0 focus:border-teal-50 focus:outline-dashed focus:ring-0">
      <span className={cn('opacity-0', { 'opacity-100': showDenom })}>
        <Pound />
      </span>
      <input
        type="text"
        className="h-5 w-full max-w-xs pl-0  focus:border-teal-50 focus:outline-none"
        placeholder={placeholder}
        value={inputValue ?? ''}
        onChange={(e) => setInputValue(+e.target.value)}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      {/* <Percent /> */}
    </label>
  );
}

export { Input, CustomInput };
