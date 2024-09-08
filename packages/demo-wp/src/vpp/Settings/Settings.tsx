import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { usePowerRouter } from '../Solax/Store';
import { useChart, tReading } from './Model';
import { Chart as LineChart } from './Chart';

type tOctoData = {
  count: number;
  next: string;
  previous: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  results: any[];
};

const chart = new LineChart();

useChart.subscribe((newState) => {
  chart.update(newState);
});

async function loadData() {
  const response = await d3.json<tOctoData>(
    'assets/PowerRouter/octopusData.json'
  );
  const mapped = response?.results.map(
    (elem) =>
      ({
        valueExcVat: +elem.value_exc_vat,
        valueIncVat: +elem.value_inc_vat,
        validFrom: elem.valid_from,
        validTo: elem.valid_to,
        paymentMethod: elem.payment_method,
      } as tReading)
  );
  return mapped ?? [];
}

function TariffChart() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const jsonData = useChart((state) => state.jsonData);
  const setContainer = useChart((state) => state.setLineContainer);
  const setJsonData = useChart((state) => state.setJsonData);
  const setProcessedData = useChart((state) => state.setProcessedData);

  useEffect(() => {
    setContainer(chartRef.current);
  }, []);

  useEffect(() => {
    loadData()
      .then((data) => setJsonData(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const processed = jsonData;
    setProcessedData(processed);
  }, [jsonData]);

  return (
    <div>
      <div>
        <span>
          <h1 className="py-2 font-bold">Octopus Agile Rates</h1>
        </span>
      </div>
      <div ref={chartRef} />
    </div>
  );
}

type tFeedInTariffProps = {
  inputID: string;
  description: string;
  placeholder: string;
  onChange: (arg: React.ChangeEvent<HTMLInputElement>) => void;
  currValue: string;
};

function FeedInTariffInput({
  inputID,
  description,
  placeholder,
  onChange,
  currValue,
}: tFeedInTariffProps) {
  return (
    <div className="flex flex-row">
      <label
        htmlFor={`tariff-input-${inputID}`}
        className="input input-bordered flex w-full items-center gap-2"
      >
        {description}
        <input
          id={`tariff-input-${inputID}`}
          type="text"
          className="grow"
          placeholder={placeholder}
          onChange={onChange}
          value={currValue}
        />
      </label>
    </div>
  );
}

function TariffInputs() {
  const { financial } = usePowerRouter();
  const tariffIdPeak = '1';
  const tariffIdOffPeak = '2';
  const tariffs = [tariffIdPeak, tariffIdOffPeak];
  const tariffDescs = ['Peak Tariff', 'Off Peak Tariff'];

  const onChange = (
    tariffID: string,
    arg: React.ChangeEvent<HTMLInputElement>
  ) => {
    const idx = +tariffID;
    const currencyValue = +arg.target.value;
    const tariff = financial.tariffs[0];
    if (tariff) tariff.price = currencyValue;
    financial.tariffs[0] = tariff;
  };

  return (
    <div className="flex w-full flex-col gap-2">
      {tariffs.map((tariff, ith) => (
        <div key={tariff[0]}>
          <FeedInTariffInput
            inputID={tariff[0]}
            key={tariff[0]}
            description={tariffDescs[ith]}
            placeholder="Enter rate"
            onChange={(arg) => onChange(tariff[0], arg)}
            currValue={`${financial.tariffs[ith]?.price ?? ''}`}
          />
        </div>
      ))}

      <div className="flex flex-row">
        <label
          htmlFor="feedin-tariff-input"
          className="input input-bordered flex w-full items-center gap-2"
        >
          Feed In Tariff
          <input
            id="feedin-tariff-input"
            type="text"
            className="grow"
            placeholder="Enter rate"
          />
        </label>
      </div>
    </div>
  );
}

function Settings() {
  return (
    <div>
      <TariffInputs />
      <TariffChart />
    </div>
  );
}

export { Settings };
