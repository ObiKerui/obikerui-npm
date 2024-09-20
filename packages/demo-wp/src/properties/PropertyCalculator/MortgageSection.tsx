import { useBoundStore, useComputedState } from '../Model/Store';
import { useAppProvider } from '../Provider/Provider';
import { CurrencyInput } from './Inputs/Currency';

function MortgageFields() {
  // const { controller } = useAppProvider();
  const mortgageAmount = useComputedState((state) => state.mortgageAmount);
  const setMortgagePayment = useBoundStore((state) => state.setMortgagePayment);
  const setInterestRate = useBoundStore((state) => state.setInterestRate);
  const setLegalFees = useBoundStore((state) => state.setLegalFees);

  return (
    <table className="table">
      <tbody>
        <tr>
          <td>Mortgage Amount</td>
          <td>
            <CurrencyInput
              placeholder="Mortgage Amount"
              onUpdate={(newValue) => setMortgagePayment(newValue)}
            />
          </td>
        </tr>
        <tr>
          <td>Interest Rate</td>
          <td>
            <CurrencyInput
              placeholder="Interest Rate"
              onUpdate={(newValue) => setInterestRate(newValue)}
            />
          </td>
        </tr>
        <tr>
          <td>Legal Fees</td>
          <td>
            <CurrencyInput
              placeholder="Legal Fees"
              onUpdate={(newValue) => setLegalFees(newValue)}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// function MortgageSection() {
//   return (
//     <div className="bg-base-200 collapse">
//       <input type="checkbox" className="peer" />
//       <div className="collapse-title">Mortgage Details</div>
//       <div className="collapse-content">
//         <MortgageFields />
//       </div>
//     </div>
//   );
// }

function MortgageSection() {
  const { model, controller } = useAppProvider();
  const summaryData = controller.summary.getSummary(model);

  return (
    <div className="collapse">
      <input type="checkbox" className="peer" />
      <div className="collapse-title text-sm font-semibold">
        <table className="table">
          <tbody>
            <tr>
              <td>Mortgage Details</td>
              <td />
              <td />
            </tr>
          </tbody>
        </table>
      </div>
      <div className="collapse-content">
        <MortgageFields />
      </div>
      <div className="pl-4 pr-4">
        <table className="table text-sm font-semibold">
          <tbody>
            <tr>
              <td />
              <td>{summaryData.totalInvestment}</td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { MortgageSection };
