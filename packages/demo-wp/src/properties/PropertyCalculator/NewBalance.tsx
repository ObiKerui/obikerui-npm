import { useState } from 'react';
import { useAppProvider } from '../Provider/Provider';
import { CurrencyInput } from './Inputs/Currency';
// import { Optional } from './Inputs/Option';
import {
  calculateSDLTPct,
  convertToCurrency,
  convertToPercentage,
} from '../Utils';
import { SDTLInfo } from './Inputs/SDTLInfo';
// import { tUpdateDepositArgs } from '../Provider/Controllers/Deposit';
import { PropertyField } from './PropertyInput';
import { MortgageField } from './MortgageInput';
import { DepositField } from './DepositInput';

function Investment() {
  const { model, controller } = useAppProvider();
  const [mouseOverRow, setMouseOverRow] = useState<string | null>(null);

  return (
    <tbody>
      <PropertyField />
      <tr
        onMouseEnter={() => setMouseOverRow('stampduty')}
        onMouseLeave={() => setMouseOverRow(null)}
      >
        <td>Stamp Duty</td>
        <td className="flex flex-row items-center">
          <CurrencyInput
            value={model.investment.stampDuty}
            placeholder="Value"
            onUpdate={(newStamp) => controller.updateStampDuty(newStamp)}
          />
          <span className="font-light">
            <SDTLInfo
              rate={
                calculateSDLTPct(
                  model.investment.propertyValue ?? 0,
                  model.investment.isAdditionalProperty
                ) * 100.0
              }
            />
          </span>
        </td>
        <td />
      </tr>
      <DepositField />
      {/* <tr
        onMouseEnter={() => setMouseOverRow('deposit')}
        onMouseLeave={() => setMouseOverRow(null)}
      >
        <td>Deposit Amount</td>
        <td className="flex flex-row items-center">
          <Optional
            value={model.investment.depositAmount}
            placeholder="Enter Deposit Amount"
            onUpdate={(deposit) =>
              controller.deposit.updateDeposit({
                inputType: deposit.inputType,
                currency: deposit.value,
                percentage: deposit.value,
              } as tUpdateDepositArgs)
            }
            hovering={mouseOverRow === 'deposit'}
          />
        </td>
        <td />
      </tr> */}
    </tbody>
  );
}

function Mortgage() {
  const { model, controller } = useAppProvider();
  return (
    <tbody>
      <MortgageField />
      <tr>
        <td>Legal Fees</td>
        <td>
          <CurrencyInput
            placeholder="Legal Fees"
            onUpdate={(newValue) => controller.updateLegalFees(newValue)}
          />
        </td>
      </tr>
      <tr>
        <td>Renovation Costs</td>
        <td>
          <CurrencyInput
            value={model.investment.renovationCosts}
            placeholder="Value"
            onUpdate={(newReno) => controller.updateRenovations(newReno)}
          />
        </td>
        <td />
      </tr>
    </tbody>
  );
}

function MonthlyExpenditure() {
  const { model, controller } = useAppProvider();
  return (
    <tbody>
      <tr>
        <td>Mortgage Payment</td>
        <td>
          <CurrencyInput
            value={model.monthlyExpenses.mortgage}
            placeholder="Mortgage Payment"
            // onUpdate={(newValue) => controller.updateMortgage(newValue)}
          />
        </td>
      </tr>
      <tr>
        <td>Management Fees</td>
        <td>
          <CurrencyInput
            placeholder="Enter Management Fees"
            onUpdate={(newValue) => controller.updateManagementFees(newValue)}
          />
        </td>
      </tr>
      <tr>
        <td>Maintenance</td>
        <td>
          <CurrencyInput
            placeholder="Enter Maintenance"
            onUpdate={(newValue) => controller.updateMaintenance(newValue)}
          />
        </td>
      </tr>
      <tr>
        <td>Bills</td>
        <td>
          <CurrencyInput
            placeholder="Enter Bills"
            onUpdate={(newValue) => controller.updateBills(newValue)}
          />
        </td>
      </tr>
      <tr>
        <td>Rental Voids</td>
        <td>
          <CurrencyInput
            placeholder="Enter Rental Voids"
            onUpdate={(newValue) => controller.updateRentalVoids(newValue)}
          />
        </td>
      </tr>
    </tbody>
  );
}

function MonthlyProfit() {
  const { controller } = useAppProvider();
  return (
    <tbody>
      <tr>
        <td>Rent</td>
        <td />
        <td>
          <CurrencyInput
            placeholder="Mortgage Payment"
            onUpdate={(newValue) => controller.updateRentalIncome(newValue)}
          />
        </td>
      </tr>
    </tbody>
  );
}

function Header() {
  return (
    <thead>
      <tr>
        <td />
        <td>Cost</td>
        <td>Profit</td>
      </tr>
    </thead>
  );
}

function NewBalance() {
  const { model, controller } = useAppProvider();
  const summaryData = controller.summary.getSummary(model);

  return (
    <table className="table">
      <Header />
      <Investment />
      <Mortgage />
      <tbody className="bg-base-200 font-semibold">
        <tr>
          <td>Total Investment</td>
          <td>{convertToCurrency(summaryData.totalInvestment)}</td>
          <td />
        </tr>
      </tbody>
      <MonthlyExpenditure />
      <tbody className="bg-base-200 font-semibold">
        <tr>
          <td>Monthly Expenditure</td>
          <td>{convertToCurrency(summaryData.totalMonthlyExpenditure)}</td>
          <td />
        </tr>
      </tbody>
      <MonthlyProfit />
      <tbody className="font-semibold">
        <tr className="bg-base-200">
          <td>Monthly Income</td>
          <td />
          <td>{convertToCurrency(summaryData.totalMonthlyProfit)}</td>
        </tr>
        <tr>
          <td />
          <td>Annual Cost</td>
          <td>{convertToCurrency(model.cashflow.annualCost)}</td>
        </tr>
        <tr>
          <td />
          <td>Annual Profit</td>
          <td>{convertToCurrency(model.cashflow.annualProfit)}</td>
        </tr>
        <tr>
          <td />
          <td>Balance</td>
          <td>
            {convertToCurrency(
              model.cashflow.annualProfit - model.cashflow.annualCost
            )}
          </td>
        </tr>
        <tr>
          <td />
          <td>Yield</td>
          <td>{convertToPercentage(model.yields.net ?? 0)}</td>
        </tr>
        <tr>
          <td />
          <td>ROI</td>
          <td>{model.roi.net}</td>
        </tr>
      </tbody>
    </table>
  );
}

export { NewBalance };
