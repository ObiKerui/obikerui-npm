import { useAppProvider } from '../Provider/Provider';
import { Input } from './Input';

function MortgageFields() {
  const { controller } = useAppProvider();
  return (
    <table className="table">
      <tbody>
        <tr>
          <td>Mortgage Amount</td>
          <td>
            <Input
              placeholder="Mortgage Amount"
              onUpdate={(newValue) => controller.updateMortgage(newValue)}
            />
          </td>
        </tr>
        <tr>
          <td>Interest Rate</td>
          <td>
            <Input
              placeholder="Interest Rate"
              onUpdate={(newValue) => controller.updateInterestRate(newValue)}
            />
          </td>
        </tr>
        <tr>
          <td>Legal Fees</td>
          <td>
            <Input
              placeholder="Legal Fees"
              onUpdate={(newValue) => controller.updateLegalFees(newValue)}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function MortgageSection() {
  return (
    <div className="bg-base-200 collapse">
      <input type="checkbox" className="peer" />
      <div className="collapse-title">Mortgage Details</div>
      <div className="collapse-content">
        <MortgageFields />
      </div>
    </div>
  );
}

export { MortgageSection };
