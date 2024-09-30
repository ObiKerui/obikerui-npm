// import { useAppProvider } from '../Provider/Provider';
import { NewBalance } from './GridBalance';

// function Calculator() {
//   const { model } = useAppProvider();

//   return (
//     <div className="flex flex-col gap-1">
//       <PropertySection />
//       <MortgageSection />
//       <RentalSection />
//       <BalanceSheet />
//     </div>
//   );
// }

function Calculator() {
  // const { model } = useAppProvider();

  return (
    <div className="flex flex-col gap-1 pt-4">
      <NewBalance />
    </div>
  );
}

export { Calculator };
