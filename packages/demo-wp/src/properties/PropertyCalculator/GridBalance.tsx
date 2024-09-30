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
    <div className="grid w-full grid-cols-3">
      <div>&nbsp;</div>
      <div>Cost</div>
      <div>Profit</div>
    </div>
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
    <div
      className="grid grid-cols-3"
      onMouseEnter={() => setMouseOverRow('stampduty')}
      onMouseLeave={() => setMouseOverRow(null)}
    >
      <div>Stamp Duty</div>
      <div className="flex flex-row items-center">
        <CurrencyInput
          value={compStampDuty}
          placeholder="Value"
          onUpdate={(newStamp) => setStampDuty(newStamp)}
        />
        <span className="font-light">
          <SDTLInfo
            rate={
              calculateSDLTPct(propertyValue ?? 0, isAdditionalProperty) * 100.0
            }
          />
        </span>
      </div>
      <div>&nbsp;</div>
    </div>
  );
}

function LegalFees() {
  const setLegalFees = useBoundStore((state) => state.setLegalFees);
  return (
    <div className="grid grid-cols-3">
      <div>Legal Fees</div>
      <div>
        <CurrencyInput
          placeholder="Legal Fees"
          onUpdate={(newValue) => setLegalFees(newValue)}
        />
      </div>
    </div>
  );
}

function RenovationFees() {
  const setRenovationFees = useBoundStore((state) => state.setRenovationFees);
  return (
    <div className="grid grid-cols-3">
      <div>Renovation Fees</div>
      <div>
        <CurrencyInput
          placeholder="Legal Fees"
          onUpdate={(newValue) => setRenovationFees(newValue)}
        />
      </div>
    </div>
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
    <>
      <div className="grid grid-cols-3 py-2">
        <div>Mortgage Payment</div>
        <div>
          <CurrencyInput
            value={monthlyMortgagePayment}
            placeholder="Mortgage Payment"
            readonly
            // onUpdate={(newValue) => controller.updateMortgage(newValue)}
          />
        </div>
        <div>&nbsp;</div>
      </div>
      <div className="divider m-0 h-1" />
      <div className="grid grid-cols-3 py-2">
        <div>Management Fees</div>
        <div>
          <CurrencyInput
            placeholder="Enter Management Fees"
            onUpdate={(newValue) => setManagementFees(newValue)}
          />
        </div>
        <div>&nbsp;</div>
      </div>
      <div className="divider m-0 h-1" />
      <div className="grid grid-cols-3 py-2">
        <div>Maintenance</div>
        <div>
          <CurrencyInput
            placeholder="Enter Maintenance"
            onUpdate={(newValue) => setMaintenanceFees(newValue)}
          />
        </div>
        <div>&nbsp;</div>
      </div>
      <div className="divider m-0 h-1" />
      <div className="grid grid-cols-3 py-2">
        <div>Bills</div>
        <div>
          <CurrencyInput
            placeholder="Enter Bills"
            onUpdate={(newValue) => setBills(newValue)}
          />
        </div>
        <div>&nbsp;</div>
      </div>
      <div className="divider m-0 h-1" />
      <div className="grid grid-cols-3 py-2">
        <div>Rental Voids</div>
        <div>
          <CurrencyInput
            placeholder="Enter Rental Voids"
            onUpdate={(newValue) => setRentalVoids(newValue)}
          />
        </div>
        <div>&nbsp;</div>
      </div>
      <div className="divider m-0 h-1" />
    </>
  );
}

function MonthlyProfit() {
  const setRentalIncome = useBoundStore((state) => state.setRentalIncome);

  return (
    <div className="grid grid-cols-3 py-2">
      <div>Rental Income</div>
      <div>&nbsp;</div>
      <div>
        <CurrencyInput
          placeholder="Mortgage Payment"
          onUpdate={(newValue) => setRentalIncome(newValue)}
        />
      </div>
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

function NewBalance() {
  const yPadding = 'py-2';
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
    <div className="grid text-xs md:text-sm">
      <Header />
      <div className="divider m-0 h-1" />
      <div className={yPadding}>
        <PropertyField />
      </div>
      <div className="divider m-0 h-1" />
      <div className={yPadding}>
        <StampDuty />
      </div>
      <div className="divider m-0 h-1" />
      <div className={yPadding}>
        <DepositField />
      </div>
      <div className="divider m-0 h-1" />
      <div className={yPadding}>
        <MortgageField />
      </div>
      <div className="divider m-0 h-1" />
      <div className={yPadding}>
        <LegalFees />
      </div>
      <div className="divider m-0 h-1" />
      <div className={yPadding}>
        <RenovationFees />
      </div>
      <div className="divider m-0 h-1" />
      <div className="bg-base-200 grid grid-cols-3 items-center py-2 font-semibold">
        <div>Total Investment</div>
        <div>{convertToCurrency(totalInvestment)}</div>
        <div>&nbsp;</div>
      </div>
      <div className="divider m-0 h-1" />
      <MonthlyExpenditure />
      <MonthlyProfit />
      <div className="bg-base-200 grid grid-cols-3 items-center font-semibold">
        <div className="p-2 md:p-2">
          <IncomeDropdown onChange={(value) => setIncomePeriod(value)} />
        </div>
        <div>{convertToCurrency(expenditure)}</div>
        <div>{convertToCurrency(income)}</div>

        <div>&nbsp;</div>
        <div>Balance {incomePeriod === 'monthly' ? '(PM)' : '(PA)'} </div>
        <div>{convertToCurrency(income - expenditure)}</div>

        <div>&nbsp;</div>
        <div>Yield</div>
        <div>{convertToPercentage(yieldValue ?? 0)}</div>

        <div>&nbsp;</div>
        <div>ROI</div>
        <div>{netROI}</div>
      </div>
    </div>
  );
}

export { NewBalance };
