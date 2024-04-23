// import { useAppProvider } from '../Provider/Provider';
// import { CurrencyInput } from './Inputs/Currency';

// function PropertyFields() {
//   const { model, controller } = useAppProvider();

//   return (
//     <table className="table">
//       <tbody>
//         <tr>
//           <td>Property Value</td>
//           <td>
//             <CurrencyInput
//               value={model.investment.propertyValue}
//               placeholder="Enter Property Price"
//               onUpdate={(newPrice) => controller.updatePropertyPrice(newPrice)}
//             />
//           </td>
//           <td />
//         </tr>
//         <tr>
//           <td>Deposit Amount</td>
//           <td>
//             <CurrencyInput
//               value={model.investment.depositAmount}
//               placeholder="Enter Deposit Amount"
//               onUpdate={(newDeposit) => controller.updateDeposit(newDeposit)}
//             />
//           </td>
//           <td />
//         </tr>
//         <tr>
//           <td>Stamp Duty</td>
//           <td>
//             <CurrencyInput
//               value={model.investment.stampDuty}
//               placeholder="Value"
//               onUpdate={(newStamp) => controller.updateStampDuty(newStamp)}
//             />
//           </td>
//           <td />
//         </tr>
//         <tr>
//           <td>Renovation Costs</td>
//           <td>
//             <CurrencyInput
//               value={model.investment.renovationCosts}
//               placeholder="Value"
//               onUpdate={(newReno) => controller.updateRenovations(newReno)}
//             />
//           </td>
//           <td />
//         </tr>
//       </tbody>
//     </table>
//   );
// }

// function PropertySection() {
//   const { model, controller } = useAppProvider();
//   const summaryData = controller.summary.getSummary(model);

//   return (
//     <div className="collapse">
//       <input type="checkbox" className="peer" />
//       <div className="collapse-title text-sm font-semibold">
//         <table className="table">
//           <tbody>
//             <tr>
//               <td>Initial Investment</td>
//               <td>I</td>
//               <td>J</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//       <div className="collapse-content">
//         <PropertyFields />
//       </div>
//       <div className="pl-4 pr-4">
//         <table className="table font-semibold">
//           <tbody>
//             <tr>
//               <td />
//               <td>{summaryData.totalInvestment}</td>
//               <td />
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export { PropertySection };
