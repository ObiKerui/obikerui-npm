import { convertToCurrency, convertToPercentage } from '../Utils';
import { MortgageField } from './Fields/MortgageInput';
import { DepositField } from './Fields/DepositInput';
import { tPeriod, useBoundStore, useComputedState } from '../Model/Store';
import { InvestmentCtrl, InvestmentCtrlOld } from '../Model/Investment';
import { ExpenditureCtrl, ExpenditureCtrlOld } from '../Model/Expenditure';
import { IncomeCtrl, IncomeCtrlOld } from '../Model/Income';
import { MetricsCtrl, MetricsCtrlOld } from '../Model/Metrics';

import {
  tProperty,
  useBoundStore as useNewBoundStore,
  usePropertySelect,
} from '../Model/NewModel';
import { PropertyField } from './Fields/PropertyInput';
import MortgagePayments from './Fields/MortgagePayments';
import MaintenanceFees from './Fields/MaintenanceFees';
import ManagementFees from './Fields/ManagementFees';
import Bills from './Fields/Bills';
import RentalVoids from './Fields/RentalVoids';
import StampDuty from './Fields/StampDuty';
import LegalFees from './Fields/LegalFees';
import RenovationFees from './Fields/RenovationFees';
import RentalIncome from './Fields/RentalIncome';

const investmentCtrlOld = new InvestmentCtrlOld();
const expenditureCtrlOld = new ExpenditureCtrlOld();
const incomeCtrlOld = new IncomeCtrlOld();
const metricsCtrlOld = new MetricsCtrlOld();

const investmentCtrl = new InvestmentCtrl();
const expenditureCtrl = new ExpenditureCtrl();
const incomeCtrl = new IncomeCtrl();
const metricsCtrl = new MetricsCtrl();

useBoundStore.subscribe((state) => {
  investmentCtrlOld.update(state);
  expenditureCtrlOld.update(state);
  incomeCtrlOld.update(state);
  metricsCtrlOld.update(state);
});

useNewBoundStore.subscribe((state) => {
  const { currentProperty, properties, defaultProperty } = state;

  const property = currentProperty
    ? properties.get(currentProperty) ?? defaultProperty
    : defaultProperty;

  investmentCtrl.update(property);
  expenditureCtrl.update(property);
  incomeCtrl.update(property);
  metricsCtrl.update(property);
});

function Header() {
  return (
    <div className="grid w-full grid-cols-3">
      <div>&nbsp;</div>
      <div>Cost</div>
      <div>Profit</div>
    </div>
  );
}

const incomeOptionMap = new Map<string, string>([
  ['monthly', 'Monthly'],
  ['annual', 'Annual'],
]);

type tOnChangeDropdown = {
  onChange: (arg: 'monthly' | 'annual') => void;
};

function IncomeDropdown({ onChange }: tOnChangeDropdown) {
  const onChangeCB = (value: string | null) => {
    if (value) onChange(value as 'monthly' | 'annual');
  };

  return (
    <select
      className="select select-sm bg-opacity-0 pl-1 text-xs md:text-sm"
      onChange={(ev) =>
        onChangeCB(ev.target.selectedOptions[0].getAttribute('data-key'))
      }
    >
      {Array.from(incomeOptionMap).map(([key, value]) => (
        <option data-key={key} key={key}>
          {value}
        </option>
      ))}
    </select>
  );
}

function Calculator() {
  const yPadding = 'py-2';
  const totalInvestment = useComputedState((state) => state.totalInvestment);
  const monthlyExpenditure = useComputedState(
    (state) => state.monthlyExpenditure
  );
  const monthlyIncome = useComputedState((state) => state.monthlyIncome);

  const yieldValue = useComputedState((state) => state.yield);
  const netROI = useBoundStore((state) => state.netROI);

  // adding the new property model
  const properties = useNewBoundStore((state) => state.properties);
  const propertyKey = useNewBoundStore((state) => state.currentProperty);
  const setProperties = useNewBoundStore((state) => state.setProperties);
  const defaultProperty = useNewBoundStore((state) => state.defaultProperty);
  const setDefaultProperty = useNewBoundStore(
    (state) => state.setDefaultProperty
  );

  const setChangesMade = usePropertySelect((state) => state.setChangesMade);

  const property = propertyKey
    ? properties.get(propertyKey) ?? defaultProperty
    : defaultProperty;

  const income =
    property.incomePeriod === 'monthly' ? monthlyIncome : monthlyIncome * 12;

  const expenditure =
    property.incomePeriod === 'monthly'
      ? monthlyExpenditure
      : monthlyExpenditure * 12;

  const updateProperty = (prop: tProperty) => {
    console.log('update property: ', prop, propertyKey);

    setChangesMade(true);

    // we made a change to the property model
    // we need to show the save button so user can create a new snapshot

    // we either made the change to an existing snapshot (propertyKey !== null)
    // or we made a change to the default-snapshot

    // if we made a change to an existing snapshot - ?
    // if we made a change to the default-snapshot - ?

    if (propertyKey) {
      properties.set(propertyKey, prop);
      setProperties(properties);
    } else {
      setDefaultProperty(prop);
    }
  };

  const updateIncomePeriod = (period: tPeriod) => {
    property.incomePeriod = period;
    updateProperty({ ...property });
  };

  return (
    <div className="flex flex-col gap-1 pt-4">
      <div className="grid text-xs md:text-sm">
        <Header />
        <div className="divider m-0 h-1" />
        <div className={yPadding}>
          <PropertyField property={property} updateProperty={updateProperty} />
        </div>
        <div className="divider m-0 h-1" />
        <div className={yPadding}>
          <StampDuty property={property} updateProperty={updateProperty} />
        </div>
        <div className="divider m-0 h-1" />
        <div className={yPadding}>
          <DepositField property={property} updateProperty={updateProperty} />
        </div>
        <div className="divider m-0 h-1" />
        <div className={yPadding}>
          <MortgageField property={property} updateProperty={updateProperty} />
        </div>
        <div className="divider m-0 h-1" />
        <div className={yPadding}>
          <LegalFees property={property} updateProperty={updateProperty} />
        </div>
        <div className="divider m-0 h-1" />
        <div className={yPadding}>
          <RenovationFees property={property} updateProperty={updateProperty} />
        </div>
        <div className="divider m-0 h-1" />
        <div className="bg-base-200 grid grid-cols-3 items-center py-2 font-semibold">
          <div>Total Investment</div>
          <div>{convertToCurrency(totalInvestment)}</div>
          <div>&nbsp;</div>
        </div>
        <div className="divider m-0 h-1" />
        <MortgagePayments />
        <div className="divider m-0 h-1" />
        <MaintenanceFees property={property} updateProperty={updateProperty} />
        <div className="divider m-0 h-1" />
        <ManagementFees property={property} updateProperty={updateProperty} />
        <div className="divider m-0 h-1" />
        <Bills property={property} updateProperty={updateProperty} />
        <div className="divider m-0 h-1" />
        <RentalVoids property={property} updateProperty={updateProperty} />
        <div className="divider m-0 h-1" />
        <RentalIncome property={property} updateProperty={updateProperty} />
        <div className="divider m-0 h-1" />
        <div className="bg-base-200 grid grid-cols-3 items-center font-semibold">
          <div className="p-2 md:p-2">
            <IncomeDropdown onChange={(value) => updateIncomePeriod(value)} />
          </div>
          <div>{convertToCurrency(expenditure)}</div>
          <div>{convertToCurrency(income)}</div>

          <div>&nbsp;</div>
          <div>
            Balance {property.incomePeriod === 'monthly' ? '(PM)' : '(PA)'}{' '}
          </div>
          <div>{convertToCurrency(income - expenditure)}</div>

          <div>&nbsp;</div>
          <div>Yield</div>
          <div>{convertToPercentage(yieldValue ?? 0)}</div>

          <div>&nbsp;</div>
          <div>ROI</div>
          <div>{netROI}</div>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
