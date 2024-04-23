import { useAppProvider } from '../Provider/Provider';
import { CurrencyInput } from './Inputs/Currency';

function RentalFields() {
  const { controller } = useAppProvider();
  return (
    <table className="table">
      <tbody>
        <tr>
          <td>Rental Income</td>
          <td>
            <CurrencyInput
              placeholder="Value"
              onUpdate={(newValue) => controller.updateRentalIncome(newValue)}
            />
          </td>
        </tr>
        <tr>
          <td>Rental Voids</td>
          <td>
            <CurrencyInput
              placeholder="Value"
              onUpdate={(newValue) => controller.updateRentalVoids(newValue)}
            />
          </td>
        </tr>
        <tr>
          <td>Gas & Electricity</td>
          <td>
            <CurrencyInput
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
            <CurrencyInput
              placeholder="Value"
              onUpdate={(newValue) => controller.updateManagementFees(newValue)}
            />
          </td>
        </tr>
        <tr>
          <td>Maintenance Costs</td>
          <td>
            <CurrencyInput
              placeholder="Value"
              onUpdate={(newValue) => controller.updateMaintenance(newValue)}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// function RentalSection() {
//   return (
//     <div className="bg-base-200 collapse">
//       <input type="checkbox" className="peer" />
//       <div className="collapse-title">Rental Details</div>
//       <div className="collapse-content">
//         <RentalFields />
//         <OtherFees />
//       </div>
//     </div>
//   );
// }

function RentalSection() {
  const { model, controller } = useAppProvider();
  const summaryData = controller.summary.getSummary(model);

  return (
    <div className="collapse">
      <input type="checkbox" className="peer" />
      <div className="collapse-title text-sm font-semibold">
        <table className="table">
          <tbody>
            <tr>
              <td>Rental</td>
              <td />
              <td />
            </tr>
          </tbody>
        </table>
      </div>
      <div className="collapse-content">
        <RentalFields />
        <OtherFees />
      </div>
      <div className="pl-4 pr-4">
        <table className="table text-sm font-semibold">
          <tbody>
            <tr>
              <td>Total</td>
              <td>{summaryData.totalInvestment}</td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { RentalSection };
