// import { useAppProvider } from '../Provider/Provider';
// import { CurrencyInput } from './Inputs/Currency';

// function Header() {
//   return (
//     <thead>
//       <tr>
//         <td>Item</td>
//         <td>Cost</td>
//         <td>Profit</td>
//       </tr>
//     </thead>
//   );
// }

// function BalanceSheet() {
//   const { model, controller } = useAppProvider();
//   const summaryData = controller.summary.getSummary(model);

//   return (
//     <div>
//       <table className="table">
//         <Header />
//         <tbody>
//           <tr>
//             <td>Property Value</td>
//             <td>
//               <CurrencyInput
//                 value={model.investment.propertyValue}
//                 onUpdate={(value) => controller.updatePropertyPrice(value)}
//               />
//             </td>
//             <td aria-label="empty" />
//           </tr>
//           <tr>
//             <td>Deposit</td>
//             <td>
//               <CurrencyInput
//                 value={model.investment.depositAmount}
//                 onUpdate={(value) => controller.updateDeposit(value)}
//               />
//             </td>
//             <td aria-label="empty" />
//           </tr>
//           <tr>
//             <td>Stamp Duty</td>
//             <td>
//               <CurrencyInput
//                 value={model.investment.stampDuty}
//                 onUpdate={(value) => controller.updateStampDuty(value)}
//               />
//             </td>
//             <td aria-label="empty" />
//           </tr>
//         </tbody>
//         <tbody>
//           <tr>
//             <td>Renovation</td>
//             <td>
//               <CurrencyInput
//                 value={model.investment.renovationCosts}
//                 onUpdate={(value) => controller.updateRenovations(value)}
//               />
//             </td>
//             <td aria-label="empty" />
//           </tr>
//           <tr>
//             <td>Mortgage Amount</td>
//             <td>
//               {' '}
//               <CurrencyInput
//                 value={model.investment.mortgageAmount}
//                 onUpdate={(value) => controller.updateMortgage(value)}
//               />
//             </td>
//             <td aria-label="empty" />
//           </tr>
//           <tr>
//             <td>Interest Rate</td>
//             <td>
//               {' '}
//               <CurrencyInput
//                 value={model.investment.interestRate}
//                 onUpdate={(value) => controller.updateInterestRate(value)}
//               />
//             </td>
//             <td aria-label="empty" />
//           </tr>
//           <tr>
//             <td>Legal Fees</td>
//             <td>
//               {' '}
//               <CurrencyInput
//                 value={model.investment.legalFees}
//                 onUpdate={(value) => controller.updateLegalFees(value)}
//               />
//             </td>
//             <td aria-label="empty" />
//           </tr>
//           <tr>
//             <td className="font-bold">Initial Investment</td>
//             <td className="font-bold">{summaryData.totalInvestment}</td>
//             <td aria-label="empty" />
//           </tr>
//           <tr>
//             <td>Mortgage Per Month</td>
//             <td>
//               {' '}
//               <CurrencyInput
//                 value={model.monthlyExpenses.mortgage}
//                 onUpdate={(value) => controller.updateMortgage(value)}
//               />
//             </td>
//             <td aria-label="empty" />
//           </tr>
//           <tr>
//             <td>Management Fees</td>
//             <td>{model.monthlyExpenses.management}</td>
//             <td aria-label="empty" />
//           </tr>
//           <tr>
//             <td>Maintanence Fees</td>
//             <td>{model.monthlyExpenses.maintenance}</td>
//             <td aria-label="empty" />
//           </tr>
//           <tr>
//             <td>Monthly Bills</td>
//             <td>{model.monthlyExpenses.bills}</td>
//             <td aria-label="empty" />
//           </tr>
//           <tr>
//             <td>Rental Voids</td>
//             <td>{model.monthlyExpenses.voids}</td>
//             <td aria-label="empty" />
//           </tr>
//           <tr>
//             <td className="font-bold">Monthly Expenditure</td>
//             <td className="font-bold">{summaryData.totalMonthlyExpenditure}</td>
//             <td aria-label="empty" />
//           </tr>
//           <tr>
//             <td>Rent</td>
//             <td aria-label="empty" />
//             <td>{model.monthlyIncome.rent}</td>
//           </tr>
//           <tr>
//             <td className="font-bold">Monthly Profit</td>
//             <td aria-label="empty" />
//             <td className="font-bold">{summaryData.totalMonthlyProfit}</td>
//           </tr>
//           <tr>
//             <td>Gross Yield</td>
//             <td aria-label="empty" />
//             <td>{model.yields.gross}</td>
//           </tr>
//           <tr>
//             <td className="font-bold">Net Yield</td>
//             <td aria-label="empty" />
//             <td className="font-bold">{model.yields.net}</td>
//           </tr>
//           <tr>
//             <td>Gross ROI</td>
//             <td aria-label="empty" />
//             <td>{model.yields.gross}</td>
//           </tr>
//           <tr>
//             <td className="font-bold">Net ROI</td>
//             <td aria-label="empty" />
//             <td className="font-bold">{model.yields.net}</td>
//           </tr>
//         </tbody>
//       </table>
//       <span>{JSON.stringify(model)}</span>;
//     </div>
//   );
// }

// export { BalanceSheet };
