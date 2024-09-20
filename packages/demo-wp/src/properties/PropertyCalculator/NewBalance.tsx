import { useState } from 'react';
import { CurrencyInput } from './Inputs/Currency';
import {
  calculateSDLTPct,
  convertToCurrency,
  convertToPercentage,
} from '../Utils';
import { SDTLInfo } from './Inputs/SDTLInfo';
import { PropertyField } from './PropertyInput';
import { MortgageField } from './MortgageInput';
import { DepositField } from './DepositInput';
import { useBoundStore, useComputedState } from '../Model/Store';
import { InvestmentCtrl } from '../Model/Investment';
import { ExpenditureCtrl } from '../Model/Expenditure';
import { IncomeCtrl } from '../Model/Income';
import { MetricsCtrl } from '../Model/Metrics';

const investmentCtrl = new InvestmentCtrl();
const expenditureCtrl = new ExpenditureCtrl();
const incomeCtrl = new IncomeCtrl();
const metricsCtrl = new MetricsCtrl();

useBoundStore.subscribe((state) => {
  investmentCtrl.update(state);
  expenditureCtrl.update(state);
  incomeCtrl.update(state);
  metricsCtrl.update(state);
});

function Header() {
  return (
    <thead>
      <tr>
        <th>&nbsp;</th>
        <th>Costi</th>
        <th>Profit</th>
      </tr>
    </thead>
  );
}

function StampDuty() {
  const propertyValue = useBoundStore((state) => state.propertyValue);
  const setStampDuty = useBoundStore((state) => state.setStampDuty);
  const isAdditionalProperty = useBoundStore(
    (state) => state.isAdditionalProperty
  );

  const compStampDuty = useComputedState((state) => state.stampDuty);

  const [, setMouseOverRow] = useState<string | null>(null);

  return (
    <tbody>
      <tr
        onMouseEnter={() => setMouseOverRow('stampduty')}
        onMouseLeave={() => setMouseOverRow(null)}
      >
        <td>Stamp Duty</td>
        <td className="flex flex-row items-center">
          <CurrencyInput
            value={compStampDuty}
            placeholder="Value"
            onUpdate={(newStamp) => setStampDuty(newStamp)}
          />
          <span className="font-light">
            <SDTLInfo
              rate={
                calculateSDLTPct(propertyValue ?? 0, isAdditionalProperty) *
                100.0
              }
            />
          </span>
        </td>
        <td>&nbsp;</td>
      </tr>
    </tbody>
  );
}

function Mortgage() {
  const setLegalFees = useBoundStore((state) => state.setLegalFees);
  const renovationFees = useBoundStore((state) => state.renovationFees);
  const setRenovationFees = useBoundStore((state) => state.setRenovationFees);

  return (
    <tbody>
      <MortgageField />
      <tr>
        <td>Legal Fees</td>
        <td>
          <CurrencyInput
            placeholder="Legal Fees"
            onUpdate={(newValue) => setLegalFees(newValue)}
          />
        </td>
      </tr>
      <tr>
        <td>Renovation Costs</td>
        <td>
          <CurrencyInput
            value={renovationFees}
            placeholder="Value"
            onUpdate={(newReno) => setRenovationFees(newReno)}
          />
        </td>
        <td>&nbsp;</td>
      </tr>
    </tbody>
  );
}

function MonthlyExpenditure() {
  const monthlyMortgagePayment = useComputedState(
    (state) => state.monthlyMortgagePayment
  );
  const setManagementFees = useBoundStore((state) => state.setManagementFees);
  const setMaintenanceFees = useBoundStore((state) => state.setMaintenanceFees);
  const setBills = useBoundStore((state) => state.setBills);
  const setRentalVoids = useBoundStore((state) => state.setRentalVoids);

  return (
    <tbody>
      <tr>
        <td>Mortgage Payment</td>
        <td>
          <CurrencyInput
            value={monthlyMortgagePayment}
            placeholder="Mortgage Payment"
            readonly
            // onUpdate={(newValue) => controller.updateMortgage(newValue)}
          />
        </td>
      </tr>
      <tr>
        <td>Management Fees</td>
        <td>
          <CurrencyInput
            placeholder="Enter Management Fees"
            onUpdate={(newValue) => setManagementFees(newValue)}
          />
        </td>
      </tr>
      <tr>
        <td>Maintenance</td>
        <td>
          <CurrencyInput
            placeholder="Enter Maintenance"
            onUpdate={(newValue) => setMaintenanceFees(newValue)}
          />
        </td>
      </tr>
      <tr>
        <td>Bills</td>
        <td>
          <CurrencyInput
            placeholder="Enter Bills"
            onUpdate={(newValue) => setBills(newValue)}
          />
        </td>
      </tr>
      <tr>
        <td>Rental Voids</td>
        <td>
          <CurrencyInput
            placeholder="Enter Rental Voids"
            onUpdate={(newValue) => setRentalVoids(newValue)}
          />
        </td>
      </tr>
      <tr>&nbsp;</tr>
    </tbody>
  );
}

function MonthlyProfit() {
  const setRentalIncome = useBoundStore((state) => state.setRentalIncome);

  return (
    <tbody>
      <tr>
        <td>Rental Income</td>
        <td>&nbsp;</td>
        <td>
          <CurrencyInput
            placeholder="Mortgage Payment"
            onUpdate={(newValue) => setRentalIncome(newValue)}
          />
        </td>
      </tr>
    </tbody>
  );
}

const incomeOptionMap = new Map<string, string>([
  ['monthly', 'Monthly Cost / Income'],
  ['annual', 'Annual Cost / Income'],
]);

type tOnChangeDropdown = {
  onChange: (arg: 'monthly' | 'annual') => void;
};

function IncomeDropdown({ onChange }: tOnChangeDropdown) {
  const onChangeCB = (value: string | null) => {
    if (value) onChange(value as 'monthly' | 'annual');
  };

  return (
    <div>
      <select
        className="select select-sm bg-opacity-0 pl-1 text-xs md:text-base"
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
    </div>
  );
}

function NewBalance() {
  const totalInvestment = useComputedState((state) => state.totalInvestment);
  const monthlyExpenditure = useComputedState(
    (state) => state.monthlyExpenditure
  );
  const monthlyIncome = useComputedState((state) => state.monthlyIncome);
  const incomePeriod = useBoundStore((state) => state.incomePeriod);
  const income =
    incomePeriod === 'monthly' ? monthlyIncome : monthlyIncome * 12;

  const expenditure =
    incomePeriod === 'monthly' ? monthlyExpenditure : monthlyExpenditure * 12;

  const yieldValue = useComputedState((state) => state.yield);
  const netROI = useBoundStore((state) => state.netROI);

  const setIncomePeriod = useBoundStore((state) => state.setIncomePeriod);

  return (
    <table className="table text-xs md:text-base">
      <Header />
      <PropertyField />
      <StampDuty />
      <DepositField />
      <Mortgage />
      <tbody className="bg-base-200 font-semibold">
        <tr>
          <td>Total Investment</td>
          <td>{convertToCurrency(totalInvestment)}</td>
          <td>&nbsp;</td>
        </tr>
      </tbody>
      <MonthlyExpenditure />
      <MonthlyProfit />
      <tbody className="font-semibold">
        <tr className="bg-base-200">
          <td className="p-2 md:p-2">
            <IncomeDropdown onChange={(value) => setIncomePeriod(value)} />
          </td>
          <td>{convertToCurrency(expenditure)}</td>
          <td>{convertToCurrency(income)}</td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td>{incomePeriod === 'monthly' ? 'Monthly' : 'Annual'} Balance</td>
          <td>{convertToCurrency(income - expenditure)}</td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td>Yield</td>
          <td>{convertToPercentage(yieldValue ?? 0)}</td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td>ROI</td>
          <td>{netROI}</td>
        </tr>
      </tbody>
    </table>
  );
}

export { NewBalance };
