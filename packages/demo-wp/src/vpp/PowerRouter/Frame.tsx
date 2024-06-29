import { useEffect, useRef } from 'react';
import { useAppProvider } from '../Provider/Provider';

// type tPowerNode = {
//   label: string;
// };

// function PowerNode({ label }: tPowerNode) {
//   return <div className="p-4">{label}</div>;
// }

function PowerRouter() {
  const planRef = useRef<HTMLDivElement | null>(null);
  const { controller } = useAppProvider();
  // const styleBat = {
  //   bottom: '60%',
  //   left: '2%',
  // };

  // const stylePV = {
  //   bottom: '80%',
  //   left: '14%',
  // };

  // const styleInv = {
  //   bottom: '60%',
  //   left: '26%',
  // };

  useEffect(() => {
    if (planRef.current) {
      controller.setHTMLRef(planRef.current);
    }
  }, []);

  return (
    <div className="relative flex flex-row border border-blue-900">
      <div className="h-[700px] w-[700px] min-w-[700px]" ref={planRef} />
      {/* <div className="absolute bg-gray-400 text-white" style={styleBat}>
        <PowerNode label="Battery" />
      </div> */}
      {/* <div className="absolute bg-black text-white" style={stylePV}>
        <PowerNode label="PV" />
      </div> */}
      {/* <div className="absolute bg-black text-white" style={styleInv}>
        <PowerNode label="Inverter" />
      </div> */}
    </div>
  );
}

type tFrameParams = {
  checked: boolean;
};

function Frame({ checked }: tFrameParams) {
  return (
    <div>
      checked: {checked}
      <PowerRouter />
    </div>
  );
}

export default PowerRouter;

export { Frame };
