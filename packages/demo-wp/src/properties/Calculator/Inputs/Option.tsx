/* eslint-disable react/require-default-props */
import { useState } from 'react';
import { CurrencyInput } from './Currency';
import { PercentInput } from './Percentage';
import { Toggle } from './Toggle';
import { tInputType } from '../../Lib/sharedTypes';
// import { eInputType } from '../../Lib/Model';

type tUpdateArgs = {
  inputType: tInputType;
  value: number;
};

type tOptionalArgs = {
  value?: number;
  placeholder?: string;
  onUpdate?: (arg: tUpdateArgs) => void;
  hovering?: boolean;
};

function defaultOnUpdate(arg: tUpdateArgs) {
  console.log('on update ', arg);
}

function Optional({
  value = 0,
  onUpdate = defaultOnUpdate,
  hovering = true,
}: tOptionalArgs) {
  const [index, setIndex] = useState<number>(0);

  const updateMode = () => {
    setIndex((curr) => (curr + 1) % 2);
    const type = index === 0 ? 'Percentage' : 'Currency';
    onUpdate({
      inputType: type,
      value,
    });
  };

  return (
    <span className="flex flex-row">
      {index === 0 && (
        <PercentInput
          value={value}
          placeholder="Enter percentage"
          onUpdate={(newPercentage) => {
            onUpdate({
              inputType: 'Percentage',
              value: newPercentage,
            });
          }}
        />
      )}
      {index === 1 && (
        <CurrencyInput
          value={value}
          placeholder="Enter amount"
          onUpdate={(newAmount) => {
            onUpdate({
              inputType: 'Currency',
              value: newAmount,
            });
          }}
        />
      )}
      {hovering && <Toggle onUpdate={updateMode} />}
    </span>
  );
}

export { Optional };
