import { useAppProvider } from '../Provider/Provider';
import { Input } from './Input';

function RentalFields() {
  const { controller } = useAppProvider();
  return (
    <table className="table">
      <tbody>
        <tr>
          <td>Rental Income</td>
          <td>
            <Input
              placeholder="Value"
              onUpdate={(newValue) => controller.updateRentalIncome(newValue)}
            />
          </td>
        </tr>
        <tr>
          <td>Rental Voids</td>
          <td>
            <Input
              placeholder="Value"
              onUpdate={(newValue) => controller.updateRentalVoids(newValue)}
            />
          </td>
        </tr>
        <tr>
          <td>Gas & Electricity</td>
          <td>
            <Input
              placeholder="Value"
              onUpdate={(newValue) => controller.updateBills(newValue)}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function OtherFees() {
  const { controller } = useAppProvider();
  return (
    <table className="table">
      <tbody>
        <tr>
          <td>Management Fees</td>
          <td>
            <Input
              placeholder="Value"
              onUpdate={(newValue) => controller.updateManagementFees(newValue)}
            />
          </td>
        </tr>
        <tr>
          <td>Maintenance Costs</td>
          <td>
            <Input
              placeholder="Value"
              onUpdate={(newValue) => controller.updateMaintenance(newValue)}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function RentalSection() {
  return (
    <div className="bg-base-200 collapse">
      <input type="checkbox" className="peer" />
      <div className="collapse-title">Rental Details</div>
      <div className="collapse-content">
        <RentalFields />
        <OtherFees />
      </div>
    </div>
  );
}

export { RentalSection };
