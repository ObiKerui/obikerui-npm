import { useAppProvider } from '../Provider/Provider';
import { Input } from './Input';

function PropertyFields() {
  const { controller } = useAppProvider();

  return (
    <table className="table">
      <tbody>
        <tr>
          <td>Property Value</td>
          <td>
            <Input
              placeholder="Value"
              onUpdate={(newPrice) => controller.updatePropertyPrice(newPrice)}
            />
          </td>
        </tr>
        <tr>
          <td>Deposit Amount</td>
          <td>
            <Input
              placeholder="Value"
              onUpdate={(newDeposit) => controller.updateDeposit(newDeposit)}
            />
          </td>
        </tr>
        <tr>
          <td>Stamp Duty</td>
          <td>
            <Input
              placeholder="Value"
              onUpdate={(newStamp) => controller.updateStampDuty(newStamp)}
            />
          </td>
        </tr>
        <tr>
          <td>Renovation Costs</td>
          <td>
            <Input
              placeholder="Value"
              onUpdate={(newReno) => controller.updateRenovations(newReno)}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function PropertySection() {
  return (
    <div className="bg-base-200 collapse">
      <input type="checkbox" className="peer" />
      <div className="collapse-title">Property Details</div>
      <div className="collapse-content">
        <PropertyFields />
      </div>
    </div>
  );
}

export { PropertySection };
